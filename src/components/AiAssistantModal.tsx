import React, { useState } from 'react';
import { Sparkles, Wand2, RefreshCw, Check, X, Bot, FileText, ArrowLeft, MessageSquare, AlertCircle } from 'lucide-react';
import { AiMode, AiTone } from '../types';
import { requestAiEdit } from '../lib/aiService';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  inputText: string;
  onApplyResult: (text: string) => void;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  inputText,
  onApplyResult,
}) => {
  const [mode, setMode] = useState<AiMode>('proofread');
  const [targetTone, setTargetTone] = useState<AiTone>('رسمی و اداری');
  const [customPrompt, setCustomPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultText, setResultText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleRunAi = async () => {
    if (!inputText || !inputText.trim()) {
      setErrorMsg('متن ورودی خالی است. ابتدا متنی در ویرایشگر بنویسید.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setResultText('');

    try {
      const result = await requestAiEdit({
        text: inputText,
        mode,
        targetTone,
        customPrompt,
      });
      setResultText(result);
    } catch (err: any) {
      setErrorMsg(err.message || 'خطا در ارتباط با هوش مصنوعی.');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (resultText) {
      onApplyResult(resultText);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="sub-bg border main-border card-radius max-w-2xl w-full shadow-lg flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 border-b main-border flex items-center justify-between card-bg">
          <div className="flex items-center gap-2.5">
            <div className="p-2 card-radius accent-light-bg accent-text">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold main-text">ویراستار و بازنویس هوشمند AI (Gemini)</h3>
              <p className="text-xs muted-text">اصلاح پیشرفته غلط‌های املایی، تغییر لحن و روان‌سازی متن فارسی</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 card-radius muted-text hover:text-main hover-bg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          
          {/* Modes selection */}
          <div className="space-y-2">
            <label className="block sub-text font-semibold">حالت پردازش هوش مصنوعی:</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                onClick={() => setMode('proofread')}
                className={`p-2.5 card-radius border text-right transition-all ${
                  mode === 'proofread'
                    ? 'accent-light-bg main-border accent-text font-semibold'
                    : 'card-bg main-border muted-text hover-bg'
                }`}
              >
                <div className="font-bold main-text mb-0.5">ویرایش کامل املایی/دستوری</div>
                <div className="text-[11px] opacity-80">اصلاح دقیق ساختار و غلط‌ها</div>
              </button>

              <button
                onClick={() => setMode('tone')}
                className={`p-2.5 card-radius border text-right transition-all ${
                  mode === 'tone'
                    ? 'accent-light-bg main-border accent-text font-semibold'
                    : 'card-bg main-border muted-text hover-bg'
                }`}
              >
                <div className="font-bold main-text mb-0.5">تغییر لحن و سبک</div>
                <div className="text-[11px] opacity-80">رسمی، ادبی، محاوره‌ای و...</div>
              </button>

              <button
                onClick={() => setMode('simplify')}
                className={`p-2.5 card-radius border text-right transition-all ${
                  mode === 'simplify'
                    ? 'accent-light-bg main-border accent-text font-semibold'
                    : 'card-bg main-border muted-text hover-bg'
                }`}
              >
                <div className="font-bold main-text mb-0.5">ساده‌سازی و روان‌سازی</div>
                <div className="text-[11px] opacity-80">قابل فهم برای عموم</div>
              </button>

              <button
                onClick={() => setMode('summarize')}
                className={`p-2.5 card-radius border text-right transition-all ${
                  mode === 'summarize'
                    ? 'accent-light-bg main-border accent-text font-semibold'
                    : 'card-bg main-border muted-text hover-bg'
                }`}
              >
                <div className="font-bold main-text mb-0.5">خلاصه‌سازی هوشمند</div>
                <div className="text-[11px] opacity-80">استخراج نکات اصلی</div>
              </button>

              <button
                onClick={() => setMode('custom')}
                className={`col-span-2 sm:col-span-2 p-2.5 card-radius border text-right transition-all ${
                  mode === 'custom'
                    ? 'accent-light-bg main-border accent-text font-semibold'
                    : 'card-bg main-border muted-text hover-bg'
                }`}
              >
                <div className="font-bold main-text mb-0.5">دستور دلخواه (Custom Prompt)</div>
                <div className="text-[11px] opacity-80">نوشتن دستور ویرایش مستقیم به هوش مصنوعی</div>
              </button>
            </div>
          </div>

          {/* Tone selector */}
          {mode === 'tone' && (
            <div className="space-y-2 p-3 card-bg card-radius border main-border">
              <label className="block sub-text font-semibold">انتخاب لحن مقصد:</label>
              <div className="flex flex-wrap gap-2">
                {(['رسمی و اداری', 'ادبی و فاخر', 'محاوره‌ای و صمیمی', 'علمی و دانشگاهی', 'مطبوعاتی و خبری', 'کودک و نوجوان'] as AiTone[]).map(
                  (tone) => (
                    <button
                      key={tone}
                      onClick={() => setTargetTone(tone)}
                      className={`px-3 py-1.5 card-radius border text-xs transition-all ${
                        targetTone === tone
                          ? 'accent-bg text-white font-bold'
                          : 'sub-bg main-border muted-text hover-bg'
                      }`}
                    >
                      {tone}
                    </button>
                  )
                )}
              </div>
            </div>
          )}

          {/* Custom Prompt Input */}
          {mode === 'custom' && (
            <div className="space-y-2">
              <label className="block sub-text font-semibold">دستور اختصاصی به هوش مصنوعی:</label>
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="مثال: جملات را کوتاه کن و لحن آن را محترمانه‌تر بنویس..."
                className="w-full p-2.5 card-bg border main-border card-radius main-text placeholder:text-slate-400/60 focus:outline-none focus:border-rose-500"
              />
            </div>
          )}

          {/* Run Button */}
          <button
            onClick={handleRunAi}
            disabled={loading}
            className="w-full h-9 card-radius font-bold accent-bg text-white shadow-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>در حال پردازش هوشمند...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span>اجرای پردازش با Gemini AI</span>
              </>
            )}
          </button>

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 card-radius text-rose-800 dark:text-rose-200 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Result Output */}
          {resultText && (
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="font-bold main-text">نتیجه پردازش هوش مصنوعی:</span>
                <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">آماده جایگزینی</span>
              </div>
              <div className="p-3 card-bg border main-border card-radius main-text leading-relaxed whitespace-pre-wrap max-h-[200px] overflow-y-auto">
                {resultText}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t main-border card-bg flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 h-9 flex items-center justify-center card-radius sub-bg hover-bg sub-text border main-border font-medium transition-colors"
          >
            انصراف
          </button>
          <button
            onClick={handleApply}
            disabled={!resultText}
            className="px-4 h-9 flex items-center justify-center card-radius accent-bg disabled:opacity-40 text-white font-bold gap-2 transition-all shadow-xs"
          >
            <Check className="w-4 h-4" />
            <span>اعمال روی خروجی</span>
          </button>
        </div>

      </div>
    </div>
  );
};
