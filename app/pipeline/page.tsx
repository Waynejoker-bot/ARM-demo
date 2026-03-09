import Link from "next/link";

import { Badge, MetricCard, PageHeader, SectionCard } from "@/components/shared/ui";
import { AgentBriefCard } from "@/components/intelligence/cards";
import { PipelineProposalBoard } from "@/components/intelligence/pipeline-board";
import { getMockDataset } from "@/lib/mock-selectors";
import { formatRisk, formatStage } from "@/lib/presentation/labels";

export default function PipelinePage() {
  const { deals, agentOutputs } = getMockDataset();
  const stages = ["qualification", "demo", "proposal", "negotiation", "review"];
  const pipelineBrief = agentOutputs.find((output) => output.objectType === "pipeline");

  return (
    <>
      <PageHeader
        title="商机管道"
        description="团队风险视角下的商机推进页。拖拽只表示提议，不表示立即变更真实阶段。"
      />

      <div className="metric-grid">
        <MetricCard label="在途 Pipeline" value="$2.59M" tone="info" />
        <MetricCard label="高风险商机" value="3" tone="risk" />
        <MetricCard label="平均健康度" value="69" tone="warn" />
        <MetricCard label="后期且过期" value="2" tone="risk" />
      </div>

      {pipelineBrief ? (
        <AgentBriefCard
          title="Agent 风险摘要"
          summary={pipelineBrief.summary}
          badges={pipelineBrief.rationaleItems}
        />
      ) : null}

      <div className="grid-2">
        <SectionCard title="漏斗视图">
          <div className="chart-placeholder">
            {stages.map((stage) => {
              const stageDeals = deals.filter((deal) => deal.stage === stage);
              const total = stageDeals.reduce((sum, deal) => sum + deal.amount, 0);

              return (
                <div className="stack-card" key={stage}>
                  <strong>{formatStage(stage)}</strong>
                  <p>{stageDeals.length} 个商机 · ${total.toLocaleString()}</p>
                </div>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard title="健康度矩阵">
          <div className="chart-placeholder">
            <p className="muted">这个 mock 矩阵会刻意放大后期低健康度商机，帮助快速识别风险。</p>
            <div className="button-row">
              {deals
                .filter((deal) => ["proposal", "negotiation", "review"].includes(deal.stage))
                .map((deal) => (
                  <Badge key={deal.id} tone={deal.healthScore < 60 ? "risk" : "success"}>
                    {deal.name}
                  </Badge>
                ))}
            </div>
          </div>
        </SectionCard>
      </div>

      <PipelineProposalBoard deals={deals} />
    </>
  );
}
