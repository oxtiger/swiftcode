import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from 'recharts';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils';
import { useActiveToken } from '@/stores/tokenStore';
import {
  useApiStatsLoading,
  useApiStatsError,
  useStatsData,
  useCurrentPeriodData,
  useStatsPeriod,
  useModelStats,
  useApiStatsActions,
} from '@/stores/apiStatsStore';

/**
 * Token使用分布类型
 */
interface TokenDistribution {
  inputTokens: number;
  outputTokens: number;
  cacheCreateTokens: number;
  cacheReadTokens: number;
  totalTokens: number;
}

/**
 * 模型使用统计项接口
 */
interface ModelStat {
  model: string;
  inputTokens: number;
  outputTokens: number;
  cacheCreateTokens: number;
  cacheReadTokens: number;
  allTokens: number;
  requests: number;
  cost: number;
  formattedCost: string;
}

/**
 * UsageStatsPage - 使用统计页面组件
 *
 * 基于原始Vue.js实现重构，提供详细的API使用统计信息
 */
export const UsageStatsPage: React.FC = () => {
  // Token和API状态
  const activeToken = useActiveToken();
  const isStatsLoading = useApiStatsLoading();
  const statsError = useApiStatsError();
  const statsData = useStatsData();
  const currentPeriodData = useCurrentPeriodData();
  const statsPeriod = useStatsPeriod();
  const modelStats = useModelStats();
  const { refreshDetailedStats, switchPeriod } = useApiStatsActions();

  // 组件加载时检查并刷新数据（仅当token变化时）
  useEffect(() => {
    // 如果有活跃token，并且当前没有loading状态，则刷新详细数据
    // 这主要是为了处理token切换的情况
    if (activeToken?.token && !isStatsLoading) {
      console.log(
        'UsageStats: Active token changed, refreshing detailed stats...'
      );
      refreshDetailedStats().catch((error) => {
        console.warn(
          'Failed to refresh detailed stats on token change:',
          error
        );
      });
    }
  }, [activeToken?.token]); // 仅依赖token的变化

  // API调用现在由AppLayout中的导航切换处理

  // 时间范围切换处理
  const handleTimeRangeChange = async (newPeriod: 'daily' | 'monthly') => {
    await switchPeriod(newPeriod);
  };

  const timeRangeOptions = [
    { value: 'daily' as const, label: '今日', description: '24小时数据' },
    { value: 'monthly' as const, label: '本月', description: '30天数据' },
  ];

  /**
   * 获取Token使用分布
   */
  const getTokenDistribution = (): TokenDistribution => {
    if (!currentPeriodData) {
      return {
        inputTokens: 0,
        outputTokens: 0,
        cacheCreateTokens: 0,
        cacheReadTokens: 0,
        totalTokens: 0,
      };
    }

    return {
      inputTokens: currentPeriodData.inputTokens || 0,
      outputTokens: currentPeriodData.outputTokens || 0,
      cacheCreateTokens: currentPeriodData.cacheCreateTokens || 0,
      cacheReadTokens: currentPeriodData.cacheReadTokens || 0,
      totalTokens: currentPeriodData.allTokens || 0,
    };
  };

  /**
   * 生成模型使用统计数据
   */
  const generateModelStats = (): ModelStat[] => {
    if (!modelStats || modelStats.length === 0) {
      return [];
    }

    return modelStats.map((model) => ({
      model: model.model,
      inputTokens: model.inputTokens || 0,
      outputTokens: model.outputTokens || 0,
      cacheCreateTokens: model.cacheCreateTokens || 0,
      cacheReadTokens: model.cacheReadTokens || 0,
      allTokens: model.allTokens || 0,
      requests: model.requests || 0,
      cost: model.costs?.total || 0,
      formattedCost: model.costs?.total ? `$${model.costs.total.toFixed(6)}` : '$0.000000',
    }));
  };

  const tokenDistribution = getTokenDistribution();
  const processedModelStats = generateModelStats();

  /**
   * 生成Token分布饼图数据
   */
  const generateTokenPieData = () => {
    const distribution = getTokenDistribution();
    const data = [
      { name: '输入Token', value: distribution.inputTokens, color: '#3b82f6' },
      { name: '输出Token', value: distribution.outputTokens, color: '#10b981' },
      { name: '缓存创建', value: distribution.cacheCreateTokens, color: '#8b5cf6' },
      { name: '缓存读取', value: distribution.cacheReadTokens, color: '#f97316' },
    ].filter(item => item.value > 0);

    return data;
  };

  /**
   * 生成模型使用条形图数据
   */
  const generateModelBarData = () => {
    return processedModelStats.slice(0, 8).map(stat => ({
      model: stat.model.length > 15 ? stat.model.substring(0, 15) + '...' : stat.model,
      fullModel: stat.model,
      requests: stat.requests,
      inputTokens: stat.inputTokens,
      outputTokens: stat.outputTokens,
      totalTokens: stat.allTokens,
      cost: stat.cost,
    }));
  };

  /**
   * 生成费用趋势图数据（模拟数据，实际应从API获取）
   */
  const generateCostTrendData = () => {
    const now = new Date();
    const data = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);

      // 模拟数据，实际应从API获取
      const dayData = {
        date: date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }),
        fullDate: date.toISOString().split('T')[0],
        cost: Math.random() * (currentPeriodData?.cost || 1),
        requests: Math.floor(Math.random() * (currentPeriodData?.requests || 100)),
        tokens: Math.floor(Math.random() * (currentPeriodData?.allTokens || 10000)),
      };

      data.push(dayData);
    }

    return data;
  };

  /**
   * 渲染Token使用分布
   */
  const renderTokenDistribution = () => {
    if (!currentPeriodData) {
      return (
        <Card className="animate-pulse p-6">
          <div className="mb-4 h-6 rounded bg-stone-200"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 rounded bg-stone-200"></div>
                <div className="h-2 rounded bg-stone-100"></div>
              </div>
            ))}
          </div>
        </Card>
      );
    }

    const tokenTypes = [
      {
        name: '输入Token',
        value: tokenDistribution.inputTokens,
        color: 'bg-blue-500',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-600',
        percentage: tokenDistribution.totalTokens > 0
          ? (tokenDistribution.inputTokens / tokenDistribution.totalTokens * 100).toFixed(1)
          : '0',
      },
      {
        name: '输出Token',
        value: tokenDistribution.outputTokens,
        color: 'bg-green-500',
        bgColor: 'bg-green-50',
        textColor: 'text-green-600',
        percentage: tokenDistribution.totalTokens > 0
          ? (tokenDistribution.outputTokens / tokenDistribution.totalTokens * 100).toFixed(1)
          : '0',
      },
      {
        name: '缓存创建Token',
        value: tokenDistribution.cacheCreateTokens,
        color: 'bg-purple-500',
        bgColor: 'bg-purple-50',
        textColor: 'text-purple-600',
        percentage: tokenDistribution.totalTokens > 0
          ? (tokenDistribution.cacheCreateTokens / tokenDistribution.totalTokens * 100).toFixed(1)
          : '0',
      },
      {
        name: '缓存读取Token',
        value: tokenDistribution.cacheReadTokens,
        color: 'bg-orange-500',
        bgColor: 'bg-orange-50',
        textColor: 'text-orange-600',
        percentage: tokenDistribution.totalTokens > 0
          ? (tokenDistribution.cacheReadTokens / tokenDistribution.totalTokens * 100).toFixed(1)
          : '0',
      },
    ];

    return (
      <Card className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-stone-900">Token使用分布</h3>
          <div className="text-sm text-stone-600">
            总计: {tokenDistribution.totalTokens.toLocaleString()} Tokens
          </div>
        </div>

        <div className="space-y-6">
          {tokenTypes.map((token, index) => (
            <motion.div
              key={token.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={cn('rounded-lg p-4', token.bgColor)}
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={cn('h-3 w-3 rounded-full', token.color)}></div>
                  <span className="font-medium text-stone-900">{token.name}</span>
                </div>
                <div className="text-right">
                  <div className={cn('text-lg font-bold', token.textColor)}>
                    {token.value.toLocaleString()}
                  </div>
                  <div className="text-sm text-stone-500">{token.percentage}%</div>
                </div>
              </div>

              <div className="relative h-2 rounded-full bg-stone-200">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${token.percentage}%` }}
                  transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                  className={cn('h-2 rounded-full', token.color)}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {tokenDistribution.totalTokens === 0 && (
          <div className="py-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-stone-100">
              <svg
                className="h-8 w-8 text-stone-400"
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
            </div>
            <h3 className="mb-2 text-lg font-semibold text-stone-900">暂无Token使用数据</h3>
            <p className="text-stone-600">选择的时间范围内没有Token使用记录</p>
          </div>
        )}
      </Card>
    );
  };

  /**
   * 渲染使用趋势图表
   */
  const renderUsageTrendChart = () => {
    const pieData = generateTokenPieData();
    const barData = generateModelBarData();
    const trendData = generateCostTrendData();

    if (!currentPeriodData || processedModelStats.length === 0) {
      return (
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-stone-900">使用统计图表</h3>
          <div className="flex h-64 items-center justify-center rounded-lg bg-stone-50">
            <div className="text-center text-stone-500">
              <svg
                className="mx-auto mb-3 h-12 w-12"
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
              <p className="text-sm">暂无统计数据</p>
            </div>
          </div>
        </Card>
      );
    }

    return (
      <div className="space-y-6">
        {/* Token分布饼图 */}
        <Card className="p-6">
          <h3 className="mb-6 text-lg font-semibold text-stone-900">Token使用分布</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={60}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [value.toLocaleString(), 'Tokens']}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 模型使用条形图 */}
        <Card className="p-6">
          <h3 className="mb-6 text-lg font-semibold text-stone-900">模型使用统计</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="model"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === 'requests') return [value.toLocaleString(), '请求次数'];
                    if (name === 'totalTokens') return [value.toLocaleString(), 'Token总数'];
                    return [value, name];
                  }}
                  labelFormatter={(label, payload) => {
                    const data = payload?.[0]?.payload;
                    return data?.fullModel || label;
                  }}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Bar dataKey="requests" fill="#f97316" name="请求次数" />
                <Bar dataKey="totalTokens" fill="#3b82f6" name="Token总数" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 费用趋势图 - 暂时隐藏，等待后端提供真实数据 */}
        {/* <Card className="p-6">
          <h3 className="mb-6 text-lg font-semibold text-stone-900">
            {statsPeriod === 'daily' ? '近7日' : '近30日'}费用趋势
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === 'cost') return [`$${Number(value).toFixed(6)}`, '费用'];
                    return [value, name];
                  }}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="cost"
                  stroke="#f97316"
                  fill="#f97316"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card> */}
      </div>
    );
  };

  /**
   * 渲染概览统计卡片
   */
  const renderOverviewCards = () => {
    if (!currentPeriodData) {
      return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse p-6">
              <div className="mb-2 h-4 rounded bg-stone-200"></div>
              <div className="mb-2 h-8 rounded bg-stone-200"></div>
              <div className="h-3 rounded bg-stone-200"></div>
            </Card>
          ))}
        </div>
      );
    }

    const overviewStats = [
      {
        title: 'API 请求总数',
        value: currentPeriodData.requests.toLocaleString(),
        description: `${statsPeriod === 'daily' ? '今日' : '本月'}请求次数`,
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
        color: 'orange',
      },
      {
        title: '输入Token',
        value: currentPeriodData.inputTokens.toLocaleString(),
        description: '输入Token总数',
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
        color: 'blue',
      },
      {
        title: '输出Token',
        value: currentPeriodData.outputTokens.toLocaleString(),
        description: '输出Token总数',
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
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        ),
        color: 'green',
      },
      {
        title: '总费用',
        value: currentPeriodData.formattedCost,
        description: '累计消费金额',
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
        color: 'purple',
      },
    ];

    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {overviewStats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Card className="p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="mb-3 flex items-center space-x-3">
                <div
                  className={cn(
                    'rounded-lg p-2',
                    stat.color === 'orange' && 'bg-orange-100 text-orange-500',
                    stat.color === 'blue' && 'bg-blue-100 text-blue-500',
                    stat.color === 'green' && 'bg-green-100 text-green-500',
                    stat.color === 'purple' && 'bg-purple-100 text-purple-500'
                  )}
                >
                  {stat.icon}
                </div>
                <h3 className="text-sm font-medium text-stone-600">
                  {stat.title}
                </h3>
              </div>
              <div className="mb-2">
                <span className="text-3xl font-bold text-stone-900">
                  {stat.value}
                </span>
              </div>
              <p className="text-sm text-stone-500">{stat.description}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    );
  };

  /**
   * 渲染模型使用统计表格
   */
  const renderModelStatsTable = () => {
    if (processedModelStats.length === 0) {
      return (
        <Card className="p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-stone-100">
            <svg
              className="h-8 w-8 text-stone-400"
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
          </div>
          <h3 className="mb-2 text-lg font-semibold text-stone-900">
            暂无模型使用数据
          </h3>
          <p className="text-stone-600">选择的时间范围内没有模型使用统计数据</p>
        </Card>
      );
    }

    return (
      <Card className="overflow-hidden">
        <div className="border-b border-stone-200 px-6 py-4">
          <h3 className="text-lg font-semibold text-stone-900">模型使用详情</h3>
          <p className="text-sm text-stone-600">各模型的详细使用统计和费用</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-stone-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-500">
                  模型
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-500">
                  请求次数
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-500">
                  输入Token
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-500">
                  输出Token
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-500">
                  缓存创建Token
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-500">
                  缓存读取Token
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-500">
                  总Token
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-500">
                  费用
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 bg-white">
              {processedModelStats.map((stat, index) => (
                <motion.tr
                  key={stat.model}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="hover:bg-stone-50"
                >
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm font-medium text-stone-900">
                      {stat.model}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-stone-900">
                      {stat.requests.toLocaleString()}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-blue-600">
                      {stat.inputTokens.toLocaleString()}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-green-600">
                      {stat.outputTokens.toLocaleString()}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-purple-600">
                      {stat.cacheCreateTokens.toLocaleString()}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-orange-600">
                      {stat.cacheReadTokens.toLocaleString()}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm font-medium text-stone-900">
                      {stat.allTokens.toLocaleString()}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm font-medium text-orange-600">
                      {stat.formattedCost}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Token状态提示 */}
      {(!activeToken || !statsData) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50 p-6">
            <div className="flex items-center space-x-3">
              <div className="rounded-lg bg-orange-100 p-2 text-orange-500">
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
                <h3 className="mb-1 text-sm font-semibold text-orange-900">
                  {!activeToken ? '请先添加API Token' : '正在加载Token数据'}
                </h3>
                <p className="text-sm text-orange-700">
                  {!activeToken
                    ? '您需要在仪表板中添加API Token才能查看使用统计'
                    : '正在获取API统计数据，请稍候...'
                  }
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* 时间范围选择器 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-8"
      >
        <Card className="border-stone-200 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-stone-900">
              统计时间范围
            </h2>
            {activeToken && statsData && (
              <div className="text-sm text-stone-600">
                当前Token:{' '}
                <span className="font-medium">{activeToken.name}</span>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            {timeRangeOptions.map((option) => (
              <Button
                key={option.value}
                variant={statsPeriod === option.value ? 'primary' : 'secondary'}
                onClick={() => handleTimeRangeChange(option.value)}
                className={cn(
                  'flex-1 sm:flex-initial',
                  statsPeriod === option.value
                    ? 'bg-orange-500 hover:bg-orange-600'
                    : ''
                )}
              >
                <div className="text-center">
                  <div className="font-medium">{option.label}</div>
                  <div className="text-xs opacity-75">{option.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* 错误提示 */}
      {activeToken && statsData && statsError && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <Card className="border-red-200 bg-gradient-to-br from-red-50 to-pink-50 p-6">
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
                onClick={() => refreshDetailedStats()}
                className="text-red-600 hover:text-red-700"
              >
                重试
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      {/* 统计概览卡片 */}
      {activeToken && statsData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          {renderOverviewCards()}
        </motion.div>
      )}

      {/* Token使用分布和使用统计图表 */}
      {activeToken && statsData && (
        <div className="space-y-8">
          {/* Token使用分布 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {renderTokenDistribution()}
          </motion.div>

          {/* 使用统计图表 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {renderUsageTrendChart()}
          </motion.div>
        </div>
      )}

      {/* 模型使用统计表格 */}
      {activeToken && statsData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8"
        >
          {renderModelStatsTable()}
        </motion.div>
      )}
    </div>
  );
};

export default UsageStatsPage;
