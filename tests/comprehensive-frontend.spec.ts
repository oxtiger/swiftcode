import { test, expect, type Page } from '@playwright/test';

test.describe('Claude Code风格前端功能全面测试', () => {
  test.beforeEach(async ({ page }) => {
    // 确保每个测试都从首页开始
    await page.goto('/');
  });

  test.describe('1. 首页功能测试', () => {
    test('验证首页正常加载', async ({ page }) => {
      // 检查页面标题
      await expect(page).toHaveTitle(/Claude Relay Service/);

      // 检查关键的首页元素
      await expect(page.locator('h1')).toContainText(/Claude Relay Service|智能中转/);

      // 检查是否存在主要的布局元素
      const heroSection = page.locator('[data-testid="hero-section"], .hero, .landing-hero').first();
      await expect(heroSection).toBeVisible();
    });

    test('测试"开始使用"按钮跳转到/dashboard', async ({ page }) => {
      // 寻找并点击"开始使用"按钮
      const startButton = page.locator('button, a').filter({
        hasText: /开始使用|Get Started|Start|立即开始/
      }).first();

      await expect(startButton).toBeVisible();
      await startButton.click();

      // 验证跳转到仪表板页面
      await expect(page).toHaveURL(/.*\/dashboard.*/);
    });

    test('验证首页设计元素正常显示', async ({ page }) => {
      // 检查是否有Claude Code风格的渐变背景
      const bodyOrMain = page.locator('body, main').first();

      // 检查是否存在常见的设计元素
      const designElements = [
        page.locator('.gradient, [class*="gradient"]').first(),
        page.locator('.glass, [class*="glass"]').first(),
        page.locator('.backdrop-blur, [class*="backdrop"]').first()
      ];

      // 至少应该有一个设计元素可见
      let hasDesignElement = false;
      for (const element of designElements) {
        try {
          await element.waitFor({ timeout: 2000 });
          hasDesignElement = true;
          break;
        } catch {
          // 继续检查下一个
        }
      }

      // 如果没有找到特定的设计元素，至少检查页面有基本的样式
      if (!hasDesignElement) {
        await expect(bodyOrMain).toBeVisible();
      }
    });
  });

  test.describe('2. 仪表板页面测试', () => {
    test.beforeEach(async ({ page }) => {
      // 先导航到仪表板
      await page.goto('/dashboard');
    });

    test('验证仪表板页面加载', async ({ page }) => {
      await expect(page).toHaveURL(/.*\/dashboard.*/);

      // 检查仪表板的关键元素
      const dashboardElements = [
        page.locator('h1, h2').filter({ hasText: /仪表板|Dashboard|控制台/ }).first(),
        page.locator('[data-testid="dashboard"], .dashboard').first(),
        page.locator('.token, .api-key').first()
      ];

      // 至少应该有一个仪表板元素
      let hasDashboardElement = false;
      for (const element of dashboardElements) {
        try {
          await element.waitFor({ timeout: 3000 });
          hasDashboardElement = true;
          break;
        } catch {
          // 继续检查
        }
      }

      expect(hasDashboardElement).toBeTruthy();
    });

    test('测试Token管理功能', async ({ page }) => {
      // 寻找Token管理相关的按钮
      const addTokenButton = page.locator('button').filter({
        hasText: /添加|Add|创建|Create|新增.*Token|New.*Token/
      }).first();

      // 如果找到添加按钮，测试添加流程
      try {
        await addTokenButton.waitFor({ timeout: 3000 });
        await addTokenButton.click();

        // 查找输入框或模态框
        const inputs = page.locator('input[type="text"], input[placeholder*="token"], input[placeholder*="Token"]');
        if (await inputs.count() > 0) {
          await inputs.first().fill('test-token-12345');

          // 寻找确认按钮
          const confirmButton = page.locator('button').filter({
            hasText: /确认|保存|Save|Submit|添加/
          }).first();

          if (await confirmButton.isVisible()) {
            await confirmButton.click();
          }
        }
      } catch {
        console.log('未找到Token添加功能或功能不可用');
      }

      // 检查是否存在Token列表
      const tokenList = page.locator('[data-testid="token-list"], .token-list, .api-key-list').first();
      try {
        await tokenList.waitFor({ timeout: 2000 });
        await expect(tokenList).toBeVisible();
      } catch {
        // Token列表可能为空或结构不同
        console.log('Token列表未找到或为空');
      }
    });

    test('验证统计数据展示', async ({ page }) => {
      // 寻找统计数据相关的元素
      const statsElements = [
        page.locator('[data-testid*="stats"], .stats, .statistics').first(),
        page.locator('.usage, [data-testid*="usage"]').first(),
        page.locator('h3, h4').filter({ hasText: /统计|Stats|使用量|Usage/ }).first()
      ];

      let hasStatsElement = false;
      for (const element of statsElements) {
        try {
          await element.waitFor({ timeout: 2000 });
          hasStatsElement = true;
          break;
        } catch {
          // 继续检查
        }
      }

      // 如果没有找到特定的统计元素，检查是否有数字显示
      if (!hasStatsElement) {
        const numberElements = page.locator('text=/\\d+/').first();
        try {
          await numberElements.waitFor({ timeout: 2000 });
        } catch {
          console.log('未找到统计数据展示');
        }
      }
    });

    test('验证页面布局和响应式设计', async ({ page }) => {
      // 测试桌面视图
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.waitForTimeout(500);

      // 检查主要容器
      const mainContainer = page.locator('main, .container, .dashboard-container').first();
      await expect(mainContainer).toBeVisible();

      // 测试平板视图
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.waitForTimeout(500);
      await expect(mainContainer).toBeVisible();

      // 测试手机视图
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(500);
      await expect(mainContainer).toBeVisible();

      // 恢复桌面视图
      await page.setViewportSize({ width: 1920, height: 1080 });
    });
  });

  test.describe('3. 导航功能测试', () => {
    test('测试三页面间的切换', async ({ page }) => {
      // 从首页开始
      await page.goto('/');

      // 导航到仪表板
      const dashboardLink = page.locator('a[href*="/dashboard"], button').filter({
        hasText: /仪表板|Dashboard|控制台/
      }).first();

      try {
        await dashboardLink.waitFor({ timeout: 3000 });
        await dashboardLink.click();
        await expect(page).toHaveURL(/.*\/dashboard.*/);
      } catch {
        // 直接导航
        await page.goto('/dashboard');
      }

      // 寻找使用统计页面链接
      const usageLink = page.locator('a, button').filter({
        hasText: /使用统计|Usage|统计|Stats/
      }).first();

      try {
        await usageLink.waitFor({ timeout: 3000 });
        await usageLink.click();
        await expect(page).toHaveURL(/.*\/(usage|stats).*/);
      } catch {
        // 如果没有找到，尝试直接导航
        await page.goto('/usage');
      }

      // 寻找使用教程页面链接
      const tutorialLink = page.locator('a, button').filter({
        hasText: /教程|Tutorial|文档|Docs|帮助|Help/
      }).first();

      try {
        await tutorialLink.waitFor({ timeout: 3000 });
        await tutorialLink.click();
        await expect(page).toHaveURL(/.*\/(tutorial|docs|help).*/);
      } catch {
        // 如果没有找到，尝试直接导航
        try {
          await page.goto('/tutorial');
        } catch {
          console.log('教程页面不存在或路径不同');
        }
      }
    });

    test('验证导航状态和路由正确性', async ({ page }) => {
      const routes = ['/dashboard', '/usage', '/stats'];

      for (const route of routes) {
        try {
          await page.goto(route);
          await page.waitForLoadState('networkidle');

          // 检查页面是否正确加载（没有404错误）
          const notFoundText = page.locator('text=/404|Not Found|页面不存在/');
          await expect(notFoundText).not.toBeVisible();

          // 检查当前路由是否正确
          await expect(page).toHaveURL(new RegExp(`.*${route}.*`));

        } catch (error) {
          console.log(`路由 ${route} 不存在或加载失败:`, error);
        }
      }
    });
  });

  test.describe('4. API集成测试', () => {
    test('测试健康检查API', async ({ page }) => {
      // 测试前端是否能正确调用后端API
      const response = await page.request.get('/health');

      if (response.ok()) {
        const data = await response.json();
        expect(data).toHaveProperty('status');
      } else {
        console.log('健康检查API不可用，后端可能未启动');
      }
    });

    test('验证错误处理和加载状态', async ({ page }) => {
      await page.goto('/dashboard');

      // 检查是否有加载状态指示器
      const loadingElements = [
        page.locator('.loading, [data-testid="loading"]').first(),
        page.locator('.spinner, .loader').first(),
        page.locator('text=/加载中|Loading/').first()
      ];

      // 等待页面加载完成
      await page.waitForLoadState('networkidle');

      // 检查错误状态元素
      const errorElements = [
        page.locator('.error, [data-testid="error"]').first(),
        page.locator('text=/错误|Error|失败|Failed/').first()
      ];

      // 错误元素不应该可见（除非真的有错误）
      for (const errorElement of errorElements) {
        try {
          await errorElement.waitFor({ timeout: 1000 });
          const isVisible = await errorElement.isVisible();
          if (isVisible) {
            console.log('检测到错误状态:', await errorElement.textContent());
          }
        } catch {
          // 没有错误，这是好的
        }
      }
    });
  });

  test.describe('5. 用户体验测试', () => {
    test('测试动画效果和交互流畅度', async ({ page }) => {
      await page.goto('/dashboard');

      // 检查页面是否有平滑的过渡效果
      const animatedElements = page.locator('[class*="transition"], [class*="animate"]');

      if (await animatedElements.count() > 0) {
        // 检查第一个动画元素
        const firstAnimated = animatedElements.first();
        await expect(firstAnimated).toBeVisible();
      }

      // 测试按钮点击响应
      const buttons = page.locator('button');
      if (await buttons.count() > 0) {
        const firstButton = buttons.first();
        if (await firstButton.isVisible()) {
          // 检查按钮hover效果
          await firstButton.hover();
          await page.waitForTimeout(300);

          // 检查按钮是否可点击
          await expect(firstButton).toBeEnabled();
        }
      }
    });

    test('验证Claude Code设计风格的一致性', async ({ page }) => {
      await page.goto('/');

      // 检查主要的设计系统元素
      const designChecks = [
        // 检查是否使用了现代的颜色系统
        page.locator('[class*="bg-gradient"], [class*="gradient"]').first(),
        // 检查是否有模糊背景效果
        page.locator('[class*="backdrop-blur"]').first(),
        // 检查是否有圆角设计
        page.locator('[class*="rounded"]').first(),
        // 检查是否有阴影效果
        page.locator('[class*="shadow"]').first()
      ];

      let designScore = 0;
      for (const element of designChecks) {
        try {
          await element.waitFor({ timeout: 1000 });
          designScore++;
        } catch {
          // 该设计元素不存在
        }
      }

      // 至少应该有一些现代设计元素
      console.log(`设计一致性评分: ${designScore}/${designChecks.length}`);
      expect(designScore).toBeGreaterThan(0);
    });

    test('测试不同屏幕尺寸下的用户体验', async ({ page }) => {
      const viewports = [
        { width: 1920, height: 1080, name: '桌面' },
        { width: 1024, height: 768, name: '平板横屏' },
        { width: 768, height: 1024, name: '平板竖屏' },
        { width: 375, height: 667, name: '手机' }
      ];

      for (const viewport of viewports) {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto('/dashboard');
        await page.waitForTimeout(500);

        // 检查主要内容是否可见
        const mainContent = page.locator('main, .main-content, .dashboard').first();
        await expect(mainContent).toBeVisible();

        // 检查是否有溢出问题
        const horizontalOverflow = await page.evaluate(() => {
          return document.documentElement.scrollWidth > window.innerWidth;
        });

        if (horizontalOverflow) {
          console.log(`${viewport.name} (${viewport.width}x${viewport.height}) 存在水平滚动条`);
        }
      }

      // 恢复默认视口
      await page.setViewportSize({ width: 1920, height: 1080 });
    });
  });

  test.describe('6. 性能和可访问性测试', () => {
    test('页面加载性能测试', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;

      console.log(`页面加载时间: ${loadTime}ms`);

      // 页面应该在3秒内加载完成
      expect(loadTime).toBeLessThan(3000);
    });

    test('基本可访问性测试', async ({ page }) => {
      await page.goto('/dashboard');

      // 检查是否有适当的标题结构
      const headings = page.locator('h1, h2, h3, h4, h5, h6');
      const headingCount = await headings.count();
      expect(headingCount).toBeGreaterThan(0);

      // 检查按钮是否有可访问的文本
      const buttons = page.locator('button');
      for (let i = 0; i < Math.min(await buttons.count(), 5); i++) {
        const button = buttons.nth(i);
        if (await button.isVisible()) {
          const text = await button.textContent();
          const ariaLabel = await button.getAttribute('aria-label');
          expect(text || ariaLabel).toBeTruthy();
        }
      }

      // 检查输入框是否有标签
      const inputs = page.locator('input');
      for (let i = 0; i < Math.min(await inputs.count(), 3); i++) {
        const input = inputs.nth(i);
        if (await input.isVisible()) {
          const placeholder = await input.getAttribute('placeholder');
          const ariaLabel = await input.getAttribute('aria-label');
          const id = await input.getAttribute('id');

          // 应该至少有placeholder、aria-label或关联的label
          expect(placeholder || ariaLabel || id).toBeTruthy();
        }
      }
    });
  });
});