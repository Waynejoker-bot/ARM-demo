import type { Account, Deal, Meeting, MockDataset } from "@/lib/domain/types";

import type {
  IntakeClassificationInput,
  IntakeClassificationResponse,
} from "@/lib/intake/types";

type MatchBundle = {
  account: Account | null;
  deal: Deal | null;
  meeting: Meeting | null;
  confidence: number;
  reasoning: string;
};

function getSourceText(input: IntakeClassificationInput) {
  return [input.rawText, input.fileName, input.externalUrl].filter(Boolean).join(" ");
}

function findMatchByName(sourceText: string, dataset: MockDataset): MatchBundle {
  const account = dataset.accounts.find((item) => sourceText.includes(item.name)) ?? null;
  const deal = dataset.deals.find((item) => sourceText.includes(item.name)) ?? null;
  const meeting = dataset.meetings.find((item) => sourceText.includes(item.title)) ?? null;

  if (account || deal || meeting) {
    return {
      account:
        account ??
        (deal ? dataset.accounts.find((item) => item.id === deal.accountId) ?? null : null) ??
        (meeting ? dataset.accounts.find((item) => item.id === meeting.accountId) ?? null : null),
      deal:
        deal ??
        (meeting && meeting.dealId
          ? dataset.deals.find((item) => item.id === meeting.dealId) ?? null
          : null),
      meeting,
      confidence: meeting && deal ? 0.92 : deal || account ? 0.84 : 0.76,
      reasoning: "素材文本里直接出现了客户、商机或会议名称，可作为高置信度归属依据。",
    };
  }

  if (sourceText.includes("法务")) {
    return {
      account: dataset.accounts.find((item) => item.id === "acc-6") ?? null,
      deal: dataset.deals.find((item) => item.id === "deal-6") ?? null,
      meeting: dataset.meetings.find((item) => item.id === "meeting-6") ?? null,
      confidence: 0.66,
      reasoning: "素材里反复提到法务与采购评审，最接近灵境娱乐当前阻塞上下文，但缺少会议时间等硬锚点。",
    };
  }

  if (sourceText.includes("本地化")) {
    return {
      account: dataset.accounts.find((item) => item.id === "acc-2") ?? null,
      deal: dataset.deals.find((item) => item.id === "deal-3") ?? null,
      meeting: dataset.meetings.find((item) => item.id === "meeting-3") ?? null,
      confidence: 0.88,
      reasoning: "素材强调本地化落地说明，和云岚游戏区域试点项目的最近一次会议高度贴合。",
    };
  }

  if (sourceText.includes("试点") && sourceText.includes("指标")) {
    return {
      account: dataset.accounts.find((item) => item.id === "acc-8") ?? null,
      deal: dataset.deals.find((item) => item.id === "deal-11") ?? null,
      meeting: dataset.meetings.find((item) => item.id === "meeting-11") ?? null,
      confidence: 0.9,
      reasoning: "试点范围、验证指标和预计投入的组合，与沧澜网络当前试点推进最吻合。",
    };
  }

  return {
    account: null,
    deal: null,
    meeting: null,
    confidence: 0.42,
    reasoning: "素材里缺少能稳定映射到现有客户上下文的硬信息，需要人工补充。",
  };
}

function buildQuestions(match: MatchBundle, input: IntakeClassificationInput) {
  return [
    {
      id: "material-role",
      prompt: "这条素材更像哪一类内容？",
      options:
        input.sourceKind === "email"
          ? ["会后跟进邮件", "会前准备邮件", "仅供参考资料"]
          : input.sourceKind === "link"
            ? ["外部佐证资料", "客户发来的背景链接", "暂不写入业务对象"]
            : ["会后纪要", "电话补录", "仅记录为背景备注"],
      reason: "先确认素材角色，才能决定写入 Meeting、Conversation 还是 Evidence。",
    },
    {
      id: "should-apply",
      prompt: "这条素材需要写入当前商机吗？",
      options: ["需要，生成写入建议", "只保留为证据", "暂不写入"],
      reason: "这一步决定 suggestion 是否会进入待确认写入区。",
    },
    {
      id: "next-step-needed",
      prompt: "是否需要从这条素材生成下一步动作？",
      options: ["需要生成 next step", "只整理事实，不生成动作", "等确认归属后再决定"],
      reason: "把事实整理和动作建议拆开，避免自动 apply。",
    },
  ];
}

function buildCandidates(match: MatchBundle) {
  return [
    match.account
      ? {
          entityType: "account" as const,
          entityId: match.account.id,
          label: match.account.name,
          confidence: Math.min(match.confidence + 0.02, 0.96),
          reason: match.reasoning,
        }
      : null,
    match.deal
      ? {
          entityType: "deal" as const,
          entityId: match.deal.id,
          label: match.deal.name,
          confidence: match.confidence,
          reason: match.reasoning,
        }
      : null,
    match.meeting
      ? {
          entityType: "meeting" as const,
          entityId: match.meeting.id,
          label: match.meeting.title,
          confidence: Math.max(match.confidence - 0.04, 0.4),
          reason: "会议归属基于素材内容与最近一次相关会议的语义相似度推断。",
        }
      : null,
  ].filter(Boolean);
}

function buildProposals(match: MatchBundle, input: IntakeClassificationInput) {
  const proposals = [];

  if (match.meeting) {
    proposals.push({
      targetType: "meeting_summary" as const,
      targetObjectId: match.meeting.id,
      title: "补充会议总结",
      summary: `把素材里的关键信息并入 ${match.meeting.title} 的会后总结。`,
      confidence: Math.max(match.confidence - 0.03, 0.4),
      requiresManualReview: match.confidence < 0.8,
    });
  }

  if (match.deal) {
    proposals.push({
      targetType: input.sourceKind === "recording" ? "deal_note" : "next_step",
      targetObjectId: match.deal.id,
      title: input.sourceKind === "recording" ? "补充商机备注" : "生成下一步动作",
      summary:
        input.sourceKind === "recording"
          ? `把素材里的关键事实挂到 ${match.deal.name} 的商机备注中。`
          : `基于这条素材，为 ${match.deal.name} 起草一条待确认的下一步动作。`,
      confidence: match.confidence,
      requiresManualReview: match.confidence < 0.8,
    });
  }

  if (!proposals.length) {
    proposals.push({
      targetType: "evidence_ref" as const,
      targetObjectId: null,
      title: "先保留为待确认素材",
      summary: "当前归属不够稳定，先不要写入业务对象，等待销售补充信息后再生成建议。",
      confidence: 0.35,
      requiresManualReview: true,
    });
  }

  return proposals;
}

export function classifyIntakeWithMock(
  input: IntakeClassificationInput,
  dataset: MockDataset
): IntakeClassificationResponse {
  const sourceText = getSourceText(input);
  const match = findMatchByName(sourceText, dataset);
  const needsManualInput = match.confidence < 0.75;

  return {
    title: input.fileName ?? sourceText.slice(0, 24) ?? "新素材导入",
    normalizedSourceKind: input.sourceKind,
    confidence: match.confidence,
    reasoning: match.reasoning,
    needsManualInput,
    missingFields: needsManualInput ? ["关联客户", "会议归属"] : [],
    candidates: buildCandidates(match),
    questions: buildQuestions(match, input),
    proposals: buildProposals(match, input),
  };
}
