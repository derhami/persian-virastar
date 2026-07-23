import React from 'react';
import { Keyboard, X } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Ctrl + Enter', desc: 'اجرای سریع پردازش و ویرایش متن' },
    { key: 'Ctrl + Shift + C', desc: 'کپی مستقیم متن خروجی به کلیپ‌بورد' },
    { key: 'Ctrl + Shift + D', desc: 'تغییر وضعیت نمایش تفاوت‌ها (Diff Mode)' },
    { key: 'Ctrl + Shift + S', desc: 'باز کردن پنجره انتخاب متن‌های نمونه' },
    { key: 'Ctrl + Shift + A', desc: 'باز کردن پنجره ویراستار هوشمند AI' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="sub-bg border main-border card-radius max-w-md w-full theme-shadow overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="p-4 border-b main-border flex items-center justify-between card-bg">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 muted-text" />
            <h3 className="text-sm font-bold title-weight main-text">راهنمای کلیدهای میانبر (Shortcuts)</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 btn-radius muted-text hover:text-main hover-bg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-2.5 text-xs">
          {shortcuts.map((sc, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-2.5 card-bg border main-border card-radius"
            >
              <span className="sub-text font-medium">{sc.desc}</span>
              <kbd className="px-2 py-1 badge-radius sub-bg border sub-border accent-text font-mono text-[11px] dir-ltr">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="p-3 border-t main-border card-bg flex justify-end">
          <button
            onClick={onClose}
            className="px-4 h-9 flex items-center justify-center btn-radius sub-bg sub-text hover-bg border main-border text-xs font-semibold transition-colors"
          >
            فهمیدم
          </button>
        </div>

      </div>
    </div>
  );
};
