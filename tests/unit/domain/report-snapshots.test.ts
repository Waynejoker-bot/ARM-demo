import { deriveAccountThreads } from "@/lib/derived/account-threads";
import { deriveRepReportSnapshots } from "@/lib/derived/report-snapshots";
import { createMockDataset } from "@/lib/mocks";

describe("rep report snapshots", () => {
  it("summarizes weekly rep performance over shared account threads", () => {
    const dataset = createMockDataset();
    const threads = deriveAccountThreads(dataset);
    const snapshots = deriveRepReportSnapshots(dataset, threads);

    const repOne = snapshots.find((item) => item.repId === "rep-1");

    expect(repOne).toBeTruthy();
    expect(repOne?.touchedAccountCount).toBe(2);
    expect(repOne?.completedMeetingCount).toBe(2);
    expect(repOne?.activeDealCount).toBe(2);
    expect(repOne?.interventionCount).toBe(1);
    expect(repOne?.summary).toContain("周承安");
  });

  it("highlights reps and threads that need manager intervention", () => {
    const dataset = createMockDataset();
    const threads = deriveAccountThreads(dataset);
    const snapshots = deriveRepReportSnapshots(dataset, threads);

    const repThree = snapshots.find((item) => item.repId === "rep-3");

    expect(repThree).toBeTruthy();
    expect(repThree?.interventionCount).toBe(1);
    expect(repThree?.highlightedThreadId).toBe("thread-acc-3");
    expect(repThree?.highlightedReason).toContain("主管");
  });

  it("keeps weekly snapshots aligned with the rep scorecard roster", () => {
    const dataset = createMockDataset();
    const threads = deriveAccountThreads(dataset);
    const snapshots = deriveRepReportSnapshots(dataset, threads);

    expect(snapshots).toHaveLength(dataset.repScorecards.length);
    expect(snapshots.every((snapshot) => snapshot.periodLabel === "本周" )).toBe(true);
    expect(snapshots.every((snapshot) => snapshot.accountThreadIds.length > 0)).toBe(true);
  });
});
