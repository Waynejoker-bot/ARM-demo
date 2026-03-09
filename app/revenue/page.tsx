import Link from "next/link";

import { Badge, MetricCard, PageHeader, SectionCard } from "@/components/shared/ui";
import { AgentBriefCard, ForecastCard } from "@/components/intelligence/cards";
import { getMockDataset } from "@/lib/mock-selectors";
import { formatFreshness, formatRisk } from "@/lib/presentation/labels";

export default function RevenuePage() {
  const { forecastSnapshots, deals, agentOutputs } = getMockDataset();
  const forecast = forecastSnapshots[0];
  const brief = agentOutputs.find((output) => output.objectType === "revenue");

  return (
    <>
      <PageHeader
        title="收入中心"
        description="收入预测与全局商机、风险信号和数据可信度保持一致，不是独立报表。"
      />

      <div className="metric-grid">
        <MetricCard label="总预测收入" value={`$${forecast.total.toLocaleString()}`} tone="info" />
        <MetricCard label="Commit" value={`$${forecast.commit.toLocaleString()}`} tone="positive" />
        <MetricCard label="Best Case" value={`$${forecast.bestCase.toLocaleString()}`} tone="warn" />
        <MetricCard label="风险暴露" value={`$${forecast.riskExposure.toLocaleString()}`} tone="risk" />
      </div>

      <div className="grid-2">
        {brief ? (
          <AgentBriefCard
            title="Agent 收入摘要"
            summary={brief.summary}
            badges={[
              `置信度 ${Math.round(brief.confidence * 100)}%`,
              ...brief.rationaleItems,
            ]}
          />
        ) : null}

        <SectionCard title="核心收入驱动">
          <div className="stack-list">
            {deals.slice(0, 4).map((deal) => (
              <div className="stack-card" key={deal.id}>
                <Link href={`/deals/${deal.id}`}>
                  <strong>{deal.name}</strong>
                </Link>
                <p>${deal.amount.toLocaleString()} · 赢单率 {Math.round(deal.winProbability * 100)}%</p>
                <div className="button-row">
                  <Badge tone={deal.riskLevel === "high" ? "risk" : "success"}>{formatRisk(deal.riskLevel)}</Badge>
                  <Badge tone={deal.dataFreshness === "fresh" ? "success" : "warn"}>
                    {formatFreshness(deal.dataFreshness)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="grid-2">
        <ForecastCard snapshot={forecast} />
        <SectionCard title="情景模拟">
          <div className="stack-list">
            <div className="stack-card">
              <strong>如果 Atlas 或 Ivory 再延后一周，首先下滑的是预测置信度。</strong>
              <p className="muted">
                这里不掩盖数据问题，而是直接把过期、缺失和高风险对象映射到收入可信度。
              </p>
            </div>
            <div className="stack-card">
              <strong>为什么风险上升</strong>
              <p>因为两个大型商机同时存在高层赞助或同步质量问题，削弱了预测的可解释性。</p>
            </div>
          </div>
        </SectionCard>
      </div>
    </>
  );
}
