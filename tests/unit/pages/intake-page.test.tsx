import { render, screen, within } from "@testing-library/react";

import IntakePage from "../../../app/intake/page";

describe("intake page", () => {
  it("renders an import-first intake workspace for frontline reps", () => {
    render(<IntakePage />);

    expect(screen.getByRole("heading", { name: "素材导入" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "导入新素材" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "待确认写入" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "最近处理队列" })).toBeVisible();
  });

  it("surfaces low-confidence intake states instead of hiding them behind a generic upload shell", () => {
    render(<IntakePage />);

    const lowConfidenceSection = screen
      .getByRole("heading", { name: "低置信度提醒" })
      .closest("section");

    expect(lowConfidenceSection).not.toBeNull();

    const scoped = within(lowConfidenceSection as HTMLElement);

    const lowConfidenceCard = scoped
      .getByText("灵境娱乐法务电话录音")
      .closest(".stack-card");

    expect(lowConfidenceCard).not.toBeNull();

    const card = within(lowConfidenceCard as HTMLElement);

    expect(card.getByText("灵境娱乐法务电话录音")).toBeVisible();
    expect(card.getByText(/需要补充信息/i)).toBeVisible();
    expect(card.getByText(/会议归属/i)).toBeVisible();
  });

  it("shows source actions, candidate matches, confirmation questions, and proposal actions", () => {
    render(<IntakePage />);

    expect(screen.getByRole("button", { name: "录音" })).toBeVisible();
    expect(screen.getByRole("button", { name: "文字" })).toBeVisible();
    expect(screen.getByRole("button", { name: "邮件" })).toBeVisible();
    expect(screen.getByRole("button", { name: "链接" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "AI 识别与确认" })).toBeVisible();
    expect(screen.getByText("沧澜网络")).toBeVisible();
    expect(screen.getByText(/这条素材更像哪一类内容/i)).toBeVisible();
    expect(screen.getAllByRole("button", { name: "确认写入" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("button", { name: "暂不采用" }).length).toBeGreaterThan(0);
  });
});
