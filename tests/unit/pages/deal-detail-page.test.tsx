import { render, screen } from "@testing-library/react";

import DealDetailPage from "../../../app/deals/[dealId]/page";

describe("deal detail page", () => {
  it("keeps the explainable deal workflow prioritized on mobile", async () => {
    render(
      await DealDetailPage({
        params: Promise.resolve({ dealId: "deal-2" }),
      })
    );

    expect(screen.getByRole("heading", { name: "概览" }).closest(".section-card")).toHaveAttribute(
      "data-mobile-priority",
      "primary"
    );
    expect(screen.getByRole("heading", { name: "可解释智能结果" }).closest(".section-card")).toHaveAttribute(
      "data-mobile-priority",
      "primary"
    );
    expect(screen.getByRole("heading", { name: "可解释智能结果" }).closest(".section-card")).toHaveAttribute(
      "data-mobile-density",
      "feed"
    );
    expect(screen.getByRole("heading", { name: "建议动作卡" }).closest(".section-card")).toHaveAttribute(
      "data-mobile-priority",
      "primary"
    );
    expect(screen.getByRole("heading", { name: "建议动作卡" }).closest(".section-card")).toHaveAttribute(
      "data-mobile-density",
      "feed"
    );
    expect(screen.getByRole("heading", { name: "关联会议" }).closest(".section-card")).toHaveAttribute(
      "data-mobile-priority",
      "secondary"
    );
  });
});
