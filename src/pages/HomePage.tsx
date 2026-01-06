import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Terminal } from '@/components/ui/Terminal';
import { TypeWriter } from '@/components/ui/TypeWriter';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import ThemeToggle from '@/components/ui/ThemeToggle';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 导航栏 */}
      <nav className="relative z-10 px-4 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                SwiftCode
              </span>
              <span className="relative text-lg font-extrabold bg-gradient-to-r from-orange-500 via-orange-400 to-red-500 bg-clip-text text-transparent animate-pulse">
                MAX
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full animate-ping"></span>
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button
              variant="secondary"
              size="sm"
              onClick={handleGetStarted}
            >
              控制台
            </Button>
          </div>
        </div>
      </nav>

      {/* 主要内容区域 */}
      <main className="relative">
        {/* 背景装饰 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -inset-10 bg-gradient-to-r from-orange-500/10 to-red-500/10 blur-3xl" />
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl" />
        </div>

        {/* Hero 区域 */}
        <section className="relative z-10 px-4 py-20">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6">
                <div className="flex items-center justify-center space-x-4">
                  <span className="text-6xl md:text-7xl font-bold">
                    SwiftCode
                  </span>
                  <span className="relative text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-orange-500 via-orange-400 to-red-500 bg-clip-text text-transparent animate-pulse">
                    MAX
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-ping"></span>
                    <span className="absolute inset-0 bg-gradient-to-r from-orange-500 via-orange-400 to-red-500 bg-clip-text text-transparent animate-bounce filter blur-sm opacity-30">
                      MAX
                    </span>
                  </span>
                </div>
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                <TypeWriter
                  text="强大的 AI API 中转服务，支持 Claude 和 Gemini 双平台"
                  speed={30}
                />
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleGetStarted}
                  className="text-lg px-8 py-4"
                >
                  开始使用
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  className="text-lg px-8 py-4"
                >
                  查看文档
                </Button>
              </div>
            </motion.div>

            {/* 终端演示 */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="max-w-4xl mx-auto"
            >
              <Terminal className="text-left">
                <div className="text-green-400 mb-2">
                  $ curl -X POST https://your-relay-service.com/api/v1/messages \
                </div>
                <div className="text-gray-400 mb-2">
                  &nbsp;&nbsp;-H "Authorization: Bearer cr_your_api_key" \
                </div>
                <div className="text-gray-400 mb-2">
                  &nbsp;&nbsp;-H "Content-Type: application/json" \
                </div>
                <div className="text-gray-400 mb-2">
                  &nbsp;&nbsp;-d {`'{"model": "claude-3-sonnet", "messages": [...]}'`}
                </div>
                <div className="text-blue-400 mt-4">
                  ← 自动负载均衡到可用的 Claude 账户
                </div>
                <div className="text-yellow-400">
                  ← 智能限流和使用统计
                </div>
                <div className="text-purple-400">
                  ← 实时监控和日志记录
                </div>
              </Terminal>
            </motion.div>
          </div>
        </section>

        {/* 功能特性 */}
        <section className="relative z-10 px-4 py-20 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                核心功能
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                企业级 AI API 中转解决方案
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-8 h-full hover:shadow-xl transition-shadow">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mb-6">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    多账户管理
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    支持多个 Claude 和 Gemini 账户，自动负载均衡，确保服务稳定性和高可用性。
                  </p>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="p-8 h-full hover:shadow-xl transition-shadow">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mb-6">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    实时监控
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    完整的使用统计、请求监控和性能分析，帮助您优化 API 使用策略。
                  </p>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <Card className="p-8 h-full hover:shadow-xl transition-shadow">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mb-6">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    智能限流
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    基于配额的智能限流机制，防止超额使用，保护您的账户安全。
                  </p>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <Card className="p-8 h-full hover:shadow-xl transition-shadow">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center mb-6">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    代理支持
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    完整的代理配置支持，包括 SOCKS5 和 HTTP 代理，适应各种网络环境。
                  </p>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                viewport={{ once: true }}
              >
                <Card className="p-8 h-full hover:shadow-xl transition-shadow">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center mb-6">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    易于集成
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    兼容 Claude CODE API 格式，无需修改现有代码，即可快速接入 Claude CODE API。
                  </p>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
              >
                <Card className="p-8 h-full hover:shadow-xl transition-shadow">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 flex items-center justify-center mb-6">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    安全可靠
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    企业级安全设计，支持 JWT 认证、数据加密存储，确保您的数据安全。
                  </p>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA 区域 */}
        <section className="relative z-10 px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                准备开始了吗？
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                几分钟内即可部署您的 AI API 中转服务
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleGetStarted}
                  className="text-lg px-8 py-4"
                >
                  立即开始
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  className="text-lg px-8 py-4"
                >
                  联系我们
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* 页脚 */}
      <footer className="relative z-10 px-4 py-12 bg-gray-100 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    SwiftCode
                  </span>
                  <span className="relative text-lg font-extrabold bg-gradient-to-r from-orange-500 via-orange-400 to-red-500 bg-clip-text text-transparent animate-pulse">
                    MAX
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full animate-ping"></span>
                  </span>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                强大的 AI API 中转服务，为开发者提供稳定、高效的 Claude 和 Gemini API 访问解决方案。
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">产品</h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>API 中转</li>
                <li>账户管理</li>
                <li>使用统计</li>
                <li>监控告警</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">支持</h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>文档</li>
                <li>API 参考</li>
                <li>社区</li>
                <li>联系我们</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 mt-12 pt-8 text-center text-gray-600 dark:text-gray-300">
            <p>&copy; 2024 SwiftCode MAX. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
