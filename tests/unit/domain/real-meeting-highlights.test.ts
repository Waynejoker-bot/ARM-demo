import { createMockDataset } from "@/lib/mocks";
import { deriveRealMeetingHighlights } from "@/lib/derived/real-meeting-highlights";

describe("real meeting highlights", () => {
  it("derives reusable highlight cards from Yang Wenxing's real meeting cases", () => {
    const dataset = createMockDataset();
    const highlights = deriveRealMeetingHighlights(dataset.realMeetingCases);

    expect(highlights.length).toBeGreaterThanOrEqual(4);
    expect(highlights[0]?.accountName).toBe("葫芦娃产品线团队");
    expect(highlights[0]?.statusLabel).toBe("已开完");
    expect(highlights[0]?.metaLine).toContain("需求发现");
    expect(highlights[0]?.insight).toContain("VOD 聚合 API");
    expect(highlights.some((item) => item.publicContext)).toBe(true);
  });
});
