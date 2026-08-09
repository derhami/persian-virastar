import React from 'react';
import { Heart, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="py-3 px-4 md:px-6 border-t main-border sub-bg text-[11px] shrink-0">
      <div className="max-w-[1600px] w-full mx-auto flex flex-row flex-nowrap items-center justify-between gap-x-4">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="muted-text">توسعه:</span>
          <a
            href="https://derhami.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold accent-text hover:underline transition-all"
          >
            حمیدرضا درهمی
          </a>
        </div>
        
        <div className="flex items-center gap-4">
          <a
            href="https://nounproject.ir"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 muted-text hover:accent-text transition-colors"
          >
            <Globe className="w-3 h-3" />
            <span>لابراتوار پروژه‌های درهمی</span>
          </a>
          <span className="text-divider">|</span>
          <span className="muted-text">
            © {new Date().getFullYear()} ویراستار فارسی
          </span>
        </div>
      </div>
    </footer>
  );
};
