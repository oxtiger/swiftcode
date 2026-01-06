import axios, { AxiosResponse, AxiosError } from 'axios';
import type { ApiResponse } from '@/types';
import { useAuthStore } from '@/stores/auth';

// 创建 axios 实例
const api = axios.create({
  baseURL: '/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 创建管理员 API 实例
const adminApi = axios.create({
  baseURL: '/admin',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 添加认证头
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

adminApi.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理错误
const handleResponse = (response: AxiosResponse) => {
  return response.data;
};

const handleError = (error: AxiosError) => {
  if (error.response?.status === 401) {
    // 未授权，清除认证状态
    useAuthStore.getState().logout();
    window.location.href = '/login';
  }

  const errorMessage =
    (error.response?.data as any)?.message || error.message || '网络请求失败';

  return Promise.reject(new Error(errorMessage));
};

api.interceptors.response.use(handleResponse, handleError);
adminApi.interceptors.response.use(handleResponse, handleError);

// 导出 API 实例
export { api, adminApi };

// 通用请求方法
export const apiRequest = {
  get: <T = any>(url: string, params?: any): Promise<ApiResponse<T>> =>
    api.get(url, { params }),

  post: <T = any>(url: string, data?: any): Promise<ApiResponse<T>> =>
    api.post(url, data),

  put: <T = any>(url: string, data?: any): Promise<ApiResponse<T>> =>
    api.put(url, data),

  delete: <T = any>(url: string): Promise<ApiResponse<T>> => api.delete(url),

  patch: <T = any>(url: string, data?: any): Promise<ApiResponse<T>> =>
    api.patch(url, data),
};

// 管理员请求方法
export const adminRequest = {
  get: <T = any>(url: string, params?: any): Promise<ApiResponse<T>> =>
    adminApi.get(url, { params }),

  post: <T = any>(url: string, data?: any): Promise<ApiResponse<T>> =>
    adminApi.post(url, data),

  put: <T = any>(url: string, data?: any): Promise<ApiResponse<T>> =>
    adminApi.put(url, data),

  delete: <T = any>(url: string): Promise<ApiResponse<T>> =>
    adminApi.delete(url),

  patch: <T = any>(url: string, data?: any): Promise<ApiResponse<T>> =>
    adminApi.patch(url, data),
};
