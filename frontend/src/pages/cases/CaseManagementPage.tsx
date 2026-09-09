import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CaseManagementView } from '../../features/cases/components/CaseManagementView';
import { useInspectionCase } from '../../hooks/useInspectionCase';
import { ROUTES } from '../../app/router/routes';

export const CaseManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const { selectCase } = useInspectionCase();

  return (
    <CaseManagementView
      onSelectCase={(caseId) => {
        selectCase(caseId);
        navigate(ROUTES.WORKFLOW.COMPLIANCE_XRAY);
      }}
      onNewInspection={() => navigate(ROUTES.WORKFLOW.NEW_INSPECTION)}
    />
  );
};

export default CaseManagementPage;
