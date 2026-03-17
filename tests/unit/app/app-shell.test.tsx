import { render, screen, within } from "@testing-library/react";
import { vi } from "vitest";

import { AppShell } from "@/components/shared/ui";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

describe("app shell", () => {
  it("renders a minimal shell with left nav and no top bar or agent panel", () => {
    render(
      <AppShell>
        <div>内容</div>
      </AppShell>
    );

    expect(screen.getByRole("link", { name: "ARM" })).toHaveAttribute("href", "/");
    expect(screen.queryByText("Revenue Command Surface")).not.toBeInTheDocument();
    expect(screen.queryByText("Agent 工作台")).not.toBeInTheDocument();
    expect(screen.queryByText("Agent 已联动")).not.toBeInTheDocument();
  });

  it("renders desktop and mobile navigation with customer center", () => {
    render(
      <AppShell>
        <div>内容</div>
      </AppShell>
    );

    const desktopNav = screen.getByRole("navigation", { name: "桌面主导航" });
    const mobileNav = screen.getByRole("navigation", { name: "移动端主导航" });

    expect(within(desktopNav).getByRole("link", { name: "首页" })).toHaveAttribute("href", "/");
    expect(within(desktopNav).getByRole("link", { name: "客户" })).toHaveAttribute("href", "/customers");
    expect(within(desktopNav).getByRole("link", { name: "商机管道" })).toHaveAttribute("href", "/pipeline");
    expect(within(mobileNav).getByRole("link", { name: "客户" })).toBeInTheDocument();
  });

  it("does not render agent panel or mobile agent trigger", () => {
    render(
      <AppShell>
        <div>内容</div>
      </AppShell>
    );

    expect(screen.queryByRole("button", { name: "打开移动端 Agent 工作台" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "打开更多页面" })).not.toBeInTheDocument();
    expect(screen.queryByLabelText("移动端简报头")).not.toBeInTheDocument();
  });

  it("renders content in main area with mobile safe spacing", () => {
    render(
      <AppShell>
        <div>内容</div>
      </AppShell>
    );

    expect(screen.getByRole("main")).toHaveClass("main-content-mobile-safe");
    expect(screen.getByText("内容")).toBeVisible();
  });
});
