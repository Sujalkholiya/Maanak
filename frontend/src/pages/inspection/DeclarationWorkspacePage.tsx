import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DeclarationWorkspace } from '../../features/inspection/components/DeclarationWorkspace';
import { useInspectionCase } from '../../hooks/useInspectionCase';
import { ROUTES } from '../../app/router/routes';

export const DeclarationWorkspacePage: React.FC = () => {
  const navigate = useNavigate();
  const { currentCase } = useInspectionCase();

  return (
    <DeclarationWorkspace
      currentCase={currentCase}
      onProceedToApplicability={() => navigate(ROUTES.TOOLS.APPLICABILITY)}
      onOpenXRay={() => navigate(ROUTES.WORKFLOW.COMPLIANCE_XRAY)}
    />
  );
};

export default DeclarationWorkspacePage;
