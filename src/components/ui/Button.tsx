import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils';

/**
 * Button组件的属性接口
 * 继承HTML button元素的所有原生属性
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 按钮变体样式 */
  variant?:
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'ghost'
    | 'danger'
    | 'terminal';
  /** 按钮尺寸 */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** 是否显示加载状态 */
  loading?: boolean;
  /** 左侧图标 */
  icon?: React.ReactNode;
  /** 右侧图标 */
  iconRight?: React.ReactNode;
  /** 是否为全宽按钮 */
  fullWidth?: boolean;
  /** 按钮内容 */
  children: React.ReactNode;
}

/**
 * Button - 增强版按钮组件
 *
 * 支持多种变体样式、尺寸、加载状态和图标
 * 完全匹配Claude Code设计美学
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="md" icon={<Icon />} loading={false}>
 *   点击我
 * </Button>
 * ```
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      iconRight,
      fullWidth = false,
      children,
      className,
      disabled,
      ...props
    },
    _ref
  ) => {
    const baseClasses = [
      'relative inline-flex items-center justify-center font-medium transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
      'select-none cursor-pointer border border-transparent',
      fullWidth && 'w-full',
    ];

    const variantClasses = {
      primary: [
        'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-soft',
        'hover:from-primary-600 hover:to-primary-700 hover:shadow-medium',
        'focus:ring-primary-500 active:from-primary-700 active:to-primary-800',
        'dark:from-primary-400 dark:to-primary-500',
        'dark:hover:from-primary-500 dark:hover:to-primary-600',
      ],
      secondary: [
        'bg-gradient-to-r from-secondary-500 to-secondary-600 text-white shadow-soft',
        'hover:from-secondary-600 hover:to-secondary-700 hover:shadow-medium',
        'focus:ring-secondary-500 active:from-secondary-700 active:to-secondary-800',
        'dark:from-secondary-400 dark:to-secondary-500',
        'dark:hover:from-secondary-500 dark:hover:to-secondary-600',
      ],
      outline: [
        'border-2 border-gray-300 bg-white text-gray-700 shadow-soft',
        'hover:bg-gray-50 hover:border-gray-400 hover:shadow-medium',
        'focus:ring-primary-500 focus:border-primary-500',
        'dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600',
        'dark:hover:bg-gray-700 dark:hover:border-gray-500',
      ],
      ghost: [
        'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
        'focus:ring-gray-500 active:bg-gray-200',
        'dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100',
        'dark:active:bg-gray-700',
      ],
      danger: [
        'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-soft',
        'hover:from-red-600 hover:to-red-700 hover:shadow-medium',
        'focus:ring-red-500 active:from-red-700 active:to-red-800',
        'dark:from-red-400 dark:to-red-500',
        'dark:hover:from-red-500 dark:hover:to-red-600',
      ],
      terminal: [
        'bg-terminal-bg border-2 border-terminal-border text-terminal-text shadow-terminal',
        'hover:border-terminal-accent hover:shadow-glow font-mono',
        'focus:ring-terminal-accent focus:border-terminal-accent',
        'active:bg-gray-900 relative overflow-hidden',
        'before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-terminal-accent/10 before:to-transparent',
        'before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-500',
      ],
    };

    const sizeClasses = {
      xs: 'h-6 px-2 text-xs rounded gap-1',
      sm: 'h-8 px-3 text-sm rounded-md gap-1.5',
      md: 'h-10 px-4 text-sm rounded-lg gap-2',
      lg: 'h-12 px-6 text-base rounded-lg gap-2.5',
      xl: 'h-14 px-8 text-lg rounded-xl gap-3',
    };

    const iconSize = {
      xs: 'w-3 h-3',
      sm: 'w-4 h-4',
      md: 'w-4 h-4',
      lg: 'w-5 h-5',
      xl: 'w-6 h-6',
    };

    return (
      <motion.button
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        disabled={disabled || loading}
        whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        {...(props as any)}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className={cn('animate-spin', iconSize[size])}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        )}

        <span className={cn('flex items-center', loading && 'opacity-0')}>
          {icon && <span className={cn(iconSize[size])}>{icon}</span>}
          <span className={cn(icon && 'ml-1', iconRight && 'mr-1')}>
            {children}
          </span>
          {iconRight && <span className={cn(iconSize[size])}>{iconRight}</span>}
        </span>
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
export default Button;
