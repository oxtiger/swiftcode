import { lazy } from 'react';
import {
  IconDashboard,
  IconKey,
  IconRobot,
  IconStars,
  IconChartBar,
  IconSettings,
  IconUsers,
  IconShield,
  IconActivity,
  IconFiles,
  IconWallet,
} from '@tabler/icons-react';

// 懒加载页面组件
const Dashboard = lazy(() => import('../pages/Dashboard'));
const ApiKeys = lazy(() => import('../pages/ApiKeys'));
const ClaudeAccounts = lazy(() => import('../pages/ClaudeAccounts'));
const GeminiAccounts = lazy(() => import('../pages/GeminiAccounts'));
const Analytics = lazy(() => import('../pages/Analytics'));
const Settings = lazy(() => import('../pages/Settings'));
const Users = lazy(() => import('../pages/Users'));
const Logs = lazy(() => import('../pages/Logs'));
const Security = lazy(() => import('../pages/Security'));
const System = lazy(() => import('../pages/System'));
const TokenManagement = lazy(() => import('../pages/TokenManagementPage'));

export interface RouteConfig {
  path: string;
  component: React.LazyExoticComponent<React.ComponentType<any>>;
  title: string;
  icon: React.ComponentType<any>;
  description?: string;
  requireAuth?: boolean;
  requirePermissions?: string[];
  hideInNavigation?: boolean;
  children?: RouteConfig[];
}

export const routes: RouteConfig[] = [
  {
    path: '/',
    component: Dashboard,
    title: '仪表板',
    icon: IconDashboard,
    description: '系统概览和关键指标',
    requireAuth: true,
  },
  {
    path: '/tokens',
    component: TokenManagement,
    title: 'Token管理',
    icon: IconWallet,
    description: '本地Token存储和管理',
    requireAuth: false, // Token管理不需要认证，因为这是本地功能
  },
  {
    path: '/api-keys',
    component: ApiKeys,
    title: 'API Keys',
    icon: IconKey,
    description: 'API密钥管理和使用统计',
    requireAuth: true,
    requirePermissions: ['api_keys:read'],
  },
  {
    path: '/claude-accounts',
    component: ClaudeAccounts,
    title: 'Claude账户',
    icon: IconRobot,
    description: 'Claude OAuth账户管理',
    requireAuth: true,
    requirePermissions: ['claude_accounts:read'],
  },
  {
    path: '/gemini-accounts',
    component: GeminiAccounts,
    title: 'Gemini账户',
    icon: IconStars,
    description: 'Gemini账户管理',
    requireAuth: true,
    requirePermissions: ['gemini_accounts:read'],
  },
  {
    path: '/analytics',
    component: Analytics,
    title: '数据分析',
    icon: IconChartBar,
    description: '使用统计和数据分析',
    requireAuth: true,
    requirePermissions: ['analytics:read'],
  },
  {
    path: '/users',
    component: Users,
    title: '用户管理',
    icon: IconUsers,
    description: '用户账户和权限管理',
    requireAuth: true,
    requirePermissions: ['users:read'],
  },
  {
    path: '/logs',
    component: Logs,
    title: '系统日志',
    icon: IconFiles,
    description: '系统运行日志查看',
    requireAuth: true,
    requirePermissions: ['logs:read'],
  },
  {
    path: '/security',
    component: Security,
    title: '安全中心',
    icon: IconShield,
    description: '安全设置和监控',
    requireAuth: true,
    requirePermissions: ['security:read'],
  },
  {
    path: '/system',
    component: System,
    title: '系统监控',
    icon: IconActivity,
    description: '系统性能和健康状态',
    requireAuth: true,
    requirePermissions: ['system:read'],
  },
  {
    path: '/settings',
    component: Settings,
    title: '系统设置',
    icon: IconSettings,
    description: '系统配置和个人设置',
    requireAuth: true,
  },
];

// 导航菜单配置（可以与路由不同，支持分组）
export const navigationConfig = [
  {
    title: '概览',
    items: [routes.find((r) => r.path === '/')].filter(Boolean),
  },
  {
    title: 'Token管理',
    items: [
      routes.find((r) => r.path === '/tokens'),
    ].filter(Boolean),
  },
  {
    title: 'API管理',
    items: [
      routes.find((r) => r.path === '/api-keys'),
      routes.find((r) => r.path === '/claude-accounts'),
      routes.find((r) => r.path === '/gemini-accounts'),
    ].filter(Boolean),
  },
  {
    title: '监控分析',
    items: [
      routes.find((r) => r.path === '/analytics'),
      routes.find((r) => r.path === '/logs'),
      routes.find((r) => r.path === '/system'),
    ].filter(Boolean),
  },
  {
    title: '系统管理',
    items: [
      routes.find((r) => r.path === '/users'),
      routes.find((r) => r.path === '/security'),
      routes.find((r) => r.path === '/settings'),
    ].filter(Boolean),
  },
];

// 面包屑生成器
export const generateBreadcrumbs = (pathname: string) => {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs = [
    {
      label: '首页',
      href: '/',
      icon: IconDashboard,
    },
  ];

  let currentPath = '';
  for (const segment of segments) {
    currentPath += `/${segment}`;
    const route = routes.find((r) => r.path === currentPath);

    if (route) {
      breadcrumbs.push({
        label: route.title,
        href: currentPath,
        icon: route.icon,
      });
    } else {
      // 处理动态路由参数
      breadcrumbs.push({
        label: segment.charAt(0).toUpperCase() + segment.slice(1),
        href: currentPath,
      });
    }
  }

  return breadcrumbs;
};
