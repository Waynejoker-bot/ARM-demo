import type {
  Account,
  AccountThread,
  AgentOutput,
  Contact,
  Conversation,
  Deal,
  Meeting,
  MockDataset,
} from "@/lib/domain/types";

const dealStageRank: Record<string, number> = {
  discovery: 1,
  qualification: 2,
  demo: 3,
  proposal: 4,
  negotiation: 5,
  review: 6,
};

function sortByTimeDesc<T extends { timestamp?: string; scheduledAt?: string; updatedAt?: string }>(
  items: T[]
) {
  return [...items].sort((left, right) => {
    const leftValue = left.timestamp ?? left.scheduledAt ?? left.updatedAt ?? "";
    const rightValue = right.timestamp ?? right.scheduledAt ?? right.updatedAt ?? "";
    return rightValue.localeCompare(leftValue);
  });
}

function pickActiveDeal(deals: Deal[]) {
  return [...deals].sort((left, right) => {
    const stageDelta = (dealStageRank[right.stage] ?? 0) - (dealStageRank[left.stage] ?? 0);
    if (stageDelta !== 0) return stageDelta;
    return right.updatedAt.localeCompare(left.updatedAt);
  })[0] ?? null;
}

function pickNextMeetingAt(meetings: Meeting[], deals: Deal[]) {
  const upcomingMeeting = [...meetings]
    .filter((meeting) => meeting.status === "upcoming")
    .sort((left, right) => left.scheduledAt.localeCompare(right.scheduledAt))[0];

  const dealMeeting = deals
    .map((deal) => deal.nextMeetingAt)
    .filter((value): value is string => Boolean(value))
    .sort((left, right) => left.localeCompare(right))[0];

  return [upcomingMeeting?.scheduledAt ?? null, dealMeeting ?? null]
    .filter((value): value is string => Boolean(value))
    .sort((left, right) => left.localeCompare(right))[0] ?? null;
}

function deriveCustomerProgressStage(input: {
  deals: Deal[];
  completedMeetings: Meeting[];
}): AccountThread["customerProgressStage"] {
  const activeDeal = pickActiveDeal(input.deals);

  if (!activeDeal && input.completedMeetings.length === 0) {
    return "prospect";
  }

  if (!activeDeal) {
    return "engaged";
  }

  if (["discovery", "qualification"].includes(activeDeal.stage)) {
    return "engaged";
  }

  if (activeDeal.stage === "demo") {
    return "opportunity";
  }

  return "commercial_active";
}

function deriveExecutionState(input: {
  activeDeal: Deal | null;
  latestCompletedMeeting: Meeting | null;
  nextMeetingAt: string | null;
}): AccountThread["executionState"] {
  if (!input.latestCompletedMeeting && !input.nextMeetingAt) {
    return "need_prep";
  }

  if (
    input.activeDeal?.riskLevel === "high" &&
    input.activeDeal.dataFreshness !== "fresh"
  ) {
    return "blocked";
  }

  if (
    input.latestCompletedMeeting &&
    (input.latestCompletedMeeting.summaryStatus === "needs_review" ||
      input.latestCompletedMeeting.transcriptStatus === "missing")
  ) {
    return "meeting_done_pending_review";
  }

  if (input.nextMeetingAt) {
    return "meeting_scheduled";
  }

  if (input.activeDeal?.dataFreshness === "stale") {
    return "stalled";
  }

  return "next_step_pending_confirm";
}

function deriveLatestBlocker(input: {
  activeDeal: Deal | null;
  latestCompletedMeeting: Meeting | null;
}): string | null {
  if (input.latestCompletedMeeting?.transcriptStatus === "missing") {
    return "会议转录缺失，需人工补充确认。";
  }

  if (input.activeDeal?.riskLevel === "high") {
    return input.activeDeal.nextStepSummary;
  }

  if (input.activeDeal?.dataFreshness === "stale") {
    return "数据新鲜度下降，当前判断需要新的 Meeting 证据支撑。";
  }

  return null;
}

function deriveFreshness(meetings: Meeting[], activeDeal: Deal | null): AccountThread["dataFreshness"] {
  const candidates = [activeDeal?.dataFreshness, ...meetings.map((meeting) => meeting.dataFreshness)];

  if (candidates.includes("missing")) return "missing";
  if (candidates.includes("stale")) return "stale";
  return "fresh";
}

function deriveCoverage(deals: Deal[], meetings: Meeting[]) {
  const dealCoverage = deals.length
    ? deals.reduce((sum, deal) => sum + deal.dataCoverage, 0) / deals.length
    : meetings.length
      ? 0.48
      : 0.18;

  const transcriptPenalty = meetings.some((meeting) => meeting.transcriptStatus === "missing")
    ? 0.12
    : 0;

  return Math.max(0.08, Math.min(0.99, Number((dealCoverage - transcriptPenalty).toFixed(2))));
}

function deriveCurrentFocus(input: {
  activeDeal: Deal | null;
  latestAgentOutput: AgentOutput | null;
  latestConversation: Conversation | null;
}): string {
  return (
    input.activeDeal?.nextStepSummary ??
    input.latestAgentOutput?.summary ??
    input.latestConversation?.summary ??
    "完成首轮客户信息收集，并推动第一次有效 Meeting。"
  );
}

function deriveObjectiveProgressSummary(input: {
  account: Account;
  customerProgressStage: AccountThread["customerProgressStage"];
  executionState: AccountThread["executionState"];
  activeDeal: Deal | null;
}) {
  const stageLabelMap: Record<AccountThread["customerProgressStage"], string> = {
    prospect: "仍在线索期",
    engaged: "已进入有效建联",
    opportunity: "正在形成正式商机",
    commercial_active: "已进入商务推进",
    closed_won: "已成交",
    closed_lost: "已流失",
  };

  const actionLabelMap: Record<AccountThread["executionState"], string> = {
    need_prep: "需先完成准备动作",
    meeting_scheduled: "已进入下一次 Meeting 安排",
    meeting_done_pending_review: "会后结论仍待人工确认",
    next_step_pending_confirm: "下一步动作仍待拍板",
    waiting_customer: "当前在等待客户反馈",
    waiting_internal: "当前在等待内部支持",
    blocked: "当前推进被关键阻点卡住",
    stalled: "当前推进明显停滞",
  };

  return `${input.account.name}${stageLabelMap[input.customerProgressStage]}，${actionLabelMap[input.executionState]}。$${
    input.activeDeal ? "" : ""
  }`.replace("$", "");
}

function deriveInterventionNeed(input: {
  activeDeal: Deal | null;
  executionState: AccountThread["executionState"];
}): AccountThread["interventionNeed"] {
  if (input.executionState === "blocked" || input.executionState === "stalled") {
    return "manager";
  }

  if (input.activeDeal?.riskLevel === "high" && input.activeDeal.amount >= 3000000) {
    return "manager";
  }

  return "none";
}

export function deriveAccountThreads(
  dataset: Pick<
    MockDataset,
    "accounts" | "contacts" | "deals" | "meetings" | "conversations" | "agentOutputs"
  >
): AccountThread[] {
  return dataset.accounts.map((account) => {
    const contacts = dataset.contacts
      .filter((contact) => contact.accountId === account.id)
      .sort((left, right) => right.influenceLevel - left.influenceLevel);
    const deals = dataset.deals.filter((deal) => deal.accountId === account.id);
    const meetings = dataset.meetings.filter((meeting) => meeting.accountId === account.id);
    const completedMeetings = sortByTimeDesc(
      meetings.filter((meeting) => meeting.status === "completed")
    );
    const conversations = sortByTimeDesc(
      dataset.conversations.filter(
        (conversation) =>
          (conversation.relatedType === "account" && conversation.relatedId === account.id) ||
          (conversation.relatedType === "deal" && deals.some((deal) => deal.id === conversation.relatedId)) ||
          (conversation.relatedType === "meeting" &&
            meetings.some((meeting) => meeting.id === conversation.relatedId))
      )
    );
    const activeDeal = pickActiveDeal(deals);
    const latestCompletedMeeting = completedMeetings[0] ?? null;
    const nextMeetingAt = pickNextMeetingAt(meetings, deals);
    const latestAgentOutput = sortByTimeDesc(
      dataset.agentOutputs.filter(
        (output) =>
          (output.objectType === "deal" && deals.some((deal) => deal.id === output.objectId)) ||
          (output.objectType === "meeting" && meetings.some((meeting) => meeting.id === output.objectId))
      )
    )[0] ?? null;

    const customerProgressStage = deriveCustomerProgressStage({ deals, completedMeetings });
    const executionState = deriveExecutionState({
      activeDeal,
      latestCompletedMeeting,
      nextMeetingAt,
    });

    return {
      id: `thread-${account.id}`,
      accountId: account.id,
      ownerRepId: account.ownerRepId,
      primaryContactIds: contacts.slice(0, 2).map((contact) => contact.id),
      relatedDealIds: [...deals]
        .sort((left, right) => {
          const rankDelta = (dealStageRank[right.stage] ?? 0) - (dealStageRank[left.stage] ?? 0);
          if (rankDelta !== 0) return rankDelta;
          return right.updatedAt.localeCompare(left.updatedAt);
        })
        .map((deal) => deal.id),
      relatedMeetingIds: completedMeetings.map((meeting) => meeting.id),
      activeDealId: activeDeal?.id ?? null,
      customerProgressStage,
      executionState,
      objectiveProgressSummary: deriveObjectiveProgressSummary({
        account,
        customerProgressStage,
        executionState,
        activeDeal,
      }),
      currentFocus: deriveCurrentFocus({
        activeDeal,
        latestAgentOutput,
        latestConversation: conversations[0] ?? null,
      }),
      latestBlocker: deriveLatestBlocker({ activeDeal, latestCompletedMeeting }),
      lastMeetingId: latestCompletedMeeting?.id ?? null,
      lastMeetingAt: latestCompletedMeeting?.scheduledAt ?? null,
      nextMeetingAt,
      interventionNeed: deriveInterventionNeed({ activeDeal, executionState }),
      dataFreshness: deriveFreshness(meetings, activeDeal),
      dataCoverage: deriveCoverage(deals, meetings),
      updatedAt:
        activeDeal?.updatedAt ?? latestCompletedMeeting?.scheduledAt ?? contacts[0]?.lastInteractionAt ?? "",
    };
  });
}
