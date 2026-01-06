import { test, expect } from '@playwright/test';

test('测试简单路由', async ({ page }) => {
  console.log('测试访问根路径');
  await page.goto('http://localhost:5175/');
  await page.waitForTimeout(2000);
  console.log('根路径URL:', page.url());

  const content = await page.textContent('body');
  console.log('页面内容:', content);

  // 检查是否显示首页内容
  await expect(page.locator('text=This is Home Page!')).toBeVisible();
});