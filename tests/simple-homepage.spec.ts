import { test, expect } from '@playwright/test';

test('测试简化版首页', async ({ page }) => {
  await page.goto('http://localhost:5175/');

  // 检查页面标题
  await expect(page.locator('h1')).toContainText('Claude Relay Service');

  // 检查主要按钮
  await expect(page.locator('text=开始使用')).toBeVisible();

  // 检查页面内容
  await expect(page.locator('text=强大的 AI API 中转服务')).toBeVisible();
});