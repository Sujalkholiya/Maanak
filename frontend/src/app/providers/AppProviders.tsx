import React from 'react';
import { AuthProvider } from './AuthContext';
import { CaseProvider } from './CaseContext';
import { ToastProvider } from './ToastContext';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ToastProvider>
      <AuthProvider>
        <CaseProvider>{children}</CaseProvider>
      </AuthProvider>
    </ToastProvider>
  );
};
