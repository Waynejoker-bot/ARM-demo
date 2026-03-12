"use client";

import type { TaskCardActionKind, TaskCardRecord, TaskCardState } from "@/lib/task-cards/types";
import { TaskCardShell } from "@/components/task-cards/task-card-shell";

export function TaskCardGrid({
  cards,
  taskState,
  expandedCardIds,
  onToggleExpanded,
  onRunAction,
  actionDisabled,
}: {
  cards: TaskCardRecord[];
  taskState: TaskCardState;
  expandedCardIds: string[];
  onToggleExpanded: (cardId: string) => void;
  onRunAction: (cardId: string, actionKind: TaskCardActionKind) => void;
  actionDisabled?: boolean;
}) {
  const [primaryCard, ...secondaryCards] = cards;

  return (
    <div className="task-card-grid-root">
      {primaryCard ? (
        <div className="task-card-primary">
          <TaskCardShell
            cardId={primaryCard.id}
            taskState={taskState}
            expanded={expandedCardIds.includes(primaryCard.id)}
            onToggleExpanded={onToggleExpanded}
            onRunAction={onRunAction}
            actionDisabled={actionDisabled}
          />
        </div>
      ) : null}

      {secondaryCards.length ? (
        <div className="task-card-secondary-grid">
          {secondaryCards.map((card) => (
            <TaskCardShell
              key={card.id}
              cardId={card.id}
              taskState={taskState}
              expanded={expandedCardIds.includes(card.id)}
              onToggleExpanded={onToggleExpanded}
              onRunAction={onRunAction}
              actionDisabled={actionDisabled}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
