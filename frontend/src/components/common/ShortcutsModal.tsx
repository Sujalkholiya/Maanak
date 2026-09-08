import React from 'react';
import { X, Keyboard, Command, PlusCircle, ScanLine, Search, HelpCircle, Check, Flag } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'N', label: 'Start New Inspection', category: 'Field Navigation', icon: PlusCircle },
    { key: 'S', label: 'Scan Package / Capture', category: 'Field Navigation', icon: ScanLine },
    { key: 'Ctrl + K', label: 'Universal Search & Quick Commands', category: 'Global Actions', icon: Search },
    { key: '?', label: 'Open Keyboard Shortcuts', category: 'Global Actions', icon: HelpCircle },
    { key: 'Esc', label: 'Close Modals / Cancel Overlays', category: 'Global Actions', icon: X },
    { key: 'A', label: 'Quick Approve in Queue', category: 'Case Triage', icon: Check },
    { key: 'F', label: 'Flag Violation in Queue', category: 'Case Triage', icon: Flag },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-[#0F1F1E]/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      ></div>

      <div className="relative bg-white rounded-2xl shadow-2xl border border-[#E6E4DF] max-w-lg w-full overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 sm:p-5 border-b border-[#E6E4DF] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#EDF5F1] text-[#0E8A8A] flex items-center justify-center border border-[#D4E8DF]">
              <Keyboard className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[#111413]">
                Field Officer Hotkeys & Shortcuts
              </h2>
              <p className="text-[11px] text-[#727A78]">
                High-speed keyboard navigation designed for hands-on inspection tasks
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#727A78] hover:text-[#111413] rounded-lg hover:bg-[#F4F3EE] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 sm:p-5 space-y-3 max-h-96 overflow-y-auto divide-y divide-[#E6E4DF]">
          {shortcuts.map((sc, i) => {
            const Icon = sc.icon;
            return (
              <div key={i} className="pt-2.5 first:pt-0 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <Icon className="w-3.5 h-3.5 text-[#727A78]" />
                  <div>
                    <span className="font-semibold text-[#111413]">{sc.label}</span>
                    <span className="block text-[10px] text-[#727A78]">{sc.category}</span>
                  </div>
                </div>
                <kbd className="font-mono text-xs font-bold text-[#111413] bg-[#F4F3EE] border border-[#E6E4DF] px-2 py-1 rounded-md shadow-2xs">
                  {sc.key}
                </kbd>
              </div>
            );
          })}
        </div>

        <div className="p-3.5 bg-[#F4F3EE] border-t border-[#E6E4DF] text-[11px] text-[#727A78] flex items-center justify-between">
          <span>Shortcuts are active when not typing inside text fields</span>
          <button
            onClick={onClose}
            className="font-semibold text-[#0E8A8A] hover:underline"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

