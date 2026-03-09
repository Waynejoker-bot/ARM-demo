import { notFound } from "next/navigation";

import { Badge, PageHeader, SectionCard } from "@/components/shared/ui";
import {
  ExplainableCard,
  HealthScoreRing,
  RiskTag,
  StageTag,
  SuggestionActionCard,
} from "@/components/intelligence/cards";
import {
  getAccountById,
  getAgentOutputsForObject,
  getDealById,
  getEvidenceForIds,
  getMeetingsForDeal,
} from "@/lib/mock-selectors";
import {
  formatEvidenceSource,
  formatFreshness,
  formatMeetingType,
  formatRisk,
  formatSummaryStatus,
} from "@/lib/presentation/labels";

export default async function DealDetailPage({
  params,
}: {
  params: Promise<{ dealId: string }>;
}) {
  const { dealId } = await params;
  const deal = getDealById(dealId);

  if (!deal) {
    notFound();
  }

  const account = getAccountById(deal.accountId);
  const meetings = getMeetingsForDeal(deal.id);
  const outputs = getAgentOutputsForObject("deal", deal.id);
  const primaryOutput = outputs[0];
  const evidence = primaryOutput ? getEvidenceForIds(primaryOutput.evidenceRefs) : [];

  return (
    <>
      <PageHeader
        title={deal.name}
        description={`${account?.name ?? "未知客户"} · ${deal.currency} ${deal.amount.toLocaleString()}`}
        action={
          <div className="button-row">
            <StageTag stage={deal.stage} />
            <RiskTag risk={deal.riskLevel} />
            <Badge tone={deal.dataFreshness === "fresh" ? "success" : deal.dataFreshness === "stale" ? "warn" : "risk"}>
              {formatFreshness(deal.dataFreshness)}
            </Badge>
          </div>
        }
      />

      <div className="grid-3">
        <SectionCard title="概览" mobilePriority="primary" mobileDensity="feed">
          <div className="stack-list">
            <div className="button-row">
              <HealthScoreRing score={deal.healthScore} />
              <div className="stack-card">
                <strong>{deal.healthLabel}</strong>
                <p>负责人：{deal.ownerRepId}</p>
              </div>
            </div>
            <ul className="list-plain">
              <li>赢单率：{Math.round(deal.winProbability * 100)}%</li>
              <li>数据覆盖率：{Math.round(deal.dataCoverage * 100)}%</li>
              <li>最近更新：{new Date(deal.updatedAt).toLocaleString()}</li>
            </ul>
          </div>
        </SectionCard>

        {primaryOutput ? (
          <ExplainableCard
            title="可解释智能结果"
            summary={primaryOutput.summary}
            confidence={primaryOutput.confidence}
            freshness={deal.dataFreshness}
            evidence={evidence}
            mobilePriority="primary"
            mobileDensity="feed"
          />
        ) : (
          <SectionCard title="可解释智能结果" mobilePriority="primary" mobileDensity="feed">
            <div className="stack-card">
              <strong>暂无 Agent 结论</strong>
              <p>这条商机还没有可展示的智能结论。</p>
            </div>
          </SectionCard>
        )}

        {primaryOutput ? (
          <SuggestionActionCard
            output={primaryOutput}
            mobilePriority="primary"
            mobileDensity="feed"
          />
        ) : (
          <div />
        )}
      </div>

      <div className="grid-2">
        <SectionCard title="证据依据" mobileDensity="feed">
          <div className="stack-list">
            {evidence.map((item) => (
              <div className="stack-card" key={item.id}>
                <strong>{formatEvidenceSource(item.sourceType)}</strong>
                <p>{item.quote}</p>
                <p className="muted">{item.relevanceReason}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="关联会议" mobilePriority="secondary" mobileDensity="feed">
          <div className="stack-list">
            {meetings.map((meeting) => (
              <div className="stack-card" key={meeting.id}>
                <strong>{meeting.title}</strong>
                <p>{formatMeetingType(meeting.meetingType)} · {formatSummaryStatus(meeting.summaryStatus)}</p>
                <div className="button-row">
                  <Badge tone={meeting.riskSignalPresent ? "risk" : "success"}>
                    {meeting.riskSignalPresent ? "存在风险信号" : "状态稳定"}
                  </Badge>
                  <Badge tone={meeting.transcriptStatus === "missing" ? "risk" : "info"}>
                    {meeting.transcriptStatus === "missing" ? "缺少转录" : "转录可用"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </>
  );
}
