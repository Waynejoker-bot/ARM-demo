import { render, screen } from "@testing-library/react";

import AgentTaskCardsPage from "../../../app/agent-task-cards/page";

describe("agent task cards page", () => {
  it("renders the standalone task-card shell for the rep view by default", async () => {
    render(await AgentTaskCardsPage());

    expect(screen.getByRole("heading", { name: "Agent 任务卡片版" })).toBeVisible();
    expect(screen.getByText("当前演示视角：一线销售")).toBeVisible();
    expect(screen.getByRole("button", { name: "Demo Mode" })).toBeVisible();
    expect(screen.getByText("广州紫菲网络科技有限公司需要 1 周内二访验证试点切口")).toBeVisible();
    expect(
      screen.getByRole("button", {
        name: /展开详情：广州紫菲网络科技有限公司需要 1 周内二访验证试点切口/i,
      })
    ).toBeVisible();
  });
});
