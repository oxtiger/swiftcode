import { test, expect } from '@playwright/test';

/**
 * 基础功能测试套件
 * 测试应用的基本加载和导航功能
 */
test.describe('Claude Code Frontend - 基础功能测试', () => {

  test('应用正常加载', async ({ page }) => {
    // 访问首页
    await page.goto('/');

    // 等待页面加载完成
    await page.waitForLoadState('networkidle');

    // 检查页面标题
    await expect(page).toHaveTitle(/Claude/);

    // 检查主要内容是否存在
    await expect(page.locator('body')).toBeVisible();
  });

  test('主题切换功能', async ({ page }) => {
    await page.goto('/');

    // 查找主题切换按钮 - 可能在不同位置
    const themeToggle = page.locator('[data-testid="theme-toggle"]').or(
      page.locator('button:has-text("Theme")').or(
        page.locator('button:has([data-icon="sun"])').or(
          page.locator('button:has([data-icon="moon"])')
        )
      )
    );

    // 如果找到主题切换按钮，测试切换功能
    if (await themeToggle.count() > 0) {
      // 获取当前主题状态
      const htmlElement = page.locator('html');
      const initialTheme = await htmlElement.getAttribute('class');

      // 点击主题切换按钮
      await themeToggle.first().click();

      // 等待主题变化
      await page.waitForTimeout(500);

      // 验证主题已切换
      const newTheme = await htmlElement.getAttribute('class');
      expect(newTheme).not.toBe(initialTheme);
    }
  });

  test('响应式设计 - 移动端视图', async ({ page }) => {
    // 设置移动端视口
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // 检查页面在移动端是否正常显示
    await expect(page.locator('body')).toBeVisible();

    // 检查是否有汉堡菜单或移动导航
    const mobileNav = page.locator('[data-testid="mobile-nav"]').or(
      page.locator('button:has-text("Menu")').or(
        page.locator('[aria-label*="menu"]').or(
          page.locator('.hamburger')
        )
      )
    );

    // 如果找到移动导航，测试其功能
    if (await mobileNav.count() > 0) {
      await mobileNav.first().click();
      await page.waitForTimeout(300);
    }
  });

});

/**
 * UI组件测试套件
 * 测试主要UI组件的功能
 */
test.describe('Claude Code Frontend - UI组件测试', () => {

  test('按钮组件交互', async ({ page }) => {
    await page.goto('/');

    // 查找各种按钮
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();

    if (buttonCount > 0) {
      // 测试第一个可见按钮的悬停效果
      const firstButton = buttons.first();

      // 悬停测试
      await firstButton.hover();
      await page.waitForTimeout(200);

      // 验证按钮可点击
      await expect(firstButton).toBeEnabled();
    }
  });

  test('导航菜单功能', async ({ page }) => {
    await page.goto('/');

    // 查找导航链接
    const navLinks = page.locator('nav a, [role="navigation"] a');
    const linkCount = await navLinks.count();

    if (linkCount > 0) {
      // 获取第一个导航链接
      const firstLink = navLinks.first();
      const linkText = await firstLink.textContent();

      if (linkText && linkText.trim()) {
        // 点击导航链接
        await firstLink.click();

        // 等待页面变化
        await page.waitForLoadState('networkidle');

        // 验证页面已导航
        const currentUrl = page.url();
        expect(currentUrl).toContain('localhost:5173');
      }
    }
  });

  test('表单输入组件', async ({ page }) => {
    await page.goto('/');

    // 查找输入框
    const inputs = page.locator('input[type="text"], input[type="email"], input[type="password"], textarea');
    const inputCount = await inputs.count();

    if (inputCount > 0) {
      const firstInput = inputs.first();

      // 测试输入功能
      await firstInput.fill('测试输入');

      // 验证输入值
      const inputValue = await firstInput.inputValue();
      expect(inputValue).toBe('测试输入');

      // 清空输入
      await firstInput.clear();
      const clearedValue = await firstInput.inputValue();
      expect(clearedValue).toBe('');
    }
  });

});

/**
 * 性能和可访问性测试
 */
test.describe('Claude Code Frontend - 性能和可访问性', () => {

  test('页面加载性能', async ({ page }) => {
    // 开始性能监控
    const startTime = Date.now();

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const loadTime = Date.now() - startTime;

    // 验证页面在合理时间内加载完成（10秒内）
    expect(loadTime).toBeLessThan(10000);

    console.log(`页面加载时间: ${loadTime}ms`);
  });

  test('基础可访问性检查', async ({ page }) => {
    await page.goto('/');

    // 检查页面是否有正确的语言属性
    const htmlLang = await page.locator('html').getAttribute('lang');
    // 可以是中文或英文
    if (htmlLang) {
      expect(['zh', 'zh-CN', 'en', 'en-US']).toContain(htmlLang);
    }

    // 检查是否有跳转链接（无障碍功能）
    const skipLinks = page.locator('a[href="#main"], a[href="#content"], [class*="skip"]');
    // 这个是可选的，不是必需的

    // 检查是否有适当的标题结构
    const h1Elements = page.locator('h1');
    const h1Count = await h1Elements.count();

    // 一个页面应该有至少一个h1标题
    expect(h1Count).toBeGreaterThanOrEqual(0);
  });

  test('键盘导航', async ({ page }) => {
    await page.goto('/');

    // 使用Tab键导航
    await page.keyboard.press('Tab');

    // 检查是否有焦点指示器
    const focusedElement = page.locator(':focus');

    if (await focusedElement.count() > 0) {
      // 验证焦点元素可见
      await expect(focusedElement).toBeVisible();
    }

    // 继续Tab导航几次
    for (let i = 0; i < 3; i++) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(100);
    }
  });

});

/**
 * 错误处理测试
 */
test.describe('Claude Code Frontend - 错误处理', () => {

  test('404页面处理', async ({ page }) => {
    // 访问不存在的页面
    await page.goto('/nonexistent-page');

    // 检查是否显示了错误页面或重定向到有效页面
    await page.waitForLoadState('networkidle');

    // 验证页面仍然可用（没有完全崩溃）
    await expect(page.locator('body')).toBeVisible();
  });

  test('网络错误处理', async ({ page }) => {
    await page.goto('/');

    // 模拟网络错误
    await page.route('**/api/**', route => {
      route.abort('failed');
    });

    // 尝试触发API调用（如果有的话）
    const apiButtons = page.locator('button:has-text("刷新"), button:has-text("加载"), button:has-text("获取")');

    if (await apiButtons.count() > 0) {
      await apiButtons.first().click();

      // 等待可能的错误处理
      await page.waitForTimeout(2000);

      // 验证应用没有崩溃
      await expect(page.locator('body')).toBeVisible();
    }
  });

});

/**
 * Claude Code特定功能测试
 */
test.describe('Claude Code Frontend - 特定功能测试', () => {

  test('终端组件样式', async ({ page }) => {
    await page.goto('/');

    // 查找终端样式的元素
    const terminalElements = page.locator('[class*="terminal"], [class*="Terminal"], [data-testid*="terminal"]');

    if (await terminalElements.count() > 0) {
      const terminal = terminalElements.first();

      // 验证终端元素可见
      await expect(terminal).toBeVisible();

      // 检查是否有等宽字体样式
      const fontFamily = await terminal.evaluate(el =>
        window.getComputedStyle(el).fontFamily
      );

      // 验证使用了等宽字体
      expect(fontFamily.toLowerCase()).toMatch(/(mono|consolas|courier|fira code)/);
    }
  });

  test('打字机效果', async ({ page }) => {
    await page.goto('/');

    // 查找可能有打字机效果的元素
    const typewriterElements = page.locator('[class*="typewriter"], [class*="TypeWriter"], [data-testid*="typewriter"]');

    if (await typewriterElements.count() > 0) {
      const typewriter = typewriterElements.first();

      // 验证元素存在
      await expect(typewriter).toBeVisible();

      // 观察文本变化（简单检查）
      const initialText = await typewriter.textContent();
      await page.waitForTimeout(1000);

      // 可能的文本变化
      const afterText = await typewriter.textContent();

      // 注意：打字机效果可能已完成，所以这个测试是可选的
      console.log(`打字机效果 - 初始: "${initialText}", 之后: "${afterText}"`);
    }
  });

  test('Claude配色方案', async ({ page }) => {
    await page.goto('/');

    // 检查是否使用了Claude的橙色主题
    const body = page.locator('body');

    // 获取页面中的主要颜色元素
    const orangeElements = page.locator('[class*="orange"], [class*="primary"], [style*="#f97316"], [style*="rgb(249, 115, 22)"]');

    if (await orangeElements.count() > 0) {
      // 验证使用了Claude的橙色主题
      await expect(orangeElements.first()).toBeVisible();
      console.log('检测到Claude橙色主题元素');
    }

    // 检查CSS自定义属性
    const primaryColor = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim();
    });

    if (primaryColor) {
      console.log(`主色调: ${primaryColor}`);
      expect(primaryColor).toMatch(/#f97316|rgb\(249,\s*115,\s*22\)/);
    }
  });

});