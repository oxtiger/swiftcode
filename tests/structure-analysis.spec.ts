import { test, expect, type Page } from '@playwright/test';

test.describe('页面结构分析和基础测试', () => {
  test('分析首页结构和内容', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 获取页面标题
    const title = await page.title();
    console.log('页面标题:', title);

    // 获取页面内容
    const bodyContent = await page.locator('body').textContent();
    console.log('页面主要内容:', bodyContent?.substring(0, 500));

    // 检查主要元素
    const h1Elements = await page.locator('h1').allTextContents();
    console.log('H1标题:', h1Elements);

    const h2Elements = await page.locator('h2').allTextContents();
    console.log('H2标题:', h2Elements);

    const buttons = await page.locator('button').allTextContents();
    console.log('按钮文本:', buttons);

    const links = await page.locator('a').allTextContents();
    console.log('链接文本:', links.slice(0, 10)); // 只显示前10个

    // 检查CSS类
    const bodyClasses = await page.locator('body').getAttribute('class');
    console.log('Body CSS类:', bodyClasses);

    // 检查是否有主要的容器元素
    const containers = [
      'main', '.container', '.app', '#root', '[data-testid="app"]',
      '.landing', '.hero', '.dashboard'
    ];

    for (const selector of containers) {
      const count = await page.locator(selector).count();
      if (count > 0) {
        console.log(`找到容器 ${selector}: ${count} 个`);
        const text = await page.locator(selector).first().textContent();
        console.log(`  内容预览: ${text?.substring(0, 200)}`);
      }
    }

    // 基本断言 - 确保页面加载
    await expect(page).toHaveURL('/');
    await expect(page.locator('body')).toBeAttached();
  });

  test('分析仪表板页面结构', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // 获取页面信息
    const url = page.url();
    console.log('仪表板URL:', url);

    const title = await page.title();
    console.log('仪表板标题:', title);

    // 检查页面内容
    const bodyContent = await page.locator('body').textContent();
    console.log('仪表板内容预览:', bodyContent?.substring(0, 500));

    // 检查主要元素
    const headings = await page.locator('h1, h2, h3').allTextContents();
    console.log('标题列表:', headings);

    // 检查表单元素
    const inputs = await page.locator('input').count();
    console.log('输入框数量:', inputs);

    const buttons = await page.locator('button').count();
    console.log('按钮数量:', buttons);

    // 检查导航元素
    const navElements = await page.locator('nav, .nav, .navigation, [role="navigation"]').count();
    console.log('导航元素数量:', navElements);

    // 检查表格或列表
    const lists = await page.locator('ul, ol, table, .list, .table').count();
    console.log('列表/表格数量:', lists);

    // 基本断言
    await expect(page).toHaveURL(/.*dashboard.*/);
  });

  test('检查页面路由和导航', async ({ page }) => {
    const routes = ['/', '/dashboard', '/usage', '/stats', '/help', '/tutorial'];

    for (const route of routes) {
      try {
        console.log(`\n--- 测试路由: ${route} ---`);
        await page.goto(route);
        await page.waitForLoadState('networkidle');

        const url = page.url();
        const title = await page.title();
        console.log(`实际URL: ${url}`);
        console.log(`页面标题: ${title}`);

        // 检查是否是404页面
        const notFound = await page.locator('text=/404|Not Found|页面不存在/').count();
        if (notFound > 0) {
          console.log('⚠️  这是一个404页面');
        } else {
          console.log('✅ 页面正常加载');
        }

        // 获取页面主要内容
        const mainContent = await page.locator('main, .main, #main, [role="main"]').first().textContent();
        if (mainContent) {
          console.log('主要内容:', mainContent.substring(0, 200));
        }

      } catch (error) {
        console.log(`❌ 路由 ${route} 加载失败:`, error);
      }
    }
  });

  test('检查API连接和后端状态', async ({ page }) => {
    try {
      const healthResponse = await page.request.get('/health');
      console.log('健康检查状态码:', healthResponse.status());

      if (healthResponse.ok()) {
        const healthData = await healthResponse.json();
        console.log('健康检查响应:', JSON.stringify(healthData, null, 2));
      }
    } catch (error) {
      console.log('健康检查失败:', error);
    }

    // 检查其他API端点
    const apiEndpoints = ['/api/v1/models', '/apiStats', '/admin/dashboard'];

    for (const endpoint of apiEndpoints) {
      try {
        const response = await page.request.get(endpoint);
        console.log(`API端点 ${endpoint} 状态码:`, response.status());

        if (response.status() === 200) {
          const contentType = response.headers()['content-type'];
          console.log(`  Content-Type: ${contentType}`);

          if (contentType?.includes('application/json')) {
            try {
              const data = await response.json();
              console.log(`  响应数据类型: ${typeof data}`);
              if (typeof data === 'object') {
                console.log(`  数据键: ${Object.keys(data).slice(0, 5)}`);
              }
            } catch {
              console.log('  无法解析JSON响应');
            }
          }
        }
      } catch (error) {
        console.log(`API端点 ${endpoint} 请求失败:`, error);
      }
    }
  });

  test('分析前端技术栈和性能', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 检查前端框架和库
    const reactVersion = await page.evaluate(() => {
      // @ts-ignore
      return window.React?.version || 'React not detected';
    });
    console.log('React版本:', reactVersion);

    // 检查是否使用了Vue
    const vueVersion = await page.evaluate(() => {
      // @ts-ignore
      return window.Vue?.version || 'Vue not detected';
    });
    console.log('Vue版本:', vueVersion);

    // 检查CSS框架
    const hasTailwind = await page.locator('[class*="tw-"], [class*="bg-"], [class*="text-"], [class*="flex"]').count() > 0;
    console.log('是否使用Tailwind CSS:', hasTailwind);

    // 检查加载性能
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-contentful-paint')?.startTime || 0
      };
    });

    console.log('性能指标:', performanceMetrics);

    // 检查资源加载
    const resources = await page.evaluate(() => {
      const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      return {
        totalResources: entries.length,
        cssFiles: entries.filter(e => e.name.includes('.css')).length,
        jsFiles: entries.filter(e => e.name.includes('.js')).length,
        images: entries.filter(e => e.name.match(/\.(png|jpg|jpeg|gif|svg|webp)$/)).length
      };
    });

    console.log('资源统计:', resources);
  });
});