import React from 'react';
import { motion } from 'framer-motion';
import { IconError404, IconHome, IconArrowLeft } from '@tabler/icons-react';
import { Link, useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-md text-center"
      >
        {/* 404 图标 */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mb-8"
        >
          <div className="claude-gradient-text terminal-text text-8xl font-bold">
            404
          </div>
        </motion.div>

        {/* 错误信息 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
            页面未找到
          </h1>
          <p className="leading-relaxed text-gray-600 dark:text-gray-400">
            抱歉，您访问的页面不存在。可能是链接错误或页面已被移动。
          </p>
        </motion.div>

        {/* 操作按钮 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <button
              onClick={() => navigate(-1)}
              className="focus-ring inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <IconArrowLeft className="mr-2 h-4 w-4" />
              返回上页
            </button>

            <Link
              to="/"
              className="claude-gradient focus-ring inline-flex items-center justify-center rounded-lg border border-transparent px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:opacity-90"
            >
              <IconHome className="mr-2 h-4 w-4" />
              回到首页
            </Link>
          </div>
        </motion.div>

        {/* 装饰性元素 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-xs text-gray-400 dark:text-gray-500"
        >
          SwiftCode MAX
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
