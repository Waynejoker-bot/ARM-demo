import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { vi } from "vitest";

vi.mock("@/lib/conversational-os/model", () => ({
  generateConversationalAgentTurn: vi.fn(),
}));

import { conversationSeed, defaultThreadId } from "@/lib/conversational-os/seed";
import { createConversationRepository } from "@/lib/conversational-os/persistence";
import { generateConversationalAgentTurn } from "@/lib/conversational-os/model";
import { GET as getThreads } from "../../../app/api/conversational-os/threads/route";
import { GET as getThread } from "../../../app/api/conversational-os/threads/[threadId]/route";
import { POST as postMessage } from "../../../app/api/conversational-os/messages/route";
import { POST as postReset } from "../../../app/api/conversational-os/reset/route";

const mockedGenerateConversationalAgentTurn = vi.mocked(generateConversationalAgentTurn);

function createTempDbPath() {
  const dir = mkdtempSync(join(tmpdir(), "conversational-os-routes-"));

  return {
    dir,
    dbPath: join(dir, "conversation.sqlite"),
  };
}

describe("conversational os routes", () => {
  let tempDir = "";
  let dbPath = "";

  beforeEach(() => {
    const temp = createTempDbPath();
    tempDir = temp.dir;
    dbPath = temp.dbPath;
    process.env.CONVERSATIONAL_OS_DB_PATH = dbPath;
  });

  afterEach(() => {
    delete process.env.CONVERSATIONAL_OS_DB_PATH;
    vi.clearAllMocks();
    rmSync(tempDir, { recursive: true, force: true });
  });

  it("lists the seeded conversation threads", async () => {
    const response = await getThreads();
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.defaultThreadId).toBe(defaultThreadId);
    expect(payload.threads).toHaveLength(2);
    expect(payload.threads[0]?.title).toBe("杨文星的工作台");
    expect(payload.threads[0]?.unreadCount).toBeGreaterThanOrEqual(0);
    expect(payload.threads[1]?.unreadCount).toBeGreaterThanOrEqual(0);
  });

  it("returns a single thread with pinned card and visible activity", async () => {
    const response = await getThread(new Request("http://localhost/api/conversational-os/threads/thread-rep-yang"), {
      params: Promise.resolve({ threadId: "thread-rep-yang" }),
    });
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.thread.id).toBe("thread-rep-yang");
    expect(payload.pinnedCard.id).toBe("card-flow-meeting-summary");
    expect(payload.messages.length).toBeGreaterThan(0);
    expect(payload.handoffs.some((handoff: { id: string }) => handoff.id === "handoff-risk-to-manager")).toBe(
      true
    );
  });

  it("writes a user message, model reply, summary handoff, and target-thread card", async () => {
    mockedGenerateConversationalAgentTurn
      .mockResolvedValueOnce({
        assistantMessage: "我先帮你把二访信息整理成上报摘要。",
        shouldCreateCard: true,
        cardPayload: {
          title: "紫菲二访已锁定，等待主管判断是否升级",
          summary: "二访时间已确认，建议主管判断是否需要额外资源。",
          detail: "杨文星已把时间、问题和材料收束完成，下一步适合正式上报主管。",
          trustNote: "基于当前私有群消息和真实会议证据。",
          priorityRank: 95,
          primaryAction: "report_upstream",
          primaryActionLabel: "上报主管",
          sourceMeetingId: "meeting-real-1",
          sourceDealId: "deal-real-1",
          sourceAgent: "deal_agent",
        },
        shouldHandoff: true,
        handoffSummary: "杨文星已锁定二访时间，建议主管评估资源与是否升级。",
      })
      .mockResolvedValueOnce({
        assistantMessage: "我已收到上报摘要，当前先给刘建明一张编排卡。",
        shouldCreateCard: true,
        cardPayload: {
          title: "刘建明需要判断紫菲是否升级到 CEO",
          summary: "当前先决定二访阵容和资源，如果超出主管边界再升级。",
          detail: "主管看到的是上报摘要，不是下层完整处理过程；当前要判断是否调资源或继续上升。",
          trustNote: "来自下游摘要回传与杨文星真实会议材料。",
          priorityRank: 97,
          primaryAction: "report_upstream",
          primaryActionLabel: "升级 CEO",
          sourceMeetingId: "meeting-real-1",
          sourceDealId: "deal-real-1",
          sourceAgent: "manager_bp",
        },
        shouldHandoff: false,
        handoffSummary: null,
      });

    const response = await postMessage(
      new Request("http://localhost/api/conversational-os/messages", {
        method: "POST",
        body: JSON.stringify({
          threadId: "thread-rep-yang",
          actorId: "human-yang",
          actorName: "杨文星",
          body: "我已经把二访时间定在周五下午，问题清单也整理好了。",
        }),
      })
    );
    const payload = await response.json();
    const repository = createConversationRepository({ dbPath });
    const repState = repository.getThreadState("thread-rep-yang");
    const managerState = repository.getThreadState("thread-manager-liu");

    expect(response.status).toBe(200);
    expect(mockedGenerateConversationalAgentTurn).toHaveBeenCalledTimes(2);
    expect(payload.updatedThreadIds).toEqual(["thread-rep-yang", "thread-manager-liu"]);
    expect(repState.messages.some((message) => message.body.includes("周五下午"))).toBe(true);
    expect(repState.messages.some((message) => message.body.includes("我先帮你把二访信息整理成上报摘要"))).toBe(
      true
    );
    expect(
      managerState.messages.some(
        (message) =>
          message.kind === "system_handoff" && message.body.includes("建议主管评估资源与是否升级")
      )
    ).toBe(true);
    expect(managerState.cards.some((card) => card.title === "刘建明需要判断紫菲是否升级到 CEO")).toBe(true);
  });

  it("forces an upstream handoff when a rep explicitly reports a card upstream", async () => {
    mockedGenerateConversationalAgentTurn
      .mockResolvedValueOnce({
        assistantMessage: "我已收到这张卡，会继续按卡片里的主动作推进。",
        shouldCreateCard: false,
        cardPayload: null,
        shouldHandoff: false,
        handoffSummary: null,
      })
      .mockResolvedValueOnce({
        assistantMessage: "主管侧已收到这张上报卡，我会先给刘建明一个编排摘要。",
        shouldCreateCard: false,
        cardPayload: null,
        shouldHandoff: false,
        handoffSummary: null,
      });

    const response = await postMessage(
      new Request("http://localhost/api/conversational-os/messages", {
        method: "POST",
        body: JSON.stringify({
          threadId: "thread-rep-yang",
          actorId: "human-yang",
          actorName: "杨文星",
          messageType: "card",
          cardId: "card-flow-meeting-summary",
        }),
      })
    );
    const payload = await response.json();
    const repository = createConversationRepository({ dbPath });
    const repState = repository.getThreadState("thread-rep-yang");
    const managerState = repository.getThreadState("thread-manager-liu");

    expect(response.status).toBe(200);
    expect(payload.updatedThreadIds).toEqual(["thread-rep-yang", "thread-manager-liu"]);
    expect(
      repState.messages.some(
        (message) =>
          message.kind === "card_summary" && message.relatedCardId === "card-flow-meeting-summary"
      )
    ).toBe(true);
    expect(
      managerState.messages.some(
        (message) =>
          message.kind === "system_handoff" && message.body.includes("紫菲科技技术评估会摘要")
      )
    ).toBe(true);
    expect(payload.threadPreviews.find((thread) => thread.id === "thread-manager-liu")?.unreadCount).toBeGreaterThanOrEqual(1);
  });

  it("still records the upstream summary when a card report hits model failure", async () => {
    mockedGenerateConversationalAgentTurn.mockRejectedValueOnce(
      new Error("模型返回的结构不符合会话版 Agent OS 协议。")
    );

    const response = await postMessage(
      new Request("http://localhost/api/conversational-os/messages", {
        method: "POST",
        body: JSON.stringify({
          threadId: "thread-rep-yang",
          actorId: "human-yang",
          actorName: "杨文星",
          messageType: "card",
          cardId: "card-flow-meeting-summary",
        }),
      })
    );
    const repository = createConversationRepository({ dbPath });
    const managerState = repository.getThreadState("thread-manager-liu");

    expect(response.status).toBe(200);
    expect(
      managerState.messages.some(
        (message) =>
          message.kind === "system_handoff" && message.body.includes("紫菲科技技术评估会摘要")
      )
    ).toBe(true);
  });

  it("marks unread deliveries as read when opening the target thread", async () => {
    mockedGenerateConversationalAgentTurn
      .mockResolvedValueOnce({
        assistantMessage: "我已收到这张卡，会继续按卡片里的主动作推进。",
        shouldCreateCard: false,
        cardPayload: null,
        shouldHandoff: false,
        handoffSummary: null,
      })
      .mockResolvedValueOnce({
        assistantMessage: "主管侧已收到这张上报卡，我会先给刘建明一个编排摘要。",
        shouldCreateCard: false,
        cardPayload: null,
        shouldHandoff: false,
        handoffSummary: null,
      });

    await postMessage(
      new Request("http://localhost/api/conversational-os/messages", {
        method: "POST",
        body: JSON.stringify({
          threadId: "thread-rep-yang",
          actorId: "human-yang",
          actorName: "杨文星",
          messageType: "card",
          cardId: "card-flow-meeting-summary",
        }),
      })
    );

    const threadResponse = await getThread(
      new Request("http://localhost/api/conversational-os/threads/thread-manager-liu"),
      {
        params: Promise.resolve({ threadId: "thread-manager-liu" }),
      }
    );
    const threadPayload = await threadResponse.json();
    const listResponse = await getThreads();
    const listPayload = await listResponse.json();

    expect(threadResponse.status).toBe(200);
    expect(threadPayload.unreadCount).toBe(0);
    expect(listPayload.threads.find((thread) => thread.id === "thread-manager-liu")?.unreadCount).toBe(0);
  });

  it("delivers a downstream execution summary to the rep thread when the manager confirms a task-down card", async () => {
    const repository = createConversationRepository({ dbPath });
    repository.upsertCard({
      id: "card-manager-downstream-runtime",
      threadId: "thread-manager-liu",
      title: "刘建明需要把 CEO 决策下达到杨文星",
      summary: "主管当前要把试点报价边界和二访动作回传给杨文星。",
      detail: "这张卡代表下达动作本身，不是新的升级。",
      trustNote: "来自主管线程中的 CEO 决策回传。",
      priorityRank: 97,
      primaryAction: "confirm",
      primaryActionLabel: "确认并下达",
      createdAt: "2026-03-12T09:10:00+08:00",
      sourceMeetingId: "meeting-real-5",
      sourceDealId: "deal-real-5",
      sourceAgent: "manager_bp",
    });

    mockedGenerateConversationalAgentTurn
      .mockResolvedValueOnce({
        assistantMessage: "我会把这条决策整理成一线销售可执行的回传摘要。",
        shouldCreateCard: false,
        cardPayload: null,
        shouldHandoff: false,
        handoffSummary: null,
      })
      .mockResolvedValueOnce({
        assistantMessage: "杨文星侧已收到新的执行摘要。",
        shouldCreateCard: true,
        cardPayload: {
          title: "杨文星需要按新报价边界准备广州大臣二访",
          summary: "现在重点是按 CEO 边界准备材料并锁定二访动作。",
          detail: "一线销售只看到执行摘要，不看到主管和 CEO 的内部详细处理。",
          trustNote: "来自主管任务下达摘要。",
          priorityRank: 99,
          primaryAction: "confirm",
          primaryActionLabel: "确认执行",
          sourceMeetingId: "meeting-real-5",
          sourceDealId: "deal-real-5",
          sourceAgent: "sales_bp",
        },
        shouldHandoff: false,
        handoffSummary: null,
      });

    const response = await postMessage(
      new Request("http://localhost/api/conversational-os/messages", {
        method: "POST",
        body: JSON.stringify({
          threadId: "thread-manager-liu",
          actorId: "human-liu",
          actorName: "刘建明",
          messageType: "card",
          cardId: "card-manager-downstream-runtime",
        }),
      })
    );
    const payload = await response.json();
    const repState = createConversationRepository({ dbPath }).getThreadState("thread-rep-yang");

    expect(response.status).toBe(200);
    expect(payload.updatedThreadIds).toEqual(["thread-manager-liu", "thread-rep-yang"]);
    expect(
      repState.messages.some(
        (message) =>
          message.kind === "system_handoff" && message.body.includes("主管当前要把试点报价边界和二访动作回传给杨文星")
      )
    ).toBe(true);
    expect(
      repState.cards.some((card) => card.title === "杨文星需要按新报价边界准备广州大臣二访")
    ).toBe(true);
    expect(payload.threadPreviews.find((thread) => thread.id === "thread-rep-yang")?.unreadCount).toBeGreaterThanOrEqual(1);
  });

  it("resets the demo state back to the seed", async () => {
    const repository = createConversationRepository({ dbPath });
    repository.appendMessages([
      {
        id: "msg-route-reset-runtime",
        threadId: "thread-manager-liu",
        actorId: "human-liu",
        actorName: "刘建明",
        kind: "human",
        body: "这个试点我先看详细材料。",
        occurredAt: "2026-03-12T09:00:00+08:00",
        visibility: "visible_to_thread",
        relatedCardId: null,
      },
    ]);

    const response = await postReset();
    const payload = await response.json();
    const resetState = createConversationRepository({ dbPath }).getThreadState("thread-manager-liu");

    expect(response.status).toBe(200);
    expect(payload.ok).toBe(true);
    expect(resetState.messages).toHaveLength(
      conversationSeed.messages.filter((message) => message.threadId === "thread-manager-liu").length
    );
    expect(resetState.messages.some((message) => message.id === "msg-route-reset-runtime")).toBe(false);
  });
});
