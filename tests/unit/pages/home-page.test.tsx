import { render, screen } from "@testing-library/react";

import HomePage from "../../../app/home/page";

describe("home page", () => {
  it("moves the demo description into the home header", async () => {
    render(await HomePage({}));

    expect(
      screen.getByText("以 Agent 为核心交互、以 Meeting 驱动推进、以 mock 数据完成演示闭环。")
    ).toBeVisible();
    expect(screen.getByRole("heading", { name: "销售主管首页" })).toBeVisible();
  });
});
