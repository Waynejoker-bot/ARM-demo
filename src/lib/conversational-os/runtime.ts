import { randomUUID } from "node:crypto";

import { defaultThreadId } from "@/lib/conversational-os/seed";
import { generateConversationalAgentTurn } from "@/lib/conversational-os/model";
import {
  createConversationRepository,
  type ConversationThreadState,
} from "@/lib/conversational-os/persistence";
import type {
  ConversationDecisionCard,
  ConversationDelivery,
  ConversationDeliveryType,
  ConversationHandoff,
  ConversationMessage,
  ConversationThread,
} from "@/lib/conversational-os/types";

type ConversationRuntimeOptions = {
  dbPath?: string;
};

type SendConversationMessageInput = {
  threadId: string;
  actorId: string;
  actorName: string;
  body?: string;
  messageType?: "text" | "card" | "source_material";
  cardId?: string;
  sourceItems?: { kind: "meeting_summary" | "audio" | "screenshot" | "link"; title: string; detail?: string }[];
};

export type ConversationThreadPreview = {
  id: string;
  title: string;
  description: string;
  primaryRole: ConversationThread["primaryRole"];
  pinnedCard: ConversationDecisionCard | null;
  latestMessage: ConversationMessage | null;
  unreadCount: number;
};

export type ConversationThreadDetail = ConversationThreadState & {
  pinnedCard: ConversationDecisionCard | null;
  threadPreviews?: ConversationThreadPreview[];
};

type GeneratedTurnShape = {
  assistantMessage: string;
  shouldCreateCard: boolean;
  cardPayload: {
    title: string;
    summary: string;
    detail: string;
    trustNote: string;
    priorityRank: number;
    primaryAction: "confirm" | "report_upstream" | "approve" | "request_details";
    primaryActionLabel: string;
    sourceMeetingId: string | null;
    sourceDealId: string | null;
  } | null;
  shouldHandoff: boolean;
  handoffSummary: string | null;
};

type DeliveryPlan = {
  targetThreadId: string;
  deliveryType: ConversationDeliveryType;
  summary: string;
  sourceAckBody: string;
  targetSummaryBody: string;
  targetSummaryActorId: string;
  targetSummaryActorName: string;
  targetPrompt: string;
  tolerateModelFailure: boolean;
  sourceCardTitle: string | null;
  sourceCardSummary: string | null;
  sourceCardSourceMeetingId: string | null;
  sourceCardSourceDealId: string | null;
};

function nowIso() {
  return new Date().toISOString();
}

function createMessageId(prefix: string) {
  return `${prefix}-${randomUUID()}`;
}

function createCardId(threadId: string) {
  return `card-runtime-${threadId}-${randomUUID()}`;
}

function createDeliveryId() {
  return `delivery-runtime-${randomUUID()}`;
}

function createHandoffId() {
  return `handoff-runtime-${randomUUID()}`;
}

function getPrimaryAgentActor(thread: ConversationThread) {
  if (thread.threadType === "rep_private") {
    return {
      actorId: "agent-rep-bp",
      actorName: "一线销售 AgentBP",
      kind: "agent_reply" as const,
    };
  }

  if (thread.threadType === "manager_private") {
    return {
      actorId: "agent-manager-bp",
      actorName: "主管 AgentBP",
      kind: "agent_reply" as const,
    };
  }

  return {
    actorId: "agent-ceo-admin",
    actorName: "CEO Admin Agent",
    kind: "agent_reply" as const,
  };
}

function getThreadHumanName(state: ConversationThreadState) {
  return state.members.find((member) => member.role !== "agent")?.actorName ?? state.thread.title;
}

function toPreview(state: ConversationThreadState): ConversationThreadPreview {
  const pinnedCard =
    state.cards.find((card) => card.id === state.thread.pinnedCardId) ?? state.cards[0] ?? null;
  const latestMessage = state.messages[state.messages.length - 1] ?? null;
  const latestUnreadStatusMessage =
    state.unreadCount > 0
      ? [...state.messages].reverse().find((message) => message.kind === "system_handoff") ?? null
      : null;

  return {
    id: state.thread.id,
    title: state.thread.title,
    description: state.thread.description,
    primaryRole: state.thread.primaryRole,
    pinnedCard,
    latestMessage: latestUnreadStatusMessage ?? latestMessage,
    unreadCount: state.unreadCount,
  };
}

function getCardDrivenDeliveryType(params: {
  thread: ConversationThread;
  sourceCard: ConversationDecisionCard | null;
}) {
  const { thread, sourceCard } = params;

  if (!sourceCard) {
    return null;
  }

  if (thread.threadType === "rep_private") {
    if (
      sourceCard.primaryAction === "confirm" ||
      sourceCard.primaryAction === "report_upstream" ||
      sourceCard.primaryActionLabel.includes("上报")
    ) {
      return "report_upstream" as const;
    }
  }

  if (thread.threadType === "manager_private") {
    if (sourceCard.primaryActionLabel.includes("下达")) {
      return "task_downstream" as const;
    }

    if (
      sourceCard.primaryAction === "report_upstream" ||
      sourceCard.primaryActionLabel.includes("升级")
    ) {
      return "escalate_upstream" as const;
    }
  }

  if (thread.threadType === "ceo_private") {
    if (sourceCard.primaryAction === "approve" || sourceCard.primaryActionLabel.includes("批准")) {
      return "decision_return" as const;
    }
  }

  return null;
}

function getTextDrivenDeliveryType(thread: ConversationThread) {
  if (thread.threadType === "rep_private") {
    return "report_upstream" as const;
  }

  if (thread.threadType === "manager_private") {
    return "escalate_upstream" as const;
  }

  return null;
}

function getTargetThreadIdForDelivery(deliveryType: ConversationDeliveryType) {
  if (deliveryType === "report_upstream" || deliveryType === "decision_return") {
    return "thread-manager-liu";
  }

  if (deliveryType === "escalate_upstream") {
    return "thread-ceo-wang";
  }

  return "thread-rep-yang";
}

function buildDeliverySummary(params: {
  deliveryType: ConversationDeliveryType;
  threadState: ConversationThreadState;
  sourceCard: ConversationDecisionCard | null;
  handoffSummary: string | null;
}) {
  if (params.handoffSummary) {
    return params.handoffSummary;
  }

  const humanName = getThreadHumanName(params.threadState);
  const cardTitle = params.sourceCard?.title ?? "当前卡片";
  const cardSummary = params.sourceCard?.summary ?? "请继续处理当前线程中的重要事项。";

  if (params.deliveryType === "report_upstream") {
    return `${humanName}已正式上报卡片《${cardTitle}》。摘要：${cardSummary}`;
  }

  if (params.deliveryType === "escalate_upstream") {
    return `${humanName}已正式升级卡片《${cardTitle}》。摘要：${cardSummary}`;
  }

  if (params.deliveryType === "decision_return") {
    return `CEO 已批准试点边界，卡片《${cardTitle}》的决策已回传。摘要：${cardSummary}`;
  }

  return `${humanName}已正式下达卡片《${cardTitle}》。摘要：${cardSummary}`;
}

function getTargetSummaryMessenger(deliveryType: ConversationDeliveryType) {
  if (deliveryType === "report_upstream") {
    return {
      actorId: "agent-manager-bp",
      actorName: "主管 AgentBP",
    };
  }

  if (deliveryType === "escalate_upstream") {
    return {
      actorId: "agent-ceo-admin",
      actorName: "CEO Admin Agent",
    };
  }

  if (deliveryType === "decision_return") {
    return {
      actorId: "agent-ceo-admin",
      actorName: "CEO Agent",
    };
  }

  return {
    actorId: "agent-manager-bp",
    actorName: "主管 Agent",
  };
}

function buildSourceAckBody(deliveryType: ConversationDeliveryType, targetThreadTitle: string) {
  if (deliveryType === "report_upstream" || deliveryType === "escalate_upstream") {
    return `我已把这条摘要发送到${targetThreadTitle}。你当前只会看到处理状态和回传结果，不会看到上层内部详细对话。`;
  }

  if (deliveryType === "decision_return") {
    return `我已把这次决策回传到${targetThreadTitle}，对方会按摘要继续编排和执行。`;
  }

  return `我已把这次执行摘要下达到${targetThreadTitle}，你接下来会看到处理状态和回传结果。`;
}

function buildTargetSummaryBody(deliveryType: ConversationDeliveryType, sourceThreadTitle: string, summary: string) {
  if (deliveryType === "report_upstream") {
    return `已收到来自${sourceThreadTitle}的上报摘要：${summary}`;
  }

  if (deliveryType === "escalate_upstream") {
    return `已收到来自${sourceThreadTitle}的升级摘要：${summary}`;
  }

  if (deliveryType === "decision_return") {
    return `已收到来自${sourceThreadTitle}的决策回传：${summary}`;
  }

  return `已收到来自${sourceThreadTitle}的执行下达：${summary}`;
}

function buildTargetPrompt(deliveryType: ConversationDeliveryType, sourceThreadTitle: string, summary: string) {
  if (deliveryType === "report_upstream") {
    return `收到来自${sourceThreadTitle}的上报摘要：${summary}。请生成当前线程可见的处理摘要，并在必要时生成一张当前线程的决策卡。`;
  }

  if (deliveryType === "escalate_upstream") {
    return `收到来自${sourceThreadTitle}的升级摘要：${summary}。请生成当前线程可见的高层处理摘要，并在必要时生成待决策卡。`;
  }

  if (deliveryType === "decision_return") {
    return `收到来自${sourceThreadTitle}的决策回传：${summary}。请生成当前线程可见的执行摘要，并在必要时生成一张主管执行卡。`;
  }

  return `收到来自${sourceThreadTitle}的执行下达：${summary}。请生成当前线程可见的一线销售执行摘要，并在必要时生成一张执行卡。`;
}

function buildFallbackPrimaryReply(params: {
  deliveryType: ConversationDeliveryType | null;
  sourceCard: ConversationDecisionCard | null;
}) {
  if (params.deliveryType === "report_upstream" && params.sourceCard) {
    return "我已按你的上报动作整理这张卡，并同步给主管侧。你只会看到处理摘要，不会看到上层内部详细对话。";
  }

  if (params.deliveryType === "escalate_upstream" && params.sourceCard) {
    return "我已按你的升级动作整理这张卡，并同步给 CEO 侧。你接下来会看到升级摘要和回传结果。";
  }

  if (params.deliveryType === "decision_return" && params.sourceCard) {
    return "我已记录这次批准，并把可执行的决策摘要回传给主管侧。";
  }

  if (params.deliveryType === "task_downstream" && params.sourceCard) {
    return "我已把这张执行卡下达到一线销售侧，接下来只会回传与下游相关的处理摘要。";
  }

  return "我已收到你的消息，并整理成当前线程可继续处理的摘要。";
}

function buildFallbackTargetTurn(plan: DeliveryPlan): GeneratedTurnShape {
  const cardTitle = plan.sourceCardTitle ?? "待处理事项";
  const cardSummary = plan.sourceCardSummary ?? plan.summary;

  if (plan.deliveryType === "report_upstream") {
    return {
      assistantMessage: `已收到下游上报：${cardTitle}。请确认是否需要编排资源或升级给高层。`,
      shouldCreateCard: true,
      cardPayload: {
        title: `需要决定：${cardTitle}`,
        summary: cardSummary,
        detail: `来自下游线程的上报。主管当前需要判断：继续在本层编排，还是升级给 CEO 层。`,
        trustNote: "来源于下游上报摘要，非原始证据。",
        priorityRank: 95,
        primaryAction: "report_upstream",
        primaryActionLabel: "升级给 CEO",
        sourceMeetingId: plan.sourceCardSourceMeetingId,
        sourceDealId: plan.sourceCardSourceDealId,
      },
      shouldHandoff: false,
      handoffSummary: null,
    };
  }

  if (plan.deliveryType === "escalate_upstream") {
    return {
      assistantMessage: `已收到主管层升级：${cardTitle}。请审阅并决定是否批准。`,
      shouldCreateCard: true,
      cardPayload: {
        title: `待批准：${cardTitle}`,
        summary: cardSummary,
        detail: `来自主管层的升级请求，需要 CEO 层级的判断和批准。`,
        trustNote: "来源于主管层升级摘要。",
        priorityRank: 98,
        primaryAction: "approve",
        primaryActionLabel: "批准",
        sourceMeetingId: plan.sourceCardSourceMeetingId,
        sourceDealId: plan.sourceCardSourceDealId,
      },
      shouldHandoff: false,
      handoffSummary: null,
    };
  }

  if (plan.deliveryType === "decision_return") {
    return {
      assistantMessage: `CEO 已批准：${cardTitle}。请按决策内容继续推进执行。`,
      shouldCreateCard: true,
      cardPayload: {
        title: `已批准，继续执行：${cardTitle}`,
        summary: cardSummary,
        detail: `CEO 层的决策已回传，主管可按此继续编排和下达执行。`,
        trustNote: "来源于 CEO 决策回传。",
        priorityRank: 96,
        primaryAction: "confirm",
        primaryActionLabel: "确认并下达执行",
        sourceMeetingId: plan.sourceCardSourceMeetingId,
        sourceDealId: plan.sourceCardSourceDealId,
      },
      shouldHandoff: false,
      handoffSummary: null,
    };
  }

  return {
    assistantMessage: `已收到执行下达：${cardTitle}。请确认并开始执行。`,
    shouldCreateCard: true,
    cardPayload: {
      title: `待执行：${cardTitle}`,
      summary: cardSummary,
      detail: `来自主管层的执行下达，一线销售需确认后开始执行。`,
      trustNote: "来源于主管层执行下达。",
      priorityRank: 94,
      primaryAction: "confirm",
      primaryActionLabel: "确认开始执行",
      sourceMeetingId: plan.sourceCardSourceMeetingId,
      sourceDealId: plan.sourceCardSourceDealId,
    },
    shouldHandoff: false,
    handoffSummary: null,
  };
}

function isGeneratedTurnShape(value: unknown): value is GeneratedTurnShape {
  return (
    typeof value === "object" &&
    value !== null &&
    "assistantMessage" in value &&
    typeof (value as { assistantMessage?: unknown }).assistantMessage === "string"
  );
}

async function createTargetThreadProcessing(
  repository: ReturnType<typeof createConversationRepository>,
  sourceThread: ConversationThread,
  plan: DeliveryPlan
) {
  const targetThread = repository.getThreadState(plan.targetThreadId).thread;
  const targetSummaryMessage: ConversationMessage = {
    id: createMessageId("msg-delivery-summary"),
    threadId: plan.targetThreadId,
    actorId: plan.targetSummaryActorId,
    actorName: plan.targetSummaryActorName,
    kind: "system_handoff",
    body: plan.targetSummaryBody,
    occurredAt: nowIso(),
    visibility: "visible_to_thread",
    relatedCardId: null,
  };

  repository.appendMessages([targetSummaryMessage]);

  const targetState = repository.getThreadState(plan.targetThreadId);
  let targetTurn: GeneratedTurnShape;

  try {
    const generatedTurn = await generateConversationalAgentTurn({
      thread: targetState.thread,
      visibleMessages: targetState.messages,
      visibleCards: targetState.cards,
      prompt: plan.targetPrompt,
      actorName: getThreadHumanName(targetState),
    });

    if (!isGeneratedTurnShape(generatedTurn)) {
      throw new Error("目标线程模型返回为空。");
    }

    targetTurn = generatedTurn;
  } catch (error) {
    if (!plan.tolerateModelFailure) {
      throw error;
    }

    targetTurn = buildFallbackTargetTurn(plan);
  }

  const targetPrimaryAgent = getPrimaryAgentActor(targetThread);
  const targetCardId = targetTurn.cardPayload ? createCardId(plan.targetThreadId) : null;
  const targetReply: ConversationMessage = {
    id: createMessageId("msg-target-agent"),
    threadId: plan.targetThreadId,
    actorId: targetPrimaryAgent.actorId,
    actorName: targetPrimaryAgent.actorName,
    kind: targetPrimaryAgent.kind,
    body: targetTurn.assistantMessage,
    occurredAt: nowIso(),
    visibility: "visible_to_thread",
    relatedCardId: targetCardId,
  };

  repository.appendMessages([targetReply]);

  if (targetTurn.cardPayload) {
    repository.upsertCard({
      id: targetCardId!,
      threadId: plan.targetThreadId,
      title: targetTurn.cardPayload.title,
      summary: targetTurn.cardPayload.summary,
      detail: targetTurn.cardPayload.detail,
      trustNote: targetTurn.cardPayload.trustNote,
      priorityRank: targetTurn.cardPayload.priorityRank,
      primaryAction: targetTurn.cardPayload.primaryAction,
      primaryActionLabel: targetTurn.cardPayload.primaryActionLabel,
      createdAt: nowIso(),
      sourceMeetingId: targetTurn.cardPayload.sourceMeetingId,
      sourceDealId: targetTurn.cardPayload.sourceDealId,
    });
  }
}

function buildDeliveryPlan(params: {
  sourceState: ConversationThreadState;
  sourceCard: ConversationDecisionCard | null;
  messageType: "text" | "card" | "source_material";
  primaryTurn: GeneratedTurnShape;
}) {
  const cardDrivenType = getCardDrivenDeliveryType({
    thread: params.sourceState.thread,
    sourceCard: params.sourceCard,
  });
  const inferredType =
    cardDrivenType ??
    (params.primaryTurn.shouldHandoff ? getTextDrivenDeliveryType(params.sourceState.thread) : null);

  if (!inferredType) {
    return null;
  }

  const targetThreadId = getTargetThreadIdForDelivery(inferredType);
  const summary = buildDeliverySummary({
    deliveryType: inferredType,
    threadState: params.sourceState,
    sourceCard: params.sourceCard,
    handoffSummary: params.primaryTurn.handoffSummary,
  });
  const targetSummaryMessenger = getTargetSummaryMessenger(inferredType);
  const targetThreadTitle =
    targetThreadId === "thread-manager-liu"
      ? "刘建明主管群"
      : targetThreadId === "thread-ceo-wang"
        ? "王豪的销售 BP Agent"
        : "杨文星私有群";

  return {
    targetThreadId,
    deliveryType: inferredType,
    summary,
    sourceAckBody: buildSourceAckBody(inferredType, targetThreadTitle),
    targetSummaryBody: buildTargetSummaryBody(inferredType, params.sourceState.thread.title, summary),
    targetSummaryActorId: targetSummaryMessenger.actorId,
    targetSummaryActorName: targetSummaryMessenger.actorName,
    targetPrompt: buildTargetPrompt(inferredType, params.sourceState.thread.title, summary),
    tolerateModelFailure: params.messageType === "card",
    sourceCardTitle: params.sourceCard?.title ?? null,
    sourceCardSummary: params.sourceCard?.summary ?? null,
    sourceCardSourceMeetingId: params.sourceCard?.sourceMeetingId ?? null,
    sourceCardSourceDealId: params.sourceCard?.sourceDealId ?? null,
  } satisfies DeliveryPlan;
}

export function createConversationRuntime(options: ConversationRuntimeOptions = {}) {
  const repository = createConversationRepository(options);

  function listThreadPreviews() {
    return repository.listThreads().map((thread) => toPreview(repository.getThreadState(thread.id)));
  }

  function getThread(threadId: string) {
    const state = repository.getThreadState(threadId);

    return {
      ...state,
      pinnedCard: state.cards.find((card) => card.id === state.thread.pinnedCardId) ?? state.cards[0] ?? null,
    } satisfies ConversationThreadDetail;
  }

  function openThread(threadId: string) {
    repository.markThreadRead(threadId, nowIso());

    return getThread(threadId);
  }

  return {
    listThreadPreviews,
    getThread,
    openThread,
    async sendMessage(input: SendConversationMessageInput) {
      const sourceState = repository.getThreadState(input.threadId);
      const messageType = input.messageType ?? "text";
      const sourceCard =
        messageType === "card"
          ? sourceState.cards.find((card) => card.id === input.cardId) ?? null
          : null;

      if (messageType === "card" && !sourceCard) {
        throw new Error("当前线程中找不到要发送的卡片。");
      }

      if (messageType === "text" && !input.body?.trim()) {
        throw new Error("消息内容不能为空。");
      }

      const isSourceMaterial = messageType === "source_material";
      const composedBody = messageType === "card"
        ? `转发卡片：${sourceCard!.title}`
        : input.body!.trim();
      const sourceItemsSummary = isSourceMaterial && input.sourceItems?.length
        ? input.sourceItems.map((item) => item.title).join("、")
        : null;
      const composedPrompt = messageType === "card"
        ? `请继续处理这张卡：${sourceCard!.title}。摘要：${sourceCard!.summary}`
        : isSourceMaterial
          ? `用户上传了素材：${sourceItemsSummary}。原始说明：${input.body?.trim() ?? "无"}。请识别素材内容并生成结构化摘要和建议的下一步。`
          : input.body!.trim();

      const userMessage: ConversationMessage = {
        id: createMessageId("msg-human"),
        threadId: input.threadId,
        actorId: input.actorId,
        actorName: input.actorName,
        kind: isSourceMaterial ? "source_input" : messageType === "card" ? "card_summary" : "human",
        body: composedBody,
        occurredAt: nowIso(),
        visibility: "visible_to_thread",
        relatedCardId: sourceCard?.id ?? null,
        ...(isSourceMaterial && input.sourceItems ? { sourceItems: input.sourceItems } : {}),
      };

      repository.appendMessages([userMessage]);

      const stateWithUserMessage = repository.getThreadState(input.threadId);
      let primaryTurn: GeneratedTurnShape;
      const forcedDeliveryType = getCardDrivenDeliveryType({
        thread: sourceState.thread,
        sourceCard,
      });

      try {
        const generatedTurn = await generateConversationalAgentTurn({
          thread: stateWithUserMessage.thread,
          visibleMessages: stateWithUserMessage.messages,
          visibleCards: stateWithUserMessage.cards,
          prompt: composedPrompt,
          actorName: input.actorName,
        });

        if (!isGeneratedTurnShape(generatedTurn)) {
          throw new Error("当前线程模型返回为空。");
        }

        primaryTurn = generatedTurn;
      } catch (error) {
        if (!forcedDeliveryType) {
          throw error;
        }

        primaryTurn = {
          assistantMessage: buildFallbackPrimaryReply({
            deliveryType: forcedDeliveryType,
            sourceCard,
          }),
          shouldCreateCard: false,
          cardPayload: null,
          shouldHandoff: false,
          handoffSummary: null,
        };
      }

      const primaryAgent = getPrimaryAgentActor(sourceState.thread);
      const primaryCardId = primaryTurn.cardPayload ? createCardId(input.threadId) : null;
      const primaryReply: ConversationMessage = {
        id: createMessageId("msg-agent-reply"),
        threadId: input.threadId,
        actorId: primaryAgent.actorId,
        actorName: primaryAgent.actorName,
        kind: primaryAgent.kind,
        body: primaryTurn.assistantMessage,
        occurredAt: nowIso(),
        visibility: "visible_to_thread",
        relatedCardId: primaryCardId,
      };

      repository.appendMessages([primaryReply]);

      if (primaryTurn.cardPayload) {
        repository.upsertCard({
          id: primaryCardId!,
          threadId: input.threadId,
          title: primaryTurn.cardPayload.title,
          summary: primaryTurn.cardPayload.summary,
          detail: primaryTurn.cardPayload.detail,
          trustNote: primaryTurn.cardPayload.trustNote,
          priorityRank: primaryTurn.cardPayload.priorityRank,
          primaryAction: primaryTurn.cardPayload.primaryAction,
          primaryActionLabel: primaryTurn.cardPayload.primaryActionLabel,
          createdAt: nowIso(),
          sourceMeetingId: primaryTurn.cardPayload.sourceMeetingId,
          sourceDealId: primaryTurn.cardPayload.sourceDealId,
        });
      }

      const updatedThreadIds = [input.threadId];
      const deliveryPlan = buildDeliveryPlan({
        sourceState,
        sourceCard,
        messageType,
        primaryTurn,
      });

      if (deliveryPlan) {
        const delivery: ConversationDelivery = {
          id: createDeliveryId(),
          fromThreadId: input.threadId,
          toThreadId: deliveryPlan.targetThreadId,
          deliveryType: deliveryPlan.deliveryType,
          summary: deliveryPlan.summary,
          createdAt: nowIso(),
          relatedCardId: sourceCard?.id ?? null,
        };
        const handoff: ConversationHandoff = {
          id: createHandoffId(),
          fromThreadId: input.threadId,
          toThreadId: deliveryPlan.targetThreadId,
          summary: deliveryPlan.summary,
          detailVisibleToDownstream: false,
          createdAt: delivery.createdAt,
          relatedCardId: sourceCard?.id ?? null,
        };

        repository.recordDelivery(delivery);
        repository.recordHandoff(handoff);
        repository.appendMessages([
          {
            id: createMessageId("msg-delivery-ack"),
            threadId: input.threadId,
            actorId: primaryAgent.actorId,
            actorName: primaryAgent.actorName,
            kind: "system_handoff",
            body: deliveryPlan.sourceAckBody,
            occurredAt: nowIso(),
            visibility: "visible_to_thread",
            relatedCardId: null,
          },
        ]);

        await createTargetThreadProcessing(repository, sourceState.thread, deliveryPlan);
        updatedThreadIds.push(deliveryPlan.targetThreadId);
      }

      repository.markThreadRead(input.threadId, nowIso());

      return {
        defaultThreadId,
        updatedThreadIds,
        currentThread: getThread(input.threadId),
        threadPreviews: listThreadPreviews(),
      };
    },
    reset() {
      repository.resetDemoState();

      return {
        ok: true,
        defaultThreadId,
        threadPreviews: listThreadPreviews(),
      };
    },
  };
}
