import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  PlusCircle,
  ScanLine,
  Crosshair,
  FolderOpen,
  Eye,
  FileCheck2,
  Scale,
  Sparkles,
  ShoppingBag,
  FileText,
  Lock,
  Building2,
  MapPin,
  BarChart3,
  BookOpenCheck,
  History,
  WifiOff,
  Settings,
  ChevronDown,
  ChevronRight,
  Sliders,
  ShieldAlert,
  RefreshCw,
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  pendingReviewsCount: number;
  isOfflineMode: boolean;
  onTriggerSync?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  pendingReviewsCount,
  isOfflineMode,
  onTriggerSync,
}) => {
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
  // Tier 1 — Primary (always visible, front and center)
  const tier1Actions = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'new-inspection', label: 'New Inspection', icon: PlusCircle, badge: 'Guided', isAction: true },
    { id: 'scan-package', label: 'Scan Package', icon: ScanLine },
    { id: 'compliance-xray', label: 'Compliance X-Ray', icon: Crosshair, highlight: true },
    { id: 'cases', label: 'Case Management', icon: FolderOpen, count: 5 },
  ];

  // Tier 2 — Secondary: Inspection Tools (one click away, collapsible)
  const tier2Tools = [
    { id: 'declaration-extraction', label: 'Declaration Workspace', icon: FileCheck2 },
    { id: 'applicability-engine', label: 'Applicability Engine', icon: Scale },
    { id: 'font-pdp-analysis', label: 'Font & PDP Analysis', icon: Sparkles },
    { id: 'product-listings', label: 'E-commerce Comparison', icon: ShoppingBag },
    {
      id: 'human-verification',
      label: 'Officer Review',
      icon: Eye,
      badge: `${pendingReviewsCount} Pending`,
      alert: true,
    },
  ];

  // Tier 3 — Governance & Records (collapsible)
  const tier3Governance = [
    { id: 'reports', label: 'Inspection Reports', icon: FileText },
    { id: 'evidence-vault', label: 'Evidence Vault', icon: Lock },
    { id: 'manufacturers', label: 'Manufacturer Intelligence', icon: Building2 },
    { id: 'heatmap', label: 'Geographic Heatmap', icon: MapPin },
    { id: 'analytics', label: 'Compliance Analytics', icon: BarChart3 },
    { id: 'audit-trail', label: 'Audit Trail', icon: History },
    { id: 'rule-library', label: 'Rule Library', icon: BookOpenCheck },
    { id: 'offline-field', label: 'Offline Field Mode', icon: WifiOff, badge: isOfflineMode ? 'Active' : undefined },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // Collapsible section states (collapsed by default unless currentView matches)
  const isTier2Active = tier2Tools.some((t) => t.id === currentView);
  const isTier3Active = tier3Governance.some((g) => g.id === currentView);

  const [isToolsExpanded, setIsToolsExpanded] = useState<boolean>(isTier2Active);
  const [isGovernanceExpanded, setIsGovernanceExpanded] = useState<boolean>(isTier3Active);

  // Auto-expand section if user navigates to an item within it
  useEffect(() => {
    if (isTier2Active) setIsToolsExpanded(true);
    if (isTier3Active) setIsGovernanceExpanded(true);
  }, [currentView, isTier2Active, isTier3Active]);

  return (
    <aside className="w-64 bg-[#0F1F1E] text-[#C2C9C8] flex flex-col shrink-0 border-r border-[#1E3836] select-none">
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
        {/* ============================================================ */}
        {/* TIER 1 — PRIMARY (Always Visible, Front and Center) */}
        {/* ============================================================ */}
        <div className="space-y-1">
          <div className="text-[9px] font-bold text-[#728A87] uppercase tracking-wider px-3 pb-1">
            Core Workflows
          </div>
          {tier1Actions.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all text-xs ${
                  isActive
                    ? 'bg-[#22C2C2] text-[#0F1F1E] font-bold shadow-xs'
                    : item.isAction
                    ? 'text-white bg-[#1A2E2C] hover:bg-[#233D3A] font-semibold'
                    : 'text-[#C2C9C8] hover:bg-[#1A2E2C] hover:text-white font-medium'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-[#0F1F1E]' : item.highlight ? 'text-[#22C2C2]' : 'text-[#8EA3A0]'
                  }`}
                />
                <span className="truncate">{item.label}</span>
                {item.badge && (
                  <span
                    className={`ml-auto text-[9px] font-mono px-1.5 py-0.5 rounded ${
                      isActive
                        ? 'bg-[#18A0A0] text-[#0F1F1E] font-bold'
                        : 'bg-[#182A29] text-[#22C2C2] border border-[#22C2C2]/30'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {item.count && !item.badge && (
                  <span
                    className={`ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      isActive ? 'bg-[#18A0A0] text-[#0F1F1E]' : 'bg-[#182A29] text-[#8EA3A0]'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ============================================================ */}
        {/* TIER 2 — SECONDARY: INSPECTION TOOLS (Collapsible Accordion) */}
        {/* ============================================================ */}
        <div className="space-y-1">
          <button
            onClick={() => setIsToolsExpanded(!isToolsExpanded)}
            className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#728A87] hover:text-[#C2C9C8] transition-colors rounded-lg hover:bg-[#1A2E2C]/50 group"
          >
            <span className="flex items-center gap-1.5">
              <Sliders className="w-3 h-3 text-[#728A87] group-hover:text-[#22C2C2]" />
              <span>Inspection Tools</span>
            </span>
            <div className="flex items-center gap-1.5">
              {pendingReviewsCount > 0 && !isToolsExpanded && (
                <span className="w-2 h-2 rounded-full bg-[#D9A441]"></span>
              )}
              {isToolsExpanded ? (
                <ChevronDown className="w-3.5 h-3.5 text-[#8EA3A0]" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-[#728A87]" />
              )}
            </div>
          </button>

          {isToolsExpanded && (
            <div className="space-y-0.5 pl-1 pt-0.5">
              {tier2Tools.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-left transition-all text-xs ${
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
                            : item.alert
                            ? 'bg-[#2E2413] text-[#D9A441] border border-[#D9A441]/30'
                            : 'bg-[#182A29] text-[#8EA3A0]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ============================================================ */}
        {/* TIER 3 — GOVERNANCE & RECORDS (Collapsible Accordion) */}
        {/* ============================================================ */}
        <div className="space-y-1">
          <button
            onClick={() => setIsGovernanceExpanded(!isGovernanceExpanded)}
            className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#728A87] hover:text-[#C2C9C8] transition-colors rounded-lg hover:bg-[#1A2E2C]/50 group"
          >
            <span className="flex items-center gap-1.5">
              <ShieldAlert className="w-3 h-3 text-[#728A87] group-hover:text-[#22C2C2]" />
              <span>Governance & Records</span>
            </span>
            <div className="flex items-center gap-1.5">
              {!isGovernanceExpanded && (
                <span className="text-[9px] font-mono text-[#728A87] bg-[#182A29] px-1 rounded">
                  {tier3Governance.length}
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
              {tier3Governance.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-left transition-all text-xs ${
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
