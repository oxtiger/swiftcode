import { test, expect } from '@playwright/test';

test('调试当前页面内容', async ({ page }) => {
  await page.goto('http://localhost:5175/');

  // 等待页面加载
  await page.waitForTimeout(3000);

  // 获取整个页面的文本内容
  const bodyContent = await page.textContent('body');
  console.log('页面完整内容:', bodyContent);

  // 获取root元素内容
  const rootContent = await page.innerHTML('#root');
  console.log('Root元素HTML:', rootContent);

  // 检查URL
  console.log('当前URL:', page.url());
});