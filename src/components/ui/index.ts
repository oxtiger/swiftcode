/**
 * UI组件库统一导出文件
 *
 * 这个文件导出所有UI组件，提供统一的导入入口
 * 完全匹配Claude Code设计美学的组件库
 */

// 基础交互组件
export { Button } from './Button';
export type { ButtonProps } from './Button';

export { Input } from './Input';
export type { InputProps } from './Input';

// 数据展示组件
export { Card, CardHeader, CardContent, CardFooter } from './Card';
export type {
  CardProps,
  CardHeaderProps,
  CardContentProps,
  CardFooterProps,
} from './Card';

export { Table } from './Table';
export type { TableProps, TableColumn, SortInfo } from './Table';

export { Badge } from './Badge';
export type { BadgeProps } from './Badge';

// 反馈组件
export { Loading } from './Loading';
export type { LoadingProps } from './Loading';

export { Modal, ModalHeader, ModalBody, ModalFooter } from './Modal';
export type { ModalProps } from './Modal';

// 加载和骨架屏组件
export { Skeleton, StatsCardSkeleton, OverviewStatsSkeleton, DashboardStatsSkeleton } from './Skeleton';

// 特色组件
export { Terminal } from './Terminal';
export type { TerminalProps, TerminalLine } from './Terminal';

export { TypeWriter } from './TypeWriter';
export type { TypeWriterProps } from './TypeWriter';

// 主题切换组件
export { default as ThemeToggle } from './ThemeToggle';

/**
 * 组件库版本信息
 */
export const UI_VERSION = '1.0.0';

/**
 * 支持的主题列表
 */
export const SUPPORTED_THEMES = ['light', 'dark'] as const;

/**
 * 支持的颜色变体
 */
export const COLOR_VARIANTS = [
  'primary',
  'secondary',
  'success',
  'warning',
  'error',
  'info',
  'terminal',
] as const;

/**
 * 支持的尺寸规格
 */
export const SIZE_VARIANTS = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

/**
 * 组件库配置类型
 */
export interface UIConfig {
  /** 默认主题 */
  defaultTheme?: 'light' | 'dark';
  /** 是否启用动画 */
  enableAnimations?: boolean;
  /** 默认组件尺寸 */
  defaultSize?: 'sm' | 'md' | 'lg';
  /** 是否启用响应式 */
  responsive?: boolean;
}

/**
 * 默认配置
 */
export const DEFAULT_UI_CONFIG: UIConfig = {
  defaultTheme: 'light',
  enableAnimations: true,
  defaultSize: 'md',
  responsive: true,
};

/**
 * 组件库工具函数
 */
export const UIUtils = {
  /**
   * 获取组件版本
   */
  getVersion: () => UI_VERSION,

  /**
   * 检查是否支持指定主题
   */
  isSupportedTheme: (
    theme: string
  ): theme is (typeof SUPPORTED_THEMES)[number] => {
    return SUPPORTED_THEMES.includes(theme as any);
  },

  /**
   * 检查是否支持指定颜色变体
   */
  isSupportedColorVariant: (
    variant: string
  ): variant is (typeof COLOR_VARIANTS)[number] => {
    return COLOR_VARIANTS.includes(variant as any);
  },

  /**
   * 检查是否支持指定尺寸
   */
  isSupportedSize: (size: string): size is (typeof SIZE_VARIANTS)[number] => {
    return SIZE_VARIANTS.includes(size as any);
  },
};

/**
 * 组件库类型定义
 */
export type UITheme = (typeof SUPPORTED_THEMES)[number];
export type UIColorVariant = (typeof COLOR_VARIANTS)[number];
export type UISizeVariant = (typeof SIZE_VARIANTS)[number];

/**
 * 常用Props类型
 */
export interface BaseUIProps {
  /** 自定义类名 */
  className?: string;
  /** 组件ID */
  id?: string;
  /** 是否有动画效果 */
  animated?: boolean;
}

export interface SizeableProps {
  /** 组件尺寸 */
  size?: UISizeVariant;
}

export interface VariantProps {
  /** 组件变体 */
  variant?: UIColorVariant;
}

export interface InteractiveProps {
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否只读 */
  readonly?: boolean;
  /** 加载状态 */
  loading?: boolean;
}

/**
 * 组合Props类型
 */
export interface CommonUIProps
  extends BaseUIProps,
    SizeableProps,
    VariantProps,
    InteractiveProps {}

/**
 * 事件处理器类型
 */
export interface UIEventHandlers {
  onClick?: (event: React.MouseEvent) => void;
  onDoubleClick?: (event: React.MouseEvent) => void;
  onFocus?: (event: React.FocusEvent) => void;
  onBlur?: (event: React.FocusEvent) => void;
  onChange?: (event: React.ChangeEvent) => void;
}

/**
 * 组件导出清单
 * 用于开发时快速查看所有可用组件
 */
export const COMPONENT_REGISTRY = {
  // 基础交互组件
  Button: 'Button - 增强版按钮组件，支持多种变体和状态',
  Input: 'Input - 增强版输入框组件，支持图标、清除、密码切换等功能',

  // 数据展示组件
  Card: 'Card - 卡片组件，支持玻璃态效果和多种样式',
  Table: 'Table - 数据表格组件，支持排序、选择、分页等功能',
  Badge: 'Badge - 状态标签组件，支持多种样式和动画',

  // 反馈组件
  Loading: 'Loading - 加载动画组件，提供多种加载效果',
  Modal: 'Modal - 模态框组件，支持多种动画和样式',

  // 特色组件
  Terminal: 'Terminal - 仿终端界面组件，支持多种终端样式',
  TypeWriter: 'TypeWriter - 打字机效果组件，支持多种动画选项',

  // 工具组件
  ThemeToggle: 'ThemeToggle - 主题切换组件',
} as const;

/**
 * 快速导入别名
 * 为常用组件提供简短的导入别名
 */
export {
  Button as Btn,
  Card as Panel,
  Loading as Spinner,
  Modal as Dialog,
  Badge as Tag,
  Terminal as Term,
  TypeWriter as Typer,
};
