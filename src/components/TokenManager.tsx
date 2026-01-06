import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Modal from '@/components/ui/Modal';
import { toast } from '@/stores/toast';
import { useApiStatsStore } from '@/stores/apiStatsStore';
import {
  useTokenList,
  useTokenActions,
  useTokenStatus,
  useActiveToken
} from '@/stores/tokenStore';
import { tokenManager } from '@/services/tokenManager';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { cn } from '@/utils';

/**
 * Token项组件属性
 */
interface TokenItemProps {
  token: {
    id: string;
    name: string;
    token: string;
    createdAt: string;
    lastUsed?: string;
    isActive: boolean;
  };
  onSetActive: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newName: string) => void;
}

/**
 * Token项组件
 */
const TokenItem: React.FC<TokenItemProps> = ({ token, onSetActive, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(token.name);

  const handleSaveEdit = () => {
    if (editName.trim() && editName !== token.name) {
      onEdit(token.id, editName.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditName(token.name);
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn(
        'p-6 transition-all duration-300 hover:shadow-lg border',
        token.isActive
          ? 'border-orange-300 bg-orange-50/50 shadow-orange-100'
          : 'border-stone-200 hover:border-stone-300'
      )}>
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-3">
              {/* 激活状态指示器 */}
              <div className={cn(
                'w-3 h-3 rounded-full transition-colors',
                token.isActive
                  ? 'bg-orange-500 shadow-lg shadow-orange-500/30'
                  : 'bg-stone-300'
              )} />

              {/* Token名称 */}
              {isEditing ? (
                <div className="flex-1 flex items-center space-x-2">
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveEdit();
                      if (e.key === 'Escape') handleCancelEdit();
                    }}
                    className="text-sm py-1 h-8"
                    autoFocus
                  />
                  <Button
                    variant="primary"
                    size="xs"
                    onClick={handleSaveEdit}
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    保存
                  </Button>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={handleCancelEdit}
                  >
                    取消
                  </Button>
                </div>
              ) : (
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-stone-900">
                    {token.name}
                  </h3>
                </div>
              )}
            </div>

            {/* Token值 */}
            <div className="mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-stone-500">Token:</span>
                <code className="text-sm font-mono bg-stone-100 px-2 py-1 rounded text-stone-700">
                  {tokenManager.maskToken(token.token)}
                </code>
              </div>
            </div>

            {/* 时间信息 */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0 text-sm text-stone-500">
              <span>创建时间: {formatDate(token.createdAt)}</span>
              {token.lastUsed && (
                <span>最后使用: {formatDate(token.lastUsed)}</span>
              )}
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex items-center space-x-2 ml-4">
            {!token.isActive && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSetActive(token.id)}
                className="border-orange-300 text-orange-600 hover:bg-orange-50"
              >
                设为活跃
              </Button>
            )}

            {!isEditing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="text-stone-600 hover:text-stone-900"
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                }
              >
                编辑
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(token.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              }
            >
              删除
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

/**
 * Token管理器主组件
 */
interface TokenManagerProps {
  onTokenAdded?: () => void; // 添加Token成功后的回调
}

export const TokenManager: React.FC<TokenManagerProps> = ({ onTokenAdded }) => {
  const tokens = useTokenList();
  const activeToken = useActiveToken();
  const { isLoading, error, tokenCount } = useTokenStatus();
  const {
    addToken,
    removeToken,
    setActiveToken,
    updateTokenName,
    clearError
  } = useTokenActions();
  const navigate = useNavigate();
  const { refreshBasicStats } = useApiStatsStore();

  // 表单状态
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    token: '',
  });
  const [formError, setFormError] = useState('');

  // 操作确认状态
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [confirmReplaceOpen, setConfirmReplaceOpen] = useState(false);

  // 清理错误信息
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  // 处理添加Token（带替换确认）
  const handleAddToken = async () => {
    setFormError('');

    if (!formData.token.trim()) {
      setFormError('请输入Token值');
      toast.error('验证失败', '请输入Token值');
      return;
    }

    // 若已存在 token，先弹出替换确认
    if (tokenCount > 0) {
      setConfirmReplaceOpen(true);
      return;
    }

    const result = await addToken(formData.token);
    if (result.success) {
      setFormData({ token: '' });
      setShowAddForm(false);
      toast.success('添加成功', 'Token已成功添加并设置为活跃');
      if (onTokenAdded) onTokenAdded();

      // 立即查询基本统计数据
      try {
        await refreshBasicStats();
      } catch (error) {
        console.log('Stats query failed:', error);
      }

      navigate('/dashboard');
    } else {
      setFormError(result.error || '添加失败');
      toast.error('添加失败', result.error || 'Token验证失败，请检查Token是否正确');
    }
  };

  // 确认替换逻辑
  const handleConfirmReplace = async () => {
    setConfirmReplaceOpen(false);
    // 清空后再添加
    try {
      const { clearAllTokens } = useTokenActions();
      await clearAllTokens();
      toast.info('正在替换', '正在清空现有Token并添加新Token...');
    } catch {}

    const result = await addToken(formData.token);
    if (result.success) {
      setFormData({ token: '' });
      setShowAddForm(false);
      toast.success('替换成功', 'Token已成功替换并设置为活跃');
      if (onTokenAdded) onTokenAdded();

      // 立即查询基本统计数据
      try {
        await refreshBasicStats();
      } catch (error) {
        console.log('Stats query failed:', error);
      }

      navigate('/dashboard');
    } else {
      setFormError(result.error || '添加失败');
      toast.error('替换失败', result.error || 'Token验证失败，请检查Token是否正确');
    }
  };

  // 处理删除Token
  const handleDeleteToken = async (id: string) => {
    if (confirmDelete !== id) {
      setConfirmDelete(id);
      setTimeout(() => setConfirmDelete(null), 3000);
      return;
    }

    const result = await removeToken(id);
    setConfirmDelete(null);

    if (result.success) {
      toast.success('删除成功', 'Token已成功删除');
    } else {
      toast.error('删除失败', result.error || '无法删除Token');
    }
  };

  // 处理设置激活Token
  const handleSetActiveToken = async (id: string) => {
    const result = await setActiveToken(id);

    if (result.success) {
      toast.success('切换成功', 'Token已设置为活跃');
    } else {
      toast.error('切换失败', result.error || '无法设置活跃Token');
    }
  };

  // 处理编辑Token名称
  const handleEditTokenName = async (id: string, newName: string) => {
    const result = await updateTokenName(id, newName);

    if (result.success) {
      toast.success('更新成功', 'Token名称已更新');
    } else {
      toast.error('更新失败', result.error || '无法更新Token名称');
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 页面头部 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-orange-100 text-orange-800 mb-6">
            <span className="mr-2">🔑</span>
            API Token 管理
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold text-stone-900 mb-4">
            <div className="flex items-center justify-center space-x-3">
              <span>SwiftCode</span>
              <span className="relative text-3xl font-extrabold bg-gradient-to-r from-orange-500 via-orange-400 to-red-500 bg-clip-text text-transparent animate-pulse">
                MAX
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full animate-ping"></span>
              </span>
            </div>
            <br />
            <span className="text-gradient bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Token
            </span>{' '}
            管理中心
          </h1>

          <p className="text-xl text-stone-600 max-w-2xl mx-auto">
            安全管理您的 API Token，支持多Token切换和本地加密存储
          </p>
        </motion.div>

        {/* 统计卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <Card className="p-6 text-center border-stone-200 hover:shadow-lg transition-shadow">
            <div className="text-3xl font-bold text-orange-500 mb-2">{tokenCount}</div>
            <div className="text-stone-600">已保存Token</div>
          </Card>

          <Card className="p-6 text-center border-stone-200 hover:shadow-lg transition-shadow">
            <div className="text-3xl font-bold text-green-500 mb-2">
              {activeToken ? 1 : 0}
            </div>
            <div className="text-stone-600">激活Token</div>
          </Card>

          <Card className="p-6 text-center border-stone-200 hover:shadow-lg transition-shadow">
            <div className="text-3xl font-bold text-blue-500 mb-2">
              {activeToken?.lastUsed ? '已使用' : '未使用'}
            </div>
            <div className="text-stone-600">使用状态</div>
          </Card>
        </motion.div>

        {/* 错误提示 */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-red-700">{error}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearError}
                  className="text-red-500 hover:text-red-700"
                >
                  ✕
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 添加Token按钮 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <Button
            variant="primary"
            size="lg"
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-orange-500 hover:bg-orange-600 w-full sm:w-auto"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            }
          >
            {showAddForm ? '取消添加' : '添加新Token'}
          </Button>
        </motion.div>

        {/* 添加Token表单 */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <Card className="p-6 border-orange-200 bg-orange-50/30">
                <h3 className="text-lg font-semibold text-stone-900 mb-4">添加新Token</h3>

                <div className="space-y-4">
                  <Input
                    label="Token值"
                    placeholder="请输入您的API Token"
                    value={formData.token}
                    onChange={(e) => setFormData({ ...formData, token: e.target.value })}
                    error={formError && !formData.token.trim() ? '请输入Token值' : ''}
                    helperText="请输入有效的API Token，系统将自动获取Token名称"
                  />

                  {formError && (
                    <div className="text-red-600 text-sm">{formError}</div>
                  )}

                  <div className="flex space-x-3">
                    <Button
                      variant="primary"
                      onClick={handleAddToken}
                      loading={isLoading}
                      className="bg-orange-500 hover:bg-orange-600"
                    >
                      添加Token
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setShowAddForm(false);
                        setFormData({ token: '' });
                        setFormError('');
                      }}
                    >
                      取消
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Token列表 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {tokens.length === 0 ? (
            <Card className="p-12 text-center border-stone-200">
              <div className="text-6xl mb-4">🔑</div>
              <h3 className="text-xl font-semibold text-stone-900 mb-2">
                还没有Token
              </h3>
              <p className="text-stone-600 mb-6">
                点击上方"添加新Token"按钮开始管理您的API Token
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-stone-900 mb-4">
                Token列表 ({tokenCount})
              </h2>

              <AnimatePresence>
                {tokens.map((token) => (
                  <TokenItem
                    key={token.id}
                    token={token}
                    onSetActive={handleSetActiveToken}
                    onDelete={handleDeleteToken}
                    onEdit={handleEditTokenName}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>

        {/* 删除确认提示 */}
        <AnimatePresence>
          {confirmDelete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed bottom-4 right-4 bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg"
            >
              <div className="flex items-center space-x-2 text-red-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span>再次点击确认删除</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 背景装饰 */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-orange-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-red-200/20 rounded-full blur-3xl"></div>
        </div>
      </div>
      {/* 替换确认弹窗 */}
      <Modal
        open={confirmReplaceOpen}
        onClose={() => setConfirmReplaceOpen(false)}
        title="确认替换 Token"
        size="sm"
        showCloseButton
        centered
      >
        <div className="space-y-4">
          <p className="text-stone-700">已存在一个 Token，继续将会替换为新 Token。</p>
          <div className="text-sm text-stone-500">此操作不会影响已查询的数据，但旧 Token 将被移除。</div>
          <div className="flex justify-end space-x-3 pt-2">
            <Button variant="secondary" onClick={() => setConfirmReplaceOpen(false)}>取消</Button>
            <Button variant="primary" className="bg-orange-500 hover:bg-orange-600" onClick={handleConfirmReplace}>确认替换</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TokenManager;