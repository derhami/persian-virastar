import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  ArrowRightLeft,
  Copy,
  Download,
  Trash2,
  FileUp,
  Layers,
  Sparkles,
  Check,
  Zap,
  Info,
  Type,
  Share2,
  Heading1,
  Heading2,
  Heading3,
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Code,
  ZoomIn,
  ZoomOut,
  FileCode,
  FileText,
  File,
  Wand2,
  Hash,
  Sparkle,
  GripVertical,
  Underline,
  Strikethrough,
  Highlighter
} from 'lucide-react';
import { TextStats, DiffStats, DiffToken } from '../types';
import { DiffViewer } from './DiffViewer';
import { StatsChartWidget } from './StatsChartWidget';

interface VirastarEditorProps {
  inputText: string;
  outputText: string;
  onChangeInput: (text: string) => void;
  onChangeOutput: (text: string) => void;
  onRunProcess: () => void;
  onSwapText: () => void;
  onClearInput: () => void;
  liveProcessing: boolean;
  onToggleLive: (val: boolean) => void;
  showDiff: boolean;
  onToggleDiff: () => void;
  inputStats: TextStats;
  outputStats: TextStats;
  diffStats: DiffStats;
  diffTokens: DiffToken[];
  onCopyOutput: () => void;
  onOpenAiModal: () => void;
  onOpenShareModal: () => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const VirastarEditor: React.FC<VirastarEditorProps> = ({
  inputText,
  outputText,
  onChangeInput,
  onChangeOutput,
  onRunProcess,
  onSwapText,
  onClearInput,
  liveProcessing,
  onToggleLive,
  showDiff,
  onToggleDiff,
  inputStats,
  outputStats,
  diffStats,
  diffTokens,
  onCopyOutput,
  onOpenAiModal,
  onOpenShareModal,
  onShowToast,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const outputRef = useRef<HTMLTextAreaElement>(null);

  // Focus mode state
  const [isFocusMode, setIsFocusMode] = useState(false);

  // Mobile active tab ('input' | 'output' | 'both')
  const [mobileTab, setMobileTab] = useState<'input' | 'output' | 'both'>('both');

  // Panel Split Ratio state (percentage allocated to Input panel: default 50%)
  const [splitRatio, setSplitRatio] = useState<number>(50);
  const [isDraggingSplit, setIsDraggingSplit] = useState(false);
  const editorContainerRef = useRef<HTMLDivElement>(null);

  // Font size scaling (px)
  const [fontSize, setFontSize] = useState<number>(14);

  // Download menu state
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Panel Resize mouse/touch listeners
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingSplit || !editorContainerRef.current) return;
      const rect = editorContainerRef.current.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      // RTL check: in RTL layout, left edge corresponds to Output (or 100 - X)
      const percentage = 100 - ((offsetX / rect.width) * 100);
      const clamped = Math.max(20, Math.min(80, Math.round(percentage)));
      setSplitRatio(clamped);
    };

    const handleMouseUp = () => {
      if (isDraggingSplit) {
        setIsDraggingSplit(false);
      }
    };

    if (isDraggingSplit) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingSplit]);

  // Apply HTML Tags to Output Selection
  const applyHtmlTag = (tag: string) => {
    const el = outputRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const currentVal = el.value;
    const selectedText = currentVal.substring(start, end);

    let replacement = `<${tag}>${selectedText || 'متن انتخابی'}</${tag}>`;
    if (tag === 'p') {
      replacement = `\n<p>${selectedText || 'پاراگراف جدید'}</p>\n`;
    } else if (tag.startsWith('h')) {
      replacement = `\n<${tag}>${selectedText || 'عنوان جدید'}</${tag}>\n`;
    } else if (tag === 'blockquote') {
      replacement = `\n<blockquote>${selectedText || 'متن نقل‌قول'}</blockquote>\n`;
    }

    const newText = currentVal.substring(0, start) + replacement + currentVal.substring(end);
    onChangeOutput(newText);

    setTimeout(() => {
      el.focus();
    }, 0);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result;
      if (typeof content === 'string') {
        onChangeInput(content);
        onShowToast('فایل متنی بارگذاری شد.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Quick Utilities
  const quickZwnjFix = () => {
    if (!inputText) return;
    let text = inputText;
    text = text.replace(/(\s|^)(می|نمی)\s+/g, '$1$2\u200C');
    text = text.replace(/\s+(ها|‌های|‌هایی|‌هایم|‌هایت|‌هایش|‌هایمان|‌هایتان|‌هایشان)(\s|[.,!؟;:]|$)/g, '\u200C$1$2');
    text = text.replace(/\s+(تر|ترین|تری)(\s|[.,!؟;:]|$)/g, '\u200C$1$2');
    onChangeInput(text);
    onShowToast('اصلاح سریع نیم‌فاصله‌ها روی متن ورودی اعمال شد.');
  };

  const quickPersianDigits = () => {
    if (!inputText) return;
    const enDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const faDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    let text = inputText;
    for (let i = 0; i < 10; i++) {
      text = text.replace(new RegExp(enDigits[i], 'g'), faDigits[i]);
    }
    onChangeInput(text);
    onShowToast('اعداد انگلیسی به فارسی تبدیل شدند.');
  };

  const quickCleanSpaces = () => {
    if (!inputText) return;
    let text = inputText;
    text = text.replace(/[ \t]+/g, ' ');
    text = text.replace(/\n{3,}/g, '\n\n');
    text = text.trim();
    onChangeInput(text);
    onShowToast('فواصل و سطرهای اضافی حذف شدند.');
  };

  // Helper to format selection in active target
  const applyFormatting = (target: 'input' | 'output', startTag: string, endTag = '') => {
    const el = target === 'input' ? inputRef.current : outputRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const currentVal = el.value;
    const selectedText = currentVal.substring(start, end);

    let replacement = `${startTag}${selectedText || 'متن نمونه'}${endTag}`;
    if (startTag.startsWith('#') || startTag.startsWith('- ') || startTag.startsWith('1. ') || startTag.startsWith('> ')) {
      replacement = `\n${startTag}${selectedText || 'عنوان جدید'}\n`;
    }

    const newText = currentVal.substring(0, start) + replacement + currentVal.substring(end);

    if (target === 'input') {
      onChangeInput(newText);
    } else {
      onChangeOutput(newText);
    }

    setTimeout(() => {
      el.focus();
    }, 0);
  };

  // Downloads
  const downloadTxt = () => {
    if (!outputText) return onShowToast('متنی برای دانلود وجود ندارد.', 'error');
    const blob = new Blob([outputText], { type: 'text/plain;charset=utf-8' });
    triggerDownload(blob, 'virastar_output.txt');
    onShowToast('فایل متنی (TXT) دانلود شد.');
  };

  const downloadMd = () => {
    if (!outputText) return onShowToast('متنی برای دانلود وجود ندارد.', 'error');
    const blob = new Blob([outputText], { type: 'text/markdown;charset=utf-8' });
    triggerDownload(blob, 'virastar_output.md');
    onShowToast('فایل مارک‌داون (MD) دانلود شد.');
  };

  const downloadWord = () => {
    if (!outputText) return onShowToast('متنی برای دانلود وجود ندارد.', 'error');
    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>Virastar Word Document</title>
        <style>
          body { font-family: 'Vazirmatn', 'Tahoma', sans-serif; direction: rtl; text-align: right; font-size: 13pt; line-height: 1.8; }
          p { margin-bottom: 12pt; }
        </style>
      </head>
      <body>
        ${outputText.split('\n').map(line => line ? `<p>${line}</p>` : '<p>&nbsp;</p>').join('')}
      </body>
      </html>
    `;
    const blob = new Blob(['\ufeff' + htmlContent], { type: 'application/msword;charset=utf-8' });
    triggerDownload(blob, 'virastar_document.doc');
    onShowToast('فایل ورد (DOC) دانلود شد.');
  };

  const downloadHtml = () => {
    if (!outputText) return onShowToast('متنی برای دانلود وجود ندارد.', 'error');
    const htmlContent = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>خروجی ویراستار</title>
  <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Vazirmatn', sans-serif; direction: rtl; text-align: right; background: #faf9f6; color: #2d2926; padding: 30px; max-width: 800px; margin: 0 auto; line-height: 1.8; }
  </style>
</head>
<body>
  ${outputText.split('\n').map(line => line ? `<p>${line}</p>` : '<br>').join('')}
</body>
</html>`;
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    triggerDownload(blob, 'virastar_output.html');
    onShowToast('فایل وب (HTML) دانلود شد.');
  };

  const triggerDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  return (
    <div className="flex flex-col h-full space-y-3 overflow-hidden">
      
      {/* Top Action Bar */}
      <div className="sub-bg border main-border card-radius p-1.5 md:p-2 flex flex-nowrap overflow-x-auto scrollbar-none items-center justify-between gap-2 shrink-0 theme-shadow" id="top-action-bar-container">
        
        {/* Run & Primary Operations */}
        <div className="flex items-center flex-nowrap gap-1 md:gap-1.5 shrink-0" id="primary-operations">
          <button
            onClick={() => {
              onRunProcess();
              if (window.innerWidth < 768) {
                setMobileTab('output');
              }
            }}
            className="flex items-center justify-center gap-1 md:gap-1.5 px-2.5 md:px-3.5 h-8 md:h-9 btn-radius accent-bg accent-hover-bg text-white font-bold text-[11px] md:text-xs transition-all active:scale-95 shadow-xs shrink-0"
            title="اجرای پردازش (Ctrl + Enter)"
            id="process-btn"
          >
            <Play className="w-3 h-3 md:w-3.5 md:h-3.5 fill-white shrink-0" />
            <span>پردازش</span>
            <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] bg-black/20 text-white rounded font-mono dir-ltr shrink-0">
              Ctrl+Enter
            </kbd>
          </button>

          <button
            onClick={onSwapText}
            className="flex items-center justify-center gap-1 px-2 md:px-2.5 h-8 md:h-9 btn-radius card-bg hover-bg main-text border main-border text-[11px] md:text-xs font-semibold transition-all shrink-0"
            title="جابه‌جایی ورودی و خروجی"
            id="swap-btn"
          >
            <ArrowRightLeft className="w-3 h-3 md:w-3.5 md:h-3.5 muted-text shrink-0" />
            <span className="hidden xs:inline">جابه‌جایی</span>
          </button>

          <button
            onClick={onToggleDiff}
            className={`flex items-center justify-center gap-1 px-2 md:px-2.5 h-8 md:h-9 btn-radius border text-[11px] md:text-xs font-semibold transition-all shrink-0 ${
              showDiff
                ? 'accent-light-bg main-border accent-text font-bold'
                : 'card-bg hover-bg main-text border main-border'
            }`}
            title="نمایش مقایسه‌ای تغییرات"
            id="diff-btn"
          >
            <Layers className="w-3 h-3 md:w-3.5 md:h-3.5 shrink-0" />
            <span className="hidden sm:inline">مقایسه (Diff)</span>
          </button>

          {/* Quick Persian Utilities */}
          <div className="hidden sm:flex items-center gap-1 border-r main-border pr-2 mr-1 shrink-0" id="quick-utilities">
            <button
              onClick={quickZwnjFix}
              className="px-2 md:px-2.5 h-8 md:h-9 flex items-center justify-center btn-radius card-bg hover-bg main-text border sub-border text-[11px] font-semibold transition-all shrink-0"
              title="اصلاح نیم‌فاصله 'می' و 'ها'"
            >
              نیم‌فاصله سریع
            </button>
            <button
              onClick={quickPersianDigits}
              className="px-2 md:px-2.5 h-8 md:h-9 flex items-center justify-center btn-radius card-bg hover-bg main-text border sub-border text-[11px] font-semibold transition-all shrink-0"
              title="تبدیل اعداد انگلیسی به فارسی"
            >
              اعداد فارسی
            </button>
            <button
              onClick={quickCleanSpaces}
              className="px-2 md:px-2.5 h-8 md:h-9 flex items-center justify-center btn-radius card-bg hover-bg main-text border sub-border text-[11px] font-semibold transition-all shrink-0"
              title="حذف فواصل اضافی و سطرهای خالی"
            >
              پاکسازی فواصل
            </button>
          </div>
        </div>

        {/* Right side Controls: Mobile Switcher + Font Scale + Live Toggle + Focus Mode */}
        <div className="flex items-center gap-1 md:gap-1.5 shrink-0" id="secondary-controls">
          
          {/* Mobile Tab Toggle */}
          <div className="flex md:hidden items-center p-0.5 h-8 sub-bg border main-border btn-radius text-[11px] shrink-0" id="mobile-tabs-selector">
            <button
              onClick={() => setMobileTab('input')}
              className={`px-2 h-[26px] flex items-center justify-center btn-radius font-bold transition-all shrink-0 ${mobileTab === 'input' ? 'accent-bg text-white shadow-xs' : 'muted-text'}`}
            >
              ورودی
            </button>
            <button
              onClick={() => setMobileTab('both')}
              className={`px-2 h-[26px] flex items-center justify-center btn-radius font-bold transition-all shrink-0 ${mobileTab === 'both' ? 'accent-bg text-white shadow-xs' : 'muted-text'}`}
            >
              هر دو
            </button>
            <button
              onClick={() => setMobileTab('output')}
              className={`px-2 h-[26px] flex items-center justify-center btn-radius font-bold transition-all shrink-0 ${mobileTab === 'output' ? 'accent-bg text-white shadow-xs' : 'muted-text'}`}
            >
              خروجی
            </button>
          </div>

          {/* Font Size Adjuster */}
          <div className="hidden xs:flex items-center gap-0.5 px-1 md:px-1.5 h-8 md:h-9 card-bg btn-radius border main-border text-[11px] md:text-xs shrink-0" id="font-size-adjuster">
            <button
              onClick={() => setFontSize(prev => Math.max(12, prev - 1))}
              className="p-1 h-5 md:h-6 w-5 md:w-6 flex items-center justify-center hover-bg btn-radius muted-text shrink-0"
              title="کوچک‌تر کردن متن"
            >
              <ZoomOut className="w-3 h-3 md:w-3.5 md:h-3.5" />
            </button>
            <span className="font-mono text-[10px] md:text-[11px] px-1 main-text min-w-[20px] md:min-w-[24px] text-center font-bold shrink-0">
              {fontSize}
            </span>
            <button
              onClick={() => setFontSize(prev => Math.min(24, prev + 1))}
              className="p-1 h-5 md:h-6 w-5 md:w-6 flex items-center justify-center hover-bg btn-radius muted-text shrink-0"
              title="بزرگ‌تر کردن متن"
            >
              <ZoomIn className="w-3 h-3 md:w-3.5 md:h-3.5" />
            </button>
          </div>

          {/* Live Processing toggle */}
          <label className="flex items-center justify-center gap-1 px-2 md:px-3 h-8 md:h-9 btn-radius card-bg border main-border cursor-pointer select-none text-[11px] md:text-xs main-text font-semibold shrink-0" title="پردازش همزمان هنگام تایپ" id="live-toggle-label">
            <input
              type="checkbox"
              checked={liveProcessing}
              onChange={(e) => onToggleLive(e.target.checked)}
              className="w-3 h-3 md:w-3.5 md:h-3.5 badge-radius border main-border accent-bg cursor-pointer"
            />
            <Zap className="w-3 h-3 md:w-3.5 md:h-3.5 accent-text shrink-0" />
            <span className="hidden sm:inline text-[10px] md:text-[11px]">زنده</span>
          </label>

        </div>

      </div>

      {/* Main Dual Editor Panels with Resizable Splitter (Heights fill available space) */}
      <div
        ref={editorContainerRef}
        className="flex flex-col md:flex-row gap-2 flex-1 min-h-0 relative"
      >
        
        {/* INPUT PANEL */}
        <div
          style={{
            width: typeof window !== 'undefined' && window.innerWidth >= 768 ? `${splitRatio}%` : '100%'
          }}
          className={`card-bg border main-border card-radius flex flex-col overflow-hidden theme-shadow md:w-[var(--split-input)] ${
            mobileTab === 'output' ? 'hidden md:flex' : 'flex'
          } ${
            mobileTab === 'both' ? 'h-[calc(50%-4px)] md:h-full flex-1' : 'h-full'
          }`}
        >
          
          {/* Panel Header */}
          <div className="p-1.5 md:p-2.5 px-2 md:px-3 sub-bg border-b main-border flex items-center justify-between gap-2 text-xs shrink-0" id="input-panel-header">
            <div className="flex items-center gap-1.5 md:gap-2">
              <Type className="w-3.5 h-3.5 md:w-4 md:h-4 muted-text shrink-0" />
              <strong className="main-text font-bold title-weight text-[11px] md:text-xs">
                <span className="hidden xs:inline">متن ورودی</span>
                <span className="inline xs:hidden">ورودی</span>
              </strong>
            </div>

            <div className="flex items-center gap-1 md:gap-1.5">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="h-7 md:h-8 flex items-center justify-center gap-1 px-2 md:px-2.5 btn-radius card-bg hover-bg main-text border sub-border transition-all text-[10px] md:text-[11px] font-semibold shrink-0"
                title="بارگذاری فایل متنی"
              >
                <FileUp className="w-3 h-3 md:w-3.5 md:h-3.5 muted-text shrink-0" />
                <span className="hidden sm:inline">فایل</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.md,.text"
                onChange={handleFileUpload}
                className="hidden"
              />

              <button
                onClick={onClearInput}
                className="h-7 md:h-8 flex items-center justify-center gap-1 px-2 md:px-2.5 btn-radius bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 transition-all text-[10px] md:text-[11px] font-semibold shrink-0"
                title="پاکسازی متن ورودی"
              >
                <Trash2 className="w-3 h-3 md:w-3.5 md:h-3.5 shrink-0" />
                <span className="hidden sm:inline">پاک کردن</span>
              </button>
            </div>
          </div>

          {/* Quick Markdown / Formatting Bar */}
          <div className="p-1 md:p-1.5 px-1.5 md:px-2 sub-bg border-b sub-border flex items-center flex-nowrap overflow-x-auto scrollbar-none gap-1 text-[10px] md:text-[11px] muted-text shrink-0">
            <span className="text-[9px] md:text-[10px] muted-text ml-1 shrink-0">تگ‌گذاری:</span>
            <button onClick={() => applyFormatting('input', '# ')} className="p-1 hover-bg btn-radius shrink-0" title="عنوان H1">
              <Heading1 className="w-3 h-3 md:w-3.5 md:h-3.5" />
            </button>
            <button onClick={() => applyFormatting('input', '## ')} className="p-1 hover-bg btn-radius shrink-0" title="عنوان H2">
              <Heading2 className="w-3 h-3 md:w-3.5 md:h-3.5" />
            </button>
            <button onClick={() => applyFormatting('input', '### ')} className="p-1 hover-bg btn-radius shrink-0" title="عنوان H3">
              <Heading3 className="w-3 h-3 md:w-3.5 md:h-3.5" />
            </button>
            <div className="h-3 w-[1px] bg-slate-200 dark:bg-slate-800 mx-0.5 shrink-0" />
            <button onClick={() => applyFormatting('input', '**', '**')} className="p-1 hover-bg btn-radius shrink-0" title="برجسته (Bold)">
              <Bold className="w-3 h-3 md:w-3.5 md:h-3.5" />
            </button>
            <button onClick={() => applyFormatting('input', '*', '*')} className="p-1 hover-bg btn-radius shrink-0" title="مورب (Italic)">
              <Italic className="w-3 h-3 md:w-3.5 md:h-3.5" />
            </button>
            <button onClick={() => applyFormatting('input', '- ')} className="p-1 hover-bg btn-radius shrink-0" title="لیست نقطه‌ای">
              <List className="w-3 h-3 md:w-3.5 md:h-3.5" />
            </button>
            <button onClick={() => applyFormatting('input', '1. ')} className="p-1 hover-bg btn-radius shrink-0" title="لیست شماره‌دار">
              <ListOrdered className="w-3 h-3 md:w-3.5 md:h-3.5" />
            </button>
            <button onClick={() => applyFormatting('input', '> ')} className="p-1 hover-bg btn-radius shrink-0" title="نقل قول">
              <Quote className="w-3 h-3 md:w-3.5 md:h-3.5" />
            </button>
            <button onClick={() => applyFormatting('input', '```\n', '\n```')} className="p-1 hover-bg btn-radius shrink-0" title="بلاک کد">
              <Code className="w-3 h-3 md:w-3.5 md:h-3.5" />
            </button>
          </div>

          {/* Textarea (scrolling internal) */}
          <div className="flex-1 min-h-0 relative">
            <textarea
              ref={inputRef}
              value={inputText}
              onChange={(e) => onChangeInput(e.target.value)}
              placeholder="متن اولیه یا مقاله مورد نظر را اینجا وارد یا پیست کنید..."
              style={{ fontSize: `${fontSize}px` }}
              className="w-full h-full p-4 bg-transparent main-text placeholder:text-slate-400/60 leading-relaxed focus:outline-none resize-none overflow-y-auto"
              dir="auto"
            />
          </div>

          {/* Input Stats Bar */}
          <div className="p-2 px-3 sub-bg border-t sub-border flex items-center justify-between text-[11px] muted-text shrink-0">
            <span>کاراکتر: <b className="main-text font-bold">{inputStats.chars}</b></span>
            <span>کلمه: <b className="main-text font-bold">{inputStats.words}</b></span>
            <span>سطر: <b className="main-text font-bold">{inputStats.lines}</b></span>
          </div>
        </div>

        {/* Resizable Handle / Splitter Divider */}
        <div
          onMouseDown={(e) => {
            e.preventDefault();
            setIsDraggingSplit(true);
          }}
          className={`hidden md:flex flex-col items-center justify-center w-3 cursor-col-resize hover-bg rounded-md transition-colors group select-none shrink-0 ${
            isDraggingSplit ? 'accent-bg text-white' : 'muted-text'
          }`}
          title="جهت تغییر اندازه کادرها بکشید"
        >
          <div className="w-1.5 h-10 rounded-full bg-slate-400/50 group-hover:bg-amber-600 transition-colors flex items-center justify-center">
            <GripVertical className="w-3 h-3 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* OUTPUT PANEL */}
        <div
          style={{
            width: typeof window !== 'undefined' && window.innerWidth >= 768 ? `${100 - splitRatio}%` : '100%'
          }}
          className={`card-bg border main-border card-radius flex flex-col overflow-hidden theme-shadow md:w-[var(--split-output)] ${
            mobileTab === 'input' ? 'hidden md:flex' : 'flex'
          } ${
            mobileTab === 'both' ? 'h-[calc(50%-4px)] md:h-full flex-1' : 'h-full'
          }`}
        >
          
          {/* Panel Header */}
          <div className="p-1.5 md:p-2.5 px-2 md:px-3 sub-bg border-b main-border flex items-center justify-between gap-2 text-xs shrink-0" id="output-panel-header">
            <div className="flex items-center gap-1.5 md:gap-2">
              <Check className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <strong className="main-text font-bold title-weight text-[11px] md:text-xs">
                <span className="hidden xs:inline">خروجی ویراستاری‌شده</span>
                <span className="inline xs:hidden">خروجی</span>
              </strong>
            </div>

            <div className="flex items-center gap-1 md:gap-1.5">
              
              {/* Prominent Markdown Download Button */}
              <button
                onClick={downloadMd}
                className="h-7 md:h-8 flex items-center justify-center gap-1 px-2 md:px-2.5 btn-radius accent-light-bg accent-text hover-bg font-bold transition-all text-[10px] md:text-[11px] shrink-0"
                title="دانلود مستقیم فایل مارک‌داون (.md)"
              >
                <FileCode className="w-3 h-3 md:w-3.5 md:h-3.5 shrink-0" />
                <span className="hidden sm:inline">دانلود .md</span>
              </button>

              <button
                onClick={onCopyOutput}
                className="h-7 md:h-8 flex items-center justify-center gap-1 px-2 md:px-2.5 btn-radius accent-light-bg accent-text hover-bg transition-all text-[10px] md:text-[11px] font-bold shrink-0"
                title="کپی متن خروجی"
              >
                <Copy className="w-3 h-3 md:w-3.5 md:h-3.5 shrink-0" />
                <span className="hidden sm:inline">کپی</span>
              </button>

              {/* Share button */}
              <button
                onClick={onOpenShareModal}
                className="h-7 md:h-8 flex items-center justify-center gap-1 px-2 md:px-2.5 btn-radius accent-light-bg accent-text font-bold transition-all text-[10px] md:text-[11px] shrink-0"
                title="اشتراک‌گذاری لینک خروجی"
              >
                <Share2 className="w-3 h-3 md:w-3.5 md:h-3.5 shrink-0" />
                <span className="hidden sm:inline">لینک</span>
              </button>

              {/* Download Menu Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="h-7 md:h-8 flex items-center justify-center gap-1 px-2 md:px-2.5 btn-radius card-bg hover-bg main-text border sub-border transition-all text-[10px] md:text-[11px] font-semibold shrink-0"
                  title="فرمت‌های بیشتر دانلود"
                >
                  <Download className="w-3 h-3 md:w-3.5 md:h-3.5 muted-text shrink-0" />
                  <span className="hidden sm:inline">فرمت‌ها</span>
                </button>

                {showExportMenu && (
                  <div className="absolute left-0 top-full mt-1 w-44 card-bg border main-border card-radius theme-shadow p-1.5 z-30 space-y-1 text-xs">
                    <button
                      onClick={downloadTxt}
                      className="w-full text-right p-2 hover-bg btn-radius flex items-center gap-2 main-text font-medium"
                    >
                      <FileText className="w-3.5 h-3.5 muted-text" />
                      <span>متنی (TXT)</span>
                    </button>
                    <button
                      onClick={downloadWord}
                      className="w-full text-right p-2 hover-bg btn-radius flex items-center gap-2 main-text font-medium"
                    >
                      <File className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span>مایکروسافت ورد (DOC)</span>
                    </button>
                    <button
                      onClick={downloadMd}
                      className="w-full text-right p-2 hover-bg btn-radius flex items-center gap-2 main-text font-medium"
                    >
                      <FileCode className="w-3.5 h-3.5 accent-text" />
                      <span>مارک‌داون (MD)</span>
                    </button>
                    <button
                      onClick={downloadHtml}
                      className="w-full text-right p-2 hover-bg btn-radius flex items-center gap-2 main-text font-medium"
                    >
                      <FileCode className="w-3.5 h-3.5 text-emerald-600" />
                      <span>صفحه وب (HTML)</span>
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Mini Toolbar for HTML & Formatting Tags on Output */}
          <div className="p-1 md:p-1.5 px-2 md:px-2.5 sub-bg border-b sub-border flex items-center flex-nowrap overflow-x-auto scrollbar-none gap-1 text-[10px] md:text-[11px] muted-text shrink-0">
            <span className="text-[9px] md:text-[10px] font-bold main-text ml-1 shrink-0">تگ‌های HTML:</span>
            <button onClick={() => applyHtmlTag('h1')} className="px-1 md:px-1.5 py-0.5 card-bg hover-bg main-text border sub-border btn-radius font-mono text-[9px] md:text-[10px] font-bold shrink-0" title="اعمال تگ <h1>">
              &lt;h1&gt;
            </button>
            <button onClick={() => applyHtmlTag('h2')} className="px-1 md:px-1.5 py-0.5 card-bg hover-bg main-text border sub-border btn-radius font-mono text-[9px] md:text-[10px] font-bold shrink-0" title="اعمال تگ <h2>">
              &lt;h2&gt;
            </button>
            <button onClick={() => applyHtmlTag('h3')} className="px-1 md:px-1.5 py-0.5 card-bg hover-bg main-text border sub-border btn-radius font-mono text-[9px] md:text-[10px] font-bold shrink-0" title="اعمال تگ <h3>">
              &lt;h3&gt;
            </button>
            <div className="h-3 w-[1px] bg-slate-200 dark:bg-slate-800 mx-0.5 shrink-0" />
            <button onClick={() => applyHtmlTag('b')} className="p-1 hover-bg btn-radius shrink-0" title="اعمال تگ <b> (Bold)">
              <Bold className="w-3 h-3 md:w-3.5 md:h-3.5" />
            </button>
            <button onClick={() => applyHtmlTag('i')} className="p-1 hover-bg btn-radius shrink-0" title="اعمال تگ <i> (Italic)">
              <Italic className="w-3 h-3 md:w-3.5 md:h-3.5" />
            </button>
            <button onClick={() => applyHtmlTag('u')} className="p-1 hover-bg btn-radius shrink-0" title="اعمال تگ <u> (Underline)">
              <Underline className="w-3 h-3 md:w-3.5 md:h-3.5" />
            </button>
            <button onClick={() => applyHtmlTag('del')} className="p-1 hover-bg btn-radius shrink-0" title="اعمال تگ <del> (Strikethrough)">
              <Strikethrough className="w-3 h-3 md:w-3.5 md:h-3.5" />
            </button>
            <button onClick={() => applyHtmlTag('mark')} className="p-1 hover-bg btn-radius shrink-0" title="اعمال تگ <mark> (Highlight)">
              <Highlighter className="w-3 h-3 md:w-3.5 md:h-3.5 text-amber-500" />
            </button>
            <div className="h-3 w-[1px] bg-slate-200 dark:bg-slate-800 mx-0.5 shrink-0" />
            <button onClick={() => applyHtmlTag('p')} className="px-1 md:px-1.5 py-0.5 card-bg hover-bg main-text border sub-border btn-radius font-mono text-[9px] md:text-[10px] shrink-0" title="اعمال تگ <p> (پاراگراف)">
              &lt;p&gt;
            </button>
            <button onClick={() => applyHtmlTag('blockquote')} className="px-1 md:px-1.5 py-0.5 card-bg hover-bg main-text border sub-border btn-radius font-mono text-[9px] md:text-[10px] shrink-0" title="اعمال تگ <blockquote>">
              &lt;quote&gt;
            </button>
            <button onClick={() => applyHtmlTag('code')} className="px-1 md:px-1.5 py-0.5 card-bg hover-bg main-text border sub-border btn-radius font-mono text-[9px] md:text-[10px] shrink-0" title="اعمال تگ <code>">
              &lt;code&gt;
            </button>
          </div>

          {/* Textarea (Editable by user) */}
          <div className="flex-1 min-h-0 relative">
            <textarea
              ref={outputRef}
              value={outputText}
              onChange={(e) => onChangeOutput(e.target.value)}
              placeholder="خروجی ویرایش‌شده اینجا قرار می‌گیرد..."
              style={{ fontSize: `${fontSize}px` }}
              className="w-full h-full p-4 bg-transparent main-text placeholder:text-slate-400/60 leading-relaxed focus:outline-none resize-none overflow-y-auto"
              dir="auto"
            />
          </div>

          {/* Output Stats Bar */}
          <div className="p-2 px-3 sub-bg border-t sub-border flex items-center justify-between text-[11px] muted-text shrink-0">
            <span>کاراکتر: <b className="accent-text font-bold">{outputStats.chars}</b></span>
            <span>کلمه: <b className="accent-text font-bold">{outputStats.words}</b></span>
            <span>زمان خوانش: <b className="accent-text font-bold">{outputStats.readingTimeMinutes} دقیقه</b></span>
          </div>
        </div>

      </div>

      {/* Visual Analytics Chart & Persian Readability Widget */}
      <StatsChartWidget inputStats={inputStats} outputStats={outputStats} diffStats={diffStats} />

      {/* Diff View overlay if enabled */}
      {showDiff && (
        <div className="card-bg border main-border card-radius p-3 shrink-0 max-h-[160px] overflow-y-auto theme-shadow">
          <DiffViewer tokens={diffTokens} stats={diffStats} />
        </div>
      )}

    </div>
  );
};
