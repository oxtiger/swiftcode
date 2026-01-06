import { test, expect } from '@playwright/test';

test.describe('首页测试', () => {
  test('应该显示Claude Relay Service标题', async ({ page }) => {
    await page.goto('http://localhost:5175/');

    // 检查页面标题
    await expect(page.locator('h1')).toContainText('Claude Relay Service');

    // 检查主要按钮
    await expect(page.locator('text=开始使用')).toBeVisible();
    await expect(page.locator('text=管理后台')).toBeVisible();

    // 检查功能卡片
    await expect(page.locator('text=多账户管理')).toBeVisible();
    await expect(page.locator('text=实时监控')).toBeVisible();
    await expect(page.locator('text=智能限流')).toBeVisible();
  });

  test('导航按钮应该正常工作', async ({ page }) => {
    await page.goto('http://localhost:5175/');

    // 点击"开始使用"按钮应该跳转到登录页
    await page.click('text=开始使用');
    await expect(page).toHaveURL(/.*login/);
  });
});