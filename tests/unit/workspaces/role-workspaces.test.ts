import { roleWorkspaces } from "@/lib/role-workspaces";

describe("role workspaces", () => {
  it("defines three top-level decision workspaces", () => {
    expect(roleWorkspaces).toHaveLength(3);
    expect(roleWorkspaces.map((workspace) => workspace.slug)).toEqual([
      "ceo-command-center",
      "sales-manager-cockpit",
      "sales-war-room",
    ]);
  });

  it("gives every workspace an agent brief, decisions, system actions, and trust states", () => {
    for (const workspace of roleWorkspaces) {
      expect(workspace.title).toBeTruthy();
      expect(workspace.description).toBeTruthy();
      expect(workspace.agentBrief.summary).toBeTruthy();
      expect(workspace.decisionCards.length).toBeGreaterThan(0);
      expect(workspace.systemActions.length).toBeGreaterThan(0);
      expect(workspace.trustCards.length).toBeGreaterThan(0);
    }
  });
});
