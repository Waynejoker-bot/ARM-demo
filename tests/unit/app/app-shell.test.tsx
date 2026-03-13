import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { vi } from "vitest";

import { AppShell } from "@/components/shared/ui";
import { useAgentPanelStore } from "@/state/agent-panel-store";

vi.mock("next/navigation", () => ({
  usePathname: () => "/conversational-agent-os",
}));

describe("app shell", () => {
  beforeEach(() => {
    useAgentPanelStore.setState({
      ...useAgentPanelStore.getState(),
      isOpen: true,
    });
  });

  it("surfaces demo-mode context and agent linkage in the shell chrome", () => {
    render(
      <AppShell>
        <div>内容</div>
      </AppShell>
    );

    expect(screen.getByText("Revenue Command Surface")).toBeVisible();
    expect(screen.getByText("Command Search")).toBeVisible();
    expect(screen.getByText("搜索商机、会议、纪要、风险信号")).toBeVisible();
    expect(screen.getByText("演示模式")).toBeVisible();
    expect(screen.getByText("Agent 已联动")).toBeVisible();
  });

  it("keeps the left navigation brand minimal", () => {
    render(
      <AppShell>
        <div>内容</div>
      </AppShell>
    );

    const desktopNav = screen.getByRole("navigation", { name: "桌面主导航" }).closest(".left-nav");

    expect(desktopNav).not.toBeNull();
    expect(within(desktopNav!).getByText("ARM-DEMO")).toBeVisible();
    expect(within(desktopNav!).queryByText("arm-demo")).not.toBeInTheDocument();
    expect(within(desktopNav!).queryByText("AI Sales OS")).not.toBeInTheDocument();
    expect(within(desktopNav!).queryByText("Meeting-first Demo")).not.toBeInTheDocument();
    expect(
      within(desktopNav!).queryByText("以 Agent 为核心交互、以 Meeting 驱动推进、以 mock 数据完成演示闭环。")
    ).not.toBeInTheDocument();
  });

  it("renders separate desktop and mobile navigation landmarks for responsive shells", () => {
    render(
      <AppShell>
        <div>内容</div>
      </AppShell>
    );

    const desktopNav = screen.getByRole("navigation", { name: "桌面主导航" });
    const mobileNav = screen.getByRole("navigation", { name: "移动端主导航" });

    expect(desktopNav).toBeInTheDocument();
    expect(mobileNav).toBeInTheDocument();
    expect(within(desktopNav).getByRole("link", { name: "首页" })).toHaveAttribute(
      "href",
      "/conversational-agent-os"
    );
    expect(within(mobileNav).getByRole("link", { name: "会议" })).toBeInTheDocument();
  });

  it("routes the brand mark to the canonical conversational homepage", () => {
    render(
      <AppShell>
        <div>内容</div>
      </AppShell>
    );

    expect(screen.getByRole("link", { name: "ARM-DEMO" })).toHaveAttribute(
      "href",
      "/conversational-agent-os"
    );
  });

  it("exposes dedicated mobile agent and more controls", () => {
    render(
      <AppShell>
        <div>内容</div>
      </AppShell>
    );

    expect(screen.getByRole("button", { name: "打开移动端 Agent 工作台" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "打开更多页面" })).toBeInTheDocument();
  });

  it("adds mobile-specific layout hooks for briefing header and safe content spacing", () => {
    render(
      <AppShell>
        <div>内容</div>
      </AppShell>
    );

    expect(screen.getByLabelText("移动端简报头")).toBeInTheDocument();
    expect(screen.getByLabelText("移动端底部导航容器")).toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveClass("main-content-mobile-safe");
  });

  it("collapses the panel by default on narrow viewports and reopens from the mobile agent trigger", async () => {
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      writable: true,
      value: 390,
    });

    const { container } = render(
      <AppShell>
        <div>内容</div>
      </AppShell>
    );

    await waitFor(() =>
      expect(container.querySelector(".agent-panel")).toHaveAttribute(
        "data-mobile-sheet-state",
        "collapsed"
      )
    );

    fireEvent.click(screen.getByRole("button", { name: "打开移动端 Agent 工作台" }));

    await waitFor(() =>
      expect(container.querySelector(".agent-panel")).toHaveAttribute(
        "data-mobile-sheet-state",
        "expanded"
      )
    );
  });
});
