import React, { useState, useMemo } from 'react';
import { Search, RotateCcw, CheckCircle, Sliders, Zap, BookMarked, GraduationCap, Sparkles, Filter, X } from 'lucide-react';
import { VirastarOptions, PresetMode } from '../types';
import { VIRASTAR_OPTIONS_META } from '../lib/virastarEngine';

interface OptionsPanelProps {
  options: VirastarOptions;
  onChangeOptions: (newOpts: VirastarOptions) => void;
  activePreset: PresetMode;
  onSelectPreset: (preset: PresetMode) => void;
  persistSettings: boolean;
  onTogglePersist: (val: boolean) => void;
  onClose?: () => void;
}

const CATEGORIES_MAP = [
  { id: 'all', nameFa: 'همه گزینه‌ها' },
  { id: 'halfSpace', nameFa: 'نیم‌فاصله و پیشوند' },
  { id: 'numbers', nameFa: 'اعداد و ریاضی' },
  { id: 'punctuation', nameFa: 'علائم نگارشی' },
  { id: 'spacing', nameFa: 'فاصله‌گذاری' },
  { id: 'cleanup', nameFa: 'پاکسازی کاراکترها' },
  { id: 'markdown', nameFa: 'کد و مارک‌داون' },
];

export const OptionsPanel: React.FC<OptionsPanelProps> = ({
  options,
  onChangeOptions,
  activePreset,
  onSelectPreset,
  persistSettings,
  onTogglePersist,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<string>('all');

  const enabledCount = useMemo(() => {
    return Object.values(options).filter(Boolean).length;
  }, [options]);

  const filteredMeta = useMemo(() => {
    return VIRASTAR_OPTIONS_META.filter((item) => {
      const matchCategory = activeTab === 'all' || item.category === activeTab;
      if (!matchCategory) return false;

      if (!searchTerm.trim()) return true;

      const query = searchTerm.trim().toLowerCase();
      return (
        item.nameFa.toLowerCase().includes(query) ||
        item.descriptionFa.toLowerCase().includes(query) ||
        item.key.toLowerCase().includes(query)
      );
    });
  }, [searchTerm, activeTab]);

  const handleToggleOption = (key: string) => {
    const updated = { ...options, [key]: !options[key] };
    onChangeOptions(updated);
  };

  return (
    <aside className="sub-bg border main-border card-radius overflow-hidden shadow-xs flex flex-col h-full max-h-[85vh] sm:max-h-[90vh]">
      {/* Header */}
      <div className="p-3.5 border-b main-border card-bg flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 accent-text" />
          <h2 className="text-sm font-bold main-text">تنظیمات و قواعد ویراستاری</h2>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 sub-bg px-2.5 py-1 card-radius border main-border text-xs sub-text">
            <span>فعال:</span>
            <span className="font-bold accent-text">{enabledCount}</span>
            <span className="muted-text">/</span>
            <span className="muted-text">{VIRASTAR_OPTIONS_META.length}</span>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 btn-radius hover-bg muted-text hover:text-main transition-colors"
              title="بستن"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-4 overflow-y-auto flex-1 text-xs">
        
        {/* Presets */}
        <div>
          <label className="block muted-text font-medium mb-2">پروفایل‌های پیشنهادی (Presets):</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            <button
              onClick={() => onSelectPreset('default')}
              className={`flex items-center gap-1.5 p-2 card-radius border text-right transition-all ${
                activePreset === 'default'
                  ? 'accent-light-bg main-border accent-text font-semibold'
                  : 'card-bg main-border main-text hover-bg'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5 shrink-0 accent-text" />
              <span>پیش‌فرض</span>
            </button>

            <button
              onClick={() => onSelectPreset('max')}
              className={`flex items-center gap-1.5 p-2 card-radius border text-right transition-all ${
                activePreset === 'max'
                  ? 'accent-light-bg main-border accent-text font-semibold'
                  : 'card-bg main-border main-text hover-bg'
              }`}
            >
              <Zap className="w-3.5 h-3.5 shrink-0 accent-text" />
              <span>حداکثری</span>
            </button>

            <button
              onClick={() => onSelectPreset('literary')}
              className={`flex items-center gap-1.5 p-2 card-radius border text-right transition-all ${
                activePreset === 'literary'
                  ? 'accent-light-bg main-border accent-text font-semibold'
                  : 'card-bg main-border main-text hover-bg'
              }`}
            >
              <BookMarked className="w-3.5 h-3.5 shrink-0 accent-text" />
              <span>ادبی</span>
            </button>

            <button
              onClick={() => onSelectPreset('academic')}
              className={`flex items-center gap-1.5 p-2 card-radius border text-right transition-all ${
                activePreset === 'academic'
                  ? 'accent-light-bg main-border accent-text font-semibold'
                  : 'card-bg main-border main-text hover-bg'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 shrink-0 accent-text" />
              <span>دانشگاهی</span>
            </button>

            <button
              onClick={() => onSelectPreset('minimal')}
              className={`col-span-2 sm:col-span-1 flex items-center gap-1.5 p-2 card-radius border text-right transition-all ${
                activePreset === 'minimal'
                  ? 'accent-light-bg main-border accent-text font-semibold'
                  : 'card-bg main-border main-text hover-bg'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0 accent-text" />
              <span>مینیمال</span>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 muted-text absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="جستجو بین قوانین (مثال: نیم‌فاصله، اعداد، گیومه...)"
            className="w-full pr-9 pl-8 py-2 card-bg border main-border card-radius main-text placeholder:text-slate-400/60 focus:outline-none focus:border-rose-500 text-xs transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 muted-text hover:text-main"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Categories Tabs */}
        <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES_MAP.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`px-2.5 py-1 card-radius text-[11px] font-medium whitespace-nowrap transition-colors ${
                activeTab === cat.id
                  ? 'accent-bg text-white font-semibold shadow-xs'
                  : 'card-bg hover-bg muted-text border main-border'
              }`}
            >
              {cat.nameFa}
            </button>
          ))}
        </div>

        {/* Options List */}
        <div className="space-y-2 pt-1">
          {filteredMeta.length === 0 ? (
            <div className="text-center py-6 muted-text">
              هیچ قانونی با عبارت جستجو شده پیدا نشد.
            </div>
          ) : (
            filteredMeta.map((item) => {
              const isChecked = !!options[item.key];
              return (
                <div
                  key={item.key}
                  onClick={() => handleToggleOption(item.key)}
                  className={`p-3 card-radius border transition-all cursor-pointer ${
                    isChecked
                      ? 'card-bg border-rose-500/60 shadow-xs'
                      : 'sub-bg border main-border opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="mt-0.5 w-4 h-4 card-radius border main-border accent-bg cursor-pointer"
                    />
                    <div className="flex-1 space-y-0.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold main-text">{item.nameFa}</span>
                        <code className="text-[10px] muted-text sub-bg px-1.5 py-0.5 card-radius border sub-border font-mono dir-ltr">
                          {item.key}
                        </code>
                      </div>
                      <p className="muted-text text-[11px] leading-relaxed">
                        {item.descriptionFa}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Persist Settings & Close Footer */}
        <div className="pt-3 border-t main-border flex flex-wrap items-center justify-between gap-3 text-[11px] muted-text shrink-0">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={persistSettings}
              onChange={(e) => onTogglePersist(e.target.checked)}
              className="w-3.5 h-3.5 card-radius border main-border accent-bg"
            />
            <span>ذخیره خودکار تنظیمات در مرورگر</span>
          </label>

          {onClose && (
            <button
              onClick={onClose}
              className="px-4 h-9 flex items-center justify-center btn-radius accent-bg accent-hover-bg text-white font-bold text-xs shadow-xs transition-all"
            >
              تایید و بازگشت به ویرایشگر
            </button>
          )}
        </div>

      </div>
    </aside>
  );
};
