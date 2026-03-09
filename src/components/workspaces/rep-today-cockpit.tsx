import Link from "next/link";
import type { ReactNode } from "react";

import { Badge, PageHeader, SectionCard } from "@/components/shared/ui";
import { getMockDataset } from "@/lib/mock-selectors";
import { formatFreshness } from "@/lib/presentation/labels";

const progressLabels = {
  prospect: "线索期",
  engaged: "已建联",
  opportunity: "商机形成中",
  commercial_active: "商务推进中",
  closed_won: "已成交",
  closed_lost: "已流失",
} as const;

const executionLabels = {
  need_prep: "待准备",
  meeting_scheduled: "已排期下一次 Meeting",
  meeting_done_pending_review: "会后待确认",
  next_step_pending_confirm: "待确认下一步",
  waiting_customer: "等待客户反馈",
  waiting_internal: "等待内部支持",
  blocked: "阻塞中",
  stalled: "已停滞",
} as const;

function getToneForExecutionState(executionState: keyof typeof executionLabels) {
  if (executionState === "blocked" || executionState === "stalled") return "risk" as const;
  if (
    executionState === "meeting_done_pending_review" ||
    executionState === "next_step_pending_confirm"
  ) {
    return "warn" as const;
  }

  return "info" as const;
}

export function RepTodayCockpitView({ action }: { action?: ReactNode }) {
  const dataset = getMockDataset();
  const repId = "rep-2";
  const rep = dataset.repScorecards.find((scorecard) => scorecard.repId === repId);
  const report = dataset.repReportSnapshots.find((snapshot) => snapshot.repId === repId);
  const threads = dataset.accountThreads
    .filter((thread) => thread.ownerRepId === repId)
    .sort((left, right) => {
      const interventionDelta =
        Number(right.interventionNeed !== "none") - Number(left.interventionNeed !== "none");
      if (interventionDelta !== 0) return interventionDelta;
      return right.updatedAt.localeCompare(left.updatedAt);
    });
  const recentMeetings = dataset.meetings
    .filter((meeting) => threads.some((thread) => thread.accountId === meeting.accountId))
    .filter((meeting) => meeting.status === "completed")
    .sort((left, right) => right.scheduledAt.localeCompare(left.scheduledAt))
    .slice(0, 3);
  const pendingThreads = threads.filter((thread) =>
    ["meeting_done_pending_review", "next_step_pending_confirm", "blocked"].includes(
      thread.executionState
    )
  );
  const topPriorities = [
    threads.find((thread) => thread.interventionNeed !== "none"),
    pendingThreads[0],
    threads.find((thread) => thread.nextMeetingAt),
  ].filter((thread, index, array): thread is (typeof threads)[number] => {
    return Boolean(thread) && array.indexOf(thread) === index;
  });

  return (
    <>
      <PageHeader
        title="一线销售首页"
        description="先回答今天该做什么，再展开 Meeting、客户推进和对主管汇报。"
        action={action}
      />

      <SectionCard title="Agent 今日简报" mobilePriority="primary" mobileDensity="feed">
        <div className="stack-list">
          <div className="stack-card">
            <strong>
              {rep?.repName ?? "当前销售"}今天先处理 {topPriorities.length} 件高优动作，避免会后结论卡在待确认状态。
            </strong>
            <p>
              优先顺序来自客户线程的阻塞程度、会后待确认状态和下一次 Meeting 的临近程度，而不是按客户列表平铺展示。
            </p>
          </div>
          <div className="stack-list">
            {topPriorities.map((thread, index) => {
              const account = dataset.accounts.find((item) => item.id === thread.accountId);

              return (
                <div className="stack-card" key={thread.id}>
                  <strong>
                    {index + 1}. {account?.name ?? "未知客户"}
                  </strong>
                  <p>{thread.currentFocus}</p>
                </div>
              );
            })}
          </div>
        </div>
      </SectionCard>

      <div className="grid-2">
        <SectionCard title="今日会议流" mobilePriority="primary" mobileDensity="feed">
          <div className="stack-list">
            {recentMeetings.map((meeting) => {
              const account = dataset.accounts.find((item) => item.id === meeting.accountId);
              const thread = threads.find((item) => item.accountId === meeting.accountId);

              return (
                <div className="stack-card" key={meeting.id}>
                  <Link href={`/meetings/${meeting.id}`}>
                    <strong>{meeting.title}</strong>
                  </Link>
                  <p>{account?.name ?? "未知客户"}</p>
                  <div className="button-row">
                    {thread ? (
                      <Badge tone={getToneForExecutionState(thread.executionState)}>
                        {executionLabels[thread.executionState]}
                      </Badge>
                    ) : null}
                    <Badge tone={meeting.transcriptStatus === "missing" ? "risk" : "info"}>
                      {meeting.transcriptStatus === "missing" ? "缺少转录" : "证据可用"}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard title="待确认区" mobilePriority="primary" mobileDensity="feed">
          <div className="stack-list">
            {pendingThreads.map((thread) => {
              const account = dataset.accounts.find((item) => item.id === thread.accountId);

              return (
                <div className="stack-card" key={thread.id}>
                  <strong>{account?.name ?? "未知客户"}</strong>
                  <p>{thread.latestBlocker ?? thread.currentFocus}</p>
                  <div className="button-row">
                    <Badge tone={getToneForExecutionState(thread.executionState)}>
                      {executionLabels[thread.executionState]}
                    </Badge>
                    <Link className="ghost-button" href={`/customers/${thread.accountId}`}>
                      去确认
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="客户推进线程" mobileDensity="feed">
        <div className="stack-list">
          {threads.map((thread) => {
            const account = dataset.accounts.find((item) => item.id === thread.accountId);

            return (
              <div className="stack-card" key={thread.id}>
                <Link href={`/customers/${thread.accountId}`}>
                  <strong>{account?.name ?? "未知客户"}</strong>
                </Link>
                <p>{thread.objectiveProgressSummary}</p>
                <div className="button-row">
                  <Badge tone="info">客户进展：{progressLabels[thread.customerProgressStage]}</Badge>
                  <Badge tone={getToneForExecutionState(thread.executionState)}>
                    当前动作：{executionLabels[thread.executionState]}
                  </Badge>
                  <Badge
                    tone={
                      thread.dataFreshness === "fresh"
                        ? "success"
                        : thread.dataFreshness === "stale"
                          ? "warn"
                          : "risk"
                    }
                  >
                    {formatFreshness(thread.dataFreshness)}
                  </Badge>
                </div>
                <p className="muted">阻点：{thread.latestBlocker ?? "当前没有明显阻点。"}</p>
              </div>
            );
          })}
        </div>
      </SectionCard>

      <div className="grid-2">
        <SectionCard title="对主管汇报草稿" mobilePriority="secondary" mobileDensity="feed">
          <div className="stack-list">
            <div className="stack-card">
              <strong>今日汇报草稿</strong>
              <p>
                今天我优先处理了 {pendingThreads.length} 条待确认线程，并重点推进了
                {threads[0] ? ` ${dataset.accounts.find((item) => item.id === threads[0].accountId)?.name}` : "关键客户"}
                的下一步安排。
              </p>
            </div>
            <div className="stack-card">
              <strong>本周汇报草稿</strong>
              <p>{report?.summary ?? "当前还没有可用的周报摘要。"}</p>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Agent 面板联动入口" mobilePriority="secondary" mobileCollapsible>
          <div className="stack-list">
            <div className="stack-card">
              <strong>为什么沧澜网络还不能直接升格为正式商机？</strong>
              <p>打开 Agent 面板追问证据、影响范围和下一次 Meeting 应该如何设计。</p>
            </div>
            <div className="stack-card">
              <strong>为什么玄河网络需要主管介入？</strong>
              <p>沿着线程或 Deal 下钻，可以继续查看高风险商机背后的 Meeting 证据链。</p>
            </div>
          </div>
        </SectionCard>
      </div>
    </>
  );
}
