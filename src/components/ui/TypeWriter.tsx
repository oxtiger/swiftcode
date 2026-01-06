import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils';

/**
 * TypeWriter组件的属性接口
 */
export interface TypeWriterProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 要打字的文本内容 */
  text: string | string[];
  /** 打字速度 (毫秒) */
  speed?: number;
  /** 删除速度 (毫秒) */
  deleteSpeed?: number;
  /** 每个文本完成后的停顿时间 (毫秒) */
  pauseTime?: number;
  /** 是否循环播放 */
  loop?: boolean;
  /** 是否显示光标 */
  showCursor?: boolean;
  /** 光标字符 */
  cursor?: string;
  /** 光标样式 */
  cursorStyle?: 'blink' | 'pulse' | 'static';
  /** 是否自动开始 */
  autoStart?: boolean;
  /** 完成回调 */
  onComplete?: () => void;
  /** 每个字符打完的回调 */
  onType?: (char: string, index: number) => void;
  /** 开始打字前的延迟 (毫秒) */
  startDelay?: number;
  /** 文本变体样式 */
  variant?: 'default' | 'terminal' | 'code' | 'elegant';
  /** 字体大小 */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  /** 是否随机速度变化 */
  randomSpeed?: boolean;
  /** 是否保留前一个文本 */
  preservePrevious?: boolean;
}

/**
 * TypeWriter - 打字机效果组件
 *
 * 提供逐字显示动画效果，支持多种样式和交互
 * 完全匹配Claude Code设计美学
 *
 * @example
 * ```tsx
 * <TypeWriter
 *   text={["Hello World!", "Welcome to Claude Code"]}
 *   speed={100}
 *   loop
 *   showCursor
 *   variant="terminal"
 * />
 * ```
 */
const TypeWriter = React.forwardRef<HTMLDivElement, TypeWriterProps>(
  (
    {
      text,
      speed = 100,
      deleteSpeed = 50,
      pauseTime = 1500,
      loop = false,
      showCursor = true,
      cursor = '|',
      cursorStyle = 'blink',
      autoStart = true,
      onComplete,
      onType,
      startDelay = 0,
      variant = 'default',
      size = 'md',
      randomSpeed = false,
      preservePrevious = false,
      className,
      ...props
    },
    ref
  ) => {
    const [displayText, setDisplayText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isWaiting, setIsWaiting] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout>();

    const texts = Array.isArray(text) ? text : [text];
    const currentText = texts[currentIndex] || '';

    useEffect(() => {
      if (!autoStart) return;

      const startTyping = () => {
        if (startDelay > 0) {
          timeoutRef.current = setTimeout(() => {
            typeText();
          }, startDelay);
        } else {
          typeText();
        }
      };

      startTyping();

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, [autoStart, startDelay]);

    const getRandomSpeed = (baseSpeed: number) => {
      if (!randomSpeed) return baseSpeed;
      return baseSpeed + Math.random() * 50 - 25; // ±25ms变化
    };

    const typeText = () => {
      if (isCompleted && !loop) return;

      setIsWaiting(false);

      if (!isDeleting) {
        // 打字模式
        if (displayText.length < currentText.length) {
          const nextChar = currentText[displayText.length];
          setDisplayText((prev) => prev + nextChar);

          if (onType) {
            onType(nextChar, displayText.length);
          }

          timeoutRef.current = setTimeout(typeText, getRandomSpeed(speed));
        } else {
          // 当前文本打完
          if (texts.length > 1) {
            setIsWaiting(true);
            timeoutRef.current = setTimeout(() => {
              setIsDeleting(true);
              typeText();
            }, pauseTime);
          } else {
            // 单个文本完成
            setIsCompleted(true);
            if (onComplete) {
              onComplete();
            }
          }
        }
      } else {
        // 删除模式
        if (displayText.length > 0 && !preservePrevious) {
          setDisplayText((prev) => prev.slice(0, -1));
          timeoutRef.current = setTimeout(
            typeText,
            getRandomSpeed(deleteSpeed)
          );
        } else {
          // 删除完成，切换到下一个文本
          setIsDeleting(false);
          setCurrentIndex((prev) => {
            const next = (prev + 1) % texts.length;
            if (next === 0 && !loop) {
              setIsCompleted(true);
              if (onComplete) {
                onComplete();
              }
              return prev;
            }
            return next;
          });

          if (preservePrevious) {
            setDisplayText((prev) => prev + '\n');
          }

          timeoutRef.current = setTimeout(typeText, 500);
        }
      }
    };

    // 重启动画
    const restart = () => {
      setDisplayText('');
      setCurrentIndex(0);
      setIsDeleting(false);
      setIsWaiting(false);
      setIsCompleted(false);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      typeText();
    };

    const variantClasses = {
      default: 'text-gray-900 dark:text-gray-100',
      terminal: 'font-mono text-terminal-text bg-terminal-bg px-2 py-1 rounded',
      code: 'font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded',
      elegant: 'font-serif text-gray-800 dark:text-gray-200',
    };

    const sizeClasses = {
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
      '4xl': 'text-4xl',
    };

    const cursorAnimationClasses = {
      blink: 'animate-pulse',
      pulse: 'animate-ping',
      static: '',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'relative inline-block',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        <motion.span
          className="inline-block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {preservePrevious
            ? displayText.split('\n').map((line, index) => (
                <div
                  key={index}
                  className={
                    index < displayText.split(' ').length - 1
                      ? 'opacity-70'
                      : ''
                  }
                >
                  {line}
                </div>
              ))
            : displayText}
        </motion.span>

        {/* 光标 */}
        <AnimatePresence>
          {showCursor && !isCompleted && (
            <motion.span
              className={cn(
                'ml-0.5 inline-block',
                cursorAnimationClasses[cursorStyle],
                variantClasses[variant]
              )}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: cursorStyle === 'blink' ? 0.5 : 0.3,
                repeat: cursorStyle === 'blink' ? Infinity : 0,
                repeatType: 'reverse',
              }}
            >
              {cursor}
            </motion.span>
          )}
        </AnimatePresence>

        {/* 等待指示器 */}
        {isWaiting && (
          <motion.span
            className="ml-2 inline-block text-gray-400"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            ...
          </motion.span>
        )}

        {/* 重播按钮 */}
        {isCompleted && loop && (
          <motion.button
            className="ml-2 text-xs text-gray-500 underline hover:text-gray-700 dark:hover:text-gray-300"
            onClick={restart}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            重播
          </motion.button>
        )}
      </div>
    );
  }
);

TypeWriter.displayName = 'TypeWriter';

export { TypeWriter };
export default TypeWriter;
