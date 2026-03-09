"use client";

import { useMemo, useState } from "react";

import {
  applyAgentSuggestion,
  confirmAgentSuggestion,
  createAgentSuggestionState,
  syncAppliedAgentSuggestion,
} from "@/lib/semantics/agent-actions";
import {
  Badge,
  MetricCard,
  SectionCard,
} from "@/components/shared/ui";
import { formatFreshness, formatRisk, formatStage } from "@/lib/presentation/labels";
import type {
  AgentOutput,
  EvidenceRef,
  ForecastSnapshot,
  RepScorecard as RepScorecardType,
  WorkflowEvent,
} from "@/lib/domain/types";

export function KpiCard(props: {
  label: string;
  value: string;
  tone?: "default" | "risk" | "positive" | "info" | "warn";
}) {
  return <MetricCard {...props} />;
}

export function AgentBriefCard({
  title,
  summary,
  badges,
}: {
  title: string;
  summary: string;
  badges?: string[];
}) {
  return (
    <SectionCard title={title}>
      <div className="stack-list">
        <div className="stack-card">
          <strong>{summary}</strong>
        </div>
        {badges?.length ? (
          <div className="button-row">
            {badges.map((badge) => (
              <Badge key={badge} tone="info">
                {badge}
              </Badge>
            ))}
          </div>
        ) : null}
      </div>
    </SectionCard>
  );
}

export function HealthScoreRing({ score }: { score: number }) {
  const color = score >= 80 ? "#5ce1a0" : score >= 60 ? "#f6cf66" : "#ff7d7d";

  return (
    <div
      aria-label={`健康度 ${score}`}
      style={{
        width: 72,
        height: 72,
        borderRadius: "50%",
        display: "grid",
        placeItems: "center",
        background: `conic-gradient(${color} ${score}%, rgba(255,255,255,0.08) ${score}% 100%)`,
      }}
    >
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: "50%",
          display: "grid",
          placeItems: "center",
          background: "var(--panel)",
          fontWeight: 700,
        }}
      >
        {score}
      </div>
    </div>
  );
}

export function RiskTag({ risk }: { risk: "low" | "medium" | "high" }) {
  return (
    <Badge tone={risk === "high" ? "risk" : risk === "medium" ? "warn" : "success"}>
      {formatRisk(risk)}
    </Badge>
  );
}

export function StageTag({ stage }: { stage: string }) {
  return <Badge tone="info">{formatStage(stage)}</Badge>;
}

export function ConfidenceBadge({ confidence }: { confidence: number }) {
  const tone = confidence < 0.6 ? "risk" : confidence < 0.75 ? "warn" : "success";
  return <Badge tone={tone}>置信度 {Math.round(confidence * 100)}%</Badge>;
}

export function DataFreshnessBadge({
  freshness,
}: {
  freshness: "fresh" | "stale" | "missing";
}) {
  const tone = freshness === "fresh" ? "success" : freshness === "stale" ? "warn" : "risk";
  return <Badge tone={tone}>{formatFreshness(freshness)}</Badge>;
}

export function EvidenceDrawer({
  title = "证据",
  evidence,
}: {
  title?: string;
  evidence: EvidenceRef[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="stack-list">
      <button type="button" className="ghost-button" onClick={() => setOpen((value) => !value)}>
        {open ? "收起证据" : `查看证据（${evidence.length}）`}
      </button>
      {open ? (
        <div className="stack-list" aria-label={title}>
          {evidence.map((item) => (
            <div className="stack-card" key={item.id}>
              <strong>{item.relevanceReason}</strong>
              <p>{item.quote}</p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function ExplainableCard({
  title,
  summary,
  confidence,
  freshness,
  evidence,
}: {
  title: string;
  summary: string;
  confidence: number;
  freshness: "fresh" | "stale" | "missing";
  evidence: EvidenceRef[];
}) {
  return (
    <SectionCard title={title}>
      <div className="stack-list">
        <div className="stack-card">
          <strong>{summary}</strong>
          <div className="button-row">
            <ConfidenceBadge confidence={confidence} />
            <DataFreshnessBadge freshness={freshness} />
          </div>
        </div>
        <EvidenceDrawer evidence={evidence} />
      </div>
    </SectionCard>
  );
}

export function SuggestionActionCard({ output }: { output: AgentOutput }) {
  const [draft, setDraft] = useState(output.summary);
  const [state, setState] = useState(() => createAgentSuggestionState(output.id));

  const lifecycleLabel = useMemo(() => {
    if (state.syncStatus === "pending") {
      return "同步中";
    }

    switch (state.lifecycle) {
      case "suggestion":
        return "待确认";
      case "confirmed":
        return "已确认";
      case "applied":
        return "已应用";
      default:
        return state.lifecycle;
    }
  }, [state.lifecycle, state.syncStatus]);

  return (
    <SectionCard title="建议动作卡">
      <div className="stack-list">
        <label className="stack-card" htmlFor={`suggestion-${output.id}`}>
          <strong>建议内容</strong>
          <textarea
            id={`suggestion-${output.id}`}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            style={{
              width: "100%",
              minHeight: 88,
              marginTop: 10,
              background: "var(--panel-muted)",
              color: "var(--text)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              padding: 12,
            }}
          />
        </label>
        <div className="button-row">
          <Badge tone={state.syncStatus === "pending" ? "success" : "info"}>{lifecycleLabel}</Badge>
          <ConfidenceBadge confidence={output.confidence} />
        </div>
        <div className="button-row">
          <button
            type="button"
            className="ghost-button"
            onClick={() => setState(confirmAgentSuggestion(state))}
            disabled={state.lifecycle !== "suggestion"}
          >
            确认
          </button>
          <button
            type="button"
            className="ghost-button"
            onClick={() => setState(applyAgentSuggestion(state))}
            disabled={state.lifecycle !== "confirmed"}
          >
            应用到页面
          </button>
          <button
            type="button"
            className="ghost-button"
            onClick={() => setState(syncAppliedAgentSuggestion(state))}
            disabled={state.lifecycle !== "applied"}
          >
            同步到 CRM
          </button>
        </div>
        <p className="muted">
          这里严格区分“确认 / 应用 / 同步”，用于演示 Agent 生成内容进入业务系统前的完整路径。
        </p>
      </div>
    </SectionCard>
  );
}

export function ForecastCard({ snapshot }: { snapshot: ForecastSnapshot }) {
  return (
    <SectionCard title={snapshot.periodLabel}>
      <div className="stack-list">
        <div className="table-row">
          <span>总额</span>
          <strong>${snapshot.total.toLocaleString()}</strong>
        </div>
        <div className="table-row">
          <span>Commit</span>
          <strong>${snapshot.commit.toLocaleString()}</strong>
        </div>
        <div className="table-row">
          <span>Best Case</span>
          <strong>${snapshot.bestCase.toLocaleString()}</strong>
        </div>
        <div className="button-row">
          <ConfidenceBadge confidence={snapshot.confidence} />
          <Badge tone="risk">风险敞口 ${snapshot.riskExposure.toLocaleString()}</Badge>
        </div>
      </div>
    </SectionCard>
  );
}

export function RepScoreCard({ rep }: { rep: RepScorecardType }) {
  return (
    <SectionCard title={rep.repName}>
      <div className="stack-list">
        <div className="button-row">
          <HealthScoreRing score={rep.averageHealthScore} />
          <div className="stack-card">
            <strong>{rep.teamName}</strong>
            <p>{rep.coachingFocus}</p>
          </div>
        </div>
        <div className="button-row">
          <Badge tone="success">赢单率 {Math.round(rep.closeRate * 100)}%</Badge>
          <Badge tone="info">能力分 {rep.capabilityScore}</Badge>
        </div>
      </div>
    </SectionCard>
  );
}

export function WorkflowEventCard({ event }: { event: WorkflowEvent }) {
  const tone = event.status === "failed" ? "risk" : event.status === "pending" ? "warn" : "success";
  return (
    <div className="stack-card">
      <strong>{event.eventLabel}</strong>
      <p>{event.timestamp}</p>
      <Badge tone={tone}>{event.status}</Badge>
    </div>
  );
}
