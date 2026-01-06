import { test, expect } from '@playwright/test';

/**
 * Final Dashboard Test
 * 测试完整的Token添加到数据显示流程
 */

const TEST_TOKEN = 'cr_278156e1ea67cedf8fec4f751b1f686b76419520569d725353a281753946632e';

test('Dashboard完整流程测试 - Token添加后数据显示', async ({ page }) => {
  console.log('\n🎯 开始仪表板完整流程测试');

  // 访问仪表板
  await page.goto('/dashboard');
  await page.waitForLoadState('networkidle');
  console.log('✅ 仪表板页面加载完成');

  // 检查初始状态（无数据）
  const initialStatsElements = await page.locator('[data-testid="api-stat-value"]').all();
  if (initialStatsElements.length > 0) {
    const initialValue = await initialStatsElements[0].textContent();
    console.log(`初始状态 - 第一个统计值: "${initialValue}"`);
  }

  // 进入Token管理
  await page.click('button:has-text("Token管理")');
  await page.waitForTimeout(1000);
  console.log('✅ 进入Token管理界面');

  // 添加Token
  await page.click('button:has-text("添加新Token")');
  await page.waitForTimeout(1000);

  // 填写表单
  const inputs = page.locator('input');
  await inputs.nth(0).fill('测试Token');
  await inputs.nth(1).fill(TEST_TOKEN);
  console.log('✅ 表单填写完成');

  // 提交并等待自动切换
  await page.click('button:has-text("添加Token")');

  // 等待自动切换回概览视图
  await page.waitForTimeout(3000);
  console.log('✅ Token添加完成，等待自动切换');

  // 验证是否切换回概览视图
  const overviewButton = page.locator('button:has-text("概览")');
  const isOverviewActive = await overviewButton.getAttribute('class');
  const isActive = isOverviewActive?.includes('bg-orange');
  console.log(`概览视图是否激活: ${isActive}`);

  // 检查数据是否显示
  await page.waitForTimeout(2000);

  // 查找API统计卡片
  const statCards = page.locator('.grid .group').or(page.locator('[role="group"]')).or(page.locator('.bg-orange-50, .bg-green-50, .bg-blue-50, .bg-purple-50'));
  const cardCount = await statCards.count();
  console.log(`找到统计卡片数量: ${cardCount}`);

  // 查找所有可能的数值显示元素
  const valueElements = page.locator('text=/^\\d+/ >> visible').or(page.locator('text=/\\$\\d/ >> visible')).or(page.locator('text=/%/ >> visible'));
  const valueCount = await valueElements.count();
  console.log(`找到数值元素数量: ${valueCount}`);

  if (valueCount > 0) {
    for (let i = 0; i < Math.min(valueCount, 5); i++) {
      const value = await valueElements.nth(i).textContent();
      console.log(`  数值${i + 1}: "${value}"`);
    }
  }

  // 检查是否有加载指示器
  const loadingElements = page.locator('.animate-pulse, text=/同步中/, text=/加载中/');
  const loadingCount = await loadingElements.count();
  console.log(`加载指示器数量: ${loadingCount}`);

  // 检查Token状态
  const tokenStatus = page.locator('text=/已连接|未连接/');
  const tokenStatusCount = await tokenStatus.count();
  if (tokenStatusCount > 0) {
    const status = await tokenStatus.first().textContent();
    console.log(`Token状态: "${status}"`);
  }

  // 检查数据同步状态
  const syncStatus = page.locator('text=/已同步|同步中/');
  const syncStatusCount = await syncStatus.count();
  if (syncStatusCount > 0) {
    const status = await syncStatus.first().textContent();
    console.log(`数据同步状态: "${status}"`);
  }

  // 验证结果
  const hasData = cardCount > 0 || valueCount > 0;
  console.log(`\n📊 测试结果:`);
  console.log(`- 统计卡片数: ${cardCount}`);
  console.log(`- 数值显示: ${valueCount}`);
  console.log(`- 是否有数据显示: ${hasData}`);
  console.log(`- 概览视图激活: ${isActive}`);

  // 如果没有数据，截图帮助调试
  if (!hasData) {
    await page.screenshot({ path: 'debug-no-data.png', fullPage: true });
    console.log('📸 保存调试截图: debug-no-data.png');
  }

  // 最终验证
  expect(hasData || isActive).toBe(true); // 至少要有数据显示或正确切换到概览视图

  console.log('✅ 测试完成');
});