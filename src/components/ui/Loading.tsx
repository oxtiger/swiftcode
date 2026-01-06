import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils';

/**
 * Loading组件的属性接口
 */
export interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 加载器类型 */
  type?:
    | 'spinner'
    | 'dots'
    | 'pulse'
    | 'bars'
    | 'wave'
    | 'circle'
    | 'square'
    | 'terminal'
    | 'claude';
  /** 加载器大小 */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** 颜色变体 */
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'terminal';
  /** 加载文本 */
  text?: string;
  /** 文本位置 */
  textPosition?: 'bottom' | 'right' | 'top' | 'left';
  /** 是否显示加载文本 */
  showText?: boolean;
  /** 动画速度 */
  speed?: 'slow' | 'normal' | 'fast';
  /** 是否全屏覆盖 */
  overlay?: boolean;
  /** 覆盖层透明度 */
  overlayOpacity?: 'light' | 'medium' | 'dark';
  /** 是否居中显示 */
  centered?: boolean;
}

/**
 * Loading - 多样化加载动画组件
 *
 * 提供多种加载动画效果，支持全屏覆盖和文本显示
 * 完全匹配Claude Code设计美学
 *
 * @example
 * ```tsx
 * <Loading
 *   type="claude"
 *   size="lg"
 *   variant="primary"
 *   text="加载中..."
 *   overlay
 * />
 * ```
 */
const Loading = React.forwardRef<HTMLDivElement, LoadingProps>(
  (
    {
      type = 'spinner',
      size = 'md',
      variant = 'primary',
      text = '',
      textPosition = 'bottom',
      showText = true,
      speed = 'normal',
      overlay = false,
      overlayOpacity = 'medium',
      centered = false,
      className,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      xs: 'w-4 h-4',
      sm: 'w-6 h-6',
      md: 'w-8 h-8',
      lg: 'w-12 h-12',
      xl: 'w-16 h-16',
    };

    const textSizeClasses = {
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
    };

    const variantClasses = {
      primary: 'text-primary-500',
      secondary: 'text-secondary-500',
      success: 'text-green-500',
      warning: 'text-amber-500',
      error: 'text-red-500',
      info: 'text-blue-500',
      terminal: 'text-terminal-accent',
    };

    const speedClasses = {
      slow: 'duration-2000',
      normal: 'duration-1000',
      fast: 'duration-500',
    };

    const overlayClasses = {
      light: 'bg-white/70 dark:bg-gray-900/70',
      medium: 'bg-white/80 dark:bg-gray-900/80',
      dark: 'bg-white/90 dark:bg-gray-900/90',
    };

    // 旋转动画变体
    const spinnerVariants = {
      animate: {
        rotate: 360,
        transition: {
          duration: speed === 'fast' ? 0.8 : speed === 'slow' ? 2 : 1.2,
          repeat: Infinity,
          ease: 'linear',
        },
      },
    };

    // 点动画变体
    const dotVariants = {
      animate: {
        scale: [1, 1.2, 1],
        opacity: [0.5, 1, 0.5],
        transition: {
          duration: speed === 'fast' ? 0.6 : speed === 'slow' ? 1.4 : 1,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      },
    };

    // 脉冲动画变体
    const pulseVariants = {
      animate: {
        scale: [1, 1.1, 1],
        opacity: [0.7, 1, 0.7],
        transition: {
          duration: speed === 'fast' ? 1 : speed === 'slow' ? 2.5 : 1.8,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      },
    };

    // 波浪动画变体
    const waveVariants = {
      animate: (i: number) => ({
        y: [0, -8, 0],
        transition: {
          duration: speed === 'fast' ? 0.6 : speed === 'slow' ? 1.4 : 1,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: i * 0.1,
        },
      }),
    };

    const renderLoader = () => {
      switch (type) {
        case 'spinner':
          return (
            <motion.div
              className={cn(
                'border-2 border-gray-200 dark:border-gray-700 rounded-full',
                sizeClasses[size],
                variantClasses[variant]
              )}
              style={{
                borderTopColor: 'currentColor',
              }}
              variants={spinnerVariants}
              animate=\"animate\"
            />
          );

        case 'dots':
          return (
            <div className=\"flex space-x-1\">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className={cn(
                    'rounded-full bg-current',
                    size === 'xs' ? 'w-1 h-1' :
                    size === 'sm' ? 'w-1.5 h-1.5' :
                    size === 'md' ? 'w-2 h-2' :
                    size === 'lg' ? 'w-3 h-3' : 'w-4 h-4',
                    variantClasses[variant]
                  )}
                  variants={dotVariants}
                  animate=\"animate\"
                  custom={i}
                  transition={{
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          );

        case 'pulse':
          return (
            <motion.div
              className={cn(
                'rounded-full bg-current',
                sizeClasses[size],
                variantClasses[variant]
              )}
              variants={pulseVariants}
              animate=\"animate\"
            />
          );

        case 'bars':
          return (
            <div className=\"flex items-end space-x-1\">
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className={cn(
                    'bg-current',
                    size === 'xs' ? 'w-0.5' :
                    size === 'sm' ? 'w-1' :
                    size === 'md' ? 'w-1.5' :
                    size === 'lg' ? 'w-2' : 'w-3',
                    variantClasses[variant]
                  )}
                  animate={{
                    height: [
                      size === 'xs' ? 8 : size === 'sm' ? 12 : size === 'md' ? 16 : size === 'lg' ? 24 : 32,
                      size === 'xs' ? 16 : size === 'sm' ? 24 : size === 'md' ? 32 : size === 'lg' ? 48 : 64,
                      size === 'xs' ? 8 : size === 'sm' ? 12 : size === 'md' ? 16 : size === 'lg' ? 24 : 32,
                    ],
                    transition: {
                      duration: speed === 'fast' ? 0.8 : speed === 'slow' ? 1.6 : 1.2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: i * 0.1,
                    },
                  }}
                />
              ))}
            </div>
          );

        case 'wave':
          return (
            <div className=\"flex items-center space-x-1\">
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className={cn(
                    'rounded-full bg-current',
                    size === 'xs' ? 'w-1 h-1' :
                    size === 'sm' ? 'w-1.5 h-1.5' :
                    size === 'md' ? 'w-2 h-2' :
                    size === 'lg' ? 'w-3 h-3' : 'w-4 h-4',
                    variantClasses[variant]
                  )}
                  variants={waveVariants}
                  animate=\"animate\"
                  custom={i}
                />
              ))}
            </div>
          );

        case 'circle':
          return (
            <motion.div
              className={cn(
                'border-2 border-transparent rounded-full',
                sizeClasses[size],
                variantClasses[variant]
              )}
              style={{
                borderTopColor: 'currentColor',
                borderRightColor: 'currentColor',
              }}
              variants={spinnerVariants}
              animate=\"animate\"
            />
          );

        case 'square':
          return (
            <motion.div
              className={cn(
                'bg-current',
                sizeClasses[size],
                variantClasses[variant]
              )}
              animate={{
                rotate: [0, 180, 360],
                borderRadius: ['0%', '50%', '0%'],
              }}
              transition={{
                duration: speed === 'fast' ? 1.2 : speed === 'slow' ? 2.4 : 1.8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          );

        case 'terminal':
          return (
            <div className={cn('font-mono', variantClasses[variant])}>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{
                  duration: speed === 'fast' ? 0.8 : speed === 'slow' ? 1.6 : 1.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                {'>'}
              </motion.span>
              <motion.span
                animate={{ opacity: [0, 1, 1, 0] }}
                transition={{
                  duration: speed === 'fast' ? 1.2 : speed === 'slow' ? 2.4 : 1.8,
                  repeat: Infinity,
                  times: [0, 0.2, 0.8, 1],
                }}
              >
                Loading
              </motion.span>
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{
                  duration: speed === 'fast' ? 0.6 : speed === 'slow' ? 1.2 : 0.9,
                  repeat: Infinity,
                  delay: 0.2,
                }}
              >
                .
              </motion.span>
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{
                  duration: speed === 'fast' ? 0.6 : speed === 'slow' ? 1.2 : 0.9,
                  repeat: Infinity,
                  delay: 0.4,
                }}
              >
                .
              </motion.span>
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{
                  duration: speed === 'fast' ? 0.6 : speed === 'slow' ? 1.2 : 0.9,
                  repeat: Infinity,
                  delay: 0.6,
                }}
              >
                .
              </motion.span>
            </div>
          );

        case 'claude':
          return (
            <div className=\"relative\">
              <motion.div
                className={cn(
                  'border-2 border-gray-200 dark:border-gray-700 rounded-full',
                  sizeClasses[size]
                )}
                style={{
                  borderTopColor: 'transparent',
                  borderRightColor: 'transparent',
                  borderBottomColor: '#f97316',
                  borderLeftColor: '#3b82f6',
                }}
                variants={spinnerVariants}
                animate=\"animate\"
              />
              <motion.div
                className=\"absolute inset-0 flex items-center justify-center\"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <div className={cn(
                  'rounded-full bg-gradient-to-r from-primary-500 to-secondary-500',
                  size === 'xs' ? 'w-1 h-1' :
                  size === 'sm' ? 'w-1.5 h-1.5' :
                  size === 'md' ? 'w-2 h-2' :
                  size === 'lg' ? 'w-3 h-3' : 'w-4 h-4'
                )} />
              </motion.div>
            </div>
          );

        default:
          return null;
      }
    };

    const containerClasses = [
      'flex items-center',
      textPosition === 'bottom' && 'flex-col space-y-2',
      textPosition === 'top' && 'flex-col-reverse space-y-2 space-y-reverse',
      textPosition === 'right' && 'flex-row space-x-3',
      textPosition === 'left' && 'flex-row-reverse space-x-3 space-x-reverse',
      centered && 'justify-center',
    ];

    const content = (
      <div
        ref={ref}
        className={cn(containerClasses, className)}
        {...props}
      >
        {renderLoader()}
        {showText && text && (
          <motion.div
            className={cn(
              'text-gray-600 dark:text-gray-400 font-medium',
              textSizeClasses[size]
            )}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {text}
          </motion.div>
        )}
      </div>
    );

    if (overlay) {
      return (
        <motion.div
          className={cn(
            'fixed inset-0 z-50 flex items-center justify-center',
            overlayClasses[overlayOpacity]
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {content}
        </motion.div>
      );
    }

    return content;
  }
);

Loading.displayName = 'Loading';

export { Loading };
export default Loading;
export type { LoadingProps };