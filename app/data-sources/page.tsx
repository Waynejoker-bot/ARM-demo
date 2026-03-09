import Link from "next/link";

import { Badge, PageHeader, SectionCard } from "@/components/shared/ui";
import { getMockDataset } from "@/lib/mock-selectors";
import { formatSourceStatus, formatSourceType } from "@/lib/presentation/labels";

export default function DataSourcesPage() {
  const { dataSources, deals } = getMockDataset();
  const disconnected = dataSources.filter((source) => source.status === "disconnected");
  const degradedDeals = deals.filter(
    (deal) => deal.dataFreshness !== "fresh" || deal.dataCoverage < 0.7
  );

  return (
    <>
      <PageHeader
        title="数据接入"
        description="一个专门说明覆盖率、最近同步时间，以及数据缺失如何影响 AI 可信度的透明页面。"
      />

      <SectionCard title="接入源状态">
        <div className="table-like">
          {dataSources.map((source) => (
            <div className="table-row" key={source.id}>
              <div>
                <strong>{source.sourceName}</strong>
                <span>{formatSourceType(source.sourceType)}</span>
              </div>
              <span>覆盖率 {Math.round(source.coverage * 100)}%</span>
              <span>{source.lastSyncedAt ? new Date(source.lastSyncedAt).toLocaleString() : "暂无最近同步"}</span>
              <span>{source.warning ?? "当前没有告警"}</span>
              <Badge tone={source.status === "disconnected" ? "risk" : source.status === "warning" ? "warn" : "success"}>
                {formatSourceStatus(source.status)}
              </Badge>
            </div>
          ))}
        </div>
      </SectionCard>

      <div className="grid-2">
        <SectionCard title="受影响页面与对象">
          <div className="stack-list">
            {degradedDeals.map((deal) => (
              <div className="stack-card" key={deal.id}>
                <strong>{deal.name}</strong>
                <p>
                  由于数据新鲜度或覆盖率不足，这条商机会在首页、收入中心、商机详情中降低可信度展示。
                </p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="当前断连影响">
          <div className="stack-list">
            {disconnected.map((source) => (
              <div className="stack-card" key={source.id}>
                <strong>{source.sourceName}</strong>
                <p>{source.warning ?? "当前没有告警"}</p>
                <Badge tone="risk">会让会议总结与证据链降级</Badge>
                <Link href="/deals/deal-5">查看受影响商机</Link>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </>
  );
}
