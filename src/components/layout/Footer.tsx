import React from 'react';
import { motion } from 'framer-motion';
import {
  IconHeart,
  IconCode,
  IconBrandGithub,
  IconMail,
  IconExternalLink,
  IconCpu,
  IconDatabase,
  IconCloud,
} from '@tabler/icons-react';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  const currentYear = new Date().getFullYear();

  const stats = [
    { label: 'API 请求', value: '1.2M+', icon: IconCpu },
    { label: '活跃用户', value: '50+', icon: IconDatabase },
    { label: '运行时间', value: '99.9%', icon: IconCloud },
  ];

  const links = [
    { label: 'GitHub', href: 'https://github.com', icon: IconBrandGithub },
    { label: '文档', href: '/tutorial', icon: IconCode },
    { label: '支持', href: 'mailto:support@example.com', icon: IconMail },
  ];

  return (
    <footer
      className={`glass mt-auto border-t border-gray-200/20 dark:border-gray-700/20 ${className} `}
    >
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        {/* 统计信息 */}
        <div className="mb-6 grid grid-cols-3 gap-4 sm:gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="mb-2 flex items-center justify-center">
                  <div className="rounded-lg bg-orange-100 p-2 dark:bg-orange-900/20">
                    <Icon className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
                <div className="terminal-text text-lg font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* 分割线 */}
        <div className="mb-6 border-t border-gray-200/20 dark:border-gray-700/20" />

        {/* 主要内容区 */}
        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* 产品信息 */}
          <div className="lg:col-span-2">
            <div className="mb-3 flex items-center space-x-3">
              <div className="claude-gradient flex h-8 w-8 items-center justify-center rounded-lg">
                <IconCode className="h-5 w-5 text-white" />
              </div>
              <h3 className="claude-gradient-text terminal-text text-lg font-bold">
                SwiftCode MAX
              </h3>
            </div>
            <p className="mb-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              强大的 AI API 中转服务，支持 Claude 和 Gemini 双平台。
              提供多账户管理、API Key 认证、代理配置和现代化 Web 管理界面。
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/20 dark:text-green-300">
                高可用
              </span>
              <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                安全可靠
              </span>
              <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-900/20 dark:text-purple-300">
                开源免费
              </span>
            </div>
          </div>

          {/* 快速链接 */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
              快速链接
            </h4>
            <div className="space-y-2">
              {links.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={
                      link.href.startsWith('http')
                        ? 'noopener noreferrer'
                        : undefined
                    }
                    className="group flex items-center space-x-2 text-sm text-gray-600 transition-colors hover:text-orange-600 dark:text-gray-300 dark:hover:text-orange-400"
                  >
                    <Icon className="h-4 w-4 transition-transform group-hover:scale-110" />
                    <span>{link.label}</span>
                    {link.href.startsWith('http') && (
                      <IconExternalLink className="h-3 w-3 opacity-50" />
                    )}
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* 底部版权信息 */}
        <div className="flex flex-col items-center justify-between space-y-3 border-t border-gray-200/20 pt-4 sm:flex-row sm:space-y-0 dark:border-gray-700/20">
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <span>© {currentYear} SwiftCode MAX.</span>
            <span>Made with</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <IconHeart className="h-4 w-4 text-red-500" />
            </motion.div>
            <span>by developers</span>
          </div>

          <div className="flex items-center space-x-4 text-xs text-gray-400 dark:text-gray-500">
            <span className="terminal-text">v1.1.142</span>
            <span>•</span>
            <span>Node.js</span>
            <span>•</span>
            <span>React</span>
            <span>•</span>
            <span>TypeScript</span>
          </div>
        </div>

        {/* 状态指示器 */}
        <div className="mt-4 flex items-center justify-center">
          <div className="flex items-center space-x-2 rounded-full bg-green-50 px-3 py-1.5 dark:bg-green-900/20">
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="h-2 w-2 rounded-full bg-green-500"
            />
            <span className="text-xs font-medium text-green-700 dark:text-green-300">
              系统运行正常
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
