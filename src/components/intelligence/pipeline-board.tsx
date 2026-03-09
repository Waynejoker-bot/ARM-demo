"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { Badge, SectionCard } from "@/components/shared/ui";
import {
  cancelStageProposal,
  confirmStageProposal,
  createStageProposal,
  type StageProposal,
} from "@/lib/semantics/pipeline-proposals";
import { formatRisk, formatStage } from "@/lib/presentation/labels";
import type { Deal } from "@/lib/domain/types";

const visibleStages = ["demo", "proposal", "negotiation"] as const;
const nextStageByCurrent: Record<string, string> = {
  demo: "proposal",
  proposal: "negotiation",
  negotiation: "review",
};

export function PipelineProposalBoard({ deals }: { deals: Deal[] }) {
  const [proposals, setProposals] = useState<Record<string, StageProposal>>({});

  const grouped = useMemo(
    () =>
      visibleStages.map((stage) => ({
        stage,
        deals: deals.filter((deal) => {
          const proposal = proposals[deal.id];
          const displayStage =
            proposal?.status === "applied" ? proposal.appliedStage : deal.stage;
          return displayStage === stage;
        }),
      })),
    [deals, proposals]
  );

  function proposeStage(deal: Deal) {
    const nextStage = nextStageByCurrent[deal.stage];
    if (!nextStage) return;

    setProposals((current) => ({
      ...current,
      [deal.id]: createStageProposal({
        dealId: deal.id,
        committedStage: deal.stage,
        proposedStage: nextStage,
      }),
    }));
  }

  return (
    <SectionCard title="看板视图（提议优先）">
      <div className="grid-3">
        {grouped.map(({ stage, deals: stageDeals }) => (
          <div className="stack-card" key={stage}>
            <strong>{formatStage(stage)}</strong>
            <div className="stack-list">
              {stageDeals.map((deal) => {
                const proposal = proposals[deal.id];
                const hasPendingProposal = proposal?.status === "pending";

                return (
                  <div className="stack-card" key={deal.id}>
                    <Link href={`/deals/${deal.id}`}>
                      <strong>{deal.name}</strong>
                    </Link>
                    <p>{deal.nextStepSummary}</p>
                    <div className="button-row">
                      <Badge tone={deal.riskLevel === "high" ? "risk" : "warn"}>
                        {formatRisk(deal.riskLevel)}
                      </Badge>
                      {proposal ? (
                        <Badge tone={proposal.status === "applied" ? "success" : "info"}>
                          {proposal.status === "pending"
                            ? `阶段提议：${formatStage(proposal.proposedStage)}`
                            : proposal.status === "applied"
                              ? `已应用：${formatStage(proposal.appliedStage)}`
                              : "提议已取消"}
                        </Badge>
                      ) : (
                        <Badge tone="info">当前已提交阶段：{formatStage(deal.stage)}</Badge>
                      )}
                    </div>
                    <div className="button-row">
                      <button
                        type="button"
                        className="ghost-button"
                        onClick={() => proposeStage(deal)}
                        disabled={Boolean(proposal) || !nextStageByCurrent[deal.stage]}
                      >
                        提议推进到下一阶段
                      </button>
                      <button
                        type="button"
                        className="ghost-button"
                        onClick={() =>
                          setProposals((current) => ({
                            ...current,
                            [deal.id]: confirmStageProposal(current[deal.id]),
                          }))
                        }
                        disabled={!hasPendingProposal}
                      >
                        确认并应用
                      </button>
                      <button
                        type="button"
                        className="ghost-button"
                        onClick={() =>
                          setProposals((current) => ({
                            ...current,
                            [deal.id]: cancelStageProposal(current[deal.id]),
                          }))
                        }
                        disabled={!hasPendingProposal}
                      >
                        取消提议
                      </button>
                    </div>
                    {proposal?.status === "applied" ? (
                      <p className="muted">阶段已应用到当前页面状态，但还没有同步到 CRM。</p>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
