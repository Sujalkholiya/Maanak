import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  ChevronDown,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Info,
  Menu,
  LogOut,
} from 'lucide-react';
import { MOCK_NOTIFICATIONS } from '../../data/mockData';

interface TopBarProps {
  onOpenSearch: () => void;
  isOfflineMode: boolean;
  onToggleOffline: () => void;
  onNavigateView: (view: string) => void;
  onOpenMobileMenu?: () => void;
  onSignOut?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenSearch,
  isOfflineMode,
  onToggleOffline,
  onNavigateView,
  onOpenMobileMenu,
  onSignOut,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => n.unread).length;

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click or Escape key
  useEffect(() => {
    const handlePointerDown = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowNotifications(false);
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <header className="h-16 bg-white border-b border-slate-200/90 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 select-none shadow-2xs">
      {/* 1. GLOBAL SEARCH — PRIMARY (40–45% of available width) */}
      <div className="flex items-center gap-3 w-full max-w-md lg:max-w-xl lg:w-[44%]">
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden h-10 w-10 flex items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 shrink-0 transition-colors"
            title="Open Menu"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={onOpenSearch}
          className="group flex items-center gap-2.5 w-full bg-slate-50 hover:bg-slate-100/90 border border-slate-200/90 hover:border-slate-300 rounded-xl px-3.5 h-10 text-xs text-slate-500 transition-all text-left shadow-2xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <Search className="w-4 h-4 text-slate-400 group-hover:text-slate-600 shrink-0 transition-colors" />
          <span className="truncate flex-1 text-slate-500 font-normal">
            Search Case ID, Product, Manufacturer, Evidence ID, Rule ID
          </span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[10px] font-mono font-medium bg-white border border-slate-200 px-1.5 py-0.5 rounded-md text-slate-400 shrink-0 shadow-2xs group-hover:border-slate-300">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* RIGHT SIDE: [ Connected ] [ Demo Mode ] [ 🔔3 ] | [ VS Vikram Sharma ⌄ ] */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0 ml-4">
        {/* 2. CONNECTION STATUS (Compact inline status, small green dot, no popups) */}
        <button
          onClick={onToggleOffline}
          className={`h-10 px-3 flex items-center gap-2.5 rounded-xl border transition-all text-left ${
            isOfflineMode
              ? 'bg-amber-50/90 border-amber-300 hover:bg-amber-100/80'
              : 'bg-slate-50/80 border-slate-200 hover:bg-slate-100/80'
          }`}
          title={isOfflineMode ? 'Offline mode active. Click to connect.' : 'Connected to HQ Cloud. Click to simulate offline.'}
        >
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${
              isOfflineMode ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
          ></span>
          <div className="hidden sm:flex flex-col justify-center">
            <span
              className={`text-xs font-bold leading-none ${
                isOfflineMode ? 'text-amber-900' : 'text-slate-800'
              }`}
            >
              {isOfflineMode ? 'Offline' : 'Connected'}
            </span>
            <span
              className={`text-[10px] font-mono leading-none mt-1 ${
                isOfflineMode ? 'text-amber-700' : 'text-slate-500'
              }`}
            >
              {isOfflineMode ? '3 Local' : 'HQ Live'}
            </span>
          </div>
        </button>

        {/* 3. DEMO MODE (Compact subtle professional badge) */}
        <div className="hidden md:flex h-10 px-3 items-center justify-center rounded-xl border border-blue-200/80 bg-blue-50/60 text-[11px] font-mono font-bold tracking-wider text-blue-800 uppercase shrink-0">
          DEMO MODE
        </div>

        {/* 4. NOTIFICATIONS (Compact rounded button with red count) */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications((prev) => !prev)}
            className={`h-10 w-10 flex items-center justify-center rounded-xl border transition-colors relative ${
              showNotifications
                ? 'bg-slate-100 border-slate-300 text-slate-900'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
            title="Operational Notifications"
            aria-label="Operational Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center shadow-xs leading-none">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Clean Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 text-xs">
              <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                  Operational Alerts
                </span>
                <span className="text-[11px] text-blue-600 font-semibold font-mono">
                  {unreadCount} Unread
                </span>
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {MOCK_NOTIFICATIONS.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3 text-xs hover:bg-slate-50 transition-colors cursor-pointer ${
                      n.unread ? 'bg-blue-50/40' : ''
                    }`}
                    onClick={() => {
                      setShowNotifications(false);
                      onNavigateView('cases');
                    }}
                  >
                    <div className="flex items-start gap-2.5">
                      {n.type === 'ALERT' && (
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      )}
                      {n.type === 'WARNING' && (
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      )}
                      {n.type === 'INFO' && (
                        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      )}
                      {n.type === 'SUCCESS' && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-800">{n.title}</div>
                        <div className="text-slate-600 mt-0.5 leading-snug">{n.message}</div>
                        <div className="text-[10px] text-slate-400 mt-1 font-mono">{n.time}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SUBTLE VERTICAL DIVIDER */}
        <div className="h-6 w-[1px] bg-slate-200 shrink-0"></div>

        {/* 5. USER PROFILE (Compact, perfectly aligned) */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu((prev) => !prev)}
            className={`h-10 flex items-center gap-2.5 px-2 rounded-xl transition-colors text-left group ${
              showProfileMenu
                ? 'bg-slate-100 border border-slate-300'
                : 'hover:bg-slate-50 border border-transparent hover:border-slate-200'
            }`}
            title="Officer Profile"
            aria-label="Officer Profile"
          >
            <div className="w-8 h-8 rounded-full bg-[#0B192C] text-white flex items-center justify-center font-bold text-xs border border-slate-700 shrink-0 shadow-xs">
              VS
            </div>
            <div className="hidden sm:flex flex-col justify-center">
              <div className="text-xs font-bold text-slate-900 leading-tight">
                Vikram Sharma
              </div>
              <div className="text-[10px] font-mono text-slate-500 leading-tight mt-0.5">
                LM-DL-4029 · Dy Controller
              </div>
            </div>
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform ${
                showProfileMenu ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 text-xs">
              <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-100">
                <Shield className="w-5 h-5 text-blue-700 shrink-0" />
                <div className="min-w-0">
                  <div className="font-bold text-slate-900 truncate">Officer Vikram Sharma</div>
                  <div className="text-slate-500 text-[11px]">Enforcement Wing, Zone-I</div>
                  <div className="text-blue-700 font-mono text-[10px]">ID: LM-DL-4029</div>
                </div>
              </div>
              <div className="py-2.5 space-y-1.5 text-slate-600 text-[11px]">
                <div className="flex justify-between">
                  <span>Jurisdiction:</span>
                  <span className="font-semibold text-slate-800">New Delhi Division</span>
                </div>
                <div className="flex justify-between">
                  <span>Enforcement Role:</span>
                  <span className="font-semibold text-slate-800">Gazetted Inspector</span>
                </div>
                <div className="flex justify-between">
                  <span>Digital Certificate:</span>
                  <span className="font-mono text-emerald-600 font-semibold">VALID 2027</span>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-100 flex gap-2">
                {onSignOut && (
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onSignOut();
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-700 font-semibold border border-slate-200 transition-colors text-xs"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                )}
                <button
                  onClick={() => setShowProfileMenu(false)}
                  className="flex-1 text-center py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
