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
});
