# CI/CD 配置更新总结

## 修复的问题

### 1. ✅ 缓存路径错误
**问题**: `cache-dependency-path: 'web/package-lock.json'` 路径不存在
**修复**: 改为 `package-lock.json`（项目根目录）

### 2. ✅ 构建路径错误
**问题**: `cd web` 目录不存在
**修复**: 直接在根目录执行 `npm ci && npm run build`

## 新增功能

### 1. ✅ Next.js 项目构建
添加了 Next.js 落地页的构建步骤：
- 独立的 Node.js 环境配置
- 独立的依赖安装和构建
- 缓存路径：`nextjs-landing/package-lock.json`

### 2. ✅ 双镜像构建
现在构建两个独立的 Docker 镜像：
- **Vite 应用镜像**: `swiftcode-vite`
- **Next.js 应用镜像**: `swiftcode-nextjs`

### 3. ✅ 镜像推送优化
分别推送到两个镜像仓库：
- Harbor: `$REGISTRY_URL/swiftcode-vite` 和 `swiftcode-nextjs`
- GHCR: `ghcr.io/{owner}/swiftcode-vite` 和 `swiftcode-nextjs`

### 4. ✅ 通知消息更新
- 成功通知：显示两个镜像的信息和拉取命令
- 失败通知：新增 Next.js 相关步骤的失败检测

## 更新的步骤

1. **Setup Node.js for Vite** - Vite 项目的 Node.js 环境
2. **Build Vite Frontend** - 构建 Vite 应用
3. **Setup Node.js for Next.js** - Next.js 项目的 Node.js 环境
4. **Build Next.js Landing Page** - 构建 Next.js 应用
5. **Build Vite Docker image** - 构建 Vite Docker 镜像
6. **Build Next.js Docker image** - 构建 Next.js Docker 镜像
7. **Push Vite image to GHCR** - 推送 Vite 镜像到 GHCR
8. **Push Next.js image to GHCR** - 推送 Next.js 镜像到 GHCR
9. **Push Vite image to Harbor** - 推送 Vite 镜像到 Harbor
10. **Push Next.js image to Harbor** - 推送 Next.js 镜像到 Harbor

## 失败检测步骤

现在可以检测以下失败场景：
- 登录 Harbor 失败
- 登录 GHCR 失败
- Vite 前端构建失败
- Next.js 构建失败
- Vite Docker 镜像构建失败
- Next.js Docker 镜像构建失败
- Vite 镜像推送到 Harbor 失败
- Next.js 镜像推送到 Harbor 失败
- Vite 镜像推送到 GHCR 失败
- Next.js 镜像推送到 GHCR 失败

## 测试建议

提交代码后，检查 GitHub Actions 是否：
1. ✅ 正确找到 `package-lock.json` 文件
2. ✅ 成功构建 Vite 应用
3. ✅ 成功构建 Next.js 应用
4. ✅ 成功构建两个 Docker 镜像
5. ✅ 成功推送到两个镜像仓库
6. ✅ 企业微信通知包含两个镜像信息
