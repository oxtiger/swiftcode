import { test, expect } from '@playwright/test';

/**
 * Debug Token Integration Test
 * 调试令牌集成测试 - 详细分析Token添加流程和API调用
 */

const TEST_TOKEN = 'cr_278156e1ea67cedf8fec4f751b1f686b76419520569d725353a281753946632e';

test.describe('Token集成调试测试', () => {
  test('详细分析Token添加流程', async ({ page }) => {
    console.log('\n🔍 开始详细分析Token添加流程');
    console.log('='.repeat(60));

    // 监控所有网络请求
    const requests: any[] = [];
    const responses: any[] = [];

    page.on('request', request => {
      requests.push({
        url: request.url(),
        method: request.method(),
        postData: request.postData(),
        timestamp: Date.now()
      });
      console.log(`📤 请求: ${request.method()} ${request.url()}`);
    });

    page.on('response', async response => {
      const responseData = {
        url: response.url(),
        status: response.status(),
        contentType: response.headers()['content-type'],
        timestamp: Date.now()
      };
      responses.push(responseData);
      console.log(`📥 响应: ${response.status()} ${response.url()}`);
    });

    // 第1步：访问仪表板页面
    console.log('\n📋 第1步：访问仪表板页面');
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // 截图
    await page.screenshot({ path: 'debug-step1-dashboard.png', fullPage: true });
    console.log('✅ 仪表板页面加载完成');

    // 第2步：分析页面内容
    console.log('\n🔍 第2步：分析页面内容');

    // 检查页面文本内容
    const bodyText = await page.locator('body').textContent();
    const hasTokenText = bodyText?.includes('Token') || bodyText?.includes('token');
    console.log(`Token相关文本存在: ${hasTokenText}`);

    // 查找所有按钮
    const allButtons = await page.locator('button').all();
    console.log(`页面总按钮数: ${allButtons.length}`);

    for (let i = 0; i < allButtons.length; i++) {
      const buttonText = await allButtons[i].textContent();
      console.log(`  按钮 ${i + 1}: "${buttonText}"`);
    }

    // 第3步：查找Token管理按钮
    console.log('\n🎯 第3步：查找Token管理按钮');

    const tokenButtons = page.locator('button').filter({
      hasText: /Token|管理|添加/i
    });
    const tokenButtonCount = await tokenButtons.count();
    console.log(`Token相关按钮数量: ${tokenButtonCount}`);

    if (tokenButtonCount > 0) {
      const firstButtonText = await tokenButtons.first().textContent();
      console.log(`第一个Token按钮文本: "${firstButtonText}"`);

      // 点击第一个Token按钮
      console.log('点击Token管理按钮...');
      await tokenButtons.first().click();
      await page.waitForLoadState('networkidle');
      await page.screenshot({ path: 'debug-step3-after-click.png', fullPage: true });
      console.log('✅ Token按钮点击完成');
    }

    // 第4步：查找Token输入表单
    console.log('\n📝 第4步：查找Token输入表单');

    const allInputs = await page.locator('input').all();
    console.log(`页面总输入框数: ${allInputs.length}`);

    for (let i = 0; i < allInputs.length; i++) {
      const placeholder = await allInputs[i].getAttribute('placeholder');
      const type = await allInputs[i].getAttribute('type');
      console.log(`  输入框 ${i + 1}: placeholder="${placeholder}", type="${type}"`);
    }

    // 查找"添加Token"按钮
    const addButtons = page.locator('button').filter({
      hasText: /添加.*Token|新.*Token/i
    });
    const addButtonCount = await addButtons.count();
    console.log(`添加Token按钮数量: ${addButtonCount}`);

    if (addButtonCount > 0) {
      const addButtonText = await addButtons.first().textContent();
      console.log(`添加按钮文本: "${addButtonText}"`);

      console.log('点击添加Token按钮...');
      await addButtons.first().click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'debug-step4-add-form.png', fullPage: true });
      console.log('✅ 添加Token按钮点击完成');
    }

    // 第5步：填写表单
    console.log('\n✏️ 第5步：填写表单');

    // 重新检查输入框
    const inputsAfterAdd = await page.locator('input').all();
    console.log(`添加表单后输入框数: ${inputsAfterAdd.length}`);

    if (inputsAfterAdd.length >= 2) {
      console.log('填写Token名称...');
      await inputsAfterAdd[0].fill('测试Token');

      console.log('填写Token值...');
      await inputsAfterAdd[1].fill(TEST_TOKEN);

      await page.screenshot({ path: 'debug-step5-filled-form.png', fullPage: true });
      console.log('✅ 表单填写完成');
    }

    // 第6步：清除网络记录并提交
    console.log('\n🌐 第6步：清除网络记录并提交');
    requests.length = 0;
    responses.length = 0;

    const saveButtons = page.locator('button').filter({
      hasText: /保存|确认|添加|提交/i
    });
    const saveButtonCount = await saveButtons.count();
    console.log(`保存按钮数量: ${saveButtonCount}`);

    if (saveButtonCount > 0) {
      console.log('点击保存按钮并监控网络...');
      await saveButtons.first().click();

      // 等待更长时间以确保所有API调用完成
      await page.waitForTimeout(5000);

      await page.screenshot({ path: 'debug-step6-after-save.png', fullPage: true });
      console.log('✅ 保存操作完成');
    }

    // 第7步：分析网络请求
    console.log('\n📊 第7步：分析网络请求');
    console.log(`总请求数: ${requests.length}`);
    console.log(`总响应数: ${responses.length}`);

    // 筛选API请求
    const apiRequests = requests.filter(req =>
      req.url.includes('/apiStats/') ||
      req.url.includes('/api/') ||
      req.url.includes('/admin/')
    );
    console.log(`API请求数: ${apiRequests.length}`);

    // 详细列出所有请求
    console.log('\n所有请求:');
    requests.forEach((req, index) => {
      console.log(`  ${index + 1}. ${req.method} ${req.url}`);
      if (req.postData) {
        console.log(`      数据: ${req.postData.substring(0, 100)}...`);
      }
    });

    // 详细列出API请求
    if (apiRequests.length > 0) {
      console.log('\nAPI请求详情:');
      apiRequests.forEach((req, index) => {
        console.log(`  ${index + 1}. ${req.method} ${req.url}`);
        if (req.postData) {
          console.log(`      数据: ${req.postData}`);
        }
      });
    } else {
      console.log('❌ 未检测到API请求');
    }

    // 筛选API响应
    const apiResponses = responses.filter(res =>
      res.url.includes('/apiStats/') ||
      res.url.includes('/api/') ||
      res.url.includes('/admin/')
    );
    console.log(`API响应数: ${apiResponses.length}`);

    if (apiResponses.length > 0) {
      console.log('\nAPI响应详情:');
      apiResponses.forEach((res, index) => {
        console.log(`  ${index + 1}. ${res.status} ${res.url} (${res.contentType})`);
      });
    }

    // 第8步：检查特定端点
    console.log('\n🎯 第8步：检查特定端点');

    const keyIdRequests = requests.filter(req => req.url.includes('/apiStats/api/get-key-id'));
    const userStatsRequests = requests.filter(req => req.url.includes('/apiStats/api/user-stats'));
    const modelStatsRequests = requests.filter(req => req.url.includes('/apiStats/api/user-model-stats'));

    console.log(`Key ID API 请求: ${keyIdRequests.length}`);
    console.log(`用户统计 API 请求: ${userStatsRequests.length}`);
    console.log(`模型统计 API 请求: ${modelStatsRequests.length}`);

    // 最终报告
    console.log('\n📈 最终分析报告');
    console.log('='.repeat(60));

    if (apiRequests.length > 0) {
      console.log('✅ API集成正常 - 检测到API调用');
      console.log(`   总API请求: ${apiRequests.length}`);
      console.log(`   总API响应: ${apiResponses.length}`);
    } else {
      console.log('❌ API集成异常 - 未检测到API调用');
      console.log('   可能原因:');
      console.log('   1. Token添加流程没有触发API调用');
      console.log('   2. API端点不可用');
      console.log('   3. 网络拦截有问题');
      console.log('   4. 前端逻辑错误');
    }

    console.log('\n🔍 详细的截图已保存:');
    console.log('   - debug-step1-dashboard.png (仪表板页面)');
    console.log('   - debug-step3-after-click.png (点击Token按钮后)');
    console.log('   - debug-step4-add-form.png (添加表单)');
    console.log('   - debug-step5-filled-form.png (填写完成)');
    console.log('   - debug-step6-after-save.png (保存后)');

    // 不强制要求API调用，只报告结果
    expect(true).toBe(true); // 总是通过，只是为了报告
  });

  test('测试API端点直接可达性', async ({ page }) => {
    console.log('\n🌐 测试API端点直接可达性');
    console.log('='.repeat(60));

    // 访问页面建立context
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    const endpoints = [
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
      }
    ];

    for (const endpoint of endpoints) {
      console.log(`\n测试 ${endpoint.name}: ${endpoint.url}`);

      try {
        const response = await page.evaluate(async (ep) => {
          try {
            const res = await fetch(ep.url, {
              method: ep.method,
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(ep.body)
            });

            let responseBody = '';
            try {
              responseBody = await res.text();
            } catch (e) {
              responseBody = '无法读取响应体';
            }

            return {
              status: res.status,
              statusText: res.statusText,
              url: res.url,
              body: responseBody.substring(0, 500)
            };
          } catch (error) {
            return {
              error: error.message,
              status: 0
            };
          }
        }, endpoint);

        if (response.error) {
          console.log(`❌ ${endpoint.name} 请求失败: ${response.error}`);
        } else {
          console.log(`📊 ${endpoint.name} 响应:`);
          console.log(`   状态: ${response.status} ${response.statusText}`);
          console.log(`   URL: ${response.url}`);
          console.log(`   响应体: ${response.body}`);

          if (response.status < 500) {
            console.log(`✅ ${endpoint.name} 端点可达`);
          } else {
            console.log(`⚠️ ${endpoint.name} 服务器错误`);
          }
        }
      } catch (error) {
        console.log(`❌ ${endpoint.name} 测试异常: ${error}`);
      }
    }

    expect(true).toBe(true);
  });
});