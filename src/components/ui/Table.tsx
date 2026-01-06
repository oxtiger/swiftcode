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
 * ```tsx\n * <Table\n *   columns={columns}\n *   dataSource={data}\n *   rowKey=\"id\"\n *   selectable\n *   sortable\n *   pagination\n * />\n * ```\n */\nconst Table = <T extends Record<string, any>>(\n  props: TableProps<T>\n): React.ReactElement => {\n  const {\n    columns,\n    dataSource,\n    rowKey = 'id',\n    variant = 'default',\n    size = 'md',\n    showHeader = true,\n    selectable = false,\n    selectedRowKeys = [],\n    onSelectionChange,\n    sortable = false,\n    onSortChange,\n    onRowClick,\n    onRowDoubleClick,\n    rowClassName,\n    emptyText = '暂无数据',\n    loading = false,\n    loadingText = '加载中...',\n    pagination = false,\n    pageSize = 10,\n    currentPage = 1,\n    onPageChange,\n    animated = false,\n    className,\n    tableClassName,\n  } = props;\n\n  const [sortInfo, setSortInfo] = useState<SortInfo | null>(null);\n  const [internalSelectedKeys, setInternalSelectedKeys] = useState<string[]>(selectedRowKeys);\n\n  // 获取行键\n  const getRowKey = (record: T, index: number): string => {\n    if (typeof rowKey === 'function') {\n      return rowKey(record);\n    }\n    return record[rowKey] || index.toString();\n  };\n\n  // 处理排序\n  const handleSort = (column: TableColumn<T>) => {\n    if (!column.sortable) return;\n\n    const field = column.dataIndex || column.key;\n    let newSortInfo: SortInfo | null = null;\n\n    if (sortInfo?.field === field) {\n      // 同一字段：升序 -> 降序 -> 无排序\n      if (sortInfo.direction === 'asc') {\n        newSortInfo = { field, direction: 'desc' };\n      } else {\n        newSortInfo = null;\n      }\n    } else {\n      // 不同字段：直接升序\n      newSortInfo = { field, direction: 'asc' };\n    }\n\n    setSortInfo(newSortInfo);\n    onSortChange?.(newSortInfo);\n  };\n\n  // 排序数据\n  const sortedData = useMemo(() => {\n    if (!sortInfo) return dataSource;\n\n    const column = columns.find(col => (col.dataIndex || col.key) === sortInfo.field);\n    if (!column) return dataSource;\n\n    return [...dataSource].sort((a, b) => {\n      if (column.sortCompare) {\n        const result = column.sortCompare(a, b);\n        return sortInfo.direction === 'desc' ? -result : result;\n      }\n\n      const aValue = a[sortInfo.field];\n      const bValue = b[sortInfo.field];\n\n      if (aValue === bValue) return 0;\n      if (aValue == null) return 1;\n      if (bValue == null) return -1;\n\n      const result = aValue > bValue ? 1 : -1;\n      return sortInfo.direction === 'desc' ? -result : result;\n    });\n  }, [dataSource, sortInfo, columns]);\n\n  // 分页数据\n  const paginatedData = useMemo(() => {\n    if (!pagination) return sortedData;\n    const start = (currentPage - 1) * pageSize;\n    return sortedData.slice(start, start + pageSize);\n  }, [sortedData, pagination, currentPage, pageSize]);\n\n  // 处理行选择\n  const handleRowSelection = (rowKey: string, selected: boolean) => {\n    const newSelectedKeys = selected\n      ? [...internalSelectedKeys, rowKey]\n      : internalSelectedKeys.filter(key => key !== rowKey);\n\n    setInternalSelectedKeys(newSelectedKeys);\n    \n    const selectedRows = dataSource.filter(record => \n      newSelectedKeys.includes(getRowKey(record, 0))\n    );\n    \n    onSelectionChange?.(newSelectedKeys, selectedRows);\n  };\n\n  // 处理全选\n  const handleSelectAll = (selected: boolean) => {\n    const allRowKeys = paginatedData.map((record, index) => getRowKey(record, index));\n    const newSelectedKeys = selected \n      ? [...new Set([...internalSelectedKeys, ...allRowKeys])]\n      : internalSelectedKeys.filter(key => !allRowKeys.includes(key));\n\n    setInternalSelectedKeys(newSelectedKeys);\n    \n    const selectedRows = dataSource.filter(record => \n      newSelectedKeys.includes(getRowKey(record, 0))\n    );\n    \n    onSelectionChange?.(newSelectedKeys, selectedRows);\n  };\n\n  const isAllSelected = paginatedData.length > 0 && \n    paginatedData.every((record, index) => \n      internalSelectedKeys.includes(getRowKey(record, index))\n    );\n  \n  const isIndeterminate = paginatedData.some((record, index) => \n    internalSelectedKeys.includes(getRowKey(record, index))\n  ) && !isAllSelected;\n\n  const variantClasses = {\n    default: {\n      table: 'bg-white dark:bg-gray-800',\n      header: 'bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600',\n      row: 'border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50',\n      cell: 'text-gray-900 dark:text-gray-100',\n    },\n    striped: {\n      table: 'bg-white dark:bg-gray-800',\n      header: 'bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600',\n      row: 'border-b border-gray-200 dark:border-gray-700 even:bg-gray-50 dark:even:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700/50',\n      cell: 'text-gray-900 dark:text-gray-100',\n    },\n    bordered: {\n      table: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',\n      header: 'bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600',\n      row: 'border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50',\n      cell: 'text-gray-900 dark:text-gray-100 border-r border-gray-200 dark:border-gray-700 last:border-r-0',\n    },\n    minimal: {\n      table: 'bg-transparent',\n      header: 'border-b border-gray-200 dark:border-gray-700',\n      row: 'hover:bg-gray-50 dark:hover:bg-gray-800/50',\n      cell: 'text-gray-900 dark:text-gray-100',\n    },\n    terminal: {\n      table: 'bg-terminal-bg border-2 border-terminal-border font-mono',\n      header: 'bg-terminal-bg border-b-2 border-terminal-border text-terminal-accent',\n      row: 'border-b border-terminal-border hover:bg-gray-800/50 text-terminal-text',\n      cell: 'text-terminal-text',\n    },\n  };\n\n  const sizeClasses = {\n    sm: 'px-3 py-2 text-sm',\n    md: 'px-4 py-3 text-sm',\n    lg: 'px-6 py-4 text-base',\n  };\n\n  const renderCell = (column: TableColumn<T>, record: T, index: number) => {\n    const value = column.dataIndex ? record[column.dataIndex] : record[column.key];\n    return column.render ? column.render(value, record, index) : value;\n  };\n\n  const getSortIcon = (column: TableColumn<T>) => {\n    if (!column.sortable) return null;\n\n    const field = column.dataIndex || column.key;\n    const isActive = sortInfo?.field === field;\n    const direction = isActive ? sortInfo.direction : null;\n\n    return (\n      <span className=\"ml-2 inline-flex flex-col\">\n        <svg\n          className={cn(\n            'w-3 h-3 -mb-1',\n            direction === 'asc' ? 'text-primary-500' : 'text-gray-400'\n          )}\n          fill=\"currentColor\"\n          viewBox=\"0 0 20 20\"\n        >\n          <path d=\"M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z\" />\n        </svg>\n        <svg\n          className={cn(\n            'w-3 h-3 rotate-180',\n            direction === 'desc' ? 'text-primary-500' : 'text-gray-400'\n          )}\n          fill=\"currentColor\"\n          viewBox=\"0 0 20 20\"\n        >\n          <path d=\"M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z\" />\n        </svg>\n      </span>\n    );\n  };\n\n  if (loading) {\n    return (\n      <div className={cn('relative overflow-hidden rounded-lg', className)}>\n        <div className=\"flex items-center justify-center py-12\">\n          <div className=\"flex items-center space-x-3\">\n            <div className=\"animate-spin w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full\" />\n            <span className=\"text-gray-500 dark:text-gray-400\">{loadingText}</span>\n          </div>\n        </div>\n      </div>\n    );\n  }\n\n  return (\n    <div className={cn('relative overflow-hidden rounded-lg', className)}>\n      <div className=\"overflow-x-auto\">\n        <table className={cn(\n          'w-full table-auto',\n          variantClasses[variant].table,\n          tableClassName\n        )}>\n          {/* 表头 */}\n          {showHeader && (\n            <thead className={variantClasses[variant].header}>\n              <tr>\n                {selectable && (\n                  <th className={cn('w-12', sizeClasses[size])}>\n                    <input\n                      type=\"checkbox\"\n                      checked={isAllSelected}\n                      ref={(input) => {\n                        if (input) input.indeterminate = isIndeterminate;\n                      }}\n                      onChange={(e) => handleSelectAll(e.target.checked)}\n                      className=\"rounded border-gray-300 text-primary-600 focus:ring-primary-500\"\n                    />\n                  </th>\n                )}\n                {columns.map((column) => (\n                  <th\n                    key={column.key}\n                    className={cn(\n                      sizeClasses[size],\n                      'font-semibold text-left',\n                      column.align === 'center' && 'text-center',\n                      column.align === 'right' && 'text-right',\n                      column.sortable && 'cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-gray-600',\n                      column.headerClassName\n                    )}\n                    style={{ width: column.width }}\n                    onClick={() => handleSort(column)}\n                  >\n                    <div className=\"flex items-center\">\n                      <span>{column.title}</span>\n                      {getSortIcon(column)}\n                    </div>\n                  </th>\n                ))}\n              </tr>\n            </thead>\n          )}\n\n          {/* 表体 */}\n          <tbody>\n            <AnimatePresence>\n              {paginatedData.length === 0 ? (\n                <tr>\n                  <td\n                    colSpan={columns.length + (selectable ? 1 : 0)}\n                    className={cn(\n                      'text-center py-12 text-gray-500 dark:text-gray-400',\n                      sizeClasses[size]\n                    )}\n                  >\n                    {emptyText}\n                  </td>\n                </tr>\n              ) : (\n                paginatedData.map((record, index) => {\n                  const key = getRowKey(record, index);\n                  const isSelected = internalSelectedKeys.includes(key);\n                  const rowClass = typeof rowClassName === 'function' \n                    ? rowClassName(record, index) \n                    : rowClassName;\n\n                  return (\n                    <motion.tr\n                      key={key}\n                      className={cn(\n                        variantClasses[variant].row,\n                        'transition-colors cursor-pointer',\n                        isSelected && 'bg-primary-50 dark:bg-primary-900/20',\n                        rowClass\n                      )}\n                      onClick={() => onRowClick?.(record, index)}\n                      onDoubleClick={() => onRowDoubleClick?.(record, index)}\n                      initial={animated ? { opacity: 0, y: 10 } : false}\n                      animate={animated ? { opacity: 1, y: 0 } : {}}\n                      exit={animated ? { opacity: 0, y: -10 } : {}}\n                      transition={{ duration: 0.2, delay: index * 0.05 }}\n                    >\n                      {selectable && (\n                        <td className={cn(sizeClasses[size], variantClasses[variant].cell)}>\n                          <input\n                            type=\"checkbox\"\n                            checked={isSelected}\n                            onChange={(e) => handleRowSelection(key, e.target.checked)}\n                            className=\"rounded border-gray-300 text-primary-600 focus:ring-primary-500\"\n                            onClick={(e) => e.stopPropagation()}\n                          />\n                        </td>\n                      )}\n                      {columns.map((column) => (\n                        <td\n                          key={column.key}\n                          className={cn(\n                            sizeClasses[size],\n                            variantClasses[variant].cell,\n                            column.align === 'center' && 'text-center',\n                            column.align === 'right' && 'text-right',\n                            column.className\n                          )}\n                        >\n                          {renderCell(column, record, index)}\n                        </td>\n                      ))}\n                    </motion.tr>\n                  );\n                })\n              )}\n            </AnimatePresence>\n          </tbody>\n        </table>\n      </div>\n\n      {/* 分页 */}\n      {pagination && paginatedData.length > 0 && (\n        <div className=\"flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700\">\n          <div className=\"text-sm text-gray-700 dark:text-gray-300\">\n            显示 {((currentPage - 1) * pageSize) + 1} 到 {Math.min(currentPage * pageSize, sortedData.length)} 条，\n            共 {sortedData.length} 条记录\n          </div>\n          <div className=\"flex items-center space-x-2\">\n            <button\n              onClick={() => onPageChange?.(currentPage - 1, pageSize)}\n              disabled={currentPage <= 1}\n              className=\"px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed\"\n            >\n              上一页\n            </button>\n            <span className=\"text-sm text-gray-700 dark:text-gray-300\">\n              第 {currentPage} 页\n            </span>\n            <button\n              onClick={() => onPageChange?.(currentPage + 1, pageSize)}\n              disabled={currentPage * pageSize >= sortedData.length}\n              className=\"px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed\"\n            >\n              下一页\n            </button>\n          </div>\n        </div>\n      )}\n    </div>\n  );\n};\n\nTable.displayName = 'Table';\n\nexport { Table };\nexport default Table;\nexport type { TableProps, TableColumn, SortInfo };