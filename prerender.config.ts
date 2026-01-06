import { PrerenderRoute } from 'vite-plugin-prerender';

// 需要预渲染的路由列表
export const prerenderRoutes: PrerenderRoute[] = [
  {
    // 首页
    path: '/',
    // 可选：自定义 meta 标签
    meta: {
      title: 'SwiftCode - AI API 管理平台',
      description: '统一管理 Claude、Gemini 等 AI 模型的 API 密钥和使用情况',
      keywords: 'AI, API, Claude, Gemini, 管理平台',
    },
  },
  // 如果有其他公开页面，可以继续添加
  // {
  //   path: '/about',
  //   meta: {
  //     title: '关于我们 - SwiftCode',
  //     description: '了解 SwiftCode 平台',
  //   },
  // },
];
