import { render, screen } from "@testing-library/react";

import PipelinePage from "../../../app/pipeline/page";

describe("pipeline page", () => {
  it("marks the pipeline brief and proposal board for mobile reprioritization", () => {
    render(<PipelinePage />);

    expect(screen.getByRole("heading", { name: "Agent 风险摘要" }).closest(".section-card")).toHaveAttribute(
      "data-mobile-priority",
      "primary"
    );
    expect(screen.getByRole("heading", { name: "Agent 风险摘要" }).closest(".section-card")).toHaveAttribute(
      "data-mobile-density",
      "feed"
    );
    expect(screen.getByRole("heading", { name: "看板视图（提议优先）" }).closest(".section-card")).toHaveAttribute(
      "data-mobile-priority",
      "primary"
    );
    expect(screen.getByRole("heading", { name: "看板视图（提议优先）" }).closest(".section-card")).toHaveAttribute(
      "data-mobile-density",
      "cards"
    );
    expect(screen.getByRole("heading", { name: "健康度矩阵" }).closest(".section-card")).toHaveAttribute(
      "data-mobile-collapsible",
      "true"
    );
  });
});
