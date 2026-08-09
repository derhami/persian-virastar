import React from 'react';
import { Heart, Globe, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
      <div className="py-2 px-3 md:px-4 text-center border-t main-border sub-bg text-[10px] md:text-[11px] muted-text shrink-0 flex flex-row flex-nowrap items-center justify-between gap-x-2 max-w-[1600px] w-full mx-auto">
        <div className="flex items-center gap-1 shrink-0">
          <span>توسعه:</span>
          <a
            href="https://derhami.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold accent-text hover:underline transition-all"
          >
            حمیدرضا درهمی
          </a>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="https://nounproject.ir"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 muted-text hover:accent-text transition-colors"
          >
            <Globe className="w-3 h-3" />
            <span>لابراتوار پروژه‌های درهمی</span>
          </a>
          <span>© {new Date().getFullYear()} ویراستار فارسی</span>
        </div>
      </div>
  );
};
