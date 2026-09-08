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
import { ToastContainer, ToastMessage } from './components/common/Toast';
import { ShortcutsModal } from './components/common/ShortcutsModal';
import { DEMO_CASES } from './data/mockData';
import { Menu, X, ShieldAlert, AlertCircle, Plus, ScanLine, HelpCircle } from 'lucide-react';

export function App() {
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [selectedCaseId, setSelectedCaseId] = useState<string>('CASE-2026-0841');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Toast notification trigger
  const showToast = (
    title: string,
    description?: string,
    type: 'success' | 'warning' | 'info' | 'error' = 'info',
    undoAction?: () => void
  ) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, title, description, type, undoAction }]);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Global Keyboard Shortcuts: Ctrl+K (search), N (new inspection), S (scan), ? (shortcuts help)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInputActive =
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          activeEl.tagName === 'SELECT' ||
          (activeEl as HTMLElement).isContentEditable);

      // Ctrl+K / Cmd+K universal search
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
        return;
      }

      // If user is actively typing in an input or search modal is open, do not hijack single keys
      if (isInputActive || isSearchOpen) return;

      // N: New Inspection
      if (e.key.toLowerCase() === 'n' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        setCurrentView('new-inspection');
        showToast('New Inspection', 'Loaded guided field inspection workflow.', 'info');
      }
      // S: Scan Package
      else if (e.key.toLowerCase() === 's' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        setCurrentView('scan-package');
        showToast('Scan Package', 'Switched to capture & OCR screen.', 'info');
      }
      // ?: Open Shortcuts modal
      else if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

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
    <div className="flex h-screen w-full overflow-hidden bg-[#F7F6F3] font-sans text-[#111413]">
      {/* Desktop Sidebar (hidden on mobile) */}
      <div className="hidden lg:flex shrink-0">
        <Sidebar
          currentView={currentView}
          onNavigate={handleNavigate}
          pendingReviewsCount={3}
          isOfflineMode={isOfflineMode}
          onTriggerSync={() =>
            showToast(
              'HQ Cloud Sync Complete',
              'All inspection records synchronized with Central Legal Metrology server.',
              'success'
            )
          }
        />
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <div className="relative z-10 w-72 max-w-[85vw] h-full bg-[#0F1F1E] flex flex-col">
            <div className="p-3 border-b border-[#1A2F2D] flex justify-end">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 text-[#727A78] hover:text-white rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <Sidebar
              currentView={currentView}
              onNavigate={handleNavigate}
              pendingReviewsCount={3}
              isOfflineMode={isOfflineMode}
              onTriggerSync={() =>
                showToast(
                  'HQ Cloud Sync Complete',
                  'All inspection records synchronized with Central Legal Metrology server.',
                  'success'
                )
              }
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 w-full overflow-hidden bg-[#F7F6F3] relative">
        {/* Subtle Government Watermark Background (Official Legal Metrology Emblem) */}
        <div
          aria-hidden="true"
          className="pointer-events-none select-none absolute inset-0 z-0 overflow-hidden"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] sm:w-[440px] sm:h-[440px] md:w-[540px] md:h-[540px] lg:w-[620px] lg:h-[620px] xl:w-[680px] xl:h-[680px] max-w-[80%] max-h-[75vh] hidden sm:flex items-center justify-center">
            <img
              src="/background.png"
              alt=""
              className="w-full h-full object-contain opacity-[0.05] filter grayscale-[25%] saturate-[70%] mix-blend-multiply pointer-events-none select-none"
              style={{
                transform: 'rotate(0deg)',
              }}
            />
          </div>
        </div>

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
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-transparent relative z-10">
          {currentView === 'dashboard' && (
            <DashboardView
              onNavigate={handleNavigate}
              onSelectCase={handleSelectCase}
              onShowToast={showToast}
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

      {/* Persistent Floating Action Buttons (Sticky & Accessible across every screen) */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 drop-shadow-xl">
        {/* Quick Shortcuts Help Trigger */}
        <button
          onClick={() => setIsShortcutsOpen(true)}
          className="hidden sm:flex items-center justify-center w-11 h-11 bg-[#0F1F1E] hover:bg-[#1A2E2C] text-[#C2C9C8] hover:text-[#22C2C2] rounded-full border border-[#1E3836] shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
          title="Field Keyboard Shortcuts (?)"
          aria-label="Keyboard Shortcuts"
        >
          <HelpCircle className="w-4 h-4 text-[#C2C9C8]" />
        </button>

        {/* Quick Scan Package Button */}
        {currentView !== 'scan-package' && (
          <button
            onClick={() => {
              setCurrentView('scan-package');
              showToast('Scan Package', 'Switched to capture screen.', 'info');
            }}
            className="flex items-center gap-2 px-3.5 py-2.5 min-h-[44px] bg-white hover:bg-[#F4F3EE] text-[#111413] font-semibold text-xs sm:text-sm rounded-full border border-[#E6E4DF] shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer group"
            title="Scan Package (S)"
          >
            <ScanLine className="w-4 h-4 text-[#0E8A8A] group-hover:rotate-6 transition-transform" />
            <span className="hidden sm:inline">Scan</span>
            <kbd className="hidden sm:inline text-[10px] font-mono bg-[#F4F3EE] text-[#727A78] px-1 py-0.5 rounded border border-[#E6E4DF]">
              S
            </kbd>
          </button>
        )}

        {/* Primary Action: + New Inspection (Always Pinned on every view) */}
        {currentView !== 'new-inspection' && (
          <button
            onClick={() => {
              setCurrentView('new-inspection');
              showToast('New Inspection Started', 'Switched to guided inspection workflow.', 'info');
            }}
            className="flex items-center gap-2 px-4 py-2.5 min-h-[44px] bg-[#22C2C2] hover:bg-[#1EB0B0] text-[#0F1F1E] font-bold text-xs sm:text-sm rounded-full shadow-md border border-[#1EB0B0] transition-all hover:scale-105 active:scale-95 cursor-pointer group"
            title="Start New Inspection (N)"
          >
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
            <span>+ New Inspection</span>
            <kbd className="hidden sm:inline text-[10px] font-mono bg-[#0F1F1E]/10 text-[#0F1F1E] px-1.5 py-0.5 rounded border border-[#0F1F1E]/20">
              N
            </kbd>
          </button>
        )}
      </div>

      {/* Global Interactive Toast Notification System */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Field Officer Keyboard Shortcuts Modal */}
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
}
export default App;
