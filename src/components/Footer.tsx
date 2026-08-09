import React from 'react';
import { Heart, Globe, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t main-border bg-stone-100/60 dark:bg-stone-900/40 text-stone-600 dark:text-stone-400 text-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p className="flex items-center gap-1.5 flex-wrap justify-center sm:justify-start">
            <span>توسعه داده شده با</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>برای جامعه طراحان وب ایران توسط</span>
            <a
              href="https://derhami.com"
              target="_blank"
              rel="noopener noreferrer"
              title="وب‌سایت شخصی حمیدرضا درهمی"
              className="font-bold text-stone-900 dark:text-stone-100 hover:text-brand-600 dark:hover:text-brand-400 transition-colors no-underline"
            >
              حمیدرضا درهمی
            </a>
          </p>
          <div className="flex items-center gap-3">
            <a
              href="https://nounproject.ir"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-stone-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Noun Project</span>
            </a>
            <span className="font-sans font-medium text-stone-600 dark:text-stone-400">
              © 2026 Persian Virastar
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
