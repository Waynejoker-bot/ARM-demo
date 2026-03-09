import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, vi } from "vitest";

import IntakePage from "../../../app/intake/page";

afterEach(() => {
  vi.restoreAllMocks();
});

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

  it("submits raw text for classification and shows manual follow-up when recognition confidence is low", async () => {
    const fetchMock = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        title: "未归档客户沟通",
        normalizedSourceKind: "text",
        confidence: 0.42,
        reasoning: "素材里缺少稳定映射到现有客户上下文的名称或日期。",
        needsManualInput: true,
        missingFields: ["关联客户", "会议归属"],
        candidates: [],
        questions: [
          {
            id: "material-role",
            prompt: "这条素材更像哪一类内容？",
            options: ["会后纪要", "电话补录", "仅记录为背景备注"],
            reason: "先确认内容类型。",
          },
        ],
        proposals: [
          {
            targetType: "evidence_ref",
            targetObjectId: null,
            title: "先保留为待确认素材",
            summary: "当前归属不够稳定，先不要写入业务对象。",
            confidence: 0.35,
            requiresManualReview: true,
          },
        ],
      }),
    } as Response);

    render(<IntakePage />);

    fireEvent.change(screen.getByLabelText("素材内容"), {
      target: { value: "客户说先内部看看，下周再约时间。" },
    });
    fireEvent.click(screen.getByRole("button", { name: "开始识别" }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(await screen.findByText("需要手动补充信息")).toBeVisible();
    expect(screen.getByText(/关联客户、会议归属/i)).toBeVisible();
  });
});
