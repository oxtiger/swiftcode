/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  // 配置重写规则，将 /login 和 /dashboard 代理到 Vite 应用
  async rewrites() {
    return [
      {
        source: '/login',
        destination: 'http://vite-app:80/login',
      },
      {
        source: '/dashboard/:path*',
        destination: 'http://vite-app:80/dashboard/:path*',
      },
    ];
  },
}

module.exports = nextConfig
