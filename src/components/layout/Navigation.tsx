import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import {
  IconChevronDown,
  IconChevronRight,
  IconDot,
  IconCircle,
} from '@tabler/icons-react';
import { navigationConfig, RouteConfig } from '../../router/routes';
import { usePermissions } from '../../router/guards';

interface NavigationProps {
  className?: string;
  collapsed?: boolean;
  orientation?: 'vertical' | 'horizontal';
  showLabels?: boolean;
}

interface NavigationItemProps {
  item: RouteConfig;
  collapsed?: boolean;
  depth?: number;
  showLabels?: boolean;
}

const NavigationItem: React.FC<NavigationItemProps> = ({
  item,
  collapsed = false,
  depth = 0,
  showLabels = true,
}) => {
  const location = useLocation();
  const { hasPermission } = usePermissions();
  const [isExpanded, setIsExpanded] = useState(false);

  // 检查权限
  if (item.requirePermissions?.length) {
    const hasRequiredPermissions = item.requirePermissions.some((permission) =>
      hasPermission(permission)
    );
    if (!hasRequiredPermissions) {
      return null;
    }
  }

  const isActive = location.pathname === item.path;
  const hasChildren = item.children && item.children.length > 0;
  const Icon = item.icon;

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  const childrenVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: {
      height: 'auto',
      opacity: 1,
      transition: {
        height: { duration: 0.3 },
        opacity: { duration: 0.2, delay: 0.1 },
      },
    },
    exit: {
      height: 0,
      opacity: 0,
      transition: {
        height: { duration: 0.3 },
        opacity: { duration: 0.2 },
      },
    },
  };

  const handleClick = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    }
  };

  const paddingLeft = depth > 0 ? `${depth * 1.5 + 0.5}rem` : undefined;

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="relative"
    >
      {/* 主导航项 */}
      <div className="relative">
        {hasChildren ? (
          <button
            onClick={handleClick}
            className={`group focus-ring flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700/50 dark:hover:text-white'
            } ${collapsed ? 'justify-center px-2' : ''} `}
            style={{ paddingLeft }}
            title={collapsed ? item.title : undefined}
          >
            {/* 图标 */}
            <Icon
              className={`h-5 w-5 transition-colors ${collapsed ? '' : 'mr-3'} ${isActive ? 'text-orange-500' : ''} `}
            />

            {/* 标签 */}
            {!collapsed && showLabels && (
              <span className="flex-1 truncate text-left">{item.title}</span>
            )}

            {/* 展开/折叠图标 */}
            {!collapsed && hasChildren && (
              <motion.div
                animate={{ rotate: isExpanded ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <IconChevronRight className="h-4 w-4" />
              </motion.div>
            )}
          </button>
        ) : (
          <Link
            to={item.path}
            className={`group focus-ring flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'border-r-2 border-orange-500 bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700/50 dark:hover:text-white'
            } ${collapsed ? 'justify-center px-2' : ''} `}
            style={{ paddingLeft }}
            title={collapsed ? item.title : undefined}
          >
            {/* 深度指示器 */}
            {depth > 0 && !collapsed && (
              <div className="mr-2 flex items-center">
                {depth > 1 && (
                  <div className="w-4 border-t border-gray-300 dark:border-gray-600" />
                )}
                <IconDot className="h-3 w-3 text-gray-400" />
              </div>
            )}

            {/* 图标 */}
            <Icon
              className={`h-5 w-5 transition-colors ${collapsed ? '' : depth > 0 ? 'mr-2' : 'mr-3'} ${isActive ? 'text-orange-500' : ''} `}
            />

            {/* 标签 */}
            {!collapsed && showLabels && (
              <span className="flex-1 truncate">{item.title}</span>
            )}

            {/* 活动指示器 */}
            {isActive && !collapsed && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="ml-auto h-2 w-2 rounded-full bg-orange-500"
              />
            )}
          </Link>
        )}

        {/* 工具提示 (仅在折叠时显示) */}
        {collapsed && (
          <div className="pointer-events-none absolute top-1/2 left-full z-50 ml-2 -translate-y-1/2 rounded bg-gray-900 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100 dark:bg-gray-700">
            {item.title}
            {item.description && (
              <div className="mt-1 text-xs text-gray-300">
                {item.description}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 子导航项 */}
      <AnimatePresence>
        {hasChildren && isExpanded && !collapsed && (
          <motion.div
            variants={childrenVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="mt-1 ml-6 space-y-1 overflow-hidden"
          >
            {item.children?.map((child) => (
              <NavigationItem
                key={child.path}
                item={child}
                collapsed={collapsed}
                depth={depth + 1}
                showLabels={showLabels}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const Navigation: React.FC<NavigationProps> = ({
  className = '',
  collapsed = false,
  orientation = 'vertical',
  showLabels = true,
}) => {
  const { hasPermission } = usePermissions();

  // 过滤有权限的导航配置
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

  if (orientation === 'horizontal') {
    return (
      <nav className={`flex items-center space-x-1 ${className}`}>
        {filteredNavConfig.map((section) =>
          section.items.map((item) => (
            <NavigationItem
              key={item.path}
              item={item}
              collapsed={false}
              showLabels={showLabels}
            />
          ))
        )}
      </nav>
    );
  }

  return (
    <nav className={`space-y-6 ${className}`}>
      {filteredNavConfig.map((section) => (
        <div key={section.title} className="space-y-1">
          {/* 分组标题 */}
          {!collapsed && (
            <h3 className="px-3 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
              {section.title}
            </h3>
          )}

          {/* 分组项目 */}
          <div className="space-y-1">
            {section.items.map((item) => (
              <NavigationItem
                key={item.path}
                item={item}
                collapsed={collapsed}
                showLabels={showLabels}
              />
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
};

export default Navigation;
