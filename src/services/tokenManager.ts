/**
 * API Token 本地存储管理服务
 * 提供token的增删改查和持久化功能
 */

export interface ApiToken {
  id: string;
  name: string; // 用户自定义名称
  token: string;
  createdAt: string;
  lastUsed?: string;
  isActive: boolean;
}

const STORAGE_KEY = 'claude_relay_tokens';
const ACTIVE_TOKEN_KEY = 'claude_relay_active_token';

/**
 * 生成唯一ID
 */
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * 验证token格式 - 移除硬性前缀限制
 */
const validateTokenFormat = (token: string): boolean => {
  return token.length > 10; // 只要求长度大于10，不限制前缀
};

/**
 * 脱敏显示token
 */
const maskToken = (token: string): string => {
  if (token.length <= 10) return token;
  return token.slice(0, 3) + '****' + token.slice(-6);
};

/**
 * 从localStorage获取所有tokens
 */
const getTokensFromStorage = (): ApiToken[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    console.log('TokenManager: Getting tokens from localStorage:', stored);
    const tokens = stored ? JSON.parse(stored) : [];
    console.log('TokenManager: Parsed tokens count:', tokens.length);
    return tokens;
  } catch (error) {
    console.error('Failed to parse tokens from localStorage:', error);
    return [];
  }
};

/**
 * 保存tokens到localStorage
 */
const saveTokensToStorage = (tokens: ApiToken[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
  } catch (error) {
    console.error('Failed to save tokens to localStorage:', error);
    throw new Error('保存Token失败，请检查存储空间');
  }
};

/**
 * 获取当前激活的token ID
 */
const getActiveTokenIdFromStorage = (): string | null => {
  try {
    return localStorage.getItem(ACTIVE_TOKEN_KEY);
  } catch (error) {
    console.error('Failed to get active token from localStorage:', error);
    return null;
  }
};

/**
 * 保存激活的token ID
 */
const saveActiveTokenIdToStorage = (tokenId: string | null): void => {
  try {
    if (tokenId) {
      localStorage.setItem(ACTIVE_TOKEN_KEY, tokenId);
    } else {
      localStorage.removeItem(ACTIVE_TOKEN_KEY);
    }
  } catch (error) {
    console.error('Failed to save active token to localStorage:', error);
    throw new Error('保存激活Token失败');
  }
};

/**
 * Token管理器
 */
export const tokenManager = {
  /**
   * 获取所有tokens
   */
  getTokens: (): ApiToken[] => {
    return getTokensFromStorage();
  },

  /**
   * 添加新token
   */
  addToken: (name: string, token: string): { success: boolean; error?: string; token?: ApiToken } => {
    try {
      // 验证输入
      if (!name.trim()) {
        return { success: false, error: 'Token名称不能为空' };
      }

      if (!token.trim()) {
        return { success: false, error: 'Token不能为空' };
      }

      if (!validateTokenFormat(token)) {
        return { success: false, error: 'Token格式无效，长度应大于10个字符' };
      }

      const tokens = getTokensFromStorage();

      // 检查token是否已存在
      const existingToken = tokens.find(t => t.token === token);
      if (existingToken) {
        return { success: false, error: '该Token已存在' };
      }

      // 检查名称是否已存在
      const existingName = tokens.find(t => t.name === name.trim());
      if (existingName) {
        return { success: false, error: '该名称已存在' };
      }

      // 创建新token
      const newToken: ApiToken = {
        id: generateId(),
        name: name.trim(),
        token: token.trim(),
        createdAt: new Date().toISOString(),
        isActive: tokens.length === 0, // 如果是第一个token，自动设为活跃
      };

      const updatedTokens = [...tokens, newToken];
      saveTokensToStorage(updatedTokens);

      // 如果是第一个token，设为活跃
      if (newToken.isActive) {
        saveActiveTokenIdToStorage(newToken.id);
      }

      return { success: true, token: newToken };
    } catch (error) {
      console.error('Failed to add token:', error);
      return { success: false, error: '添加Token失败' };
    }
  },

  /**
   * 删除token
   */
  removeToken: (id: string): { success: boolean; error?: string } => {
    try {
      const tokens = getTokensFromStorage();
      const tokenToRemove = tokens.find(t => t.id === id);

      if (!tokenToRemove) {
        return { success: false, error: 'Token不存在' };
      }

      const updatedTokens = tokens.filter(t => t.id !== id);
      saveTokensToStorage(updatedTokens);

      // 如果删除的是激活token，需要重新设置激活token
      const activeTokenId = getActiveTokenIdFromStorage();
      if (activeTokenId === id) {
        const newActiveToken = updatedTokens.length > 0 ? updatedTokens[0] : null;
        if (newActiveToken) {
          newActiveToken.isActive = true;
          saveTokensToStorage(updatedTokens);
          saveActiveTokenIdToStorage(newActiveToken.id);
        } else {
          saveActiveTokenIdToStorage(null);
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Failed to remove token:', error);
      return { success: false, error: '删除Token失败' };
    }
  },

  /**
   * 获取当前激活的token
   */
  getActiveToken: (): ApiToken | null => {
    const tokens = getTokensFromStorage();
    const activeTokenId = getActiveTokenIdFromStorage();

    console.log('TokenManager: Getting active token - tokens count:', tokens.length);
    console.log('TokenManager: Active token ID from storage:', activeTokenId);

    if (!activeTokenId) {
      const firstToken = tokens.length > 0 ? tokens[0] : null;
      console.log('TokenManager: No active token ID, returning first token:', firstToken?.name || 'none');
      return firstToken;
    }

    const foundToken = tokens.find(t => t.id === activeTokenId) || null;
    console.log('TokenManager: Found token by ID:', foundToken?.name || 'none');
    return foundToken;
  },

  /**
   * 设置激活token
   */
  setActiveToken: (id: string): { success: boolean; error?: string } => {
    try {
      const tokens = getTokensFromStorage();
      const targetToken = tokens.find(t => t.id === id);

      if (!targetToken) {
        return { success: false, error: 'Token不存在' };
      }

      // 更新所有token的激活状态
      const updatedTokens = tokens.map(t => ({
        ...t,
        isActive: t.id === id,
      }));

      saveTokensToStorage(updatedTokens);
      saveActiveTokenIdToStorage(id);

      return { success: true };
    } catch (error) {
      console.error('Failed to set active token:', error);
      return { success: false, error: '设置激活Token失败' };
    }
  },

  /**
   * 更新token名称
   */
  updateTokenName: (id: string, newName: string): { success: boolean; error?: string } => {
    try {
      if (!newName.trim()) {
        return { success: false, error: 'Token名称不能为空' };
      }

      const tokens = getTokensFromStorage();
      const tokenIndex = tokens.findIndex(t => t.id === id);

      if (tokenIndex === -1) {
        return { success: false, error: 'Token不存在' };
      }

      // 检查名称是否已存在（排除当前token）
      const existingName = tokens.find(t => t.name === newName.trim() && t.id !== id);
      if (existingName) {
        return { success: false, error: '该名称已存在' };
      }

      tokens[tokenIndex].name = newName.trim();
      saveTokensToStorage(tokens);

      return { success: true };
    } catch (error) {
      console.error('Failed to update token name:', error);
      return { success: false, error: '更新Token名称失败' };
    }
  },

  /**
   * 更新token最后使用时间
   */
  updateLastUsed: (id: string): { success: boolean; error?: string } => {
    try {
      const tokens = getTokensFromStorage();
      const tokenIndex = tokens.findIndex(t => t.id === id);

      if (tokenIndex === -1) {
        return { success: false, error: 'Token不存在' };
      }

      tokens[tokenIndex].lastUsed = new Date().toISOString();
      saveTokensToStorage(tokens);

      return { success: true };
    } catch (error) {
      console.error('Failed to update last used:', error);
      return { success: false, error: '更新使用时间失败' };
    }
  },

  /**
   * 脱敏显示token
   */
  maskToken,

  /**
   * 验证token格式
   */
  validateTokenFormat,

  /**
   * 清空所有tokens（危险操作）
   */
  clearAllTokens: (): { success: boolean; error?: string } => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(ACTIVE_TOKEN_KEY);
      return { success: true };
    } catch (error) {
      console.error('Failed to clear all tokens:', error);
      return { success: false, error: '清空Token失败' };
    }
  },
};

export default tokenManager;