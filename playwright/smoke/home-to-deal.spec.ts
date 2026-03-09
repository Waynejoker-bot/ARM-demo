import { expect, test } from "@playwright/test";

test("manager home to risky deal evidence next-step apply journey", async ({ page }) => {
  await page.goto("/home");

  await expect(page.getByRole("heading", { name: "销售主管首页" })).toBeVisible();
  await page.getByRole("link", { name: /玄河网络发行中台升级项目/i }).click();

  await expect(
    page.getByRole("heading", { name: "玄河网络发行中台升级项目" })
  ).toBeVisible();
  await page.getByRole("button", { name: /查看证据/i }).first().click();
  await expect(page.getByLabel("证据").getByText(/关键决策对齐风险/i)).toBeVisible();
  await expect(page.getByRole("textbox", { name: "建议内容" })).toHaveValue(
    /必须先恢复高层赞助人与采购方的对齐/i
  );
  await page.getByRole("button", { name: "确认" }).click();
  await page.getByRole("button", { name: "应用到页面" }).click();
  await expect(page.getByText("已应用")).toBeVisible();
});
