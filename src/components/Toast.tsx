import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 max-w-md w-full px-4 animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div
        className={`flex items-center justify-between gap-3 p-3 px-4 card-radius theme-shadow border backdrop-blur-md card-bg ${
          toast.type === 'success'
            ? 'border-emerald-600/40 text-emerald-800 dark:text-emerald-300'
            : toast.type === 'error'
            ? 'border-rose-600/40 text-rose-800 dark:text-rose-300'
            : 'main-border main-text'
        }`}
      >
        <div className="flex items-center gap-2.5 text-sm font-medium">
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />}
          {toast.type === 'info' && <Info className="w-5 h-5 muted-text shrink-0" />}
          <span>{toast.message}</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover-bg btn-radius transition-colors muted-text hover:text-main"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
