import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { DatabaseSync } from "node:sqlite";

import { conversationSeed } from "@/lib/conversational-os/seed";
import { createConversationRepository } from "@/lib/conversational-os/persistence";

function createTempDbPath() {
  const dir = mkdtempSync(join(tmpdir(), "conversational-os-"));

  return {
    dir,
    dbPath: join(dir, "conversation.sqlite"),
  };
}

describe("conversational os persistence", () => {
  it("bootstraps seed threads and cards into an empty database", () => {
    const { dir, dbPath } = createTempDbPath();

    try {
      const repository = createConversationRepository({ dbPath });
      const threads = repository.listThreads();
      const repThread = repository.getThreadState("thread-rep-yang");

      expect(threads).toHaveLength(2);
      expect(repThread.thread.title).toBe("杨文星的工作台");
      expect(repThread.cards.some((card) => card.id === "card-flow-meeting-summary")).toBe(true);
      expect(repThread.cards.find((card) => card.id === "card-flow-meeting-summary")?.createdAt).toBe(
        "2026-03-15T16:32:00+08:00"
      );
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("persists appended messages across a fresh repository read", () => {
    const { dir, dbPath } = createTempDbPath();

    try {
      const repository = createConversationRepository({ dbPath });
      repository.appendMessages([
        {
          id: "msg-runtime-1",
          threadId: "thread-rep-yang",
          actorId: "human-yang",
          actorName: "杨文星",
          kind: "human",
          body: "我已经把二访时间和材料整理好了。",
          occurredAt: "2026-03-12T01:00:00+08:00",
          visibility: "visible_to_thread",
          relatedCardId: null,
        },
      ]);

      const reloaded = createConversationRepository({ dbPath }).getThreadState("thread-rep-yang");

      expect(reloaded.messages.some((message) => message.id === "msg-runtime-1")).toBe(true);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("resets runtime state and restores the seed", () => {
    const { dir, dbPath } = createTempDbPath();

    try {
      const repository = createConversationRepository({ dbPath });
      repository.appendMessages([
        {
          id: "msg-runtime-reset",
          threadId: "thread-manager-liu",
          actorId: "human-liu",
          actorName: "刘建明",
          kind: "human",
          body: "我准备升级给 CEO。",
          occurredAt: "2026-03-12T01:01:00+08:00",
          visibility: "visible_to_thread",
          relatedCardId: null,
        },
      ]);

      repository.resetDemoState();

      const resetState = repository.getThreadState("thread-manager-liu");

      expect(resetState.messages).toHaveLength(
        conversationSeed.messages.filter((message) => message.threadId === "thread-manager-liu").length
      );
      expect(resetState.messages.some((message) => message.id === "msg-runtime-reset")).toBe(false);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("persists deliveries and thread read state across reload", () => {
    const { dir, dbPath } = createTempDbPath();

    try {
      const repository = createConversationRepository({ dbPath });
      repository.recordDelivery({
        id: "delivery-runtime-1",
        fromThreadId: "thread-manager-liu",
        toThreadId: "thread-rep-yang",
        deliveryType: "task_downstream",
        summary: "主管已确认试点边界，下达给杨文星继续执行。",
        createdAt: "2026-03-12T02:00:00+08:00",
        relatedCardId: "card-mgr-team-status",
      });
      repository.appendMessages([
        {
          id: "msg-runtime-delivery-1",
          threadId: "thread-manager-liu",
          actorId: "agent-ceo-admin",
          actorName: "CEO Agent",
          kind: "system_handoff",
          body: "CEO 已批准试点边界，回传主管继续执行。",
          occurredAt: "2026-03-12T02:00:00+08:00",
          visibility: "visible_to_thread",
          relatedCardId: null,
        },
      ]);

      let previews = repository.listThreadPreviewsWithUnread();
      expect(previews.find((thread) => thread.id === "thread-manager-liu")?.unreadCount).toBe(1);

      repository.markThreadRead("thread-manager-liu", "2026-03-17T00:00:00+08:00");

      const reloaded = createConversationRepository({ dbPath });
      previews = reloaded.listThreadPreviewsWithUnread();
      const managerState = reloaded.getThreadState("thread-manager-liu");

      expect(managerState.deliveries.some((delivery) => delivery.id === "delivery-runtime-1")).toBe(true);
      expect(previews.find((thread) => thread.id === "thread-manager-liu")?.unreadCount).toBe(0);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("persists card createdAt across reload for runtime cards", () => {
    const { dir, dbPath } = createTempDbPath();

    try {
      const repository = createConversationRepository({ dbPath });
      repository.upsertCard({
        id: "card-runtime-created-at",
        threadId: "thread-manager-liu",
        title: "运行时卡片时间",
        summary: "验证 createdAt 持久化。",
        detail: "这张卡需要在 reload 后保留 createdAt。",
        trustNote: "测试专用。",
        priorityRank: 88,
        primaryAction: "confirm",
        primaryActionLabel: "确认",
        sourceMeetingId: null,
        sourceDealId: null,
        sourceAgent: "manager_bp",
        createdAt: "2026-03-12T10:00:00+08:00",
      });

      const reloaded = createConversationRepository({ dbPath }).getThreadState("thread-manager-liu");

      expect(reloaded.cards.find((card) => card.id === "card-runtime-created-at")?.createdAt).toBe(
        "2026-03-12T10:00:00+08:00"
      );
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("repairs placeholder createdAt values for seeded cards in a migrated database", () => {
    const { dir, dbPath } = createTempDbPath();

    try {
      createConversationRepository({ dbPath });

      const db = new DatabaseSync(dbPath);
      db.prepare("UPDATE conversation_cards SET created_at = ? WHERE id = ?").run(
        "2026-03-05T00:00:00+08:00",
        "card-flow-meeting-summary"
      );
      db.close();

      const reloaded = createConversationRepository({ dbPath }).getThreadState("thread-rep-yang");

      expect(reloaded.cards.find((card) => card.id === "card-flow-meeting-summary")?.createdAt).toBe(
        "2026-03-15T16:32:00+08:00"
      );
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
