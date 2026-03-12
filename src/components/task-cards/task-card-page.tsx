"use client";

import { useEffect, useState } from "react";

import { PageHeader } from "@/components/shared/ui";
import { DemoModeToggle } from "@/components/task-cards/demo-mode-toggle";
import { TaskCardGrid } from "@/components/task-cards/task-card-grid";
import { selectTaskCardsForRole } from "@/lib/task-cards/selectors";
import type { TaskCardActionKind, TaskCardState } from "@/lib/task-cards/types";
import { useTaskCardDemoStore } from "@/state/task-card-demo-store";

const roleDescriptions = {
  rep: "先过今天最关键的推进卡，再决定是否汇报或申请上升。",
  manager: "先处理最该介入和最该派发的动作，再决定是否升级 CEO。",
  ceo: "只处理值得高层亲自决策或调度资源的升级介入卡。",
};

export function TaskCardPageView({ initialTaskState }: { initialTaskState: TaskCardState }) {
  const role = useTaskCardDemoStore((state) => state.role);
  const isDemoModeOpen = useTaskCardDemoStore((state) => state.isDemoModeOpen);
  const expandedCardIds = useTaskCardDemoStore((state) => state.expandedCardIds);
  const setRole = useTaskCardDemoStore((state) => state.setRole);
  const toggleDemoMode = useTaskCardDemoStore((state) => state.toggleDemoMode);
  const toggleCardExpanded = useTaskCardDemoStore((state) => state.toggleCardExpanded);
  const [taskState, setTaskState] = useState(initialTaskState);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);

  useEffect(() => {
    setTaskState(initialTaskState);
    setActionError(null);
  }, [initialTaskState]);

  async function runCardAction(cardId: string, actionKind: TaskCardActionKind) {
    try {
      setIsSubmittingAction(true);
      setActionError(null);

      const response = await fetch("/api/task-cards/actions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cardId, actionKind }),
      });

      const data = (await response.json()) as { state?: TaskCardState; message?: string };

      if (!response.ok || !data.state) {
        throw new Error(data.message ?? "任务卡动作提交失败。");
      }

      setTaskState(data.state);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "任务卡动作提交失败。");
    } finally {
      setIsSubmittingAction(false);
    }
  }

  const cards = selectTaskCardsForRole(taskState, role);

  return (
    <div className="task-card-page-stack">
      <PageHeader
        title="Agent 任务卡片版"
        description="Agent 先给出最值得处理的动作卡，再让组织按角色分层消费与流转。"
        supportingCopy={roleDescriptions[role]}
        action={
          <DemoModeToggle
            role={role}
            isOpen={isDemoModeOpen}
            onToggle={toggleDemoMode}
            onSelectRole={setRole}
          />
        }
      />

      {actionError ? (
        <div className="empty-state-card">
          <strong>任务流转失败</strong>
          <p>{actionError}</p>
        </div>
      ) : (
        <div className="stack-card">
          <span className="workspace-card-label">持久化状态</span>
          <strong>{isSubmittingAction ? "正在写入任务流转…" : "当前动作会写入本地 SQLite，刷新后仍保留。"}</strong>
        </div>
      )}

      <TaskCardGrid
        cards={cards}
        taskState={taskState}
        expandedCardIds={expandedCardIds}
        onToggleExpanded={toggleCardExpanded}
        onRunAction={runCardAction}
        actionDisabled={isSubmittingAction}
      />
    </div>
  );
}
