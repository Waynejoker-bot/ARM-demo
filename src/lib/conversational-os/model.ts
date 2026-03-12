import { z } from "zod";

import type {
  ConversationDecisionCard,
  ConversationMessage,
  ConversationThread,
} from "@/lib/conversational-os/types";
import { requestGlmCompletion } from "@/lib/model/glm-client";
import type { ModelMessage } from "@/lib/model/types";

const cardPayloadSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  detail: z.string().min(1),
  trust_note: z.string().min(1),
  priority_rank: z.number().int().min(1).max(100),
  primary_action: z.enum(["confirm", "report_upstream", "approve", "request_details"]),
  primary_action_label: z.string().min(1),
  source_meeting_id: z.string().min(1).nullable().optional(),
  source_deal_id: z.string().min(1).nullable().optional(),
});

const conversationalTurnSchema = z
  .object({
    assistant_message: z.string().min(1),
    should_create_card: z.boolean(),
    card_payload: cardPayloadSchema.nullable().optional(),
    should_handoff: z.boolean(),
    handoff_summary: z.string().min(1).nullable().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.should_create_card && !value.card_payload) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["card_payload"],
        message: "should_create_card 为 true 时必须返回 card_payload。",
      });
    }

    if (value.should_handoff && !value.handoff_summary) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["handoff_summary"],
        message: "should_handoff 为 true 时必须返回 handoff_summary。",
      });
    }
  });

type BuildConversationalAgentMessagesInput = {
  thread: ConversationThread;
  visibleMessages: ConversationMessage[];
  visibleCards: ConversationDecisionCard[];
  prompt: string;
  actorName: string;
};

export type GeneratedConversationCardPayload = {
  title: string;
  summary: string;
  detail: string;
  trustNote: string;
  priorityRank: number;
  primaryAction: "confirm" | "report_upstream" | "approve" | "request_details";
  primaryActionLabel: string;
  sourceMeetingId: string | null;
  sourceDealId: string | null;
};

export type ConversationalAgentTurn = {
  assistantMessage: string;
  shouldCreateCard: boolean;
  cardPayload: GeneratedConversationCardPayload | null;
  shouldHandoff: boolean;
  handoffSummary: string | null;
};

export class ConversationalAgentModelError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "ConversationalAgentModelError";
  }
}

function getRoleInstruction(thread: ConversationThread) {
  if (thread.threadType === "rep_private") {
    return "你服务的是一线销售私有群，要先给销售可执行的下一步，同时必要时生成给主管的摘要。";
  }

  if (thread.threadType === "manager_private") {
    return "你服务的是主管私有群，要先给主管编排和升级判断，不要直接暴露 CEO 侧内部处理细节。";
  }

  return "你服务的是 CEO 私有线程，要先给升级摘要、待决策卡和经营层动作建议。";
}

function formatVisibleCards(cards: ConversationDecisionCard[]) {
  if (!cards.length) {
    return "当前没有可见决策卡。";
  }

  return cards
    .slice(0, 3)
    .map((card, index) =>
      [
        `卡片 ${index + 1}：${card.title}`,
        `摘要：${card.summary}`,
        `主动作：${card.primaryActionLabel}`,
        `信任信息：${card.trustNote}`,
      ].join("\n")
    )
    .join("\n\n");
}

function formatRecentMessages(messages: ConversationMessage[]) {
  if (!messages.length) {
    return "当前没有历史消息。";
  }

  return messages
    .slice(-6)
    .map((message) => `${message.actorName}（${message.kind}）：${message.body}`)
    .join("\n");
}

function parseJsonResponse(rawContent: string) {
  const cleaned = rawContent
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "");

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    throw new ConversationalAgentModelError("模型没有返回可解析的 JSON。", { cause: error });
  }
}

export function buildConversationalAgentMessages(
  input: BuildConversationalAgentMessagesInput
): ModelMessage[] {
  const pinnedCard = input.visibleCards
    .slice()
    .sort((left, right) => right.priorityRank - left.priorityRank)[0];

  return [
    {
      role: "system",
      content: [
        "你是会话版 Agent OS 的内部 Agent。",
        "你需要把会话上下文压缩成专业、简洁、可执行的中文回复。",
        getRoleInstruction(input.thread),
        "你不能决定组织路由，只能返回内容建议。",
        "下游只看到摘要，不看到上层完整内部处理过程。",
        "你必须只返回 JSON，不要输出 Markdown，不要输出额外解释。",
      ].join(" "),
    },
    {
      role: "user",
      content: [
        `线程：${input.thread.title}`,
        `线程说明：${input.thread.description}`,
        `当前用户：${input.actorName}`,
        pinnedCard
          ? [
              "当前置顶优先卡：",
              `标题：${pinnedCard.title}`,
              `摘要：${pinnedCard.summary}`,
              `主动作：${pinnedCard.primaryActionLabel}`,
            ].join("\n")
          : "当前置顶优先卡：无",
        `当前可见卡片：\n${formatVisibleCards(input.visibleCards)}`,
        `最近消息：\n${formatRecentMessages(input.visibleMessages)}`,
        `用户新消息：${input.prompt}`,
        [
          "请返回 JSON，字段必须是：",
          "assistant_message: string",
          "should_create_card: boolean",
          "card_payload: object | null",
          "should_handoff: boolean",
          "handoff_summary: string | null",
        ].join("\n"),
      ].join("\n\n"),
    },
  ];
}

export async function generateConversationalAgentTurn(
  input: BuildConversationalAgentMessagesInput
): Promise<ConversationalAgentTurn> {
  const raw = await requestGlmCompletion({
    prompt: input.prompt,
    contextTitle: input.thread.title,
    contextDescription: input.thread.description,
    roleHint:
      input.thread.primaryRole === "rep"
        ? "rep"
        : input.thread.primaryRole === "manager"
          ? "manager"
          : "ceo",
    history: [],
    messages: buildConversationalAgentMessages(input),
    temperature: 0.2,
    responseFormat: { type: "json_object" },
  });

  const parsed = conversationalTurnSchema.safeParse(parseJsonResponse(raw));

  if (!parsed.success) {
    throw new ConversationalAgentModelError("模型返回的结构不符合会话版 Agent OS 协议。", {
      cause: parsed.error,
    });
  }

  return {
    assistantMessage: parsed.data.assistant_message,
    shouldCreateCard: parsed.data.should_create_card,
    cardPayload: parsed.data.card_payload
      ? {
          title: parsed.data.card_payload.title,
          summary: parsed.data.card_payload.summary,
          detail: parsed.data.card_payload.detail,
          trustNote: parsed.data.card_payload.trust_note,
          priorityRank: parsed.data.card_payload.priority_rank,
          primaryAction: parsed.data.card_payload.primary_action,
          primaryActionLabel: parsed.data.card_payload.primary_action_label,
          sourceMeetingId: parsed.data.card_payload.source_meeting_id ?? null,
          sourceDealId: parsed.data.card_payload.source_deal_id ?? null,
        }
      : null,
    shouldHandoff: parsed.data.should_handoff,
    handoffSummary: parsed.data.handoff_summary ?? null,
  };
}
