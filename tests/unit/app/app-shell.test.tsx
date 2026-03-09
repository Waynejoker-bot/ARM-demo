import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { vi } from "vitest";

import { AppShell } from "@/components/shared/ui";
import { useAgentPanelStore } from "@/state/agent-panel-store";

vi.mock("next/navigation", () => ({
  usePathname: () => "/home",
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

    expect(screen.getByText("演示模式")).toBeVisible();
    expect(screen.getByText("Agent 已联动")).toBeVisible();
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
    expect(within(desktopNav).getByRole("link", { name: "首页" })).toBeInTheDocument();
    expect(within(mobileNav).getByRole("link", { name: "会议" })).toBeInTheDocument();
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
