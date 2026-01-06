import { test, expect } from '@playwright/test';

test('测试SimpleHomePage', async ({ page }) => {
  await page.goto('http://localhost:5175/');
  await page.waitForTimeout(2000);
  console.log('URL:', page.url());

  // 检查是否显示Claude标题
  await expect(page.locator('text=Claude Relay Service')).toBeVisible();

  // 检查开始使用按钮
  await expect(page.locator('text=开始使用')).toBeVisible();
});