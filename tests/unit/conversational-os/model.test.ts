import { vi } from "vitest";

import { conversationSeed } from "@/lib/conversational-os/seed";

vi.mock("@/lib/model/glm-client", () => ({
  requestGlmCompletion: vi.fn(),
}));

import { requestGlmCompletion } from "@/lib/model/glm-client";
import {
  ConversationalAgentModelError,
  buildConversationalAgentMessages,
  generateConversationalAgentTurn,
} from "@/lib/conversational-os/model";

const mockedRequestGlmCompletion = vi.mocked(requestGlmCompletion);

describe("conversational os model service", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("builds a structured prompt from thread context", () => {
    const thread = conversationSeed.threads.find((item) => item.id === "thread-rep-yang");
    const cards = conversationSeed.cards.filter((card) => card.threadId === "thread-rep-yang");
    const messages = conversationSeed.messages.filter((message) => message.threadId === "thread-rep-yang");

    expect(thread).toBeDefined();

    const modelMessages = buildConversationalAgentMessages({
      thread: thread!,
      visibleMessages: messages,
      visibleCards: cards,
      prompt: "我已经约到周五二访，还需要补什么？",
      actorName: "杨文星",
    });

    expect(modelMessages[0]?.role).toBe("system");
    expect(modelMessages[0]?.content).toContain("会话版 Agent OS");
    expect(modelMessages[0]?.content).toContain("只返回 JSON");
    expect(modelMessages[1]?.content).toContain("线程：杨文星私有群");
    expect(modelMessages[1]?.content).toContain("当前置顶优先卡");
    expect(modelMessages[1]?.content).toContain("广州紫菲网络科技有限公司需要 1 周内锁定二访阵容");
    expect(modelMessages[1]?.content).toContain("最近消息");
    expect(modelMessages[1]?.content).toContain("我已经约到周五二访");
  });

  it("parses model JSON into a typed conversational agent turn", async () => {
    mockedRequestGlmCompletion.mockResolvedValueOnce(
      JSON.stringify({
        assistant_message: "我已经帮你把信息收束好了，下一步是把二访阵容和试点问题同步给主管。",
        should_create_card: true,
        card_payload: {
          title: "紫菲二访阵容已锁定，等待主管确认是否升级",
          summary: "当前建议先把二访阵容和试点问题交给主管判断是否上升到资源协调。",
          detail: "杨文星已确认二访时间，当前最有价值的是把问题边界、参会人和试点材料整理后上报。",
          trust_note: "基于当前线程消息和真实会议材料生成。",
          priority_rank: 94,
          primary_action: "report_upstream",
          primary_action_label: "上报主管",
          source_meeting_id: "meeting-real-1",
          source_deal_id: "deal-real-1",
        },
        should_handoff: true,
        handoff_summary: "杨文星已锁定二访时间，建议主管评估是否需要额外资源介入。",
      })
    );

    const result = await generateConversationalAgentTurn({
      thread: conversationSeed.threads[0],
      visibleMessages: conversationSeed.messages.filter((message) => message.threadId === "thread-rep-yang"),
      visibleCards: conversationSeed.cards.filter((card) => card.threadId === "thread-rep-yang"),
      prompt: "我已经约到周五二访，还需要补什么？",
      actorName: "杨文星",
    });

    expect(result.assistantMessage).toContain("下一步是把二访阵容和试点问题同步给主管");
    expect(result.shouldCreateCard).toBe(true);
    expect(result.cardPayload?.primaryAction).toBe("report_upstream");
    expect(result.shouldHandoff).toBe(true);
    expect(result.handoffSummary).toContain("建议主管评估");
  });

  it("raises a controlled error for invalid model JSON", async () => {
    mockedRequestGlmCompletion.mockResolvedValueOnce("not-json");

    await expect(
      generateConversationalAgentTurn({
        thread: conversationSeed.threads[0],
        visibleMessages: conversationSeed.messages.filter((message) => message.threadId === "thread-rep-yang"),
        visibleCards: conversationSeed.cards.filter((card) => card.threadId === "thread-rep-yang"),
        prompt: "请帮我继续整理这次拜访。",
        actorName: "杨文星",
      })
    ).rejects.toBeInstanceOf(ConversationalAgentModelError);
  });
});
