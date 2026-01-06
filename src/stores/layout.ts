import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LayoutState {
  // 侧边栏状态
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;

  // 移动端状态
  isMobile: boolean;

  // 主题状态
  isDark: boolean;

  // 面包屑状态
  breadcrumbs: Array<{
    label: string;
    href?: string;
    icon?: React.ComponentType<any>;
  }>;

  // 通知状态
  notifications: Array<{
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    timestamp: Date;
    read: boolean;
  }>;

  // 操作方法
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebarCollapse: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setIsMobile: (mobile: boolean) => void;
  toggleTheme: () => void;
  setTheme: (dark: boolean) => void;
  setBreadcrumbs: (breadcrumbs: LayoutState['breadcrumbs']) => void;
  addNotification: (
    notification: Omit<
      LayoutState['notifications'][0],
      'id' | 'timestamp' | 'read'
    >
  ) => void;
  markNotificationRead: (id: string) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const useLayoutStore = create<LayoutState>()(
  persist(
    (set, get) => ({
      // 初始状态
      sidebarOpen: true,
      sidebarCollapsed: false,
      isMobile: false,
      isDark: false,
      breadcrumbs: [],
      notifications: [],

      // 侧边栏操作
      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebarCollapse: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

      // 移动端检测
      setIsMobile: (mobile) => set({ isMobile: mobile }),

      // 主题切换
      toggleTheme: () => {
        const newTheme = !get().isDark;
        set({ isDark: newTheme });
        document.documentElement.classList.toggle('dark', newTheme);
      },
      setTheme: (dark) => {
        set({ isDark: dark });
        document.documentElement.classList.toggle('dark', dark);
      },

      // 面包屑管理
      setBreadcrumbs: (breadcrumbs) => set({ breadcrumbs }),

      // 通知管理
      addNotification: (notification) => {
        const newNotification = {
          ...notification,
          id: Date.now().toString(),
          timestamp: new Date(),
          read: false,
        };
        set((state) => ({
          notifications: [newNotification, ...state.notifications].slice(0, 50), // 最多保留50条
        }));
      },
      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),
      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),
      clearNotifications: () => set({ notifications: [] }),
    }),
    {
      name: 'layout-store',
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        isDark: state.isDark,
      }),
    }
  )
);
