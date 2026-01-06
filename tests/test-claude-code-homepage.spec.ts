import { test, expect } from '@playwright/test';

test('测试Claude Code风格首页', async ({ page }) => {
  await page.goto('http://localhost:5175/');
  await page.waitForTimeout(3000);

  console.log('当前URL:', page.url());

  // 检查导航栏中的主要元素
  await expect(page.locator('nav').getByText('Claude Relay Service')).toBeVisible();
  await expect(page.locator('text=为开发者而生的')).toBeVisible();
  await expect(page.locator('text=开始使用').first()).toBeVisible();

  // 检查导航
  await expect(page.locator('text=功能')).toBeVisible();
  await expect(page.locator('text=定价')).toBeVisible();
  await expect(page.locator('text=文档')).toBeVisible();

  // 检查功能卡片
  await expect(page.locator('text=智能负载均衡')).toBeVisible();
  await expect(page.locator('text=实时监控')).toBeVisible();
  await expect(page.locator('text=企业级安全')).toBeVisible();

  // 检查代码演示区域
  await expect(page.locator('pre')).toBeVisible();

  // 测试按钮点击
  const getStartedButton = page.locator('text=开始使用').first();
  await getStartedButton.click();
  await page.waitForTimeout(1000);

  // 检查是否跳转到登录页
  console.log('点击后URL:', page.url());
  expect(page.url()).toContain('/login');
});