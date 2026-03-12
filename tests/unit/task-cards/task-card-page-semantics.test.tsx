import { fireEvent, render, screen, within } from "@testing-library/react";

import { TaskCardPageView } from "@/components/task-cards/task-card-page";
import { createTaskCardState } from "@/lib/task-cards/selectors";
import { resetTaskCardDemoStore } from "@/state/task-card-demo-store";

describe("task card page semantics", () => {
  const initialTaskState = createTaskCardState();

  beforeEach(() => {
    resetTaskCardDemoStore();
  });

  it("surfaces low-confidence trust states for weak cards", () => {
    render(<TaskCardPageView initialTaskState={initialTaskState} />);

    const lowConfidenceCard = screen.getByLabelText("曜石游戏先补齐实施边界再继续报价");
    expect(within(lowConfidenceCard).getByText("数据缺失")).toBeVisible();
    expect(within(lowConfidenceCard).getByText(/缺少完整转录和稳定邮件上下文/i)).toBeVisible();
  });

  it("shows all CEO escalation categories including other", () => {
    render(<TaskCardPageView initialTaskState={initialTaskState} />);

    fireEvent.click(screen.getByRole("button", { name: "Demo Mode" }));
    fireEvent.click(screen.getByRole("button", { name: "CEO" }));

    expect(screen.getByText("resource_dispatch")).toBeVisible();
    expect(screen.getByText("pricing_approval")).toBeVisible();
    expect(screen.getByText("executive_intervention")).toBeVisible();
    expect(screen.getByText("other")).toBeVisible();
  });

  it("lets users drill down from an upstream card into lower-level context", () => {
    render(<TaskCardPageView initialTaskState={initialTaskState} />);

    fireEvent.click(screen.getByRole("button", { name: "Demo Mode" }));
    fireEvent.click(screen.getByRole("button", { name: "CEO" }));
    fireEvent.click(
      screen.getByRole("button", {
        name: /展开详情：广州紫菲网络科技有限公司建议王豪判断是否调售前资源/i,
      })
    );

    expect(screen.getByText("下钻上下文")).toBeVisible();
    expect(screen.getByRole("link", { name: /打开商机：广州紫菲二访试点验证/i })).toHaveAttribute(
      "href",
      "/deals/deal-real-1"
    );
    expect(screen.getByRole("link", { name: /打开会议：短剧与游戏业务发展讨论 2026年3月3日/i })).toHaveAttribute(
      "href",
      "/meetings/meeting-real-1"
    );
  });

  it("shows company-name provenance for mapped real customers inside task-card drilldown", () => {
    render(<TaskCardPageView initialTaskState={initialTaskState} />);

    fireEvent.click(
      screen.getByRole("button", {
        name: /展开详情：广州大臣信息科技有限公司需要先锁定月底广州会阵容/i,
      })
    );

    expect(screen.getByText("公司名来源")).toBeVisible();
    expect(screen.getByText("内部材料映射")).toBeVisible();
    expect(screen.getByText(/对应拜访：2026-03-04/i)).toBeVisible();
  });
});
