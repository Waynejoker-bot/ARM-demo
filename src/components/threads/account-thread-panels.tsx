import Link from "next/link";

import { Badge, PageHeader, SectionCard } from "@/components/shared/ui";
import { EmptyState } from "@/components/shared/feedback-states";
import { getAccountById, getAccountThreadById, getMockDataset } from "@/lib/mock-selectors";
import { formatFreshness, formatStage } from "@/lib/presentation/labels";

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

function toneForExecution(state: keyof typeof executionLabels) {
  if (state === "blocked" || state === "stalled") return "risk" as const;
  if (state === "meeting_done_pending_review" || state === "next_step_pending_confirm") {
    return "warn" as const;
  }
  return "info" as const;
}

export function AccountThreadListView() {
  const dataset = getMockDataset();
  const threads = [...dataset.accountThreads].sort((left, right) => {
    const interventionDelta = Number(right.interventionNeed !== "none") - Number(left.interventionNeed !== "none");
    if (interventionDelta !== 0) return interventionDelta;
    return right.updatedAt.localeCompare(left.updatedAt);
  });

  return (
    <>
      <PageHeader
        title="客户推进线程"
        description="把客户列表重定义为推进线程列表，优先展示阶段、动作和阻点。"
      />

        <SectionCard title="线程列表" mobileDensity="feed">
        <div className="stack-card">
          <div className="button-row">
            <Badge tone="info">客户进展</Badge>
            <Badge tone="warn">当前动作</Badge>
          </div>
        </div>
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
                  <Badge tone="info">{progressLabels[thread.customerProgressStage]}</Badge>
                  <Badge tone={toneForExecution(thread.executionState)}>{executionLabels[thread.executionState]}</Badge>
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>
    </>
  );
}

export function AccountThreadDetailView({ accountId }: { accountId: string }) {
  const dataset = getMockDataset();
  const account = getAccountById(accountId);
  const thread = getAccountThreadById(accountId);

  if (!account || !thread) {
    return <EmptyState title="线程不存在" description="当前无法找到该客户的推进线程。" />;
  }

  const meetings = dataset.meetings.filter((meeting) => thread.relatedMeetingIds.includes(meeting.id));
  const deals = dataset.deals.filter((deal) => thread.relatedDealIds.includes(deal.id));
  const latestDeal = deals[0] ?? null;

  return (
    <>
      <PageHeader
        title={account.name}
        description={account.description}
        action={
          <div className="button-row">
            <Badge tone="info">{progressLabels[thread.customerProgressStage]}</Badge>
            <Badge tone={toneForExecution(thread.executionState)}>{executionLabels[thread.executionState]}</Badge>
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
        }
      />

      <div className="grid-3">
        <SectionCard title="线程概览" mobilePriority="primary" mobileDensity="feed">
          <div className="stack-list">
            <div className="stack-card">
              <strong>客户进展：{progressLabels[thread.customerProgressStage]}</strong>
              <p>{thread.objectiveProgressSummary}</p>
            </div>
            <div className="stack-card">
              <strong>当前动作：{executionLabels[thread.executionState]}</strong>
              <p>{thread.currentFocus}</p>
              <p className="muted">阻点：{thread.latestBlocker ?? "当前没有明显阻点。"}</p>
            </div>
            <div className="stack-card">
              <strong>数据信任</strong>
              <p>数据新鲜度：{formatFreshness(thread.dataFreshness)}</p>
              <p>数据覆盖率：{Math.round(thread.dataCoverage * 100)}%</p>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="最近变化" mobileDensity="feed">
          <div className="stack-list">
            {meetings.map((meeting) => (
              <div className="stack-card" key={meeting.id}>
                <Link href={`/meetings/${meeting.id}`}>
                  <strong>{meeting.title}</strong>
                </Link>
                <p>
                  {meeting.status === "completed" ? "已完成 Meeting" : "待进行 Meeting"} ·
                  {meeting.riskSignalPresent ? " 暴露风险信号" : " 保持推进节奏"}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Agent BP 建议" mobileDensity="feed">
          <div className="stack-list">
            <div className="stack-card">
              <strong>当前最大风险</strong>
              <p>{thread.latestBlocker ?? "当前没有明显风险。"}</p>
            </div>
            <div className="stack-card">
              <strong>下一步动作</strong>
              <p>{thread.currentFocus}</p>
            </div>
            <div className="stack-card">
              <strong>是否该升级 Deal</strong>
              <p>
                {latestDeal
                  ? `当前已存在 Deal：${latestDeal.name}`
                  : "当前建议继续推进线程，还不应直接生成 Deal。"}
              </p>
            </div>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="推进时间线" mobileCollapsible>
        <div className="stack-list">
          {meetings.map((meeting) => (
            <div className="stack-card" key={`${meeting.id}-timeline`}>
              <strong>{meeting.title}</strong>
              <p>
                状态变化节点：{progressLabels[thread.customerProgressStage]} / {executionLabels[thread.executionState]}
              </p>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="正式商机投影区" mobileCollapsible>
        <div className="stack-list">
          {deals.length ? (
            deals.map((deal) => (
              <div className="stack-card" key={deal.id}>
                <Link href={`/deals/${deal.id}`}>
                  <strong>{deal.name}</strong>
                </Link>
                <p>{formatStage(deal.stage)} · {deal.nextStepSummary}</p>
              </div>
            ))
          ) : (
            <div className="stack-card">
              <strong>当前还没有正式商机投影</strong>
              <p>这条线程仍应优先通过 Meeting 和客户推进动作来判断是否形成 Deal。</p>
            </div>
          )}
        </div>
      </SectionCard>
    </>
  );
}
