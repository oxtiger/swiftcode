# API Token 本地存储管理系统

这是一个为 Claude Relay Service 创建的完整 API Token 本地存储管理系统，提供安全、便捷的 Token 管理功能。

## 功能特性

### 🔒 安全的本地存储
- Token 存储在浏览器 localStorage 中
- 支持 Token 脱敏显示（cr_****末尾6位）
- 自动验证 Token 格式（cr_ 前缀）

### 🔄 多 Token 管理
- 支持保存多个 API Token
- 轻松切换激活的 Token
- 每个 Token 支持自定义名称

### 📊 使用统计
- 记录 Token 创建时间
- 跟踪最后使用时间
- 实时显示 Token 统计信息

### 🎨 现代化 UI
- 保持与 Claude Code 首页一致的石色调设计风格
- 橙色强调色（#f97316）突出重要元素
- 玻璃态效果和圆角设计
- Framer Motion 动画效果
- 完全响应式设计

## 技术架构

### 核心文件结构

```
src/
├── services/
│   └── tokenManager.ts          # Token 管理服务
├── stores/
│   └── tokenStore.ts           # Zustand 状态管理
├── components/
│   └── TokenManager.tsx        # Token 管理 UI 组件
└── pages/
    └── TokenManagementPage.tsx # Token 管理页面
```

### 技术栈
- **React 18** + **TypeScript** - 类型安全的现代前端
- **Zustand** - 轻量级状态管理
- **Framer Motion** - 流畅的动画效果
- **Tailwind CSS** - 快速的样式开发
- **localStorage** - 本地数据持久化

## API 接口

### tokenManager 服务

```typescript
export interface ApiToken {
  id: string;
  name: string;
  token: string;
  createdAt: string;
  lastUsed?: string;
  isActive: boolean;
}

export const tokenManager = {
  // 获取所有tokens
  getTokens: (): ApiToken[]

  // 添加token
  addToken: (name: string, token: string) => { success: boolean; error?: string; token?: ApiToken }

  // 删除token
  removeToken: (id: string) => { success: boolean; error?: string }

  // 获取当前激活的token
  getActiveToken: (): ApiToken | null

  // 设置激活token
  setActiveToken: (id: string) => { success: boolean; error?: string }

  // 更新token名称
  updateTokenName: (id: string, newName: string) => { success: boolean; error?: string }

  // 更新最后使用时间
  updateLastUsed: (id: string) => { success: boolean; error?: string }

  // 脱敏显示token
  maskToken: (token: string) => string

  // 验证token格式
  validateTokenFormat: (token: string) => boolean
}
```

### Zustand Store Hooks

```typescript
// 获取所有 tokens
const tokens = useTokenList();

// 获取激活的 token
const activeToken = useActiveToken();

// 获取操作方法
const { addToken, removeToken, setActiveToken } = useTokenActions();

// 获取状态信息
const { isLoading, error, tokenCount } = useTokenStatus();
```

## 使用示例

### 基本使用

```tsx
import React from 'react';
import { TokenManager } from '@/components';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-stone-50">
      <TokenManager />
    </div>
  );
};
```

### 程序化操作

```tsx
import React from 'react';
import { useTokenActions, useActiveToken } from '@/stores/tokenStore';

export const MyComponent: React.FC = () => {
  const { addToken, setActiveToken } = useTokenActions();
  const activeToken = useActiveToken();

  const handleAddToken = async () => {
    const result = await addToken('我的Token', 'cr_my_api_token_123');
    if (result.success) {
      console.log('Token 添加成功！');
    }
  };

  return (
    <div>
      <p>当前激活Token: {activeToken?.name || '未设置'}</p>
      <button onClick={handleAddToken}>添加Token</button>
    </div>
  );
};
```

## 设计理念

### 用户体验优先
- **直观操作** - 清晰的视觉指示和交互反馈
- **安全第一** - Token 脱敏显示，防止意外泄露
- **响应迅速** - 实时状态更新，无延迟体验

### 设计一致性
- **石色调主题** - 与 Claude Code 首页保持一致
- **橙色强调** - 突出重要操作和状态
- **玻璃态效果** - 现代化的视觉层次
- **圆角设计** - 友好、现代的界面风格

### 技术特色
- **类型安全** - 完整的 TypeScript 类型定义
- **状态管理** - Zustand 提供可预测的状态流
- **错误处理** - 全面的错误捕获和用户提示
- **性能优化** - 选择器模式减少不必要的重渲染

## 开发指南

### 启动开发环境

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 类型检查
npm run type-check

# 运行测试
npm run test
```

### 测试覆盖

项目包含完整的 E2E 测试套件，使用 Playwright 测试：

- Token 添加/删除功能
- Token 激活切换
- 名称编辑功能
- 表单验证
- 统计信息显示
- 错误处理

### 扩展开发

如需扩展功能，建议：

1. **服务层扩展** - 在 `tokenManager.ts` 中添加新的业务逻辑
2. **状态管理** - 在 `tokenStore.ts` 中添加新的状态和操作
3. **UI 组件** - 创建新的组件或扩展现有的 `TokenManager.tsx`
4. **类型定义** - 更新 `ApiToken` 接口以支持新字段

## 安全考虑

### 数据保护
- Token 存储在本地 localStorage，不会发送到服务器
- 支持 Token 脱敏显示，防止屏幕截图泄露
- 输入验证确保 Token 格式正确

### 最佳实践
- 定期清理不用的 Token
- 使用有意义的名称标识不同 Token
- 及时切换到正确的激活 Token

## 浏览器兼容性

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

支持所有现代浏览器的 localStorage 和 ES6+ 特性。

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。