import { test, expect } from '@playwright/test';

const TEST_TOKEN = 'cr_278156e1ea67cedf8fec4f751b1f686b76419520569d725353a281753946632e';

test('简化数据流测试', async ({ page }) => {
  console.log('\n🔍 开始简化数据流测试');

  // 监控API调用
  const apiCalls: any[] = [];
  const apiResponses: any[] = [];

  page.on('request', (request) => {
    if (request.url().includes('/apiStats/')) {
      apiCalls.push({
        url: request.url(),
        method: request.method(),
      });
      console.log(`📤 API请求: ${request.method()} ${request.url()}`);
    }
  });

  page.on('response', async (response) => {
    if (response.url().includes('/apiStats/')) {
      let responseData = null;
      try {
        if (response.headers()['content-type']?.includes('application/json')) {
          responseData = await response.json();
        }
      } catch (error) {
        // 忽略解析错误
      }

      apiResponses.push({
        url: response.url(),
        status: response.status(),
        data: responseData
      });

      console.log(`📥 API响应: ${response.status()} ${response.url()}`);
      if (responseData && response.url().includes('get-key-id')) {
        console.log(`   Key ID: ${responseData.data?.id || 'N/A'}`);
      }
      if (responseData && response.url().includes('user-stats')) {
        console.log(`   用户统计数据: ${JSON.stringify(responseData.data || {})}`);
      }
    }
  });

  // 访问页面
  await page.goto('/dashboard');
  await page.waitForLoadState('networkidle');
  console.log('✅ 页面加载完成');

  // 清空之前的API调用记录
  apiCalls.length = 0;
  apiResponses.length = 0;

  // 添加Token流程
  await page.click('button:has-text("Token管理")');
  await page.waitForTimeout(1000);

  await page.click('button:has-text("添加新Token")');
  await page.waitForTimeout(1000);

  const inputs = page.locator('input');
  await inputs.nth(0).fill('测试Token');
  await inputs.nth(1).fill(TEST_TOKEN);

  // 提交Token
  console.log('🚀 提交Token...');
  await page.click('button:has-text("添加Token")');

  // 等待API调用
  await page.waitForTimeout(8000);

  // 分析API调用结果
  console.log(`\n📊 API调用分析:`);
  console.log(`  - API请求数: ${apiCalls.length}`);
  console.log(`  - API响应数: ${apiResponses.length}`);

  const keyIdCalls = apiCalls.filter(call => call.url.includes('get-key-id'));
  const userStatsCalls = apiCalls.filter(call => call.url.includes('user-stats'));

  console.log(`  - Key ID 调用: ${keyIdCalls.length}`);
  console.log(`  - 用户统计调用: ${userStatsCalls.length}`);

  // 检查响应
  const successfulResponses = apiResponses.filter(r => r.status >= 200 && r.status < 300);
  console.log(`  - 成功响应数: ${successfulResponses.length}`);

  // 检查页面状态
  const overviewButton = page.locator('button:has-text("概览")');
  const isOverviewActive = await overviewButton.getAttribute('class');
  const isActive = isOverviewActive?.includes('bg-orange');
  console.log(`  - 概览视图激活: ${isActive}`);

  // 检查数据显示 - 使用简单的选择器
  const statCards = page.locator('.text-3xl.font-bold');
  const cardCount = await statCards.count();
  console.log(`  - 统计数值元素: ${cardCount}`);

  if (cardCount > 0) {
    for (let i = 0; i < Math.min(cardCount, 10); i++) {
      try {
        const value = await statCards.nth(i).textContent();
        console.log(`    值${i + 1}: "${value}"`);
      } catch (error) {
        console.log(`    值${i + 1}: 读取失败`);
      }
    }
  }

  // 查找非默认值
  const nonDefaultValues = [];
  for (let i = 0; i < cardCount; i++) {
    try {
      const value = await statCards.nth(i).textContent();
      if (value && value !== '-' && value !== '0' && !value.includes('$0.000000')) {
        nonDefaultValues.push(value);
      }
    } catch (error) {
      // 忽略错误
    }
  }

  console.log(`  - 非默认值数量: ${nonDefaultValues.length}`);
  if (nonDefaultValues.length > 0) {
    console.log(`  - 非默认值: ${JSON.stringify(nonDefaultValues)}`);
  }

  // 最终验证
  console.log(`\n✅ 测试结果:`);
  console.log(`  - API调用正常: ${apiCalls.length > 0 ? '是' : '否'}`);
  console.log(`  - 数据更新: ${nonDefaultValues.length > 0 ? '是' : '否'}`);
  console.log(`  - 视图切换: ${isActive ? '是' : '否'}`);

  // 如果数据没有更新，截图调试
  if (nonDefaultValues.length === 0) {
    await page.screenshot({ path: 'no-data-debug.png', fullPage: true });
    console.log('📸 保存调试截图');
  }

  expect(apiCalls.length).toBeGreaterThan(0);
});