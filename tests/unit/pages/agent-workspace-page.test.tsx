import { render, screen } from "@testing-library/react";

import AgentWorkspacePage from "../../../app/agent/page";

describe("agent workspace page", () => {
  it("treats conversation starters as the primary mobile feed", () => {
    render(<AgentWorkspacePage />);

    expect(screen.getByRole("heading", { name: "推荐对话" }).closest(".section-card")).toHaveAttribute(
      "data-mobile-priority",
      "primary"
    );
    expect(screen.getByRole("heading", { name: "推荐对话" }).closest(".section-card")).toHaveAttribute(
      "data-mobile-density",
      "feed"
    );
    expect(screen.getByRole("heading", { name: "最近 Agent 输出" }).closest(".section-card")).toHaveAttribute(
      "data-mobile-density",
      "feed"
    );
  });
});
