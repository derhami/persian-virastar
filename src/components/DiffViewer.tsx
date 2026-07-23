import React from 'react';
import { DiffToken, DiffStats } from '../types';
import { Layers, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

interface DiffViewerProps {
  tokens: DiffToken[];
  stats: DiffStats;
}

export const DiffViewer: React.FC<DiffViewerProps> = ({ tokens, stats }) => {
  return (
    <div className="bg-[#FAF9F6] dark:bg-[#201E1B] border border-[#D1CEBD] dark:border-[#3B3831] rounded-2xl p-4 space-y-3 font-sans text-xs">
      
      {/* Legend & Stat badges */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#D1CEBD] dark:border-[#3B3831]">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#7D7C6B] dark:text-[#9C978B]" />
          <span className="font-bold text-[#2D2926] dark:text-[#EAE6DF]">مقایسه دیداری تغییرات (Diff):</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-600/10 border border-emerald-600/20 text-emerald-800 dark:text-emerald-300 font-medium">
            افزوده/اصلاح‌شده ({stats.additionsCount})
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-rose-600/10 border border-rose-600/20 text-rose-800 dark:text-rose-300 font-medium">
            حذف‌شده ({stats.deletionsCount})
          </span>
          {stats.halfSpacesAdded > 0 && (
            <span className="px-2.5 py-0.5 rounded-full bg-[#C27E5D]/15 border border-[#C27E5D]/30 text-[#C27E5D] dark:text-[#D98E6C] font-medium">
              +{stats.halfSpacesAdded} نیم‌فاصله
            </span>
          )}
          {stats.digitsConverted > 0 && (
            <span className="px-2.5 py-0.5 rounded-full bg-[#7D7C6B]/15 border border-[#7D7C6B]/30 text-[#3D3A30] dark:text-[#EAE6DF] font-medium">
              {stats.digitsConverted} عدد فارسی
            </span>
          )}
        </div>
      </div>

      {/* Diff Text Renderer */}
      <div className="p-3 bg-white dark:bg-[#282622] rounded-xl border border-[#D1CEBD] dark:border-[#3B3831] overflow-x-auto min-h-[160px] max-h-[350px] leading-relaxed whitespace-pre-wrap font-medium">
        {tokens.map((token, index) => {
          if (token.type === 'added') {
            return (
              <span
                key={index}
                className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-200 border-b-2 border-emerald-600 px-0.5 rounded"
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
          return <span key={index} className="text-[#2D2926] dark:text-[#EAE6DF]">{token.value}</span>;
        })}
      </div>
    </div>
  );
};
