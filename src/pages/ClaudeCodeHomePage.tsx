import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CodeTypewriter } from '@/components/ui/CodeTypewriter';
import { Button } from '@/components/ui/Button';

export const ClaudeCodeHomePage: React.FC = () => {
  const navigate = useNavigate();
  const [pricingMode, setPricingMode] = useState<'payAsYouGo' | 'monthly'>('payAsYouGo');
  const [showQRCode, setShowQRCode] = useState(false);

  const handleGetStarted = () => {
    navigate('/dashboard');
  };

  const handleTutorial = () => {
    navigate('/tutorial');
  };

  const handleShowQRCode = () => {
    setShowQRCode(true);
  };

  const handleCloseQRCode = () => {
    setShowQRCode(false);
  };

  const handleScrollToServices = () => {
    document.getElementById('services')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  const codeExample = `// SwiftCode MAX - AI API 中转服务
import { ClaudeCodeClient } from 'claude-code-sdk';

const client = new ClaudeCodeClient({
  apiKey: 'your_api_key',
  baseURL: 'https://api01.swiftcode.cc'
});

// 自动负载均衡到可用的 Claude MAX 账户
const response = await client.messages.create({
  model: 'claude-4.5-opus',
  messages: [{
    role: 'user',
    content: '请帮我分析这段代码的性能优化方案'
  }],
  max_tokens: 1000000
});

console.log(response.content);
// ← 智能限流和使用统计
// ← 实时监控和日志记录`;

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-stone-50/80 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-18 h-18 rounded-xl bg-gradient-to-br flex items-center justify-center">
                {/* <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg> */}
                <img src="/logo-1.png" alt="SwiftCode" className="" />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl sm:text-3xl font-bold text-stone-900">
                  SwiftCode
                </span>
                <span className="relative text-lg sm:text-xl font-extrabold bg-gradient-to-r from-orange-500 via-orange-400 to-red-500 bg-clip-text text-transparent animate-pulse">
                  MAX
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full animate-ping"></span>
                  <span className="absolute inset-0 bg-gradient-to-r from-orange-500 via-orange-400 to-red-500 bg-clip-text text-transparent animate-bounce filter blur-sm opacity-30">
                    MAX
                  </span>
                </span>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-stone-600 hover:text-stone-900 transition-colors">功能</a>
              <a href="#services" className="text-stone-600 hover:text-stone-900 transition-colors">服务</a>
              <a href="#pricing" className="text-stone-600 hover:text-stone-900 transition-colors">定价</a>
              <a href="/tutorial" className="text-stone-600 hover:text-stone-900 transition-colors">文档</a>
              <Button
                variant="primary"
                size="sm"
                onClick={handleGetStarted}
                className="bg-orange-500 hover:bg-orange-600"
              >
                控制台
              </Button>
            </div>
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <Button
                variant="primary"
                size="sm"
                onClick={handleGetStarted}
                className="bg-orange-500 hover:bg-orange-600"
              >
                控制台
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 pb-8 sm:pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="space-y-6 lg:space-y-8 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 mb-4 sm:mb-6">
                  <span className="mr-2">🚀</span>
                  企业级 AI 中转解决方案
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-stone-900 leading-tight">
                  为开发者而生的
                  <br />
                  <span className="text-gradient bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                    Claude
                  </span>{' '}
                  中转服务
                </h1>

                <p className="text-lg sm:text-xl text-stone-600 leading-relaxed max-w-lg mx-auto lg:mx-0">
                  强大的 AI API 中转服务，支持 Claude CODE API 平台。
                  多账户管理、智能负载均衡、实时监控，让 AI 集成变得简单可靠。
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
              >
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleGetStarted}
                  className="bg-orange-500 hover:bg-orange-600 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto"
                >
                  开始使用
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleScrollToServices}
                  className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 border-orange-300 text-orange-600 hover:bg-orange-50 w-full sm:w-auto"
                >
                  查看服务
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={handleTutorial}
                  className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 text-white border-stone-300 hover:bg-stone-100 w-full sm:w-auto"
                >
                  查看文档
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs sm:text-sm text-stone-500"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>99.9% 可用性</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>&lt; 100ms 延迟</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>企业级安全</span>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Code Demo */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative mt-8 lg:mt-0 order-first lg:order-last"
            >
              <CodeTypewriter
                code={codeExample}
                language="typescript"
                speed={25}
                className="shadow-2xl"
                backgroundLogo="/logo-1.png"
              />

              {/* Floating badges */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.5 }}
                className="absolute -top-4 sm:-top-6 -right-4 sm:-right-6 bg-white rounded-lg shadow-lg p-2 sm:p-3 border border-stone-200 z-20"
              >
                <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-stone-700 font-medium">实时监控</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 2 }}
                className="absolute -bottom-4 sm:-bottom-6 -left-4 sm:-left-6 bg-white rounded-lg shadow-lg p-2 sm:p-3 border border-stone-200 z-20"
              >
                <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  <span className="text-stone-700 font-medium">智能负载均衡</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-orange-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-red-200/30 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-gradient-to-br from-stone-50 via-white to-orange-50/30 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-orange-200/20 to-red-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-orange-100 text-orange-800 mb-6 shadow-sm">
              <span className="mr-2">✨</span>
              核心优势
            </div>
            <h2 className="text-5xl font-bold text-stone-900 mb-6">
              为什么选择
              <span className="relative ml-3">
                SwiftCode
                <span className="text-3xl font-extrabold bg-gradient-to-r from-orange-500 via-orange-400 to-red-500 bg-clip-text text-transparent animate-pulse ml-2">
                  MAX
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full animate-ping"></span>
                </span>
              </span>
              ？
            </h2>
            <p className="text-xl text-stone-600 max-w-3xl mx-auto leading-relaxed">
              专为开发者设计的企业级 AI API 中转解决方案，让您专注于构建出色的产品
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "智能负载均衡",
                description: "自动分配请求到可用的 Claude 账户，确保最佳性能和可用性",
                gradient: "from-blue-500 to-cyan-500",
                bgGradient: "from-blue-50 to-cyan-50",
                borderColor: "border-blue-200",
                icon: (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                  </svg>
                ),
                delay: 0.1
              },
              {
                title: "实时监控",
                description: "完整的使用统计、性能监控和智能告警，让您掌控全局",
                gradient: "from-emerald-500 to-green-500",
                bgGradient: "from-emerald-50 to-green-50",
                borderColor: "border-emerald-200",
                icon: (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                delay: 0.2
              },
              {
                title: "企业级安全",
                description: "JWT 认证、数据加密存储、API Key 管理，保护您的数据安全",
                gradient: "from-purple-500 to-indigo-500",
                bgGradient: "from-purple-50 to-indigo-50",
                borderColor: "border-purple-200",
                icon: (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                delay: 0.3
              },
              {
                title: "极速响应",
                description: "优化的网络架构和缓存策略，延迟低至 100ms",
                gradient: "from-yellow-500 to-orange-500",
                bgGradient: "from-yellow-50 to-orange-50",
                borderColor: "border-yellow-200",
                icon: (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                delay: 0.4
              },
              {
                title: "易于集成",
                description: "兼容 CC API 格式，无需修改现有代码即可快速接入",
                gradient: "from-pink-500 to-rose-500",
                bgGradient: "from-pink-50 to-rose-50",
                borderColor: "border-pink-200",
                icon: (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                ),
                delay: 0.5
              },
              {
                title: "全球部署",
                description: "支持多区域部署和 CDN 加速，为全球用户提供稳定服务",
                gradient: "from-teal-500 to-cyan-500",
                bgGradient: "from-teal-50 to-cyan-50",
                borderColor: "border-teal-200",
                icon: (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                ),
                delay: 0.6
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: feature.delay }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group"
              >
                <div className={`relative p-8 h-full bg-gradient-to-br ${feature.bgGradient} backdrop-blur-sm rounded-2xl border ${feature.borderColor} shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden`}>
                  {/* Background pattern */}
                  <div className="absolute inset-0 bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Floating icon */}
                  <motion.div
                    className={`relative z-10 w-16 h-16 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center shadow-lg mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}
                    whileHover={{ scale: 1.1, rotate: 3 }}
                  >
                    {feature.icon}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/20 to-transparent"></div>
                  </motion.div>

                  {/* Content */}
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold text-stone-900 mb-4 group-hover:text-stone-800 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-stone-600 leading-relaxed group-hover:text-stone-700 transition-colors">
                      {feature.description}
                    </p>
                  </div>

                  {/* Decorative corner */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/20 to-transparent rounded-bl-full"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Button Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Button
              variant="primary"
              size="lg"
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-xl px-12 py-6 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
            >
              <span className="flex items-center space-x-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>立即体验 SwiftCode MAX</span>
                <span className="animate-pulse">🚀</span>
              </span>
            </Button>
            <p className="mt-4 text-stone-600">
              30秒快速接入，无需注册，立即体验企业级服务
            </p>
          </motion.div>
        </div>
      </section>

      {/* Advanced Features Section */}
      <section id="services" className="py-24 bg-gradient-to-br from-slate-900 via-gray-900 to-stone-900 text-white relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-red-500/10 rounded-full blur-3xl"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/5 to-transparent"></div>
          {/* Background Logo */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
            <img src="/logo-1.png" alt="SwiftCode" className="w-128 h-128" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-orange-500/20 text-orange-300 mb-6 border border-orange-500/30">
              <span className="mr-2">⚡</span>
              企业级服务保障
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-orange-200 to-white bg-clip-text text-transparent">
                快准狠，就是这么
              </span>
              <span className="relative ml-2">
                <span className="text-orange-400">强</span>
                <span className="absolute -inset-1 bg-orange-500/20 blur-lg rounded-lg"></span>
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              专业团队打造的企业级服务，每个细节都为您的业务保驾护航
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "CN2-GIA专线回国",
                subtitle: "极速稳定",
                description: "采用电信CN2 GIA精品网络，三网直连中国｜超低延迟99.9%高可用｜企业级高可用,专为高要求业务打造",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                gradient: "from-blue-500 to-cyan-500",
                bgGradient: "from-blue-500/10 to-cyan-500/10",
                delay: 0.1
              },
              {
                title: "平台原生支持",
                subtitle: "开箱即用",
                description: "Claude Code 无缝接入，开箱即用，接口100%原生，无需改造，接入即用，开发效率翻倍",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                ),
                gradient: "from-emerald-500 to-green-500",
                bgGradient: "from-emerald-500/10 to-green-500/10",
                delay: 0.2
              },
              {
                title: "大容量·高性价比",
                subtitle: "智能负载",
                description: "Claude Code MAX账号池，智能负载均衡+自动故障切换，兼顾高性能与低成本，稳定不掉线。",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                ),
                gradient: "from-purple-500 to-pink-500",
                bgGradient: "from-purple-500/10 to-pink-500/10",
                delay: 0.3
              },
              {
                title: "额度灵活",
                subtitle: "透明无套路",
                description: "用量不够？联系客服即时扩容，按需增配。无隐藏费用、无强制套餐，真正按需付费。",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                ),
                gradient: "from-yellow-500 to-orange-500",
                bgGradient: "from-yellow-500/10 to-orange-500/10",
                delay: 0.4
              },
              {
                title: "7×24 小时技术护航",
                subtitle: "专业团队",
                description: "资深工程师团队全天候在线，响应快、解决快，保障您的服务始终在线。",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5zm0 0v1m0 18v1" />
                  </svg>
                ),
                gradient: "from-indigo-500 to-purple-500",
                bgGradient: "from-indigo-500/10 to-purple-500/10",
                delay: 0.5
              },
              {
                title: "用量实时监控",
                subtitle: "可视化面板",
                description: "可视化面板实时追踪API调用次数、额度消耗，预警提醒，杜绝超额风险，掌控每一笔调用。",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                gradient: "from-teal-500 to-cyan-500",
                bgGradient: "from-teal-500/10 to-cyan-500/10",
                delay: 0.6
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: feature.delay }}
                viewport={{ once: true }}
                className="group"
              >
                <div className={`relative p-8 rounded-2xl border border-white/10 bg-gradient-to-br ${feature.bgGradient} backdrop-blur-sm hover:border-white/20 transition-all duration-500 hover:transform hover:scale-105 h-full`}>
                  {/* Glow effect */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl`}></div>

                  {/* Icon */}
                  <div className={`relative z-10 w-16 h-16 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-6 text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    <div className="flex items-center mb-2">
                      <h3 className="text-xl font-bold text-white group-hover:text-orange-200 transition-colors">
                        {feature.title}
                      </h3>
                      <span className="ml-2 text-sm text-orange-400 font-semibold">·</span>
                      <span className="ml-2 text-sm text-orange-400 font-semibold">
                        {feature.subtitle}
                      </span>
                    </div>
                    <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors">
                      {feature.description}
                    </p>
                  </div>

                  {/* Corner decoration */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-gradient-to-br from-white via-stone-50 to-gray-100 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-orange-200/10 to-red-200/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-200/10 to-purple-200/10 rounded-full blur-3xl"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/2 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-orange-100 text-orange-800 mb-6 shadow-sm border border-orange-200/50">
              <span className="mr-2">💰</span>
              灵活定价
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-stone-900 mb-6">
              <span className="bg-gradient-to-r from-stone-900 via-orange-600 to-stone-900 bg-clip-text text-transparent">
                选择适合您的
              </span>
              <span className="relative ml-2">
                <span className="text-orange-500">方案</span>
                <span className="absolute -inset-1 bg-orange-500/10 blur-lg rounded-lg"></span>
              </span>
            </h2>
            <p className="text-xl text-stone-600 max-w-3xl mx-auto leading-relaxed">
              无论是个人开发者还是企业用户，我们都有最适合您的定价方案
            </p>
          </motion.div>

          {/* Pricing Tabs */}
          <div className="flex justify-center mb-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-stone-200/50">
              <div className="flex space-x-2">
                <button
                  onClick={() => setPricingMode('payAsYouGo')}
                  className={`relative px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                    pricingMode === 'payAsYouGo'
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/25'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/50'
                  }`}
                >
                  <span className="relative z-10">按量计费</span>
                  {pricingMode === 'payAsYouGo' && (
                    <motion.div
                      layoutId="pricingTab"
                      className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </button>
                <button
                  onClick={() => setPricingMode('monthly')}
                  className={`relative px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                    pricingMode === 'monthly'
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/25'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/50'
                  }`}
                >
                  <span className="relative z-10">按月计费</span>
                  {pricingMode === 'monthly' && (
                    <motion.div
                      layoutId="pricingTab"
                      className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="relative min-h-[700px]">
            <AnimatePresence mode="wait">
              {pricingMode === 'payAsYouGo' ? (
                <motion.div
                  key="payAsYouGo"
                  initial={{ x: 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -300, opacity: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    mass: 0.8
                  }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto"
                >
                  {[
                    {
                      name: "体验包",
                      price: "¥6",
                      quota: "$10",
                      popular: false
                    },
                    {
                      name: "普通包",
                      price: "¥29.99",
                      quota: "$50",
                      popular: false
                    },
                    {
                      name: "进阶包",
                      price: "¥55.99",
                      quota: "$100",
                      popular: true
                    },
                    {
                      name: "专业包",
                      price: "¥99.99",
                      quota: "$200",
                      popular: false
                    },
                    {
                      name: "畅享包",
                      price: "¥199.99",
                      quota: "$500",
                      popular: false
                    }
                  ].map((plan, index) => {
                    const descriptions: Record<string, string> = {
                      "体验包": "适合个人开发者初步体验",
                      "普通包": "适合轻量级个人项目",
                      "进阶包": "适合小型团队和个人项目",
                      "专业包": "适合中型团队和商业项目",
                      "畅享包": "适合大型项目和企业用户"
                    };

                    return (
                    <motion.div
                      key={plan.name}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className={`relative group ${plan.popular ? 'scale-105 z-10' : ''} ${index >= 3 ? 'sm:col-start-2 lg:col-start-auto' : ''}`}
                    >
                      {plan.popular && (
                        <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-20">
                          <div className="bg-slate-900 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg border border-slate-700">
                            推荐
                          </div>
                        </div>
                      )}

                      <div className={`relative h-full p-6 rounded-2xl border-2 ${
                        plan.popular
                          ? 'border-orange-500 bg-white shadow-2xl shadow-orange-200/40'
                          : 'border-orange-200 bg-white shadow-xl shadow-orange-100/30 hover:shadow-2xl hover:shadow-orange-200/50'
                      } transition-all duration-500 transform hover:-translate-y-1 hover:border-orange-400`}>

                        {/* 装饰元素 */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 rounded-t-2xl"></div>

                        {/* 价格区域 */}
                        <div className="text-center mb-6">
                          <div className="mb-4">
                            <h3 className="text-xl font-bold text-stone-900 mb-2">{plan.name}</h3>
                            <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800 border border-orange-200">
                              {descriptions[plan.name]}
                            </div>
                          </div>

                          <div className="relative">
                            <div className="flex items-baseline justify-center mb-1">
                              <span className="text-3xl font-bold text-stone-900">{plan.price}</span>
                            </div>
                            <div className="text-stone-600 text-sm font-medium">
                              总额度 {plan.quota}
                            </div>
                          </div>
                        </div>

                        {/* 功能列表 */}
                        <div className="space-y-2 mb-6">
                          <div className="flex items-center justify-between py-1.5 px-2 bg-orange-50/50 rounded-md">
                            <div className="flex items-center">
                              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></div>
                              <span className="text-stone-700 text-sm font-medium">总额度</span>
                            </div>
                            <span className="font-bold text-stone-900 text-sm">{plan.quota}</span>
                          </div>

                          <div className="flex items-center justify-between py-1.5 px-2 bg-orange-50/50 rounded-md">
                            <div className="flex items-center">
                              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></div>
                              <span className="text-stone-700 text-sm font-medium">请求数量</span>
                            </div>
                            <span className="font-bold text-stone-900 text-sm">无限制</span>
                          </div>

                          <div className="flex items-center justify-between py-1.5 px-2 bg-orange-50/50 rounded-md">
                            <div className="flex items-center">
                              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></div>
                              <span className="text-stone-700 text-sm font-medium">技术支持</span>
                            </div>
                            <span className="font-bold text-stone-900 text-sm">普通支持</span>
                          </div>

                          <div className="flex items-center justify-between py-1.5 px-2 bg-orange-50/50 rounded-md">
                            <div className="flex items-center">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                              <span className="text-stone-700 text-sm font-medium">支持所有模型</span>
                            </div>
                            <span className="font-bold text-green-600 text-sm">✓</span>
                          </div>

                          <div className="flex items-center justify-between py-1.5 px-2 bg-orange-50/50 rounded-md">
                            <div className="flex items-center">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                              <span className="text-stone-700 text-sm font-medium">API性能优化</span>
                            </div>
                            <span className="font-bold text-green-600 text-sm">✓</span>
                          </div>

                          <div className="flex items-center justify-between py-1.5 px-2 bg-orange-50/50 rounded-md">
                            <div className="flex items-center">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                              <span className="text-stone-700 text-sm font-medium">智能负载均衡</span>
                            </div>
                            <span className="font-bold text-green-600 text-sm">✓</span>
                          </div>

                          <div className="flex items-center justify-between py-1.5 px-2 bg-orange-50/50 rounded-md">
                            <div className="flex items-center">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                              <span className="text-stone-700 text-sm font-medium">SLA服务保障</span>
                            </div>
                            <span className="font-bold text-green-600 text-sm">✓</span>
                          </div>
                        </div>

                        {/* 按钮 */}
                        <Button
                          variant="primary"
                          className={`w-full ${
                            plan.popular
                              ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'
                              : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'
                          } text-white font-semibold py-2.5 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300`}
                          onClick={handleShowQRCode}
                        >
                          <span className="text-sm">立即选择</span>
                        </Button>
                      </div>
                    </motion.div>
                    );
                  })}
                </motion.div>
              ) : (
                <motion.div
                  key="monthly"
                  initial={{ x: 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -300, opacity: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    mass: 0.8
                  }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto"
                >
                  {[
                    {
                      name: "标准套餐",
                      price: "¥99",
                      period: "/月",
                      dailyQuota: "$10",
                      monthlyQuota: "$300",
                      support: "基础支持",
                      popular: false
                    },
                    {
                      name: "进阶套餐",
                      price: "¥199",
                      period: "/月",
                      dailyQuota: "$30",
                      monthlyQuota: "$900",
                      support: "基础支持",
                      popular: true
                    },
                    {
                      name: "专业套餐",
                      price: "¥299",
                      period: "/月",
                      dailyQuota: "$60",
                      monthlyQuota: "$1800",
                      support: "基础支持",
                      popular: false
                    },
                    {
                      name: "旗舰套餐",
                      price: "¥499",
                      period: "/月",
                      dailyQuota: "$100",
                      monthlyQuota: "$3000",
                      support: "普通支持",
                      popular: false
                    },
                    {
                      name: "企业定制",
                      price: "¥1999",
                      period: "/月",
                      dailyQuota: "$500",
                      monthlyQuota: "$15000",
                      support: "高级支持",
                      popular: false
                    }
                  ].map((plan, index) => {
                    const descriptions: Record<string, string> = {
                      "标准套餐": "适合个人开发者和小项目",
                      "进阶套餐": "适合小型团队和个人项目",
                      "专业套餐": "适合中型团队和商业项目",
                      "旗舰套餐": "适合大型项目和企业用户",
                      "企业定制": "适合大型企业和高频使用"
                    };

                    return (
                    <motion.div
                      key={plan.name}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className={`relative group ${plan.popular ? 'scale-105 z-10' : ''} ${index >= 3 ? 'sm:col-start-2 lg:col-start-auto' : ''}`}
                    >
                      {plan.popular && (
                        <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-20">
                          <div className="bg-orange-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg border border-orange-700">
                            推荐
                          </div>
                        </div>
                      )}

                      <div className={`relative h-full p-6 rounded-2xl border-2 ${
                        plan.popular
                          ? 'border-orange-500 bg-white shadow-2xl shadow-orange-200/40'
                          : 'border-orange-200 bg-white shadow-xl shadow-orange-100/30 hover:shadow-2xl hover:shadow-orange-200/50'
                      } transition-all duration-500 transform hover:-translate-y-1 hover:border-orange-400`}>

                        {/* 装饰元素 */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 rounded-t-2xl"></div>

                        {/* 价格区域 */}
                        <div className="text-center mb-6">
                          <div className="mb-4">
                            <h3 className="text-xl font-bold text-stone-900 mb-2">{plan.name}</h3>
                            <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800 border border-orange-200">
                              {descriptions[plan.name]}
                            </div>
                          </div>

                          <div className="relative">
                            <div className="flex items-baseline justify-center mb-1">
                              <span className="text-3xl font-bold text-stone-900">{plan.price}</span>
                              <span className="text-stone-600 ml-1 text-lg font-semibold">{plan.period}</span>
                            </div>
                            <div className="text-stone-600 text-sm font-medium">
                              每日：{plan.dailyQuota} | 每月：{plan.monthlyQuota}
                            </div>
                          </div>
                        </div>

                        {/* 功能列表 */}
                        <div className="space-y-2 mb-6">
                          <div className="flex items-center justify-between py-1.5 px-2 bg-orange-50/50 rounded-md">
                            <div className="flex items-center">
                              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></div>
                              <span className="text-stone-700 text-sm font-medium">每日额度</span>
                            </div>
                            <span className="font-bold text-stone-900 text-sm">{plan.dailyQuota}</span>
                          </div>

                          <div className="flex items-center justify-between py-1.5 px-2 bg-orange-50/50 rounded-md">
                            <div className="flex items-center">
                              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></div>
                              <span className="text-stone-700 text-sm font-medium">每月额度</span>
                            </div>
                            <span className="font-bold text-stone-900 text-sm">{plan.monthlyQuota}</span>
                          </div>

                          <div className="flex items-center justify-between py-1.5 px-2 bg-orange-50/50 rounded-md">
                            <div className="flex items-center">
                              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></div>
                              <span className="text-stone-700 text-sm font-medium">请求数量</span>
                            </div>
                            <span className="font-bold text-stone-900 text-sm">无限制</span>
                          </div>

                          <div className="flex items-center justify-between py-1.5 px-2 bg-orange-50/50 rounded-md">
                            <div className="flex items-center">
                              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></div>
                              <span className="text-stone-700 text-sm font-medium">技术支持</span>
                            </div>
                            <span className="font-bold text-stone-900 text-sm">{plan.support}</span>
                          </div>

                          <div className="flex items-center justify-between py-1.5 px-2 bg-orange-50/50 rounded-md">
                            <div className="flex items-center">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                              <span className="text-stone-700 text-sm font-medium">支持所有模型</span>
                            </div>
                            <span className="font-bold text-green-600 text-sm">✓</span>
                          </div>

                          <div className="flex items-center justify-between py-1.5 px-2 bg-orange-50/50 rounded-md">
                            <div className="flex items-center">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                              <span className="text-stone-700 text-sm font-medium">API性能优化</span>
                            </div>
                            <span className="font-bold text-green-600 text-sm">✓</span>
                          </div>

                          <div className="flex items-center justify-between py-1.5 px-2 bg-orange-50/50 rounded-md">
                            <div className="flex items-center">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                              <span className="text-stone-700 text-sm font-medium">智能负载均衡</span>
                            </div>
                            <span className="font-bold text-green-600 text-sm">✓</span>
                          </div>

                          <div className="flex items-center justify-between py-1.5 px-2 bg-orange-50/50 rounded-md">
                            <div className="flex items-center">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                              <span className="text-stone-700 text-sm font-medium">SLA服务保障</span>
                            </div>
                            <span className="font-bold text-green-600 text-sm">✓</span>
                          </div>
                        </div>

                        {/* 按钮 */}
                        <Button
                          variant="primary"
                          className={`w-full ${
                            plan.popular
                              ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'
                              : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'
                          } text-white font-semibold py-2.5 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300`}
                          onClick={handleShowQRCode}
                        >
                          <span className="text-sm">立即选择</span>
                        </Button>
                      </div>
                    </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-4 sm:mb-6">
              准备开始了吗？
            </h2>
            <p className="text-lg sm:text-xl text-stone-600 mb-6 sm:mb-8">
              几分钟内即可接入您的 AI API 中转服务，立即体验企业级的稳定性和性能
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
              <Button
                variant="primary"
                size="lg"
                onClick={handleGetStarted}
                className="bg-orange-500 hover:bg-orange-600 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto"
              >
                免费开始
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={handleShowQRCode}
                className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 border-stone-300 text-stone-700 hover:bg-stone-100 w-full sm:w-auto"
              >
                联系我们
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* QR Code Modal */}
      <AnimatePresence>
        {showQRCode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={handleCloseQRCode}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={handleCloseQRCode}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 transition-colors"
              >
                <svg className="w-5 h-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Content */}
              <div className="text-center">
                <h3 className="text-2xl font-bold text-stone-900 mb-2">联系我们</h3>
                <p className="text-stone-600 mb-6">扫描二维码添加客服微信</p>

                {/* QR Code Image */}
                <div className="bg-stone-50 rounded-xl p-6 mb-6">
                  <img
                    src="/logo-1.png"
                    alt="联系我们二维码"
                    className="w-64 h-64 mx-auto object-contain"
                  />
                </div>

                <p className="text-sm text-stone-500">
                  工作时间：周一至周日 9:00-21:00
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-300 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="col-span-1 sm:col-span-2 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start space-x-3 mb-4">
                <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-lg flex items-center justify-center">
                  <img src="/logo-1.png" alt="SwiftCode" className="w-12 sm:w-16 h-12 sm:h-16" />
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg sm:text-xl font-bold text-white">
                    SwiftCode
                  </span>
                  <span className="text-base sm:text-lg font-extrabold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                    MAX
                  </span>
                </div>
              </div>
              <p className="text-stone-400 mb-4 max-w-md mx-auto sm:mx-0 text-sm sm:text-base">
                强大的 AI API 中转服务，为开发者提供稳定、高效的 Claude CODE API 访问解决方案。
              </p>
            </div>

            <div className="text-center sm:text-left">
              <h4 className="font-semibold text-white mb-3 sm:mb-4 text-base sm:text-lg">产品</h4>
              <ul className="space-y-1 sm:space-y-2 text-stone-400 text-sm sm:text-base">
                <li>API 中转</li>
                <li>账户管理</li>
                <li>使用统计</li>
                <li>监控告警</li>
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <h4 className="font-semibold text-white mb-3 sm:mb-4 text-base sm:text-lg">支持</h4>
              <ul className="space-y-1 sm:space-y-2 text-stone-400 text-sm sm:text-base">
                <li>文档</li>
                <li>API 参考</li>
                <li>社区</li>
                <li>联系我们</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-stone-800 mt-8 sm:mt-12 pt-6 sm:pt-8 text-center text-stone-400 text-sm sm:text-base">
            <p>&copy; 2024 SwiftCode MAX. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ClaudeCodeHomePage;