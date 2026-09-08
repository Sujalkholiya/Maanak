import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthView } from '../../features/auth/components/AuthView';
import { ROUTES } from '../../app/router/routes';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AuthView
      onLoginSuccess={() => {
        navigate(ROUTES.DASHBOARD);
      }}
    />
  );
};

export default LoginPage;
