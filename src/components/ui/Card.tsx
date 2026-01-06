import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils';

/**
 * Card组件的属性接口
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 卡片变体样式 */
  variant?: 'default' | 'glass' | 'terminal' | 'elevated' | 'bordered';
  /** 卡片大小 */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** 是否可悬停 */
  hoverable?: boolean;
  /** 是否可点击 */
  clickable?: boolean;
  /** 点击事件处理器 */
  onCardClick?: () => void;
  /** 卡片内容 */
  children: React.ReactNode;
}

/**
 * CardHeader组件的属性接口
 */
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 标题 */
  title?: string;
  /** 副标题 */
  subtitle?: string;
  /** 右侧操作按钮 */
  action?: React.ReactNode;
  /** 图标 */
  icon?: React.ReactNode;
  /** 头部内容 */
  children?: React.ReactNode;
}

/**
 * CardContent组件的属性接口
 */
export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 内容 */
  children: React.ReactNode;
}

/**
 * CardFooter组件的属性接口
 */
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 底部内容 */
  children: React.ReactNode;
}

/**
 * Card - 增强版卡片组件
 *
 * 支持多种变体样式、玻璃态效果、终端风格
 * 完全匹配Claude Code设计美学
 *
 * @example
 * ```tsx
 * <Card variant="glass" hoverable>
 *   <CardHeader title="标题" subtitle="副标题" />
 *   <CardContent>
 *     内容
 *   </CardContent>
 * </Card>
 * ```
 */
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      size = 'md',
      hoverable = false,
      clickable = false,
      onCardClick,
      children,
      className,
      ...props
    },
    _ref
  ) => {
    const baseClasses = [
      'relative overflow-hidden transition-all duration-300 ease-out',
      clickable && 'cursor-pointer select-none',
      (hoverable || clickable) && 'transform-gpu',
    ];

    const variantClasses = {
      default: [
        'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
        'shadow-soft rounded-xl',
        hoverable && 'hover:shadow-medium hover:-translate-y-1',
        clickable && 'active:scale-[0.98]',
      ],
      glass: [
        'backdrop-blur-xl bg-white/70 dark:bg-gray-900/70',
        'border border-white/20 dark:border-gray-700/50 rounded-xl',
        'shadow-xl shadow-black/5 dark:shadow-black/20',
        hoverable &&
          'hover:bg-white/80 dark:hover:bg-gray-900/80 hover:shadow-2xl hover:-translate-y-1',
        clickable && 'active:scale-[0.98]',
      ],
      terminal: [
        'bg-terminal-bg border-2 border-terminal-border rounded-lg',
        'shadow-terminal font-mono',
        'before:absolute before:inset-0 before:bg-gradient-to-br before:from-terminal-accent/5 before:to-transparent',
        hoverable &&
          'hover:border-terminal-accent hover:shadow-glow hover:-translate-y-0.5',
        clickable && 'active:scale-[0.98]',
      ],
      elevated: [
        'bg-white dark:bg-gray-800 rounded-xl',
        'shadow-strong border border-gray-100 dark:border-gray-700',
        hoverable && 'hover:shadow-2xl hover:-translate-y-2',
        clickable && 'active:scale-[0.98]',
      ],
      bordered: [
        'bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600',
        'rounded-xl shadow-soft',
        hoverable &&
          'hover:border-primary-500 hover:shadow-medium hover:-translate-y-0.5',
        clickable && 'active:scale-[0.98]',
      ],
    };

    const sizeClasses = {
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
      xl: 'p-10',
    };

    const handleClick = () => {
      if (clickable && onCardClick) {
        onCardClick();
      }
    };

    return (
      <motion.div
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        onClick={handleClick}
        initial={false}
        whileHover={
          hoverable || clickable
            ? {
                scale: 1.02,
                transition: { type: 'spring', stiffness: 400, damping: 17 },
              }
            : undefined
        }
        whileTap={
          clickable
            ? {
                scale: 0.98,
                transition: { type: 'spring', stiffness: 400, damping: 17 },
              }
            : undefined
        }
        {...(props as any)}
      >
        {children}
      </motion.div>
    );
  }
);

/**
 * CardHeader - 卡片头部组件
 */
const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ title, subtitle, action, icon, children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'mb-4 flex items-start justify-between border-b border-gray-200 pb-4 dark:border-gray-700',
          className
        )}
        {...props}
      >
        <div className="flex items-start space-x-3">
          {icon && (
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center">
              {icon}
            </div>
          )}
          <div className="min-w-0 flex-1">
            {title && (
              <h3 className="truncate text-lg font-semibold text-gray-900 dark:text-gray-100">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {subtitle}
              </p>
            )}
            {children}
          </div>
        </div>
        {action && <div className="ml-4 flex-shrink-0">{action}</div>}
      </div>
    );
  }
);

/**
 * CardContent - 卡片内容组件
 */
const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('text-gray-700 dark:text-gray-300', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

/**
 * CardFooter - 卡片底部组件
 */
const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'mt-4 flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

// 设置显示名称
Card.displayName = 'Card';
CardHeader.displayName = 'CardHeader';
CardContent.displayName = 'CardContent';
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardContent, CardFooter };
export default Card;
