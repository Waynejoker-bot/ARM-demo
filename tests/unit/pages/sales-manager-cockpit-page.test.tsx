import { render, screen } from "@testing-library/react";

import {
  RepReportView,
  SalesManagerCockpitView,
} from "@/components/reports/report-cards";

describe("sales manager reporting surfaces", () => {
  it("renders the team brief and intervention-first manager cockpit", () => {
    render(<SalesManagerCockpitView />);

    expect(screen.getByRole("heading", { name: "Agent 主管简报" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "Team Brief Overview" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "Intervention Queue" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "Rep Weekly Snapshot" })).toBeVisible();
  });

  it("supports drilldown from manager view into reps, threads, deals, and pipeline", () => {
    render(<SalesManagerCockpitView />);

    expect(screen.getByRole("link", { name: /顾景行/i })).toHaveAttribute(
      "href",
      "/sales-team/rep-3"
    );
    expect(screen.getByRole("link", { name: /玄河网络$/i })).toHaveAttribute(
      "href",
      "/customers/acc-3"
    );
    expect(screen.getByRole("link", { name: /玄河网络发行中台升级项目/i })).toHaveAttribute(
      "href",
      "/deals/deal-2"
    );
    expect(screen.getByRole("link", { name: /查看 Pipeline/i })).toHaveAttribute(
      "href",
      "/pipeline"
    );
  });

  it("renders a rep report view as a structured weekly summary instead of an activity log", () => {
    render(<RepReportView repId="rep-2" />);

    expect(screen.getByRole("heading", { name: /林书瑶/i })).toBeVisible();
    expect(screen.getByText(/本周结构化摘要/i)).toBeVisible();
    expect(screen.getByText(/重点对象列表/i)).toBeVisible();
    expect(screen.getByText(/新形成商机数/i)).toBeVisible();
    expect(screen.getByRole("link", { name: /云岚游戏$/i })).toHaveAttribute(
      "href",
      "/customers/acc-2"
    );
  });
});
