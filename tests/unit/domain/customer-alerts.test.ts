import { deriveCustomerAlerts, deriveOneLineSummary } from "@/lib/domain/customer-alerts";
import type { Account, AccountThread } from "@/lib/domain/types";

function makeThread(overrides: Partial<AccountThread> = {}): AccountThread {
  return {
    id: "thread-test",
    accountId: "acc-test",
    ownerRepId: "rep-1",
    primaryContactIds: [],
    relatedDealIds: [],
    relatedMeetingIds: [],
    activeDealId: null,
    customerProgressStage: "engaged",
    executionState: "meeting_scheduled",
    objectiveProgressSummary: "正常推进中",
    currentFocus: "准备下次会议",
    latestBlocker: null,
    lastMeetingId: null,
    lastMeetingAt: "2026-03-10T10:00:00+08:00",
    nextMeetingAt: null,
    interventionNeed: "none",
    dataFreshness: "fresh",
    dataCoverage: 0.85,
    updatedAt: "2026-03-14T10:00:00+08:00",
    ...overrides,
  };
}

const account: Account = {
  id: "acc-test",
  name: "测试客户",
  description: "测试用客户",
  industry: "游戏",
  size: "mid_market",
  region: "中国华南",
  ownerRepId: "rep-1",
};

const NOW = new Date("2026-03-15T10:00:00+08:00");

describe("customer alerts", () => {
  it("generates a stalled alert when execution state is stalled", () => {
    const thread = makeThread({
      executionState: "stalled",
      latestBlocker: "客户方预算冻结",
    });
    const alerts = deriveCustomerAlerts(thread, account, NOW);

    expect(alerts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          level: "risk",
          title: expect.stringContaining("停滞"),
        }),
      ])
    );
  });

  it("generates a blocked alert when execution state is blocked", () => {
    const thread = makeThread({
      executionState: "blocked",
      latestBlocker: "内部审批流程卡住",
    });
    const alerts = deriveCustomerAlerts(thread, account, NOW);

    expect(alerts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          level: "risk",
          title: expect.stringContaining("阻塞"),
        }),
      ])
    );
  });

  it("generates a follow-up gap alert when last meeting was more than 5 days ago", () => {
    const thread = makeThread({
      lastMeetingAt: "2026-03-08T10:00:00+08:00",
    });
    const alerts = deriveCustomerAlerts(thread, account, NOW);

    expect(alerts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          level: "warn",
          title: expect.stringContaining("天未跟进"),
        }),
      ])
    );
  });

  it("does not generate a follow-up gap alert when last meeting was recent", () => {
    const thread = makeThread({
      lastMeetingAt: "2026-03-14T10:00:00+08:00",
    });
    const alerts = deriveCustomerAlerts(thread, account, NOW);

    expect(alerts.some((a) => a.title.includes("天未跟进"))).toBe(false);
  });

  it("generates a data coverage alert when coverage is low", () => {
    const thread = makeThread({ dataCoverage: 0.3 });
    const alerts = deriveCustomerAlerts(thread, account, NOW);

    expect(alerts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          level: "warn",
          title: expect.stringContaining("数据覆盖"),
        }),
      ])
    );
  });

  it("generates an intervention needed alert when manager or executive intervention is flagged", () => {
    const thread = makeThread({ interventionNeed: "manager" });
    const alerts = deriveCustomerAlerts(thread, account, NOW);

    expect(alerts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          level: "warn",
          title: expect.stringContaining("介入"),
        }),
      ])
    );
  });

  it("returns an empty array for a healthy thread", () => {
    const thread = makeThread({
      lastMeetingAt: "2026-03-14T10:00:00+08:00",
      dataCoverage: 0.9,
    });
    const alerts = deriveCustomerAlerts(thread, account, NOW);

    expect(alerts).toEqual([]);
  });

  it("derives a one-line summary for list display", () => {
    const stalledThread = makeThread({
      executionState: "stalled",
      latestBlocker: "客户方预算冻结",
      lastMeetingAt: "2026-03-05T10:00:00+08:00",
    });
    const summary = deriveOneLineSummary(stalledThread, account, NOW);

    expect(summary).toBeTruthy();
    expect(summary.length).toBeGreaterThan(0);
    expect(summary.length).toBeLessThan(80);
  });

  it("returns a positive summary for a healthy thread", () => {
    const thread = makeThread({
      lastMeetingAt: "2026-03-14T10:00:00+08:00",
      dataCoverage: 0.9,
    });
    const summary = deriveOneLineSummary(thread, account, NOW);

    expect(summary).toContain("正常");
  });
});
