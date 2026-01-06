import React from 'react';
import { cn } from '@/utils';

/**
 * Input组件的属性接口
 */
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** 标签文本 */
  label?: string;
  /** 错误信息 */
  error?: string;
  /** 提示信息 */
  helperText?: string;
  /** 左侧图标 */
  icon?: React.ReactNode;
  /** 右侧图标 */
  iconRight?: React.ReactNode;
  /** 输入框变体 */
  variant?: 'default' | 'filled' | 'outlined';
  /** 输入框尺寸 */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Input - 增强版输入框组件
 *
 * 支持多种变体样式、图标、错误状态等
 * 完全兼容原生input元素属性
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      icon,
      iconRight,
      variant = 'default',
      size = 'md',
      className,
      ...props
    },
    ref
  ) => {
    const baseClasses = [
      'w-full transition-all duration-200 focus:outline-none',
      'disabled:opacity-50 disabled:cursor-not-allowed',
    ];

    const variantClasses = {
      default: [
        'border border-stone-300 bg-white rounded-lg',
        'focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10',
        'hover:border-stone-400',
        error && 'border-red-500 focus:border-red-500 focus:ring-red-500/10',
      ],
      filled: [
        'border-0 bg-stone-100 rounded-lg',
        'focus:bg-white focus:ring-2 focus:ring-orange-500/10',
        'hover:bg-stone-150',
        error && 'bg-red-50 focus:ring-red-500/10',
      ],
      outlined: [
        'border-2 border-stone-200 bg-transparent rounded-lg',
        'focus:border-orange-500 focus:bg-white',
        'hover:border-stone-300',
        error && 'border-red-500 focus:border-red-500',
      ],
    };

    const sizeClasses = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-3 text-base',
      lg: 'px-5 py-4 text-lg',
    };

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-stone-700 mb-2">
            {label}
          </label>
        )}

        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            className={cn(
              baseClasses,
              variantClasses[variant],
              sizeClasses[size],
              icon && 'pl-10',
              iconRight && 'pr-10',
              className
            )}
            {...props}
          />

          {iconRight && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone-400">
              {iconRight}
            </div>
          )}
        </div>

        {(error || helperText) && (
          <div className="mt-2">
            {error && (
              <p className="text-sm text-red-600 flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {error}
              </p>
            )}
            {!error && helperText && (
              <p className="text-sm text-stone-500">{helperText}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;