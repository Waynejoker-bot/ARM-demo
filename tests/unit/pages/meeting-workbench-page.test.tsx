import { render, screen } from "@testing-library/react";

import { MeetingWorkbenchView } from "@/components/meeting/workbench";

describe("meeting workbench view", () => {
  it("renders the workbench sections for a completed meeting", () => {
    render(<MeetingWorkbenchView meetingId="meeting-11" />);

    expect(screen.getByRole("heading", { name: "会前准备" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "会议证据" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "会后 Agent 分析" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "会后总结与状态提议" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "影响范围" })).toBeVisible();
  });

  it("keeps thread, deal, and CRM impact explicitly separated", () => {
    render(<MeetingWorkbenchView meetingId="meeting-11" />);

    expect(screen.getByText(/影响客户线程/i)).toBeVisible();
    expect(screen.getByText(/影响 Deal 投影/i)).toBeVisible();
    expect(screen.getByText(/CRM 同步仍需单独决定/i)).toBeVisible();
  });

  it("shows degraded trust state when transcript evidence is missing", () => {
    render(<MeetingWorkbenchView meetingId="meeting-5" />);

    expect(screen.getByText(/会议转录缺失/i)).toBeVisible();
    expect(screen.getByText(/低可信度/i)).toBeVisible();
    expect(screen.getByRole("button", { name: "修改提议" })).toBeVisible();
    expect(screen.getByRole("button", { name: "驳回提议" })).toBeVisible();
    expect(screen.getByRole("button", { name: "重新生成" })).toBeVisible();
    expect(screen.getByRole("button", { name: "确认并应用" })).toBeVisible();
  });

  it("surfaces data status and evidence coverage in the workbench itself", () => {
    render(<MeetingWorkbenchView meetingId="meeting-11" />);

    expect(screen.getByText(/数据状态：数据新鲜/i)).toBeVisible();
    expect(screen.getByText(/证据覆盖：2 条高相关依据/i)).toBeVisible();
  });

  it("marks secondary workbench sections for mobile progressive disclosure", () => {
    render(<MeetingWorkbenchView meetingId="meeting-11" />);

    expect(screen.getByRole("heading", { name: "会议证据" }).closest(".section-card")).toHaveAttribute(
      "data-mobile-priority",
      "primary"
    );
    expect(screen.getByRole("heading", { name: "影响范围" }).closest(".section-card")).toHaveAttribute(
      "data-mobile-collapsible",
      "true"
    );
  });
});
