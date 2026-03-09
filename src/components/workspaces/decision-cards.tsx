"use client";

import Link from "next/link";
import { useEffect } from "react";

import { ConfidenceBadge, DataFreshnessBadge } from "@/components/intelligence/cards";
import { Badge, PageHeader, SectionCard } from "@/components/shared/ui";
import type { AgentChatAttachment } from "@/lib/model/types";
import type {
  ContextCard,
  DecisionCard,
  RoleWorkspace,
  SystemActionCard,
  TrustCard,
} from "@/lib/role-workspaces";
import { useAgentPanelStore } from "@/state/agent-panel-store";

function formatCoverage(value: number) {
  return `覆盖率 ${Math.round(value * 100)}%`;
}

function buildDecisionCardAttachment(card: DecisionCard): AgentChatAttachment {
  return {
    type: "decision-card",
    title: card.title,
    summary: card.summary,
    recommendation: card.recommendation,
    signals: card.reasons.slice(0, 2),
    sourceLabel: card.owner,
  };
}

function DecisionCardView({ card }: { card: DecisionCard }) {
  return (
    <article
      className="workspace-card-surface workspace-decision-card"
      draggable
      onDragStart={(event) => {
        event.dataTransfer.effectAllowed = "copy";
        event.dataTransfer.setData(
          "application/x-agent-context",
          JSON.stringify(buildDecisionCardAttachment(card))
        );
      }}
    >
      <div className="workspace-card-header">
        <div>
          <span className="workspace-card-label">{card.statusLabel}</span>
          <h3 className="workspace-decision-title">{card.title}</h3>
        </div>
        <div className="workspace-card-header-actions">
          <Badge tone="info">可拖入 Agent</Badge>
          <Badge tone={card.statusTone}>{card.approvalRequired ? "待确认" : "系统跟踪中"}</Badge>
        </div>
      </div>

      <p className="workspace-decision-summary">{card.summary}</p>

      <div className="workspace-decision-sections">
        <section className="workspace-decision-block">
          <span className="workspace-card-label">经营影响</span>
          <strong>{card.impactValue}</strong>
          <p>{card.impactLabel}</p>
        </section>

        <section className="workspace-decision-block">
          <span className="workspace-card-label">建议动作</span>
          <strong>{card.recommendation}</strong>
        </section>

        <section className="workspace-decision-block">
          <span className="workspace-card-label">执行边界</span>
          <p>{card.owner}</p>
          <p>{card.dueWindow}</p>
          <p>{card.autonomyLabel}</p>
        </section>
      </div>

      <div className="workspace-chip-row">
        <ConfidenceBadge confidence={card.confidence} />
        <DataFreshnessBadge freshness={card.freshness} />
        <Badge tone="info">{formatCoverage(card.coverage)}</Badge>
      </div>

      <div className="workspace-signal-list">
        <span className="workspace-card-label">关键信号</span>
        <ul className="list-plain">
          {card.reasons.slice(0, 2).map((reason) => (
          <li key={reason}>{reason}</li>
          ))}
        </ul>
      </div>

      <div className="button-row">
        {card.links.map((link) => (
          <Link key={link.href} href={link.href} className="ghost-button">
            {link.label}
          </Link>
        ))}
      </div>
    </article>
  );
}

function ContextCardView({ card }: { card: ContextCard }) {
  return (
    <div className="workspace-card-surface">
      <span className="workspace-card-label">{card.title}</span>
      <strong>{card.highlightValue}</strong>
      <p>{card.summary}</p>
      <Badge tone={card.tone}>{card.highlightLabel}</Badge>
      <div className="button-row">
        {card.links.map((link) => (
          <Link key={link.href} href={link.href} className="ghost-button">
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function SystemActionCardView({ card }: { card: SystemActionCard }) {
  return (
    <div className="workspace-card-surface">
      <div className="workspace-card-header">
        <strong>{card.title}</strong>
        <Badge tone={card.statusTone}>{card.statusLabel}</Badge>
      </div>
      <p>{card.summary}</p>
      <div className="workspace-stat">
        <span>当前 owner</span>
        <strong>{card.owner}</strong>
      </div>
      <div className="button-row">
        {card.links.map((link) => (
          <Link key={link.href} href={link.href} className="ghost-button">
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function TrustCardView({ card }: { card: TrustCard }) {
  return (
    <div className="workspace-card-surface">
      <div className="workspace-card-header">
        <strong>{card.title}</strong>
        <Badge tone={card.severityTone}>{card.severityLabel}</Badge>
      </div>
      <p>{card.summary}</p>
      <div className="workspace-callout">
        <span className="workspace-card-label">处理建议</span>
        <strong>{card.recommendation}</strong>
      </div>
      <div className="button-row">
        {card.links.map((link) => (
          <Link key={link.href} href={link.href} className="ghost-button">
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function RoleWorkspaceView({ workspace }: { workspace: RoleWorkspace }) {
  const { setContext } = useAgentPanelStore();

  useEffect(() => {
    setContext({
      title: workspace.title,
      description: `${workspace.description} 当前主叙事：${workspace.agentBrief.summary}`,
      prompt: workspace.agentBrief.recommendedAction,
      roleHint:
        workspace.slug === "ceo-command-center"
          ? "ceo"
          : workspace.slug === "sales-manager-cockpit"
            ? "manager"
            : "rep",
      suggestedPrompts: [
        `围绕“${workspace.decisionCards[0]?.title ?? workspace.title}”我应该先问什么？`,
        "这张决策卡还缺什么信息？",
        "如果今天推进，最该先确认哪件事？",
      ],
    });
  }, [setContext, workspace]);

  return (
    <>
      <PageHeader
        title={workspace.title}
        description={workspace.description}
        action={
          <div className="button-row">
            <Badge tone="info">{workspace.eyebrow}</Badge>
            <Badge tone="warn">Agent 决策台</Badge>
          </div>
        }
      />

      <section className="workspace-hero">
        <div className="workspace-hero-stack">
          <div className="workspace-card-surface workspace-hero-card">
            <span className="workspace-card-label">{workspace.agentBrief.title}</span>
            <h2>{workspace.agentBrief.summary}</h2>
            <ul className="list-plain">
              {workspace.agentBrief.reasons.slice(0, 2).map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          </div>

          <div className="workspace-card-surface workspace-callout-card">
            <span className="workspace-card-label">建议优先动作</span>
            <strong>{workspace.agentBrief.recommendedAction}</strong>
            <p>先围绕高影响判断推进，再决定是否下钻到对象页查看证据和细节。</p>
            <div className="button-row">
              <Link href="/agent" className="primary-button">
                继续追问 Agent
              </Link>
              <Link href={workspace.decisionCards[0]?.links[0]?.href ?? "/deals"} className="ghost-button">
                查看首要证据
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SectionCard title={workspace.spotlight.title}>
        <p className="muted workspace-section-note">{workspace.spotlight.description}</p>
        <div className="workspace-decision-stack" aria-label={workspace.spotlight.title}>
          {workspace.decisionCards.map((card) => (
            <DecisionCardView key={card.id} card={card} />
          ))}
        </div>
      </SectionCard>

      <SectionCard title={workspace.secondarySection.title}>
        <p className="muted workspace-section-note">{workspace.secondarySection.description}</p>
        <div className="stack-list">
          {workspace.contextCards.map((card) => (
            <ContextCardView key={card.id} card={card} />
          ))}
        </div>
      </SectionCard>

      <SectionCard title={workspace.actionSection.title}>
        <p className="muted workspace-section-note">{workspace.actionSection.description}</p>
        <div className="stack-list">
          {workspace.systemActions.map((card) => (
            <SystemActionCardView key={card.id} card={card} />
          ))}
        </div>
      </SectionCard>

      <SectionCard title={workspace.trustSection.title}>
        <p className="muted workspace-section-note">{workspace.trustSection.description}</p>
        <div className="stack-list">
          {workspace.trustCards.map((card) => (
            <TrustCardView key={card.id} card={card} />
          ))}
        </div>
      </SectionCard>
    </>
  );
}
