// API Stats 服务 - 基于原Vue.js实现的TypeScript版本

export interface ApiKeyIdResponse {
  success: boolean;
  data?: {
    id: string;
  };
  message?: string;
}

export interface UserStatsResponse {
  success: boolean;
  data?: UserStatsData;
  message?: string;
}

export interface UserStatsData {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  expiresAt: string | null;
  expirationMode: string;
  isActivated: boolean;
  activationDays: number;
  activatedAt: string | null;
  permissions: string;

  usage: {
    total: {
      requests: number;
      tokens: number;
      allTokens: number;
      inputTokens: number;
      outputTokens: number;
      cacheCreateTokens: number;
      cacheReadTokens: number;
      cost: number;
      formattedCost: string;
    };
  };

  limits: {
    tokenLimit: number;
    concurrencyLimit: number;
    rateLimitWindow: number;
    rateLimitRequests: number;
    rateLimitCost: number;
    dailyCostLimit: number;
    totalCostLimit: number;
    currentWindowRequests: number;
    currentWindowTokens: number;
    currentWindowCost: number;
    currentDailyCost: number;
    currentTotalCost: number;
    windowStartTime: string | null;
    windowEndTime: string | null;
    windowRemainingSeconds: number | null;
  };

  restrictions: {
    enableModelRestriction: boolean;
    restrictedModels: string[];
    enableClientRestriction: boolean;
    allowedClients: string[];
  };
}

export interface ModelStatsResponse {
  success: boolean;
  data?: ModelStatsData[];
  message?: string;
}

export interface ModelStatsData {
  model: string;
  requests: number;
  inputTokens: number;
  outputTokens: number;
  cacheCreateTokens: number;
  cacheReadTokens: number;
  allTokens: number;
  costs?: {
    total: number;
    input: number;
    output: number;
    cacheCreate: number;
    cacheRead: number;
  };
}

class ApiStatsClient {
  private baseURL: string;
  private isDev: boolean;

  constructor() {
    this.baseURL = window.location.origin;
    this.isDev = import.meta.env.DEV;
  }

  private async request<T>(url: string, options: RequestInit = {}): Promise<T> {
    try {
      // 在开发环境中，为 /admin 路径添加 /webapi 前缀
      if (this.isDev && url.startsWith('/admin')) {
        url = '/webapi' + url;
      }

      const response = await fetch(`${this.baseURL}${url}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `请求失败: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Stats request error:', error);
      throw error;
    }
  }

  // 获取 API Key ID
  async getKeyId(apiKey: string): Promise<ApiKeyIdResponse> {
    return this.request<ApiKeyIdResponse>('/apiStats/api/get-key-id', {
      method: 'POST',
      body: JSON.stringify({ apiKey })
    });
  }

  // 获取用户统计数据
  async getUserStats(apiId: string): Promise<UserStatsResponse> {
    return this.request<UserStatsResponse>('/apiStats/api/user-stats', {
      method: 'POST',
      body: JSON.stringify({ apiId })
    });
  }

  // 获取模型使用统计
  async getUserModelStats(apiId: string, period: 'daily' | 'monthly' = 'daily'): Promise<ModelStatsResponse> {
    return this.request<ModelStatsResponse>('/apiStats/api/user-model-stats', {
      method: 'POST',
      body: JSON.stringify({ apiId, period })
    });
  }

  // 批量查询统计数据
  async getBatchStats(apiIds: string[]) {
    return this.request('/apiStats/api/batch-stats', {
      method: 'POST',
      body: JSON.stringify({ apiIds })
    });
  }

  // 批量查询模型统计
  async getBatchModelStats(apiIds: string[], period: 'daily' | 'monthly' = 'daily') {
    return this.request('/apiStats/api/batch-model-stats', {
      method: 'POST',
      body: JSON.stringify({ apiIds, period })
    });
  }
}

export const apiStatsClient = new ApiStatsClient();

// 辅助函数
export const formatCost = (cost: number): string => {
  if (typeof cost !== 'number' || cost === 0) {
    return '$0.000000';
  }

  // 根据数值大小选择精度
  if (cost >= 1) {
    return '$' + cost.toFixed(2);
  } else if (cost >= 0.01) {
    return '$' + cost.toFixed(4);
  } else {
    return '$' + cost.toFixed(6);
  }
};

// 计算汇总数据
export const calculateSummaryStats = (modelData: ModelStatsData[]) => {
  const summary = {
    requests: 0,
    inputTokens: 0,
    outputTokens: 0,
    cacheCreateTokens: 0,
    cacheReadTokens: 0,
    allTokens: 0,
    cost: 0,
    formattedCost: '$0.000000'
  };

  modelData.forEach((model) => {
    summary.requests += model.requests || 0;
    summary.inputTokens += model.inputTokens || 0;
    summary.outputTokens += model.outputTokens || 0;
    summary.cacheCreateTokens += model.cacheCreateTokens || 0;
    summary.cacheReadTokens += model.cacheReadTokens || 0;
    summary.allTokens += model.allTokens || 0;
    summary.cost += model.costs?.total || 0;
  });

  summary.formattedCost = formatCost(summary.cost);

  return summary;
};