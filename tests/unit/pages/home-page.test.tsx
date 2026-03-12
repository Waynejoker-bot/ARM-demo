import { render, screen } from "@testing-library/react";

import HomePage from "../../../app/home/page";

async function renderHome(role?: "ceo" | "manager" | "rep") {
  render(
    await HomePage({
      searchParams: Promise.resolve(role ? { role } : {}),
    })
  );
}

describe("home page", () => {
  it("moves the demo description into the manager home header", async () => {
    await renderHome("manager");

    expect(
      screen.getByText("以 Agent 为核心交互、以 Meeting 驱动推进、以 mock 数据完成演示闭环。")
    ).toBeVisible();
    expect(screen.getByRole("heading", { name: "销售主管首页" })).toBeVisible();
  });

  it("marks the manager home summary and deal list for mobile-first prioritization", async () => {
    await renderHome("manager");

    expect(screen.getByRole("heading", { name: "Agent 风险摘要" }).closest(".section-card")).toHaveAttribute(
      "data-mobile-priority",
      "primary"
    );
    expect(screen.getByRole("heading", { name: "Agent 风险摘要" }).closest(".section-card")).toHaveAttribute(
      "data-mobile-density",
      "feed"
    );
    expect(screen.getByRole("heading", { name: "重点商机" }).closest(".section-card")).toHaveAttribute(
      "data-mobile-density",
      "cards"
    );
    expect(screen.getByRole("heading", { name: "团队辅导建议" }).closest(".section-card")).toHaveAttribute(
      "data-mobile-priority",
      "secondary"
    );
  });

  it("keeps the ceo home summary and strategic deals readable on mobile", async () => {
    await renderHome("ceo");

    expect(screen.getByRole("heading", { name: "经营摘要" }).closest(".section-card")).toHaveAttribute(
      "data-mobile-priority",
      "primary"
    );
    expect(screen.getByRole("heading", { name: "经营摘要" }).closest(".section-card")).toHaveAttribute(
      "data-mobile-density",
      "feed"
    );
    expect(screen.getByRole("heading", { name: "战略商机观察" }).closest(".section-card")).toHaveAttribute(
      "data-mobile-density",
      "feed"
    );
    expect(screen.getByRole("heading", { name: "收入趋势与驱动" }).closest(".section-card")).toHaveAttribute(
      "data-mobile-collapsible",
      "true"
    );
  });
});
