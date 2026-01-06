import { test, expect } from '@playwright/test';

test('测试不同路径', async ({ page }) => {
  console.log('测试访问根路径');
  await page.goto('http://localhost:5175/');
  await page.waitForTimeout(2000);
  console.log('根路径URL:', page.url());

  console.log('测试直接访问登录页面');
  await page.goto('http://localhost:5175/login');
  await page.waitForTimeout(2000);
  console.log('登录页面URL:', page.url());

  console.log('测试不存在的路径');
  await page.goto('http://localhost:5175/nonexistent');
  await page.waitForTimeout(2000);
  console.log('不存在路径最终URL:', page.url());

  // 尝试检查本地存储
  const authStore = await page.evaluate(() => {
    return localStorage.getItem('auth-store');
  });
  console.log('认证存储:', authStore);
});