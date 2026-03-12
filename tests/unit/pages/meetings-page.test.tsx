import { render, screen } from "@testing-library/react";

import MeetingsPage from "../../../app/meetings/page";

describe("meetings page", () => {
  it("renders meetings as a prioritized execution queue instead of a flat log", () => {
    render(<MeetingsPage />);

    expect(screen.getByRole("heading", { name: "会议" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "待确认优先队列" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "Meeting Queue" })).toBeVisible();
    expect(screen.getByRole("link", { name: /曜石游戏初次沟通会/i })).toHaveAttribute(
      "href",
      "/meetings/meeting-5"
    );
    expect(screen.getByRole("link", { name: /曜石游戏$/i })).toHaveAttribute(
      "href",
      "/customers/acc-5"
    );
    expect(screen.getByText(/转录缺失/i)).toBeVisible();
    expect(screen.getByText(/数据缺失/i)).toBeVisible();
  });

  it("shows meeting status, core conclusion, and next step directly inside queue cards", () => {
    render(<MeetingsPage />);

    expect(screen.getAllByText("当前状态：已开完").length).toBeGreaterThan(0);
    expect(screen.getByText("当前状态：待开")).toBeVisible();
    expect(screen.getAllByText(/核心结论/i).length).toBeGreaterThan(0);
    expect(
      screen.getByText(/这位销售在会议收尾时需要更坚决地锁定带日期的下一步/i)
    ).toBeVisible();
    expect(screen.getByText(/尽快重新建立高层赞助人与采购方的一致意见/i)).toBeVisible();
  });

  it("surfaces Yang Wenxing's real meeting samples above the generic queue", () => {
    render(<MeetingsPage />);

    const realSamplesHeading = screen.getByRole("heading", { name: "杨文星真实会议样本" });
    const pendingQueueHeading = screen.getByRole("heading", { name: "待确认优先队列" });

    expect(realSamplesHeading).toBeVisible();
    expect(
      realSamplesHeading.compareDocumentPosition(pendingQueueHeading) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
    expect(screen.getByText(/葫芦娃产品线团队/i)).toBeVisible();
    expect(screen.getByText(/国内卡牌产品线与短剧团队并行/i)).toBeVisible();
    expect(screen.getByText(/短期更适合切入 VOD 聚合 API，而不是直接推动整体云迁移/i)).toBeVisible();
    expect(screen.getByText(/先拉技术负责人一起看当前云与音视频账单/i)).toBeVisible();
  });

  it("exposes feed and card-density hooks for mobile meeting queues", () => {
    render(<MeetingsPage />);

    expect(screen.getByRole("heading", { name: "待确认优先队列" }).closest(".section-card")).toHaveAttribute(
      "data-mobile-priority",
      "primary"
    );
    expect(screen.getByRole("heading", { name: "待确认优先队列" }).closest(".section-card")).toHaveAttribute(
      "data-mobile-density",
      "feed"
    );
    expect(screen.getByRole("heading", { name: "Meeting Queue" }).closest(".section-card")).toHaveAttribute(
      "data-mobile-density",
      "cards"
    );
  });
});
