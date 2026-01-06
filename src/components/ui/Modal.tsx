import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils';

/**
 * Modal组件的属性接口
 */
export interface ModalProps {
  /** 是否打开模态框 */
  open: boolean;
  /** 关闭模态框的回调 */
  onClose: () => void;
  /** 模态框标题 */
  title?: string;
  /** 模态框大小 */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  /** 是否显示关闭按钮 */
  showCloseButton?: boolean;
  /** 是否点击遮罩层关闭 */
  closeOnOverlayClick?: boolean;
  /** 是否按ESC键关闭 */
  closeOnEscape?: boolean;
  /** 模态框变体样式 */
  variant?: 'default' | 'glass' | 'terminal' | 'minimal';
  /** 自定义遮罩层透明度 */
  overlayOpacity?: 'light' | 'medium' | 'dark';
  /** 是否居中显示 */
  centered?: boolean;
  /** 动画类型 */
  animation?: 'scale' | 'slide' | 'fade' | 'flip';
  /** 模态框头部内容 */
  header?: React.ReactNode;
  /** 模态框主体内容 */
  children: React.ReactNode;
  /** 模态框底部内容 */
  footer?: React.ReactNode;
  /** 自定义类名 */
  className?: string;
  /** 自定义内容区域类名 */
  contentClassName?: string;
  /** 关闭前的确认回调 */
  onBeforeClose?: () => boolean | Promise<boolean>;
}

/**
 * Modal - 现代化弹窗组件
 * 
 * 提供多种样式和动画效果的模态框
 * 完全匹配Claude Code设计美学
 *
 * @example
 * ```tsx
 * <Modal
 *   open={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="示例模态框"
 *   size="md"
 *   variant="glass"
 * >
 *   <p>这是模态框的内容</p>
 * </Modal>
 * ```
 */
const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  variant = 'glass',
  overlayOpacity = 'medium',
  centered = true,
  animation = 'scale',
  header,
  children,
  footer,
  className,
  contentClassName,
  onBeforeClose,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // 处理ESC键关闭
  useEffect(() => {
    if (!open || !closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, closeOnEscape]);

  // 处理关闭逻辑
  const handleClose = async () => {
    if (onBeforeClose) {
      const canClose = await onBeforeClose();
      if (!canClose) return;
    }
    onClose();
  };

  // 阻止页面滚动
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // 尺寸样式映射
  const sizeClasses = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-none w-full h-full',
  };

  // 变体样式映射
  const variantClasses = {
    default: 'bg-white dark:bg-gray-800 shadow-xl',
    glass: 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-2xl border border-white/20',
    terminal: 'bg-black text-green-400 font-mono border-2 border-green-400/30 shadow-[0_0_30px_rgba(34,197,94,0.3)]',
    minimal: 'bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700',
  };

  // 遮罩层透明度样式
  const overlayClasses = {
    light: 'bg-black/30',
    medium: 'bg-black/50',
    dark: 'bg-black/70',
  };

  // 动画变体配置
  const animationVariants = {
    scale: {
      hidden: {
        opacity: 0,
        scale: 0.8,
        transition: { duration: 0.2 },
      },
      visible: {
        opacity: 1,
        scale: 1,
        transition: {
          type: "spring",
          stiffness: 400,
          damping: 25,
        },
      },
    },
    slide: {
      hidden: {
        opacity: 0,
        y: -50,
        transition: { duration: 0.2 },
      },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          type: "spring",
          stiffness: 400,
          damping: 25,
        },
      },
    },
    fade: {
      hidden: {
        opacity: 0,
        transition: { duration: 0.2 },
      },
      visible: {
        opacity: 1,
        transition: { duration: 0.3 },
      },
    },
    flip: {
      hidden: {
        opacity: 0,
        rotateX: -90,
        transition: { duration: 0.2 },
      },
      visible: {
        opacity: 1,
        rotateX: 0,
        transition: {
          type: "spring",
          stiffness: 400,
          damping: 25,
        },
      },
    },
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={cn(
            'fixed inset-0 z-50 flex',
            centered ? 'items-center justify-center p-4' : 'items-start justify-center pt-16 p-4',
            overlayClasses[overlayOpacity]
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={closeOnOverlayClick ? handleClose : undefined}
        >
          <motion.div
            ref={modalRef}
            className={cn(
              'relative w-full max-h-[90vh] rounded-2xl overflow-hidden',
              sizeClasses[size],
              variantClasses[variant],
              size === 'full' && 'h-full',
              className
            )}
            variants={animationVariants[animation]}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 头部 */}
            {(title || header || showCloseButton) && (
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex-1">
                  {header || (
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {title}
                    </h2>
                  )}
                </div>
                
                {showCloseButton && (
                  <button
                    onClick={handleClose}
                    className="ml-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    aria-label="关闭模态框"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            )}

            {/* 主体内容 */}
            <div className={cn(
              'p-6 overflow-y-auto',
              size === 'full' && 'flex-1',
              contentClassName
            )}>
              {children}
            </div>

            {/* 底部 */}
            {footer && (
              <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;