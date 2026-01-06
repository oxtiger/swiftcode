import React, { Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { routes } from './routes';
import { AuthGuard } from './guards';
import { useLayoutStore } from '../stores/layout';
import { useAuthStore } from '../stores/auth';
import MainLayout from '../components/layout/MainLayout';
import LoadingSpinner from '../components/ui/LoadingSpinner';

// 登录页面组件
const LoginPage = React.lazy(() => import('../pages/auth/Login'));

// 404页面组件
const NotFoundPage = React.lazy(() => import('../pages/NotFound'));

// 路由加载组件
const RouteLoader: React.FC = () => (
  <div className="flex min-h-[400px] items-center justify-center">
    <LoadingSpinner size="lg" />
  </div>
);

export const AppRouter: React.FC = () => {
  const { setIsMobile, setTheme, isDark } = useLayoutStore();
  const { checkAuth } = useAuthStore();

  // 初始化应用
  useEffect(() => {
    // 检查移动端
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    // 初始化主题
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme === 'dark');
    } else {
      // 检查系统主题偏好
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      setTheme(prefersDark);
    }

    // 检查认证状态
    checkAuth();

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, [setIsMobile, setTheme, checkAuth]);

  // 应用主题类
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 transition-colors duration-200 dark:bg-gray-900">
        <Suspense fallback={<RouteLoader />}>
          <AnimatePresence mode="wait">
            <Routes>
              {/* 登录路由 */}
              <Route
                path="/login"
                element={
                  <AuthGuard requireAuth={false}>
                    <LoginPage />
                  </AuthGuard>
                }
              />

              {/* 主应用路由 */}
              <Route
                path="/*"
                element={
                  <AuthGuard requireAuth={true}>
                    <MainLayout>
                      <Routes>
                        {routes.map((route) => (
                          <Route
                            key={route.path}
                            path={route.path}
                            element={
                              <AuthGuard
                                requirePermissions={route.requirePermissions}
                                fallback={<RouteLoader />}
                              >
                                <Suspense fallback={<RouteLoader />}>
                                  <route.component />
                                </Suspense>
                              </AuthGuard>
                            }
                          />
                        ))}

                        {/* 重定向根路径 */}
                        <Route
                          path="/"
                          element={<Navigate to="/dashboard" replace />}
                        />

                        {/* 404页面 */}
                        <Route path="*" element={<NotFoundPage />} />
                      </Routes>
                    </MainLayout>
                  </AuthGuard>
                }
              />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </div>
    </BrowserRouter>
  );
};

export default AppRouter;
