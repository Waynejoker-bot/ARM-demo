import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { render, screen } from "@testing-library/react";
import { afterAll, beforeAll, vi } from "vitest";

import ConversationalAgentOsPage from "../../../app/conversational-agent-os/page";

describe("conversational agent os page", () => {
  let tempDir = "";

  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-12T09:30:00+08:00"));
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), "conversational-os-page-"));
    process.env.CONVERSATIONAL_OS_DB_PATH = join(tempDir, "conversation.sqlite");
  });

  afterEach(() => {
    delete process.env.CONVERSATIONAL_OS_DB_PATH;
    rmSync(tempDir, { recursive: true, force: true });
  });

  it("renders the conversation-first workspace with the default Yang thread", async () => {
    render(await ConversationalAgentOsPage());

    expect(screen.getByRole("heading", { name: "会话版 Agent OS" })).toBeVisible();
    expect(screen.getByRole("button", { name: /杨文星私有群/i })).toBeVisible();
    expect(screen.getByRole("button", { name: /刘建明主管群/i })).toBeVisible();
    expect(screen.getByRole("button", { name: /王豪 CEO 线程/i })).toBeVisible();
    expect(screen.getAllByText("当前最重要").length).toBeGreaterThan(0);
    expect(
      screen.getAllByRole("heading", {
        name: "广州紫菲网络科技有限公司需要 1 周内锁定二访阵容",
      }).length
    ).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: "发送" })).toBeVisible();
    expect(screen.getByRole("button", { name: "重置 Demo" })).toBeVisible();
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

    render(await ConversationalAgentOsPage());

    expect(screen.getByText("1")).toBeVisible();
    expect(screen.getByRole("button", { name: /刘建明主管群/i })).toBeVisible();
  });

  it("renders relative times for messages and cards, plus an absolute time in detail", async () => {
    render(await ConversationalAgentOsPage());

    expect(screen.getAllByText("03-05 19:12").length).toBeGreaterThan(0);
    expect(screen.getAllByText("03-05 19:11").length).toBeGreaterThan(0);
    expect(screen.getByText("到达 03-05 19:11")).toBeVisible();
    expect(screen.getByText("2026-03-05 19:11")).toBeVisible();
  });
});
