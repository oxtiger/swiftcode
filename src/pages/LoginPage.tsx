import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { Terminal } from '@/components/ui/Terminal';
import { TypeWriter } from '@/components/ui/TypeWriter';

export const LoginPage: React.FC = () => {
  const { login, loading, error, isAuthenticated } = useAuthStore();
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });

  // 如果已经登录，重定向到仪表板
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(credentials);
    } catch (error) {
      // 错误由store处理
    }
  };

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      {/* 主题切换按钮 */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 bg-gradient-to-r from-orange-500/20 to-purple-500/20 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* 登录卡片 */}
        <div className="glass-effect backdrop-blur-lg bg-white/10 dark:bg-black/20 rounded-2xl p-8 shadow-2xl border border-white/20">
          {/* 头部区域 */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 shadow-lg"
            >
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-3xl font-bold text-white mb-2"
            >
              <TypeWriter
                text="SwiftCode MAX"
                speed={50}
                className="text-gradient bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent"
              />
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-gray-400 text-sm"
            >
              控制台 - 请输入您的凭据
            </motion.p>
          </div>

          {/* 登录表单 */}
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                用户名
              </label>
              <Input
                type="text"
                value={credentials.username}
                onChange={handleInputChange('username')}
                placeholder="请输入用户名"
                disabled={loading}
                required
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                密码
              </label>
              <Input
                type="password"
                value={credentials.password}
                onChange={handleInputChange('password')}
                placeholder="请输入密码"
                disabled={loading}
                required
                className="w-full"
              />
            </div>

            {/* 错误提示 */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm"
              >
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              </motion.div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading || !credentials.username || !credentials.password}
              className="w-full"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full mr-2" />
                  登录中...
                </div>
              ) : (
                '登录'
              )}
            </Button>
          </motion.form>

          {/* 底部装饰 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="mt-8 pt-6 border-t border-white/10"
          >
            <Terminal className="text-xs">
              <div className="text-gray-500">
                # SwiftCode MAX 管理系统
              </div>
              <div className="text-green-400">
                $ 系统就绪，等待管理员登录...
              </div>
            </Terminal>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};