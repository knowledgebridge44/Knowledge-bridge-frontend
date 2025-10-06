import React, { ReactNode } from 'react';
import { TopNav } from '@/components/TopNav';
import { ToastContainer } from '@/components/Toast';
import { useToastManager } from '@/hooks/useToast';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { toasts, removeToast } = useToastManager();

  return (
    <div className="min-h-screen bg-academic-bg dark:bg-dark-academic-bg">
      <TopNav />
      <main>{children}</main>
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
};


