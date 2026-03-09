import Link from "next/link";

import { Badge, MetricCard, PageHeader, SectionCard } from "@/components/shared/ui";
import { RepTodayCockpitView } from "@/components/workspaces/rep-today-cockpit";
import { getMockDataset } from "@/lib/mock-selectors";
import { formatFreshness, formatRisk, formatStage } from "@/lib/presentation/labels";

type RoleHome = "ceo" | "manager" | "rep";

function RoleTabs({ role }: { role: RoleHome }) {
  const tabs: Array<{ role: RoleHome; label: string }> = [
    { role: "ceo", label: "CEO" },
    { role: "manager", label: "销售主管" },
    { role: "rep", label: "一线销售" },
  ];

  return (
    <div className="button-row">
      {tabs.map((tab) => (
        <Link href={`/home?role=${tab.role}`} key={tab.role}>
          <Badge tone={tab.role === role ? "info" : "default"}>{tab.label}</Badge>
        </Link>
      ))}
    </div>
  );
}

function CeoHome() {
  const dataset = getMockDataset();
  const topDeals = dataset.deals.slice(0, 4);
  const forecast = dataset.forecastSnapshots[0];
  const highRiskDeals = dataset.deals.filter((deal) => deal.riskLevel === "high");

  return (
    <>
      <PageHeader
        title="CEO 首页"
        description="聚焦收入、预测、战略商机和组织级风险，用于快速做经营判断。"
        action={<RoleTabs role="ceo" />}
      />

      <div className="metric-grid">
        <MetricCard label="季度预测收入" value={`$${forecast.total.toLocaleString()}`} tone="info" />
        <MetricCard label="目标达成率" value="82%" tone="positive" />
        <MetricCard label="Pipeline 覆盖率" value="3.2x" tone="warn" />
        <MetricCard label="高风险金额" value={`$${highRiskDeals.reduce((sum, deal) => sum + deal.amount, 0).toLocaleString()}`} tone="risk" />
      </div>

      <div className="grid-2">
        <SectionCard title="经营摘要">
          <div className="stack-card">
            <strong>本季度收入仍有机会达标，但两个高金额商机正在拉低预测置信度。</strong>
            <p>建议优先审视 Atlas 与 Ivory 的高层赞助、法务状态和 CRM 同步质量，避免季度末出现被动。</p>
          </div>
        </SectionCard>

        <SectionCard title="组织层警报">
          <ul className="list-plain">
            {dataset.alerts.map((alert) => (
              <li key={alert.id}>{alert.title}</li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <div className="grid-2">
        <SectionCard title="战略商机观察">
          <div className="stack-list">
            {topDeals.map((deal) => (
              <div className="stack-card" key={deal.id}>
                <Link href={`/deals/${deal.id}`}>
                  <strong>{deal.name}</strong>
                </Link>
                <p>{formatStage(deal.stage)} · ${deal.amount.toLocaleString()}</p>
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

        <SectionCard title="收入趋势与驱动">
          <div className="chart-placeholder">
            <strong>Commit / Best Case / Upside</strong>
            <p className="muted">
              预测由同一批商机构成，可继续下钻到具体商机查看证据和风险来源。
            </p>
          </div>
        </SectionCard>
      </div>
    </>
  );
}

function ManagerHome() {
  const dataset = getMockDataset();
  const topDeals = dataset.deals.slice(0, 4);
  const riskyDeals = dataset.deals.filter((deal) => deal.riskLevel === "high").slice(0, 4);

  return (
    <>
      <PageHeader
        title="销售主管首页"
        description="优先判断团队风险、停滞商机、辅导重点和本周应介入的动作。"
        action={<RoleTabs role="manager" />}
      />

      <div className="metric-grid">
        <MetricCard label="本周 Pipeline 健康度" value="69" tone="info" />
        <MetricCard label="停滞商机" value="3" tone="risk" />
        <MetricCard label="本周新增商机" value="4" tone="positive" />
        <MetricCard label="团队能力评分" value="76" tone="warn" />
      </div>

      <div className="hero-grid">
        <SectionCard title="Agent 风险摘要">
          <div className="stack-list">
            <div className="stack-card">
              <strong>本周整体收入面稳定，但有 3 个后期商机需要优先介入。</strong>
              <p>
                Atlas 缺少明确的高层赞助人，Ivory 的 CRM 同步已经过期，另有一个初创客户商机缺失互动数据，导致当前评分可信度下降。
              </p>
            </div>
            <div className="button-row">
              <Badge tone="risk">Atlas 风险上升</Badge>
              <Badge tone="warn">Ivory 数据过期</Badge>
              <Badge tone="info">有销售辅导建议</Badge>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="团队判断摘要">
          <div className="stack-list">
            <div className="stack-card">
              <strong>最该介入的商机</strong>
              <p>Atlas 与 Ivory 都处于后期阶段，但前者缺高层赞助，后者缺新鲜 CRM 记录。</p>
            </div>
            <div className="stack-card">
              <strong>最该辅导的销售</strong>
              <p>Sofia 推进速度不错，但预算资格判断仍然偏弱，需要更早确认经济购买者。</p>
            </div>
            <div className="stack-card">
              <strong>本周最该看的会议</strong>
              <p>Atlas 高层对齐会和 Driftlane 初次沟通都暴露出可辅导的关键失误。</p>
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="grid-2">
        <SectionCard title="重点商机">
          <div className="table-like">
            {topDeals.map((deal) => (
              <div className="table-row" key={deal.id}>
                <div>
                  <Link href={`/deals/${deal.id}`}>
                    <strong>{deal.name}</strong>
                  </Link>
                  <span>{formatStage(deal.stage)}</span>
                </div>
                <span>{deal.healthLabel}</span>
                <span>赢单率 {Math.round(deal.winProbability * 100)}%</span>
                <span>${deal.amount.toLocaleString()}</span>
                <Badge tone={deal.riskLevel === "high" ? "risk" : "success"}>{formatRisk(deal.riskLevel)}</Badge>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="最高风险商机">
          <div className="stack-list">
            {riskyDeals.map((deal) => (
              <div className="stack-card" key={deal.id}>
                <strong>{deal.name}</strong>
                <p>{deal.nextStepSummary}</p>
                <div className="button-row">
                  <Badge tone="risk">健康度 {deal.healthScore}</Badge>
                  <Badge tone={deal.dataFreshness === "fresh" ? "success" : "warn"}>
                    {formatFreshness(deal.dataFreshness)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="grid-3">
        <SectionCard title="阶段趋势">
          <div className="chart-placeholder">
            <strong>阶段漏斗 / 转化趋势 / 平均停留时长</strong>
            <p className="muted">
              这里使用 mock 聚合数据，帮助你快速识别哪一段出现停滞和风险堆积。
            </p>
          </div>
        </SectionCard>
        <SectionCard title="团队辅导建议">
          <ul className="list-plain">
            {dataset.repScorecards.slice(0, 3).map((rep) => (
              <li key={rep.repId}>
                {rep.repName}: {rep.coachingFocus}
              </li>
            ))}
          </ul>
        </SectionCard>
        <SectionCard title="数据告警">
          <ul className="list-plain">
            {dataset.dataSources
              .filter((source) => source.status !== "connected")
              .map((source) => (
                <li key={source.id}>
                  {source.sourceName}: {source.warning}
                </li>
              ))}
          </ul>
        </SectionCard>
      </div>
    </>
  );
}

function RepHome() {
  return (
    <RepTodayCockpitView action={<RoleTabs role="rep" />} />
  );
}

export default async function HomePage({
  searchParams,
}: {
  searchParams?: Promise<{ role?: string }>;
}) {
  const params = searchParams ? await searchParams : undefined;
  const role = (params?.role as RoleHome | undefined) ?? "manager";

  if (role === "ceo") {
    return <CeoHome />;
  }

  if (role === "rep") {
    return <RepHome />;
  }

  return <ManagerHome />;
}
