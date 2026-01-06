import axios from 'axios';
import type { User, LoginForm } from '@/types';

export interface LoginResponse {
  user: User;
  token: string;
  success: boolean;
  username?: string;
  message?: string;
}

// 创建专门的auth API实例
const authApi = axios.create({
  baseURL: '/web',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authService = {
  // 登录
  login: async (credentials: LoginForm): Promise<LoginResponse> => {
    const response = await authApi.post<LoginResponse>(
      '/auth/login',
      credentials
    );
    return response.data;
  },

  // 登出
  logout: async (): Promise<void> => {
    // 这里可以根据后端实际API调整
    await authApi.post('/auth/logout');
  },

  // 获取当前用户信息
  me: async (): Promise<User> => {
    const response = await authApi.get<User>('/auth/user');
    return response.data;
  },

  // 刷新令牌
  refreshToken: async (): Promise<LoginResponse> => {
    const response = await authApi.post<LoginResponse>('/auth/refresh-token');
    return response.data;
  },

  // 修改密码
  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void> => {
    await authApi.post('/auth/change-password', data);
  },
};
