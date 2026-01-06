import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import {
  IconMenu2,
  IconX,
  IconChevronLeft,
  IconChevronRight,
  IconChevronDown,
  IconChevronUp,
  IconLogout,
  IconCode,
} from '@tabler/icons-react';
import { useLayoutStore } from '../../stores/layout';
import { useAuthStore } from '../../stores/auth';
import { navigationConfig } from '../../router/routes';
import { usePermissions } from '../../router/guards';

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  const location = useLocation();
  const {
    sidebarOpen,
    sidebarCollapsed,
    isMobile,
    setSidebarOpen,
    toggleSidebarCollapse,
  } = useLayoutStore();

  const { logout, user } = useAuthStore();
  const { hasPermission } = usePermissions();

  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['概览', 'API管理']) // 默认展开的分组
  );

  const toggleSection = (sectionTitle: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionTitle)) {
      newExpanded.delete(sectionTitle);
    } else {
      newExpanded.add(sectionTitle);
    }
    setExpandedSections(newExpanded);
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  // 过滤有权限的导航项
  const filteredNavConfig = navigationConfig
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        if (!item?.requirePermissions?.length) return true;
        return item.requirePermissions.some((permission) =>
          hasPermission(permission)
        );
      }),
    }))
    .filter((section) => section.items.length > 0);

  const sidebarVariants = {
    open: {
      x: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 },
    },
    closed: {
      x: isMobile ? '-100%' : 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 },
    },
  };

  const contentVariants = {
    expanded: { opacity: 1, width: 'auto' },
    collapsed: { opacity: 0, width: 0 },
  };

  return (
    <>
      <motion.aside
        variants={sidebarVariants}
        animate={sidebarOpen ? 'open' : 'closed'}
        className={`fixed top-0 left-0 z-50 h-full ${sidebarCollapsed ? 'w-16' : 'w-64'} transition-all duration-300 ease-in-out ${className} `}
      >
        {/* 侧边栏主体 */}
        <div className="glass flex h-full flex-col border-r border-gray-200/20 dark:border-gray-700/20">
          {/* 顶部 Logo 区域 */}
          <div className="flex h-16 items-center justify-between border-b border-gray-200/20 px-4 dark:border-gray-700/20">
            <Link
              to="/"
              className="flex items-center space-x-3 text-gray-900 transition-colors hover:text-orange-500 dark:text-white dark:hover:text-orange-400"
            >
              <div className="claude-gradient flex h-8 w-8 items-center justify-center rounded-lg">
                <IconCode className="h-5 w-5 text-white" />
              </div>

              <AnimatePresence>
                {!sidebarCollapsed && (
                  <motion.div
                    variants={contentVariants}
                    initial="collapsed"
                    animate="expanded"
                    exit="collapsed"
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <span className="terminal-text claude-gradient-text text-lg font-bold">
                      Claude Relay
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </Link>

            {/* 折叠按钮 (桌面端) */}
            {!isMobile && (
              <button
                onClick={toggleSidebarCollapse}
                className="focus-ring flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                title={sidebarCollapsed ? '展开侧边栏' : '折叠侧边栏'}
              >
                {sidebarCollapsed ? (
                  <IconChevronRight className="h-4 w-4" />
                ) : (
                  <IconChevronLeft className="h-4 w-4" />
                )}
              </button>
            )}

            {/* 关闭按钮 (移动端) */}
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(false)}
                className="focus-ring flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-300"
              >
                <IconX className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* 导航区域 */}
          <nav className="flex-1 space-y-2 overflow-y-auto p-4">
            {filteredNavConfig.map((section) => (
              <div key={section.title} className="space-y-1">
                {/* 分组标题 */}
                {!sidebarCollapsed && (
                  <button
                    onClick={() => toggleSection(section.title)}
                    className="focus-ring flex w-full items-center justify-between px-2 py-1.5 text-xs font-semibold tracking-wider text-gray-500 uppercase transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    <span>{section.title}</span>
                    {expandedSections.has(section.title) ? (
                      <IconChevronUp className="h-3 w-3" />
                    ) : (
                      <IconChevronDown className="h-3 w-3" />
                    )}
                  </button>
                )}

                {/* 导航项 */}
                <AnimatePresence>
                  {(sidebarCollapsed ||
                    expandedSections.has(section.title)) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-1 overflow-hidden"
                    >
                      {section.items.map((item) => {
                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;

                        return (
                          <Link
                            key={item.path}
                            to={item.path}
                            className={`group focus-ring flex items-center rounded-lg px-2 py-2.5 text-sm font-medium transition-all duration-200 ${
                              isActive
                                ? 'border-r-2 border-orange-500 bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300'
                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700/50 dark:hover:text-white'
                            } ${sidebarCollapsed ? 'justify-center px-3' : ''} `}
                            title={sidebarCollapsed ? item.title : undefined}
                          >
                            <Icon
                              className={`h-5 w-5 ${sidebarCollapsed ? '' : 'mr-3'} ${isActive ? 'text-orange-500' : ''} transition-colors`}
                            />

                            <AnimatePresence>
                              {!sidebarCollapsed && (
                                <motion.div
                                  variants={contentVariants}
                                  initial="collapsed"
                                  animate="expanded"
                                  exit="collapsed"
                                  transition={{ duration: 0.2 }}
                                  className="flex-1 overflow-hidden"
                                >
                                  <span className="truncate">{item.title}</span>
                                </motion.div>
                              )}
                            </AnimatePresence>

                            {/* 活动指示器 */}
                            {isActive && !sidebarCollapsed && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="ml-auto h-2 w-2 rounded-full bg-orange-500"
                              />
                            )}
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* 底部用户区域 */}
          <div className="border-t border-gray-200/20 p-4 dark:border-gray-700/20">
            {/* 用户信息 */}
            {!sidebarCollapsed && (
              <div className="mb-3 px-2">
                <div className="flex items-center space-x-3">
                  <div className="claude-gradient flex h-8 w-8 items-center justify-center rounded-full">
                    <span className="text-sm font-medium text-white">
                      {user?.username?.charAt(0).toUpperCase() || 'A'}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                      {user?.username || 'Admin'}
                    </p>
                    <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                      {user?.role === 'admin' ? '管理员' : '用户'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 登出按钮 */}
            <button
              onClick={handleLogout}
              className={`focus-ring flex w-full items-center rounded-lg px-2 py-2.5 text-sm font-medium text-red-600 transition-all duration-200 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 ${sidebarCollapsed ? 'justify-center' : ''} `}
              title={sidebarCollapsed ? '登出' : undefined}
            >
              <IconLogout
                className={`h-5 w-5 ${sidebarCollapsed ? '' : 'mr-3'}`}
              />
              {!sidebarCollapsed && <span>登出</span>}
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
