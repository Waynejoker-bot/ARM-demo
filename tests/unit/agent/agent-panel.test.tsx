import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";

import { AgentPanel } from "@/components/agent/agent-panel";

const context = {
  title: "CEO 主控室",
  description: "当前页面聚焦收入偏差与战略商机判断。",
  prompt: "在当前上下文里，我最应该优先处理什么？",
  roleHint: "ceo" as const,
};

describe("agent panel", () => {
  it("uses collapse and expand actions instead of a close button", () => {
    const onCollapse = vi.fn();
    const onExpand = vi.fn();

    const { rerender } = render(
      <AgentPanel context={context} isOpen onCollapse={onCollapse} onExpand={onExpand} />
    );

    fireEvent.click(screen.getByRole("button", { name: "收起 Agent 面板" }));
    expect(onCollapse).toHaveBeenCalledTimes(1);

    rerender(
      <AgentPanel context={context} isOpen={false} onCollapse={onCollapse} onExpand={onExpand} />
    );

    fireEvent.click(screen.getByRole("button", { name: "展开 Agent 面板" }));
    expect(onExpand).toHaveBeenCalledTimes(1);
  });

  it("sends typed user input together with page context and dragged cards", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ message: "先补高层赞助人的确认信息。" }),
    });

    vi.stubGlobal("fetch", fetchMock);

    render(<AgentPanel context={context} isOpen onCollapse={vi.fn()} onExpand={vi.fn()} />);

    const composer = screen.getByLabelText("Agent 输入区");

    fireEvent.drop(composer, {
      dataTransfer: {
        getData: (type: string) =>
          type === "application/x-agent-context"
            ? JSON.stringify({
                type: "decision-card",
                title: "玄河网络需要 CEO 级经营关注",
                summary: "这条高价值商机已经开始影响本季度达标路径。",
                recommendation: "要求主管重建高层赞助人与采购的推进共识。",
                signals: ["后期 deal 没有明确日期化下一步。"],
              })
            : "",
      },
    });

    expect(screen.getByText("玄河网络需要 CEO 级经营关注")).toBeVisible();

    fireEvent.change(screen.getByLabelText("Agent 输入"), {
      target: { value: "这张决策卡还缺什么信息？" },
    });
    fireEvent.click(screen.getByRole("button", { name: "发送给 Agent" }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

    const [, options] = fetchMock.mock.calls[0];
    const body = JSON.parse(options.body as string);

    expect(body.prompt).toBe("这张决策卡还缺什么信息？");
    expect(body.contextTitle).toBe("CEO 主控室");
    expect(body.attachments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: "玄河网络需要 CEO 级经营关注",
        }),
      ])
    );
  });

  it("keeps context, thread, and composer inside one scrollable region", () => {
    render(<AgentPanel context={context} isOpen onCollapse={vi.fn()} onExpand={vi.fn()} />);

    const scrollRegion = screen.getByLabelText("Agent 面板滚动区");

    expect(scrollRegion).toContainElement(screen.getByText("当前任务"));
    expect(scrollRegion).toContainElement(screen.getByLabelText("Agent 输入区"));
    expect(scrollRegion).toContainElement(screen.getByRole("button", { name: "发送给 Agent" }));
  });

  it("removes redundant explanatory copy and keeps the composer compact", () => {
    render(<AgentPanel context={context} isOpen onCollapse={vi.fn()} onExpand={vi.fn()} />);

    expect(screen.queryByText(context.description)).not.toBeInTheDocument();
    expect(screen.queryByText("当前页上下文")).not.toBeInTheDocument();
    expect(
      screen.queryByText("输入你的问题，或把左侧决策卡拖到这里作为附加上下文。")
    ).not.toBeInTheDocument();

    const quickQuestions = screen.getAllByRole("button", { name: /缺什么信息|下一步做什么|为什么还没到商机阶段/ });
    expect(quickQuestions.length).toBeLessThanOrEqual(2);

    const composer = screen.getByLabelText("Agent 输入区");
    expect(composer).toContainElement(screen.getByRole("button", { name: "发送给 Agent" }));
  });

  it("shows attachments as compact chips instead of large context cards", () => {
    render(<AgentPanel context={context} isOpen onCollapse={vi.fn()} onExpand={vi.fn()} />);

    const composer = screen.getByLabelText("Agent 输入区");

    fireEvent.drop(composer, {
      dataTransfer: {
        getData: () =>
          JSON.stringify({
            type: "decision-card",
            title: "曜石游戏新作买量试用项目",
            summary: "当前不应直接进入报价。",
          }),
      },
    });

    expect(screen.getByText("曜石游戏新作买量试用项目")).toBeVisible();
    expect(screen.queryByText("决策卡上下文")).not.toBeInTheDocument();
  });

  it("exposes mobile sheet state hooks when the panel is expanded or collapsed", () => {
    const onCollapse = vi.fn();
    const onExpand = vi.fn();

    const { rerender } = render(
      <AgentPanel context={context} isOpen onCollapse={onCollapse} onExpand={onExpand} />
    );

    expect(screen.getByLabelText("移动端 Agent 抽屉把手")).toBeInTheDocument();
    expect(screen.getByRole("complementary")).toHaveAttribute("data-mobile-sheet-state", "expanded");

    rerender(
      <AgentPanel context={context} isOpen={false} onCollapse={onCollapse} onExpand={onExpand} />
    );

    expect(screen.getByRole("complementary")).toHaveAttribute("data-mobile-sheet-state", "collapsed");
  });
});
