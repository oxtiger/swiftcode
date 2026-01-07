import { create } from 'zustand';
import {
  apiStatsClient,
  calculateSummaryStats,
} from '@/services/apiStats';
import type { UserStatsData, ModelStatsData } from '@/services/apiStats';
import { useTokenStore } from './tokenStore';

interface ApiStatsState {
  // 状态
  loading: boolean;
  modelStatsLoading: boolean;
  error: string;
  statsPeriod: 'daily' | 'monthly';

  // 数据
  apiId: string | null; // 新增: 保存当前查询的 apiId
  statsData: UserStatsData | null;
  modelStats: ModelStatsData[];
  dailyStats: any | null;
  monthlyStats: any | null;

  // 计算属性
  currentPeriodData: any;
  usagePercentages: {
    tokenUsage: number;
    costUsage: number;
    requestUsage: number;
  };
}

interface ApiStatsActions {
  // 查询统计数据 - 基于Token直接查询
  queryStatsWithToken: (token: string) => Promise<void>;

  // 获取基本信息 - token添加后立即调用
  fetchBasicInfo: (token: string) => Promise<void>;

  // 刷新基本统计数据 (仪表板用)
  refreshBasicStats: () => Promise<void>;

  // 刷新详细统计数据 (使用统计页面用)
  refreshDetailedStats: () => Promise<void>;

  // 切换时间范围
  switchPeriod: (period: 'daily' | 'monthly') => Promise<void>;

  // 清除数据
  clearData: () => void;

  // 重置状态
  reset: () => void;

  // 内部方法
  loadModelStats: (apiId: string, period: 'daily' | 'monthly') => Promise<void>;
  loadPeriodStats: (
    apiId: string,
    period: 'daily' | 'monthly'
  ) => Promise<void>;
}

type ApiStatsStore = ApiStatsState & ApiStatsActions;

const defaultUsagePercentages = {
  tokenUsage: 0,
  costUsage: 0,
  requestUsage: 0,
};

const defaultPeriodData = {
  requests: 0,
  inputTokens: 0,
  outputTokens: 0,
  cacheCreateTokens: 0,
  cacheReadTokens: 0,
  allTokens: 0,
  cost: 0,
  formattedCost: '$0.000000',
};

export const useApiStatsStore = create<ApiStatsStore>((set, get) => ({
  // 初始状态
  loading: false,
  modelStatsLoading: false,
  error: '',
  statsPeriod: 'daily',

  apiId: null, // 新增: 初始化 apiId
  statsData: null,
  modelStats: [],
  dailyStats: null,
  monthlyStats: null,

  currentPeriodData: defaultPeriodData,
  usagePercentages: defaultUsagePercentages,

  // 获取基本信息 - token添加后立即调用
  fetchBasicInfo: async (token: string) => {
    if (!token.trim()) {
      set({ error: '请输入 API Token' });
      return;
    }

    set({ loading: true, error: '' });

    try {
      // 1. 获取 API Key ID
      const idResult = await apiStatsClient.getKeyId(token);
      if (!idResult.success || !idResult.data) {
        throw new Error(idResult.message || '获取 API Key ID 失败');
      }

      const apiId = idResult.data.id;

      // 2. 获取用户统计数据
      const statsResult = await apiStatsClient.getUserStats(apiId);
      if (!statsResult.success || !statsResult.data) {
        throw new Error(statsResult.message || '查询统计数据失败');
      }

      set({
        apiId: apiId, // 保存 apiId
        statsData: statsResult.data,
        loading: false,
        error: '',
      });
    } catch (err) {
      console.error('Fetch basic info error:', err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : '获取基本信息失败，请检查您的 API Token 是否正确';
      set({ error: errorMessage, loading: false });
    }
  },

  // 查询统计数据 - 基于Token直接查询
  queryStatsWithToken: async (token: string) => {
    if (!token.trim()) {
      set({ error: '请输入 API Token' });
      return;
    }

    set({
      loading: true,
      error: '',
      statsData: null,
      modelStats: [],
      dailyStats: null,
      monthlyStats: null,
    });

    try {
      // 1. 获取 API Key ID
      const idResult = await apiStatsClient.getKeyId(token);

      if (!idResult.success || !idResult.data) {
        throw new Error(idResult.message || '获取 API Key ID 失败');
      }

      const apiId = idResult.data.id;

      // 2. 获取用户统计数据
      const statsResult = await apiStatsClient.getUserStats(apiId);

      if (!statsResult.success || !statsResult.data) {
        throw new Error(statsResult.message || '查询统计数据失败');
      }

      set({
        apiId: apiId, // 保存 apiId
        statsData: statsResult.data
      });

      // 3. 并行加载今日和本月的统计数据
      await Promise.all([
        get().loadPeriodStats(apiId, 'daily'),
        get().loadPeriodStats(apiId, 'monthly'),
      ]);

      // 4. 加载当前时间段的模型统计
      await get().loadModelStats(apiId, get().statsPeriod);

      // 5. 更新计算属性
      const { statsPeriod, dailyStats, monthlyStats, statsData } = get();

      // 更新 currentPeriodData
      let currentPeriodData;
      if (statsPeriod === 'daily') {
        currentPeriodData = dailyStats || defaultPeriodData;
      } else {
        currentPeriodData = monthlyStats || defaultPeriodData;
      }

      // 计算使用百分比
      let usagePercentages = defaultUsagePercentages;
      if (statsData && currentPeriodData) {
        const current = currentPeriodData;
        const limits = statsData.limits;

        usagePercentages = {
          tokenUsage:
            limits.tokenLimit > 0
              ? Math.min((current.allTokens / limits.tokenLimit) * 100, 100)
              : 0,
          costUsage:
            limits.dailyCostLimit > 0
              ? Math.min((limits.currentDailyCost / limits.dailyCostLimit) * 100, 100)
              : 0,
          requestUsage:
            limits.rateLimitRequests > 0
              ? Math.min(
                  (limits.currentWindowRequests / limits.rateLimitRequests) * 100,
                  100
                )
              : 0,
        };
      }

      set({ currentPeriodData, usagePercentages });

      set({ error: '' });
    } catch (err) {
      console.error('Query stats error:', err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : '查询统计数据失败，请检查您的 API Token 是否正确';
      set({
        error: errorMessage,
        statsData: null,
        modelStats: [],
        dailyStats: null,
        monthlyStats: null,
      });
    } finally {
      set({ loading: false });
    }
  },

  // 加载指定时间段的统计数据
  loadPeriodStats: async (apiId: string, period: 'daily' | 'monthly') => {
    try {
      const result = await apiStatsClient.getUserModelStats(apiId, period);

      if (result.success && result.data) {
        const summary = calculateSummaryStats(result.data);

        if (period === 'daily') {
          set({ dailyStats: summary });
        } else {
          set({ monthlyStats: summary });
        }
      } else {
        console.warn(`Failed to load ${period} stats:`, result.message);
      }
    } catch (err) {
      console.error(`Load ${period} stats error:`, err);
    }
  },

  // 加载模型统计数据
  loadModelStats: async (
    apiId: string,
    period: 'daily' | 'monthly' = 'daily'
  ) => {
    set({ modelStatsLoading: true });

    try {
      const result = await apiStatsClient.getUserModelStats(apiId, period);

      if (result.success && result.data) {
        set({ modelStats: result.data });
      } else {
        throw new Error(result.message || '加载模型统计失败');
      }
    } catch (err) {
      console.error('Load model stats error:', err);
      set({ modelStats: [] });
    } finally {
      set({ modelStatsLoading: false });
    }
  },

  // 切换时间范围
  switchPeriod: async (period: 'daily' | 'monthly') => {
    const currentPeriod = get().statsPeriod;
    const isLoading = get().modelStatsLoading;
    const apiId = get().apiId;

    if (currentPeriod === period || isLoading) {
      return;
    }

    set({ statsPeriod: period });

    // 如果有 apiId，重新加载对应时间段的数据
    if (apiId) {
      await Promise.all([
        get().loadModelStats(apiId, period),
        get().loadPeriodStats(apiId, period)
      ]);
    }

    // 更新计算属性
    const { statsPeriod: newPeriod, dailyStats, monthlyStats } = get();

    // 更新 currentPeriodData
    let currentPeriodData;
    if (newPeriod === 'daily') {
      currentPeriodData = dailyStats || defaultPeriodData;
    } else {
      currentPeriodData = monthlyStats || defaultPeriodData;
    }

    // 计算使用百分比
    let usagePercentages = defaultUsagePercentages;
    if (statsData && currentPeriodData) {
      const current = currentPeriodData;
      const limits = statsData.limits;

      usagePercentages = {
        tokenUsage:
          limits.tokenLimit > 0
            ? Math.min((current.allTokens / limits.tokenLimit) * 100, 100)
            : 0,
        costUsage:
          limits.dailyCostLimit > 0
            ? Math.min((limits.currentDailyCost / limits.dailyCostLimit) * 100, 100)
            : 0,
        requestUsage:
          limits.rateLimitRequests > 0
            ? Math.min((limits.currentWindowRequests / limits.rateLimitRequests) * 100, 100)
            : 0,
      };
    }

    set({ currentPeriodData, usagePercentages });
  },

  // 清除数据
  clearData: () => {
    set({
      apiId: null, // 清除 apiId
      statsData: null,
      modelStats: [],
      dailyStats: null,
      monthlyStats: null,
      error: '',
      currentPeriodData: defaultPeriodData,
      usagePercentages: defaultUsagePercentages,
    });
  },

  // 重置状态
  reset: () => {
    set({
      loading: false,
      modelStatsLoading: false,
      error: '',
      statsPeriod: 'daily',
      apiId: null, // 重置 apiId
      statsData: null,
      modelStats: [],
      dailyStats: null,
      monthlyStats: null,
      currentPeriodData: defaultPeriodData,
      usagePercentages: defaultUsagePercentages,
    });
  },

  // 刷新基本统计数据 (仪表板用)
  refreshBasicStats: async () => {
    const activeToken = useTokenStore.getState().activeToken;
    console.log('refreshBasicStats - activeToken:', activeToken ? 'exists' : 'none');
    if (!activeToken) {
      set({ error: '请先添加 API Token' });
      return;
    }

    set({ loading: true, error: '' });

    try {
      // 1. 获取 API Key ID
      const idResult = await apiStatsClient.getKeyId(activeToken.token);
      console.log('refreshBasicStats - getKeyId result:', idResult);
      if (!idResult.success || !idResult.data) {
        throw new Error(idResult.message || '获取 API Key ID 失败');
      }

      const apiId = idResult.data.id;

      // 2. 获取基本统计数据
      const statsResult = await apiStatsClient.getUserStats(apiId);
      console.log('refreshBasicStats - getUserStats result:', statsResult);
      if (!statsResult.success || !statsResult.data) {
        throw new Error(statsResult.message || '获取统计数据失败');
      }

      // 3. 同时获取今日数据 (仪表板需要显示今日统计)
      await get().loadPeriodStats(apiId, 'daily');

      set({
        apiId: apiId, // 保存 apiId
        statsData: statsResult.data,
        loading: false,
      });

      console.log('refreshBasicStats - statsData and dailyStats set successfully');
    } catch (err) {
      console.error('Refresh basic stats error:', err);
      const errorMessage =
        err instanceof Error ? err.message : '刷新基本统计数据失败';
      set({ error: errorMessage, loading: false });
    }
  },

  // 刷新详细统计数据 (使用统计页面用)
  refreshDetailedStats: async () => {
    const activeToken = useTokenStore.getState().activeToken;
    if (!activeToken) {
      set({ error: '请先添加 API Token' });
      return;
    }

    const { statsPeriod, apiId: savedApiId } = get();
    set({ modelStatsLoading: true, error: '' });

    try {
      let apiId = savedApiId;

      // 如果没有保存的 apiId，则重新获取
      if (!apiId) {
        const idResult = await apiStatsClient.getKeyId(activeToken.token);
        if (!idResult.success || !idResult.data) {
          throw new Error(idResult.message || '获取 API Key ID 失败');
        }
        apiId = idResult.data.id;
        set({ apiId }); // 保存 apiId
      }

      // 获取模型统计数据和时间段统计
      await Promise.all([
        get().loadModelStats(apiId, statsPeriod),
        get().loadPeriodStats(apiId, statsPeriod)
      ]);

      set({ modelStatsLoading: false });
    } catch (err) {
      console.error('Refresh detailed stats error:', err);
      const errorMessage =
        err instanceof Error ? err.message : '刷新详细统计数据失败';
      set({ error: errorMessage, modelStatsLoading: false });
    }
  },
}));

// 选择器
export const useApiStatsLoading = () =>
  useApiStatsStore((state) => state.loading);
export const useApiStatsError = () => useApiStatsStore((state) => state.error);
export const useStatsData = () => useApiStatsStore((state) => state.statsData);
export const useModelStats = () =>
  useApiStatsStore((state) => state.modelStats);
export const useCurrentPeriodData = () =>
  useApiStatsStore((state) => state.currentPeriodData);
export const useDailyStats = () =>
  useApiStatsStore((state) => state.dailyStats); // 新增: 导出今日统计数据
export const useMonthlyStats = () =>
  useApiStatsStore((state) => state.monthlyStats); // 新增: 导出本月统计数据
export const useUsagePercentages = () =>
  useApiStatsStore((state) => state.usagePercentages);
export const useStatsPeriod = () =>
  useApiStatsStore((state) => state.statsPeriod);

// Actions
export const useApiStatsActions = () =>
  useApiStatsStore((state) => ({
    queryStatsWithToken: state.queryStatsWithToken,
    fetchBasicInfo: state.fetchBasicInfo,
    refreshBasicStats: state.refreshBasicStats,
    refreshDetailedStats: state.refreshDetailedStats,
    switchPeriod: state.switchPeriod,
    clearData: state.clearData,
    reset: state.reset,
  }));
