import { createMockDataset } from "@/lib/mocks";

describe("mock dataset", () => {
  it("contains enough entities to support the full page system", () => {
    const dataset = createMockDataset();

    expect(dataset.accounts.length).toBeGreaterThanOrEqual(6);
    expect(dataset.deals.length).toBeGreaterThanOrEqual(10);
    expect(dataset.meetings.length).toBeGreaterThanOrEqual(10);
    expect(dataset.agentOutputs.length).toBeGreaterThanOrEqual(10);
    expect(dataset.workflowEvents.length).toBeGreaterThanOrEqual(8);
    expect(dataset.dataSources.length).toBeGreaterThanOrEqual(6);
  });

  it("covers key trust and business scenarios", () => {
    const dataset = createMockDataset();

    expect(dataset.deals.some((deal) => deal.riskLevel === "high")).toBe(true);
    expect(dataset.deals.some((deal) => deal.dataFreshness === "stale")).toBe(true);
    expect(dataset.deals.some((deal) => deal.dataFreshness === "missing")).toBe(true);
    expect(dataset.agentOutputs.some((output) => output.confidence < 0.7)).toBe(true);
    expect(dataset.syncRecords.some((record) => record.status === "failed")).toBe(true);
    expect(
      dataset.meetings.some((meeting) => meeting.transcriptStatus === "missing")
    ).toBe(true);
  });

  it("provides role-aware home summaries over the same shared objects", () => {
    const dataset = createMockDataset();

    expect(dataset.roleViews.ceo.topDealIds.length).toBeGreaterThan(0);
    expect(dataset.roleViews.manager.stalledDealIds.length).toBeGreaterThan(0);
    expect(dataset.roleViews.rep.todoDealIds.length).toBeGreaterThan(0);
    expect(dataset.roleViews.ceo.topDealIds[0]).toEqual(dataset.deals[0].id);
  });

  it("uses Chinese mid-market game company mock examples", () => {
    const dataset = createMockDataset();

    const visibleLabels = [
      ...dataset.accounts.map((account) => account.name),
      ...dataset.contacts.flatMap((contact) => [contact.name, contact.title]),
      ...dataset.deals.map((deal) => deal.name),
      ...dataset.meetings.map((meeting) => meeting.title),
      ...dataset.repScorecards.flatMap((rep) => [rep.repName, rep.teamName]),
      ...dataset.recapRecords.map((recap) => recap.title),
      ...dataset.alerts.map((alert) => alert.title),
    ];

    expect(
      visibleLabels.every((label) => /[\u4e00-\u9fff]/.test(label) && !/[A-Za-z]/.test(label))
    ).toBe(true);
    expect(
      dataset.accounts.every(
        (account) =>
          account.industry === "游戏" &&
          account.size === "mid_market" &&
          account.region.startsWith("中国") &&
          "description" in account &&
          typeof account.description === "string" &&
          /[\u4e00-\u9fff]/.test(account.description) &&
          !/[A-Za-z]/.test(account.description)
      )
    ).toBe(true);
    expect(
      dataset.contacts.every(
        (contact) =>
          /[\u4e00-\u9fff]/.test(contact.name) &&
          /[\u4e00-\u9fff]/.test(contact.title) &&
          /[\u4e00-\u9fff]/.test(contact.description) &&
          !/[A-Za-z]/.test(contact.description)
      )
    ).toBe(true);
  });
});
