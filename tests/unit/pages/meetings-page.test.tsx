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
