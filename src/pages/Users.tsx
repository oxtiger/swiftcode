import React from 'react';

const Users: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          用户管理
        </h1>
        <p className="text-gray-600 dark:text-gray-400">管理用户账户和权限</p>
      </div>

      <div className="glass rounded-lg border border-gray-200/20 p-6 dark:border-gray-700/20">
        <p className="text-gray-500 dark:text-gray-400">
          用户管理页面正在开发中...
        </p>
      </div>
    </div>
  );
};

export default Users;
