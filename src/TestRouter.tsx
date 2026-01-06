import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ClaudeCodeHomePage from '@/pages/ClaudeCodeHomePage';
import AppLayout from '@/components/AppLayout';
import DashboardPage from '@/pages/DashboardPage';
import UsageStatsPage from '@/pages/UsageStatsPage';
import TutorialPage from '@/pages/TutorialPage';

const SimpleLogin = () => (
  <div style={{ padding: '20px', fontSize: '24px' }}>
    <h1>This is Login Page!</h1>
    <p>Simple Login Test</p>
  </div>
);

export const TestRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 首页路由 */}
        <Route path="/" element={<ClaudeCodeHomePage />} />

        {/* 管理页面路由 - 使用共享布局 */}
        <Route path="/" element={<AppLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="usage-stats" element={<UsageStatsPage />} />
          <Route path="tutorial" element={<TutorialPage />} />
        </Route>

        {/* 其他路由 */}
        <Route path="/login" element={<SimpleLogin />} />
      </Routes>
    </BrowserRouter>
  );
};