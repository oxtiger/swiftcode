import { test, expect } from '@playwright/test';

test.describe('Token Manager', () => {
  test.beforeEach(async ({ page }) => {
    // 访问Token管理页面
    await page.goto('/tokens');
  });

  test('应该显示Token管理页面标题', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Token 管理中心');
  });

  test('应该显示添加Token按钮', async ({ page }) => {
    const addButton = page.locator('button', { hasText: '添加新Token' });
    await expect(addButton).toBeVisible();
  });

  test('应该能打开添加Token表单', async ({ page }) => {
    const addButton = page.locator('button', { hasText: '添加新Token' });
    await addButton.click();

    // 检查表单是否出现
    await expect(page.locator('input[placeholder*="Token名称"]')).toBeVisible();
    await expect(page.locator('input[placeholder*="cr_"]')).toBeVisible();
  });

  test('应该能添加新Token', async ({ page }) => {
    // 打开添加表单
    await page.locator('button', { hasText: '添加新Token' }).click();

    // 填写表单
    await page.fill('input[placeholder*="Token名称"]', '测试Token');
    await page.fill('input[placeholder*="cr_"]', 'cr_test_token_123456789');

    // 提交表单
    await page.locator('button', { hasText: '添加Token' }).click();

    // 检查Token是否添加成功
    await expect(page.locator('text=测试Token')).toBeVisible();
    await expect(page.locator('text=cr_****123456789')).toBeVisible();
  });

  test('应该显示空状态当没有Token时', async ({ page }) => {
    await expect(page.locator('text=还没有Token')).toBeVisible();
    await expect(page.locator('text=点击上方"添加新Token"按钮开始管理您的API Token')).toBeVisible();
  });

  test('应该验证Token格式', async ({ page }) => {
    // 打开添加表单
    await page.locator('button', { hasText: '添加新Token' }).click();

    // 填写无效的Token格式
    await page.fill('input[placeholder*="Token名称"]', '测试Token');
    await page.fill('input[placeholder*="cr_"]', 'invalid_token');

    // 提交表单
    await page.locator('button', { hasText: '添加Token' }).click();

    // 检查错误信息
    await expect(page.locator('text=Token格式无效，应以"cr_"开头')).toBeVisible();
  });

  test('应该能切换激活Token', async ({ page }) => {
    // 先添加两个Token
    await page.locator('button', { hasText: '添加新Token' }).click();
    await page.fill('input[placeholder*="Token名称"]', 'Token1');
    await page.fill('input[placeholder*="cr_"]', 'cr_test_token_111111111');
    await page.locator('button', { hasText: '添加Token' }).click();

    await page.locator('button', { hasText: '添加新Token' }).click();
    await page.fill('input[placeholder*="Token名称"]', 'Token2');
    await page.fill('input[placeholder*="cr_"]', 'cr_test_token_222222222');
    await page.locator('button', { hasText: '添加Token' }).click();

    // 切换激活Token
    const setActiveButton = page.locator('button', { hasText: '设为活跃' }).first();
    await setActiveButton.click();

    // 检查激活状态是否改变（橙色指示器）
    await expect(page.locator('.bg-orange-500').first()).toBeVisible();
  });

  test('应该能删除Token', async ({ page }) => {
    // 先添加一个Token
    await page.locator('button', { hasText: '添加新Token' }).click();
    await page.fill('input[placeholder*="Token名称"]', '待删除Token');
    await page.fill('input[placeholder*="cr_"]', 'cr_test_token_delete123');
    await page.locator('button', { hasText: '添加Token' }).click();

    // 删除Token（需要点击两次确认）
    const deleteButton = page.locator('button', { hasText: '删除' }).first();
    await deleteButton.click();
    await deleteButton.click();

    // 检查Token是否被删除
    await expect(page.locator('text=待删除Token')).not.toBeVisible();
  });

  test('应该能编辑Token名称', async ({ page }) => {
    // 先添加一个Token
    await page.locator('button', { hasText: '添加新Token' }).click();
    await page.fill('input[placeholder*="Token名称"]', '原始名称');
    await page.fill('input[placeholder*="cr_"]', 'cr_test_token_edit12345');
    await page.locator('button', { hasText: '添加Token' }).click();

    // 编辑Token名称
    await page.locator('button', { hasText: '编辑' }).first().click();
    await page.fill('input[value="原始名称"]', '新名称');
    await page.locator('button', { hasText: '保存' }).click();

    // 检查名称是否更新
    await expect(page.locator('text=新名称')).toBeVisible();
    await expect(page.locator('text=原始名称')).not.toBeVisible();
  });

  test('应该显示正确的统计信息', async ({ page }) => {
    // 检查初始统计
    await expect(page.locator('text=已保存Token').locator('..').locator('div').first()).toContainText('0');
    await expect(page.locator('text=激活Token').locator('..').locator('div').first()).toContainText('0');

    // 添加一个Token后检查统计
    await page.locator('button', { hasText: '添加新Token' }).click();
    await page.fill('input[placeholder*="Token名称"]', '统计测试Token');
    await page.fill('input[placeholder*="cr_"]', 'cr_test_token_stats123');
    await page.locator('button', { hasText: '添加Token' }).click();

    await expect(page.locator('text=已保存Token').locator('..').locator('div').first()).toContainText('1');
    await expect(page.locator('text=激活Token').locator('..').locator('div').first()).toContainText('1');
  });
});