import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { IconChevronRight, IconHome } from '@tabler/icons-react';
import { useLayoutStore } from '../../stores/layout';

interface BreadcrumbProps {
  className?: string;
  separator?: React.ReactNode;
  showHome?: boolean;
  maxItems?: number;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  className = '',
  separator = <IconChevronRight className="h-4 w-4 text-gray-400" />,
  showHome = true,
  maxItems = 5,
}) => {
  const { breadcrumbs } = useLayoutStore();

  // 如果没有面包屑或只有首页，且不显示首页，则不渲染
  if (!breadcrumbs.length || (breadcrumbs.length === 1 && !showHome)) {
    return null;
  }

  // 处理面包屑数量限制
  let displayBreadcrumbs = breadcrumbs;
  if (breadcrumbs.length > maxItems) {
    // 保留前两个和后两个，中间用省略号
    displayBreadcrumbs = [
      ...breadcrumbs.slice(0, 2),
      { label: '...', href: undefined },
      ...breadcrumbs.slice(-2),
    ];
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <nav
      className={`flex items-center space-x-1 text-sm ${className}`}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-1">
        {displayBreadcrumbs.map((crumb, index) => {
          const isLast = index === displayBreadcrumbs.length - 1;
          const isEllipsis = crumb.label === '...';
          const Icon = crumb.icon;

          return (
            <motion.li
              key={`${crumb.href}-${index}`}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.1 }}
              className="flex items-center"
            >
              {/* 分隔符 (除第一个外) */}
              {index > 0 && (
                <span className="mr-1" aria-hidden="true">
                  {separator}
                </span>
              )}

              {/* 面包屑项 */}
              {isEllipsis ? (
                <span className="px-2 py-1 text-gray-500 dark:text-gray-400">
                  {crumb.label}
                </span>
              ) : isLast ? (
                // 当前页面 (不可点击)
                <span
                  className="flex items-center space-x-1.5 px-2 py-1 font-medium text-gray-900 dark:text-white"
                  aria-current="page"
                >
                  {Icon && index === 0 ? (
                    <IconHome className="h-4 w-4" />
                  ) : Icon ? (
                    <Icon className="h-4 w-4" />
                  ) : null}
                  <span className="max-w-32 truncate sm:max-w-none">
                    {crumb.label}
                  </span>
                </span>
              ) : (
                // 可点击的面包屑
                <Link
                  to={crumb.href!}
                  className="focus-ring group flex items-center space-x-1.5 rounded-md px-2 py-1 text-gray-600 transition-all duration-200 hover:bg-gray-100 hover:text-orange-600 dark:text-gray-300 dark:hover:bg-gray-700/50 dark:hover:text-orange-400"
                >
                  {Icon && index === 0 ? (
                    <IconHome className="h-4 w-4 transition-transform group-hover:scale-110" />
                  ) : Icon ? (
                    <Icon className="h-4 w-4 transition-transform group-hover:scale-110" />
                  ) : null}
                  <span className="max-w-32 truncate sm:max-w-none">
                    {crumb.label}
                  </span>
                </Link>
              )}
            </motion.li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
