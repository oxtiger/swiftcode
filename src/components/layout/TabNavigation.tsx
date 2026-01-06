import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IconX,
  IconChevronLeft,
  IconChevronRight,
  IconPlus,
  IconPin,
  IconPinFilled,
} from '@tabler/icons-react';

export interface Tab {
  id: string;
  label: string;
  content?: React.ReactNode;
  icon?: React.ComponentType<any>;
  closable?: boolean;
  pinned?: boolean;
  badge?: string | number;
  href?: string;
  disabled?: boolean;
  className?: string;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTabId?: string;
  onTabChange?: (tabId: string) => void;
  onTabClose?: (tabId: string) => void;
  onTabAdd?: () => void;
  onTabPin?: (tabId: string) => void;
  className?: string;
  variant?: 'default' | 'pills' | 'underlined' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  scrollable?: boolean;
  showAddButton?: boolean;
  maxTabs?: number;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTabId,
  onTabChange,
  onTabClose,
  onTabAdd,
  onTabPin,
  className = '',
  variant = 'default',
  size = 'md',
  scrollable = true,
  showAddButton = false,
  maxTabs = 10,
}) => {
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(false);
  const [draggedTab, setDraggedTab] = useState<string | null>(null);

  const tabsRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 检查滚动状态
  const checkScrollState = () => {
    if (!scrollContainerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftScroll(scrollLeft > 0);
    setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 1);
  };

  useEffect(() => {
    checkScrollState();
    window.addEventListener('resize', checkScrollState);
    return () => window.removeEventListener('resize', checkScrollState);
  }, [tabs]);

  // 滚动功能
  const scrollTabs = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;

    const scrollAmount = 200;
    const newScrollLeft =
      direction === 'left'
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount;

    scrollContainerRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth',
    });
  };

  // 样式配置
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-2',
    lg: 'text-base px-4 py-3',
  };

  const variantClasses = {
    default: {
      container: 'border-b border-gray-200 dark:border-gray-700',
      tab: 'border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600',
      activeTab: 'border-orange-500 text-orange-600 dark:text-orange-400',
      inactiveTab:
        'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300',
    },
    pills: {
      container: '',
      tab: 'rounded-lg',
      activeTab:
        'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300',
      inactiveTab:
        'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50',
    },
    underlined: {
      container: '',
      tab: 'border-b-2 border-transparent',
      activeTab: 'border-orange-500 text-orange-600 dark:text-orange-400',
      inactiveTab:
        'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600',
    },
    minimal: {
      container: '',
      tab: '',
      activeTab: 'text-orange-600 dark:text-orange-400 font-medium',
      inactiveTab:
        'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300',
    },
  };

  const currentVariant = variantClasses[variant];

  // 拖拽处理
  const handleDragStart = (e: React.DragEvent, tabId: string) => {
    setDraggedTab(tabId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedTab(null);
  };

  const renderTab = (tab: Tab) => {
    const isActive = tab.id === activeTabId;
    const Icon = tab.icon;
    const isDraggedOver = draggedTab === tab.id;

    return (
      <motion.div
        key={tab.id}
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className={`focus-ring group relative flex cursor-pointer items-center space-x-2 whitespace-nowrap transition-all duration-200 select-none ${sizeClasses[size]} ${currentVariant.tab} ${isActive ? currentVariant.activeTab : currentVariant.inactiveTab} ${tab.disabled ? 'cursor-not-allowed opacity-50' : ''} ${tab.pinned ? 'order-first' : ''} ${isDraggedOver ? 'opacity-50' : ''} ${tab.className || ''} `}
        onClick={() => !tab.disabled && onTabChange?.(tab.id)}
        draggable={!tab.pinned && !tab.disabled}
        onDragStart={(e: any) => handleDragStart(e, tab.id)}
        onDragEnd={handleDragEnd}
        title={tab.label}
      >
        {/* 固定指示器 */}
        {tab.pinned && <IconPinFilled className="h-3 w-3 text-gray-400" />}

        {/* 图标 */}
        {Icon && (
          <Icon
            className={`h-4 w-4 ${isActive ? '' : 'transition-transform group-hover:scale-110'}`}
          />
        )}

        {/* 标签文本 */}
        <span className="max-w-32 truncate sm:max-w-none">{tab.label}</span>

        {/* 徽章 */}
        {tab.badge && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-orange-100 px-1.5 py-0.5 text-xs font-medium text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
          >
            {tab.badge}
          </motion.span>
        )}

        {/* 操作按钮容器 */}
        <div className="flex items-center space-x-1 opacity-0 transition-opacity group-hover:opacity-100">
          {/* 固定/取消固定按钮 */}
          {onTabPin && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTabPin(tab.id);
              }}
              className="rounded p-0.5 transition-colors hover:bg-gray-200 dark:hover:bg-gray-600"
              title={tab.pinned ? '取消固定' : '固定标签'}
            >
              {tab.pinned ? (
                <IconPinFilled className="h-3 w-3" />
              ) : (
                <IconPin className="h-3 w-3" />
              )}
            </button>
          )}

          {/* 关闭按钮 */}
          {tab.closable && onTabClose && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTabClose(tab.id);
              }}
              className="rounded p-0.5 transition-colors hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
              title="关闭标签"
            >
              <IconX className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* 活动指示器 */}
        {isActive && variant === 'minimal' && (
          <motion.div
            layoutId="activeTab"
            className="absolute right-0 bottom-0 left-0 h-0.5 bg-orange-500"
          />
        )}
      </motion.div>
    );
  };

  return (
    <div className={`relative ${currentVariant.container} ${className}`}>
      {/* 标签导航容器 */}
      <div className="flex items-center">
        {/* 左滚动按钮 */}
        {scrollable && showLeftScroll && (
          <button
            onClick={() => scrollTabs('left')}
            className="mr-1 flex-shrink-0 rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
            title="向左滚动"
          >
            <IconChevronLeft className="h-4 w-4" />
          </button>
        )}

        {/* 标签滚动容器 */}
        <div
          ref={scrollContainerRef}
          className={`scrollbar-hide flex items-center space-x-1 overflow-x-auto ${scrollable ? 'flex-1' : ''} `}
          onScroll={checkScrollState}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div ref={tabsRef} className="flex items-center space-x-1">
            <AnimatePresence mode="popLayout">
              {tabs.map((tab) => renderTab(tab))}
            </AnimatePresence>
          </div>
        </div>

        {/* 右滚动按钮 */}
        {scrollable && showRightScroll && (
          <button
            onClick={() => scrollTabs('right')}
            className="ml-1 flex-shrink-0 rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
            title="向右滚动"
          >
            <IconChevronRight className="h-4 w-4" />
          </button>
        )}

        {/* 添加标签按钮 */}
        {showAddButton && onTabAdd && tabs.length < maxTabs && (
          <button
            onClick={onTabAdd}
            className="ml-2 flex-shrink-0 rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
            title="添加标签"
          >
            <IconPlus className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default TabNavigation;
