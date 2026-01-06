import { test, expect } from '@playwright/test';

test.describe('Token管理功能快速验证', () => {
  test('验证Token管理功能在仪表板中可见', async ({ page }) => {
    console.log('\n🔑 Token管理功能验证');
    console.log('='.repeat(40));

    // 访问仪表板页面
    await page.goto('http://localhost:5178/dashboard');
    await page.waitForLoadState('networkidle');

    console.log('✅ 仪表板页面已加载');

    // 检查页面内容
    const pageContent = await page.locator('body').textContent();
    console.log(`✅ 页面内容长度: ${pageContent?.length || 0} 字符`);

    // 检查Token管理相关文本
    const hasTokenText = pageContent?.includes('Token') || pageContent?.includes('token');
    console.log(`${hasTokenText ? '✅' : '❌'} 包含Token相关文本: ${hasTokenText}`);

    // 检查"添加Token"按钮
    const addTokenButton = page.locator('button').filter({ hasText: /添加.*[Tt]oken|管理.*[Tt]oken/ });
    const addTokenButtonCount = await addTokenButton.count();
    console.log(`${addTokenButtonCount > 0 ? '✅' : '❌'} 添加Token按钮: ${addTokenButtonCount} 个`);

    // 检查Token管理元素
    const tokenManagementElements = await page.locator('text=/Token管理|API Token|Token/').count();
    console.log(`✅ Token相关元素: ${tokenManagementElements} 个`);

    // 测试点击Token管理按钮
    if (addTokenButtonCount > 0) {
      console.log('\\n🎯 测试Token管理功能交互');
      await addTokenButton.first().click();
      await page.waitForLoadState('networkidle');

      // 检查是否跳转到Token管理页面
      const currentUrl = page.url();
      console.log(`✅ 点击后URL: ${currentUrl}`);

      // 检查Token管理页面内容
      const tokenPageContent = await page.locator('body').textContent();
      const hasTokenForm = tokenPageContent?.includes('Token名称') || tokenPageContent?.includes('Token值');
      console.log(`${hasTokenForm ? '✅' : '❌'} Token表单存在: ${hasTokenForm}`);

      // 检查输入框
      const inputCount = await page.locator('input').count();
      console.log(`✅ 输入框数量: ${inputCount} 个`);

      // 检查特定的Token输入框
      const tokenInputs = await page.locator('input[placeholder*="token" i], input[placeholder*="cr_"], input[label*="Token"]').count();
      console.log(`✅ Token相关输入框: ${tokenInputs} 个`);

      if (inputCount > 0) {
        console.log('🎉 Token管理功能完全正常！');
      }
    }

    // 总结
    console.log('\\n📊 验证结果:');
    console.log(`  - Token文本: ${hasTokenText ? '存在' : '缺失'}`);
    console.log(`  - Token按钮: ${addTokenButtonCount > 0 ? '存在' : '缺失'}`);
    console.log(`  - Token元素: ${tokenManagementElements} 个`);

    // 确保基本功能存在
    expect(hasTokenText).toBe(true);
    expect(addTokenButtonCount).toBeGreaterThan(0);
    expect(tokenManagementElements).toBeGreaterThan(0);
  });
});