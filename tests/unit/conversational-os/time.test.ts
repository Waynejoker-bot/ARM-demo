import {
  formatAbsoluteConversationTime,
  formatRelativeConversationTime,
} from "@/lib/conversational-os/time";

describe("conversation time formatting", () => {
  const now = new Date("2026-03-12T09:30:00+08:00");

  it("formats very recent timestamps as just now", () => {
    expect(formatRelativeConversationTime("2026-03-12T09:29:45+08:00", now)).toBe("刚刚");
  });

  it("formats recent timestamps as minutes ago", () => {
    expect(formatRelativeConversationTime("2026-03-12T09:12:00+08:00", now)).toBe("18 分钟前");
  });

  it("formats older timestamps as calendar time", () => {
    expect(formatRelativeConversationTime("2026-03-12T08:00:00+08:00", now)).toBe("今天 08:00");
    expect(formatRelativeConversationTime("2026-03-11T22:30:00+08:00", now)).toBe("昨天 22:30");
    expect(formatRelativeConversationTime("2026-03-05T19:11:00+08:00", now)).toBe("03-05 19:11");
  });

  it("formats absolute timestamps for detail views", () => {
    expect(formatAbsoluteConversationTime("2026-03-05T19:11:00+08:00")).toBe("2026-03-05 19:11");
  });
});
