import Link from "next/link";

import { RealMeetingShowcaseSection } from "@/components/real-cases/showcase";
import { Badge, MetricCard, PageHeader, SectionCard } from "@/components/shared/ui";
import { EmptyState } from "@/components/shared/feedback-states";
import { getMockDataset, getRepReportByRepId } from "@/lib/mock-selectors";
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

export function SalesManagerCockpitView() {
  const dataset = getMockDataset();
  const interventionThreads = dataset.accountThreads.filter(
    (thread) => thread.interventionNeed !== "none"
  );
  const totalTouchedAccounts = dataset.repReportSnapshots.reduce(
    (sum, snapshot) => sum + snapshot.touchedAccountCount,
    0
  );
  const totalCompletedMeetings = dataset.repReportSnapshots.reduce(
    (sum, snapshot) => sum + snapshot.completedMeetingCount,
    0
  );
  const totalNewOpportunities = dataset.repReportSnapshots.reduce(
    (sum, snapshot) => sum + snapshot.newOpportunityCount,
    0
  );
  const totalActiveDeals = dataset.repReportSnapshots.reduce(
    (sum, snapshot) => sum + snapshot.activeDealCount,
    0
  );
  const totalStalledThreads = dataset.repReportSnapshots.reduce(
    (sum, snapshot) => sum + snapshot.stalledThreadCount,
    0
  );
  const highlightedDeal = dataset.deals.find((deal) => deal.id === "deal-2");
  const highlightedThread = dataset.accountThreads.find((thread) => thread.accountId === "acc-3");

  return (
    <>
      <PageHeader
        title="销售主管驾驶舱"
        description="先看 Team Brief，再看介入点，最后下钻到销售、线程和 Deal。"
      />

      <SectionCard title="Agent 主管简报">
        <div className="stack-list">
          <div className="stack-card">
            <strong>本周团队推进有实质前进，但后期高价值线程的介入优先级明显上升。</strong>
            <p>
              团队共推进 {totalTouchedAccounts} 个客户，形成 {totalNewOpportunities} 个进入正式推进的新机会；当前最值得你介入的是玄河网络的高风险线程与对应 Deal。
            </p>
          </div>
          <div className="button-row">
            <Badge tone="risk">优先介入玄河网络</Badge>
            <Badge tone="warn">关注会后确认质量</Badge>
            <Badge tone="info">继续查看团队周报</Badge>
          </div>
        </div>
      </SectionCard>

      <div className="grid-2">
        <SectionCard title="Team Brief Overview">
          <div className="stack-list">
            <div className="stack-card">
              <strong>团队摘要</strong>
              <p>
                本周团队完成 {totalCompletedMeetings} 场 Meeting，维持 {totalActiveDeals} 个推进中 Deal，当前有 {totalStalledThreads} 条线程进入阻塞或停滞状态。
              </p>
            </div>
            <div className="metric-grid">
              <MetricCard label="触达客户数" value={`${totalTouchedAccounts}`} tone="info" />
              <MetricCard label="完成 Meeting 数" value={`${totalCompletedMeetings}`} tone="positive" />
              <MetricCard label="新形成商机数" value={`${totalNewOpportunities}`} tone="warn" />
              <MetricCard label="推进中的商机数" value={`${totalActiveDeals}`} tone="info" />
              <MetricCard label="停滞客户数" value={`${totalStalledThreads}`} tone="risk" />
            </div>
            <div className="button-row">
              <Link className="ghost-button" href="/pipeline">查看 Pipeline</Link>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Intervention Queue">
          <div className="stack-list">
            {interventionThreads.map((thread) => {
              const account = dataset.accounts.find((item) => item.id === thread.accountId);
              const deal = dataset.deals.find((item) => item.id === thread.activeDealId);
              const rep = dataset.repReportSnapshots.find((item) => item.repId === thread.ownerRepId);

              return (
                <div className="stack-card" key={thread.id}>
                  <Link href={`/customers/${thread.accountId}`}>
                    <strong>{account?.name ?? "未知客户"}</strong>
                  </Link>
                  <p>{thread.latestBlocker ?? thread.currentFocus}</p>
                  <div className="button-row">
                    <Badge tone="risk">{executionLabels[thread.executionState]}</Badge>
                    {deal ? (
                      <Link className="ghost-button" href={`/deals/${deal.id}`}>
                        {deal.name}
                      </Link>
                    ) : null}
                    {rep ? <span className="muted">销售：{rep.repName}</span> : null}
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>
      </div>

      <RealMeetingShowcaseSection
        title="线下实录参考"
        limit={2}
        description="给主管看的不是更多活动量，而是真实线下会议里哪些判断会改变推进策略、哪些会后动作值得复用。"
      />

      <SectionCard title="Rep Weekly Snapshot">
        <div className="stack-list">
          {dataset.repReportSnapshots.map((snapshot) => (
            <div className="stack-card" key={snapshot.id}>
              <div className="button-row" style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <Link href={`/sales-team/${snapshot.repId}`}>
                    <strong>{snapshot.repName}</strong>
                  </Link>
                  <p>{snapshot.summary}</p>
                </div>
                <Badge tone={snapshot.interventionCount > 0 ? "warn" : "success"}>
                  {snapshot.interventionCount > 0 ? `需介入 ${snapshot.interventionCount}` : "无需介入"}
                </Badge>
              </div>
              <div className="button-row">
                <Badge tone="info">触达 {snapshot.touchedAccountCount}</Badge>
                <Badge tone="info">会议 {snapshot.completedMeetingCount}</Badge>
                <Badge tone="success">新机会 {snapshot.newOpportunityCount}</Badge>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Drilldown">
        <div className="grid-2">
          <div className="stack-card">
            <strong>{highlightedThread ? "高风险客户线程" : "暂无高风险线程"}</strong>
            <p>{highlightedThread?.latestBlocker ?? "当前没有可下钻的高风险线程。"}</p>
            {highlightedThread ? (
              <Link className="ghost-button" href={`/customers/${highlightedThread.accountId}`}>
                查看线程
              </Link>
            ) : null}
          </div>
          <div className="stack-card">
            <strong>{highlightedDeal?.name ?? "暂无高风险 Deal"}</strong>
            <p>{highlightedDeal?.nextStepSummary ?? "当前没有可下钻的 Deal。"}</p>
            {highlightedDeal ? (
              <Link className="ghost-button" href={`/deals/${highlightedDeal.id}`}>
                查看高风险 Deal
              </Link>
            ) : null}
          </div>
        </div>
      </SectionCard>
    </>
  );
}

export function RepReportView({ repId }: { repId: string }) {
  const dataset = getMockDataset();
  const report = getRepReportByRepId(repId);
  const scorecard = dataset.repScorecards.find((item) => item.repId === repId);

  if (!report || !scorecard) {
    return <EmptyState title="销售周报不存在" description="当前无法找到这位销售的周报视图。" />;
  }

  const threads = dataset.accountThreads.filter((thread) => thread.ownerRepId === repId);

  return (
    <>
      <PageHeader
        title={report.repName}
        description={`${scorecard.teamName} · ${report.periodLabel}推进摘要`}
      />

      <div className="grid-2">
        <SectionCard title="本周结构化摘要">
          <div className="stack-list">
            <div className="stack-card">
              <strong>{report.summary}</strong>
              <p>{report.highlightedReason}</p>
            </div>
            <ul className="list-plain">
              <li>触达客户数：{report.touchedAccountCount}</li>
              <li>完成 Meeting 数：{report.completedMeetingCount}</li>
              <li>新形成商机数：{report.newOpportunityCount}</li>
              <li>推进中的商机数：{report.activeDealCount}</li>
              <li>停滞客户数：{report.stalledThreadCount}</li>
            </ul>
          </div>
        </SectionCard>

        <SectionCard title="本周关键变化">
          <div className="stack-list">
            <div className="stack-card">
              <strong>本周新增机会</strong>
              <p>{report.newOpportunityCount} 个客户线程已进入正式推进或商务推进。</p>
            </div>
            <div className="stack-card">
              <strong>待主管支持</strong>
              <p>{report.interventionCount} 个线程需要主管介入或更明确支持。</p>
            </div>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="重点对象列表">
        <div className="table-like">
          {threads.map((thread) => {
            const account = dataset.accounts.find((item) => item.id === thread.accountId);
            const deal = dataset.deals.find((item) => item.id === thread.activeDealId);
            return (
              <div className="table-row" key={thread.id}>
                <div>
                  <Link href={`/customers/${thread.accountId}`}>
                    <strong>{account?.name ?? "未知客户"}</strong>
                  </Link>
                  <span>{thread.currentFocus}</span>
                </div>
                <span>{progressLabels[thread.customerProgressStage]}</span>
                <span>{executionLabels[thread.executionState]}</span>
                <span>{deal ? formatStage(deal.stage) : "未形成 Deal"}</span>
                <span>{formatFreshness(thread.dataFreshness)}</span>
              </div>
            );
          })}
        </div>
      </SectionCard>
    </>
  );
}
