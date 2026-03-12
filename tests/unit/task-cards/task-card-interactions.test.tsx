import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, vi } from "vitest";

import { TaskCardPageView } from "@/components/task-cards/task-card-page";
import { applyTaskCardAction, createTaskCardState } from "@/lib/task-cards/selectors";
import { resetTaskCardDemoStore } from "@/state/task-card-demo-store";

describe("task card interactions", () => {
  const initialTaskState = createTaskCardState();

  beforeEach(() => {
    resetTaskCardDemoStore();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("defaults to the frontline rep view", () => {
    render(<TaskCardPageView initialTaskState={initialTaskState} />);

    expect(screen.getByText("当前演示视角：一线销售")).toBeVisible();
    expect(screen.getByText("广州紫菲网络科技有限公司需要 1 周内二访验证试点切口")).toBeVisible();
  });

  it("switches demo mode and changes the visible task cards", () => {
    render(<TaskCardPageView initialTaskState={initialTaskState} />);

    fireEvent.click(screen.getByRole("button", { name: "Demo Mode" }));
    fireEvent.click(screen.getByRole("button", { name: "销售主管" }));

    expect(screen.getByText("当前演示视角：销售主管")).toBeVisible();
    expect(screen.getByText("刘建明需要帮杨文星锁定紫菲二访阵容")).toBeVisible();
  });

  it("expands a card to reveal flow events and evidence", () => {
    render(<TaskCardPageView initialTaskState={initialTaskState} />);

    fireEvent.click(
      screen.getByRole("button", {
        name: /展开详情：广州紫菲网络科技有限公司需要 1 周内二访验证试点切口/i,
      })
    );

    expect(screen.getByText("流转轨迹")).toBeVisible();
    expect(screen.getByText(/杨文星确认紫菲需要在 1 周内完成二访/i)).toBeVisible();
    expect(screen.getByText("关键证据")).toBeVisible();
    expect(screen.getByText(/就我们葫芦娃这个 IP 下去做/i)).toBeVisible();
  });

  it("marks downstream rep cards as revoked when a manager revokes the assignment via the persisted API", async () => {
    const nextState = applyTaskCardAction(createTaskCardState(), {
      cardId: "manager-card-2",
      actionKind: "revoke",
    });
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ state: nextState }),
    } as Response);

    render(<TaskCardPageView initialTaskState={initialTaskState} />);

    fireEvent.click(screen.getByRole("button", { name: "Demo Mode" }));
    fireEvent.click(screen.getByRole("button", { name: "销售主管" }));
    fireEvent.click(screen.getByRole("button", { name: "撤销任务" }));

    await waitFor(() =>
      expect(fetchSpy).toHaveBeenCalledWith(
        "/api/task-cards/actions",
        expect.objectContaining({
          method: "POST",
        })
      )
    );

    fireEvent.click(screen.getByRole("button", { name: "Demo Mode" }));
    fireEvent.click(screen.getByRole("button", { name: "一线销售" }));

    const revokedCard = await screen.findByLabelText("玄河网络必须在 48 小时内重建高层赞助");
    expect(within(revokedCard).getByText("已撤销")).toBeVisible();
  });

  it("reveals a downstream manager card after CEO approval via the persisted API", async () => {
    const nextState = applyTaskCardAction(createTaskCardState(), {
      cardId: "ceo-card-2",
      actionKind: "approve",
    });
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ state: nextState }),
    } as Response);

    render(<TaskCardPageView initialTaskState={initialTaskState} />);

    fireEvent.click(screen.getByRole("button", { name: "Demo Mode" }));
    fireEvent.click(screen.getByRole("button", { name: "CEO" }));
    fireEvent.click(screen.getByRole("button", { name: "批准报价边界" }));

    await waitFor(() =>
      expect(fetchSpy).toHaveBeenCalledWith(
        "/api/task-cards/actions",
        expect.objectContaining({
          method: "POST",
        })
      )
    );

    fireEvent.click(screen.getByRole("button", { name: "Demo Mode" }));
    fireEvent.click(screen.getByRole("button", { name: "销售主管" }));

    expect(
      await screen.findByText("王豪已批准大臣试点报价边界，刘建明需回收客户确认")
    ).toBeVisible();
    expect(screen.getAllByText("已收到").length).toBeGreaterThan(0);
  });
});
