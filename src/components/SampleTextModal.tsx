import React from 'react';
import { BookOpen, X, ArrowLeft, Check } from 'lucide-react';
import { SAMPLE_TEXTS } from '../data/sampleTexts';
import { SampleText } from '../types';

interface SampleTextModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSample: (sample: SampleText) => void;
}

export const SampleTextModal: React.FC<SampleTextModalProps> = ({
  isOpen,
  onClose,
  onSelectSample,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="sub-bg border main-border card-radius theme-shadow max-w-xl w-full flex flex-col max-h-[85vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 border-b main-border flex items-center justify-between card-bg">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 muted-text" />
            <h3 className="text-sm font-bold title-weight main-text">انتخاب متن نمونه جهت تست ویراستار</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 btn-radius muted-text hover:text-main hover-bg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3 overflow-y-auto flex-1 text-xs">
          {SAMPLE_TEXTS.map((sample) => (
            <div
              key={sample.id}
              onClick={() => {
                onSelectSample(sample);
                onClose();
              }}
              className="p-3.5 card-bg hover-bg border main-border card-radius transition-all cursor-pointer group space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold main-text group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {sample.title}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 badge-radius sub-bg border sub-border muted-text">
                    {sample.category}
                  </span>
                </div>
                <ArrowLeft className="w-4 h-4 muted-text group-hover:text-amber-600 transition-colors" />
              </div>
              <p className="muted-text text-[11px]">{sample.description}</p>
              <div className="p-2 sub-bg card-radius sub-text font-sans text-[11px] line-clamp-2 border sub-border">
                {sample.content}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 border-t main-border card-bg flex justify-end">
          <button
            onClick={onClose}
            className="px-4 h-9 flex items-center justify-center btn-radius sub-bg hover-bg sub-text border main-border font-semibold text-xs transition-colors"
          >
            بستن
          </button>
        </div>

      </div>
    </div>
  );
};
