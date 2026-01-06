import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '@/services/auth';
import type { User } from '@/types';

interface AuthState {
  // 认证状态
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;

  // 权限
  permissions: string[];

  // 操作方法
  login: (credentials: { username: string; password: string }) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  checkAuth: () => Promise<boolean>;
  refreshToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // 初始状态
      isAuthenticated: false,
      user: null,
      token: null,
      loading: false,
      error: null,
      permissions: [],

      // 登录方法
      login: async (credentials) => {
        set({ loading: true, error: null });
        try {
          const response = await authService.login(credentials);

          if (response.success) {
            const user: User = {
              id: '1', // 临时ID，待后端返回实际用户信息
              username: response.username || credentials.username,
              email: '', // 待后端提供
              role: 'admin',
            };

            set({
              isAuthenticated: true,
              user,
              token: response.token,
              permissions: [],
              loading: false,
              error: null,
            });
          } else {
            throw new Error(response.message || '登录失败');
          }
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : '登录失败',
          });
          throw error;
        }
      },

      // 登出方法
      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
          token: null,
          permissions: [],
          error: null,
        });
      },

      // 设置用户信息
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      // 检查认证状态
      checkAuth: async () => {
        const { token } = get();
        if (!token) {
          return false;
        }

        try {
          // 使用admin dashboard来验证token，如原版Vue项目
          const response = await fetch('/admin/dashboard', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error('Token验证失败');
          }

          return true;
        } catch (error) {
          set({
            isAuthenticated: false,
            user: null,
            token: null,
            permissions: [],
          });
          return false;
        }
      },

      // 刷新Token
      refreshToken: async () => {
        try {
          const response = await authService.refreshToken();
          if (response.token) {
            set({ token: response.token });
          }
        } catch (error) {
          get().logout();
          throw error;
        }
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
