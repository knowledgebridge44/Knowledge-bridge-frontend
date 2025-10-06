import { useState, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

let toastCounter = 0;

// Global toast manager
let globalAddToast: ((type: ToastType, message: string) => void) | null = null;

export const useToastManager = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = `toast-${++toastCounter}`;
    const toast: Toast = { id, type, message };
    
    setToasts(prev => [...prev, toast]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Set global reference
  if (!globalAddToast) {
    globalAddToast = addToast;
  }

  return { toasts, addToast, removeToast };
};

// Hook to show toasts from any component
export const useToast = () => {
  const showToast = useCallback((type: ToastType, message: string) => {
    if (globalAddToast) {
      globalAddToast(type, message);
    }
  }, []);

  return {
    success: (message: string) => showToast('success', message),
    error: (message: string) => showToast('error', message),
    info: (message: string) => showToast('info', message),
    warning: (message: string) => showToast('warning', message),
  };
};


