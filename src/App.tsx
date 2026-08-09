import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { VirastarEditor } from './components/VirastarEditor';
import { OptionsPanel } from './components/OptionsPanel';
import { SampleTextModal } from './components/SampleTextModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import { ShortcutsModal } from './components/ShortcutsModal';
import { ShareModal } from './components/ShareModal';
import { Toast, ToastMessage } from './components/Toast';
import { Lock, Unlock, KeyRound, AlertCircle } from 'lucide-react';
import {
  getDefaultOptions,
  getPresetOptions,
  processPersianText,
  computeTextStats,
  computeDiff,
} from './lib/virastarEngine';
import { VirastarOptions, PresetMode, HistoryItem, SampleText } from './types';
import { SAMPLE_TEXTS } from './data/sampleTexts';

const STORAGE_OPTIONS_KEY = 'virastar_options_v2';
const STORAGE_PERSIST_KEY = 'virastar_persist_v2';
const STORAGE_HISTORY_KEY = 'virastar_history_v2';
const STORAGE_THEME_KEY = 'virastar_theme_v2';

export default function App() {
  // Light / Dark Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_THEME_KEY);
    return saved !== null ? JSON.parse(saved) : false;
  });

  // Settings state
  const [persistSettings, setPersistSettings] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_PERSIST_KEY);
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [activePreset, setActivePreset] = useState<PresetMode>('default');

  const [options, setOptions] = useState<VirastarOptions>(() => {
    if (persistSettings) {
      const saved = localStorage.getItem(STORAGE_OPTIONS_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse saved options', e);
        }
      }
    }
    return getDefaultOptions();
  });

  // Editor states
  const [inputText, setInputText] = useState<string>(SAMPLE_TEXTS[0].content);
  const [outputText, setOutputText] = useState<string>('');
  const [liveProcessing, setLiveProcessing] = useState<boolean>(true);
  const [showDiff, setShowDiff] = useState<boolean>(false);

  // History state
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_HISTORY_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }
    return [];
  });

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isSampleOpen, setIsSampleOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);

  // Shared Link password prompt modal
  const [sharePromptPayload, setSharePromptPayload] = useState<any | null>(null);
  const [inputPassword, setInputPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  // Toast
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToastMsg = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({
      id: Date.now().toString(),
      type,
      message,
    });
  }, []);

  // Sync options to local storage
  useEffect(() => {
    if (persistSettings) {
      localStorage.setItem(STORAGE_OPTIONS_KEY, JSON.stringify(options));
    }
    localStorage.setItem(STORAGE_PERSIST_KEY, JSON.stringify(persistSettings));
  }, [options, persistSettings]);

  // Sync history to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  // Sync dark mode class
  useEffect(() => {
    localStorage.setItem(STORAGE_THEME_KEY, JSON.stringify(darkMode));

    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Handle Shared Link in URL Hash on mount
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#share=')) {
      try {
        const encoded = hash.replace('#share=', '');
        const jsonStr = decodeURIComponent(atob(encoded));
        const payload = JSON.parse(jsonStr);

        // Check expiry
        if (payload.expiry && Date.now() > payload.expiry) {
          showToastMsg('لینک اشتراک‌گذاری منقضی شده است.', 'error');
          return;
        }

        if (payload.protected) {
          setSharePromptPayload(payload);
        } else if (payload.text) {
          setInputText(payload.text);
          setOutputText(payload.text);
          showToastMsg('متن اشتراک‌گذاری شده با موفقیت بارگذاری شد.');
        }
      } catch (e) {
        showToastMsg('خطا در خواندن لینک اشتراک‌گذاری.', 'error');
      }
    }
  }, [showToastMsg]);

  const handleUnlockShare = () => {
    if (!sharePromptPayload) return;
    const enteredHash = btoa(inputPassword.trim());
    if (enteredHash === sharePromptPayload.passHash) {
      setInputText(sharePromptPayload.text);
      setOutputText(sharePromptPayload.text);
      setSharePromptPayload(null);
      setInputPassword('');
      setPasswordError(false);
      showToastMsg('رمز عبور صحیح است. متن بارگذاری شد.');
    } else {
      setPasswordError(true);
    }
  };

  // Run Virastar Process
  const handleRunProcess = useCallback(() => {
    if (!inputText) {
      setOutputText('');
      return;
    }

    const processed = processPersianText(inputText, options);
    setOutputText(processed);

    // Save to history if meaningful output
    if (processed.trim().length > 0) {
      const stats = computeTextStats(processed);
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        title: processed.slice(0, 35) + '...',
        inputText,
        outputText: processed,
        stats,
      };

      setHistory((prev) => {
        const filtered = prev.filter((item) => item.outputText !== processed);
        return [newItem, ...filtered].slice(0, 10);
      });
    }
  }, [inputText, options]);

  // Live processing debounce effect
  useEffect(() => {
    if (!liveProcessing) return;

    const timer = setTimeout(() => {
      handleRunProcess();
    }, 250);

    return () => clearTimeout(timer);
  }, [inputText, options, liveProcessing, handleRunProcess]);

  // Select Preset Mode
  const handleSelectPreset = (preset: PresetMode) => {
    setActivePreset(preset);
    const newOpts = getPresetOptions(preset);
    setOptions(newOpts);
    showToastMsg(`پروفایل «${getPresetTitleFa(preset)}» اعمال شد.`);
  };

  const getPresetTitleFa = (preset: PresetMode) => {
    switch (preset) {
      case 'max': return 'حداکثری';
      case 'literary': return 'ادبی';
      case 'academic': return 'دانشگاهی';
      case 'minimal': return 'مینیمال';
      default: return 'پیش‌فرض';
    }
  };

  // Swap input and output
  const handleSwapText = () => {
    if (!outputText) {
      showToastMsg('متن خروجی خالی است.', 'error');
      return;
    }
    const temp = inputText;
    setInputText(outputText);
    setOutputText(temp);
    showToastMsg('متن ورودی و خروجی جابه‌جا شدند.');
  };

  // Clear input
  const handleClearInput = () => {
    setInputText('');
    setOutputText('');
    showToastMsg('متن پاکسازی شد.', 'info');
  };

  // Copy output
  const handleCopyOutput = async () => {
    if (!outputText) {
      showToastMsg('متنی برای کپی وجود ندارد.', 'error');
      return;
    }
    try {
      await navigator.clipboard.writeText(outputText);
      showToastMsg('متن خروجی در کلیپ‌بورد کپی شد!');
    } catch (e) {
      showToastMsg('خطا در کپی متن.', 'error');
    }
  };

  // Stats computation
  const inputStats = useMemo(() => computeTextStats(inputText), [inputText]);
  const outputStats = useMemo(() => computeTextStats(outputText), [outputText]);
  const { tokens: diffTokens, stats: diffStats } = useMemo(
    () => computeDiff(inputText, outputText),
    [inputText, outputText]
  );

  // Keyboard Shortcuts Handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + Enter -> Run Process
      if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        handleRunProcess();
        showToastMsg('پردازش با موفقیت انجام شد.');
      }
      // Ctrl + Shift + C -> Copy Output
      if (e.ctrlKey && e.shiftKey && (e.key === 'C' || e.key === 'c')) {
        e.preventDefault();
        handleCopyOutput();
      }
      // Ctrl + Shift + D -> Toggle Diff
      if (e.ctrlKey && e.shiftKey && (e.key === 'D' || e.key === 'd')) {
        e.preventDefault();
        setShowDiff((prev) => !prev);
      }
      // Ctrl + Shift + S -> Open Samples
      if (e.ctrlKey && e.shiftKey && (e.key === 'S' || e.key === 's')) {
        e.preventDefault();
        setIsSampleOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleRunProcess, showToastMsg]);

  return (
    <div className="h-screen overflow-hidden flex flex-col font-sans app-bg main-text transition-colors duration-200 dir-rtl selection:bg-brand-600/20">
      
      {/* Top Fixed Header */}
      <Header
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode((prev) => !prev)}
        onOpenSamples={() => setIsSampleOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        historyCount={history.length}
      />

      {/* Workspace Area - 100% Full-Width Focused Text Editor */}
      <main className="flex-1 min-h-0 max-w-[1600px] w-full mx-auto p-2.5 sm:p-4 overflow-hidden">
        <div className="h-full min-h-0 flex flex-col">
          <VirastarEditor
            inputText={inputText}
            outputText={outputText}
            onChangeInput={setInputText}
            onChangeOutput={setOutputText}
            onRunProcess={handleRunProcess}
            onSwapText={handleSwapText}
            onClearInput={handleClearInput}
            liveProcessing={liveProcessing}
            onToggleLive={setLiveProcessing}
            showDiff={showDiff}
            onToggleDiff={() => setShowDiff((prev) => !prev)}
            inputStats={inputStats}
            outputStats={outputStats}
            diffStats={diffStats}
            diffTokens={diffTokens}
            onCopyOutput={handleCopyOutput}
            onOpenShareModal={() => setIsShareOpen(true)}
            onShowToast={showToastMsg}
          />
        </div>
      </main>

      {/* Copyright Footer */}
      <footer className="py-1.5 md:py-2 px-3 md:px-4 text-center border-t main-border sub-bg text-[10px] md:text-[11px] muted-text shrink-0 flex flex-row flex-nowrap items-center justify-between gap-x-2 max-w-[1600px] w-full mx-auto" id="creator-footer">
        <div className="flex items-center gap-1 shrink-0">
          <span>توسعه:</span>
          <a
            href="https://derhami.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold accent-text hover:underline transition-all"
            id="creator-link"
          >
            حمیدرضا درهمی
          </a>
        </div>
        <div className="shrink-0">
          <span>© {new Date().getFullYear()} ویراستار فارسی</span>
        </div>
      </footer>

      {/* Settings Modal Drawer */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="w-full max-w-3xl h-full max-h-[90vh] card-bg border main-border card-radius shadow-2xl overflow-hidden flex flex-col">
            <OptionsPanel
              options={options}
              onChangeOptions={setOptions}
              activePreset={activePreset}
              onSelectPreset={handleSelectPreset}
              persistSettings={persistSettings}
              onTogglePersist={setPersistSettings}
              onClose={() => setIsSettingsOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Modals & Drawers */}
      <SampleTextModal
        isOpen={isSampleOpen}
        onClose={() => setIsSampleOpen(false)}
        onSelectSample={(sample: SampleText) => {
          setInputText(sample.content);
          showToastMsg(`متن «${sample.title}» بارگذاری شد.`);
        }}
      />

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onRestore={(item) => {
          setInputText(item.inputText);
          setOutputText(item.outputText);
          showToastMsg('متن از تاریخچه بازگردانی شد.');
        }}
        onClearHistory={() => {
          setHistory([]);
          showToastMsg('تاریخچه پاکسازی شد.', 'info');
        }}
      />

      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        outputText={outputText || inputText}
        onShowToast={showToastMsg}
      />

      {/* Shared Password Protection Prompt Modal */}
      {sharePromptPayload && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="card-bg border main-border card-radius max-w-sm w-full p-5 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 accent-text">
              <Lock className="w-5 h-5" />
              <h3 className="font-bold text-sm main-text">این سند با رمز عبور محافظت شده است</h3>
            </div>
            <p className="text-xs muted-text">
              لطفاً جهت باز کردن و مشاهده متن خروجی، رمز عبور را وارد کنید:
            </p>
            <input
              type="password"
              value={inputPassword}
              onChange={(e) => {
                setInputPassword(e.target.value);
                setPasswordError(false);
              }}
              placeholder="رمز عبور..."
              className="w-full p-2.5 sub-bg border sub-border btn-radius text-xs main-text focus:outline-none"
            />
            {passwordError && (
              <div className="text-[11px] text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>رمز عبور اشتباه است.</span>
              </div>
            )}
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleUnlockShare}
                className="flex-1 py-2 btn-radius accent-bg text-white font-bold text-xs"
              >
                باز کردن سند
              </button>
              <button
                onClick={() => setSharePromptPayload(null)}
                className="px-3 py-2 btn-radius card-bg muted-text text-xs border sub-border"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Footer */}
      <Footer />

    </div>
  );
}
