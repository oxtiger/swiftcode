import React from 'react';
import { motion } from 'framer-motion';
import {
  IconDashboard,
  IconChartBar,
  IconUsers,
  IconKey,
} from '@tabler/icons-react';

const Dashboard: React.FC = () => {
  const stats = [
    {
      label: 'API 请求',
      value: '1,234,567',
      change: '+12.5%',
      icon: IconDashboard,
      color: 'blue',
    },
    {
      label: '活跃用户',
      value: '42',
      change: '+3.2%',
      icon: IconUsers,
      color: 'green',
    },
    {
      label: 'API Keys',
      value: '156',
      change: '+5.1%',
      icon: IconKey,
      color: 'purple',
    },
    {
      label: '成功率',
      value: '99.9%',
      change: '+0.1%',
      icon: IconChartBar,
      color: 'orange',
    },
  ];

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          仪表板
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          SwiftCode MAX 系统概览
        </p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-lg border border-gray-200/20 p-6 dark:border-gray-700/20"
            >
              <div className="flex items-center">
                <div
                  className={`rounded-lg p-2 bg-${stat.color}-100 dark:bg-${stat.color}-900/20`}
                >
                  <Icon
                    className={`h-6 w-6 text-${stat.color}-600 dark:text-${stat.color}-400`}
                  />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </p>
                  <p className="terminal-text text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                  {stat.change}
                </span>
                <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">
                  vs 上月
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 主要内容区 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* 左侧内容 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-lg border border-gray-200/20 p-6 dark:border-gray-700/20"
        >
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            系统状态
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Claude API
              </span>
              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/20 dark:text-green-300">
                正常
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Gemini API
              </span>
              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/20 dark:text-green-300">
                正常
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Redis
              </span>
              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/20 dark:text-green-300">
                正常
              </span>
            </div>
          </div>
        </motion.div>

        {/* 右侧内容 */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="glass rounded-lg border border-gray-200/20 p-6 dark:border-gray-700/20"
        >
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            快速操作
          </h3>
          <div className="space-y-3">
            <button className="w-full rounded-lg p-3 text-left transition-colors hover:bg-gray-100 dark:hover:bg-gray-700/50">
              <div className="font-medium text-gray-900 dark:text-white">
                创建 API Key
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                生成新的 API 密钥
              </div>
            </button>
            <button className="w-full rounded-lg p-3 text-left transition-colors hover:bg-gray-100 dark:hover:bg-gray-700/50">
              <div className="font-medium text-gray-900 dark:text-white">
                添加 Claude 账户
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                配置新的 Claude OAuth 账户
              </div>
            </button>
            <button className="w-full rounded-lg p-3 text-left transition-colors hover:bg-gray-100 dark:hover:bg-gray-700/50">
              <div className="font-medium text-gray-900 dark:text-white">
                查看日志
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                检查系统运行日志
              </div>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
