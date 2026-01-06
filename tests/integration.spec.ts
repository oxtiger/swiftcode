import { test, expect } from '@playwright/test';

/**
 * 集成测试 - 前后端交互
 * 测试实际的API调用和用户工作流程
 */
test.describe('Claude Relay Service - 集成测试', () => {

  test.beforeEach(async ({ page }) => {
    // 设置默认超时时间
    page.setDefaultTimeout(10000);
  });

  test('健康检查端点', async ({ page }) => {
    // 直接测试后端健康检查
    const response = await page.request.get('http://localhost:3000/health');

    expect(response.ok()).toBeTruthy();

    const health = await response.json();
    expect(health.status).toBe('healthy');
    expect(health.service).toBe('claude-relay-service');

    console.log('后端服务状态:', health.status);
    console.log('服务版本:', health.version);
  });

  test('前端页面加载', async ({ page }) => {
    await page.goto('/');

    // 等待页面加载
    await page.waitForLoadState('networkidle');

    // 检查页面基本元素
    await expect(page.locator('body')).toBeVisible();

    // 检查是否有React应用的标识
    const reactRoot = page.locator('#root');
    await expect(reactRoot).toBeVisible();

    console.log('前端页面标题:', await page.title());
  });

  test('API代理功能 - 健康检查', async ({ page }) => {
    await page.goto('/');

    // 通过前端代理访问后端API
    const response = await page.request.get('/health');

    if (response.ok()) {
      const health = await response.json();
      expect(health.status).toBe('healthy');
      console.log('代理访问成功 - 服务状态:', health.status);
    } else {
      console.log('代理访问失败，状态码:', response.status());
    }
  });

  test('管理员登录页面', async ({ page }) => {
    await page.goto('/');

    // 查找登录相关元素
    const loginElements = page.locator('input[type="password"], input[placeholder*="密码"], input[placeholder*="password"], [href*="login"], button:has-text("登录"), button:has-text("Login")');

    const elementCount = await loginElements.count();
    console.log('找到登录相关元素数量:', elementCount);

    if (elementCount > 0) {
      // 如果找到登录元素，测试登录表单
      const loginForm = page.locator('form, [data-testid*="login"]').first();

      if (await loginForm.count() > 0) {
        console.log('检测到登录表单');

        // 查找用户名和密码输入框
        const usernameInput = page.locator('input[type="text"], input[type="email"], input[placeholder*="用户"], input[placeholder*="username"]').first();
        const passwordInput = page.locator('input[type="password"]').first();

        if (await usernameInput.count() > 0 && await passwordInput.count() > 0) {
          // 测试输入功能
          await usernameInput.fill('admin');
          await passwordInput.fill('testpassword');

          console.log('登录表单输入测试完成');
        }
      }
    } else {
      console.log('当前页面没有登录表单，可能需要导航到登录页面');
    }
  });

  test('API端点可达性测试', async ({ page }) => {
    const endpoints = [
      '/health',
      '/admin/dashboard',
      '/admin/api-keys',
      '/admin/claude-accounts',
      '/admin/stats'
    ];

    for (const endpoint of endpoints) {
      console.log(`测试端点: ${endpoint}`);

      try {
        const response = await page.request.get(`http://localhost:3000${endpoint}`);
        console.log(`${endpoint} - 状态码: ${response.status()}`);

        if (response.status() === 401) {
          console.log(`${endpoint} - 需要认证 (正常)`);
        } else if (response.status() === 200) {
          console.log(`${endpoint} - 访问成功`);
        } else {
          console.log(`${endpoint} - 其他状态: ${response.status()}`);
        }
      } catch (error) {
        console.log(`${endpoint} - 访问失败:`, error.message);
      }
    }
  });

  test('前端路由导航', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 查找导航链接
    const navLinks = page.locator('nav a, [role="navigation"] a, a[href^="/"]');
    const linkCount = await navLinks.count();

    console.log(`找到 ${linkCount} 个导航链接`);

    if (linkCount > 0) {
      // 获取所有链接的href
      for (let i = 0; i < Math.min(linkCount, 5); i++) {
        const link = navLinks.nth(i);
        const href = await link.getAttribute('href');
        const text = await link.textContent();

        if (href && href.startsWith('/')) {
          console.log(`链接 ${i + 1}: "${text}" -> ${href}`);

          // 测试导航
          try {
            await link.click();
            await page.waitForLoadState('networkidle', { timeout: 5000 });

            const currentUrl = page.url();
            console.log(`导航后URL: ${currentUrl}`);

            // 返回首页继续测试
            await page.goto('/');
            await page.waitForLoadState('networkidle');
          } catch (error) {
            console.log(`导航到 ${href} 失败:`, error.message);
          }
        }
      }
    }
  });

  test('主题切换功能', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 查找主题切换按钮
    const themeButton = page.locator('[data-testid="theme-toggle"], button:has-text("Theme"), button:has-text("主题"), [aria-label*="theme"], [title*="theme"]');

    if (await themeButton.count() > 0) {
      console.log('找到主题切换按钮');

      // 获取当前主题
      const htmlClass = await page.locator('html').getAttribute('class');
      console.log('当前HTML class:', htmlClass);

      // 点击主题切换
      await themeButton.first().click();
      await page.waitForTimeout(500);

      // 检查主题是否改变
      const newHtmlClass = await page.locator('html').getAttribute('class');
      console.log('切换后HTML class:', newHtmlClass);

      if (htmlClass !== newHtmlClass) {
        console.log('主题切换成功');
      } else {
        console.log('主题可能没有改变，或者使用其他方式存储主题状态');
      }
    } else {
      console.log('未找到主题切换按钮');
    }
  });

  test('响应式布局测试', async ({ page }) => {
    // 桌面端测试
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    console.log('桌面端视图测试');

    // 检查侧边栏是否可见
    const sidebar = page.locator('[data-testid="sidebar"], nav, .sidebar, aside');
    if (await sidebar.count() > 0) {
      console.log('桌面端侧边栏可见');
    }

    // 移动端测试
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);

    console.log('移动端视图测试');

    // 查找汉堡菜单
    const mobileMenu = page.locator('[data-testid="mobile-menu"], button:has-text("Menu"), .hamburger, [aria-label*="menu"]');
    if (await mobileMenu.count() > 0) {
      console.log('移动端菜单按钮可见');

      // 测试菜单展开
      await mobileMenu.first().click();
      await page.waitForTimeout(300);
      console.log('移动端菜单点击测试完成');
    } else {
      console.log('未找到移动端菜单按钮');
    }
  });

  test('错误处理测试', async ({ page }) => {
    // 测试404页面
    console.log('测试404页面处理');

    const response = await page.goto('/nonexistent-page');
    await page.waitForLoadState('networkidle');

    // 检查是否正确处理了404
    const currentUrl = page.url();
    console.log('404测试 - 当前URL:', currentUrl);

    // 页面应该仍然可用
    await expect(page.locator('body')).toBeVisible();

    // 测试API错误处理
    console.log('测试API错误处理');

    try {
      const apiResponse = await page.request.get('/admin/nonexistent-api');
      console.log('API错误测试 - 状态码:', apiResponse.status());
    } catch (error) {
      console.log('API错误测试 - 网络错误:', error.message);
    }
  });

  test('性能指标收集', async ({ page }) => {
    console.log('开始性能测试');

    // 记录开始时间
    const startTime = Date.now();

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const loadTime = Date.now() - startTime;
    console.log(`页面加载时间: ${loadTime}ms`);

    // 收集性能指标
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.navigationStart,
        loadComplete: navigation.loadEventEnd - navigation.navigationStart,
        firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0,
      };
    });

    console.log('性能指标:', performanceMetrics);

    // 断言性能在合理范围内
    expect(loadTime).toBeLessThan(5000); // 5秒内加载完成
    expect(performanceMetrics.domContentLoaded).toBeLessThan(3000); // DOM在3秒内加载完成
  });

});