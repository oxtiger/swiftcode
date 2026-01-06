import React from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/auth';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { Button } from '@/components/ui/Button';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 顶部导航栏 */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo 和标题 */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-18 h-18 rounded-xl bg-gradient-to-br flex items-center justify-center">
                  <img src="/logo-1.png" alt="SwiftCode" className="" />
                </div>
                <span className="ml-3 text-xl font-bold text-gray-900 dark:text-white">
                  Claude Relay
                </span>
              </div>
            </div>

            {/* 右侧操作区 */}
            <div className="flex items-center space-x-4">
              {/* 主题切换 */}
              <ThemeToggle />

              {/* 用户信息 */}
              <div className="flex items-center space-x-3">
                <div className="text-sm">
                  <span className="text-gray-700 dark:text-gray-300">
                    欢迎，{user?.username || '管理员'}
                  </span>
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleLogout}
                  className="hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                >
                  退出登录
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 主要内容区域 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};