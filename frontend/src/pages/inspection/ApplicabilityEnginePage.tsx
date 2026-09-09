import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ApplicabilityEngineView } from '../../features/inspection/components/ApplicabilityEngineView';
import { useInspectionCase } from '../../hooks/useInspectionCase';
import { ROUTES } from '../../app/router/routes';

export const ApplicabilityEnginePage: React.FC = () => {
  const navigate = useNavigate();
  const { currentCase } = useInspectionCase();

  return (
    <ApplicabilityEngineView
      currentCase={currentCase}
      onProceedToRuleValidation={() => navigate(ROUTES.WORKFLOW.NEW_INSPECTION)}
    />
  );
};

export default ApplicabilityEnginePage;
