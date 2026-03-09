import { deriveAccountThreads } from "@/lib/derived/account-threads";
import { createMockDataset } from "@/lib/mocks";

describe("account thread derivations", () => {
  it("aggregates meetings and deals into one continuous account thread", () => {
    const dataset = createMockDataset();
    const threads = deriveAccountThreads(dataset);

    const thread = threads.find((item) => item.accountId === "acc-3");

    expect(thread).toBeTruthy();
    expect(thread?.relatedMeetingIds).toEqual(["meeting-2", "meeting-8"]);
    expect(thread?.relatedDealIds).toEqual(["deal-2", "deal-8"]);
    expect(thread?.activeDealId).toBe("deal-2");
    expect(thread?.customerProgressStage).toBe("commercial_active");
    expect(thread?.executionState).toBe("blocked");
    expect(thread?.interventionNeed).toBe("manager");
  });

  it("covers prospect, engaged, opportunity, and commercial-active threads", () => {
    const dataset = createMockDataset();
    const threads = deriveAccountThreads(dataset);

    expect(threads.some((thread) => thread.customerProgressStage === "prospect")).toBe(true);
    expect(threads.some((thread) => thread.customerProgressStage === "engaged")).toBe(true);
    expect(threads.some((thread) => thread.customerProgressStage === "opportunity")).toBe(true);
    expect(
      threads.some((thread) => thread.customerProgressStage === "commercial_active")
    ).toBe(true);
  });

  it("tracks two-layer state for a thread that still needs meeting review", () => {
    const dataset = createMockDataset();
    const threads = deriveAccountThreads(dataset);

    const thread = threads.find((item) => item.accountId === "acc-5");

    expect(thread).toBeTruthy();
    expect(thread?.customerProgressStage).toBe("engaged");
    expect(thread?.executionState).toBe("meeting_done_pending_review");
    expect(thread?.latestBlocker).toContain("转录");
    expect(thread?.currentFocus).toContain("实施");
  });
});
