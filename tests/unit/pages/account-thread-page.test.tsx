import { render, screen } from "@testing-library/react";

import {
  AccountThreadDetailView,
  AccountThreadListView,
} from "@/components/threads/account-thread-panels";

describe("account thread views", () => {
  it("renders the customer list as account threads rather than static customers", () => {
    render(<AccountThreadListView />);

    expect(screen.getByRole("heading", { name: "客户推进线程" })).toBeVisible();
    expect(screen.getByText(/客户进展/i)).toBeVisible();
    expect(screen.getByText(/当前动作/i)).toBeVisible();
    expect(screen.getByRole("heading", { name: "线下实录客户样本" })).toBeVisible();
    expect(screen.getByText(/广州研发转发行团队/i)).toBeVisible();
  });

  it("renders the detail page with continuous thread context and deal projection", () => {
    render(<AccountThreadDetailView accountId="acc-3" />);

    expect(screen.getByRole("heading", { name: "线程概览" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "最近变化" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "推进时间线" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "正式商机投影区" })).toBeVisible();
    expect(screen.getByText(/客户进展：商务推进中/i)).toBeVisible();
    expect(screen.getByText(/当前动作：阻塞中/i)).toBeVisible();
  });

  it("lets users drill from a thread into key meetings and the projected deal", () => {
    render(<AccountThreadDetailView accountId="acc-3" />);

    expect(screen.getByRole("link", { name: /玄河网络高层对齐会/i })).toHaveAttribute(
      "href",
      "/meetings/meeting-2"
    );
    expect(screen.getByRole("link", { name: /玄河网络发行中台升级项目/i })).toHaveAttribute(
      "href",
      "/deals/deal-2"
    );
  });

  it("shows data trust signals for thread coverage and freshness", () => {
    render(<AccountThreadDetailView accountId="acc-3" />);

    expect(screen.getByText(/数据新鲜度：数据过期/i)).toBeVisible();
    expect(screen.getByText(/数据覆盖率：68%/i)).toBeVisible();
  });

  it("keeps real field references visible inside the customer detail view", () => {
    render(<AccountThreadDetailView accountId="acc-3" />);

    expect(screen.getByRole("heading", { name: "真实线下实录参考" })).toBeVisible();
    expect(screen.getByText(/广州成熟投放中台团队/i)).toBeVisible();
    expect(screen.getByText(/整套中台替换概率低/i)).toBeVisible();
  });
});
