import { conversationSeed, defaultThreadId } from "@/lib/conversational-os/seed";

describe("conversational agent os seed", () => {
  it("defines exactly two starter threads", () => {
    expect(conversationSeed.threads.map((thread) => thread.id)).toEqual([
      "thread-rep-yang",
      "thread-manager-liu",
    ]);
  });

  it("defaults to Yang Wenxing's private thread", () => {
    expect(defaultThreadId).toBe("thread-rep-yang");
  });

  it("includes pinned cards for rep and manager views", () => {
    expect(conversationSeed.threads.every((thread) => thread.pinnedCardId)).toBe(true);
    expect(conversationSeed.cards.every((card) => card.createdAt)).toBe(true);
    expect(conversationSeed.cards.every((card) => card.sourceAgent)).toBe(true);
    expect(
      conversationSeed.cards.find((card) => card.id === "card-flow-meeting-summary")?.title
    ).toContain("紫菲科技");
    expect(
      conversationSeed.cards.find((card) => card.id === "card-mgr-team-status")?.title
    ).toContain("团队状态");
  });

  it("roots the rep seed in Yang Wenxing's real meeting materials", () => {
    const repThreadMessages = conversationSeed.messages.filter(
      (message) => message.threadId === "thread-rep-yang"
    );

    expect(repThreadMessages.some((message) => message.kind === "source_input")).toBe(true);
    expect(repThreadMessages.some((message) => message.body.includes("紫菲科技"))).toBe(true);
    expect(
      repThreadMessages.some(
        (message) =>
          message.body.includes("VOD 聚合 API") ||
          message.body.includes("技术评估会") ||
          message.sourceItems?.some((item) => item.kind === "meeting_summary")
      )
    ).toBe(true);
  });

  it("seeds the rep thread with a proactive daily focus brief and multiple action cards", () => {
    const repMessages = conversationSeed.messages.filter(
      (message) => message.threadId === "thread-rep-yang"
    );
    const proactiveBrief = repMessages.find(
      (message) => message.kind === "agent_reply" && message.body.includes("今天你需要重点关注")
    );

    expect(proactiveBrief).toBeDefined();

    const repCards = conversationSeed.cards.filter((card) => card.threadId === "thread-rep-yang");
    expect(repCards.length).toBeGreaterThanOrEqual(3);
    expect(repCards.some((card) => card.sourceDealId === "deal-real-2")).toBe(true);
  });

  it("defines seeded deliveries and read state for both threads", () => {
    expect(conversationSeed.deliveries.length).toBeGreaterThan(0);
    expect(conversationSeed.readStates).toHaveLength(2);
    expect(conversationSeed.readStates.every((state) => state.lastReadAt)).toBe(true);
    expect(conversationSeed.readStates.map((state) => state.threadId)).toEqual([
      "thread-rep-yang",
      "thread-manager-liu",
    ]);
  });
});
