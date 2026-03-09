import { render, screen } from "@testing-library/react";
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

  it("keeps the left navigation brand minimal", () => {
    render(
      <AppShell>
        <div>内容</div>
      </AppShell>
    );

    expect(screen.getByText("ARM-DEMO")).toBeVisible();
    expect(screen.queryByText("arm-demo")).not.toBeInTheDocument();
    expect(screen.queryByText("AI Sales OS")).not.toBeInTheDocument();
    expect(screen.queryByText("Meeting-first Demo")).not.toBeInTheDocument();
    expect(
      screen.queryByText("以 Agent 为核心交互、以 Meeting 驱动推进、以 mock 数据完成演示闭环。")
    ).not.toBeInTheDocument();
  });
});
