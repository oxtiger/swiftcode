import { test, expect } from '@playwright/test';

/**
 * Console Debug Test
 * 捕获浏览器控制台错误信息来调试Token API集成问题
 */

const TEST_TOKEN = 'cr_278156e1ea67cedf8fec4f751b1f686b76419520569d725353a281753946632e';

test.describe('控制台调试测试', () => {
  test('捕获Token添加过程中的控制台信息', async ({ page }) => {
    console.log('\n🔍 开始捕获控制台信息');
    console.log('='.repeat(60));

    // 监听控制台消息
    const consoleMessages: string[] = [];
    const errors: string[] = [];

    page.on('console', msg => {
      const text = `[${msg.type()}] ${msg.text()}`;
      consoleMessages.push(text);
      console.log(`浏览器控制台: ${text}`);

      if (msg.type() === 'error') {
        errors.push(text);
      }
    });

    // 监听页面错误
    page.on('pageerror', exception => {
      const errorText = `页面错误: ${exception.message}`;
      errors.push(errorText);
      console.log(`❌ ${errorText}`);
    });

    // 监听网络请求失败
    page.on('requestfailed', request => {
      const failureText = `请求失败: ${request.method()} ${request.url()} - ${request.failure()?.errorText}`;
      errors.push(failureText);
      console.log(`❌ ${failureText}`);
    });

    try {
      console.log('\n📋 第1步：访问仪表板页面');
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      console.log('✅ 页面加载完成');

      console.log('\n🎯 第2步：打开Token管理');
      const tokenButton = page.locator('button').filter({ hasText: /Token|管理/i }).first();
      await tokenButton.click();
      await page.waitForTimeout(1000);
      console.log('✅ Token管理界面打开');

      console.log('\n📝 第3步：打开添加Token表单');
      const addButton = page.locator('button').filter({ hasText: /添加.*Token|新.*Token/i }).first();
      if (await addButton.count() > 0) {
        await addButton.click();
        await page.waitForTimeout(1000);
        console.log('✅ 添加Token表单打开');
      }

      console.log('\n✏️ 第4步：填写表单');
      const inputs = page.locator('input');
      const inputCount = await inputs.count();
      console.log(`表单输入框数量: ${inputCount}`);

      if (inputCount >= 2) {
        await inputs.nth(0).fill('测试Token');
        await inputs.nth(1).fill(TEST_TOKEN);
        console.log('✅ 表单填写完成');

        await page.waitForTimeout(500);
      }

      console.log('\n💾 第5步：提交表单并监控');
      const saveButton = page.locator('button').filter({ hasText: /添加Token/i });
      const saveButtonCount = await saveButton.count();
      console.log(`"添加Token"按钮数量: ${saveButtonCount}`);

      if (saveButtonCount > 0) {
        // 检查每个按钮的文本
        for (let i = 0; i < saveButtonCount; i++) {
          const buttonText = await saveButton.nth(i).textContent();
          console.log(`  按钮${i + 1}: "${buttonText}"`);
        }

        console.log('点击"添加Token"按钮...');

        // 清空之前的控制台信息
        consoleMessages.length = 0;
        errors.length = 0;

        // 添加表单提交的监听
        page.on('request', request => {
          if (request.method() === 'POST') {
            console.log(`POST请求: ${request.url()}`);
          }
        });

        // 点击正确的"添加Token"按钮
        await saveButton.first().click();

        // 等待更短的时间先看基本的调试信息
        console.log('等待2秒看调试信息...');
        await page.waitForTimeout(2000);

        console.log(`中间检查 - 控制台消息数: ${consoleMessages.length}`);

        // 继续等待
        console.log('继续等待API调用...');
        await page.waitForTimeout(3000);

        console.log('✅ 表单提交完成');
      }

      console.log('\n📊 第6步：分析控制台信息');
      console.log(`总控制台消息数: ${consoleMessages.length}`);
      console.log(`错误数: ${errors.length}`);

      if (consoleMessages.length > 0) {
        console.log('\n控制台消息详情:');
        consoleMessages.forEach((msg, index) => {
          console.log(`  ${index + 1}. ${msg}`);
        });
      }

      if (errors.length > 0) {
        console.log('\n❌ 错误详情:');
        errors.forEach((error, index) => {
          console.log(`  ${index + 1}. ${error}`);
        });
      } else {
        console.log('✅ 没有发现错误');
      }

      // 检查特定的API调用相关信息
      const apiRelatedMessages = consoleMessages.filter(msg =>
        msg.includes('api') ||
        msg.includes('API') ||
        msg.includes('fetch') ||
        msg.includes('queryStats') ||
        msg.includes('token') ||
        msg.includes('Token')
      );

      console.log(`\nAPI相关消息数: ${apiRelatedMessages.length}`);
      if (apiRelatedMessages.length > 0) {
        console.log('API相关消息:');
        apiRelatedMessages.forEach((msg, index) => {
          console.log(`  ${index + 1}. ${msg}`);
        });
      }

      console.log('\n📈 调试总结');
      console.log('='.repeat(60));

      if (errors.length === 0) {
        console.log('✅ 没有发现JavaScript错误');
      } else {
        console.log(`❌ 发现 ${errors.length} 个错误，需要修复`);
      }

      if (apiRelatedMessages.length === 0) {
        console.log('❌ 没有发现API调用相关的控制台输出');
        console.log('   这表明Token添加后的API调用代码可能没有执行');
      } else {
        console.log(`✅ 发现 ${apiRelatedMessages.length} 个API相关消息`);
      }

    } catch (error) {
      console.log(`❌ 测试过程中发生错误: ${error}`);
      throw error;
    }

    // 这个测试主要用于调试，所以总是通过
    expect(true).toBe(true);
  });
});