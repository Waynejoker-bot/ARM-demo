import { render, screen } from "@testing-library/react";

import {
  AccountThreadDetailView,
  AccountThreadListView,
} from "@/components/threads/account-thread-panels";

describe("account thread views", () => {
  it("renders the customer list as signal-driven cards with agent summaries", () => {
    render(<AccountThreadListView />);

    expect(screen.getByRole("heading", { name: "客户中心" })).toBeVisible();
    expect(screen.getAllByRole("link").length).toBeGreaterThan(0);

    const cards = screen.getAllByLabelText("客户卡片");
    expect(cards.length).toBeGreaterThan(0);

    expect(screen.getByRole("heading", { name: "Agent 判断" })).toBeVisible();
  });

  it("renders the detail page as an agent-first conversation with proactive alerts", () => {
    render(<AccountThreadDetailView accountId="acc-3" />);

    expect(screen.getByRole("heading", { name: "玄河网络" })).toBeVisible();
    expect(screen.getByText("Agent 教练")).toBeVisible();
    expect(screen.getAllByText(/阻塞/i).length).toBeGreaterThan(0);
  });

  it("shows structured info cards for deals and meetings in the conversation flow", () => {
    render(<AccountThreadDetailView accountId="acc-3" />);

    expect(screen.getByRole("link", { name: /玄河网络发行中台升级项目/i })).toHaveAttribute(
      "href",
      "/deals/deal-2"
    );
    expect(screen.getByRole("link", { name: /玄河网络高层对齐会/i })).toHaveAttribute(
      "href",
      "/meetings/meeting-2"
    );
  });

  it("provides a chat input area with quick prompts for the customer agent", () => {
    render(<AccountThreadDetailView accountId="acc-3" />);

    expect(screen.getByPlaceholderText(/问 Agent/i)).toBeVisible();
    expect(screen.getByRole("button", { name: "发送" })).toBeVisible();
    expect(screen.getByRole("button", { name: /怎么跟进/i })).toBeVisible();
  });

  it("shows data trust signals inline", () => {
    render(<AccountThreadDetailView accountId="acc-3" />);

    expect(screen.getByText(/数据过期/i)).toBeVisible();
    expect(screen.getByText(/68%/i)).toBeVisible();
  });
});
