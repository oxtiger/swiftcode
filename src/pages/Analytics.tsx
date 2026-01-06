import React from 'react';

const Analytics: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          数据分析
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          查看使用统计和数据分析
        </p>
      </div>

      <div className="glass rounded-lg border border-gray-200/20 p-6 dark:border-gray-700/20">
        <p className="text-gray-500 dark:text-gray-400">
          数据分析页面正在开发中...
        </p>
      </div>
    </div>
  );
};

export default Analytics;
