import { render, screen, within } from "@testing-library/react";
import { vi } from "vitest";

import { AppShell } from "@/components/shared/ui";

vi.mock("next/navigation", () => ({
  usePathname: () => "/home",
}));

describe("app shell", () => {
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
});
