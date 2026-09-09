import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { InspectionCase } from '../../types';
import { caseService } from '../../services/caseService';

interface CaseContextType {
  selectedCaseId: string;
  currentCase: InspectionCase;
  allCases: InspectionCase[];
  isLoading: boolean;
  selectCase: (caseId: string) => void;
  addNewCase: (newCaseData: Partial<InspectionCase>) => InspectionCase;
  updateCurrentCase: (updates: Partial<InspectionCase>) => void;
  persistCurrentCase: (updates?: Partial<InspectionCase>) => Promise<InspectionCase>;
  refreshCases: () => Promise<void>;
}

const CaseContext = createContext<CaseContextType | undefined>(undefined);

export const CaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cases, setCases] = useState<InspectionCase[]>([caseService.getDefaultCase()]);
  const [selectedCaseId, setSelectedCaseId] = useState<string>('CASE-2026-0841');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshCases = useCallback(async () => {
    try {
      setIsLoading(true);
      const loaded = await caseService.getAllCases();
      if (loaded.length > 0) {
        setCases(loaded);
        if (!selectedCaseId || !loaded.some((c) => c.id === selectedCaseId)) {
          setSelectedCaseId(loaded[0].id);
        }
      }
    } catch (error) {
      console.warn('Failed to load cases from backend:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCaseId]);

  useEffect(() => {
    refreshCases();
  }, [refreshCases]);

  const currentCase = useMemo(() => {
    return cases.find((c) => c.id === selectedCaseId) || cases[0] || caseService.getDefaultCase();
  }, [cases, selectedCaseId]);

  const selectCase = useCallback((caseId: string) => {
    setSelectedCaseId(caseId);
  }, []);

  const addNewCase = useCallback((data: Partial<InspectionCase>): InspectionCase => {
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

    caseService.createCase(newCase).catch((err) => {
      console.warn('Background case creation warning:', err);
    });

    return newCase;
  }, []);

  const updateCurrentCase = useCallback(
    (updates: Partial<InspectionCase>) => {
      setCases((prev) =>
        prev.map((c) => {
          if (c.id === selectedCaseId) {
            return {
              ...c,
              ...updates,
              lastUpdated: new Date().toISOString(),
            };
          }
          return c;
        })
      );
    },
    [selectedCaseId]
  );

  const persistCurrentCase = useCallback(
    async (updates?: Partial<InspectionCase>): Promise<InspectionCase> => {
      const mergedUpdates = { ...updates };
      updateCurrentCase(mergedUpdates);
      const updated = await caseService.updateCase(selectedCaseId, {
        ...currentCase,
        ...mergedUpdates,
      });
      return updated;
    },
    [selectedCaseId, currentCase, updateCurrentCase]
  );

  const value = useMemo(
    () => ({
      selectedCaseId,
      currentCase,
      allCases: cases,
      isLoading,
      selectCase,
      addNewCase,
      updateCurrentCase,
      persistCurrentCase,
      refreshCases,
    }),
    [
      selectedCaseId,
      currentCase,
      cases,
      isLoading,
      selectCase,
      addNewCase,
      updateCurrentCase,
      persistCurrentCase,
      refreshCases,
    ]
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
