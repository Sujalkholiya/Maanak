import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/common/Sidebar';
import { TopBar } from './components/common/TopBar';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { DashboardView } from './components/views/DashboardView';
import { NewInspectionWorkflow } from './components/views/NewInspectionWorkflow';
import { ComplianceXRay } from './components/views/ComplianceXRay';
import { CaptureScreen } from './components/views/CaptureScreen';
import { DeclarationWorkspace } from './components/views/DeclarationWorkspace';
import { ApplicabilityEngineView } from './components/views/ApplicabilityEngineView';
import { RuleEngineView } from './components/views/RuleEngineView';
import { FontPdpAnalysisView } from './components/views/FontPdpAnalysisView';
import { HumanVerificationView } from './components/views/HumanVerificationView';
import { InspectionReportView } from './components/views/InspectionReportView';
import { CaseManagementView } from './components/views/CaseManagementView';
import { ManufacturerIntelligenceView } from './components/views/ManufacturerIntelligenceView';
import { EcommerceComparisonView } from './components/views/EcommerceComparisonView';
import { HeatmapView } from './components/views/HeatmapView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { EvidenceVaultView } from './components/views/EvidenceVaultView';
import { AuditTrailView } from './components/views/AuditTrailView';
import { RuleLibraryView } from './components/views/RuleLibraryView';
import { OfflineFieldModeView } from './components/views/OfflineFieldModeView';
import { SettingsView } from './components/views/SettingsView';
import { AuthView } from './components/views/AuthView';
import { DEMO_CASES } from './data/mockData';
import { Menu, X, ShieldAlert, AlertCircle } from 'lucide-react';

export function App() {
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [selectedCaseId, setSelectedCaseId] = useState<string>('CASE-2026-0841');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  // Global Ctrl+K / Cmd+K listener for universal search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const currentCase =
    DEMO_CASES.find((c) => c.id === selectedCaseId) || DEMO_CASES[0];

  const handleSelectCase = (caseId: string) => {
    setSelectedCaseId(caseId);
    setCurrentView('compliance-xray');
  };

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
  };

  if (!isAuthenticated || currentView === 'login') {
    return (
      <AuthView
        onLoginSuccess={() => {
          setIsAuthenticated(true);
          setCurrentView('dashboard');
        }}
      />
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 font-sans text-slate-900">
      {/* Desktop Sidebar (hidden on mobile) */}
      <div className="hidden lg:flex shrink-0">
        <Sidebar
          currentView={currentView}
          onNavigate={handleNavigate}
          pendingReviewsCount={3}
          isOfflineMode={isOfflineMode}
        />
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <div className="relative z-10 w-72 max-w-[85vw] h-full bg-[#0B192C] flex flex-col">
            <div className="p-3 border-b border-slate-800 flex justify-end">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <Sidebar
              currentView={currentView}
              onNavigate={handleNavigate}
              pendingReviewsCount={3}
              isOfflineMode={isOfflineMode}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* 1. TOP SYSTEM BAR (Clean, Simplified, Government-Grade) */}
        <div className="no-print h-8 bg-[#07111F] text-slate-300 text-[11px] px-4 sm:px-6 border-b border-slate-800/90 flex items-center justify-between select-none shrink-0 z-40">
          {/* LEFT: Online indicator + METROSCAN + SIH26034 + Subtitle */}
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 shadow-2xs"></span>
            <span className="font-bold text-white tracking-wider text-xs">METROSCAN</span>
            <span className="font-mono text-[10px] font-semibold text-blue-300 bg-blue-950/90 px-1.5 py-0.5 rounded border border-blue-800/60 shrink-0 leading-none">
              SIH26034
            </span>
            <span className="text-slate-400 text-[11px] hidden md:inline truncate font-normal">
              Legal Metrology Compliance Scanner for Packaged Commodities
            </span>
          </div>

          {/* RIGHT: RuleDB badge + Demo Environment subtle badge + Sign Out */}
          <div className="flex items-center gap-2.5 shrink-0">
            <span className="font-mono text-[10px] font-semibold text-cyan-300 bg-slate-800/90 px-2 py-0.5 rounded border border-slate-700/80 leading-none">
              RuleDB v2026.3
            </span>
            <span className="text-[10px] font-medium text-slate-400 bg-slate-800/50 px-2 py-0.5 rounded border border-slate-700/50 hidden sm:inline leading-none">
              Demo Environment
            </span>
            <button
              onClick={() => setCurrentView('login')}
              className="text-[11px] text-slate-400 hover:text-white transition-colors cursor-pointer ml-0.5"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* 2. MAIN HEADER / CONTROL BAR */}
        <TopBar
          onOpenSearch={() => setIsSearchOpen(true)}
          isOfflineMode={isOfflineMode}
          onToggleOffline={() => setIsOfflineMode(!isOfflineMode)}
          onNavigateView={handleNavigate}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        />


        {/* Scrollable Viewport Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100">
          {currentView === 'dashboard' && (
            <DashboardView
              onNavigate={handleNavigate}
              onSelectCase={handleSelectCase}
            />
          )}

          {currentView === 'new-inspection' && (
            <NewInspectionWorkflow
              currentCase={currentCase}
              onOpenXRay={() => setCurrentView('compliance-xray')}
              onSelectSampleCase={(id) => setSelectedCaseId(id)}
            />
          )}

          {currentView === 'scan-package' && (
            <CaptureScreen
              currentCase={currentCase}
              onProceedToAnalysis={() => setCurrentView('declaration-extraction')}
              onSelectSampleCase={(id) => setSelectedCaseId(id)}
            />
          )}

          {currentView === 'compliance-xray' && (
            <ComplianceXRay
              currentCase={currentCase}
              onNavigateToRule={() => setCurrentView('rule-library')}
              onProceedToReview={() => setCurrentView('human-verification')}
              onSelectSampleCase={(id) => setSelectedCaseId(id)}
            />
          )}

          {currentView === 'declaration-extraction' && (
            <DeclarationWorkspace
              currentCase={currentCase}
              onProceedToApplicability={() => setCurrentView('applicability-engine')}
              onOpenXRay={() => setCurrentView('compliance-xray')}
            />
          )}

          {currentView === 'applicability-engine' && (
            <ApplicabilityEngineView
              currentCase={currentCase}
              onProceedToRuleValidation={() => setCurrentView('new-inspection')}
            />
          )}

          {currentView === 'font-pdp-analysis' && (
            <FontPdpAnalysisView
              currentCase={currentCase}
              onProceedToReview={() => setCurrentView('human-verification')}
            />
          )}

          {currentView === 'product-listings' && (
            <EcommerceComparisonView
              onOpenXRay={() => setCurrentView('compliance-xray')}
              onProceedToReview={() => setCurrentView('human-verification')}
            />
          )}

          {currentView === 'cases' && (
            <CaseManagementView
              onSelectCase={handleSelectCase}
              onNewInspection={() => setCurrentView('new-inspection')}
            />
          )}

          {currentView === 'human-verification' && (
            <HumanVerificationView
              currentCase={currentCase}
              onProceedToReport={() => setCurrentView('reports')}
            />
          )}

          {currentView === 'reports' && (
            <InspectionReportView currentCase={currentCase} />
          )}

          {currentView === 'manufacturers' && <ManufacturerIntelligenceView />}

          {currentView === 'heatmap' && <HeatmapView />}

          {currentView === 'analytics' && <AnalyticsView />}

          {currentView === 'evidence-vault' && <EvidenceVaultView />}

          {currentView === 'audit-trail' && <AuditTrailView />}

          {currentView === 'rule-library' && <RuleLibraryView />}

          {currentView === 'offline-field' && (
            <OfflineFieldModeView
              isOffline={isOfflineMode}
              onToggleOffline={() => setIsOfflineMode(!isOfflineMode)}
              onNewOfflineInspection={() => setCurrentView('new-inspection')}
            />
          )}

          {currentView === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Global Universal Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectCase={handleSelectCase}
        onNavigateView={handleNavigate}
      />
    </div>
  );
}
export default App;
