import React from 'react';
import { Sparkles, History, Keyboard, Moon, Sun, Feather, SlidersHorizontal } from 'lucide-react';
import { VirastarLogo } from './VirastarLogo';

interface HeaderProps {
  darkMode: boolean;
  onToggleTheme: () => void;
  onOpenSamples: () => void;
  onOpenHistory: () => void;
  onOpenAiModal: () => void;
  onOpenShortcuts: () => void;
  onOpenSettings: () => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  onToggleTheme,
  onOpenSamples,
  onOpenHistory,
  onOpenAiModal,
  onOpenShortcuts,
  onOpenSettings,
  historyCount,
}) => {
  return (
    <header className="border-b main-border header-bg backdrop-blur-xl sticky top-0 z-40 theme-shadow shrink-0">
      <div className="max-w-[1600px] mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2">
        
        {/* Brand & Title */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 accent-light-bg border border-[var(--accent-text)]/20 rounded-lg flex items-center justify-center shadow-xs shrink-0 transition-all">
            <VirastarLogo size={24} className="accent-text" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm sm:text-base title-weight main-text tracking-tight font-bold">ویراستار فارسی</h1>
              <span className="hidden sm:flex text-[10px] font-bold px-2 h-5 badge-radius accent-light-bg accent-text border sub-border tracking-wider items-center gap-1">
                <Feather className="w-3 h-3" />
                <span>حرفه‌ای</span>
              </span>
            </div>
            <p className="text-[10px] sm:text-xs muted-text hidden xs:block line-clamp-1">
              اصلاح نیم‌فاصله‌ها، پاکسازی نشانه‌گذاری و تایپوگرافی متون فارسی
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="flex items-center justify-center gap-1.5 px-2.5 sm:px-3 h-9 btn-radius card-bg hover-bg main-text border main-border text-xs font-bold transition-all shrink-0"
            title="تنظیمات قواعد ویراستاری"
          >
            <SlidersHorizontal className="w-4 h-4 accent-text" />
            <span className="hidden sm:inline">تنظیمات</span>
          </button>

          {/* AI Assistant Button */}
          <button
            onClick={onOpenAiModal}
            className="flex items-center justify-center gap-1.5 px-2.5 sm:px-3.5 h-9 btn-radius accent-bg accent-hover-bg text-white text-xs font-bold transition-all shadow-xs shrink-0"
            title="ویرایش هوشمند AI"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span className="hidden xs:inline">هوش مصنوعی</span>
          </button>

          {/* History Drawer */}
          <button
            onClick={onOpenHistory}
            className="relative w-9 h-9 flex items-center justify-center btn-radius card-bg hover-bg main-text border main-border transition-all shrink-0"
            title="تاریخچه ویرایش‌ها"
          >
            <History className="w-4 h-4 muted-text" />
            {historyCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                {historyCount}
              </span>
            )}
          </button>

          {/* Shortcuts Modal */}
          <button
            onClick={onOpenShortcuts}
            className="hidden sm:flex w-9 h-9 items-center justify-center btn-radius card-bg hover-bg main-text border main-border transition-all shrink-0"
            title="راهنمای کلیدهای میانبر"
          >
            <Keyboard className="w-4 h-4" />
          </button>

          {/* Light / Dark Mode Toggle */}
          <button
            onClick={onToggleTheme}
            className="w-9 h-9 flex items-center justify-center btn-radius card-bg hover-bg main-text border main-border transition-all shrink-0"
            title={darkMode ? 'حالت روشن' : 'حالت تاریک'}
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-500" />}
          </button>
        </div>

      </div>
    </header>
  );
};
