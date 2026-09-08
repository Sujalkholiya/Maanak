import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontPdpAnalysisView } from '../../features/inspection/components/FontPdpAnalysisView';
import { useInspectionCase } from '../../hooks/useInspectionCase';
import { ROUTES } from '../../app/router/routes';

export const FontPdpAnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentCase } = useInspectionCase();

  return (
    <FontPdpAnalysisView
      currentCase={currentCase}
      onProceedToReview={() => navigate(ROUTES.TOOLS.OFFICER_REVIEW)}
    />
  );
};

export default FontPdpAnalysisPage;
