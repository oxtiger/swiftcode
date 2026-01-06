import React from 'react';

const Settings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          系统设置
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          配置系统参数和个人偏好
        </p>
      </div>

      <div className="glass rounded-lg border border-gray-200/20 p-6 dark:border-gray-700/20">
        <p className="text-gray-500 dark:text-gray-400">
          系统设置页面正在开发中...
        </p>
      </div>
    </div>
  );
};

export default Settings;
