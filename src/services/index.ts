import { apiClient } from './api';
import type { User, ApiKey, ClaudeAccount, SystemStats } from '@/types';

// 认证相关
export const authService = {
  login: (credentials: { username: string; password: string }) =>
    apiClient.post<{ user: User; token: string }>('/admin/login', credentials),

  logout: () => apiClient.post('/admin/logout'),

  getCurrentUser: () => apiClient.get<User>('/admin/profile'),
};

// API Key 管理
export const apiKeyService = {
  getApiKeys: () => apiClient.get<ApiKey[]>('/admin/api-keys'),

  createApiKey: (data: { name: string; limit: number }) =>
    apiClient.post<ApiKey>('/admin/api-keys', data),

  updateApiKey: (id: string, data: Partial<ApiKey>) =>
    apiClient.put<ApiKey>(`/admin/api-keys/${id}`, data),

  deleteApiKey: (id: string) => apiClient.delete(`/admin/api-keys/${id}`),

  regenerateApiKey: (id: string) =>
    apiClient.post<{ key: string }>(`/admin/api-keys/${id}/regenerate`),
};

// Claude 账户管理
export const claudeAccountService = {
  getAccounts: () => apiClient.get<ClaudeAccount[]>('/admin/claude-accounts'),

  createAccount: (
    data: Omit<ClaudeAccount, 'id' | 'createdAt' | 'updatedAt'>
  ) => apiClient.post<ClaudeAccount>('/admin/claude-accounts', data),

  updateAccount: (id: string, data: Partial<ClaudeAccount>) =>
    apiClient.put<ClaudeAccount>(`/admin/claude-accounts/${id}`, data),

  deleteAccount: (id: string) =>
    apiClient.delete(`/admin/claude-accounts/${id}`),

  generateAuthUrl: (data: { name: string; proxy?: any }) =>
    apiClient.post<{ authUrl: string; state: string }>(
      '/admin/claude-accounts/generate-auth-url',
      data
    ),

  exchangeCode: (data: { code: string; state: string }) =>
    apiClient.post<ClaudeAccount>('/admin/claude-accounts/exchange-code', data),

  refreshToken: (id: string) =>
    apiClient.post(`/admin/claude-accounts/${id}/refresh-token`),
};

// 系统统计
export const systemService = {
  getStats: () => apiClient.get<SystemStats>('/admin/dashboard'),

  getHealth: () => apiClient.get<{ status: string; uptime: number }>('/health'),

  getLogs: (params?: { level?: string; limit?: number }) =>
    apiClient.get<{ logs: any[] }>('/admin/logs', { params }),
};
