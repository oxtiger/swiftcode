import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TokenManager } from '@/components/TokenManager';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils';
import { useActiveToken, useTokenStore } from '@/stores/tokenStore';
import {
  useApiStatsLoading,
  useApiStatsError,
  useStatsData,
  useCurrentPeriodData,
  useApiStatsActions,
} from '@/stores/apiStatsStore';
import { UserStatsData } from '@/services/apiStats';
import { tokenManager } from '@/services/tokenManager';
import { useNavigate } from 'react-router-dom';

/**
 * 仪表板统计项接口
 */
interface DashboardStat {
  id: string;
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  color: 'orange' | 'green' | 'blue' | 'purple' | 'red';
}

/**
 * 根据用户统计数据生成仪表板统计项
 */
const generateDashboardStats = (
  statsData: UserStatsData | null,
  currentPeriodData: any
): DashboardStat[] => {
  if (!statsData) {
    return [
      {
        id: 'total-requests',
        title: 'API 请求总数',
        value: '-',
        description: '今日请求次数',
        color: 'orange',
        icon: (
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        ),
      },
      {
        id: 'today-tokens',
        title: '今日Token数',
        value: '-',
        description: '输入+输出Token',
        color: 'green',
        icon: (
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1721 9z"
            />
          </svg>
        ),
      },
      {
        id: 'today-cost',
        title: '今日费用',
        value: '-',
        description: '消费金额',
        color: 'blue',
        icon: (
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
            />
          </svg>
        ),
      },
      {
        id: 'today-input-tokens',
        title: '今日输入Token',
        value: '-',
        description: '输入Token数量',
        color: 'purple',
        icon: (
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16l-4-4m0 0l4-4m-4 4h18"
            />
          </svg>
        ),
      },
    ];
  }

  // 使用真实数据
  const todayData = currentPeriodData || {
    requests: 0,
    inputTokens: 0,
    outputTokens: 0,
    cost: 0,
    formattedCost: '$0.000000'
  };

  return [
    {
      id: 'total-requests',
      title: 'API 请求总数',
      value: todayData.requests.toLocaleString(),
      description: '今日请求次数',
      color: 'orange',
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      ),
    },
    {
      id: 'today-tokens',
      title: '今日Token数',
      value: (todayData.inputTokens + todayData.outputTokens).toLocaleString(),
      description: '输入+输出Token',
      color: 'green',
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1721 9z"
          />
        </svg>
      ),
    },
    {
      id: 'today-cost',
      title: '今日费用',
      value: todayData.formattedCost || `$${todayData.cost.toFixed(6)}`,
      description: '消费金额',
      color: 'blue',
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
          />
        </svg>
      ),
    },
    {
      id: 'today-input-tokens',
      title: '今日输入Token',
      value: todayData.inputTokens.toLocaleString(),
      description: '输入Token数量',
      color: 'purple',
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16l-4-4m0 0l4-4m-4 4h18"
          />
        </svg>
      ),
    },
  ];
};

/**
 * 视图模式类型
 */
type ViewMode = 'overview' | 'tokens';

/**
 * DashboardPage - 仪表板页面组件
 *
 * 重新设计后的仪表板，展示完整的API Key信息和统计数据
 */
export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>('overview');

  // Token和API状态
  const activeToken = useActiveToken();
  const isStatsLoading = useApiStatsLoading();
  const statsError = useApiStatsError();
  const statsData = useStatsData();
  const currentPeriodData = useCurrentPeriodData();
  const { refreshBasicStats } = useApiStatsActions();

  // 组件加载时检查并刷新数据（仅当token变化时）
  useEffect(() => {
    console.log('Dashboard useEffect - activeToken:', activeToken?.token ? 'exists' : 'none');
    console.log('Dashboard useEffect - statsData:', statsData ? 'exists' : 'none');

    // 如果有活跃token，并且当前没有loading状态，则刷新基本数据
    // 这主要是为了处理token切换的情况
    if (activeToken?.token && !isStatsLoading) {
      console.log('Dashboard: Active token changed, refreshing basic stats...');
      refreshBasicStats().catch((error) => {
        console.warn('Failed to refresh basic stats on token change:', error);
      });
    }
  }, [activeToken?.token]); // 仅依赖token的变化

  // 组件初始化时强制重新加载tokens
  useEffect(() => {
    const { loadTokens } = useTokenStore.getState();
    console.log('Dashboard: Force reload tokens on mount');
    loadTokens();
  }, []);

  // API调用现在由AppLayout中的导航切换处理

  // 生成仪表板统计数据
  const dashboardStats = generateDashboardStats(statsData, currentPeriodData);

  /**
   * Debug: 检查localStorage状态
   */
  const debugLocalStorage = () => {
    console.log('=== localStorage Debug ===');
    console.log('claude_relay_tokens:', localStorage.getItem('claude_relay_tokens'));
    console.log('claude_relay_active_token:', localStorage.getItem('claude_relay_active_token'));
    console.log('All localStorage keys:', Object.keys(localStorage));

    // 手动调用tokenManager
    console.log('=== TokenManager Debug ===');
    const tokens = tokenManager.getTokens();
    const activeToken = tokenManager.getActiveToken();
    console.log('TokenManager.getTokens():', tokens);
    console.log('TokenManager.getActiveToken():', activeToken);
  };

  /**
   * 获取统计项的颜色类
   */
  const getStatColorClasses = (color: DashboardStat['color']) => {
    const colorMap = {
      orange: {
        bg: 'bg-orange-50 dark:bg-orange-900/20',
        border: 'border-orange-200 dark:border-orange-800',
        icon: 'text-orange-500 dark:text-orange-400',
        value: 'text-orange-600 dark:text-orange-400',
      },
      green: {
        bg: 'bg-green-50 dark:bg-green-900/20',
        border: 'border-green-200 dark:border-green-800',
        icon: 'text-green-500 dark:text-green-400',
        value: 'text-green-600 dark:text-green-400',
      },
      blue: {
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        border: 'border-blue-200 dark:border-blue-800',
        icon: 'text-blue-500 dark:text-blue-400',
        value: 'text-blue-600 dark:text-blue-400',
      },
      purple: {
        bg: 'bg-purple-50 dark:bg-purple-900/20',
        border: 'border-purple-200 dark:border-purple-800',
        icon: 'text-purple-500 dark:text-purple-400',
        value: 'text-purple-600 dark:text-purple-400',
      },
      red: {
        bg: 'bg-red-50 dark:bg-red-900/20',
        border: 'border-red-200 dark:border-red-800',
        icon: 'text-red-500 dark:text-red-400',
        value: 'text-red-600 dark:text-red-400',
      },
    };
    return colorMap[color];
  };

  /**
   * 处理Token添加完成
   */
  const handleTokenAdded = () => {
    setViewMode('overview');
  };

  /**
   * 渲染概览视图
   */
  const renderOverview = () => (
    <div className="space-y-8">
      {/* API Key信息卡片 */}
      {statsData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="p-6 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="mb-4 flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-500">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1721 9z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-blue-900">API Key 信息</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-blue-700">名称</span>
                  <span className="text-sm font-medium text-blue-900">{statsData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-blue-700">状态</span>
                  <span className={`text-sm font-medium ${statsData.isActive ? 'text-green-600' : 'text-red-600'}`}>
                    {statsData.isActive ? '已激活' : '未激活'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-blue-700">权限</span>
                  <span className="text-sm font-medium text-blue-900">
                    {statsData.permissions === 'all' ? '全部服务' : statsData.permissions}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-blue-700">创建时间</span>
                  <span className="text-sm font-medium text-blue-900">
                    {new Date(statsData.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-blue-700">过期时间</span>
                  <span className="text-sm font-medium text-blue-900">
                    {statsData.expiresAt ? new Date(statsData.expiresAt).toLocaleDateString() : '永不过期'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-blue-700">描述</span>
                  <span className="text-sm font-medium text-blue-900">
                    {statsData.description || '无'}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Token管理快速入口 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card className="p-6 border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="mb-3 flex items-center space-x-3">
                <div className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-800">
                  <span className="mr-2">🔑</span>
                  Token管理
                </div>
                {activeToken && statsData && (
                  <div className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                    <span className="mr-2">✅</span>
                    已连接
                  </div>
                )}
              </div>
              <h3 className="mb-2 text-lg font-semibold text-stone-900">
                {activeToken
                  ? `当前Token: ${activeToken.name}`
                  : '请添加API Token'}
              </h3>
              <p className="mb-4 text-stone-600">
                {activeToken
                  ? '您可以管理多个Token，切换激活状态，或添加新的API Token'
                  : '您需要添加SwiftCode的API Token才能查看统计数据'}
              </p>
            </div>
            <div className="flex space-x-3">
              <Button
                variant="primary"
                onClick={() => setViewMode('tokens')}
                className="bg-orange-500 hover:bg-orange-600"
              >
                {activeToken ? '管理Token' : '添加Token'}
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* 错误提示 */}
      {activeToken && statsError && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="p-6 border-red-200 bg-gradient-to-br from-red-50 to-pink-50">
            <div className="flex items-center space-x-3">
              <div className="rounded-lg bg-red-100 p-2 text-red-500">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="mb-1 text-sm font-semibold text-red-900">
                  加载统计数据失败
                </h3>
                <p className="text-sm text-red-700">{statsError}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => refreshBasicStats()}
                className="text-red-600 hover:text-red-700"
              >
                重试
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      {/* 使用统计概览 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-stone-900">使用统计概览</h2>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={debugLocalStorage}
              className="text-red-600 hover:text-red-700"
            >
              Debug
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/usage-stats')}
              className="text-blue-600 hover:text-blue-700"
            >
              查看详细统计 →
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {dashboardStats.map((stat, index) => {
            const colors = getStatColorClasses(stat.color);
            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              >
                <Card
                  className={cn(
                    'p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl',
                    colors.bg,
                    colors.border,
                    isStatsLoading && 'animate-pulse'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="mb-3 flex items-center space-x-3">
                        <div
                          className={cn(
                            'rounded-lg bg-white p-2 shadow-sm',
                            colors.icon
                          )}
                        >
                          {stat.icon}
                        </div>
                        <h3 className="text-sm font-medium text-stone-600">
                          {stat.title}
                        </h3>
                      </div>

                      <div className="mb-2">
                        {isStatsLoading ? (
                          <div className="h-8 animate-pulse rounded bg-stone-200"></div>
                        ) : (
                          <span
                            className={cn('text-3xl font-bold', colors.value)}
                          >
                            {stat.value}
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-stone-500">
                        {stat.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* 限制配置 */}
      {statsData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="p-6 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
            <div className="mb-4 flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg text-purple-500">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-purple-900">限制配置</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-purple-700">每日费用限制</h4>
                <div className="text-2xl font-bold text-purple-900">
                  {statsData.limits.dailyCostLimit > 0 ? `$${statsData.limits.dailyCostLimit.toFixed(6)}` : '无限制'}
                </div>
                <div className="text-xs text-purple-600">
                  已使用: ${statsData.limits.currentDailyCost.toFixed(6)}
                </div>
                {statsData.limits.dailyCostLimit > 0 && (
                  <div className="w-full bg-purple-200 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full"
                      style={{
                        width: `${Math.min((statsData.limits.currentDailyCost / statsData.limits.dailyCostLimit) * 100, 100)}%`
                      }}
                    ></div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-purple-700">并发限制</h4>
                <div className="text-2xl font-bold text-purple-900">
                  {statsData.limits.concurrencyLimit > 0 ? statsData.limits.concurrencyLimit : '无限制'}
                </div>
                <div className="text-xs text-purple-600">
                  同时请求数限制
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-purple-700">模型限制</h4>
                <div className="text-2xl font-bold text-purple-900">
                  {statsData.restrictions.enableModelRestriction ? '已启用' : '无限制'}
                </div>
                <div className="text-xs text-purple-600">
                  {statsData.restrictions.enableModelRestriction && statsData.restrictions.restrictedModels.length > 0
                    ? `禁用 ${statsData.restrictions.restrictedModels.length} 个模型`
                    : '允许访问所有模型'
                  }
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-purple-700">客户端限制</h4>
                <div className="text-2xl font-bold text-purple-900">
                  {statsData.restrictions.enableClientRestriction ? '已启用' : '无限制'}
                </div>
                <div className="text-xs text-purple-600">
                  {statsData.restrictions.enableClientRestriction && statsData.restrictions.allowedClients.length > 0
                    ? `允许 ${statsData.restrictions.allowedClients.length} 个客户端`
                    : '允许所有客户端访问'
                  }
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* 系统状态 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <Card className="border-stone-200 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-stone-900">系统状态</h3>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
              <span className="text-sm font-medium text-green-600">
                运行正常
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
            <div className="flex items-center justify-between rounded-lg bg-stone-50 p-3">
              <span className="text-stone-600">Token状态</span>
              <span
                className={cn(
                  'font-medium',
                  activeToken && statsData ? 'text-green-600' : 'text-orange-600'
                )}
              >
                {activeToken && statsData ? '已连接' : '未连接'}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-stone-50 p-3">
              <span className="text-stone-600">数据同步</span>
              <span
                className={cn(
                  'font-medium',
                  isStatsLoading ? 'text-orange-600' : 'text-green-600'
                )}
              >
                {isStatsLoading ? '同步中' : '已同步'}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-stone-50 p-3">
              <span className="text-stone-600">API服务</span>
              <span
                className={cn(
                  'font-medium',
                  'text-green-600'
                )}
              >
                {statsError ? '就绪' : '正常'}
              </span>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );

  /**
   * 渲染Token管理视图
   */
  const renderTokenManagement = () => (
    <div className="space-y-6">
      {/* 返回按钮 */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          variant="ghost"
          onClick={() => setViewMode('overview')}
          className="text-stone-600 hover:text-stone-900"
          icon={
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          }
        >
          返回概览
        </Button>
      </motion.div>

      {/* Token管理器 */}
      <div className="rounded-lg bg-white">
        <TokenManager onTokenAdded={handleTokenAdded} />
      </div>

      {/* 查看使用统计 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="border-stone-200 p-6">
          <div className="flex items-center justify-between">
            <div className="text-stone-600">查看详细模型与费用明细</div>
            <Button
              variant="primary"
              className="bg-orange-500 hover:bg-orange-600"
              onClick={() => navigate('/usage-stats')}
            >
              查看使用统计
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* 视图切换 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-4">
          <Button
            variant={viewMode === 'overview' ? 'primary' : 'ghost'}
            onClick={() => setViewMode('overview')}
            className={
              viewMode === 'overview' ? 'bg-orange-500 hover:bg-orange-600' : ''
            }
            icon={
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            }
          >
            概览
          </Button>
          <Button
            variant={viewMode === 'tokens' ? 'primary' : 'ghost'}
            onClick={() => setViewMode('tokens')}
            className={
              viewMode === 'tokens' ? 'bg-orange-500 hover:bg-orange-600' : ''
            }
            icon={
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1721 9z"
                />
              </svg>
            }
          >
            Token管理
          </Button>
        </div>
      </motion.div>

      {/* 主要内容 */}
      {viewMode === 'overview' ? renderOverview() : renderTokenManagement()}
    </div>
  );
};

export default DashboardPage;