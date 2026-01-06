# SSR 混合架构部署文档

## 架构概述

本项目采用 **Next.js + Vite 混合架构**，实现了最优的 SEO 和性能：

```
用户请求
    ↓
Nginx 网关 (nginx-gateway:80)
    ↓
    ├─ / (首页)           → Next.js SSR (nextjs-landing:3001)
    ├─ /login             → Vite 应用 (vite-app:80)
    ├─ /dashboard/*       → Vite 应用 (vite-app:80)
    └─ /api/*             → 后端服务 (backend:3000)
```

## 项目结构

```
swift_code_fe/
├── nextjs-landing/          # Next.js SSR 首页
│   ├── src/
│   │   └── app/
│   │       ├── layout.tsx   # 根布局（SEO meta）
│   │       ├── page.tsx     # 首页组件
│   │       └── globals.css  # 全局样式
│   ├── Dockerfile           # Next.js 镜像
│   ├── package.json
│   └── next.config.js
│
├── src/                     # Vite React 应用（管理后台）
├── Dockerfile               # Vite 应用镜像
├── nginx.conf               # Vite 应用内部 Nginx 配置
├── nginx-gateway.conf       # 网关路由配置
└── docker-compose.yml       # 容器编排
```

## 核心配置说明

### 1. Nginx 网关路由规则

`nginx-gateway.conf` 负责请求分发：

- **首页 `/`** → Next.js（SSR，SEO 友好）
- **登录/后台 `/login`, `/dashboard/*`** → Vite 应用（CSR）
- **API `/api/*`, `/admin/*`, `/web/*`** → 后端服务

### 2. Next.js 配置

`nextjs-landing/next.config.js`：
- `output: 'standalone'` - 生成独立运行的服务器
- `rewrites` - 配置内部路由重写（备用）

### 3. Docker Compose 服务

- **nginx-gateway** - 入口网关，端口 80
- **nextjs-landing** - Next.js SSR 服务，内部端口 3001
- **vite-app** - Vite React 应用，内部端口 80
- **backend** - 后端 API 服务，内部端口 3000

## 部署步骤

### 1. 安装 Next.js 依赖

```bash
cd nextjs-landing
npm install
cd ..
```

### 2. 配置后端镜像

编辑 `docker-compose.yml`，将 `your-backend-image:latest` 替换为实际的后端镜像：

```yaml
backend:
  image: ghcr.io/your-username/backend:latest  # 修改这里
```

### 3. 构建并启动服务

```bash
# 构建所有镜像
docker-compose build

# 启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps
```

### 4. 验证部署

- 访问 `http://localhost/` - 应该看到 Next.js SSR 首页
- 访问 `http://localhost/login` - 应该看到 Vite 登录页
- 访问 `http://localhost/dashboard` - 应该看到管理后台

### 5. 查看日志

```bash
# 查看所有服务日志
docker-compose logs -f

# 查看特定服务日志
docker-compose logs -f nextjs-landing
docker-compose logs -f vite-app
docker-compose logs -f nginx-gateway
```

## SEO 优化说明

### Next.js 首页的 SEO 优势

1. **服务端渲染** - 搜索引擎爬虫直接获取完整 HTML
2. **Meta 标签优化** - 在 `layout.tsx` 中配置了完整的 SEO meta
3. **Open Graph 支持** - 社交媒体分享时显示正确的预览

### 验证 SSR 是否生效

```bash
# 使用 curl 查看首页 HTML（应该包含完整内容）
curl http://localhost/ | grep "Claude Relay Service"

# 如果看到内容，说明 SSR 成功
```

## 常见问题

### 1. Next.js 构建失败

**问题**：`npm run build` 失败

**解决**：
```bash
cd nextjs-landing
rm -rf node_modules package-lock.json
npm install
npm run build
```

### 2. Nginx 网关无法访问后端服务

**问题**：API 请求返回 502 Bad Gateway

**原因**：容器之间网络不通

**解决**：
- 确保所有服务都在同一个 `app-network` 网络中
- 检查服务名称是否正确（`backend:3000` 而不是 `localhost:3000`）

### 3. 首页显示空白

**问题**：访问 `/` 返回空白页面

**排查步骤**：
```bash
# 1. 检查 Next.js 服务是否运行
docker-compose ps nextjs-landing

# 2. 查看 Next.js 日志
docker-compose logs nextjs-landing

# 3. 检查 Nginx 配置
docker-compose exec nginx-gateway cat /etc/nginx/conf.d/default.conf
```

## CI/CD 配置更新

由于现在有两个前端项目，需要更新 GitHub Actions 配置。

### 更新 `.github/workflows/ci.yml`

需要添加 Next.js 项目的构建步骤：

```yaml
# 在现有的前端构建步骤后添加
- name: Build Next.js Landing Page
  run: |
    cd nextjs-landing
    npm ci
    npm run build

# 更新 Docker 构建步骤，构建两个镜像
- name: Build Docker images
  run: |
    # 构建 Vite 应用镜像
    docker build -t $REGISTRY_URL/swiftcode-vite:$TAG .

    # 构建 Next.js 镜像
    docker build -t $REGISTRY_URL/swiftcode-nextjs:$TAG ./nextjs-landing
```

## 架构优势总结

### ✅ SEO 优化
- 首页使用 Next.js SSR，搜索引擎可以直接抓取完整 HTML
- 配置了完整的 meta 标签和 Open Graph 信息
- 社交媒体分享时显示正确的预览卡片

### ✅ 性能优化
- 首页服务端渲染，首屏加载速度快
- 管理后台使用 CSR，保持交互流畅
- Nginx 网关统一入口，减少跨域问题

### ✅ 开发体验
- Next.js 和 Vite 项目独立开发，互不影响
- 保留了原有的 Vite 开发体验
- 只需要维护首页的 SSR 代码

### ✅ 部署灵活
- 可以独立更新首页或后台
- 通过 Nginx 灵活配置路由规则
- 支持水平扩展（可以启动多个实例）

## 下一步

1. **本地测试**：先在本地运行 `docker-compose up` 验证配置
2. **更新 CI/CD**：修改 GitHub Actions 配置以构建两个镜像
3. **生产部署**：将镜像推送到镜像仓库后部署到生产环境
4. **SEO 验证**：使用 Google Search Console 验证 SEO 效果

## 联系方式

如有问题，请查看项目 README 或提交 Issue。
