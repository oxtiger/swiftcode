import React from 'react';
import { TestRouter } from './TestRouter';
import { ToastContainer } from '@/components/ui/Toast';

// 引入全局样式
import './styles/globals.css';


const App: React.FC = () => {
  return (
    <>
      <TestRouter />
      <ToastContainer />
    </>
  );
};

export default App;
