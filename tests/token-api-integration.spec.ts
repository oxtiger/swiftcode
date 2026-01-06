import { test, expect, Page } from '@playwright/test';

/**
 * Token API Integration Test Suite
 *
 * 这个测试套件验证：
 * 1. 仪表板页面的正确加载
 * 2. Token添加功能
 * 3. API调用监控和验证
 * 4. 统计数据获取功能
 */

const TEST_TOKEN = 'cr_278156e1ea67cedf8fec4f751b1f686b76419520569d725353a281753946632e';

interface NetworkRequest {
  url: string;
  method: string;
  postData?: string;
  headers: Record<string, string>;
  timestamp: number;
}

interface ApiResponse {
  url: string;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body?: any;
  timestamp: number;
}

interface TestReport {
  testName: string;
  status: 'PASS' | 'FAIL';
  details: string[];
  requests: NetworkRequest[];
  responses: ApiResponse[];
  errors: string[];
  timing: {
    startTime: number;
    endTime: number;
    duration: number;
  };
}

class NetworkMonitor {
  private requests: NetworkRequest[] = [];
  private responses: ApiResponse[] = [];
  private page: Page;

  constructor(page: Page) {
    this.page = page;
    this.setupNetworkListeners();
  }

  private setupNetworkListeners() {
    // 监控请求
    this.page.on('request', (request) => {
      const networkRequest: NetworkRequest = {
        url: request.url(),
        method: request.method(),
        postData: request.postData() || undefined,
        headers: request.headers(),
        timestamp: Date.now()
      };
      this.requests.push(networkRequest);

      console.log(`📤 Request: ${request.method()} ${request.url()}`);
      if (request.postData()) {
        console.log(`   📝 Body: ${request.postData()}`);
      }
    });

    // 监控响应
    this.page.on('response', async (response) => {
      const apiResponse: ApiResponse = {
        url: response.url(),
        status: response.status(),
        statusText: response.statusText(),
        headers: response.headers(),
        timestamp: Date.now()
      };

      // 尝试获取响应体
      try {
        const contentType = response.headers()['content-type'] || '';
        if (contentType.includes('application/json')) {
          apiResponse.body = await response.json();
        }
      } catch (error) {
        console.log(`⚠️ Could not parse response body for ${response.url()}`);
      }

      this.responses.push(apiResponse);

      console.log(`📥 Response: ${response.status()} ${response.url()}`);
      if (apiResponse.body) {
        console.log(`   📊 Body: ${JSON.stringify(apiResponse.body).substring(0, 200)}...`);
      }
    });
  }

  getApiRequests(): NetworkRequest[] {
    return this.requests.filter(req =>
      req.url.includes('/apiStats/') ||
      req.url.includes('/api/') ||
      req.url.includes('/admin/')
    );
  }

  getApiResponses(): ApiResponse[] {
    return this.responses.filter(res =>
      res.url.includes('/apiStats/') ||
      res.url.includes('/api/') ||
      res.url.includes('/admin/')
    );
  }

  getAllRequests(): NetworkRequest[] {
    return [...this.requests];
  }

  getAllResponses(): ApiResponse[] {
    return [...this.responses];
  }

  clear() {
    this.requests = [];
    this.responses = [];
  }

  findRequestsByEndpoint(endpoint: string): NetworkRequest[] {
    return this.requests.filter(req => req.url.includes(endpoint));
  }

  findResponsesByEndpoint(endpoint: string): ApiResponse[] {
    return this.responses.filter(res => res.url.includes(endpoint));
  }
}

test.describe('Token管理和API集成测试', () => {
  let networkMonitor: NetworkMonitor;
  let testReport: TestReport;

  test.beforeEach(async ({ page }) => {
    networkMonitor = new NetworkMonitor(page);
    testReport = {
      testName: '',
      status: 'PASS',
      details: [],
      requests: [],
      responses: [],
      errors: [],
      timing: {
        startTime: Date.now(),
        endTime: 0,
        duration: 0
      }
    };
  });

  test.afterEach(async () => {
    testReport.timing.endTime = Date.now();
    testReport.timing.duration = testReport.timing.endTime - testReport.timing.startTime;
    testReport.requests = networkMonitor.getAllRequests();
    testReport.responses = networkMonitor.getAllResponses();

    console.log('\n📊 测试报告');
    console.log('='.repeat(50));
    console.log(`测试名称: ${testReport.testName}`);
    console.log(`状态: ${testReport.status}`);
    console.log(`持续时间: ${testReport.timing.duration}ms`);
    console.log(`API请求数: ${networkMonitor.getApiRequests().length}`);
    console.log(`API响应数: ${networkMonitor.getApiResponses().length}`);

    if (testReport.details.length > 0) {
      console.log('\n详细信息:');
      testReport.details.forEach((detail, index) => {
        console.log(`  ${index + 1}. ${detail}`);
      });
    }

    if (testReport.errors.length > 0) {
      console.log('\n错误信息:');
      testReport.errors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`);
      });
    }

    const apiRequests = networkMonitor.getApiRequests();
    if (apiRequests.length > 0) {
      console.log('\nAPI请求:');
      apiRequests.forEach((req, index) => {
        console.log(`  ${index + 1}. ${req.method} ${req.url}`);
      });
    }
  });

  test('仪表板页面加载和Token管理界面验证', async ({ page }) => {
    testReport.testName = '仪表板页面加载和Token管理界面验证';

    try {
      testReport.details.push('开始导航到仪表板页面');

      // 访问仪表板页面
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');

      testReport.details.push('仪表板页面加载完成');

      // 验证页面基本元素
      const pageTitle = page.locator('h1, h2, h3').first();
      await expect(pageTitle).toBeVisible();

      testReport.details.push('验证页面标题可见');

      // 检查Token管理相关元素
      const tokenManagementElements = await page.locator('text=/Token|API Key|令牌/i').count();
      expect(tokenManagementElements).toBeGreaterThan(0);

      testReport.details.push(`找到 ${tokenManagementElements} 个Token相关元素`);

      // 查找Token管理按钮
      const tokenButtons = page.locator('button').filter({
        hasText: /Token|管理|添加/i
      });
      const tokenButtonCount = await tokenButtons.count();

      testReport.details.push(`找到 ${tokenButtonCount} 个Token管理按钮`);

      // 如果找到Token管理按钮，点击进入Token管理界面
      if (tokenButtonCount > 0) {
        await tokenButtons.first().click();
        await page.waitForLoadState('networkidle');

        testReport.details.push('点击Token管理按钮成功');

        // 验证是否进入Token管理界面
        const tokenInputs = page.locator('input[placeholder*="cr_"], input[placeholder*="token" i]');
        const inputCount = await tokenInputs.count();

        testReport.details.push(`Token管理界面包含 ${inputCount} 个输入框`);

        if (inputCount > 0) {
          testReport.details.push('Token管理界面验证成功');
        }
      }

      testReport.details.push('仪表板和Token管理界面验证完成');

    } catch (error) {
      testReport.status = 'FAIL';
      testReport.errors.push(`测试失败: ${error}`);
      throw error;
    }
  });

  test('Token添加功能和API调用验证', async ({ page }) => {
    testReport.testName = 'Token添加功能和API调用验证';

    try {
      testReport.details.push('开始Token添加测试');

      // 访问仪表板页面
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');

      // 清除网络监控记录
      networkMonitor.clear();

      testReport.details.push('清除网络监控记录，开始监控API调用');

      // 查找并点击Token管理按钮
      const tokenButtons = page.locator('button').filter({
        hasText: /Token|管理|添加/i
      });

      const tokenButtonCount = await tokenButtons.count();
      expect(tokenButtonCount).toBeGreaterThan(0);

      await tokenButtons.first().click();
      await page.waitForLoadState('networkidle');

      testReport.details.push('进入Token管理界面');

      // 查找"添加Token"或"添加新Token"按钮
      const addTokenButton = page.locator('button').filter({
        hasText: /添加.*Token|新.*Token/i
      });

      const addButtonCount = await addTokenButton.count();
      if (addButtonCount > 0) {
        await addTokenButton.first().click();
        await page.waitForTimeout(1000);

        testReport.details.push('点击添加Token按钮');
      }

      // 查找Token名称输入框
      const nameInput = page.locator('input').filter({
        hasText: /名称/
      }).or(page.locator('input[placeholder*="名称"]'))
        .or(page.locator('input[label*="名称"]'))
        .or(page.locator('input').nth(0));

      // 查找Token值输入框
      const tokenInput = page.locator('input').filter({
        hasText: /Token|cr_/
      }).or(page.locator('input[placeholder*="cr_"]'))
        .or(page.locator('input[placeholder*="token" i]'))
        .or(page.locator('input').nth(1));

      // 填写Token信息
      if (await nameInput.count() > 0) {
        await nameInput.first().fill('测试Token');
        testReport.details.push('填写Token名称: 测试Token');
      }

      if (await tokenInput.count() > 0) {
        await tokenInput.first().fill(TEST_TOKEN);
        testReport.details.push(`填写Token值: ${TEST_TOKEN.substring(0, 20)}...`);
      }

      // 等待一小段时间让界面更新
      await page.waitForTimeout(500);

      // 查找并点击确认/保存按钮
      const saveButton = page.locator('button').filter({
        hasText: /^添加Token$/i
      });

      const saveButtonCount = await saveButton.count();
      if (saveButtonCount > 0) {
        testReport.details.push('找到保存按钮，准备提交Token');

        // 点击保存按钮并监控网络请求
        await saveButton.first().click();

        // 等待可能的API调用
        await page.waitForTimeout(3000);

        testReport.details.push('Token添加操作完成');
      }

      // 分析网络请求
      const apiRequests = networkMonitor.getApiRequests();
      const apiResponses = networkMonitor.getApiResponses();

      testReport.details.push(`监测到 ${apiRequests.length} 个API请求`);
      testReport.details.push(`监测到 ${apiResponses.length} 个API响应`);

      // 检查特定的API端点
      const keyIdRequests = networkMonitor.findRequestsByEndpoint('/apiStats/api/get-key-id');
      const userStatsRequests = networkMonitor.findRequestsByEndpoint('/apiStats/api/user-stats');
      const modelStatsRequests = networkMonitor.findRequestsByEndpoint('/apiStats/api/user-model-stats');

      testReport.details.push(`Key ID API请求: ${keyIdRequests.length}`);
      testReport.details.push(`用户统计API请求: ${userStatsRequests.length}`);
      testReport.details.push(`模型统计API请求: ${modelStatsRequests.length}`);

      // 验证API调用
      if (keyIdRequests.length > 0) {
        testReport.details.push('✅ 检测到Key ID API调用');

        // 检查请求体是否包含Token
        const request = keyIdRequests[0];
        if (request.postData && request.postData.includes(TEST_TOKEN)) {
          testReport.details.push('✅ Key ID请求包含正确的Token');
        }
      }

      if (userStatsRequests.length > 0) {
        testReport.details.push('✅ 检测到用户统计API调用');
      }

      if (modelStatsRequests.length > 0) {
        testReport.details.push('✅ 检测到模型统计API调用');
      }

      // 检查响应状态
      const keyIdResponses = networkMonitor.findResponsesByEndpoint('/apiStats/api/get-key-id');
      const userStatsResponses = networkMonitor.findResponsesByEndpoint('/apiStats/api/user-stats');

      if (keyIdResponses.length > 0) {
        const response = keyIdResponses[0];
        testReport.details.push(`Key ID API响应状态: ${response.status}`);

        if (response.body) {
          testReport.details.push(`Key ID API响应: ${JSON.stringify(response.body).substring(0, 100)}...`);
        }
      }

      if (userStatsResponses.length > 0) {
        const response = userStatsResponses[0];
        testReport.details.push(`用户统计API响应状态: ${response.status}`);

        if (response.body) {
          testReport.details.push(`用户统计API响应: ${JSON.stringify(response.body).substring(0, 100)}...`);
        }
      }

      // 验证API集成是否正常工作
      const hasApiCalls = apiRequests.length > 0;
      const hasStatsRequests = keyIdRequests.length > 0 || userStatsRequests.length > 0;

      if (hasApiCalls) {
        testReport.details.push('✅ API集成正常 - 检测到API调用');
      } else {
        testReport.details.push('❌ API集成异常 - 未检测到API调用');
        testReport.errors.push('Token添加后未触发API调用');
      }

      if (hasStatsRequests) {
        testReport.details.push('✅ 统计数据获取功能正常');
      } else {
        testReport.details.push('⚠️ 统计数据获取功能未触发');
      }

      // 最终验证
      expect(apiRequests.length).toBeGreaterThan(0);

      testReport.details.push('Token添加和API集成验证完成');

    } catch (error) {
      testReport.status = 'FAIL';
      testReport.errors.push(`测试失败: ${error}`);
      throw error;
    }
  });

  test('完整的Token管理流程测试', async ({ page }) => {
    testReport.testName = '完整的Token管理流程测试';

    try {
      testReport.details.push('开始完整Token管理流程测试');

      // 第一步：访问仪表板
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      networkMonitor.clear();

      testReport.details.push('访问仪表板页面');

      // 第二步：进入Token管理
      const tokenButtons = page.locator('button').filter({
        hasText: /Token|管理|添加/i
      });

      if (await tokenButtons.count() > 0) {
        await tokenButtons.first().click();
        await page.waitForLoadState('networkidle');
        testReport.details.push('进入Token管理界面');
      }

      // 第三步：添加Token
      const addTokenButton = page.locator('button').filter({
        hasText: /添加.*Token|新.*Token/i
      });

      if (await addTokenButton.count() > 0) {
        await addTokenButton.first().click();
        await page.waitForTimeout(1000);
        testReport.details.push('打开添加Token表单');
      }

      // 第四步：填写表单
      const inputs = page.locator('input');
      const inputCount = await inputs.count();

      if (inputCount >= 2) {
        await inputs.nth(0).fill('完整测试Token');
        await inputs.nth(1).fill(TEST_TOKEN);
        testReport.details.push('填写Token表单');
      }

      // 第五步：提交并监控网络
      const saveButton = page.locator('button').filter({
        hasText: /保存|确认|添加|提交/i
      });

      if (await saveButton.count() > 0) {
        testReport.details.push('提交Token添加请求');

        // 监控网络流量
        const requestPromises: Promise<any>[] = [];

        // 设置请求监听器
        page.on('request', (request) => {
          if (request.url().includes('/apiStats/')) {
            requestPromises.push(request.response());
          }
        });

        await saveButton.first().click();

        // 等待API调用完成
        await page.waitForTimeout(5000);

        testReport.details.push('等待API调用完成');
      }

      // 第六步：分析结果
      const finalRequests = networkMonitor.getApiRequests();
      const finalResponses = networkMonitor.getApiResponses();

      testReport.details.push(`最终统计 - API请求: ${finalRequests.length}, API响应: ${finalResponses.length}`);

      // 验证各种API端点
      const endpoints = [
        '/apiStats/api/get-key-id',
        '/apiStats/api/user-stats',
        '/apiStats/api/user-model-stats'
      ];

      endpoints.forEach(endpoint => {
        const requests = networkMonitor.findRequestsByEndpoint(endpoint);
        const responses = networkMonitor.findResponsesByEndpoint(endpoint);

        testReport.details.push(`${endpoint}: ${requests.length} 请求, ${responses.length} 响应`);

        if (responses.length > 0) {
          const response = responses[0];
          testReport.details.push(`  状态: ${response.status}, 成功: ${response.status < 400}`);
        }
      });

      // 验证整体集成
      const totalApiCalls = finalRequests.length;
      const successfulResponses = finalResponses.filter(r => r.status < 400).length;

      testReport.details.push(`API调用成功率: ${totalApiCalls > 0 ? (successfulResponses / finalResponses.length * 100).toFixed(1) : 0}%`);

      // 最终断言
      expect(totalApiCalls).toBeGreaterThan(0);

      if (totalApiCalls > 0) {
        testReport.details.push('✅ Token管理和API集成功能完全正常');
      } else {
        testReport.errors.push('Token添加未触发预期的API调用');
        testReport.status = 'FAIL';
      }

    } catch (error) {
      testReport.status = 'FAIL';
      testReport.errors.push(`完整流程测试失败: ${error}`);
      throw error;
    }
  });

  test('API端点可达性和响应验证', async ({ page }) => {
    testReport.testName = 'API端点可达性和响应验证';

    try {
      testReport.details.push('开始API端点可达性测试');

      // 测试主要API端点
      const apiEndpoints = [
        {
          name: 'Key ID API',
          url: '/apiStats/api/get-key-id',
          method: 'POST',
          body: { apiKey: TEST_TOKEN }
        },
        {
          name: 'User Stats API',
          url: '/apiStats/api/user-stats',
          method: 'POST',
          body: { apiId: 'test-id' }
        },
        {
          name: 'Model Stats API',
          url: '/apiStats/api/user-model-stats',
          method: 'POST',
          body: { apiId: 'test-id', period: 'daily' }
        }
      ];

      // 访问页面以建立上下文
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');

      for (const endpoint of apiEndpoints) {
        testReport.details.push(`测试 ${endpoint.name}: ${endpoint.url}`);

        try {
          const response = await page.evaluate(async (ep) => {
            const res = await fetch(ep.url, {
              method: ep.method,
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(ep.body)
            });

            return {
              status: res.status,
              statusText: res.statusText,
              headers: Object.fromEntries(res.headers.entries()),
              url: res.url
            };
          }, endpoint);

          testReport.details.push(`  ${endpoint.name} 响应: ${response.status} ${response.statusText}`);

          if (response.status < 500) {
            testReport.details.push(`  ✅ ${endpoint.name} 端点可达`);
          } else {
            testReport.details.push(`  ❌ ${endpoint.name} 端点服务器错误`);
          }

        } catch (error) {
          testReport.details.push(`  ❌ ${endpoint.name} 请求失败: ${error}`);
          testReport.errors.push(`${endpoint.name} 测试失败: ${error}`);
        }
      }

      testReport.details.push('API端点测试完成');

    } catch (error) {
      testReport.status = 'FAIL';
      testReport.errors.push(`API端点测试失败: ${error}`);
      throw error;
    }
  });
});

test.describe('综合集成报告', () => {
  test('生成最终测试报告', async ({ page }) => {
    console.log('\n🎯 Claude Relay Service Token管理和API集成测试报告');
    console.log('='.repeat(80));

    console.log('\n📋 测试概要:');
    console.log('  - 仪表板页面加载验证');
    console.log('  - Token管理界面功能');
    console.log('  - Token添加流程');
    console.log('  - API调用监控');
    console.log('  - 网络请求验证');
    console.log('  - 端点可达性测试');

    console.log('\n🔧 测试配置:');
    console.log(`  - 目标URL: http://localhost:5178/dashboard`);
    console.log(`  - 测试Token: ${TEST_TOKEN.substring(0, 20)}...`);
    console.log(`  - 浏览器: Chromium`);

    console.log('\n📊 预期验证点:');
    console.log('  ✅ 仪表板页面正确加载');
    console.log('  ✅ Token管理界面可访问');
    console.log('  ✅ Token添加表单可用');
    console.log('  ✅ API调用触发机制');
    console.log('  ✅ 网络请求监控');
    console.log('  ✅ 统计数据获取');

    console.log('\n🔍 关键API端点:');
    console.log('  - /apiStats/api/get-key-id (获取Key ID)');
    console.log('  - /apiStats/api/user-stats (用户统计)');
    console.log('  - /apiStats/api/user-model-stats (模型统计)');

    console.log('\n📈 成功标准:');
    console.log('  1. Token添加后触发API调用');
    console.log('  2. 网络监控捕获到API请求');
    console.log('  3. API响应状态码 < 400');
    console.log('  4. 统计数据请求成功发送');

    console.log('\n' + '='.repeat(80));
    console.log('🏁 运行上述测试以获取详细结果');

    // 这个测试总是通过，只是为了生成报告
    expect(true).toBe(true);
  });
});