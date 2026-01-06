import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils';

/**
 * Terminal组件的属性接口
 */
export interface TerminalProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 终端标题 */
  title?: string;
  /** 终端变体样式 */
  variant?: 'default' | 'green' | 'amber' | 'blue';
  /** 是否显示头部 */
  showHeader?: boolean;
  /** 是否显示控制按钮 */
  showControls?: boolean;
  /** 终端行数据 */
  lines?: TerminalLine[];
  /** 当前输入的命令 */
  currentCommand?: string;
  /** 是否显示光标 */
  showCursor?: boolean;
  /** 光标样式 */
  cursorStyle?: 'block' | 'line' | 'underline';
  /** 是否只读模式 */
  readonly?: boolean;
  /** 命令提示符 */
  prompt?: string;
  /** 字体大小 */
  fontSize?: 'xs' | 'sm' | 'md' | 'lg';
  /** 内容 */
  children?: React.ReactNode;
}

/**
 * Terminal行数据接口
 */
export interface TerminalLine {
  /** 行ID */
  id: string;
  /** 行类型 */
  type: 'command' | 'output' | 'error' | 'info';
  /** 行内容 */
  content: string;
  /** 时间戳 */
  timestamp?: Date;
  /** 自定义样式 */
  className?: string;
}

/**
 * Terminal - 仿终端界面组件
 *
 * 提供类似终端的用户界面，支持多种样式和交互
 * 完全匹配Claude Code终端美学
 *
 * @example
 * ```tsx
 * <Terminal
 *   title="Claude Terminal"
 *   variant="green"
 *   lines={terminalLines}
 *   showCursor
 * />
 * ```
 */
const Terminal = React.forwardRef<HTMLDivElement, TerminalProps>(
  (
    {
      title = 'Terminal',
      variant = 'default',
      showHeader = true,
      showControls = true,
      lines = [],
      currentCommand = '',
      showCursor = true,
      cursorStyle = 'block',
      readonly = false,
      prompt = '$',
      fontSize = 'sm',
      children,
      className,
      ...props
    },
    _ref
  ) => {
    const [isMinimized, setIsMinimized] = useState(false);
    const [cursorVisible, setCursorVisible] = useState(true);
    const contentRef = useRef<HTMLDivElement>(null);

    // 光标闪烁效果
    useEffect(() => {
      if (!showCursor) return;

      const interval = setInterval(() => {
        setCursorVisible((prev) => !prev);
      }, 530);

      return () => clearInterval(interval);
    }, [showCursor]);

    // 自动滚动到底部
    useEffect(() => {
      if (contentRef.current) {
        contentRef.current.scrollTop = contentRef.current.scrollHeight;
      }
    }, [lines, currentCommand]);

    const variantClasses = {
      default: {
        bg: 'bg-terminal-bg',
        border: 'border-terminal-border',
        text: 'text-terminal-text',
        accent: 'text-terminal-accent',
        shadow: 'shadow-terminal',
      },
      green: {
        bg: 'bg-gray-900',
        border: 'border-green-500/30',
        text: 'text-green-100',
        accent: 'text-green-400',
        shadow: 'shadow-green-500/20',
      },
      amber: {
        bg: 'bg-gray-900',
        border: 'border-amber-500/30',
        text: 'text-amber-100',
        accent: 'text-amber-400',
        shadow: 'shadow-amber-500/20',
      },
      blue: {
        bg: 'bg-gray-900',
        border: 'border-blue-500/30',
        text: 'text-blue-100',
        accent: 'text-blue-400',
        shadow: 'shadow-blue-500/20',
      },
    };

    const fontSizeClasses = {
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    };

    const cursorClasses = {
      block: 'bg-current',
      line: 'border-l-2 border-current w-0',
      underline: 'border-b-2 border-current bg-transparent',
    };

    const getLineTypeClasses = (type: TerminalLine['type']) => {
      switch (type) {
        case 'command':
          return cn('flex items-center', variantClasses[variant].text);
        case 'output':
          return 'text-gray-300';
        case 'error':
          return 'text-red-400';
        case 'info':
          return 'text-blue-400';
        default:
          return variantClasses[variant].text;
      }
    };

    return (
      <motion.div
        className={cn(
          'relative overflow-hidden rounded-lg border-2 font-mono',
          variantClasses[variant].bg,
          variantClasses[variant].border,
          variantClasses[variant].shadow,
          'shadow-2xl',
          className
        )}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        {...(props as any)}
      >
        {/* Terminal Header */}
        {showHeader && (
          <div className="flex items-center justify-between border-b border-gray-700 bg-gray-800 px-4 py-2">
            <div className="flex items-center space-x-2">
              {showControls && (
                <div className="flex items-center space-x-2">
                  <button
                    className="h-3 w-3 rounded-full bg-red-500 transition-colors hover:bg-red-400"
                    title="关闭"
                  />
                  <button
                    className="h-3 w-3 rounded-full bg-yellow-500 transition-colors hover:bg-yellow-400"
                    onClick={() => setIsMinimized(!isMinimized)}
                    title="最小化"
                  />
                  <button
                    className="h-3 w-3 rounded-full bg-green-500 transition-colors hover:bg-green-400"
                    title="最大化"
                  />
                </div>
              )}
              <span className="ml-2 text-sm font-medium text-gray-300">
                {title}
              </span>
            </div>
            <div className="text-xs text-gray-400">
              {new Date().toLocaleTimeString()}
            </div>
          </div>
        )}

        {/* Terminal Content */}
        <AnimatePresence>
          {!isMinimized && (
            <motion.div
              ref={contentRef}
              className={cn(
                'scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent h-64 overflow-y-auto p-4',
                fontSizeClasses[fontSize],
                variantClasses[variant].text
              )}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              {/* 历史行 */}
              {lines.map((line, index) => (
                <motion.div
                  key={line.id}
                  className={cn(
                    'mb-1 leading-relaxed',
                    getLineTypeClasses(line.type),
                    line.className
                  )}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {line.type === 'command' && (
                    <span
                      className={cn('mr-2', variantClasses[variant].accent)}
                    >
                      {prompt}
                    </span>
                  )}
                  <span className="font-mono">{line.content}</span>
                  {line.timestamp && (
                    <span className="ml-2 text-xs text-gray-500">
                      [{line.timestamp.toLocaleTimeString()}]
                    </span>
                  )}
                </motion.div>
              ))}

              {/* 当前命令行 */}
              {!readonly && (
                <div
                  className={cn(
                    'flex items-center',
                    variantClasses[variant].text
                  )}
                >
                  <span className={cn('mr-2', variantClasses[variant].accent)}>
                    {prompt}
                  </span>
                  <span className="font-mono">{currentCommand}</span>
                  {showCursor && (
                    <motion.span
                      className={cn(
                        'ml-1 inline-block h-5 w-2',
                        cursorClasses[cursorStyle],
                        variantClasses[variant].accent
                      )}
                      animate={{ opacity: cursorVisible ? 1 : 0 }}
                      transition={{ duration: 0 }}
                    />
                  )}
                </div>
              )}

              {/* 自定义内容 */}
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }
);

Terminal.displayName = 'Terminal';

export { Terminal };
export default Terminal;
