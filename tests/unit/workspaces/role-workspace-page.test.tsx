import { render, screen, within } from "@testing-library/react";

import { RoleWorkspaceView } from "@/components/workspaces/decision-cards";
import { getRoleWorkspaceBySlug } from "@/lib/role-workspaces";

describe("role workspace view", () => {
  it("renders the CEO workspace as an agent-led decision surface", () => {
    const workspace = getRoleWorkspaceBySlug("ceo-command-center");

    expect(workspace).not.toBeNull();

    render(<RoleWorkspaceView workspace={workspace!} />);

    expect(screen.getByRole("heading", { name: "CEO 主控室" })).toBeVisible();
    expect(screen.getByText("Top Decisions")).toBeVisible();
    expect(screen.getByText("Interventions In Flight")).toBeVisible();
    expect(screen.getByText("Trust And Data Integrity")).toBeVisible();
    expect(screen.getByText(/待 CEO 判断/i)).toBeVisible();
  });

  it("renders decision cards as a vertical stack with grouped sections", () => {
    const workspace = getRoleWorkspaceBySlug("ceo-command-center");

    expect(workspace).not.toBeNull();

    render(<RoleWorkspaceView workspace={workspace!} />);

    const decisionRegion = screen.getByLabelText("Top Decisions");
    const decisionCards = within(decisionRegion).getAllByRole("article");

    expect(decisionCards).toHaveLength(3);
    expect(decisionRegion).toHaveClass("workspace-decision-stack");
    expect(within(decisionCards[0]).getByText("经营影响")).toBeVisible();
    expect(within(decisionCards[0]).getByText("建议动作")).toBeVisible();
    expect(within(decisionCards[0]).getByText("执行边界")).toBeVisible();
  });
});
