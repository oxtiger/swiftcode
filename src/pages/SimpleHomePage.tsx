import React from 'react';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6">
            <span className="text-orange-500">Claude</span> Relay Service
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            强大的 AI API 中转服务，支持 Claude 和 Gemini 双平台
          </p>
          <button
            className="bg-orange-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-600 transition-colors"
            onClick={() => window.location.href = '/login'}
          >
            开始使用
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;