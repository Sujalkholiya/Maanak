import React from 'react';
import { CaseProvider } from './CaseContext';
import { ToastProvider } from './ToastContext';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ToastProvider>
      <CaseProvider>{children}</CaseProvider>
    </ToastProvider>
  );
};
