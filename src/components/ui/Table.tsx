import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils';

/**
 * 表格列定义接口
 */
export interface TableColumn<T = any> {
  /** 列键 */
  key: string;
  /** 列标题 */
  title: string;
  /** 数据索引 */
  dataIndex?: string;
  /** 列宽度 */
  width?: string | number;
  /** 是否可排序 */
  sortable?: boolean;
  /** 排序比较函数 */
  sortCompare?: (a: T, b: T) => number;
  /** 自定义渲染函数 */
  render?: (value: any, record: T, index: number) => React.ReactNode;
  /** 列对齐方式 */
  align?: 'left' | 'center' | 'right';
  /** 是否固定列 */
  fixed?: 'left' | 'right';
  /** 列类名 */
  className?: string;
  /** 表头类名 */
  headerClassName?: string;
}

/**
 * 排序信息接口
 */
export interface SortInfo {
  /** 排序字段 */
  field: string;
  /** 排序方向 */
  direction: 'asc' | 'desc';
}

/**
 * Table组件的属性接口
 */
export interface TableProps<T = any> {
  /** 表格列定义 */
  columns: TableColumn<T>[];
  /** 表格数据源 */
  dataSource: T[];
  /** 数据行唯一键 */
  rowKey?: string | ((record: T) => string);
  /** 表格变体样式 */
  variant?: 'default' | 'striped' | 'bordered' | 'minimal' | 'terminal';
  /** 表格大小 */
  size?: 'sm' | 'md' | 'lg';
  /** 是否显示表头 */
  showHeader?: boolean;
  /** 是否可选择行 */
  selectable?: boolean;
  /** 选中的行键 */
  selectedRowKeys?: string[];
  /** 行选择变化回调 */
  onSelectionChange?: (selectedRowKeys: string[], selectedRows: T[]) => void;
  /** 是否支持排序 */
  sortable?: boolean;
  /** 排序变化回调 */
  onSortChange?: (sortInfo: SortInfo | null) => void;
  /** 行点击事件 */
  onRowClick?: (record: T, index: number) => void;
  /** 行双击事件 */
  onRowDoubleClick?: (record: T, index: number) => void;
  /** 自定义行类名 */
  rowClassName?: string | ((record: T, index: number) => string);
  /** 空数据时显示的内容 */
  emptyText?: React.ReactNode;
  /** 是否显示加载状态 */
  loading?: boolean;
  /** 加载文本 */
  loadingText?: string;
  /** 是否分页 */
  pagination?: boolean;
  /** 每页显示条数 */
  pageSize?: number;
  /** 当前页码 */
  currentPage?: number;
  /** 分页变化回调 */
  onPageChange?: (page: number, pageSize: number) => void;
  /** 是否有动画效果 */
  animated?: boolean;
  /** 表格容器类名 */
  className?: string;
  /** 表格类名 */
  tableClassName?: string;
}

/**
 * Table - 数据表格组件
 *
 * 功能完整的数据表格，支持排序、选择、分页等功能
 * 完全匹配Claude Code设计美学
 *
 * @example
 * ```tsx
 * <Table
 *   columns={columns}
 *   dataSource={data}
 *   rowKey="id"
 *   selectable
 *   sortable
 *   pagination
 * />
 * ```
 */
const Table = <T extends Record<string, any>>(
  props: TableProps<T>
): React.ReactElement => {
  const {
    columns,
    dataSource,
    rowKey = 'id',
    variant = 'default',
    size = 'md',
    showHeader = true,
    selectable = false,
    selectedRowKeys = [],
    onSelectionChange,
    onSortChange,
    onRowClick,
    onRowDoubleClick,
    rowClassName,
    emptyText = '暂无数据',
    loading = false,
    loadingText = '加载中...',
    pagination = false,
    pageSize = 10,
    currentPage = 1,
    onPageChange,
    animated = false,
    className,
    tableClassName,
  } = props;

  const [sortInfo, setSortInfo] = useState<SortInfo | null>(null);
  const [internalSelectedKeys, setInternalSelectedKeys] = useState<string[]>(selectedRowKeys);

  // 获取行键
  const getRowKey = (record: T, index: number): string => {
    if (typeof rowKey === 'function') {
      return rowKey(record);
    }
    return record[rowKey] || index.toString();
  };

  // 处理排序
  const handleSort = (column: TableColumn<T>) => {
    if (!column.sortable) return;

    const field = column.dataIndex || column.key;
    let newSortInfo: SortInfo | null = null;

    if (sortInfo?.field === field) {
      // 同一字段：升序 -> 降序 -> 无排序
      if (sortInfo.direction === 'asc') {
        newSortInfo = { field, direction: 'desc' };
      } else {
        newSortInfo = null;
      }
    } else {
      // 不同字段：直接升序
      newSortInfo = { field, direction: 'asc' };
    }

    setSortInfo(newSortInfo);
    onSortChange?.(newSortInfo);
  };

  // 排序数据
  const sortedData = useMemo(() => {
    if (!sortInfo) return dataSource;

    const column = columns.find(col => (col.dataIndex || col.key) === sortInfo.field);
    if (!column) return dataSource;

    return [...dataSource].sort((a, b) => {
      if (column.sortCompare) {
        const result = column.sortCompare(a, b);
        return sortInfo.direction === 'desc' ? -result : result;
      }

      const aValue = a[sortInfo.field];
      const bValue = b[sortInfo.field];

      if (aValue === bValue) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      const result = aValue > bValue ? 1 : -1;
      return sortInfo.direction === 'desc' ? -result : result;
    });
  }, [dataSource, sortInfo, columns]);

  // 分页数据
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, pagination, currentPage, pageSize]);

  // 处理行选择
  const handleRowSelection = (rowKey: string, selected: boolean) => {
    const newSelectedKeys = selected
      ? [...internalSelectedKeys, rowKey]
      : internalSelectedKeys.filter(key => key !== rowKey);

    setInternalSelectedKeys(newSelectedKeys);
    
    const selectedRows = dataSource.filter(record => 
      newSelectedKeys.includes(getRowKey(record, 0))
    );
    
    onSelectionChange?.(newSelectedKeys, selectedRows);
  };

  // 处理全选
  const handleSelectAll = (selected: boolean) => {
    const allRowKeys = paginatedData.map((record, index) => getRowKey(record, index));
    const newSelectedKeys = selected 
      ? [...new Set([...internalSelectedKeys, ...allRowKeys])]
      : internalSelectedKeys.filter(key => !allRowKeys.includes(key));

    setInternalSelectedKeys(newSelectedKeys);
    
    const selectedRows = dataSource.filter(record => 
      newSelectedKeys.includes(getRowKey(record, 0))
    );
    
    onSelectionChange?.(newSelectedKeys, selectedRows);
  };

  const isAllSelected = paginatedData.length > 0 && 
    paginatedData.every((record, index) => 
      internalSelectedKeys.includes(getRowKey(record, index))
    );
  
  const isIndeterminate = paginatedData.some((record, index) => 
    internalSelectedKeys.includes(getRowKey(record, index))
  ) && !isAllSelected;

  const variantClasses = {
    default: {
      table: 'bg-white dark:bg-gray-800',
      header: 'bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600',
      row: 'border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50',
      cell: 'text-gray-900 dark:text-gray-100',
    },
    striped: {
      table: 'bg-white dark:bg-gray-800',
      header: 'bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600',
      row: 'border-b border-gray-200 dark:border-gray-700 even:bg-gray-50 dark:even:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700/50',
      cell: 'text-gray-900 dark:text-gray-100',
    },
    bordered: {
      table: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
      header: 'bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600',
      row: 'border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50',
      cell: 'text-gray-900 dark:text-gray-100 border-r border-gray-200 dark:border-gray-700 last:border-r-0',
    },
    minimal: {
      table: 'bg-transparent',
      header: 'border-b border-gray-200 dark:border-gray-700',
      row: 'hover:bg-gray-50 dark:hover:bg-gray-800/50',
      cell: 'text-gray-900 dark:text-gray-100',
    },
    terminal: {
      table: 'bg-terminal-bg border-2 border-terminal-border font-mono',
      header: 'bg-terminal-bg border-b-2 border-terminal-border text-terminal-accent',
      row: 'border-b border-terminal-border hover:bg-gray-800/50 text-terminal-text',
      cell: 'text-terminal-text',
    },
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-sm',
    lg: 'px-6 py-4 text-base',
  };

  const renderCell = (column: TableColumn<T>, record: T, index: number) => {
    const value = column.dataIndex ? record[column.dataIndex] : record[column.key];
    return column.render ? column.render(value, record, index) : value;
  };

  const getSortIcon = (column: TableColumn<T>) => {
    if (!column.sortable) return null;

    const field = column.dataIndex || column.key;
    const isActive = sortInfo?.field === field;
    const direction = isActive ? sortInfo.direction : null;

    return (
      <span className="ml-2 inline-flex flex-col">
        <svg
          className={cn(
            'w-3 h-3 -mb-1',
            direction === 'asc' ? 'text-primary-500' : 'text-gray-400'
          )}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
        <svg
          className={cn(
            'w-3 h-3 rotate-180',
            direction === 'desc' ? 'text-primary-500' : 'text-gray-400'
          )}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </span>
    );
  };

  if (loading) {
    return (
      <div className={cn('relative overflow-hidden rounded-lg', className)}>
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-3">
            <div className="animate-spin w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full" />
            <span className="text-gray-500 dark:text-gray-400">{loadingText}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('relative overflow-hidden rounded-lg', className)}>
      <div className="overflow-x-auto">
        <table className={cn(
          'w-full table-auto',
          variantClasses[variant].table,
          tableClassName
        )}>
          {/* 表头 */}
          {showHeader && (
            <thead className={variantClasses[variant].header}>
              <tr>
                {selectable && (
                  <th className={cn('w-12', sizeClasses[size])}>
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      ref={(input) => {
                        if (input) input.indeterminate = isIndeterminate;
                      }}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </th>
                )}
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={cn(
                      sizeClasses[size],
                      'font-semibold text-left',
                      column.align === 'center' && 'text-center',
                      column.align === 'right' && 'text-right',
                      column.sortable && 'cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-gray-600',
                      column.headerClassName
                    )}
                    style={{ width: column.width }}
                    onClick={() => handleSort(column)}
                  >
                    <div className="flex items-center">
                      <span>{column.title}</span>
                      {getSortIcon(column)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
          )}

          {/* 表体 */}
          <tbody>
            <AnimatePresence>
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (selectable ? 1 : 0)}
                    className={cn(
                      'text-center py-12 text-gray-500 dark:text-gray-400',
                      sizeClasses[size]
                    )}
                  >
                    {emptyText}
                  </td>
                </tr>
              ) : (
                paginatedData.map((record, index) => {
                  const key = getRowKey(record, index);
                  const isSelected = internalSelectedKeys.includes(key);
                  const rowClass = typeof rowClassName === 'function' 
                    ? rowClassName(record, index) 
                    : rowClassName;

                  return (
                    <motion.tr
                      key={key}
                      className={cn(
                        variantClasses[variant].row,
                        'transition-colors cursor-pointer',
                        isSelected && 'bg-primary-50 dark:bg-primary-900/20',
                        rowClass
                      )}
                      onClick={() => onRowClick?.(record, index)}
                      onDoubleClick={() => onRowDoubleClick?.(record, index)}
                      initial={animated ? { opacity: 0, y: 10 } : false}
                      animate={animated ? { opacity: 1, y: 0 } : {}}
                      exit={animated ? { opacity: 0, y: -10 } : {}}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      {selectable && (
                        <td className={cn(sizeClasses[size], variantClasses[variant].cell)}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => handleRowSelection(key, e.target.checked)}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </td>
                      )}
                      {columns.map((column) => (
                        <td
                          key={column.key}
                          className={cn(
                            sizeClasses[size],
                            variantClasses[variant].cell,
                            column.align === 'center' && 'text-center',
                            column.align === 'right' && 'text-right',
                            column.className
                          )}
                        >
                          {renderCell(column, record, index)}
                        </td>
                      ))}
                    </motion.tr>
                  );
                })
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* 分页 */}
      {pagination && paginatedData.length > 0 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            显示 {((currentPage - 1) * pageSize) + 1} 到 {Math.min(currentPage * pageSize, sortedData.length)} 条，
            共 {sortedData.length} 条记录
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onPageChange?.(currentPage - 1, pageSize)}
              disabled={currentPage <= 1}
              className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              上一页
            </button>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              第 {currentPage} 页
            </span>
            <button
              onClick={() => onPageChange?.(currentPage + 1, pageSize)}
              disabled={currentPage * pageSize >= sortedData.length}
              className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              下一页
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

Table.displayName = 'Table';

export { Table };
export default Table;