import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IconMenu2,
  IconSearch,
  IconBell,
  IconSun,
  IconMoon,
  IconUser,
  IconSettings,
  IconLogout,
  IconChevronDown,
  IconRefresh,
  IconShield,
} from '@tabler/icons-react';
import { useLayoutStore } from '../../stores/layout';
import { useAuthStore } from '../../stores/auth';
import Breadcrumb from './Breadcrumb';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const {
    sidebarOpen,
    sidebarCollapsed,
    isMobile,
    toggleSidebar,
    isDark,
    toggleTheme,
    notifications,
    markNotificationRead,
    removeNotification,
  } = useLayoutStore();

  const { user, logout } = useAuthStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSearch(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotificationClick = (notification: any) => {
    markNotificationRead(notification.id);
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      default:
        return 'ℹ️';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-green-600 dark:text-green-400';
      case 'warning':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'error':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-blue-600 dark:text-blue-400';
    }
  };

  return (
    <header
      className={`glass sticky top-0 z-30 h-16 border-b border-gray-200/20 dark:border-gray-700/20 ${className} `}
    >
      <div className="flex h-full items-center justify-between px-4 sm:px-6">
        {/* 左侧区域 */}
        <div className="flex items-center space-x-4">
          {/* 移动端菜单按钮 */}
          {isMobile && (
            <button
              onClick={toggleSidebar}
              className="focus-ring flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-300"
            >
              <IconMenu2 className="h-5 w-5" />
            </button>
          )}

          {/* 面包屑导航 */}
          <div className="hidden sm:block">
            <Breadcrumb />
          </div>
        </div>

        {/* 右侧区域 */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* 搜索 */}
          <div ref={searchRef} className="relative">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="focus-ring flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-300"
              title="搜索"
            >
              <IconSearch className="h-5 w-5" />
            </button>

            <AnimatePresence>
              {showSearch && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="glass absolute top-12 right-0 w-80 rounded-lg border border-gray-200/20 p-4 shadow-xl dark:border-gray-700/20"
                >
                  <div className="relative">
                    <IconSearch className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="搜索页面、功能..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 bg-white py-2 pr-4 pl-10 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700"
                      autoFocus
                    />
                  </div>
                  {searchQuery && (
                    <div className="mt-3 space-y-2">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        搜索结果
                      </p>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        暂无匹配结果
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 通知 */}
          <div ref={notificationsRef} className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="focus-ring relative flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-300"
              title="通知"
            >
              <IconBell className="h-5 w-5" />
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white"
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </motion.span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="glass absolute top-12 right-0 w-80 rounded-lg border border-gray-200/20 shadow-xl dark:border-gray-700/20"
                >
                  <div className="border-b border-gray-200/20 p-4 dark:border-gray-700/20">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        通知
                      </h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {unreadCount} 条未读
                      </span>
                    </div>
                  </div>

                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length > 0 ? (
                      <div className="space-y-1 p-2">
                        {notifications.slice(0, 10).map((notification) => (
                          <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`cursor-pointer rounded-lg p-3 transition-colors ${
                              notification.read
                                ? 'bg-gray-50 dark:bg-gray-700/50'
                                : 'border border-blue-200 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20'
                            } hover:bg-gray-100 dark:hover:bg-gray-600/50`}
                            onClick={() =>
                              handleNotificationClick(notification)
                            }
                          >
                            <div className="flex items-start space-x-3">
                              <span className="text-lg">
                                {getNotificationIcon(notification.type)}
                              </span>
                              <div className="min-w-0 flex-1">
                                <p
                                  className={`text-sm font-medium ${getNotificationColor(notification.type)}`}
                                >
                                  {notification.title}
                                </p>
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                                  {notification.message}
                                </p>
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                  {new Date(
                                    notification.timestamp
                                  ).toLocaleString()}
                                </p>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeNotification(notification.id);
                                }}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                              >
                                ×
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                        <IconBell className="mx-auto mb-2 h-8 w-8 opacity-50" />
                        <p>暂无通知</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 主题切换 */}
          <button
            onClick={toggleTheme}
            className="focus-ring flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-300"
            title={isDark ? '切换到浅色模式' : '切换到深色模式'}
          >
            {isDark ? (
              <IconSun className="h-5 w-5" />
            ) : (
              <IconMoon className="h-5 w-5" />
            )}
          </button>

          {/* 用户菜单 */}
          <div ref={userMenuRef} className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="focus-ring flex items-center space-x-2 rounded-lg px-3 py-1.5 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <div className="claude-gradient flex h-7 w-7 items-center justify-center rounded-full">
                <span className="text-sm font-medium text-white">
                  {user?.username?.charAt(0).toUpperCase() || 'A'}
                </span>
              </div>
              <span className="hidden text-sm font-medium sm:block">
                {user?.username || 'Admin'}
              </span>
              <IconChevronDown className="h-4 w-4" />
            </button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="glass absolute top-12 right-0 w-56 rounded-lg border border-gray-200/20 py-2 shadow-xl dark:border-gray-700/20"
                >
                  {/* 用户信息 */}
                  <div className="border-b border-gray-200/20 px-4 py-3 dark:border-gray-700/20">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user?.username || 'Admin'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {user?.email || 'admin@example.com'}
                    </p>
                    <div className="mt-1 flex items-center space-x-1">
                      <IconShield className="h-3 w-3 text-green-500" />
                      <span className="text-xs font-medium text-green-600 dark:text-green-400">
                        {user?.role === 'admin' ? '管理员' : '用户'}
                      </span>
                    </div>
                  </div>

                  {/* 菜单项 */}
                  <div className="py-1">
                    <button className="flex w-full items-center px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                      <IconUser className="mr-3 h-4 w-4" />
                      个人资料
                    </button>
                    <button className="flex w-full items-center px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                      <IconSettings className="mr-3 h-4 w-4" />
                      账户设置
                    </button>
                    <button className="flex w-full items-center px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                      <IconRefresh className="mr-3 h-4 w-4" />
                      刷新数据
                    </button>
                  </div>

                  <div className="border-t border-gray-200/20 py-1 dark:border-gray-700/20">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                    >
                      <IconLogout className="mr-3 h-4 w-4" />
                      登出
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
