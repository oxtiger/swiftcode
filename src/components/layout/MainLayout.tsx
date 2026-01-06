import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLayoutStore } from '../../stores/layout';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import { generateBreadcrumbs } from '../../router/routes';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const {
    sidebarOpen,
    sidebarCollapsed,
    isMobile,
    setSidebarOpen,
    setBreadcrumbs,
  } = useLayoutStore();

  const location = useLocation();

  // 更新面包屑
  useEffect(() => {
    const breadcrumbs = generateBreadcrumbs(location.pathname);
    setBreadcrumbs(breadcrumbs);
  }, [location.pathname, setBreadcrumbs]);

  // 移动端自动关闭侧边栏
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile, setSidebarOpen]);

  const sidebarWidth = sidebarCollapsed ? 'w-16' : 'w-64';
  const contentMargin = isMobile
    ? 'ml-0'
    : sidebarCollapsed
      ? 'ml-16'
      : 'ml-64';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* 侧边栏 */}
      <Sidebar />

      {/* 移动端遮罩 */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* 主内容区域 */}
      <div
        className={`min-h-screen transition-all duration-300 ${contentMargin}`}
      >
        {/* 顶部导航 */}
        <Header />

        {/* 页面内容 */}
        <main className="flex-1">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="p-4 sm:p-6 lg:p-8"
          >
            {/* 内容容器 */}
            <div className="mx-auto max-w-7xl">{children}</div>
          </motion.div>
        </main>

        {/* 页脚 */}
        <Footer />
      </div>

      {/* 全局样式注入 */}
      <style jsx global>{`
        /* 自定义滚动条 */
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        ::-webkit-scrollbar-track {
          background: transparent;
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.5);
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.7);
        }

        .dark ::-webkit-scrollbar-thumb {
          background: rgba(75, 85, 99, 0.5);
        }

        .dark ::-webkit-scrollbar-thumb:hover {
          background: rgba(75, 85, 99, 0.7);
        }

        /* 禁用移动端选择高亮 */
        .touch-manipulation {
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          -khtml-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
        }

        /* 玻璃态效果 */
        .glass {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .dark .glass {
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        /* 终端风格 */
        .terminal-text {
          font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
          font-weight: 400;
          letter-spacing: 0.025em;
        }

        /* Claude橙色渐变 */
        .claude-gradient {
          background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
        }

        .claude-gradient-text {
          background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* 动画类 */
        .fade-in {
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .slide-in-right {
          animation: slideInRight 0.3s ease-out;
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* 响应式字体 */
        @media (max-width: 640px) {
          .responsive-text {
            font-size: 0.875rem;
          }
        }

        /* Focus样式 */
        .focus-ring:focus {
          outline: 2px solid #ff6b35;
          outline-offset: 2px;
        }

        .dark .focus-ring:focus {
          outline-color: #f7931e;
        }
      `}</style>
    </div>
  );
};

export default MainLayout;
