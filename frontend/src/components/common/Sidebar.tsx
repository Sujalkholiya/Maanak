import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  PlusCircle,
  ShieldAlert,
  Building2,
  MapPin,
  BarChart3,
  BookOpenCheck,
  History,
  WifiOff,
  Settings,
  ChevronDown,
  ChevronRight,
  RefreshCw,
  Check,
  LayoutDashboard,
  FolderOpen,
} from 'lucide-react';
import { ROUTES } from '../../app/router/routes';
import { WORKFLOW_PHASES, getWorkflowIndex } from '../../app/router/workflow';

interface SidebarProps {
  pendingReviewsCount?: number;
  isOfflineMode?: boolean;
  onTriggerSync?: () => void;
  onCloseMobileDrawer?: () => void;
  onNavigate?: (route: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOfflineMode = false,
  onTriggerSync,
  onCloseMobileDrawer,
  onNavigate,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState('just now');

  const handleSyncClick = () => {
    if (isSyncing) return;
    setIsSyncing(true);
    if (onTriggerSync) {
      onTriggerSync();
    }
    setTimeout(() => {
      setIsSyncing(false);
      setLastSynced('just now');
    }, 1200);
  };

  const handleNavigation = (route: string) => {
    if (onNavigate) {
      onNavigate(route);
    } else {
      navigate(route);
    }
    if (onCloseMobileDrawer) {
      onCloseMobileDrawer();
    }
  };

  // Determine current workflow stage index (-1 if outside workflow)
  const currentWorkflowIndex = getWorkflowIndex(currentPath);

  // Governance & Records (Clickable navigation)
  const governanceItems = [
    { id: 'cases', label: 'Case Management', icon: FolderOpen, route: ROUTES.CASES, count: 5 },
    { id: 'manufacturers', label: 'Manufacturer Intelligence', icon: Building2, route: ROUTES.GOVERNANCE.MANUFACTURERS },
    { id: 'heatmap', label: 'Geographic Heatmap', icon: MapPin, route: ROUTES.GOVERNANCE.HEATMAP },
    { id: 'analytics', label: 'Compliance Analytics', icon: BarChart3, route: ROUTES.GOVERNANCE.ANALYTICS },
    { id: 'audit-trail', label: 'Audit Trail', icon: History, route: ROUTES.GOVERNANCE.AUDIT },
    { id: 'rule-library', label: 'Rule Library', icon: BookOpenCheck, route: ROUTES.GOVERNANCE.RULE_LIBRARY },
    { id: 'offline-field', label: 'Offline Field Mode', icon: WifiOff, route: ROUTES.GOVERNANCE.OFFLINE, badge: isOfflineMode ? 'Active' : undefined },
    { id: 'settings', label: 'Settings', icon: Settings, route: ROUTES.GOVERNANCE.SETTINGS },
  ];

  const isGovernanceActive = governanceItems.some((g) => currentPath.startsWith(g.route));
  const [isGovernanceExpanded, setIsGovernanceExpanded] = useState<boolean>(true);

  useEffect(() => {
    if (isGovernanceActive) setIsGovernanceExpanded(true);
  }, [currentPath, isGovernanceActive]);

  const isDashboardActive = currentPath === ROUTES.HOME || currentPath === ROUTES.DASHBOARD;

  return (
    <aside
      aria-label="Sidebar Navigation"
      className="w-64 bg-[#0F1F1E] text-[#C2C9C8] flex flex-col shrink-0 border-r border-[#1E3836] select-none h-full"
    >
      {/* Brand Header */}
      <div className="p-4 border-b border-[#1A2F2D] flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0F1F1E] to-[#1E4D48] flex items-center justify-center p-2 shadow-md shadow-[#0F1F1E]/80 border border-[#22C2C2]/30 shrink-0 overflow-hidden">
          <img
            src="/sunburst.png"
            alt="Maanak Symbol"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="min-w-0">
          <h1 className="font-extrabold tracking-wider text-base text-white leading-none">
            MAANAK
          </h1>
          <p className="text-[10px] text-[#8EA3A0] font-medium truncate uppercase tracking-tight mt-1">
            Legal Metrology Compliance
          </p>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4 text-xs font-medium">
        {/* Dashboard Button (Clickable) */}
        <button
          onClick={() => handleNavigation(ROUTES.DASHBOARD)}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs transition-all cursor-pointer ${
            isDashboardActive
              ? 'bg-[#22C2C2] text-[#0F1F1E] font-bold shadow-xs'
              : 'text-[#C2C9C8] hover:bg-[#1A2E2C] hover:text-white font-medium'
          }`}
          aria-current={isDashboardActive ? 'page' : undefined}
        >
          <LayoutDashboard
            className={`w-4 h-4 shrink-0 ${
              isDashboardActive ? 'text-[#0F1F1E]' : 'text-[#8EA3A0]'
            }`}
          />
          <span className="truncate">Executive Dashboard</span>
          {isDashboardActive && (
            <span className="ml-auto text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#18A0A0] text-[#0F1F1E] font-bold">
              Active
            </span>
          )}
        </button>

        {/* ============================================================ */}
        {/* WORKFLOW PIPELINE (READ-ONLY PROGRESS PANEL) */}
        {/* ============================================================ */}
        <div className="space-y-1">
          <div className="flex items-center justify-between px-3 pb-1">
            <span className="text-[9px] font-bold text-[#728A87] uppercase tracking-wider">
              Workflow Pipeline
            </span>
            <span className="text-[9px] font-mono text-[#0E8A8A] bg-[#122B29] px-1.5 py-0.5 rounded border border-[#1E4D48]">
              Read-Only
            </span>
          </div>

          <div className="relative pl-1">
            {/* Connecting Vertical Progress Line */}
            <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-[#1A2F2D] z-0" />

            <div className="space-y-1 relative z-10">
              {WORKFLOW_PHASES.map((phase, idx) => {
                const isCurrent = currentWorkflowIndex === idx;
                const isCompleted = currentWorkflowIndex > idx;
                const Icon = phase.icon || PlusCircle;

                return (
                  <div
                    key={phase.id}
                    aria-current={isCurrent ? 'step' : undefined}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left text-xs transition-all pointer-events-none cursor-default select-none ${
                      isCurrent
                        ? 'bg-[#22C2C2] text-[#0F1F1E] font-bold shadow-xs ring-1 ring-[#22C2C2]'
                        : isCompleted
                        ? 'text-white bg-[#142624] font-medium'
                        : 'text-[#8EA3A0] font-normal opacity-85'
                    }`}
                  >
                    {/* Step Number or Completed Check Indicator */}
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-all ${
                        isCurrent
                          ? 'bg-[#0F1F1E] text-[#22C2C2] ring-2 ring-[#0F1F1E]'
                          : isCompleted
                          ? 'bg-[#2F7D5F] text-white'
                          : 'bg-[#182A29] text-[#728A87] border border-[#1E3836]'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-3 h-3 stroke-[3]" />
                      ) : (
                        phase.stepNumber
                      )}
                    </div>

                    <Icon
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isCurrent
                          ? 'text-[#0F1F1E]'
                          : isCompleted
                          ? 'text-[#2F7D5F]'
                          : 'text-[#728A87]'
                      }`}
                    />

                    <span className="truncate">{phase.label}</span>

                    {isCurrent && (
                      <span className="ml-auto text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#0F1F1E] text-[#22C2C2] font-bold">
                        Step {phase.stepNumber}
                      </span>
                    )}

                    {isCompleted && (
                      <span className="ml-auto text-[9px] font-mono text-[#2F7D5F]">
                        Done
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* GOVERNANCE & RECORDS (Clickable Navigation Accordion) */}
        {/* ============================================================ */}
        <div className="space-y-1 pt-1">
          <button
            type="button"
            onClick={() => setIsGovernanceExpanded(!isGovernanceExpanded)}
            className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#728A87] hover:text-[#C2C9C8] transition-colors rounded-lg hover:bg-[#1A2E2C]/50 group cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <ShieldAlert className="w-3 h-3 text-[#728A87] group-hover:text-[#22C2C2]" />
              <span>Governance & Records</span>
            </span>
            <div className="flex items-center gap-1.5">
              {!isGovernanceExpanded && (
                <span className="text-[9px] font-mono text-[#728A87] bg-[#182A29] px-1 rounded">
                  {governanceItems.length}
                </span>
              )}
              {isGovernanceExpanded ? (
                <ChevronDown className="w-3.5 h-3.5 text-[#8EA3A0]" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-[#728A87]" />
              )}
            </div>
          </button>

          {isGovernanceExpanded && (
            <div className="space-y-0.5 pl-1 pt-0.5">
              {governanceItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath.startsWith(item.route);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.route)}
                    className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-left text-xs transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#22C2C2] text-[#0F1F1E] font-bold shadow-xs'
                        : 'text-[#C2C9C8] hover:bg-[#1A2E2C] hover:text-white font-medium'
                    }`}
                  >
                    <Icon
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isActive ? 'text-[#0F1F1E]' : 'text-[#728A87]'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`ml-auto text-[9px] font-mono px-1.5 py-0.5 rounded ${
                          isActive
                            ? 'bg-[#18A0A0] text-[#0F1F1E] font-bold'
                            : 'bg-[#182A29] text-[#2F7D5F] border border-[#2F7D5F]/30'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {item.count && !item.badge && (
                      <span
                        className={`ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded ${
                          isActive
                            ? 'bg-[#18A0A0] text-[#0F1F1E]'
                            : 'bg-[#182A29] text-[#8EA3A0]'
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </nav>

      {/* Operational Mode Interactive Footer */}
      <div className="p-3 border-t border-[#1A2F2D] bg-[#091413] text-[#728A87] flex items-center justify-between">
        <button
          onClick={handleSyncClick}
          disabled={isSyncing}
          className="flex items-center gap-2 hover:text-white transition-all group text-left cursor-pointer rounded-lg p-1 -m-1 hover:bg-[#1A2E2C]"
          title="Click to manually sync local inspections with HQ Cloud Server"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isOfflineMode ? 'bg-[#D9A441]' : 'bg-[#22C2C2]'
              }`}
            ></span>
            <span
              className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                isOfflineMode ? 'bg-[#D9A441]' : 'bg-[#22C2C2]'
              }`}
            ></span>
          </span>
          <div className="flex flex-col">
            <span className="text-[11px] text-[#C2C9C8] font-semibold flex items-center gap-1.5 group-hover:text-[#22C2C2] transition-colors">
              {isOfflineMode ? 'Offline Local Store' : 'HQ Cloud Sync'}
              <RefreshCw
                className={`w-3 h-3 text-[#728A87] group-hover:text-[#22C2C2] transition-transform ${
                  isSyncing ? 'animate-spin text-[#22C2C2]' : ''
                }`}
              />
            </span>
            <span className="text-[9px] text-[#728A87] font-mono">
              {isSyncing ? 'Syncing data now...' : `Synced ${lastSynced}`}
            </span>
          </div>
        </button>
        <span className="font-mono text-[9px] text-[#8EA3A0] bg-[#12211F] px-1.5 py-0.5 rounded border border-[#1E3836]">
          v2026.3
        </span>
      </div>
    </aside>
  );
};
