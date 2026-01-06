import { test } from '@playwright/test';

test('分析Claude Code官网设计', async ({ page }) => {
  await page.goto('https://claude.com/product/claude-code');

  // 等待页面完全加载
  await page.waitForTimeout(5000);

  // 获取页面结构
  console.log('=== 页面标题 ===');
  const title = await page.textContent('h1');
  console.log('主标题:', title);

  // 获取导航结构
  console.log('\n=== 导航结构 ===');
  const navItems = await page.locator('nav a').allTextContents();
  console.log('导航项:', navItems);

  // 获取主要内容区域
  console.log('\n=== 主要内容区域 ===');
  const sections = await page.locator('section, div[class*="section"]').count();
  console.log('内容区域数量:', sections);

  // 获取按钮样式
  console.log('\n=== 按钮元素 ===');
  const buttons = await page.locator('button, a[class*="button"]').allTextContents();
  console.log('按钮文字:', buttons.slice(0, 10)); // 只显示前10个

  // 获取色彩方案信息
  console.log('\n=== 样式信息 ===');
  const bodyBg = await page.evaluate(() => {
    return window.getComputedStyle(document.body).backgroundColor;
  });
  console.log('背景色:', bodyBg);

  // 截图以供分析
  await page.screenshot({
    path: 'claude-code-page.png',
    fullPage: true
  });
  console.log('\n页面截图已保存为 claude-code-page.png');

  // 分析特定元素
  console.log('\n=== Hero区域分析 ===');
  const heroSection = page.locator('main').first();
  const heroText = await heroSection.textContent();
  console.log('Hero区域文字内容长度:', heroText?.length);

  // 分析代码演示区域
  console.log('\n=== 代码演示区域 ===');
  const codeBlocks = await page.locator('pre, code, [class*="code"]').count();
  console.log('代码块数量:', codeBlocks);
});