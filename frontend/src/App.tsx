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
        {/* MAIN HEADER / CONTROL BAR (Single minimal row: Search, Status, Demo Mode, Notifications, Profile) */}
        <TopBar
          onOpenSearch={() => setIsSearchOpen(true)}
          isOfflineMode={isOfflineMode}
          onToggleOffline={() => setIsOfflineMode(!isOfflineMode)}
          onNavigateView={handleNavigate}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onSignOut={() => setCurrentView('login')}
        />


        {/* Scrollable Viewport Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#F8FAFC]">
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
