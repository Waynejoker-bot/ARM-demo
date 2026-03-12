"use client";

import { Badge } from "@/components/shared/ui";
import type { RoleType } from "@/lib/domain/types";

const roleLabels: Record<RoleType, string> = {
  rep: "一线销售",
  manager: "销售主管",
  ceo: "CEO",
};

export function DemoModeToggle({
  role,
  isOpen,
  onToggle,
  onSelectRole,
}: {
  role: RoleType;
  isOpen: boolean;
  onToggle: () => void;
  onSelectRole: (role: RoleType) => void;
}) {
  return (
    <div className="task-demo-toggle">
      <button type="button" className="ghost-button" onClick={onToggle}>
        Demo Mode
      </button>
      <Badge tone="info">当前演示视角：{roleLabels[role]}</Badge>
      {isOpen ? (
        <div className="button-row" aria-label="Demo Mode Roles">
          {(["rep", "manager", "ceo"] as RoleType[]).map((candidate) => (
            <button
              key={candidate}
              type="button"
              className={candidate === role ? "primary-button" : "ghost-button"}
              onClick={() => onSelectRole(candidate)}
            >
              {roleLabels[candidate]}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
