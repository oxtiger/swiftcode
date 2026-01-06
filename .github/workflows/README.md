# GitHub Actions CI/CD 配置说明

## 📋 流程概览

CI/CD 流程包含以下 5 个主要任务：

1. **lint** - 代码检查和类型检查
2. **test** - 运行 Playwright 测试
3. **build** - 构建生产版本
4. **docker** - 构建并推送 Docker 镜像
5. **deploy-dev / deploy-prod** - 部署到开发/生产环境

## 🔧 必需的 GitHub Secrets

在 GitHub 项目的 **Settings > Secrets and variables > Actions** 中配置以下 Secrets：

### 部署相关

#### SSH 密钥
- `SSH_PRIVATE_KEY` - SSH 私钥（用于连接服务器）

#### 开发环境变量
- `DEV_SERVER_HOST` - 开发服务器地址（例如：dev.example.com）
- `DEV_SERVER_USER` - SSH 用户名（例如：deploy）
- `DEV_DEPLOY_PATH` - 部署路径（例如：/var/www/app）

#### 生产环境变量
- `PROD_SERVER_HOST` - 生产服务器地址（例如：example.com）
- `PROD_SERVER_USER` - SSH 用户名（例如：deploy）
- `PROD_DEPLOY_PATH` - 部署路径（例如：/var/www/app）

> **注意**：`GITHUB_TOKEN` 是自动提供的，无需手动配置。

## 🚀 工作流程

### 触发条件

- **Push 到以下分支**：
  - `main` / `master` - 触发完整流程（包括 Docker 构建和生产部署）
  - `develop` - 触发完整流程（包括 Docker 构建和开发环境部署）
  - 其他分支 - 只运行代码检查、测试和构建

- **Pull Request**：
  - 针对 `main` / `master` / `develop` 分支的 PR
  - 只运行代码检查、测试和构建

- **Tags**：
  - 以 `v` 开头的标签（例如：v1.0.0）
  - 触发完整流程并部署到生产环境

### 任务依赖关系

```
lint ─┐
      ├─> build ─> docker ─┬─> deploy-dev (仅 develop 分支)
test ─┘                    └─> deploy-prod (仅 main/master/tags)
```

### 自动执行的任务

所有分支和 PR 都会自动执行：
- ✅ ESLint 代码检查
- ✅ TypeScript 类型检查
- ✅ Playwright 测试
- ✅ 项目构建

main/master/develop 分支额外执行：
- ✅ Docker 镜像构建和推送
- ✅ 自动部署到对应环境

## 📦 Docker 镜像标签

每次构建会自动生成多个标签：

- `latest` - 最新的 main/master 分支版本
- `main` / `develop` - 对应分支的最新版本
- `main-abc1234` - 分支名 + Git commit SHA
- `v1.0.0` - 语义化版本标签（从 Git tags 生成）
- `1.0` - 主版本号.次版本号

镜像存储在 GitHub Container Registry：`ghcr.io/你的用户名/仓库名`

## 🔐 服务器配置

### 1. 生成 SSH 密钥对

在本地机器上生成 SSH 密钥：

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_deploy
```

### 2. 配置服务器

将公钥添加到服务器的 `~/.ssh/authorized_keys`：

```bash
ssh-copy-id -i ~/.ssh/github_deploy.pub deploy@your-server.com
```

### 3. 在服务器上安装 Docker 和 Docker Compose

```bash
# 安装 Docker
curl -fsSL https://get.docker.com | sh

# 安装 Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 将用户添加到 docker 组
sudo usermod -aG docker $USER
```

### 4. 在 GitHub 中配置 Secrets

1. 复制私钥内容：
```bash
cat ~/.ssh/github_deploy
```

2. 在 GitHub 项目中：
   - 进入 **Settings > Secrets and variables > Actions**
   - 点击 **New repository secret**
   - 添加以下 Secrets：

| Secret 名称 | 说明 | 示例值 |
|------------|------|--------|
| `SSH_PRIVATE_KEY` | SSH 私钥内容 | 粘贴私钥完整内容 |
| `DEV_SERVER_HOST` | 开发服务器地址 | dev.example.com |
| `DEV_SERVER_USER` | 开发服务器用户名 | deploy |
| `DEV_DEPLOY_PATH` | 开发环境部署路径 | /var/www/app |
| `PROD_SERVER_HOST` | 生产服务器地址 | example.com |
| `PROD_SERVER_USER` | 生产服务器用户名 | deploy |
| `PROD_DEPLOY_PATH` | 生产环境部署路径 | /var/www/app |

## 💡 使用示例

### 开发流程

1. **功能开发**：在 feature 分支开发
```bash
git checkout -b feature/new-feature
# 开发代码...
git add .
git commit -m "feat: add new feature"
git push origin feature/new-feature
```
   - GitHub Actions 会自动运行：代码检查、测试、构建
   - 不会构建 Docker 镜像或部署

2. **合并到 develop**：部署到开发环境
```bash
git checkout develop
git merge feature/new-feature
git push origin develop
```
   - 自动构建 Docker 镜像并推送
   - 自动部署到开发环境

3. **发布到生产**：合并到 main 分支
```bash
git checkout main
git merge develop
git push origin main
```
   - 自动构建 Docker 镜像并推送
   - 自动部署到生产环境

4. **版本发布**：创建版本标签
```bash
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```
   - 自动构建带版本号的 Docker 镜像
   - 自动部署到生产环境

## ⚙️ 自定义配置

### 跳过测试阶段

如果暂时不需要运行 Playwright 测试，可以在 `.github/workflows/ci.yml` 中注释掉 `test` job。

### 修改 Node.js 版本

在 `.github/workflows/ci.yml` 顶部修改：
```yaml
env:
  NODE_VERSION: '20'  # 改为你需要的版本
```

### 使用私有 Docker Registry

如果不使用 GitHub Container Registry，可以修改 Docker 登录步骤，使用自己的 Registry。

## ⚠️ 注意事项

1. **GitHub Container Registry 权限**
   - 首次推送镜像后，需要在 GitHub 包页面设置镜像为公开（如果需要）
   - 路径：`https://github.com/用户名/仓库名/pkgs/container/仓库名`

2. **服务器 Docker 登录**
   - 服务器需要登录 GitHub Container Registry 才能拉取镜像
   - 在服务器上执行：
   ```bash
   echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin
   ```

3. **环境变量配置**
   - 确保在 GitHub Environments 中配置了 `development` 和 `production` 环境
   - 可以在环境中设置保护规则，要求审批后才能部署

4. **分支保护**
   - 建议为 `main` 和 `develop` 分支设置保护规则
   - 要求 PR 审核和状态检查通过后才能合并

5. **测试失败处理**
   - 如果测试失败，构建流程会继续（`test` job 不会阻塞后续步骤）
   - 可以根据需要修改为阻塞模式