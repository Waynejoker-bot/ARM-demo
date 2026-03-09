import { expect, test } from "@playwright/test";

test("meeting detail surfaces degraded trust and meeting-driven follow-up controls", async ({
  page,
}) => {
  await page.goto("/meetings/meeting-5");
  await expect(page.getByRole("heading", { name: "曜石游戏初次沟通会" })).toBeVisible();
  await expect(page.getByText("会议转录缺失")).toBeVisible();
  await expect(page.getByText(/低可信度/i)).toBeVisible();
  await expect(page.getByText(/增加多少实施工作量/i)).toBeVisible();
  await expect(page.getByRole("heading", { name: "会后总结与状态提议" })).toBeVisible();
  await expect(page.getByRole("button", { name: "修改提议" })).toBeVisible();
  await expect(page.getByRole("button", { name: "驳回提议" })).toBeVisible();
  await expect(page.getByRole("button", { name: "重新生成" })).toBeVisible();
  await expect(page.getByRole("button", { name: "确认并应用" })).toBeVisible();
});

test("data source degradation is visible on affected pages", async ({ page }) => {
  await page.goto("/data-sources");
  await expect(page.getByText("会议录音服务").first()).toBeVisible();
  await expect(page.getByText(/会让会议总结与证据链降级/i)).toBeVisible();
  await page.getByRole("link", { name: "查看受影响商机" }).click();
  await expect(page.getByRole("heading", { name: "曜石游戏新作买量试用项目" })).toBeVisible();
  await expect(page.getByText("数据缺失").first()).toBeVisible();
});
