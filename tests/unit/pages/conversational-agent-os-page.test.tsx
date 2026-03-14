import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { fireEvent, render, screen } from "@testing-library/react";
import { afterAll, beforeAll, vi } from "vitest";

import RootPage from "../../../app/page";

describe("conversational agent os page", () => {
  let tempDir = "";
  let originalMatchMedia: typeof window.matchMedia | undefined;

  function mockViewport(isMobile: boolean) {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: isMobile && query.includes("max-width: 720px"),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  }

  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-12T09:30:00+08:00"));
    originalMatchMedia = window.matchMedia;
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), "conversational-os-page-"));
    process.env.CONVERSATIONAL_OS_DB_PATH = join(tempDir, "conversation.sqlite");
    mockViewport(false);
  });

  afterEach(() => {
    delete process.env.CONVERSATIONAL_OS_DB_PATH;
    rmSync(tempDir, { recursive: true, force: true });
    if (originalMatchMedia) {
      window.matchMedia = originalMatchMedia;
    }
  });

  it("renders the conversation-first workspace with the most recently active thread selected on desktop", async () => {
    render(await RootPage());

    expect(screen.getByRole("heading", { name: "会话版 Agent OS" })).toBeVisible();
    expect(screen.getByRole("button", { name: /杨文星私有群/i })).toBeVisible();
    expect(screen.getByRole("button", { name: /刘建明主管群/i })).toBeVisible();
    expect(screen.getByRole("button", { name: /王豪 CEO 线程/i })).toBeVisible();
    expect(screen.getByRole("heading", { name: "杨文星私有群" })).toBeVisible();
    expect(screen.queryByText("置顶任务")).not.toBeInTheDocument();
    expect(screen.getAllByText("一线销售 AgentBP").length).toBeGreaterThan(0);
    expect(screen.queryByRole("button", { name: "发送当前卡片" })).not.toBeInTheDocument();
    expect(screen.getByText("今天你需要重点关注 3 件事：", { exact: false })).toBeVisible();
    expect(screen.getByRole("button", { name: "发送" })).toBeVisible();
    expect(screen.getByRole("button", { name: "重置 Demo" })).toBeVisible();

    expect(screen.getByRole("button", { name: "上传素材" })).toBeVisible();
    expect(screen.getByText("支持文字、录音、截图、邮件、链接等")).toBeVisible();
  });

  it("marks cards as confirmed in the conversation after the user takes action", async () => {
    render(await RootPage());

    const confirmButtons = screen.getAllByRole("button", { name: /确认/ });
    expect(confirmButtons.length).toBeGreaterThan(0);

    expect(screen.queryByText("已确认")).not.toBeInTheDocument();
  });

  it("groups the thread rail by role and keeps priority emphasis inside the chat stage", async () => {
    render(await RootPage());

    expect(screen.getByRole("heading", { name: "CEO" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "销售主管" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "一线销售" })).toBeVisible();
    expect(
      screen.queryByText("杨文星、一线销售 AgentBP 与主管 Agent 的协作线程。")
    ).not.toBeInTheDocument();
    expect(screen.queryByText("刘建明、主管 AgentBP 与 CEO Agent 的升级与编排线程。"))
      .not.toBeInTheDocument();
    expect(screen.queryByText("当前最重要")).not.toBeInTheDocument();
    expect(screen.queryByText("置顶任务")).not.toBeInTheDocument();
    expect(screen.getAllByText("最近消息").length).toBeGreaterThan(0);
    expect(screen.getByText("最近同步至 SQLite，可刷新后继续。")).toBeVisible();
    expect(screen.getByText("继续在当前会话里回复、追问或确认 Agent 的结论。")).toBeVisible();
  });

  it("renders unread badges in the thread list when a target thread has unread work", async () => {
    const repository = (await import("@/lib/conversational-os/persistence")).createConversationRepository({
      dbPath: process.env.CONVERSATIONAL_OS_DB_PATH,
    });

    repository.appendMessages([
      {
        id: "msg-page-unread-1",
        threadId: "thread-manager-liu",
        actorId: "agent-ceo-admin",
        actorName: "CEO Agent",
        kind: "system_handoff",
        body: "CEO 已回传新的决策摘要。",
        occurredAt: "2026-03-12T02:30:00+08:00",
        visibility: "visible_to_thread",
        relatedCardId: null,
      },
    ]);

    render(await RootPage());

    expect(screen.getByText("1")).toBeVisible();
    expect(screen.getByRole("button", { name: /刘建明主管群/i })).toBeVisible();
  });

  it("keeps desktop detail collapsed until the user opens it", async () => {
    render(await RootPage());

    expect(screen.queryByText("辅助下钻")).not.toBeInTheDocument();

    const detailButtons = screen.getAllByRole("button", { name: "查看详情" });
    expect(detailButtons.length).toBeGreaterThanOrEqual(1);

    fireEvent.click(detailButtons[0]!);

    expect(screen.getByText("辅助下钻")).toBeVisible();
  });

  it("uses push-style navigation on mobile instead of flattening thread, chat, and detail together", async () => {
    mockViewport(true);

    render(await RootPage());

    expect(screen.getByRole("button", { name: /杨文星私有群/i })).toBeVisible();
    expect(screen.queryByText("会话中")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /杨文星私有群/i }));

    expect(screen.getByRole("button", { name: "返回会话列表" })).toBeVisible();
    expect(screen.getByText("今天你需要重点关注 3 件事：", { exact: false })).toBeVisible();
    expect(screen.queryByRole("button", { name: "发送当前卡片" })).not.toBeInTheDocument();

    fireEvent.click(screen.getAllByRole("button", { name: "查看详情" })[0]!);

    expect(screen.getByRole("button", { name: "返回会话" })).toBeVisible();
    expect(screen.getByText("辅助下钻")).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "返回会话" }));
    expect(screen.getByRole("button", { name: "返回会话列表" })).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "返回会话列表" }));
    expect(screen.getByRole("button", { name: /杨文星私有群/i })).toBeVisible();
    expect(screen.queryByText("会话中")).not.toBeInTheDocument();
  });
});
