import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils';

/**
 * 骨架屏加载组件属性
 */
interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

/**
 * 骨架屏组件 - 用于显示加载状态
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'text',
  width,
  height,
  lines = 1,
}) => {
  const baseClasses = 'bg-stone-200 dark:bg-stone-700 animate-pulse';

  if (variant === 'text' && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, index) => (
          <motion.div
            key={index}
            className={cn(
              baseClasses,
              'h-4 rounded',
              index === lines - 1 && 'w-3/4', // 最后一行短一点
              className
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            style={{ width, height }}
          />
        ))}
      </div>
    );
  }

  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  return (
    <motion.div
      className={cn(
        baseClasses,
        variantClasses[variant],
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ width, height }}
    />
  );
};

/**
 * 统计卡片骨架屏组件
 */
export const StatsCardSkeleton: React.FC = () => {
  return (
    <div className="p-6 border border-stone-200 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Skeleton variant="circular" width={40} height={40} />
          <div>
            <Skeleton width={120} height={16} className="mb-1" />
            <Skeleton width={80} height={12} />
          </div>
        </div>
        <Skeleton width={80} height={32} />
      </div>

      <div className="mb-3">
        <div className="flex justify-between mb-1">
          <Skeleton width={60} height={12} />
          <Skeleton width={40} height={12} />
        </div>
        <Skeleton height={8} className="rounded-full" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center justify-between">
          <Skeleton width={50} height={12} />
          <Skeleton width={60} height={12} />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton width={50} height={12} />
          <Skeleton width={60} height={12} />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton width={50} height={12} />
          <Skeleton width={60} height={12} />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton width={50} height={12} />
          <Skeleton width={60} height={12} />
        </div>
      </div>
    </div>
  );
};

/**
 * 概览统计骨架屏组件
 */
export const OverviewStatsSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {Array.from({ length: 4 }).map((_, index) => (
        <motion.div
          key={index}
          className="p-6 border border-stone-200 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <Skeleton width={100} height={14} className="mb-1" />
              <Skeleton width={80} height={36} />
            </div>
            <Skeleton variant="circular" width={48} height={48} />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Skeleton;