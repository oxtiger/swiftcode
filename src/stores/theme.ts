import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Theme } from '@/types';

interface ThemeState {
  theme: Theme;
  actualTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

// 获取系统主题
const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

// 计算实际主题
const getActualTheme = (theme: Theme): 'light' | 'dark' => {
  return theme === 'system' ? getSystemTheme() : theme;
};

// 应用主题到文档
const applyTheme = (actualTheme: 'light' | 'dark') => {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;

  if (actualTheme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      actualTheme: getSystemTheme(),

      setTheme: (theme: Theme) => {
        const actualTheme = getActualTheme(theme);
        applyTheme(actualTheme);
        set({ theme, actualTheme });
      },

      toggleTheme: () => {
        const { theme } = get();
        if (theme === 'system') {
          const systemTheme = getSystemTheme();
          const newTheme = systemTheme === 'dark' ? 'light' : 'dark';
          get().setTheme(newTheme);
        } else {
          const newTheme = theme === 'dark' ? 'light' : 'dark';
          get().setTheme(newTheme);
        }
      },
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          // 重新计算实际主题并应用
          const actualTheme = getActualTheme(state.theme);
          state.actualTheme = actualTheme;
          applyTheme(actualTheme);

          // 监听系统主题变化
          if (typeof window !== 'undefined') {
            const mediaQuery = window.matchMedia(
              '(prefers-color-scheme: dark)'
            );
            const handleChange = () => {
              if (state.theme === 'system') {
                const newActualTheme = getSystemTheme();
                state.actualTheme = newActualTheme;
                applyTheme(newActualTheme);
              }
            };
            mediaQuery.addEventListener('change', handleChange);

            // 清理函数
            return () => mediaQuery.removeEventListener('change', handleChange);
          }
        }
      },
    }
  )
);

// 初始化主题
if (typeof window !== 'undefined') {
  const store = useThemeStore.getState();
  applyTheme(store.actualTheme);
}
