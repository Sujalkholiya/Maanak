import React from 'react';
import { useNavigate } from 'react-router-dom';
import { EcommerceComparisonView } from '../../features/intelligence/components/EcommerceComparisonView';
import { ROUTES } from '../../app/router/routes';

export const EcommerceComparisonPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <EcommerceComparisonView
      onOpenXRay={() => navigate(ROUTES.WORKFLOW.COMPLIANCE_XRAY)}
      onProceedToReview={() => navigate(ROUTES.TOOLS.OFFICER_REVIEW)}
    />
  );
};

export default EcommerceComparisonPage;
