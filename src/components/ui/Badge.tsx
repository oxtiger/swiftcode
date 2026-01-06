import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils';

/**
 * Badge组件的属性接口
 */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** 徽章变体样式 */
  variant?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'error'
    | 'info'
    | 'terminal'
    | 'outline'
    | 'ghost';
  /** 徽章大小 */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /** 是否显示点指示器 */
  dot?: boolean;
  /** 点的位置 */
  dotPosition?: 'left' | 'right';
  /** 是否可关闭 */
  closable?: boolean;
  /** 关闭事件处理器 */
  onClose?: () => void;
  /** 左侧图标 */
  icon?: React.ReactNode;
  /** 右侧图标 */
  iconRight?: React.ReactNode;
  /** 是否有动画效果 */
  animated?: boolean;
  /** 是否可点击 */
  clickable?: boolean;
  /** 点击事件处理器 */
  onClick?: () => void;
  /** 徽章内容 */
  children: React.ReactNode;
}

/**
 * Badge - 状态标签组件
 *
 * 用于显示状态、标签、计数等信息
 * 完全匹配Claude Code设计美学
 *
 * @example
 * ```tsx
 * <Badge variant="success" size="md" dot>
 *   在线
 * </Badge>
 * ```
 */
const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = 'default',
      size = 'md',
      dot = false,
      dotPosition = 'left',
      closable = false,
      onClose,
      icon,
      iconRight,
      animated = false,
      clickable = false,
      onClick,
      children,
      className,
      ...props
    },
    _ref
  ) => {
    const baseClasses = [
      'inline-flex items-center justify-center font-medium transition-all duration-200',
      'rounded-full whitespace-nowrap',
      clickable && 'cursor-pointer hover:scale-105 active:scale-95',
      animated && 'animate-pulse',
    ];

    const variantClasses = {
      default: [
        'bg-gray-100 text-gray-800 border border-gray-200',
        'dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700',
        clickable && 'hover:bg-gray-200 dark:hover:bg-gray-700',
      ],
      primary: [
        'bg-primary-100 text-primary-800 border border-primary-200',
        'dark:bg-primary-900 dark:text-primary-200 dark:border-primary-700',
        clickable && 'hover:bg-primary-200 dark:hover:bg-primary-800',
      ],
      secondary: [
        'bg-secondary-100 text-secondary-800 border border-secondary-200',
        'dark:bg-secondary-900 dark:text-secondary-200 dark:border-secondary-700',
        clickable && 'hover:bg-secondary-200 dark:hover:bg-secondary-800',
      ],
      success: [
        'bg-green-100 text-green-800 border border-green-200',
        'dark:bg-green-900 dark:text-green-200 dark:border-green-700',
        clickable && 'hover:bg-green-200 dark:hover:bg-green-800',
      ],
      warning: [
        'bg-amber-100 text-amber-800 border border-amber-200',
        'dark:bg-amber-900 dark:text-amber-200 dark:border-amber-700',
        clickable && 'hover:bg-amber-200 dark:hover:bg-amber-800',
      ],
      error: [
        'bg-red-100 text-red-800 border border-red-200',
        'dark:bg-red-900 dark:text-red-200 dark:border-red-700',
        clickable && 'hover:bg-red-200 dark:hover:bg-red-800',
      ],
      info: [
        'bg-blue-100 text-blue-800 border border-blue-200',
        'dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700',
        clickable && 'hover:bg-blue-200 dark:hover:bg-blue-800',
      ],
      terminal: [
        'bg-terminal-bg text-terminal-accent border-2 border-terminal-border',
        'font-mono shadow-terminal',
        clickable && 'hover:border-terminal-accent hover:shadow-glow',
      ],
      outline: [
        'bg-transparent text-gray-600 border-2 border-gray-300',
        'dark:text-gray-400 dark:border-gray-600',
        clickable && 'hover:bg-gray-50 dark:hover:bg-gray-800',
      ],
      ghost: [
        'bg-transparent text-gray-600 border-0',
        'dark:text-gray-400',
        clickable && 'hover:bg-gray-100 dark:hover:bg-gray-800',
      ],
    };

    const sizeClasses = {
      xs: 'px-1.5 py-0.5 text-xs gap-1',
      sm: 'px-2 py-1 text-xs gap-1',
      md: 'px-2.5 py-1 text-sm gap-1.5',
      lg: 'px-3 py-1.5 text-sm gap-2',
    };

    const iconSizes = {
      xs: 'w-2.5 h-2.5',
      sm: 'w-3 h-3',
      md: 'w-3.5 h-3.5',
      lg: 'w-4 h-4',
    };

    const dotClasses = {
      default: 'bg-gray-400',
      primary: 'bg-primary-500',
      secondary: 'bg-secondary-500',
      success: 'bg-green-500',
      warning: 'bg-amber-500',
      error: 'bg-red-500',
      info: 'bg-blue-500',
      terminal: 'bg-terminal-accent',
      outline: 'bg-gray-400',
      ghost: 'bg-gray-400',
    };

    const handleClick = () => {
      if (clickable && onClick) {
        onClick();
      }
    };

    const handleClose = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onClose) {
        onClose();
      }
    };

    return (
      <motion.span
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        onClick={handleClick}
        initial={animated ? { scale: 0.8, opacity: 0 } : false}
        animate={animated ? { scale: 1, opacity: 1 } : {}}
        whileHover={clickable ? { scale: 1.05 } : {}}
        whileTap={clickable ? { scale: 0.95 } : {}}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        {...(props as any)}
      >
        {/* 左侧点指示器 */}
        {dot && dotPosition === 'left' && (
          <motion.span
            className={cn('h-1.5 w-1.5 rounded-full', dotClasses[variant])}
            animate={animated ? { scale: [1, 1.2, 1] } : {}}
            transition={{
              duration: 1.5,
              repeat: animated ? Infinity : 0,
              ease: 'easeInOut',
            }}
          />
        )}

        {/* 左侧图标 */}
        {icon && <span className={cn(iconSizes[size])}>{icon}</span>}

        {/* 内容 */}
        <span className="truncate">{children}</span>

        {/* 右侧图标 */}
        {iconRight && <span className={cn(iconSizes[size])}>{iconRight}</span>}

        {/* 右侧点指示器 */}
        {dot && dotPosition === 'right' && (
          <motion.span
            className={cn('h-1.5 w-1.5 rounded-full', dotClasses[variant])}
            animate={animated ? { scale: [1, 1.2, 1] } : {}}
            transition={{
              duration: 1.5,
              repeat: animated ? Infinity : 0,
              ease: 'easeInOut',
            }}
          />
        )}

        {/* 关闭按钮 */}
        {closable && (
          <motion.button
            className={cn(
              'ml-1 rounded-full p-0.5 hover:bg-black/10 dark:hover:bg-white/10',
              'focus:ring-1 focus:ring-gray-400 focus:outline-none',
              iconSizes[size]
            )}
            onClick={handleClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg
              className="h-full w-full"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </motion.button>
        )}
      </motion.span>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };
export default Badge;
