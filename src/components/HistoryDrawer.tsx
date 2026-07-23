import React from 'react';
import { History, Trash2, X, RotateCcw, Clock, ArrowLeft } from 'lucide-react';
import { HistoryItem } from '../types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onRestore: (item: HistoryItem) => void;
  onClearHistory: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onRestore,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="sub-bg border-r main-border max-w-md w-full h-full theme-shadow flex flex-col animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="p-4 border-b main-border flex items-center justify-between card-bg">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 muted-text" />
            <h3 className="text-sm font-bold title-weight main-text">تاریخچه ویرایش‌های اخیر</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 btn-radius muted-text hover:text-main hover-bg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* History List */}
        <div className="p-4 space-y-3 overflow-y-auto flex-1 text-xs">
          {history.length === 0 ? (
            <div className="text-center py-12 muted-text space-y-2">
              <Clock className="w-8 h-8 mx-auto opacity-40 muted-text" />
              <p>تاریخچه‌ای ثبت نشده است.</p>
              <p className="text-[11px]">با ویرایش متن‌ها، ۱۰ ویرایش اخیر شما اینجا ذخیره می‌شود.</p>
            </div>
          ) : (
            history.map((item) => {
              const dateStr = new Date(item.timestamp).toLocaleTimeString('fa-IR', {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={item.id}
                  className="p-3.5 card-bg border main-border card-radius space-y-2 hover-bg transition-all"
                >
                  <div className="flex items-center justify-between gap-2 text-[11px] muted-text">
                    <span className="font-semibold main-text">{item.title}</span>
                    <span className="dir-ltr">{dateStr}</span>
                  </div>

                  <p className="sub-text line-clamp-2 leading-relaxed text-[11px] font-sans">
                    {item.outputText || item.inputText}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t sub-border text-[10px] muted-text">
                    <span>{item.stats.words} کلمه • {item.stats.chars} کاراکتر</span>
                    <button
                      onClick={() => {
                        onRestore(item);
                        onClose();
                      }}
                      className="h-7 flex items-center justify-center gap-1 px-2.5 btn-radius accent-light-bg main-text font-semibold transition-colors"
                    >
                      <RotateCcw className="w-3 h-3 muted-text" />
                      <span>بازگردانی</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="p-3 border-t main-border card-bg flex justify-between items-center text-xs">
            <button
              onClick={onClearHistory}
              className="h-9 flex items-center justify-center gap-1.5 px-3 btn-radius bg-rose-500/10 text-rose-700 dark:text-rose-300 hover:bg-rose-500/20 transition-all font-semibold"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>پاکسازی تاریخچه</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 h-9 flex items-center justify-center btn-radius sub-bg sub-text hover-bg border main-border transition-all font-semibold"
            >
              بستن
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
