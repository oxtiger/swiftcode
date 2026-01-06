import React, { useEffect } from 'react';
import { useAuthStore } from '../stores/auth';
import { useLayoutStore } from '../stores/layout';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requirePermissions?: string[];
  fallback?: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireAuth = true,
  requirePermissions = [],
  fallback = <div>Loading...</div>,
}) => {
  const { isAuthenticated, user, permissions, checkAuth, loading } =
    useAuthStore();
  const { addNotification } = useLayoutStore();

  useEffect(() => {
    if (requireAuth && !isAuthenticated) {
      checkAuth().catch((error) => {
        addNotification({
          type: 'error',
          title: '认证失败',
          message: '请重新登录',
        });
      });
    }
  }, [requireAuth, isAuthenticated, checkAuth, addNotification]);

  // 如果不需要认证，直接渲染子组件
  if (!requireAuth) {
    return <>{children}</>;
  }

  // 如果正在加载，显示fallback
  if (loading) {
    return <>{fallback}</>;
  }

  // 如果未认证，重定向到登录页
  if (!isAuthenticated) {
    window.location.href = '/login';
    return <>{fallback}</>;
  }

  // 检查权限
  if (requirePermissions.length > 0) {
    const hasAllPermissions = requirePermissions.every(
      (permission) =>
        permissions.includes(permission) || permissions.includes('*')
    );

    if (!hasAllPermissions) {
      return (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="space-y-4 text-center">
            <div className="text-6xl text-red-500">🚫</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              权限不足
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              您没有访问此页面的权限
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              需要权限: {requirePermissions.join(', ')}
            </p>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};

interface RouteGuardProps {
  children: React.ReactNode;
  path: string;
}

export const RouteGuard: React.FC<RouteGuardProps> = ({ children, path }) => {
  const { setBreadcrumbs } = useLayoutStore();

  useEffect(() => {
    // 这里可以根据路径动态设置面包屑
    // 实际实现会在路由组件中处理
  }, [path, setBreadcrumbs]);

  return <>{children}</>;
};

// 权限检查Hook
export const usePermissions = () => {
  const { permissions, user } = useAuthStore();

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    if (permissions.includes('*')) return true;
    return permissions.includes(permission);
  };

  const hasAnyPermission = (permissionList: string[]): boolean => {
    if (!user) return false;
    if (permissions.includes('*')) return true;
    return permissionList.some((permission) =>
      permissions.includes(permission)
    );
  };

  const hasAllPermissions = (permissionList: string[]): boolean => {
    if (!user) return false;
    if (permissions.includes('*')) return true;
    return permissionList.every((permission) =>
      permissions.includes(permission)
    );
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    permissions,
    isAdmin: user?.role === 'admin',
  };
};
