import { fireEvent, render, screen } from "@testing-library/react";

import DesignSystemPage from "../../../app/design-system/page";

describe("design system page", () => {
  it("renders the merged review page and the live card wall together", async () => {
    render(await DesignSystemPage());

    expect(screen.getByRole("heading", { name: "设计系统" })).toBeVisible();
    expect(screen.getByText("Background Directions")).toBeVisible();
    expect(screen.getByText("Universal Card Container")).toBeVisible();
    expect(screen.getByText("Card Gallery")).toBeVisible();
    expect(screen.getByText("手机评审模式")).toBeVisible();

    expect(screen.getByRole("heading", { name: "卡片墙" })).toBeVisible();
    expect(screen.getByText("事实卡")).toBeVisible();
    expect(screen.getByText("销售决策卡")).toBeVisible();
    expect(screen.getByText("主管决策卡")).toBeVisible();
    expect(screen.getByText("CEO 决策卡")).toBeVisible();
    expect(screen.getByText("上报卡")).toBeVisible();
    expect(screen.getByText("命令卡")).toBeVisible();
    expect(screen.getAllByText("玄河网络试点").length).toBeGreaterThan(0);
    expect(screen.getAllByText("对象").length).toBeGreaterThan(0);
    expect(screen.getAllByText("任务").length).toBeGreaterThan(0);
    expect(screen.getAllByText("关键判断").length).toBeGreaterThan(0);
    expect(screen.getAllByText("信息详情").length).toBeGreaterThan(0);
    expect(screen.getAllByText("广州紫菲网络科技").length).toBeGreaterThan(0);
    expect(screen.getAllByText("1 周内锁定二访阵容").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Atlas 赞助人线程").length).toBeGreaterThan(0);
    expect(screen.getAllByText("执行状态").length).toBeGreaterThan(0);
    expect(screen.queryAllByText("U3 级信息")).toHaveLength(0);
    expect(screen.queryAllByText("一句判断")).toHaveLength(0);
    expect(screen.queryAllByText("为什么这么判断")).toHaveLength(0);
    expect(screen.queryAllByText("来源与可信度")).toHaveLength(0);
    expect(screen.queryAllByText("正文")).toHaveLength(0);
    expect(screen.queryByText(/demo/i)).not.toBeInTheDocument();
  });

  it("opens and closes the universal container detail drilldown", async () => {
    render(await DesignSystemPage());

    fireEvent.click(screen.getByRole("button", { name: "查看信息详情" }));

    expect(screen.getByRole("dialog", { name: "信息详情样本" })).toBeVisible();
    expect(screen.getByText("当前状态")).toBeVisible();
    expect(screen.getByText("最近更新")).toBeVisible();
    expect(screen.getByText("信息来源")).toBeVisible();
    expect(screen.getByText("证据")).toBeVisible();
    expect(screen.getByText("数据完整度")).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "关闭详情" }));

    expect(screen.queryByRole("dialog", { name: "信息详情样本" })).not.toBeInTheDocument();
  });

  it("opens and closes a full-screen card reader", async () => {
    render(await DesignSystemPage());

    fireEvent.click(screen.getByRole("button", { name: "打开卡片 一线销售推进卡 广州紫菲网络科技" }));

    expect(screen.getByRole("dialog", { name: "一线销售推进卡 广州紫菲网络科技" })).toBeVisible();
    expect(screen.getByText("为什么这样判断")).toBeVisible();
    expect(screen.getByText("信息来源")).toBeVisible();
    expect(screen.getByText("最近更新")).toBeVisible();
    expect(screen.getByText("证据")).toBeVisible();
    expect(screen.getByText("数据完整度")).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "关闭卡片" }));

    expect(screen.queryByRole("dialog", { name: "一线销售推进卡 广州紫菲网络科技" })).not.toBeInTheDocument();
  });
});
