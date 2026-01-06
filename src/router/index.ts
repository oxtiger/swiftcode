// 路由相关导出
export { default as AppRouter } from './AppRouter';
export { AuthGuard, RouteGuard, usePermissions } from './guards';
export { routes, navigationConfig, generateBreadcrumbs } from './routes';
export type { RouteConfig } from './routes';
