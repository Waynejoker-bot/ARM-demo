import AgentWorkspacePage from "../../../app/agent/page";

describe("agent workspace page", () => {
  it("redirects to the root conversational workspace", () => {
    expect(() => AgentWorkspacePage()).toThrow("NEXT_REDIRECT");
  });
});
