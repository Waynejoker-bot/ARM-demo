import type { AccountThread, MockDataset, RepReportSnapshot } from "@/lib/domain/types";

const WEEK_START = "2026-03-02T00:00:00Z";

function countCompletedMeetings(dataset: Pick<MockDataset, "meetings">, thread: AccountThread) {
  return dataset.meetings.filter(
    (meeting) =>
      meeting.accountId === thread.accountId && meeting.status === "completed"
  ).length;
}

function pickHighlightedThread(threads: AccountThread[]) {
  return [...threads].sort((left, right) => {
    const interventionRank =
      Number(right.interventionNeed !== "none") - Number(left.interventionNeed !== "none");
    if (interventionRank !== 0) return interventionRank;
    return right.updatedAt.localeCompare(left.updatedAt);
  })[0] ?? null;
}

export function deriveRepReportSnapshots(
  dataset: Pick<MockDataset, "repScorecards" | "meetings">,
  accountThreads: AccountThread[]
): RepReportSnapshot[] {
  return dataset.repScorecards.map((rep) => {
    const repThreads = accountThreads.filter((thread) => thread.ownerRepId === rep.repId);
    const highlightedThread = pickHighlightedThread(repThreads);
    const completedMeetingCount = repThreads.reduce(
      (sum, thread) => sum + countCompletedMeetings(dataset, thread),
      0
    );
    const interventionCount = repThreads.filter(
      (thread) => thread.interventionNeed !== "none"
    ).length;
    const activeDealCount = repThreads.filter((thread) => thread.activeDealId).length;
    const newOpportunityCount = repThreads.filter(
      (thread) =>
        ["opportunity", "commercial_active"].includes(thread.customerProgressStage) &&
        (thread.lastMeetingAt ?? "") >= WEEK_START
    ).length;
    const stalledThreadCount = repThreads.filter((thread) =>
      ["blocked", "stalled"].includes(thread.executionState)
    ).length;
    const highlightedReason = highlightedThread
      ? highlightedThread.interventionNeed !== "none"
        ? `需主管介入：${highlightedThread.latestBlocker ?? highlightedThread.currentFocus}`
        : `当前最值得关注的是：${highlightedThread.currentFocus}`
      : "当前没有可高亮的客户线程。";

    return {
      id: `rep-report-${rep.repId}`,
      repId: rep.repId,
      repName: rep.repName,
      teamName: rep.teamName,
      periodLabel: "本周",
      touchedAccountCount: repThreads.length,
      completedMeetingCount,
      activeDealCount,
      newOpportunityCount,
      stalledThreadCount,
      interventionCount,
      summary: `${rep.repName} 本周推进 ${repThreads.length} 个客户，完成 ${completedMeetingCount} 场会议，形成 ${newOpportunityCount} 个进入正式推进的机会。`,
      highlightedThreadId: highlightedThread?.id ?? null,
      highlightedReason,
      accountThreadIds: repThreads.map((thread) => thread.id),
    };
  });
}
