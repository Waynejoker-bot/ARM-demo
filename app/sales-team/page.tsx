import Link from "next/link";

import { Badge, MetricCard, PageHeader, SectionCard } from "@/components/shared/ui";
import { getMockDataset } from "@/lib/mock-selectors";
import { formatFreshness } from "@/lib/presentation/labels";

export default function SalesTeamPage() {
  const dataset = getMockDataset();
  const interventionThreads = dataset.accountThreads.filter(
    (thread) => thread.interventionNeed !== "none"
  );
  const totalMeetings = dataset.repReportSnapshots.reduce(
    (sum, report) => sum + report.completedMeetingCount,
    0
  );
  const totalNewOpportunities = dataset.repReportSnapshots.reduce(
    (sum, report) => sum + report.newOpportunityCount,
    0
  );
  const totalInterventions = dataset.repReportSnapshots.reduce(
    (sum, report) => sum + report.interventionCount,
    0
  );

  return (
    <>
      <PageHeader
        title="销售团队"
        description="面向主管的团队周报入口，先看各销售本周推进，再看需要介入的线程。"
      />

      <div className="metric-grid">
        <MetricCard
          label="本周完成 Meeting 数"
          value={`${totalMeetings}`}
          tone="positive"
        />
        <MetricCard
          label="本周新形成商机"
          value={`${totalNewOpportunities}`}
          tone="warn"
        />
        <MetricCard label="需主管介入" value={`${totalInterventions}`} tone="risk" />
        <MetricCard
          label="团队汇报覆盖"
          value={`${dataset.repReportSnapshots.length} 人`}
          tone="info"
        />
      </div>

      <SectionCard title="Rep Weekly Snapshot" mobilePriority="primary" mobileDensity="feed">
        <div className="stack-list">
          {dataset.repReportSnapshots.map((report) => (
            <div className="stack-card" key={report.id}>
              <div className="button-row" style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <Link href={`/sales-team/${report.repId}`}>
                    <strong>{report.repName}</strong>
                  </Link>
                  <p>{report.summary}</p>
                </div>
                <Badge tone={report.interventionCount > 0 ? "warn" : "success"}>
                  {report.interventionCount > 0 ? `需介入 ${report.interventionCount}` : "推进稳定"}
                </Badge>
              </div>
              <div className="button-row">
                <Badge tone="info">本周推进 {report.touchedAccountCount}</Badge>
                <Badge tone="info">Meeting {report.completedMeetingCount}</Badge>
                <Badge tone="success">新机会 {report.newOpportunityCount}</Badge>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="重点介入对象" mobilePriority="primary" mobileDensity="feed">
        <div className="stack-list">
          {interventionThreads.map((thread) => {
            const account = dataset.accounts.find((item) => item.id === thread.accountId);
            const deal = dataset.deals.find((item) => item.id === thread.activeDealId);

            return (
              <div className="stack-card" key={thread.id}>
                <div className="button-row" style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <Link href={`/customers/${thread.accountId}`}>
                      <strong>{account?.name ?? "未知客户"}</strong>
                    </Link>
                    <p>{thread.latestBlocker ?? thread.currentFocus}</p>
                  </div>
                  <Badge tone={thread.interventionNeed === "executive" ? "risk" : "warn"}>
                    {thread.interventionNeed === "executive" ? "需高层介入" : "需主管介入"}
                  </Badge>
                </div>
                <div className="button-row">
                  {deal ? (
                    <Link className="ghost-button" href={`/deals/${deal.id}`}>
                      {deal.name}
                    </Link>
                  ) : null}
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
              </div>
            );
          })}
        </div>
      </SectionCard>
    </>
  );
}
