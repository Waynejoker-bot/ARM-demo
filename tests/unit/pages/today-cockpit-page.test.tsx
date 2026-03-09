import { render, screen } from "@testing-library/react";

import { RepTodayCockpitView } from "@/components/workspaces/rep-today-cockpit";

describe("rep today cockpit view", () => {
  it("renders the agreed decision-first sections for frontline sales", () => {
    render(<RepTodayCockpitView />);

    expect(screen.getByRole("heading", { name: "一线销售首页" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "Agent 今日简报" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "今日会议流" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "待确认区" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "客户推进线程" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "对主管汇报草稿" })).toBeVisible();
  });

  it("lets the rep drill from today work into meetings and account threads", () => {
    render(<RepTodayCockpitView />);

    expect(screen.getByRole("link", { name: /沧澜网络试点方案沟通会/i })).toHaveAttribute(
      "href",
      "/meetings/meeting-11"
    );
    expect(screen.getByRole("link", { name: /^沧澜网络$/i })).toHaveAttribute(
      "href",
      "/customers/acc-8"
    );
  });

  it("shows the manager-facing weekly draft sourced from the rep snapshot", () => {
    render(<RepTodayCockpitView />);

    expect(screen.getByText(/本周汇报草稿/i)).toBeVisible();
    expect(screen.getByText(/林书瑶 本周推进/i)).toBeVisible();
  });

  it("surfaces Yang Wenxing's real field notes inside the rep home", () => {
    render(<RepTodayCockpitView />);

    expect(screen.getByRole("heading", { name: "真实客户推进样本" })).toBeVisible();
    expect(screen.getByText(/葫芦娃产品线团队/i)).toBeVisible();
    expect(screen.getByText(/短期更适合切入 VOD 聚合 API/i)).toBeVisible();
    expect(screen.getByRole("link", { name: /查看全部实录/i })).toHaveAttribute(
      "href",
      "/meetings"
    );
  });
});
