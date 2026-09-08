import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { ToastMessage } from '../../components/common/Toast';

interface ToastContextType {
  toasts: ToastMessage[];
  showToast: (
    title: string,
    description?: string,
    type?: 'success' | 'warning' | 'info' | 'error',
    undoAction?: () => void
  ) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback(
    (
      title: string,
      description?: string,
      type: 'success' | 'warning' | 'info' | 'error' = 'info',
      undoAction?: () => void
    ) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
      setToasts((prev) => [...prev, { id, title, description, type, undoAction }]);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const value = useMemo(
    () => ({
      toasts,
      showToast,
      dismissToast,
    }),
    [toasts, showToast, dismissToast]
  );

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
