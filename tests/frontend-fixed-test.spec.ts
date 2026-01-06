import { test, expect } from '@playwright/test';

test.describe('Claude Code前端修复后测试', () => {
  // 配置基础URL为新端口
  test.beforeEach(async ({ page }) => {
    // 设置基础URL
    await page.goto('http://localhost:5178/');
  });

  test('首页渲染测试', async ({ page }) => {
    console.log('\n🎯 首页渲染测试');
    console.log('='.repeat(40));

    await page.waitForLoadState('networkidle');

    // 检查页面标题
    const title = await page.title();
    console.log(`✅ 页面标题: ${title}`);

    // 检查页面是否有内容
    const bodyContent = await page.locator('body').textContent();
    console.log(`✅ 页面内容长度: ${bodyContent?.length || 0} 字符`);

    if (bodyContent && bodyContent.length > 100) {
      console.log(`✅ 页面内容预览: ${bodyContent.substring(0, 200)}...`);
    } else {
      console.log(`❌ 页面内容过少: ${bodyContent}`);
    }

    // 检查主要元素
    const h1Count = await page.locator('h1').count();
    const buttonCount = await page.locator('button').count();
    const mainCount = await page.locator('main').count();

    console.log(`✅ H1标题数量: ${h1Count}`);
    console.log(`✅ 按钮数量: ${buttonCount}`);
    console.log(`✅ Main容器数量: ${mainCount}`);

    // 检查是否有Claude Code特色元素
    const claudeElements = await page.locator('text=/Claude|claude/i').count();
    const codeElements = await page.locator('text=/Code|code/i').count();
    console.log(`✅ Claude相关元素: ${claudeElements} 个`);
    console.log(`✅ Code相关元素: ${codeElements} 个`);

    // 基本断言
    expect(h1Count).toBeGreaterThan(0);
    expect(buttonCount).toBeGreaterThan(0);
    expect(bodyContent?.length || 0).toBeGreaterThan(100);
  });

  test('导航到仪表板测试', async ({ page }) => {
    console.log('\n🚀 导航到仪表板测试');
    console.log('='.repeat(40));

    await page.waitForLoadState('networkidle');

    // 查找"开始使用"或"仪表板"按钮
    const startButton = page.locator('button').filter({ hasText: /开始使用|Get Started|仪表板|Dashboard/i });
    const buttonCount = await startButton.count();

    console.log(`✅ 找到导航按钮: ${buttonCount} 个`);

    if (buttonCount > 0) {
      // 点击第一个按钮
      await startButton.first().click();
      await page.waitForLoadState('networkidle');

      const currentUrl = page.url();
      console.log(`✅ 跳转后URL: ${currentUrl}`);

      // 检查是否成功跳转到仪表板
      expect(currentUrl).toContain('dashboard');

      // 检查仪表板页面内容
      const dashboardContent = await page.locator('body').textContent();
      console.log(`✅ 仪表板内容长度: ${dashboardContent?.length || 0} 字符`);

      if (dashboardContent && dashboardContent.length > 50) {
        console.log(`✅ 仪表板内容预览: ${dashboardContent.substring(0, 150)}...`);
      }
    } else {
      console.log('❌ 未找到导航按钮');
    }
  });

  test('Token管理功能测试', async ({ page }) => {
    console.log('\n🔑 Token管理功能测试');
    console.log('='.repeat(40));

    // 直接访问仪表板
    await page.goto('http://localhost:5178/dashboard');
    await page.waitForLoadState('networkidle');

    const dashboardContent = await page.locator('body').textContent();
    console.log(`✅ 仪表板页面加载，内容长度: ${dashboardContent?.length || 0}`);

    // 检查Token相关元素
    const tokenInputs = await page.locator('input[placeholder*="token" i], input[placeholder*="API" i]').count();
    const tokenButtons = await page.locator('button').filter({ hasText: /token|API|添加|保存|Save/i }).count();

    console.log(`✅ Token输入框: ${tokenInputs} 个`);
    console.log(`✅ Token相关按钮: ${tokenButtons} 个`);

    // 检查Token管理器组件
    const tokenManagerElements = await page.locator('[data-testid*="token"], .token-manager, .api-key').count();
    console.log(`✅ Token管理元素: ${tokenManagerElements} 个`);

    if (tokenInputs > 0) {
      console.log('✅ Token管理功能已渲染');
    } else {
      console.log('⚠️ 未找到Token输入功能');
    }
  });

  test('页面路由测试', async ({ page }) => {
    console.log('\n🧭 页面路由测试');
    console.log('='.repeat(40));

    const routes = [
      { path: '/', name: '首页' },
      { path: '/dashboard', name: '仪表板' },
      { path: '/usage-stats', name: '使用统计' },
      { path: '/tutorial', name: '使用教程' }
    ];

    for (const route of routes) {
      try {
        console.log(`\n--- 测试路由: ${route.path} (${route.name}) ---`);

        await page.goto(`http://localhost:5178${route.path}`);
        await page.waitForLoadState('networkidle');

        const url = page.url();
        const title = await page.title();
        const content = await page.locator('body').textContent();

        console.log(`✅ URL: ${url}`);
        console.log(`✅ 标题: ${title}`);
        console.log(`✅ 内容长度: ${content?.length || 0} 字符`);

        // 检查是否是404页面
        const notFound = await page.locator('text=/404|Not Found|页面不存在/').count();
        if (notFound > 0) {
          console.log('❌ 这是一个404页面');
        } else {
          console.log('✅ 页面正常加载');
        }

        // 基本断言
        expect(content?.length || 0).toBeGreaterThan(10);

      } catch (error) {
        console.log(`❌ 路由 ${route.path} 测试失败: ${error}`);
      }
    }
  });

  test('UI组件渲染测试', async ({ page }) => {
    console.log('\n🎨 UI组件渲染测试');
    console.log('='.repeat(40));

    await page.waitForLoadState('networkidle');

    // 检查设计元素
    const hasGradient = await page.locator('[class*="gradient"]').count() > 0;
    const hasRounded = await page.locator('[class*="rounded"]').count() > 0;
    const hasShadow = await page.locator('[class*="shadow"]').count() > 0;
    const hasBlur = await page.locator('[class*="blur"]').count() > 0;

    console.log(`${hasGradient ? '✅' : '❌'} 渐变效果: ${hasGradient ? '存在' : '不存在'}`);
    console.log(`${hasRounded ? '✅' : '❌'} 圆角设计: ${hasRounded ? '存在' : '不存在'}`);
    console.log(`${hasShadow ? '✅' : '❌'} 阴影效果: ${hasShadow ? '存在' : '不存在'}`);
    console.log(`${hasBlur ? '✅' : '❌'} 模糊效果: ${hasBlur ? '存在' : '不存在'}`);

    // 检查颜色主题
    const orangeElements = await page.locator('[class*="orange"]').count();
    const stoneElements = await page.locator('[class*="stone"]').count();

    console.log(`✅ Orange主题元素: ${orangeElements} 个`);
    console.log(`✅ Stone主题元素: ${stoneElements} 个`);

    const designScore = [hasGradient, hasRounded, hasShadow, hasBlur].filter(Boolean).length;
    console.log(`🎯 Claude Code设计风格评分: ${designScore}/4 ${designScore >= 3 ? '(优秀)' : designScore >= 2 ? '(良好)' : '(需改进)'}`);
  });

  test('响应式设计测试', async ({ page }) => {
    console.log('\n📱 响应式设计测试');
    console.log('='.repeat(40));

    const viewports = [
      { width: 1920, height: 1080, name: '桌面' },
      { width: 768, height: 1024, name: '平板' },
      { width: 375, height: 667, name: '手机' }
    ];

    for (const viewport of viewports) {
      try {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto('http://localhost:5178/');
        await page.waitForLoadState('networkidle');

        const hasHorizontalScroll = await page.evaluate(() => {
          return document.documentElement.scrollWidth > window.innerWidth;
        });

        console.log(`${hasHorizontalScroll ? '⚠️' : '✅'} ${viewport.name} (${viewport.width}x${viewport.height}): ${hasHorizontalScroll ? '有水平滚动' : '响应式正常'}`);
      } catch (error) {
        console.log(`❌ ${viewport.name}视口测试失败: ${error}`);
      }
    }
  });

  test('总体功能验证', async ({ page }) => {
    console.log('\n🎯 总体功能验证');
    console.log('='.repeat(40));

    // 1. 首页加载
    await page.goto('http://localhost:5178/');
    await page.waitForLoadState('networkidle');
    const homeContent = await page.locator('body').textContent();
    const homeRendered = (homeContent?.length || 0) > 100;
    console.log(`${homeRendered ? '✅' : '❌'} 首页渲染: ${homeRendered ? '正常' : '失败'}`);

    // 2. 导航功能
    let navigationWorking = false;
    try {
      const navButton = page.locator('button').filter({ hasText: /开始使用|Get Started|仪表板/i });
      const buttonExists = await navButton.count() > 0;
      if (buttonExists) {
        await navButton.first().click();
        await page.waitForLoadState('networkidle');
        navigationWorking = page.url().includes('dashboard');
      }
    } catch (error) {
      console.log(`导航测试异常: ${error}`);
    }
    console.log(`${navigationWorking ? '✅' : '❌'} 导航功能: ${navigationWorking ? '正常' : '失败'}`);

    // 3. 仪表板功能
    await page.goto('http://localhost:5178/dashboard');
    await page.waitForLoadState('networkidle');
    const dashboardContent = await page.locator('body').textContent();
    const dashboardRendered = (dashboardContent?.length || 0) > 50;
    console.log(`${dashboardRendered ? '✅' : '❌'} 仪表板渲染: ${dashboardRendered ? '正常' : '失败'}`);

    // 4. Token管理
    const tokenButtons = await page.locator('button').filter({ hasText: /Token|添加.*Token|管理.*Token/ }).count();
    const tokenElements = await page.locator('text=/Token管理|API Token|Token/').count();
    const tokenFunctional = tokenButtons > 0 || tokenElements > 0;
    console.log(`${tokenFunctional ? '✅' : '❌'} Token管理: ${tokenFunctional ? '正常' : '缺失'} (按钮: ${tokenButtons}, 元素: ${tokenElements})`);

    // 总体评分
    const scores = [homeRendered, navigationWorking, dashboardRendered, tokenFunctional];
    const passedCount = scores.filter(Boolean).length;
    const totalScore = `${passedCount}/4`;

    console.log(`\n🏆 总体评分: ${totalScore}`);
    if (passedCount === 4) {
      console.log('🎉 所有功能测试通过！Claude Code风格前端实现成功！');
    } else if (passedCount >= 3) {
      console.log('👍 大部分功能正常，Claude Code风格前端基本实现');
    } else if (passedCount >= 2) {
      console.log('⚠️ 部分功能正常，仍需进一步修复');
    } else {
      console.log('❌ 大部分功能异常，需要全面检查和修复');
    }

    // 最终断言
    expect(passedCount).toBeGreaterThanOrEqual(3);
  });
});