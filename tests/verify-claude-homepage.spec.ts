import { test, expect } from '@playwright/test';

test('验证Claude Code高保真首页完整功能', async ({ page }) => {
  await page.goto('http://localhost:5175/');
  await page.waitForTimeout(3000);

  console.log('✅ 页面成功加载, URL:', page.url());

  // 验证关键元素存在
  await expect(page.locator('nav').getByText('Claude Relay Service')).toBeVisible();
  console.log('✅ 导航栏标题显示正常');

  await expect(page.locator('text=为开发者而生的')).toBeVisible();
  console.log('✅ Hero标题显示正常');

  await expect(page.locator('text=智能负载均衡')).toBeVisible();
  console.log('✅ 功能卡片显示正常');

  await expect(page.locator('pre')).toBeVisible();
  console.log('✅ 代码演示区域显示正常');

  // 测试导航按钮
  const managementButton = page.locator('nav').getByText('管理后台');
  await managementButton.click();
  await page.waitForTimeout(1000);

  console.log('✅ 点击管理后台按钮后URL:', page.url());
  expect(page.url()).toContain('/login');
  console.log('✅ 按钮跳转功能正常');

  // 回到首页
  await page.goto('http://localhost:5175/');
  await page.waitForTimeout(2000);

  // 测试主要CTA按钮
  const ctaButton = page.locator('text=开始使用').first();
  await ctaButton.click();
  await page.waitForTimeout(1000);

  console.log('✅ 点击开始使用按钮后URL:', page.url());
  expect(page.url()).toContain('/login');
  console.log('✅ CTA按钮功能正常');

  console.log('🎉 Claude Code高保真首页测试全部通过！');
});