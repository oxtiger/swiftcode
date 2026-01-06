import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SwiftCode - AI API 管理平台',
  description: '统一管理 Claude、Gemini 等 AI 模型的 API 密钥和使用情况',
  keywords: 'AI, API, Claude, Gemini, 管理平台, SwiftCode',
  openGraph: {
    title: 'SwiftCode - AI API 管理平台',
    description: '统一管理 Claude、Gemini 等 AI 模型的 API 密钥和使用情况',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
