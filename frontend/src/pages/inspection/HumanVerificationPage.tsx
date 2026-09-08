import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HumanVerificationView } from '../../features/inspection/components/HumanVerificationView';
import { useInspectionCase } from '../../hooks/useInspectionCase';
import { ROUTES } from '../../app/router/routes';

export const HumanVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentCase } = useInspectionCase();

  return (
    <HumanVerificationView
      currentCase={currentCase}
      onProceedToReport={() => navigate(ROUTES.WORKFLOW.INSPECTION_REPORT)}
    />
  );
};

export default HumanVerificationPage;
