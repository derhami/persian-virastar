import React from 'react';
import { DiffToken, DiffStats } from '../types';
import { Layers, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

interface DiffViewerProps {
  tokens: DiffToken[];
  stats: DiffStats;
}

export const DiffViewer: React.FC<DiffViewerProps> = ({ tokens, stats }) => {
  return (
    <div className="bg-[#F2F3F8] dark:bg-[#24262E] border border-[#C3C7D4] dark:border-[#4A4E5D] rounded-2xl p-4 space-y-3 font-sans text-xs">
      
      {/* Legend & Stat badges */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#C3C7D4] dark:border-[#4A4E5D]">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-brand-500 dark:text-brand-300" />
          <span className="font-bold text-brand-900 dark:text-brand-100">مقایسه دیداری تغییرات (Diff):</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-brand-600/10 border border-brand-600/20 text-brand-800 dark:text-brand-300 font-medium">
            افزوده/اصلاح‌شده ({stats.additionsCount})
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-rose-600/10 border border-rose-600/20 text-rose-800 dark:text-rose-300 font-medium">
            حذف‌شده ({stats.deletionsCount})
          </span>
          {stats.halfSpacesAdded > 0 && (
            <span className="px-2.5 py-0.5 rounded-full bg-brand-50 dark:bg-brand-900/40 border border-brand-600/20 text-brand-700 dark:text-brand-300 font-medium">
              +{stats.halfSpacesAdded} نیم‌فاصله
            </span>
          )}
          {stats.digitsConverted > 0 && (
            <span className="px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-medium">
              {stats.digitsConverted} عدد فارسی
            </span>
          )}
        </div>
      </div>

      {/* Diff Text Renderer */}
      <div className="p-3 bg-white dark:bg-[#2E313A] rounded-xl border border-[#C3C7D4] dark:border-[#4A4E5D] overflow-x-auto min-h-[160px] max-h-[350px] leading-relaxed whitespace-pre-wrap font-medium">
        {tokens.map((token, index) => {
          if (token.type === 'added') {
            return (
              <span
                key={index}
                className="bg-brand-100 dark:bg-brand-900/40 text-brand-900 dark:text-brand-200 border-b-2 border-brand-600 px-0.5 rounded"
                title="متن افزوده‌شده یا اصلاح‌شده"
              >
                {token.value}
              </span>
            );
          }
          if (token.type === 'removed') {
            return (
              <span
                key={index}
                className="bg-rose-100 dark:bg-rose-900/40 text-rose-900 dark:text-rose-300 line-through px-0.5 rounded opacity-80"
                title="متن حذف‌شده یا جایگزین‌شده"
              >
                {token.value}
              </span>
            );
          }
          return <span key={index} className="text-brand-900 dark:text-brand-100">{token.value}</span>;
        })}
      </div>
    </div>
  );
};