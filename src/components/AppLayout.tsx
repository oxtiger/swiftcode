import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils';
import { useApiStatsActions } from '@/stores/apiStatsStore';
import { useActiveToken } from '@/stores/tokenStore';

/**
 * 导航Tab类型定义
 */
interface NavTab {
  id: string;
  label: string;
  path: string;
  icon: React.ReactNode;
  description: string;
}

/**
 * 导航配置
 */
const NAV_TABS: NavTab[] = [
  {
    id: 'dashboard',
    label: '仪表板',
    path: '/dashboard',
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
    description: 'Token管理和API统计',
  },
  {
    id: 'usage-stats',
    label: '使用统计',
    path: '/usage-stats',
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
    description: '模型使用数据和分析',
  },
  {
    id: 'tutorial',
    label: '使用教程',
    path: '/tutorial',
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
    description: 'API使用指南和最佳实践',
  },
];

/**
 * AppLayout - 应用程序共享布局组件
 *
 * 提供一致的顶部导航栏和Tab切换功能
 * 保持与ClaudeCodeHomePage相同的设计风格
 */
export const AppLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const activeToken = useActiveToken();
  const { refreshBasicStats, refreshDetailedStats } = useApiStatsActions();
  const [activeTab, setActiveTab] = useState(() => {
    const currentPath = location.pathname;
    return NAV_TABS.find((tab) => tab.path === currentPath)?.id || 'dashboard';
  });

  // 监听路由变化，触发相应的数据刷新
  useEffect(() => {
    const currentPath = location.pathname;
    const matchedTab = NAV_TABS.find((tab) => tab.path === currentPath);

    if (matchedTab) {
      setActiveTab(matchedTab.id);

      // 根据当前页面触发相应的API调用
      const refreshData = async () => {
        try {
          if (matchedTab.id === 'dashboard') {
            console.log(
              'Route changed to dashboard, refreshing basic stats...'
            );
            await refreshBasicStats();
          } else if (matchedTab.id === 'usage-stats') {
            console.log(
              'Route changed to usage-stats, refreshing detailed stats...'
            );
            await refreshDetailedStats();
          }
        } catch (error) {
          console.log('Route change API call failed:', error);
        }
      };

      refreshData();
    }
  }, [location.pathname, refreshBasicStats, refreshDetailedStats]);

  /**
   * 处理首页跳转
   */
  const handleGoHome = () => {
    navigate('/');
  };

  /**
   * 处理Tab切换
   */
  const handleTabChange = async (tabId: string, path: string) => {
    console.log(
      'Tab changed to:',
      tabId,
      'Active token:',
      activeToken?.token ? 'exists' : 'none'
    );
    setActiveTab(tabId);
    navigate(path);

    // 根据tab类型触发相应的API调用（无条件调用，让store内部处理token验证）
    try {
      if (tabId === 'dashboard') {
        console.log('Refreshing basic stats for dashboard...');
        await refreshBasicStats();
      } else if (tabId === 'usage-stats') {
        console.log('Refreshing detailed stats for usage-stats...');
        await refreshDetailedStats();
      }
    } catch (error) {
      console.log('Tab switch API call failed:', error);
    }
  };

  /**
   * 获取当前Tab信息
   */
  const currentTab = NAV_TABS.find((tab) => tab.id === activeTab);

  return (
    <div className="min-h-screen bg-stone-50">
      {/* 顶部导航栏 */}
      <nav className="sticky top-0 z-50 border-b border-stone-200 bg-stone-50/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo和标题 */}
            <motion.div
              className="flex cursor-pointer items-center space-x-3"
              onClick={handleGoHome}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex w-18 h-18 items-center justify-center rounded-xl bg-gradient-to-br">
                <img src="/logo-1.png" alt="SwiftCode" className="" />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-3xl font-bold text-stone-900">
                  SwiftCode
                </span>
                <span className="relative text-lg font-extrabold bg-gradient-to-r from-orange-500 via-orange-400 to-red-500 bg-clip-text text-transparent animate-pulse">
                  MAX
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full animate-ping"></span>
                </span>
              </div>
            </motion.div>

            {/* 右侧操作按钮 */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleGoHome}
                className="text-stone-600 hover:text-stone-900"
              >
                返回首页
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Tab导航栏 */}
      <div className="border-b border-stone-200 bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center py-4">
            <div className="inline-flex items-center rounded-xl bg-stone-100/80 p-1.5 backdrop-blur-sm">
              {NAV_TABS.map((tab, index) => (
                <motion.button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id, tab.path)}
                  className={cn(
                    'relative flex items-center space-x-2.5 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-300',
                    'hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:ring-offset-2 focus:ring-offset-stone-100',
                    activeTab === tab.id
                      ? 'bg-white text-orange-600 shadow-md ring-1 ring-orange-200/50'
                      : 'text-stone-600 hover:bg-white/60 hover:text-stone-900 hover:shadow-sm'
                  )}
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  {/* Tab图标容器 */}
                  <div
                    className={cn(
                      'flex h-5 w-5 items-center justify-center transition-all duration-200',
                      activeTab === tab.id
                        ? 'text-orange-500'
                        : 'text-stone-400 group-hover:text-stone-600'
                    )}
                  >
                    {tab.icon}
                  </div>

                  {/* Tab标签 */}
                  <span className="whitespace-nowrap font-medium">
                    {tab.label}
                  </span>

                  {/* 活跃状态指示器 - 右侧小点 */}
                  {activeTab === tab.id && (
                    <motion.div
                      className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-orange-500"
                      layoutId="activeIndicator"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}

                  {/* 悬停时的背景效果 */}
                  <motion.div
                    className="absolute inset-0 rounded-lg"
                    whileHover={
                      activeTab !== tab.id
                        ? {
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                          }
                        : {}
                    }
                    transition={{ duration: 0.2 }}
                  />
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 页面标题区域 */}
      <AnimatePresence mode="wait">
        {currentTab && (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="border-b border-stone-200 bg-gradient-to-br from-orange-50 to-stone-50"
          >
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
              <div className="flex items-center space-x-4">
                <div className="rounded-xl border border-stone-200 bg-white p-3 shadow-sm">
                  <div className="text-orange-500">{currentTab.icon}</div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-stone-900">
                    {currentTab.label}
                  </h1>
                  <p className="mt-1 text-stone-600">
                    {currentTab.description}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 主要内容区域 */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 背景装饰元素 */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-orange-200/10 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-red-200/10 blur-3xl"></div>
      </div>
    </div>
  );
};

export default AppLayout;
