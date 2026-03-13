import { conversationSeed, defaultThreadId } from "@/lib/conversational-os/seed";

describe("conversational agent os seed", () => {
  it("defines exactly three starter threads", () => {
    expect(conversationSeed.threads.map((thread) => thread.id)).toEqual([
      "thread-rep-yang",
      "thread-manager-liu",
      "thread-ceo-wang",
    ]);
  });

  it("defaults to Yang Wenxing's private thread", () => {
    expect(defaultThreadId).toBe("thread-rep-yang");
  });

  it("includes pinned cards for rep, manager, and ceo views", () => {
    expect(conversationSeed.threads.every((thread) => thread.pinnedCardId)).toBe(true);
    expect(conversationSeed.cards.every((card) => card.createdAt)).toBe(true);
    expect(
      conversationSeed.cards.find((card) => card.id === "card-rep-zifei-priority")?.title
    ).toContain("广州紫菲网络科技有限公司");
    expect(
      conversationSeed.cards.find((card) => card.id === "card-manager-zifei-intervention")?.title
    ).toContain("刘建明");
    expect(
      conversationSeed.cards.find((card) => card.id === "card-ceo-dachen-pricing")?.title
    ).toContain("王豪");
  });

  it("roots the rep seed in Yang Wenxing's real meeting materials", () => {
    const repThreadMessages = conversationSeed.messages.filter(
      (message) => message.threadId === "thread-rep-yang"
    );

    expect(repThreadMessages.some((message) => message.kind === "source_input")).toBe(true);
    expect(repThreadMessages.some((message) => message.body.includes("刚见完客户"))).toBe(true);
    expect(
      repThreadMessages.some(
        (message) =>
          message.body.includes("VOD 聚合 API") ||
          message.body.includes("月底广州会") ||
          message.sourceItems?.some((item) => item.title === "硬件会议摘要")
      )
    ).toBe(true);
  });

  it("defines seeded deliveries and read state for all three threads", () => {
    expect(conversationSeed.deliveries.length).toBeGreaterThan(0);
    expect(conversationSeed.readStates).toHaveLength(3);
    expect(conversationSeed.readStates.every((state) => state.lastReadAt)).toBe(true);
    expect(conversationSeed.readStates.map((state) => state.threadId)).toEqual([
      "thread-rep-yang",
      "thread-manager-liu",
      "thread-ceo-wang",
    ]);
  });
});
