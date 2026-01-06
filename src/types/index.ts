// 基础类型定义
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface User extends BaseEntity {
  username: string;
  email?: string;
  role: 'admin' | 'user';
  isActive: boolean;
  lastLoginAt?: string;
}

export interface ApiKey extends BaseEntity {
  name: string;
  key: string;
  hashedKey: string;
  requestLimit: number;
  requestCount: number;
  isActive: boolean;
  lastUsedAt?: string;
  usage?: ApiKeyUsage;
  remainingRequests: number;
  user?: {
    id: string;
    username: string;
  };
}

export interface ApiKeyUsage {
  totalRequests: number;
  totalTokens: number;
  dailyStats: DailyUsageStats[];
  modelStats: ModelUsageStats[];
}

export interface DailyUsageStats {
  date: string;
  requests: number;
  tokens: number;
}

export interface ModelUsageStats {
  model: string;
  requests: number;
  tokens: number;
  cost: number;
}

export interface ClaudeAccount extends BaseEntity {
  name: string;
  description?: string;
  email: string;
  isActive: boolean;
  refreshToken: string;
  accessToken?: string;
  tokenExpiresAt?: string;
  scopes: string[];
  proxy?: ProxyConfig;
  lastRefreshAt?: string;
  status: 'active' | 'expired' | 'error' | 'refreshing';
  errorMessage?: string;
  usage?: AccountUsage;
}

export interface GeminiAccount extends BaseEntity {
  name: string;
  description?: string;
  apiKey: string;
  isActive: boolean;
  usage?: AccountUsage;
  lastUsedAt?: string;
}

export interface ProxyConfig {
  host: string;
  port: number;
  username?: string;
  password?: string;
  protocol: 'http' | 'https' | 'socks5';
}

export interface AccountUsage {
  totalRequests: number;
  totalTokens: number;
  dailyRequests: number;
  dailyTokens: number;
  lastUsedAt?: string;
}

export interface Usage {
  date: string;
  model: string;
  tokens: number;
  requests: number;
}

export interface SystemStats {
  totalRequests: number;
  totalTokens: number;
  activeAccounts: number;
  totalApiKeys: number;
  todayRequests: number;
  todayTokens: number;
  avgResponseTime: number;
  errorRate: number;
}

export interface DashboardStats {
  overview: {
    totalApiKeys: number;
    activeApiKeys: number;
    totalClaudeAccounts: number;
    activeClaudeAccounts: number;
    totalGeminiAccounts: number;
    activeGeminiAccounts: number;
    totalRequests: number;
    totalTokens: number;
  };
  todayStats: {
    requests: number;
    tokens: number;
    errors: number;
    avgResponseTime: number;
  };
  recentActivity: ActivityLog[];
  chartData: {
    requestsChart: ChartData;
    tokensChart: ChartData;
    errorsChart: ChartData;
  };
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  type: 'api_request' | 'account_refresh' | 'key_created' | 'error';
  message: string;
  details?: Record<string, any>;
  severity: 'info' | 'warning' | 'error' | 'success';
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
    fill?: boolean;
  }[];
}

// API 响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// 认证相关类型
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  expiresAt: string;
}

// 表单类型
export interface CreateApiKeyForm {
  name: string;
  requestLimit: number;
  userId?: string;
}

export interface CreateClaudeAccountForm {
  name: string;
  description?: string;
  proxy?: ProxyConfig;
  authorizationCode: string;
  codeVerifier: string;
}

export interface CreateGeminiAccountForm {
  name: string;
  description?: string;
  apiKey: string;
}

export interface LoginForm {
  username: string;
  password: string;
}

// 通知类型
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  persistent?: boolean;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  label: string;
  action: () => void;
  type?: 'primary' | 'secondary';
}

// 主题类型
export type Theme = 'light' | 'dark' | 'system';

export interface ThemeConfig {
  mode: Theme;
  primaryColor: string;
  borderRadius: 'none' | 'small' | 'medium' | 'large';
  fontSize: 'small' | 'medium' | 'large';
  useSystemPreference: boolean;
}

// 路由类型
export interface RouteConfig {
  path: string;
  component: React.ComponentType;
  title: string;
  icon?: React.ComponentType;
  children?: RouteConfig[];
  protected?: boolean;
  roles?: string[];
}

// 表格相关类型
export interface TableColumn<T = any> {
  key: keyof T;
  title: string;
  width?: string;
  sortable?: boolean;
  render?: (value: any, record: T) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
}

export interface TableProps<T = any> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
  rowKey?: keyof T | ((record: T) => string);
  onRow?: (record: T) => {
    onClick?: () => void;
    onDoubleClick?: () => void;
  };
}

// 常量定义
export const API_ENDPOINTS = {
  // 认证相关
  LOGIN: '/admin/login',
  LOGOUT: '/admin/logout',

  // API Keys
  API_KEYS: '/admin/api-keys',
  API_KEY_DETAIL: (id: string) => `/admin/api-keys/${id}`,

  // Claude 账户
  CLAUDE_ACCOUNTS: '/admin/claude-accounts',
  CLAUDE_ACCOUNT_DETAIL: (id: string) => `/admin/claude-accounts/${id}`,
  CLAUDE_AUTH_URL: '/admin/claude-accounts/generate-auth-url',
  CLAUDE_EXCHANGE_CODE: '/admin/claude-accounts/exchange-code',

  // Gemini 账户
  GEMINI_ACCOUNTS: '/admin/gemini-accounts',
  GEMINI_ACCOUNT_DETAIL: (id: string) => `/admin/gemini-accounts/${id}`,

  // 仪表板
  DASHBOARD: '/admin/dashboard',

  // 统计数据
  STATS: '/admin/stats',
  USAGE: '/admin/usage',

  // 用户管理
  USERS: '/admin/users',
  USER_DETAIL: (id: string) => `/admin/users/${id}`,
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// 导出类型联合
export type Entity = ApiKey | ClaudeAccount | GeminiAccount | User;
export type EntityType = 'apiKey' | 'claudeAccount' | 'geminiAccount' | 'user';
