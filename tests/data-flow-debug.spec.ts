import { test, expect } from '@playwright/test';

/**
 * 数据流调试测试
 * 详细跟踪从Token添加到数据显示的完整流程
 */

const TEST_TOKEN = 'cr_278156e1ea67cedf8fec4f751b1f686b76419520569d725353a281753946632e';

test('数据流调试测试 - 完整链路验证', async ({ page }) => {
  console.log('\n🔍 开始数据流调试测试');

  // 监控所有API请求和响应
  const apiCalls: any[] = [];
  const apiResponses: any[] = [];

  page.on('request', (request) => {
    if (request.url().includes('/apiStats/')) {
      apiCalls.push({
        url: request.url(),
        method: request.method(),
        postData: request.postData(),
        timestamp: Date.now()
      });
      console.log(`📤 API请求: ${request.method()} ${request.url()}`);
      if (request.postData()) {
        console.log(`   📝 请求体: ${request.postData()}`);
      }
    }
  });

  page.on('response', async (response) => {
    if (response.url().includes('/apiStats/')) {
      let responseBody = null;
      try {
        const contentType = response.headers()['content-type'] || '';
        if (contentType.includes('application/json')) {
          responseBody = await response.json();
        }
      } catch (error) {
        console.log(`⚠️ 无法解析响应体: ${error}`);
      }

      apiResponses.push({
        url: response.url(),
        status: response.status(),
        body: responseBody,
        timestamp: Date.now()
      });

      console.log(`📥 API响应: ${response.status()} ${response.url()}`);
      if (responseBody) {
        console.log(`   📊 响应体: ${JSON.stringify(responseBody, null, 2)}`);
      }
    }
  });

  // 监控控制台消息
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      console.log(`❌ 浏览器错误: ${msg.text()}`);
    } else if (msg.text().includes('stats') || msg.text().includes('token') || msg.text().includes('API')) {
      console.log(`💬 浏览器日志: ${msg.text()}`);
    }
  });

  // 第一步：访问仪表板页面
  console.log('\n1️⃣ 访问仪表板页面');
  await page.goto('/dashboard');
  await page.waitForLoadState('networkidle');
  console.log('✅ 仪表板页面加载完成');

  // 第二步：检查初始状态
  console.log('\n2️⃣ 检查初始数据状态');

  // 检查是否有存储的Token
  const storedTokens = await page.evaluate(() => {
    return localStorage.getItem('api-tokens');
  });
  console.log(`💾 本地存储的Token: ${storedTokens ? 'yes' : 'no'}`);

  // 检查初始API统计值
  const initialStats = await page.locator('[data-testid="api-stat-value"]').allTextContents();
  console.log(`📊 初始统计值: ${JSON.stringify(initialStats)}`);

  // 第三步：添加Token
  console.log('\n3️⃣ 开始添加Token流程');

  // 进入Token管理
  await page.click('button:has-text("Token管理")');
  await page.waitForTimeout(1000);
  console.log('✅ 进入Token管理界面');

  // 点击添加新Token
  await page.click('button:has-text("添加新Token")');
  await page.waitForTimeout(1000);
  console.log('✅ 打开添加Token表单');

  // 填写表单
  const inputs = page.locator('input');
  await inputs.nth(0).fill('数据流测试Token');
  await inputs.nth(1).fill(TEST_TOKEN);
  console.log('✅ 表单填写完成');

  // 清空API调用记录，专注于Token添加后的API调用
  apiCalls.length = 0;
  apiResponses.length = 0;

  // 提交表单
  console.log('\n4️⃣ 提交Token添加表单');
  await page.click('button:has-text("添加Token")');

  // 等待API调用和页面更新
  await page.waitForTimeout(5000);
  console.log('✅ Token添加操作完成');

  // 第四步：验证API调用
  console.log('\n5️⃣ 验证API调用');
  console.log(`📊 API请求总数: ${apiCalls.length}`);
  console.log(`📊 API响应总数: ${apiResponses.length}`);

  apiCalls.forEach((call, index) => {
    console.log(`  请求${index + 1}: ${call.method} ${call.url.split('/').pop()}`);
  });

  apiResponses.forEach((response, index) => {
    console.log(`  响应${index + 1}: ${response.status} ${response.url.split('/').pop()}`);
    if (response.body) {
      if (response.url.includes('get-key-id')) {
        console.log(`    Key ID: ${response.body.data?.id || 'N/A'}`);
      } else if (response.url.includes('user-stats')) {
        console.log(`    用户统计: ${JSON.stringify(response.body.data || {}, null, 2)}`);
      } else if (response.url.includes('user-model-stats')) {
        console.log(`    模型统计: 包含${response.body.data?.length || 0}条记录`);
      }
    }
  });

  // 第五步：检查页面状态
  console.log('\n6️⃣ 检查页面状态');

  // 检查是否自动切换到概览视图
  const overviewButton = page.locator('button:has-text("概览")');
  const isOverviewActive = await overviewButton.getAttribute('class');
  const isActive = isOverviewActive?.includes('bg-orange');
  console.log(`📱 概览视图是否激活: ${isActive}`);

  // 检查Zustand Store状态
  const storeState = await page.evaluate(() => {
    // @ts-ignore
    return window.__ZUSTAND_STORE_STATE__ || 'Store not accessible';
  });
  console.log(`🏪 Store状态: ${typeof storeState === 'object' ? 'accessible' : 'not accessible'}`);

  // 第六步：检查数据显示
  console.log('\n7️⃣ 检查数据显示');

  // 等待数据加载
  await page.waitForTimeout(2000);

  // 查找统计卡片
  const statCards = page.locator('.grid .group, [role="group"], .bg-orange-50, .bg-green-50, .bg-blue-50, .bg-purple-50');
  const cardCount = await statCards.count();
  console.log(`📊 统计卡片数量: ${cardCount}`);

  // 查找所有数值显示元素
  const valueElements = page.locator('text=/^\\d+/ >> visible, text=/\\$\\d/ >> visible, text=/%/ >> visible');
  const valueCount = await valueElements.count();
  console.log(`🔢 数值元素数量: ${valueCount}`);

  if (valueCount > 0) {
    for (let i = 0; i < Math.min(valueCount, 10); i++) {
      try {
        const value = await valueElements.nth(i).textContent();
        console.log(`  数值${i + 1}: "${value}"`);
      } catch (error) {
        console.log(`  数值${i + 1}: 读取失败`);
      }
    }
  }

  // 查找特定的统计值（非"-"和"0"）
  const actualDataElements = page.locator('.text-3xl.font-bold').filter({ hasNotText: /^[-0]$/ });
  const actualDataCount = await actualDataElements.count();
  console.log(`📈 显示实际数据的元素: ${actualDataCount}`);

  if (actualDataCount > 0) {
    for (let i = 0; i < actualDataCount; i++) {
      const value = await actualDataElements.nth(i).textContent();
      console.log(`  实际数据${i + 1}: "${value}"`);
    }
  }

  // 第七步：检查加载状态
  console.log('\n8️⃣ 检查加载状态');

  const loadingElements = page.locator('.animate-pulse, text=/同步中/, text=/加载中/');
  const loadingCount = await loadingElements.count();
  console.log(`⏳ 加载指示器数量: ${loadingCount}`);

  // 检查错误状态
  const errorElements = page.locator('text=/失败|错误|异常/');
  const errorCount = await errorElements.count();
  console.log(`❌ 错误指示器数量: ${errorCount}`);

  if (errorCount > 0) {
    for (let i = 0; i < errorCount; i++) {
      const errorText = await errorElements.nth(i).textContent();
      console.log(`  错误${i + 1}: "${errorText}"`);
    }
  }

  // 第八步：最终验证
  console.log('\n9️⃣ 最终验证');

  const hasApiCalls = apiCalls.length > 0;
  const hasSuccessfulResponses = apiResponses.filter(r => r.status < 400).length > 0;
  const hasActualData = actualDataCount > 0;
  const isInOverviewMode = isActive;

  console.log(`📊 总结:`);
  console.log(`  - API调用是否发生: ${hasApiCalls ? '✅' : '❌'}`);
  console.log(`  - API响应是否成功: ${hasSuccessfulResponses ? '✅' : '❌'}`);
  console.log(`  - 页面是否显示数据: ${hasActualData ? '✅' : '❌'}`);
  console.log(`  - 是否在概览模式: ${isInOverviewMode ? '✅' : '❌'}`);

  // 如果数据仍然没有显示，截图帮助调试
  if (!hasActualData) {
    await page.screenshot({ path: 'data-flow-debug.png', fullPage: true });
    console.log('📸 保存调试截图: data-flow-debug.png');
  }

  // 验证核心功能
  expect(hasApiCalls).toBe(true);
  expect(hasSuccessfulResponses).toBe(true);

  console.log('✅ 数据流调试测试完成');
});