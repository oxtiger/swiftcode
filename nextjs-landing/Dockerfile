# 多阶段构建 Dockerfile for Next.js

# 阶段 1: 依赖安装
FROM node:20-alpine AS deps
WORKDIR /app

# 复制 package.json
COPY package*.json ./
RUN npm ci

# 阶段 2: 构建阶段
FROM node:20-alpine AS builder
WORKDIR /app

# 复制依赖
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 构建 Next.js 应用
RUN npm run build

# 确保 public 目录存在（即使为空）
RUN mkdir -p /app/public

# 阶段 3: 生产运行
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# 创建非 root 用户
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 复制必要文件
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3001

ENV PORT=3001

CMD ["node", "server.js"]
