import React, { createContext, useContext, useState, useMemo } from 'react';
import { InspectionCase } from '../../types';
import { caseService } from '../../services/caseService';

interface CaseContextType {
  selectedCaseId: string;
  currentCase: InspectionCase;
  allCases: InspectionCase[];
  selectCase: (caseId: string) => void;
  addNewCase: (newCaseData: Partial<InspectionCase>) => InspectionCase;
  updateCurrentCase: (updates: Partial<InspectionCase>) => void;
}

const CaseContext = createContext<CaseContextType | undefined>(undefined);

export const CaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cases, setCases] = useState<InspectionCase[]>(() => caseService.getAllCases());
  const [selectedCaseId, setSelectedCaseId] = useState<string>('CASE-2026-0841');

  const currentCase = useMemo(() => {
    return cases.find((c) => c.id === selectedCaseId) || cases[0] || caseService.getDefaultCase();
  }, [cases, selectedCaseId]);

  const selectCase = (caseId: string) => {
    setSelectedCaseId(caseId);
  };

  const addNewCase = (data: Partial<InspectionCase>): InspectionCase => {
    const defaultTemplate = caseService.getDefaultCase();
    const newId = `CASE-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newCase: InspectionCase = {
      ...defaultTemplate,
      id: newId,
      productName: data.productName || 'Unnamed Packaged Commodity',
      category: data.category || 'Packaged Commodity',
      manufacturer: data.manufacturer || 'Manufacturer Not Specified',
      createdDate: new Date().toISOString().split('T')[0],
      overallStatus: data.overallStatus || 'NEEDS_HUMAN_VERIFICATION',
      officer: data.officer || 'Officer Vikram Sharma (LM-DL-4029)',
      image: data.image || defaultTemplate.image,
      declarations: data.declarations || defaultTemplate.declarations,
      rules: data.rules || defaultTemplate.rules,
      boundingBoxes: data.boundingBoxes || defaultTemplate.boundingBoxes,
    };

    setCases((prev) => [newCase, ...prev]);
    setSelectedCaseId(newId);
    return newCase;
  };

  const updateCurrentCase = (updates: Partial<InspectionCase>) => {
    setCases((prev) =>
      prev.map((c) => (c.id === selectedCaseId ? { ...c, ...updates } : c))
    );
  };

  const value = useMemo(
    () => ({
      selectedCaseId,
      currentCase,
      allCases: cases,
      selectCase,
      addNewCase,
      updateCurrentCase,
    }),
    [selectedCaseId, currentCase, cases]
  );

  return <CaseContext.Provider value={value}>{children}</CaseContext.Provider>;
};

export const useInspectionCase = (): CaseContextType => {
  const context = useContext(CaseContext);
  if (!context) {
    throw new Error('useInspectionCase must be used within a CaseProvider');
  }
  return context;
};
