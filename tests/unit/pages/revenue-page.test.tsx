import { render, screen } from "@testing-library/react";

import RevenuePage from "../../../app/revenue/page";

describe("revenue page", () => {
  it("keeps the revenue brief and forecast surfaces mobile-friendly", () => {
    render(<RevenuePage />);

    expect(screen.getByRole("heading", { name: "Agent 收入摘要" }).closest(".section-card")).toHaveAttribute(
      "data-mobile-priority",
      "primary"
    );
    expect(screen.getByRole("heading", { name: "Agent 收入摘要" }).closest(".section-card")).toHaveAttribute(
      "data-mobile-density",
      "feed"
    );
    expect(screen.getByRole("heading", { name: "核心收入驱动" }).closest(".section-card")).toHaveAttribute(
      "data-mobile-density",
      "feed"
    );
    expect(screen.getByRole("heading", { name: "2026 年第一季度" }).closest(".section-card")).toHaveAttribute(
      "data-mobile-density",
      "cards"
    );
    expect(screen.getByRole("heading", { name: "情景模拟" }).closest(".section-card")).toHaveAttribute(
      "data-mobile-collapsible",
      "true"
    );
  });
});
