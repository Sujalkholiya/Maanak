import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CaptureScreen } from '../../features/inspection/components/CaptureScreen';
import { useInspectionCase } from '../../hooks/useInspectionCase';
import { ROUTES } from '../../app/router/routes';

export const ScanPackagePage: React.FC = () => {
  const navigate = useNavigate();
  const { currentCase, selectCase } = useInspectionCase();

  return (
    <CaptureScreen
      currentCase={currentCase}
      onProceedToAnalysis={() => navigate(ROUTES.WORKFLOW.COMPLIANCE_XRAY)}
      onSelectSampleCase={selectCase}
    />
  );
};

export default ScanPackagePage;
