"use client";

import { ConfidenceBadge, DataFreshnessBadge } from "@/components/intelligence/cards";
import { Badge } from "@/components/shared/ui";
import { selectTaskCardDetail } from "@/lib/task-cards/selectors";
import type { TaskCardActionKind, TaskCardState } from "@/lib/task-cards/types";
import { TaskCardDetail } from "@/components/task-cards/task-card-detail";

function statusLabel(status: string) {
  switch (status) {
    case "suggested":
      return "待确认";
    case "confirmed":
      return "已确认";
    case "assigned":
      return "已下发";
    case "received":
      return "已收到";
    case "accepted":
      return "已接受";
    case "reported":
      return "已汇报";
    case "reviewed":
      return "已审阅";
    case "escalated":
      return "已升级";
    case "resolved":
      return "已解决";
    case "revoked":
      return "已撤销";
    case "returned":
      return "待补充";
    default:
      return status;
  }
}

export function TaskCardShell({
  cardId,
  taskState,
  expanded,
  onToggleExpanded,
  onRunAction,
  actionDisabled = false,
}: {
  cardId: string;
  taskState: TaskCardState;
  expanded: boolean;
  onToggleExpanded: (cardId: string) => void;
  onRunAction: (cardId: string, actionKind: TaskCardActionKind) => void;
  actionDisabled?: boolean;
}) {
  const detail = selectTaskCardDetail(taskState, cardId);

  if (!detail) {
    return null;
  }

  const { card } = detail;
  const statusTone =
    card.status === "revoked"
      ? "risk"
      : card.status === "escalated" || card.status === "returned"
        ? "warn"
        : card.status === "resolved" || card.status === "confirmed"
          ? "success"
          : "info";

  return (
    <article className="task-card-surface" aria-label={card.title}>
      <div className="task-card-topline">
        <Badge tone="info">{card.level.toUpperCase()}</Badge>
        <Badge tone={statusTone}>{statusLabel(card.status)}</Badge>
        {card.escalationCategory ? <Badge tone="warn">{card.escalationCategory}</Badge> : null}
      </div>

      <h3>{card.title}</h3>
      <p>{card.summary}</p>

      <div className="task-card-meta-grid">
        <div className="stack-card">
          <span className="workspace-card-label">建议动作</span>
          <strong>{card.recommendedAction}</strong>
        </div>
        <div className="stack-card">
          <span className="workspace-card-label">为什么是现在</span>
          <p>{card.whyNow}</p>
        </div>
      </div>

      <div className="stack-card">
        <span className="workspace-card-label">{card.impactLabel}</span>
        <strong>{card.impactValue}</strong>
        <p>{card.trustNote}</p>
      </div>

      <div className="button-row">
        <ConfidenceBadge confidence={card.confidence} />
        <DataFreshnessBadge freshness={card.dataFreshness} />
        <Badge tone="info">覆盖率 {Math.round(card.coverage * 100)}%</Badge>
      </div>

      <div className="stack-list">
        {card.reasonItems.map((reason) => (
          <div className="stack-card" key={reason}>
            <strong>{reason}</strong>
          </div>
        ))}
      </div>

      <div className="button-row task-card-action-bar">
        {card.availableActions.map((action) => (
          <button
            key={action.kind}
            type="button"
            className="ghost-button"
            disabled={actionDisabled}
            onClick={() => onRunAction(card.id, action.kind)}
          >
            {action.label}
          </button>
        ))}
        <button
          type="button"
          className="ghost-button"
          disabled={actionDisabled}
          onClick={() => onToggleExpanded(card.id)}
          aria-label={`${expanded ? "收起详情" : "展开详情"}：${card.title}`}
        >
          {expanded ? "收起详情" : "展开详情"}
        </button>
      </div>

      {expanded ? <TaskCardDetail detail={detail} /> : null}
    </article>
  );
}
