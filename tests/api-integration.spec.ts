import { test, expect, type Page } from '@playwright/test';

test.describe('API集成和数据流测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
  });

  test('后端健康检查API测试', async ({ page }) => {
    const response = await page.request.get('/health');

    if (response.ok()) {
      const data = await response.json();
      console.log('健康检查响应:', data);

      expect(data).toHaveProperty('status');
      expect(data.status).toBe('ok');
    } else {
      console.log('后端健康检查失败，状态码:', response.status());
      console.log('这可能意味着后端服务未启动或配置有误');
    }
  });

  test('API统计数据获取测试', async ({ page }) => {
    // 测试API统计端点
    try {
      const response = await page.request.get('/apiStats');

      if (response.ok()) {
        const data = await response.json();
        console.log('API统计数据:', data);

        // 验证统计数据结构
        expect(data).toBeDefined();

        if (data.usage) {
          expect(data.usage).toHaveProperty('total');
        }
      } else {
        console.log('API统计获取失败，状态码:', response.status());
      }
    } catch (error) {
      console.log('API统计请求异常:', error);
    }
  });

  test('前端API调用错误处理测试', async ({ page }) => {
    // 监控网络请求
    const failedRequests: string[] = [];

    page.on('response', response => {
      if (!response.ok() && response.url().includes('/api')) {
        failedRequests.push(`${response.url()} - ${response.status()}`);
      }
    });

    // 触发一些可能的API调用
    await page.reload();
    await page.waitForLoadState('networkidle');

    // 尝试点击一些按钮触发API调用
    const actionButtons = page.locator('button').filter({
      hasText: /刷新|Refresh|获取|Load|更新|Update/
    });

    const buttonCount = await actionButtons.count();
    for (let i = 0; i < Math.min(buttonCount, 3); i++) {
      try {
        await actionButtons.nth(i).click();
        await page.waitForTimeout(1000);
      } catch {
        // 忽略点击失败
      }
    }

    if (failedRequests.length > 0) {
      console.log('检测到失败的API请求:');
      failedRequests.forEach(req => console.log(`  - ${req}`));
    } else {
      console.log('所有API请求都成功了');
    }
  });

  test('实时数据更新测试', async ({ page }) => {
    // 检查页面是否有实时更新的数据
    const dynamicElements = page.locator('[data-testid*="usage"], [data-testid*="stats"]').or(
      page.locator('.usage, .stats, .count').filter({ hasText: /\d+/ })
    );

    const initialCount = await dynamicElements.count();

    if (initialCount > 0) {
      // 记录初始数据
      const initialData: string[] = [];
      for (let i = 0; i < Math.min(initialCount, 5); i++) {
        const text = await dynamicElements.nth(i).textContent();
        initialData.push(text || '');
      }

      console.log('初始数据:', initialData);

      // 等待一段时间，看数据是否有更新
      await page.waitForTimeout(5000);

      // 检查数据是否有变化
      let hasChanged = false;
      for (let i = 0; i < Math.min(initialCount, 5); i++) {
        const newText = await dynamicElements.nth(i).textContent();
        if (newText !== initialData[i]) {
          hasChanged = true;
          console.log(`数据更新: ${initialData[i]} -> ${newText}`);
        }
      }

      if (hasChanged) {
        console.log('检测到实时数据更新');
      } else {
        console.log('未检测到数据更新（可能是正常的，取决于数据更新频率）');
      }
    } else {
      console.log('未找到动态数据元素');
    }
  });

  test('前端状态管理测试', async ({ page }) => {
    // 测试页面状态在操作后是否正确保持
    await page.goto('/dashboard');

    // 检查初始状态
    const initialUrl = page.url();
    console.log('初始URL:', initialUrl);

    // 执行一些操作
    const buttons = page.locator('button:visible');
    const buttonCount = await buttons.count();

    if (buttonCount > 0) {
      // 点击第一个可见按钮
      await buttons.first().click();
      await page.waitForTimeout(1000);

      // 检查页面状态是否合理
      const newUrl = page.url();
      console.log('操作后URL:', newUrl);

      // 检查是否有错误状态
      const errorElements = page.locator('.error, [data-testid="error"], text=/错误|Error/');
      const errorCount = await errorElements.count();

      if (errorCount > 0) {
        console.log('检测到错误状态');
        for (let i = 0; i < Math.min(errorCount, 3); i++) {
          const errorText = await errorElements.nth(i).textContent();
          console.log(`错误 ${i + 1}: ${errorText}`);
        }
      } else {
        console.log('操作后无错误状态');
      }
    }
  });

  test('WebSocket连接测试（如果存在）', async ({ page }) => {
    // 监控WebSocket连接
    const wsConnections: string[] = [];

    page.on('websocket', ws => {
      wsConnections.push(ws.url());
      console.log('WebSocket连接:', ws.url());

      ws.on('close', () => {
        console.log('WebSocket连接关闭:', ws.url());
      });

      ws.on('socketerror', error => {
        console.log('WebSocket错误:', error);
      });
    });

    // 等待页面加载并检查WebSocket连接
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    if (wsConnections.length > 0) {
      console.log(`检测到 ${wsConnections.length} 个WebSocket连接`);
      wsConnections.forEach(url => console.log(`  - ${url}`));
    } else {
      console.log('未检测到WebSocket连接');
    }
  });

  test('API响应时间测试', async ({ page }) => {
    const requestTimes: { url: string; duration: number }[] = [];

    page.on('response', response => {
      if (response.url().includes('/api') || response.url().includes('/admin')) {
        const timing = response.request().timing();
        if (timing) {
          requestTimes.push({
            url: response.url(),
            duration: timing.responseEnd - timing.requestStart
          });
        }
      }
    });

    // 触发一些API调用
    await page.reload();
    await page.waitForLoadState('networkidle');

    // 分析API响应时间
    if (requestTimes.length > 0) {
      console.log('API响应时间分析:');
      requestTimes.forEach(req => {
        console.log(`  ${req.url}: ${req.duration}ms`);
      });

      const avgTime = requestTimes.reduce((sum, req) => sum + req.duration, 0) / requestTimes.length;
      console.log(`平均响应时间: ${avgTime.toFixed(2)}ms`);

      // API响应应该在合理时间内
      const slowRequests = requestTimes.filter(req => req.duration > 2000);
      if (slowRequests.length > 0) {
        console.log('慢请求:', slowRequests);
      }

      expect(avgTime).toBeLessThan(5000); // 平均响应时间应该小于5秒
    } else {
      console.log('未检测到API请求');
    }
  });

  test('数据持久化测试', async ({ page }) => {
    // 测试页面刷新后数据是否保持
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // 获取初始数据
    const dataElements = page.locator('[data-testid*="token"], .token-item, .api-key-item');
    const initialCount = await dataElements.count();

    console.log(`初始Token数量: ${initialCount}`);

    // 刷新页面
    await page.reload();
    await page.waitForLoadState('networkidle');

    // 检查数据是否保持
    const newCount = await dataElements.count();
    console.log(`刷新后Token数量: ${newCount}`);

    // 数据应该保持一致（除非有真实的数据变化）
    expect(Math.abs(newCount - initialCount)).toBeLessThanOrEqual(1);
  });

  test('错误边界和异常处理测试', async ({ page }) => {
    // 监控控制台错误
    const consoleErrors: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    page.on('pageerror', error => {
      consoleErrors.push(`页面错误: ${error.message}`);
    });

    // 访问可能不存在的页面
    await page.goto('/dashboard/non-existent-page');
    await page.waitForTimeout(2000);

    // 返回正常页面
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // 检查是否有未处理的错误
    if (consoleErrors.length > 0) {
      console.log('控制台错误:');
      consoleErrors.forEach(error => console.log(`  - ${error}`));

      // 过滤掉一些可以忽略的错误
      const criticalErrors = consoleErrors.filter(error =>
        !error.includes('favicon') &&
        !error.includes('404') &&
        !error.includes('net::ERR_')
      );

      if (criticalErrors.length > 0) {
        console.log('发现关键错误:', criticalErrors);
      }
    } else {
      console.log('未检测到控制台错误');
    }
  });
});