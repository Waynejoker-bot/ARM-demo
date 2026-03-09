import { expect, test } from "@playwright/test";

test("pipeline proposal remains proposal-first until confirm", async ({ page }) => {
  await page.goto("/pipeline");
  await expect(page.getByRole("heading", { name: "商机管道" })).toBeVisible();
  await page.getByRole("button", { name: "提议推进到下一阶段" }).first().click();
  await expect(page.getByText(/阶段提议：/i).first()).toBeVisible();
  await page.getByRole("button", { name: "确认并应用" }).first().click();
  await expect(page.getByText(/已应用：/i).first()).toBeVisible();
  await expect(page.getByText(/还没有同步到 CRM/i).first()).toBeVisible();
});

test("revenue can drill into risky deal and ask agent why", async ({ page }) => {
  await page.route("**/api/agent/chat", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        message: "当前高风险主要来自高层赞助缺位和法务推进停滞。",
      }),
    });
  });

  await page.goto("/revenue");
  await expect(page.getByRole("heading", { name: "收入中心" })).toBeVisible();
  await expect(page.getByText(/为什么风险上升/i)).toBeVisible();
  await page.getByRole("link", { name: /玄河网络发行中台升级项目/i }).click();
  await expect(page.getByRole("heading", { name: "玄河网络发行中台升级项目" })).toBeVisible();
  await page.getByRole("button", { name: /查看证据/i }).click();
  await expect(page.getByLabel("证据").getByText(/关键决策对齐风险/i)).toBeVisible();
  await page.getByRole("textbox", { name: "Agent 输入" }).fill("为什么这条商机风险高？");
  await page.getByRole("button", { name: "发送给 Agent" }).click();
  await expect(page.getByText("当前高风险主要来自高层赞助缺位和法务推进停滞。")).toBeVisible();
});
