import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { cn } from '@/utils';

/**
 * TutorialPage - Claude Code 使用教程页面组件
 *
 * 提供详细的Claude Code安装和使用教程
 */
export const TutorialPage: React.FC = () => {
  const [activeSystem, setActiveSystem] = useState<'windows' | 'macos' | 'linux'>('windows');

  // 系统选择配置
  const tutorialSystems = [
    {
      key: 'windows' as const,
      name: 'Windows',
      icon: '🪟',
    },
    {
      key: 'macos' as const,
      name: 'macOS',
      icon: '🍎',
    },
    {
      key: 'linux' as const,
      name: 'Linux',
      icon: '🐧',
    },
  ];

  /**
   * 渲染系统选择标签
   */
  const renderSystemTabs = () => {
    return (
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 rounded-xl bg-stone-100 p-2">
          {tutorialSystems.map((system) => (
            <button
              key={system.key}
              onClick={() => setActiveSystem(system.key)}
              className={cn(
                'flex flex-1 items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-all duration-300',
                activeSystem === system.key
                  ? 'bg-white text-orange-600 shadow-md'
                  : 'text-stone-600 hover:bg-white/60 hover:text-stone-900'
              )}
            >
              <span>{system.icon}</span>
              {system.name}
            </button>
          ))}
        </div>
      </div>
    );
  };

  /**
   * 渲染Windows教程内容
   */
  const renderWindowsTutorial = () => {
    return (
      <div className="space-y-10">
        {/* 第一步：安装 Node.js */}
        <div className="tutorial-section">
          <h4 className="mb-4 flex items-center text-xl font-semibold text-stone-800">
            <span className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white">1</span>
            安装 Node.js 环境
          </h4>
          <p className="mb-6 text-stone-600">
            Claude Code 需要 Node.js 环境才能运行。
          </p>

          <div className="mb-6 rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
            <h5 className="mb-3 flex items-center text-lg font-semibold text-stone-800">
              <span className="mr-2 text-blue-600">🪟</span>
              Windows 安装方法
            </h5>
            <div className="mb-4">
              <p className="mb-3 text-stone-700">方法一：官网下载（推荐）</p>
              <ol className="ml-4 list-decimal space-y-2 text-sm text-stone-600">
                <li>
                  打开浏览器访问{' '}
                  <code className="rounded bg-stone-100 px-2 py-1 text-sm">https://nodejs.org/</code>
                </li>
                <li>点击 "LTS" 版本进行下载（推荐长期支持版本）</li>
                <li>
                  下载完成后双击{' '}
                  <code className="rounded bg-stone-100 px-2 py-1 text-sm">.msi</code>{' '}
                  文件
                </li>
                <li>按照安装向导完成安装，保持默认设置即可</li>
              </ol>
            </div>
            <div className="mb-4">
              <p className="mb-3 text-stone-700">方法二：使用包管理器</p>
              <p className="mb-2 text-sm text-stone-600">
                如果你安装了 Chocolatey 或 Scoop，可以使用命令行安装：
              </p>
              <div className="overflow-x-auto rounded-lg bg-stone-900 p-4 font-mono text-sm text-green-400">
                <div className="mb-2"># 使用 Chocolatey</div>
                <div className="text-stone-300">choco install nodejs</div>
                <div className="mb-2 mt-3"># 或使用 Scoop</div>
                <div className="text-stone-300">scoop install nodejs</div>
              </div>
            </div>
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <h6 className="mb-2 text-base font-medium text-blue-800">Windows 注意事项</h6>
              <ul className="space-y-1 text-sm text-blue-700">
                <li>• 建议使用 PowerShell 而不是 CMD</li>
                <li>• 如果遇到权限问题，尝试以管理员身份运行</li>
                <li>• 某些杀毒软件可能会误报，需要添加白名单</li>
              </ul>
            </div>
          </div>

          {/* 验证安装 */}
          <div className="rounded-lg border border-green-200 bg-green-50 p-4">
            <h6 className="mb-2 text-base font-medium text-green-800">验证安装是否成功</h6>
            <p className="mb-3 text-sm text-green-700">
              安装完成后，打开 PowerShell 或 CMD，输入以下命令：
            </p>
            <div className="overflow-x-auto rounded bg-stone-900 p-3 font-mono text-sm text-green-400">
              <div className="text-stone-300">node --version</div>
              <div className="text-stone-300">npm --version</div>
            </div>
            <p className="mt-2 text-sm text-green-700">如果显示版本号，说明安装成功了！</p>
          </div>
        </div>

        {/* 第二步：安装 Claude Code */}
        <div className="tutorial-section">
          <h4 className="mb-4 flex items-center text-xl font-semibold text-stone-800">
            <span className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-sm font-bold text-white">2</span>
            安装 Claude Code
          </h4>

          <div className="mb-6 rounded-xl border border-green-100 bg-gradient-to-r from-green-50 to-emerald-50 p-6">
            <h5 className="mb-3 flex items-center text-lg font-semibold text-stone-800">
              <span className="mr-2 text-green-600">📦</span>
              安装 Claude Code
            </h5>
            <p className="mb-4 text-stone-700">
              打开 PowerShell 或 CMD，运行以下命令：
            </p>
            <div className="mb-4 overflow-x-auto rounded-lg bg-stone-900 p-4 font-mono text-sm text-green-400">
              <div className="mb-2"># 全局安装 Claude Code</div>
              <div className="text-stone-300">
                npm install -g @anthropic-ai/claude-code
              </div>
            </div>
            <p className="text-stone-600">
              这个命令会从 npm 官方仓库下载并安装最新版本的 Claude Code。
            </p>

            <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
              <h6 className="mb-2 text-base font-medium text-blue-800">提示</h6>
              <ul className="space-y-1 text-sm text-blue-700">
                <li>• 建议使用 PowerShell 而不是 CMD，功能更强大</li>
                <li>• 如果遇到权限问题，以管理员身份运行 PowerShell</li>
              </ul>
            </div>
          </div>

          {/* 验证安装 */}
          <div className="rounded-lg border border-green-200 bg-green-50 p-4">
            <h6 className="mb-2 font-medium text-green-800">验证 Claude Code 安装</h6>
            <p className="mb-3 text-sm text-green-700">安装完成后，输入以下命令检查是否安装成功：</p>
            <div className="overflow-x-auto rounded bg-stone-900 p-3 font-mono text-sm text-green-400">
              <div className="text-stone-300">claude --version</div>
            </div>
            <p className="mt-2 text-sm text-green-700">
              如果显示版本号，恭喜你！Claude Code 已经成功安装了。
            </p>
          </div>
        </div>

        {/* 第三步：设置环境变量 */}
        <div className="tutorial-section">
          <h4 className="mb-4 flex items-center text-xl font-semibold text-stone-800">
            <span className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-purple-500 text-sm font-bold text-white">3</span>
            设置环境变量
          </h4>

          <div className="mb-6 rounded-xl border border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50 p-6">
            <h5 className="mb-3 flex items-center text-lg font-semibold text-stone-800">
              <span className="mr-2 text-purple-600">⚙️</span>
              配置 Claude Code 环境变量
            </h5>
            <p className="mb-4 text-stone-700">
              为了让 Claude Code 连接到你的中转服务，需要设置两个环境变量：
            </p>

            <div className="space-y-4">
              <div className="rounded-lg border border-purple-200 bg-white p-4">
                <h6 className="mb-2 text-base font-medium text-stone-800">
                  方法一：PowerShell 临时设置（当前会话）
                </h6>
                <p className="mb-3 text-sm text-stone-600">在 PowerShell 中运行以下命令：</p>
                <div className="overflow-x-auto rounded bg-stone-900 p-3 font-mono text-sm text-green-400">
                  <div className="text-stone-300">
                    $env:ANTHROPIC_BASE_URL = "你的中转服务地址"
                  </div>
                  <div className="text-stone-300">
                    $env:ANTHROPIC_AUTH_TOKEN = "你的API密钥"
                  </div>
                </div>
                <p className="mt-2 text-xs text-yellow-700">
                  💡 记得将 "你的API密钥" 替换为在上方 "仪表板" 标签页中创建的实际密钥。
                </p>
              </div>

              <div className="rounded-lg border border-purple-200 bg-white p-4">
                <h6 className="mb-2 text-base font-medium text-stone-800">
                  方法二：PowerShell 永久设置（用户级）
                </h6>
                <p className="mb-3 text-sm text-stone-600">
                  在 PowerShell 中运行以下命令设置用户级环境变量：
                </p>
                <div className="mb-3 overflow-x-auto rounded bg-stone-900 p-3 font-mono text-sm text-green-400">
                  <div className="mb-2"># 设置用户级环境变量（永久生效）</div>
                  <div className="text-stone-300">
                    [System.Environment]::SetEnvironmentVariable("ANTHROPIC_BASE_URL", "你的中转服务地址", [System.EnvironmentVariableTarget]::User)
                  </div>
                  <div className="text-stone-300">
                    [System.Environment]::SetEnvironmentVariable("ANTHROPIC_AUTH_TOKEN", "你的API密钥", [System.EnvironmentVariableTarget]::User)
                  </div>
                </div>
                <p className="text-xs text-blue-700">
                  💡 设置后需要重新打开 PowerShell 窗口才能生效。
                </p>
              </div>
            </div>
          </div>

          {/* 验证环境变量设置 */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <h6 className="mb-2 font-medium text-blue-800">验证环境变量设置</h6>
            <p className="mb-3 text-sm text-blue-700">
              设置完环境变量后，可以通过以下命令验证是否设置成功：
            </p>

            <div className="space-y-4">
              <div>
                <h6 className="mb-2 text-base font-medium text-stone-800">
                  在 PowerShell 中验证：
                </h6>
                <div className="space-y-1 overflow-x-auto rounded bg-stone-900 p-3 font-mono text-sm text-green-400">
                  <div className="text-stone-300">echo $env:ANTHROPIC_BASE_URL</div>
                  <div className="text-stone-300">echo $env:ANTHROPIC_AUTH_TOKEN</div>
                </div>
              </div>

              <div>
                <h6 className="mb-2 text-base font-medium text-stone-800">
                  在 CMD 中验证：
                </h6>
                <div className="space-y-1 overflow-x-auto rounded bg-stone-900 p-3 font-mono text-sm text-green-400">
                  <div className="text-stone-300">echo %ANTHROPIC_BASE_URL%</div>
                  <div className="text-stone-300">echo %ANTHROPIC_AUTH_TOKEN%</div>
                </div>
              </div>
            </div>

            <div className="mt-3 space-y-2">
              <p className="text-sm text-blue-700">
                <strong>预期输出示例：</strong>
              </p>
              <div className="rounded bg-stone-100 p-2 font-mono text-sm">
                <div>https://your-relay-service.com</div>
                <div>cr_xxxxxxxxxxxxxxxxxx</div>
              </div>
              <p className="text-xs text-blue-700">
                💡 如果输出为空或显示变量名本身，说明环境变量设置失败，请重新设置。
              </p>
            </div>
          </div>
        </div>

        {/* 第四步：开始使用 */}
        <div className="tutorial-section">
          <h4 className="mb-4 flex items-center text-xl font-semibold text-stone-800">
            <span className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">4</span>
            开始使用 Claude Code
          </h4>

          <div className="rounded-xl border border-orange-100 bg-gradient-to-r from-orange-50 to-yellow-50 p-6">
            <h5 className="mb-3 flex items-center text-lg font-semibold text-stone-800">
              <span className="mr-2 text-orange-600">🚀</span>
              启动 Claude Code
            </h5>
            <p className="mb-4 text-stone-700">
              现在你可以在任何项目目录中使用 Claude Code：
            </p>
            <div className="overflow-x-auto rounded-lg bg-stone-900 p-4 font-mono text-sm text-green-400">
              <div className="mb-2"># 在项目目录中启动 Claude Code</div>
              <div className="text-stone-300">claude</div>
            </div>
            <p className="mt-4 text-stone-600">
              Claude Code 将会连接到你的中转服务，开始为你提供智能代码助手服务！
            </p>
          </div>

          <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4">
            <h6 className="mb-2 font-medium text-green-800">🎉 恭喜！设置完成</h6>
            <p className="text-green-700">现在你可以享受 Claude Code 带来的智能编程体验了！</p>
            <ul className="mt-4 space-y-2 text-green-700">
              <li>• 智能代码补全和建议</li>
              <li>• 代码解释和优化</li>
              <li>• 错误调试和修复</li>
              <li>• 项目结构分析</li>
            </ul>
          </div>
        </div>
      </div>
    );
  };

  /**
   * 渲染macOS教程内容
   */
  const rendermacOSTutorial = () => {
    return (
      <div className="space-y-10">
        {/* 第一步：安装 Node.js */}
        <div className="tutorial-section">
          <h4 className="mb-4 flex items-center text-xl font-semibold text-stone-800">
            <span className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white">1</span>
            安装 Node.js 环境
          </h4>
          <p className="mb-6 text-stone-600">
            Claude Code 需要 Node.js 环境才能运行。
          </p>

          <div className="mb-6 rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
            <h5 className="mb-3 flex items-center text-lg font-semibold text-stone-800">
              <span className="mr-2 text-stone-700">🍎</span>
              macOS 安装方法
            </h5>
            <div className="mb-4">
              <p className="mb-3 text-stone-700">方法一：使用 Homebrew（推荐）</p>
              <p className="mb-2 text-sm text-stone-600">
                如果你已经安装了 Homebrew，使用它安装 Node.js 会更方便：
              </p>
              <div className="overflow-x-auto rounded-lg bg-stone-900 p-4 font-mono text-sm text-green-400">
                <div className="mb-2"># 更新 Homebrew</div>
                <div className="text-stone-300">brew update</div>
                <div className="mb-2 mt-3"># 安装 Node.js</div>
                <div className="text-stone-300">brew install node</div>
              </div>
            </div>
            <div className="mb-4">
              <p className="mb-3 text-stone-700">方法二：官网下载</p>
              <ol className="ml-4 list-decimal space-y-2 text-sm text-stone-600">
                <li>
                  访问{' '}
                  <code className="rounded bg-stone-100 px-2 py-1 text-sm">https://nodejs.org/</code>
                </li>
                <li>下载适合 macOS 的 LTS 版本</li>
                <li>
                  打开下载的{' '}
                  <code className="rounded bg-stone-100 px-2 py-1 text-sm">.pkg</code>{' '}
                  文件
                </li>
                <li>按照安装程序指引完成安装</li>
              </ol>
            </div>
            <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
              <h6 className="mb-2 text-base font-medium text-stone-800">macOS 注意事项</h6>
              <ul className="space-y-1 text-sm text-stone-700">
                <li>
                  • 如果遇到权限问题，可能需要使用{' '}
                  <code className="rounded bg-stone-200 px-1 text-sm">sudo</code>
                </li>
                <li>• 首次运行可能需要在系统偏好设置中允许</li>
                <li>• 建议使用 Terminal 或 iTerm2</li>
              </ul>
            </div>
          </div>

          {/* 验证安装 */}
          <div className="rounded-lg border border-green-200 bg-green-50 p-4">
            <h6 className="mb-2 font-medium text-green-800">验证安装是否成功</h6>
            <p className="mb-3 text-sm text-green-700">安装完成后，打开 Terminal，输入以下命令：</p>
            <div className="overflow-x-auto rounded bg-stone-900 p-3 font-mono text-sm text-green-400">
              <div className="text-stone-300">node --version</div>
              <div className="text-stone-300">npm --version</div>
            </div>
            <p className="mt-2 text-sm text-green-700">如果显示版本号，说明安装成功了！</p>
          </div>
        </div>

        {/* 第二步：安装 Claude Code */}
        <div className="tutorial-section">
          <h4 className="mb-4 flex items-center text-xl font-semibold text-stone-800">
            <span className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-sm font-bold text-white">2</span>
            安装 Claude Code
          </h4>

          <div className="mb-6 rounded-xl border border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50 p-6">
            <h5 className="mb-3 flex items-center text-lg font-semibold text-stone-800">
              <span className="mr-2 text-purple-600">📦</span>
              安装 Claude Code
            </h5>
            <p className="mb-4 text-stone-700">
              打开 Terminal，运行以下命令：
            </p>
            <div className="mb-4 overflow-x-auto rounded-lg bg-stone-900 p-4 font-mono text-sm text-green-400">
              <div className="mb-2"># 全局安装 Claude Code</div>
              <div className="text-stone-300">
                npm install -g @anthropic-ai/claude-code
              </div>
            </div>
            <p className="mb-2 text-stone-600">如果遇到权限问题，可以使用 sudo：</p>
            <div className="overflow-x-auto rounded-lg bg-stone-900 p-4 font-mono text-sm text-green-400">
              <div className="text-stone-300">
                sudo npm install -g @anthropic-ai/claude-code
              </div>
            </div>
          </div>

          {/* 验证安装 */}
          <div className="rounded-lg border border-green-200 bg-green-50 p-4">
            <h6 className="mb-2 font-medium text-green-800">验证 Claude Code 安装</h6>
            <p className="mb-3 text-sm text-green-700">安装完成后，输入以下命令检查是否安装成功：</p>
            <div className="overflow-x-auto rounded bg-stone-900 p-3 font-mono text-sm text-green-400">
              <div className="text-stone-300">claude --version</div>
            </div>
            <p className="mt-2 text-sm text-green-700">
              如果显示版本号，恭喜你！Claude Code 已经成功安装了。
            </p>
          </div>
        </div>

        {/* 第三步：设置环境变量 */}
        <div className="tutorial-section">
          <h4 className="mb-4 flex items-center text-xl font-semibold text-stone-800">
            <span className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">3</span>
            设置环境变量
          </h4>

          <div className="mb-6 rounded-xl border border-orange-100 bg-gradient-to-r from-orange-50 to-yellow-50 p-6">
            <h5 className="mb-3 flex items-center text-lg font-semibold text-stone-800">
              <span className="mr-2 text-orange-600">⚙️</span>
              配置 Claude Code 环境变量
            </h5>
            <p className="mb-4 text-stone-700">
              为了让 Claude Code 连接到你的中转服务，需要设置两个环境变量：
            </p>

            <div className="space-y-4">
              <div className="rounded-lg border border-orange-200 bg-white p-4">
                <h6 className="mb-2 text-base font-medium text-stone-800">
                  方法一：临时设置（当前会话）
                </h6>
                <p className="mb-3 text-sm text-stone-600">在 Terminal 中运行以下命令：</p>
                <div className="overflow-x-auto rounded bg-stone-900 p-3 font-mono text-sm text-green-400">
                  <div className="text-stone-300">
                    export ANTHROPIC_BASE_URL="你的中转服务地址"
                  </div>
                  <div className="text-stone-300">
                    export ANTHROPIC_AUTH_TOKEN="你的API密钥"
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-orange-200 bg-white p-4">
                <h6 className="mb-2 text-base font-medium text-stone-800">
                  方法二：永久设置（推荐）
                </h6>
                <p className="mb-3 text-sm text-stone-600">
                  编辑你的 shell 配置文件（如 ~/.bashrc 或 ~/.zshrc）：
                </p>
                <div className="mb-3 overflow-x-auto rounded bg-stone-900 p-3 font-mono text-sm text-green-400">
                  <div className="mb-2"># 编辑配置文件</div>
                  <div className="text-stone-300">nano ~/.zshrc</div>
                  <div className="mb-2 mt-3"># 添加以下内容</div>
                  <div className="text-stone-300">export ANTHROPIC_BASE_URL="你的中转服务地址"</div>
                  <div className="text-stone-300">export ANTHROPIC_AUTH_TOKEN="你的API密钥"</div>
                  <div className="mb-2 mt-3"># 重新加载配置</div>
                  <div className="text-stone-300">source ~/.zshrc</div>
                </div>
              </div>
            </div>
          </div>

          {/* 验证环境变量设置 */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <h6 className="mb-2 font-medium text-blue-800">验证环境变量设置</h6>
            <p className="mb-3 text-sm text-blue-700">
              设置完环境变量后，可以通过以下命令验证：
            </p>
            <div className="space-y-1 overflow-x-auto rounded bg-stone-900 p-3 font-mono text-sm text-green-400">
              <div className="text-stone-300">echo $ANTHROPIC_BASE_URL</div>
              <div className="text-stone-300">echo $ANTHROPIC_AUTH_TOKEN</div>
            </div>
          </div>
        </div>

        {/* 第四步：开始使用 */}
        <div className="tutorial-section">
          <h4 className="mb-4 flex items-center text-xl font-semibold text-stone-800">
            <span className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-purple-500 text-sm font-bold text-white">4</span>
            开始使用 Claude Code
          </h4>

          <div className="rounded-xl border border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50 p-6">
            <h5 className="mb-3 flex items-center text-lg font-semibold text-stone-800">
              <span className="mr-2 text-purple-600">🚀</span>
              启动 Claude Code
            </h5>
            <p className="mb-4 text-stone-700">
              现在你可以在任何项目目录中使用 Claude Code：
            </p>
            <div className="overflow-x-auto rounded-lg bg-stone-900 p-4 font-mono text-sm text-green-400">
              <div className="mb-2"># 在项目目录中启动 Claude Code</div>
              <div className="text-stone-300">claude</div>
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4">
            <h6 className="mb-2 font-medium text-green-800">🎉 恭喜！设置完成</h6>
            <p className="text-green-700">现在你可以享受 Claude Code 带来的智能编程体验了！</p>
          </div>
        </div>
      </div>
    );
  };

  /**
   * 渲染Linux教程内容
   */
  const renderLinuxTutorial = () => {
    return (
      <div className="space-y-10">
        {/* 第一步：安装 Node.js */}
        <div className="tutorial-section">
          <h4 className="mb-4 flex items-center text-xl font-semibold text-stone-800">
            <span className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white">1</span>
            安装 Node.js 环境
          </h4>
          <p className="mb-6 text-stone-600">
            Claude Code 需要 Node.js 环境才能运行。
          </p>

          <div className="mb-6 rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
            <h5 className="mb-3 flex items-center text-lg font-semibold text-stone-800">
              <span className="mr-2 text-blue-600">🐧</span>
              Linux 安装方法
            </h5>
            <div className="mb-4">
              <p className="mb-3 text-stone-700">方法一：使用包管理器（推荐）</p>
              <div className="mb-3">
                <p className="mb-2 text-sm text-stone-600">Ubuntu/Debian:</p>
                <div className="overflow-x-auto rounded-lg bg-stone-900 p-4 font-mono text-sm text-green-400">
                  <div className="mb-2"># 更新包列表</div>
                  <div className="text-stone-300">sudo apt update</div>
                  <div className="mb-2 mt-3"># 安装 Node.js</div>
                  <div className="text-stone-300">sudo apt install nodejs npm</div>
                </div>
              </div>
              <div className="mb-3">
                <p className="mb-2 text-sm text-stone-600">CentOS/RHEL/Fedora:</p>
                <div className="overflow-x-auto rounded-lg bg-stone-900 p-4 font-mono text-sm text-green-400">
                  <div className="mb-2"># 使用 dnf（Fedora）</div>
                  <div className="text-stone-300">sudo dnf install nodejs npm</div>
                  <div className="mb-2 mt-3"># 或使用 yum（CentOS/RHEL）</div>
                  <div className="text-stone-300">sudo yum install nodejs npm</div>
                </div>
              </div>
              <div className="mb-3">
                <p className="mb-2 text-sm text-stone-600">Arch Linux:</p>
                <div className="overflow-x-auto rounded-lg bg-stone-900 p-4 font-mono text-sm text-green-400">
                  <div className="text-stone-300">sudo pacman -S nodejs npm</div>
                </div>
              </div>
            </div>
            <div className="mb-4">
              <p className="mb-3 text-stone-700">方法二：使用 NodeSource 仓库</p>
              <div className="overflow-x-auto rounded-lg bg-stone-900 p-4 font-mono text-sm text-green-400">
                <div className="mb-2"># 下载并运行安装脚本</div>
                <div className="text-stone-300">curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -</div>
                <div className="mb-2 mt-3"># 安装 Node.js</div>
                <div className="text-stone-300">sudo apt-get install -y nodejs</div>
              </div>
            </div>
            <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
              <h6 className="mb-2 text-base font-medium text-stone-800">Linux 注意事项</h6>
              <ul className="space-y-1 text-sm text-stone-700">
                <li>• 确保你有 sudo 权限</li>
                <li>• 某些发行版可能需要安装额外的构建工具</li>
                <li>• 如果遇到权限问题，可能需要配置 npm 全局安装路径</li>
              </ul>
            </div>
          </div>

          {/* 验证安装 */}
          <div className="rounded-lg border border-green-200 bg-green-50 p-4">
            <h6 className="mb-2 font-medium text-green-800">验证安装是否成功</h6>
            <p className="mb-3 text-sm text-green-700">安装完成后，打开终端，输入以下命令：</p>
            <div className="overflow-x-auto rounded bg-stone-900 p-3 font-mono text-sm text-green-400">
              <div className="text-stone-300">node --version</div>
              <div className="text-stone-300">npm --version</div>
            </div>
            <p className="mt-2 text-sm text-green-700">如果显示版本号，说明安装成功了！</p>
          </div>
        </div>

        {/* 第二步：安装 Claude Code */}
        <div className="tutorial-section">
          <h4 className="mb-4 flex items-center text-xl font-semibold text-stone-800">
            <span className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-sm font-bold text-white">2</span>
            安装 Claude Code
          </h4>

          <div className="mb-6 rounded-xl border border-green-100 bg-gradient-to-r from-green-50 to-emerald-50 p-6">
            <h5 className="mb-3 flex items-center text-lg font-semibold text-stone-800">
              <span className="mr-2 text-green-600">📦</span>
              安装 Claude Code
            </h5>
            <p className="mb-4 text-stone-700">
              打开终端，运行以下命令：
            </p>
            <div className="mb-4 overflow-x-auto rounded-lg bg-stone-900 p-4 font-mono text-sm text-green-400">
              <div className="mb-2"># 全局安装 Claude Code</div>
              <div className="text-stone-300">
                npm install -g @anthropic-ai/claude-code
              </div>
            </div>
            <p className="mb-2 text-stone-600">如果遇到权限问题，可以使用 sudo：</p>
            <div className="overflow-x-auto rounded-lg bg-stone-900 p-4 font-mono text-sm text-green-400">
              <div className="text-stone-300">
                sudo npm install -g @anthropic-ai/claude-code
              </div>
            </div>
          </div>

          {/* 验证安装 */}
          <div className="rounded-lg border border-green-200 bg-green-50 p-4">
            <h6 className="mb-2 font-medium text-green-800">验证 Claude Code 安装</h6>
            <p className="mb-3 text-sm text-green-700">安装完成后，输入以下命令检查是否安装成功：</p>
            <div className="overflow-x-auto rounded bg-stone-900 p-3 font-mono text-sm text-green-400">
              <div className="text-stone-300">claude --version</div>
            </div>
            <p className="mt-2 text-sm text-green-700">
              如果显示版本号，恭喜你！Claude Code 已经成功安装了。
            </p>
          </div>
        </div>

        {/* 第三步：设置环境变量 */}
        <div className="tutorial-section">
          <h4 className="mb-4 flex items-center text-xl font-semibold text-stone-800">
            <span className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-purple-500 text-sm font-bold text-white">3</span>
            设置环境变量
          </h4>

          <div className="mb-6 rounded-xl border border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50 p-6">
            <h5 className="mb-3 flex items-center text-lg font-semibold text-stone-800">
              <span className="mr-2 text-purple-600">⚙️</span>
              配置 Claude Code 环境变量
            </h5>
            <p className="mb-4 text-stone-700">
              为了让 Claude Code 连接到你的中转服务，需要设置两个环境变量：
            </p>

            <div className="space-y-4">
              <div className="rounded-lg border border-purple-200 bg-white p-4">
                <h6 className="mb-2 text-base font-medium text-stone-800">
                  方法一：临时设置（当前会话）
                </h6>
                <p className="mb-3 text-sm text-stone-600">在终端中运行以下命令：</p>
                <div className="overflow-x-auto rounded bg-stone-900 p-3 font-mono text-sm text-green-400">
                  <div className="text-stone-300">
                    export ANTHROPIC_BASE_URL="你的中转服务地址"
                  </div>
                  <div className="text-stone-300">
                    export ANTHROPIC_AUTH_TOKEN="你的API密钥"
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-purple-200 bg-white p-4">
                <h6 className="mb-2 text-base font-medium text-stone-800">
                  方法二：永久设置（推荐）
                </h6>
                <p className="mb-3 text-sm text-stone-600">
                  编辑你的 shell 配置文件：
                </p>
                <div className="mb-3 overflow-x-auto rounded bg-stone-900 p-3 font-mono text-sm text-green-400">
                  <div className="mb-2"># 编辑 ~/.bashrc 或 ~/.zshrc</div>
                  <div className="text-stone-300">nano ~/.bashrc</div>
                  <div className="mb-2 mt-3"># 添加以下内容</div>
                  <div className="text-stone-300">export ANTHROPIC_BASE_URL="你的中转服务地址"</div>
                  <div className="text-stone-300">export ANTHROPIC_AUTH_TOKEN="你的API密钥"</div>
                  <div className="mb-2 mt-3"># 重新加载配置</div>
                  <div className="text-stone-300">source ~/.bashrc</div>
                </div>
              </div>
            </div>
          </div>

          {/* 验证环境变量设置 */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <h6 className="mb-2 font-medium text-blue-800">验证环境变量设置</h6>
            <p className="mb-3 text-sm text-blue-700">
              设置完环境变量后，可以通过以下命令验证：
            </p>
            <div className="space-y-1 overflow-x-auto rounded bg-stone-900 p-3 font-mono text-sm text-green-400">
              <div className="text-stone-300">echo $ANTHROPIC_BASE_URL</div>
              <div className="text-stone-300">echo $ANTHROPIC_AUTH_TOKEN</div>
            </div>
          </div>
        </div>

        {/* 第四步：开始使用 */}
        <div className="tutorial-section">
          <h4 className="mb-4 flex items-center text-xl font-semibold text-stone-800">
            <span className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">4</span>
            开始使用 Claude Code
          </h4>

          <div className="rounded-xl border border-orange-100 bg-gradient-to-r from-orange-50 to-yellow-50 p-6">
            <h5 className="mb-3 flex items-center text-lg font-semibold text-stone-800">
              <span className="mr-2 text-orange-600">🚀</span>
              启动 Claude Code
            </h5>
            <p className="mb-4 text-stone-700">
              现在你可以在任何项目目录中使用 Claude Code：
            </p>
            <div className="overflow-x-auto rounded-lg bg-stone-900 p-4 font-mono text-sm text-green-400">
              <div className="mb-2"># 在项目目录中启动 Claude Code</div>
              <div className="text-stone-300">claude</div>
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4">
            <h6 className="mb-2 font-medium text-green-800">🎉 恭喜！设置完成</h6>
            <p className="text-green-700">现在你可以享受 Claude Code 带来的智能编程体验了！</p>
          </div>
        </div>
      </div>
    );
  };

  /**
   * 渲染当前系统的教程内容
   */
  const renderTutorialContent = () => {
    switch (activeSystem) {
      case 'windows':
        return renderWindowsTutorial();
      case 'macos':
        return rendermacOSTutorial();
      case 'linux':
        return renderLinuxTutorial();
      default:
        return renderWindowsTutorial();
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* 页面头部 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8 text-center"
      >
        <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-orange-100 text-orange-800 mb-6">
          <span className="mr-2">🎓</span>
          Claude Code 使用教程
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-stone-900 mb-4">
          Claude Code
          <br />
          <span className="text-gradient bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            使用教程
          </span>
        </h1>
        <p className="text-xl text-stone-600 max-w-3xl mx-auto">
          跟着这个教程，你可以轻松在自己的电脑上安装并使用 Claude Code。
        </p>
      </motion.div>

      {/* 系统选择标签 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {renderSystemTabs()}
      </motion.div>

      {/* 教程内容 */}
      <motion.div
        key={activeSystem}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="tutorial-content"
      >
        <Card className="p-8">
          {renderTutorialContent()}
        </Card>
      </motion.div>
    </div>
  );
};

export default TutorialPage;