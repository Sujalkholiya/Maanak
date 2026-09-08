import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../app/router/routes';
import { useToast } from './useToast';

interface KeyboardShortcutsOptions {
  isSearchOpen: boolean;
  setIsSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isShortcutsOpen: boolean;
  setIsShortcutsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function useKeyboardShortcuts({
  isSearchOpen,
  setIsSearchOpen,
  isShortcutsOpen,
  setIsShortcutsOpen,
}: KeyboardShortcutsOptions) {
  const navigate = useNavigate();
  const { showToast } = useToast();

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

      // If user is actively typing in an input or a modal is open, do not hijack single keys
      if (isInputActive || isSearchOpen || isShortcutsOpen) return;

      // N: New Inspection
      if (e.key.toLowerCase() === 'n' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        navigate(ROUTES.WORKFLOW.NEW_INSPECTION);
        showToast('New Inspection', 'Loaded guided field inspection workflow.', 'info');
      }
      // S: Scan Package
      else if (e.key.toLowerCase() === 's' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        navigate(ROUTES.WORKFLOW.SCAN_PACKAGE);
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
  }, [isSearchOpen, isShortcutsOpen, navigate, showToast, setIsSearchOpen, setIsShortcutsOpen]);
}
