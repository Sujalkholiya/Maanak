import React from 'react';
import {
  LayoutDashboard,
  PlusCircle,
  ScanLine,
  FileCheck2,
  FolderOpen,
  Eye,
  FileText,
  Building2,
  BarChart3,
  BookOpenCheck,
  History,
  Settings,
  Scale,
  Crosshair,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  MapPin,
  Lock,
  WifiOff,
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  pendingReviewsCount: number;
  isOfflineMode: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  pendingReviewsCount,
  isOfflineMode,
}) => {
  const primaryNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'new-inspection', label: 'New Inspection', icon: PlusCircle, badge: 'Guided' },
    { id: 'scan-package', label: 'Scan Package', icon: ScanLine },
    { id: 'compliance-xray', label: 'Compliance X-Ray', icon: Crosshair, highlight: true },
    { id: 'declaration-extraction', label: 'Structured OCR', icon: FileCheck2 },
    { id: 'applicability-engine', label: 'Applicability Engine', icon: Scale },
    { id: 'font-pdp-analysis', label: 'Font / PDP Analysis', icon: Sparkles },
    { id: 'product-listings', label: 'Product vs Online', icon: ShoppingBag },
    { id: 'cases', label: 'Cases', icon: FolderOpen, count: 5 },
    { id: 'human-verification', label: 'Officer Review', icon: Eye, badge: `${pendingReviewsCount} Pending`, alert: true },
    { id: 'evidence-vault', label: 'Evidence Vault', icon: Lock },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'manufacturers', label: 'Manufacturers', icon: Building2 },
    { id: 'heatmap', label: 'Geographic Heatmap', icon: MapPin },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'rule-library', label: 'Rule Library', icon: BookOpenCheck },
    { id: 'audit-trail', label: 'Audit Trail', icon: History },
    { id: 'offline-field', label: 'Offline Field Mode', icon: WifiOff, badge: isOfflineMode ? 'Active' : undefined },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#0B192C] text-slate-200 flex flex-col shrink-0 border-r border-slate-800 select-none">
      {/* Top Emblem & Branding */}
      <div className="p-4 border-b border-slate-800/80 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center text-white shadow-md shadow-blue-900/40 border border-blue-400/30 shrink-0">
          <ShieldCheck className="w-6 h-6 text-blue-100" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h1 className="font-extrabold tracking-wider text-base text-white">METROSCAN</h1>
            <span className="text-[10px] font-mono px-1.5 py-0.2 bg-blue-500/20 text-blue-300 rounded border border-blue-400/30">
              SIH26034
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium truncate uppercase tracking-tight">
            Legal Metrology Compliance
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5 text-xs font-medium">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 pt-1 pb-1">
          Inspection Workspace
        </div>
        {primaryNavItems.slice(0, 8).map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors relative ${
                isActive
                  ? 'bg-blue-600 text-white font-semibold shadow-xs shadow-blue-950'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${
                  isActive ? 'text-white' : item.highlight ? 'text-cyan-400' : 'text-slate-400'
                }`}
              />
              <span className="truncate">{item.label}</span>
              {item.badge && (
                <span
                  className={`ml-auto text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    isActive ? 'bg-blue-700 text-white' : 'bg-slate-800 text-cyan-300 border border-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 pt-3 pb-1">
          Regulatory Intelligence
        </div>
        {primaryNavItems.slice(8).map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white font-semibold shadow-xs shadow-blue-950'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${
                  isActive ? 'text-white' : item.alert ? 'text-amber-400' : 'text-slate-400'
                }`}
              />
              <span className="truncate">{item.label}</span>
              {item.badge && (
                <span
                  className={`ml-auto text-[10px] px-1.5 py-0.2 rounded font-bold ${
                    item.alert
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
              {item.count && !item.badge && (
                <span className="ml-auto text-[10px] font-mono text-slate-400 bg-slate-800/60 px-1.5 py-0.5 rounded">
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Operational Status Bar */}
      <div className="p-3 border-t border-slate-800 bg-[#07111F] text-[11px] space-y-1.5">
        <div className="flex items-center justify-between text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block shadow-xs shadow-emerald-500/50"></span>
            System Status
          </span>
          <span className="font-semibold text-emerald-400">Operational</span>
        </div>

        <div className="flex items-center justify-between text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-400 inline-block shadow-xs shadow-blue-400/50"></span>
            Rule Database
          </span>
          <span className="font-mono text-blue-300">v2026.3 (Updated)</span>
        </div>

        <div className="flex items-center justify-between text-slate-400">
          <span className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full inline-block ${
                isOfflineMode ? 'bg-amber-500 shadow-amber-500/50' : 'bg-emerald-400 shadow-emerald-400/50'
              }`}
            ></span>
            Sync Pipeline
          </span>
          <span
            className={`font-mono text-[10px] ${
              isOfflineMode ? 'text-amber-400' : 'text-emerald-400'
            }`}
          >
            {isOfflineMode ? 'Local Cache (3)' : 'Synced (HQ Cloud)'}
          </span>
        </div>
      </div>
    </aside>
  );
};

