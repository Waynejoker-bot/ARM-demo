import type { ReactNode } from "react";

import { Badge } from "@/components/shared/ui";
import type { ActionCardMetricTone, ActionCardRecord } from "@/lib/design-system-action-card";

function getStatusTone(status: string): "default" | "info" | "success" | "warn" | "risk" {
  if (status.includes("撤销")) {
    return "risk";
  }

  if (status.includes("低置信度") || status.includes("待")) {
    return "warn";
  }

  if (status.includes("升级") || status.includes("下发") || status.includes("执行")) {
    return "info";
  }

  return "success";
}

function getMetricTone(tone?: ActionCardMetricTone): "default" | "info" | "success" | "warn" | "risk" {
  return tone ?? "default";
}

export function ActionCardTopline({ card }: { card: ActionCardRecord }) {
  return (
    <div className="action-card-topline">
      <Badge tone="info">{card.eyebrow}</Badge>
      <Badge tone={getStatusTone(card.status)}>{card.status}</Badge>
    </div>
  );
}

export function ActionCardBody({
  card,
  heading,
}: {
  card: ActionCardRecord;
  heading: ReactNode;
}) {
  return (
    <div className="action-card-body">
      <div className="action-card-group">
        <span className="action-card-label">{card.subjectLabel}</span>
        <div className="action-card-subject">{heading}</div>
      </div>

      <div className="action-card-group">
        <span className="action-card-label">任务</span>
        <p>{card.task}</p>
      </div>

      <div className="action-card-group">
        <span className="action-card-label">关键判断</span>
        <p className="action-card-judgment">{card.judgment}</p>
      </div>
    </div>
  );
}

export function ActionCardFooter({
  card,
  actionClassName = "primary-button",
  actionInteractive = true,
}: {
  card: ActionCardRecord;
  actionClassName?: string;
  actionInteractive?: boolean;
}) {
  return (
    <div className="action-card-footer">
      <div className="action-card-metric" aria-label={`${card.metric.label} ${card.metric.value}`}>
        <span className="action-card-label">{card.metric.label}</span>
        <Badge tone={getMetricTone(card.metric.tone)}>{card.metric.value}</Badge>
      </div>

      <div className="action-card-action">
        <span className="action-card-label">下一步</span>
        {actionInteractive ? (
          <button type="button" className={actionClassName}>
            {card.primaryAction}
          </button>
        ) : (
          <span className={`${actionClassName} action-card-action-static`}>{card.primaryAction}</span>
        )}
      </div>
    </div>
  );
}

export function ActionCardDetailSections({ card }: { card: ActionCardRecord }) {
  return (
    <div className="action-card-detail-sections">
      <section className="action-card-detail-section">
        <span className="action-card-detail-label">为什么这样判断</span>
        <p>{card.details.reason}</p>
      </section>

      <section className="action-card-detail-section">
        <span className="action-card-detail-label">信息来源</span>
        <p>{card.details.source}</p>
      </section>

      <section className="action-card-detail-section">
        <span className="action-card-detail-label">最近更新</span>
        <p>{card.details.updatedAt}</p>
      </section>

      <section className="action-card-detail-section">
        <span className="action-card-detail-label">证据</span>
        <p>{card.details.evidence}</p>
      </section>

      <section className="action-card-detail-section">
        <span className="action-card-detail-label">数据完整度</span>
        <p>{card.details.completeness}</p>
      </section>
    </div>
  );
}
