# Claude Relay Service - 前端布局系统

完整的现代化布局和导航系统，专为Claude Relay Service设计。

## 🏗️ 架构概览

### 主要组件

- **MainLayout**: 主应用布局容器
- **Sidebar**: 可折叠的侧边栏导航
- **Header**: 顶部导航栏与用户菜单
- **Footer**: 页脚组件
- **Navigation**: 主导航菜单
- **Breadcrumb**: 面包屑导航
- **TabNavigation**: 标签页导航

### 状态管理

- **useLayoutStore**: 布局状态管理（侧边栏、主题、通知等）
- **useAuthStore**: 认证状态管理（用户信息、权限等）

### 路由系统

- **AppRouter**: 主路由组件
- **AuthGuard**: 认证守卫
- **RouteGuard**: 路由守卫
- **routes**: 路由配置

## 🎨 设计特色

### Claude Code 配色方案
- 主色调：橙色渐变 (#ff6b35 → #f7931e)
- 玻璃态效果与现代背景
- 终端风格字体 (JetBrains Mono)

### 响应式设计
- 移动端友好的抽屉式导航
- 平板和桌面端适配
- 灵活的断点系统

### 暗黑模式支持
- 完整的明亮/暗黑主题切换
- 自动检测系统主题偏好
- 主题状态持久化

### 无障碍支持
- ARIA 标签和语义化HTML
- 键盘导航支持
- 高对比度模式兼容
- 减少动画偏好支持

## 🚀 使用方法

### 基础使用

```tsx
import React from 'react';
import { AppRouter } from './router';
import './styles/globals.css';

const App: React.FC = () => {
  return <AppRouter />;
};

export default App;
```

### 布局组件使用

```tsx
import { MainLayout, TabNavigation } from '@/components/layout';
import { useLayoutStore } from '@/stores';

const MyPage: React.FC = () => {
  const { addNotification } = useLayoutStore();

  const tabs = [
    { id: '1', label: '概览', icon: IconDashboard },
    { id: '2', label: '设置', icon: IconSettings },
  ];

  return (
    <MainLayout>
      <TabNavigation
        tabs={tabs}
        activeTabId="1"
        onTabChange={(id) => console.log('切换到标签:', id)}
      />
      {/* 页面内容 */}
    </MainLayout>
  );
};
```

### 权限控制

```tsx
import { usePermissions } from '@/router/guards';

const AdminPanel: React.FC = () => {
  const { hasPermission, isAdmin } = usePermissions();

  if (!hasPermission('admin:read')) {
    return <div>权限不足</div>;
  }

  return (
    <div>
      {isAdmin && <AdminControls />}
    </div>
  );
};
```

### 主题切换

```tsx
import { useLayoutStore } from '@/stores';

const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme } = useLayoutStore();

  return (
    <button onClick={toggleTheme}>
      {isDark ? '🌞' : '🌙'}
    </button>
  );
};
```

## 📱 响应式断点

```css
/* 移动端 */
@media (max-width: 640px) {
  /* 侧边栏变为抽屉模式 */
  /* 隐藏部分UI元素 */
}

/* 平板端 */
@media (min-width: 641px) and (max-width: 1024px) {
  /* 折叠侧边栏 */
  /* 调整间距 */
}

/* 桌面端 */
@media (min-width: 1025px) {
  /* 完整布局 */
  /* 展开所有功能 */
}
```

## 🎯 核心功能

### 侧边栏功能
- ✅ 可折叠/展开
- ✅ 移动端抽屉模式
- ✅ 权限过滤导航项
- ✅ 活动状态指示
- ✅ 图标和工具提示

### 顶部导航
- ✅ 搜索功能
- ✅ 通知中心
- ✅ 用户菜单
- ✅ 主题切换
- ✅ 面包屑导航

### 标签页导航
- ✅ 可关闭标签
- ✅ 标签固定功能
- ✅ 拖拽排序
- ✅ 滚动支持
- ✅ 徽章显示

### 状态管理
- ✅ 布局状态持久化
- ✅ 认证状态管理
- ✅ 通知系统
- ✅ 权限控制

## 🔧 定制配置

### 路由配置

```typescript
// src/router/routes.ts
export const routes: RouteConfig[] = [
  {
    path: '/dashboard',
    component: Dashboard,
    title: '仪表板',
    icon: IconDashboard,
    requireAuth: true,
    requirePermissions: ['dashboard:read'],
  },
  // ... 更多路由
];
```

### 导航配置

```typescript
// src/router/routes.ts
export const navigationConfig = [
  {
    title: '概览',
    items: [
      routes.find(r => r.path === '/dashboard'),
    ],
  },
  // ... 更多分组
];
```

### 主题定制

```css
/* src/styles/globals.css */
.claude-gradient {
  background: linear-gradient(135deg, #your-color 0%, #your-color-2 100%);
}
```

## 📂 文件结构

```
src/
├── components/
│   ├── layout/
│   │   ├── MainLayout.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Navigation.tsx
│   │   ├── Breadcrumb.tsx
│   │   ├── TabNavigation.tsx
│   │   └── index.ts
│   └── ui/
│       └── LoadingSpinner.tsx
├── stores/
│   ├── layout.ts
│   ├── auth.ts
│   └── index.ts
├── router/
│   ├── AppRouter.tsx
│   ├── guards.tsx
│   ├── routes.ts
│   └── index.ts
├── pages/
│   ├── auth/
│   │   └── Login.tsx
│   ├── Dashboard.tsx
│   ├── NotFound.tsx
│   └── ...
├── styles/
│   └── globals.css
└── App.tsx
```

## 🎪 动画效果

- **Framer Motion** 驱动的流畅过渡
- 页面切换动画
- 侧边栏展开/折叠动画
- 标签页操作动画
- 通知弹出动画

## 📊 性能优化

- 懒加载页面组件
- 路由级别的代码分割
- 组件级别的性能优化
- 图标按需加载
- 状态持久化

## 🌐 国际化支持

布局系统已预留国际化接口，可轻松扩展多语言支持：

```typescript
// 未来扩展
const { t } = useTranslation();

<span>{t('navigation.dashboard')}</span>
```

## 🔒 安全特性

- 路由级别的权限控制
- 敏感操作的二次确认
- XSS 防护
- CSRF 保护
- 安全的状态管理

---

**Claude Relay Service** - 现代化的 AI API 中转服务管理界面