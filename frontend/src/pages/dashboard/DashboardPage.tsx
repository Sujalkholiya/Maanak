import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardView } from '../../features/dashboard/components/DashboardView';
import { useInspectionCase } from '../../hooks/useInspectionCase';
import { useToast } from '../../hooks/useToast';
import { ROUTES } from '../../app/router/routes';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { selectCase } = useInspectionCase();
  const { showToast } = useToast();

  const handleNavigate = (view: string) => {
    switch (view) {
      case 'new-inspection':
        navigate(ROUTES.WORKFLOW.NEW_INSPECTION);
        break;
      case 'scan-package':
        navigate(ROUTES.WORKFLOW.SCAN_PACKAGE);
        break;
      case 'compliance-xray':
        navigate(ROUTES.WORKFLOW.COMPLIANCE_XRAY);
        break;
      case 'human-verification':
        navigate(ROUTES.TOOLS.OFFICER_REVIEW);
        break;
      case 'cases':
        navigate(ROUTES.CASES);
        break;
      case 'analytics':
        navigate(ROUTES.GOVERNANCE.ANALYTICS);
        break;
      case 'heatmap':
        navigate(ROUTES.GOVERNANCE.HEATMAP);
        break;
      case 'manufacturers':
        navigate(ROUTES.GOVERNANCE.MANUFACTURERS);
        break;
      case 'reports':
        navigate(ROUTES.WORKFLOW.INSPECTION_REPORT);
        break;
      case 'evidence-vault':
        navigate(ROUTES.WORKFLOW.EVIDENCE_VAULT);
        break;
      default:
        navigate(view.startsWith('/') ? view : `/${view}`);
    }
  };

  const handleSelectCase = (caseId: string) => {
    selectCase(caseId);
    navigate(ROUTES.WORKFLOW.COMPLIANCE_XRAY);
  };

  return (
    <DashboardView
      onNavigate={handleNavigate}
      onSelectCase={handleSelectCase}
      onShowToast={showToast}
    />
  );
};

export default DashboardPage;
