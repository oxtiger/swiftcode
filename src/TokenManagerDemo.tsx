import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TokenManager } from '@/components';
import { Button } from '@/components/ui/Button';

/**
 * Token管理器演示应用
 * 展示完整的Token管理功能
 */
const TokenManagerDemo: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-stone-50">
        {/* 导航栏 */}
        <nav className="bg-white border-b border-stone-200 px-4 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-stone-900">
                SwiftCode MAX - Token Manager
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  首页
                </Button>
              </Link>
              <Link to="/tokens">
                <Button variant="primary" size="sm" className="bg-orange-500 hover:bg-orange-600">
                  Token管理
                </Button>
              </Link>
            </div>
          </div>
        </nav>

        {/* 路由内容 */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tokens" element={<TokenManager />} />
        </Routes>
      </div>
    </Router>
  );
};

/**
 * 首页组件
 */
const HomePage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-orange-100 text-orange-800 mb-6">
          <span className="mr-2">🚀</span>
          Token管理器演示
        </div>

        <h1 className="text-4xl lg:text-5xl font-bold text-stone-900 mb-6">
          API Token
          <br />
          <span className="text-gradient bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            本地存储管理
          </span>
        </h1>

        <p className="text-xl text-stone-600 mb-8 max-w-2xl mx-auto">
          安全地管理您的 SwiftCode MAX API Token，支持多Token切换、本地加密存储和智能管理功能。
        </p>

        <div className="space-y-4">
          <Link to="/tokens">
            <Button
              variant="primary"
              size="lg"
              className="bg-orange-500 hover:bg-orange-600 text-lg px-8 py-4"
            >
              开始管理Token
            </Button>
          </Link>
        </div>

        {/* 功能特点 */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: '🔒',
              title: '本地安全存储',
              description: 'Token存储在浏览器本地，支持加密保护，确保数据安全。',
            },
            {
              icon: '🔄',
              title: '多Token管理',
              description: '支持保存多个Token，轻松切换不同的API凭据。',
            },
            {
              icon: '📊',
              title: '使用统计',
              description: '记录Token使用时间，帮助您了解API使用情况。',
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              className="p-6 bg-white rounded-lg border border-stone-200 hover:shadow-lg transition-shadow"
            >
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-stone-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-stone-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export { TokenManagerDemo };