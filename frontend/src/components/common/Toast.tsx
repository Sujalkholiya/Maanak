import React, { useEffect, useState } from 'react';
import { CheckCircle2, AlertTriangle, Info, X, Undo2 } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  description?: string;
  undoAction?: () => void;
  duration?: number;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  const [progress, setProgress] = useState(100);
  const duration = toast.duration || 4500;

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      if (elapsed >= duration) {
        clearInterval(interval);
        onDismiss(toast.id);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [toast.id, duration, onDismiss]);

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-[#2F7D5F] shrink-0 mt-0.5" />,
    warning: <AlertTriangle className="w-4 h-4 text-[#C98A2C] shrink-0 mt-0.5" />,
    info: <Info className="w-4 h-4 text-[#0E8A8A] shrink-0 mt-0.5" />,
    error: <AlertTriangle className="w-4 h-4 text-[#C1443A] shrink-0 mt-0.5" />,
  };

  const borders = {
    success: 'border-[#D4E8DF] bg-white',
    warning: 'border-[#F5E5C9] bg-white',
    info: 'border-[#22C2C2]/40 bg-white',
    error: 'border-[#F4D6D4] bg-white',
  };

  return (
    <div
      className={`pointer-events-auto w-full rounded-xl border p-3.5 shadow-lg flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200 ${borders[toast.type]}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5 min-w-0">
          {icons[toast.type]}
          <div className="min-w-0">
            <div className="text-xs font-bold text-[#111413]">{toast.title}</div>
            {toast.description && (
              <div className="text-[11px] text-[#3F4544] mt-0.5 leading-snug">{toast.description}</div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {toast.undoAction && (
            <button
              onClick={() => {
                toast.undoAction?.();
                onDismiss(toast.id);
              }}
              className="inline-flex items-center gap-1 text-[10px] font-bold text-[#0E8A8A] hover:text-[#0b6d6d] bg-[#EDF5F1] hover:bg-[#D4E8DF] px-2 py-1 rounded-md transition-colors"
            >
              <Undo2 className="w-3 h-3" />
              Undo
            </button>
          )}
          <button
            onClick={() => onDismiss(toast.id)}
            className="p-1 text-[#727A78] hover:text-[#111413] rounded transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Progress Bar Indicator */}
      <div className="h-0.5 w-full bg-[#F4F3EE] mt-2.5 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-75 ${
            toast.type === 'success'
              ? 'bg-[#2F7D5F]'
              : toast.type === 'warning'
              ? 'bg-[#C98A2C]'
              : toast.type === 'error'
              ? 'bg-[#C1443A]'
              : 'bg-[#22C2C2]'
          }`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

