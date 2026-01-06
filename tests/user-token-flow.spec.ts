import { test, expect } from '@playwright/test';

// 基于用户视角：在 /dashboard 添加（或替换）单一 Token，立即查询并展示基础数据；
// 然后跳转 /usage-stats 查看详细数据。验证与后端 /apiStats 的真实交互。

test.describe('User single-token flow on dashboard → usage-stats', () => {
  test('add token, auto fetch stats, show basic overview, then navigate to usage-stats', async ({ page }) => {
    // 进入仪表板
    await page.goto('/dashboard');

    // 若首次进入没有 Token，则按钮文案为“添加Token”；有 Token 时为“管理Token”
    const addOrManageButton = page.getByRole('button', { name: /添加Token|管理Token/ });
    await addOrManageButton.click();

    // 进入 TokenManager 页面，点击“添加新Token”
    await page.getByRole('button', { name: '添加新Token' }).click();

    // 填写表单
    const tokenName = `e2e-token-${Date.now()}`;
    const tokenValue = `cr_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    await page.getByLabel('Token名称').fill(tokenName);
    await page.getByLabel('Token值').fill(tokenValue);

    // 监听网络请求（获取 apiId 与统计数据）
    const keyIdPromise = page.waitForResponse((res) =>
      res.url().includes('/apiStats/api/get-key-id') && res.request().method() === 'POST'
    );
    const userStatsPromise = page.waitForResponse((res) =>
      res.url().includes('/apiStats/api/user-stats') && res.request().method() === 'POST'
    );

    // 提交
    await page.getByRole('button', { name: '添加Token' }).click();

    // 若已有旧 Token，会出现“确认替换 Token”弹窗
    const maybeReplaceModal = page.getByRole('heading', { name: '确认替换 Token' });
    if (await maybeReplaceModal.isVisible({ timeout: 1000 }).catch(() => false)) {
      await page.getByRole('button', { name: '确认替换' }).click();
    }

    // 等待网络响应（与后端真实交互）
    const keyIdRes = await keyIdPromise;
    const userStatsRes = await userStatsPromise;
    expect(keyIdRes.ok()).toBeTruthy();
    expect(userStatsRes.ok()).toBeTruthy();

    // 应自动跳回 /dashboard 并渲染基础概览
    await expect(page).toHaveURL(/\/dashboard/);

    // 校验概览卡片的关键字段存在且不是占位符
    await expect(page.getByText('API 请求总数')).toBeVisible();
    // 概览数字不应显示为 “-”
    const totalReqLocator = page.locator('text=API 请求总数').locator('..').locator('..');
    await expect(totalReqLocator).not.toContainText('-');

    // 查看使用统计按钮 → 跳转 /usage-stats
    await page.getByRole('button', { name: '查看使用统计' }).click();
    await expect(page).toHaveURL(/\/usage-stats/);

    // 详细页存在“模型使用详情”或相关说明
    // 页面内容为自研组件，取保底断言：页面标题“使用统计”或表格列头存在
    const maybeHeader = page.getByText(/使用统计|模型使用详情|模型使用分布/);
    await expect(maybeHeader).toBeVisible();
  });
});


