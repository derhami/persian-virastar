import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { BarChart3, ChevronDown, ChevronUp, BookOpen, FileText, Clock, Sparkles, Layers, ListCollapse } from 'lucide-react';
import { TextStats, DiffStats } from '../types';

interface StatsChartWidgetProps {
  inputStats: TextStats;
  outputStats: TextStats;
  diffStats: DiffStats;
}

export const StatsChartWidget: React.FC<StatsChartWidgetProps> = ({
  inputStats,
  outputStats,
  diffStats,
}) => {
  // Collapsed by default as requested
  const [isOpen, setIsOpen] = useState(false);

  // Calculate Persian Readability Score
  const calculateReadability = (stats: TextStats) => {
    if (!stats.words || !stats.sentences) return { score: 100, label: 'بدون متن', level: 'نامشخص', color: 'text-slate-400', badgeBg: 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20' };

    const avgWordsPerSentence = stats.words / (stats.sentences || 1);
    const avgCharsPerWord = stats.chars / (stats.words || 1);

    if (avgWordsPerSentence <= 12 && avgCharsPerWord <= 4.8) {
      return {
        score: 90,
        label: 'روان',
        level: 'آسان',
        color: 'text-brand-600 dark:text-brand-400',
        badgeBg: 'bg-brand-500/10 text-brand-700 dark:text-brand-300 border-brand-500/20'
      };
    } else if (avgWordsPerSentence <= 20) {
      return {
        score: 70,
        label: 'عمومی',
        level: 'متوسط',
        color: 'text-brand-600 dark:text-brand-400',
        badgeBg: 'bg-brand-500/10 text-brand-700 dark:text-brand-300 border-brand-500/20'
      };
    } else {
      return {
        score: 45,
        label: 'تخصصی',
        level: 'دشوار',
        color: 'text-rose-600 dark:text-rose-400',
        badgeBg: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20'
      };
    }
  };

  const readability = calculateReadability(outputStats.words ? outputStats : inputStats);

  // Compact data for visual comparison
  const chartData = [
    {
      name: 'کلمات',
      'ورودی': Math.round(inputStats.words / 10),
      'خروجی': Math.round(outputStats.words / 10),
    },
    {
      name: 'جملات',
      'ورودی': inputStats.sentences,
      'خروجی': outputStats.sentences,
    },
    {
      name: 'پاراگراف',
      'ورودی': inputStats.paragraphs,
      'خروجی': outputStats.paragraphs,
    }
  ];

  return (
    <div className="card-bg border main-border card-radius theme-shadow overflow-hidden transition-all shrink-0" id="stats-chart-widget-container">
      
      {/* Widget Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 px-3 sub-bg flex items-center justify-between cursor-pointer select-none hover-bg transition-colors"
        id="stats-chart-widget-header"
      >
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 accent-text animate-pulse" />
          <h3 className="text-xs font-bold title-weight main-text">
            تحلیل متن و شاخص خوانایی فارسی
          </h3>
          <span className={`text-[10px] px-2 h-5 flex items-center justify-center badge-radius border font-semibold ${readability.badgeBg}`}>
            خوانایی: {readability.level}
          </span>
        </div>

        <button className="p-1 btn-radius muted-text hover:text-main" id="stats-chart-widget-toggle">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Widget Body - Horizontally scrollable row containing ALL comprehensive stats */}
      {isOpen && (
        <div className="p-2 px-3 border-t sub-border flex flex-nowrap overflow-x-auto whitespace-nowrap scrollbar-none items-center justify-between gap-3 md:gap-4 text-xs" id="stats-chart-widget-body">
          
          {/* Item 1: Readability Text */}
          <div className="flex items-center gap-1.5 shrink-0">
            <BookOpen className="w-3.5 h-3.5 accent-text shrink-0" />
            <span className="text-[11px] muted-text">
              خوانش: <strong className={`font-bold ${readability.color}`}>{readability.level}</strong> <span className="opacity-75">({readability.label})</span>
            </span>
          </div>

          <div className="h-3.5 w-[1px] bg-slate-200 dark:bg-slate-800 shrink-0" />

          {/* Item 2: Words Metric */}
          <div className="flex items-center gap-1.5 shrink-0">
            <FileText className="w-3.5 h-3.5 muted-text shrink-0" />
            <span className="text-[11px] main-text">
              کلمات: <strong className="font-extrabold">{outputStats.words}</strong>
            </span>
          </div>

          <div className="h-3.5 w-[1px] bg-slate-200 dark:bg-slate-800 shrink-0" />

          {/* Item 3: Sentences Metric */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[11px] main-text">
              جملات: <strong className="font-extrabold main-text">{outputStats.sentences}</strong>
            </span>
          </div>

          <div className="h-3.5 w-[1px] bg-slate-200 dark:bg-slate-800 shrink-0" />

          {/* Item 4: Paragraphs Metric */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[11px] main-text">
              پاراگراف‌ها: <strong className="font-extrabold main-text">{outputStats.paragraphs}</strong>
            </span>
          </div>

          <div className="h-3.5 w-[1px] bg-slate-200 dark:bg-slate-800 shrink-0" />

          {/* Item 5: Reading Time Metric */}
          <div className="flex items-center gap-1.5 shrink-0">
            <Clock className="w-3.5 h-3.5 accent-text shrink-0" />
            <span className="text-[11px] main-text">
              زمان مطالعه: <strong className="font-extrabold accent-text">{outputStats.readingTimeMinutes}</strong> دقیقه
            </span>
          </div>

          <div className="h-3.5 w-[1px] bg-slate-200 dark:bg-slate-800 shrink-0" />

          {/* Item 6: Changes Metric */}
          <div className="flex items-center gap-1.5 shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span className="text-[11px] main-text">
              تغییرات: <strong className="font-extrabold text-rose-600 dark:text-rose-400">{diffStats.changedPercent}%</strong>
            </span>
          </div>

          <div className="h-3.5 w-[1px] bg-slate-200 dark:bg-slate-800 shrink-0" />

          {/* Item 7: Compact Bar Chart on the far left */}
          <div className="w-16 h-6 shrink-0 opacity-80 hover:opacity-100 transition-opacity" id="stats-chart-visual">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                barGap={1}
              >
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(26, 28, 34, 0.95)',
                    borderColor: '#4A4E5D',
                    borderRadius: '4px',
                    color: '#F5F6FA',
                    fontSize: '9px',
                    direction: 'rtl',
                    padding: '2px 6px'
                  }}
                />
                <Bar dataKey="ورودی" fill="#9AA1B1" radius={[1, 1, 0, 0]} />
                <Bar dataKey="خروجی" fill="#1D2EA0" radius={[1, 1, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>
      )}

    </div>
  );
};
