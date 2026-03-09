import Link from "next/link";

import { Badge, PageHeader, SectionCard } from "@/components/shared/ui";
import { getMockDataset } from "@/lib/mock-selectors";
import { formatFreshness, formatRisk, formatStage } from "@/lib/presentation/labels";

export default function DealsPage() {
  const { deals, accounts } = getMockDataset();

  return (
    <>
      <PageHeader
        title="商机"
        description="一个让风险、数据新鲜度和 Agent 建议一眼可见的优先级列表页。"
      />

      <SectionCard title="商机列表">
        <div className="table-like">
          {deals.map((deal) => {
            const account = accounts.find((item) => item.id === deal.accountId);

            return (
              <div className="table-row" key={deal.id}>
                <div>
                  <Link href={`/deals/${deal.id}`}>
                    <strong>{deal.name}</strong>
                  </Link>
                  <span>{account?.name}</span>
                </div>
                <span>{formatStage(deal.stage)}</span>
                <span>健康度 {deal.healthScore}</span>
                <span>赢单率 {Math.round(deal.winProbability * 100)}%</span>
                <div className="button-row">
                  <Badge tone={deal.riskLevel === "high" ? "risk" : deal.riskLevel === "medium" ? "warn" : "success"}>
                    {formatRisk(deal.riskLevel)}
                  </Badge>
                  <Badge tone={deal.dataFreshness === "fresh" ? "success" : deal.dataFreshness === "stale" ? "warn" : "risk"}>
                    {formatFreshness(deal.dataFreshness)}
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
