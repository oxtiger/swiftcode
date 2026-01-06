import { test, expect } from '@playwright/test';

test('检查页面是否有JavaScript错误', async ({ page }) => {
  // 收集控制台错误
  const consoleErrors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  // 收集页面错误
  const pageErrors: string[] = [];
  page.on('pageerror', (error) => {
    pageErrors.push(error.message);
  });

  // 访问页面
  await page.goto('http://localhost:5175/');

  // 等待一下以确保JavaScript执行
  await page.waitForTimeout(3000);

  // 检查是否有错误
  if (consoleErrors.length > 0) {
    console.log('控制台错误:', consoleErrors);
  }
  if (pageErrors.length > 0) {
    console.log('页面错误:', pageErrors);
  }

  // 检查页面内容
  const bodyText = await page.textContent('body');
  console.log('页面内容:', bodyText);

  // 检查是否有React根元素
  const root = await page.locator('#root').innerHTML();
  console.log('Root元素内容:', root);
});