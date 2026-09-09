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
  isOfflineMode?: boolean;
  onToggleOffline?: () => void;
  onNavigateView: (view: string) => void;
  onOpenMobileMenu?: () => void;
  onSignOut?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenSearch,
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
    <header className="w-full min-w-0 box-border h-16 sm:h-18 bg-white border-b border-[#E6E4DF] px-3 sm:px-5 lg:px-6 flex items-center justify-between gap-2.5 sm:gap-4 sticky top-0 z-30 select-none shadow-2xs">
      {/* 1. BRANDING: [ LOGO ] MAANAK [ LEGAL METROLOGY COMPLIANCE ] */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 min-w-0">
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden h-10 w-10 flex items-center justify-center rounded-xl text-[#3F4544] hover:bg-[#F7F6F3] hover:text-[#111413] border border-[#E6E4DF] shrink-0 transition-colors"
            title="Open Menu"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}

        <div
          onClick={() => onNavigateView('dashboard')}
          className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group"
          title="MAANAK · Legal Metrology Compliance Platform"
        >
          {/* Sized appropriately transparent logo emblem */}
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white flex items-center justify-center p-1 shadow-xs border border-[#E6E4DF] shrink-0 overflow-hidden">
            <img
              src="/logo.png"
              alt="Maanak Logo"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="flex items-center gap-2.5 min-w-0">
            <span className="font-black text-[#111413] tracking-wider text-base sm:text-lg leading-none shrink-0">
              MAANAK
            </span>
            <span className="hidden xl:inline-block text-[10px] font-semibold tracking-wider text-[#727A78] uppercase truncate">
              LEGAL METROLOGY COMPLIANCE
            </span>
          </div>
        </div>
      </div>

      {/* 2. GLOBAL SEARCH (Flexible Container - shrinks properly without overflowing) */}
      <div className="flex-1 min-w-0 max-w-xl mx-1 sm:mx-3">
        {/* Desktop / Tablet Search Input Button */}
        <button
          onClick={onOpenSearch}
          className="hidden sm:flex items-center gap-2.5 w-full bg-[#F7F6F3] hover:bg-[#EFECE6] border border-[#E6E4DF] hover:border-[#D5D2CA] rounded-xl px-3.5 h-10 text-xs text-[#3F4544] transition-all text-left shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#22C2C2]/30 group"
        >
          <Search className="w-4 h-4 text-[#727A78] group-hover:text-[#111413] shrink-0 transition-colors" />
          <span className="truncate flex-1 min-w-0 text-[#3F4544] font-normal">
            <span className="hidden lg:inline">
              Search Case ID, Product, Manufacturer, Evidence ID, Rule ID
            </span>
            <span className="lg:hidden">
              Search cases, products, evidence...
            </span>
          </span>
          <kbd className="hidden md:inline-flex items-center gap-0.5 text-[10px] font-mono font-medium bg-white border border-[#E6E4DF] px-1.5 py-0.5 rounded-md text-[#727A78] shrink-0 shadow-2xs group-hover:border-[#D5D2CA]">
            Ctrl K
          </kbd>
        </button>

        {/* Mobile Search Icon Button */}
        <button
          onClick={onOpenSearch}
          className="sm:hidden h-10 w-10 flex items-center justify-center rounded-xl border border-[#E6E4DF] text-[#3F4544] hover:bg-[#F7F6F3] hover:text-[#111413] transition-colors shadow-2xs shrink-0"
          title="Search"
          aria-label="Open Search"
        >
          <Search className="w-4 h-4" />
        </button>
      </div>

      {/* 3. RIGHT SIDE CONTROLS: [ 🔔 3 ] | [ VS Vikram Sharma ˅ ] */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* NOTIFICATIONS (Compact button with red count) */}
        <div className="relative shrink-0" ref={notifRef}>
          <button
            onClick={() => setShowNotifications((prev) => !prev)}
            className={`h-10 w-10 flex items-center justify-center rounded-xl border transition-colors relative shrink-0 ${
              showNotifications
                ? 'bg-[#F7F6F3] border-[#D5D2CA] text-[#111413]'
                : 'bg-white border-[#E6E4DF] text-[#3F4544] hover:bg-[#F7F6F3] hover:text-[#111413]'
            }`}
            title="Operational Notifications"
            aria-label="Operational Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#C1443A] text-white text-[10px] font-bold flex items-center justify-center shadow-xs leading-none">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Clean Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-[#E6E4DF] py-2 z-50 text-xs">
              <div className="flex items-center justify-between px-4 py-2 border-b border-[#E6E4DF]">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#111413]">
                  Operational Alerts
                </span>
                <span className="text-[11px] text-[#0E8A8A] font-semibold font-mono">
                  {unreadCount} Unread
                </span>
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-[#E6E4DF]">
                {MOCK_NOTIFICATIONS.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3 text-xs hover:bg-[#F7F6F3] transition-colors cursor-pointer ${
                      n.unread ? 'bg-[#E8F9F9]/50' : ''
                    }`}
                    onClick={() => {
                      setShowNotifications(false);
                      onNavigateView('cases');
                    }}
                  >
                    <div className="flex items-start gap-2.5">
                      {n.type === 'ALERT' && (
                        <AlertTriangle className="w-4 h-4 text-[#C1443A] shrink-0 mt-0.5" />
                      )}
                      {n.type === 'WARNING' && (
                        <AlertTriangle className="w-4 h-4 text-[#C98A2C] shrink-0 mt-0.5" />
                      )}
                      {n.type === 'INFO' && (
                        <Info className="w-4 h-4 text-[#0E8A8A] shrink-0 mt-0.5" />
                      )}
                      {n.type === 'SUCCESS' && (
                        <CheckCircle2 className="w-4 h-4 text-[#2F7D5F] shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-[#111413]">{n.title}</div>
                        <div className="text-[#3F4544] mt-0.5 leading-snug">{n.message}</div>
                        <div className="text-[10px] text-[#727A78] mt-1 font-mono">{n.time}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SUBTLE VERTICAL DIVIDER */}
        <div className="hidden sm:block h-6 w-[1px] bg-[#E6E4DF] shrink-0"></div>

        {/* USER PROFILE: [ VS Vikram Sharma ˅ ] */}
        <div className="relative shrink-0" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu((prev) => !prev)}
            className={`h-10 flex items-center gap-2 px-2 sm:px-2.5 rounded-xl transition-colors text-left group shrink-0 ${
              showProfileMenu
                ? 'bg-[#F7F6F3] border border-[#D5D2CA]'
                : 'hover:bg-[#F7F6F3] border border-transparent hover:border-[#E6E4DF]'
            }`}
            title="Officer Profile: Vikram Sharma"
            aria-label="Officer Profile"
          >
            <div className="w-8 h-8 rounded-full bg-[#0F1F1E] text-[#22C2C2] border border-[#1E3836] flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              VS
            </div>

            {/* Officer Name - Responsive */}
            <div className="hidden sm:block text-left min-w-0">
              <span className="text-xs font-semibold text-[#111413] leading-none truncate block">
                <span className="hidden lg:inline">Vikram Sharma</span>
                <span className="hidden md:inline lg:hidden">Vikram</span>
              </span>
            </div>

            <ChevronDown
              className={`w-3.5 h-3.5 text-[#727A78] group-hover:text-[#111413] transition-transform shrink-0 hidden sm:block ${
                showProfileMenu ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#E6E4DF] p-3 z-50 text-xs">
              <div className="flex items-center gap-2.5 pb-2.5 border-b border-[#E6E4DF]">
                <Shield className="w-5 h-5 text-[#0E8A8A] shrink-0" />
                <div className="min-w-0">
                  <div className="font-bold text-[#111413] truncate">Officer Vikram Sharma</div>
                  <div className="text-[#727A78] text-[11px]">Enforcement Wing, Zone-I</div>
                  <div className="text-[#0E8A8A] font-mono text-[10px]">ID: LM-DL-4029 · Dy Controller</div>
                </div>
              </div>
              <div className="py-2.5 space-y-1.5 text-[#3F4544] text-[11px]">
                <div className="flex justify-between">
                  <span>Jurisdiction:</span>
                  <span className="font-semibold text-[#111413]">New Delhi Division</span>
                </div>
                <div className="flex justify-between">
                  <span>Enforcement Role:</span>
                  <span className="font-semibold text-[#111413]">Gazetted Inspector</span>
                </div>
                <div className="flex justify-between">
                  <span>Digital Certificate:</span>
                  <span className="font-mono text-[#2F7D5F] font-semibold">VALID 2027</span>
                </div>
              </div>
              <div className="pt-2 border-t border-[#E6E4DF] flex gap-2">
                {onSignOut && (
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onSignOut();
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-[#FBF0EF] hover:bg-[#F7DCDA] text-[#C1443A] font-semibold border border-[#F4D6D4] transition-colors text-xs"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                )}
                <button
                  onClick={() => setShowProfileMenu(false)}
                  className="flex-1 text-center py-1.5 rounded-lg bg-[#F7F6F3] hover:bg-[#EFECE6] text-[#3F4544] font-semibold transition-colors text-xs border border-[#E6E4DF]"
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
