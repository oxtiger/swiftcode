import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { tokenManager, type ApiToken } from '@/services/tokenManager';
import { useApiStatsStore } from '@/stores/apiStatsStore';

/**
 * Token状态管理接口
 */
interface TokenState {
  // 状态
  tokens: ApiToken[];
  activeTokenId: string | null;
  activeToken: ApiToken | null; // 改为普通状态
  isLoading: boolean;
  error: string | null;

  // 计算属性
  tokenCount: number;

  // 操作方法
  loadTokens: () => void;
  addToken: (token: string) => Promise<{ success: boolean; error?: string }>; // 简化接口
  removeToken: (id: string) => Promise<{ success: boolean; error?: string }>;
  setActiveToken: (id: string) => Promise<{ success: boolean; error?: string }>;
  updateTokenName: (
    id: string,
    newName: string
  ) => Promise<{ success: boolean; error?: string }>;
  updateLastUsed: (id: string) => void;
  clearError: () => void;
  clearAllTokens: () => Promise<{ success: boolean; error?: string }>;

  // 内部方法
  _refreshState: () => void;
  _updateActiveToken: () => void; // 新增辅助方法
}

/**
 * Token Store - 使用Zustand管理Token状态
 * 自动同步localStorage，提供响应式状态管理
 */
export const useTokenStore = create<TokenState>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      // 初始状态
      tokens: [],
      activeTokenId: null,
      activeToken: null, // 改为普通状态
      isLoading: false,
      error: null,

      // 计算属性
      get tokenCount() {
        return get().tokens.length;
      },

      // 更新activeToken的辅助方法
      _updateActiveToken: () => {
        const { tokens, activeTokenId } = get();
        let activeToken: ApiToken | null = null;

        if (activeTokenId) {
          activeToken = tokens.find((t) => t.id === activeTokenId) || null;
        } else if (tokens.length > 0) {
          activeToken = tokens[0];
        }

        console.log('_updateActiveToken - setting activeToken:', activeToken?.name || 'none');
        set({ activeToken });
      },

      // 操作方法
      loadTokens: () => {
        console.log('TokenStore: Loading tokens...');
        set({ isLoading: true, error: null });
        try {
          const tokens = tokenManager.getTokens();
          const activeToken = tokenManager.getActiveToken();
          const activeTokenId = activeToken?.id || null;

          console.log('TokenStore: Loaded tokens count:', tokens.length);
          console.log('TokenStore: Active token ID:', activeTokenId);
          console.log('TokenStore: Active token name:', activeToken?.name || 'none');

          // 确保激活状态正确
          const updatedTokens = tokens.map((token) => ({
            ...token,
            isActive: token.id === activeTokenId,
          }));

          set({
            tokens: updatedTokens,
            activeTokenId,
            isLoading: false,
            error: null,
          });

          // 更新activeToken状态
          get()._updateActiveToken();

          console.log('TokenStore: Tokens loaded successfully');
        } catch (error) {
          console.error('Failed to load tokens:', error);
          set({
            tokens: [],
            activeTokenId: null,
            activeToken: null,
            isLoading: false,
            error: '加载Token失败',
          });
        }
      },

      addToken: async (token: string) => { // 只接收token参数
        set({ isLoading: true, error: null });

        try {
          // 1. 先调用后端API验证token并获取名称
          const { fetchBasicInfo } = useApiStatsStore.getState();
          await fetchBasicInfo(token);
          
          console.log('fetchBasicInfo result:', useApiStatsStore.getState().statsData);
          // 2. 获取statsData中的名称
          const statsData = useApiStatsStore.getState().statsData;
          if (!statsData) {
            throw new Error('无法获取Token信息，请检查Token是否正确');
          }

          // 3. 使用后端返回的名称保存token
          const result = tokenManager.addToken(statsData.name, token);

          if (result.success) {
            get()._refreshState();
            set({ isLoading: false });
            return { success: true };
          } else {
            set({ isLoading: false, error: result.error });
            return { success: false, error: result.error };
          }
        } catch (apiError) {
          console.error('Failed to validate token with backend:', apiError);
          const errorMessage = apiError instanceof Error ? apiError.message : 'Token验证失败，请检查Token是否正确';
          set({ isLoading: false, error: errorMessage });
          return { success: false, error: errorMessage };
        }
      },

      removeToken: async (id: string) => {
        set({ isLoading: true, error: null });

        const result = tokenManager.removeToken(id);

        if (result.success) {
          get()._refreshState();
          set({ isLoading: false });
          return { success: true };
        } else {
          set({ isLoading: false, error: result.error });
          return { success: false, error: result.error };
        }
      },

      setActiveToken: async (id: string) => {
        set({ isLoading: true, error: null });

        const result = tokenManager.setActiveToken(id);

        if (result.success) {
          get()._refreshState();

          // 立即使用新激活的token调用API获取基本信息
          try {
            const tokens = tokenManager.getTokens();
            const newActiveToken = tokens.find((t) => t.id === id);
            if (newActiveToken?.token) {
              const { fetchBasicInfo } = useApiStatsStore.getState();
              await fetchBasicInfo(newActiveToken.token);
            }
          } catch (apiError) {
            console.warn(
              'Failed to fetch basic info for active token:',
              apiError
            );
            // 不影响token激活的成功状态，只记录警告
          }

          set({ isLoading: false });
          return { success: true };
        } else {
          set({ isLoading: false, error: result.error });
          return { success: false, error: result.error };
        }
      },

      updateTokenName: async (id: string, newName: string) => {
        set({ isLoading: true, error: null });

        const result = tokenManager.updateTokenName(id, newName);

        if (result.success) {
          get()._refreshState();
          set({ isLoading: false });
          return { success: true };
        } else {
          set({ isLoading: false, error: result.error });
          return { success: false, error: result.error };
        }
      },

      updateLastUsed: (id: string) => {
        tokenManager.updateLastUsed(id);
        get()._refreshState();
      },

      clearError: () => {
        set({ error: null });
      },

      clearAllTokens: async () => {
        set({ isLoading: true, error: null });

        const result = tokenManager.clearAllTokens();

        if (result.success) {
          set({
            tokens: [],
            activeTokenId: null,
            isLoading: false,
            error: null,
          });
          return { success: true };
        } else {
          set({ isLoading: false, error: result.error });
          return { success: false, error: result.error };
        }
      },

      // 内部方法：刷新状态
      _refreshState: () => {
        const tokens = tokenManager.getTokens();
        const activeToken = tokenManager.getActiveToken();
        const activeTokenId = activeToken?.id || null;

        // 确保激活状态正确
        const updatedTokens = tokens.map((token) => ({
          ...token,
          isActive: token.id === activeTokenId,
        }));

        set({
          tokens: updatedTokens,
          activeTokenId,
        });

        // 更新activeToken状态
        get()._updateActiveToken();
      },
    })),
    {
      name: 'token-store',
      // 只在开发环境启用devtools
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);

/**
 * Token选择器 - 提供常用的选择器函数
 */
export const tokenSelectors = {
  tokens: (state: TokenState) => state.tokens,
  activeToken: (state: TokenState) => state.activeToken,
  activeTokenId: (state: TokenState) => state.activeTokenId,
  isLoading: (state: TokenState) => state.isLoading,
  error: (state: TokenState) => state.error,
  tokenCount: (state: TokenState) => state.tokenCount,
  hasTokens: (state: TokenState) => state.tokens.length > 0,
  hasActiveToken: (state: TokenState) => state.activeToken !== null,
};

/**
 * 自定义Hook - 获取活跃Token
 */
export const useActiveToken = () => {
  return useTokenStore(tokenSelectors.activeToken);
};

/**
 * 自定义Hook - 获取Token列表
 */
export const useTokenList = () => {
  return useTokenStore(tokenSelectors.tokens);
};

/**
 * 自定义Hook - 获取Token操作方法
 */
export const useTokenActions = () => {
  return useTokenStore((state) => ({
    loadTokens: state.loadTokens,
    addToken: state.addToken,
    removeToken: state.removeToken,
    setActiveToken: state.setActiveToken,
    updateTokenName: state.updateTokenName,
    updateLastUsed: state.updateLastUsed,
    clearError: state.clearError,
    clearAllTokens: state.clearAllTokens,
  }));
};

/**
 * 自定义Hook - 获取Token状态
 */
export const useTokenStatus = () => {
  return useTokenStore((state) => ({
    isLoading: state.isLoading,
    error: state.error,
    tokenCount: state.tokenCount,
    hasTokens: state.tokens.length > 0,
    hasActiveToken: state.activeToken !== null,
  }));
};

// 初始化时加载tokens
useTokenStore.getState().loadTokens();

export default useTokenStore;
