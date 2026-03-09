import { expect, test } from "@playwright/test";

test("role home views are truly separated for ceo manager and rep", async ({
  page,
}) => {
  await page.goto("/home?role=ceo");
  await expect(page.getByRole("heading", { name: "CEO 首页" })).toBeVisible();
  await expect(page.getByText(/战略商机观察/i)).toBeVisible();

  await page.goto("/home?role=manager");
  await expect(page.getByRole("heading", { name: "销售主管首页" })).toBeVisible();
  await expect(page.getByText(/团队辅导建议/i)).toBeVisible();

  await page.goto("/home?role=rep");
  await expect(page.getByRole("heading", { name: "一线销售首页" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Agent 今日简报" })).toBeVisible();
});
