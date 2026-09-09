import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ComplianceXRay } from '../../features/compliance/components/ComplianceXRay';
import { useInspectionCase } from '../../hooks/useInspectionCase';
import { ROUTES } from '../../app/router/routes';

export const ComplianceXRayPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentCase, selectCase } = useInspectionCase();

  return (
    <ComplianceXRay
      currentCase={currentCase}
      onNavigateToRule={() => navigate(ROUTES.GOVERNANCE.RULE_LIBRARY)}
      onProceedToReview={() => navigate(ROUTES.WORKFLOW.EVIDENCE_VAULT)}
      onSelectSampleCase={selectCase}
    />
  );
};

export default ComplianceXRayPage;
