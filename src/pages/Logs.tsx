import React from 'react';

const Logs: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          系统日志
        </h1>
        <p className="text-gray-600 dark:text-gray-400">查看系统运行日志</p>
      </div>

      <div className="glass rounded-lg border border-gray-200/20 p-6 dark:border-gray-700/20">
        <p className="text-gray-500 dark:text-gray-400">
          系统日志页面正在开发中...
        </p>
      </div>
    </div>
  );
};

export default Logs;
