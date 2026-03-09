import { expect, test } from "@playwright/test";

test("left nav remains scrollable when its content exceeds the viewport", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 620 });
  await page.goto("/home?role=rep");

  const leftNav = page.locator(".left-nav");
  await expect(leftNav).toBeVisible();

  const navMetrics = await leftNav.evaluate((element) => ({
    clientHeight: element.clientHeight,
    scrollHeight: element.scrollHeight,
    scrollTop: element.scrollTop,
  }));

  expect(navMetrics.scrollHeight).toBeGreaterThan(navMetrics.clientHeight);
  expect(navMetrics.scrollTop).toBe(0);

  await leftNav.hover();
  await page.mouse.wheel(0, 900);

  await expect
    .poll(async () => leftNav.evaluate((element) => element.scrollTop))
    .toBeGreaterThan(0);
});
