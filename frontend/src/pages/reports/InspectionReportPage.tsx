import React from 'react';
import { InspectionReportView } from '../../features/reports/components/InspectionReportView';
import { useInspectionCase } from '../../hooks/useInspectionCase';

export const InspectionReportPage: React.FC = () => {
  const { currentCase } = useInspectionCase();
  return <InspectionReportView currentCase={currentCase} />;
};

export default InspectionReportPage;
