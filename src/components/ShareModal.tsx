import React, { useState } from 'react';
import { Share2, Copy, Lock, Check, X, Shield, Clock, ExternalLink } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  outputText: string;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  outputText,
  onShowToast,
}) => {
  const [usePassword, setUsePassword] = useState(false);
  const [password, setPassword] = useState('');
  const [expiryHours, setExpiryHours] = useState<number>(24);
  const [generatedUrl, setGeneratedUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleGenerateLink = () => {
    if (!outputText.trim()) {
      onShowToast('متنی برای اشتراک‌گذاری وجود ندارد.', 'error');
      return;
    }

    try {
      const payload = {
        text: outputText,
        createdAt: Date.now(),
        expiry: expiryHours > 0 ? Date.now() + expiryHours * 3600 * 1000 : null,
        protected: usePassword && password.trim().length > 0,
        passHash: usePassword && password.trim() ? btoa(password.trim()) : null,
      };

      const jsonStr = JSON.stringify(payload);
      // UTF-8 base64 encoding
      const encoded = btoa(encodeURIComponent(jsonStr));

      const baseUrl = window.location.origin + window.location.pathname;
      const fullShareUrl = `${baseUrl}#share=${encoded}`;

      setGeneratedUrl(fullShareUrl);
      onShowToast('لینک اختصاصی اشتراک‌گذاری ایجاد شد.');
    } catch (e) {
      onShowToast('خطا در ساخت لینک اشتراک‌گذاری.', 'error');
    }
  };

  const handleCopyLink = async () => {
    if (!generatedUrl) return;
    try {
      await navigator.clipboard.writeText(generatedUrl);
      setCopied(true);
      onShowToast('لینک اشتراک‌گذاری کپی شد!');
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      onShowToast('خطا در کپی لینک.', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="sub-bg border main-border card-radius max-w-lg w-full theme-shadow overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 border-b main-border flex items-center justify-between card-bg">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 accent-text" />
            <h3 className="text-sm font-bold title-weight main-text">اشتراک‌گذاری موقت خروجی متن</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 btn-radius muted-text hover:text-main hover-bg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 text-xs">
          <p className="muted-text leading-relaxed">
            با ایجاد لینک موقت می‌توانید خروجی ویراستاری‌شده را مستقیماً برای همکاران یا مخاطبان ارسال کنید.
          </p>

          {/* Settings */}
          <div className="space-y-3 card-bg p-3.5 card-radius border main-border">
            
            {/* Expiry selector */}
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 font-semibold main-text">
                <Clock className="w-4 h-4 muted-text" />
                مدت اعتبار لینک:
              </span>
              <select
                value={expiryHours}
                onChange={(e) => setExpiryHours(Number(e.target.value))}
                className="sub-bg border main-border main-text px-2.5 py-1 btn-radius focus:outline-none"
              >
                <option value={24}>۲۴ ساعت</option>
                <option value={72}>۳ روز</option>
                <option value={168}>۷ روز</option>
                <option value={0}>بدون انقضا</option>
              </select>
            </div>

            {/* Password protection toggle */}
            <div className="space-y-2 pt-2 border-t sub-border">
              <label className="flex items-center justify-between cursor-pointer select-none">
                <span className="flex items-center gap-1.5 font-semibold main-text">
                  <Lock className="w-4 h-4 accent-text" />
                  حفاظت با رمز عبور:
                </span>
                <input
                  type="checkbox"
                  checked={usePassword}
                  onChange={(e) => setUsePassword(e.target.checked)}
                  className="w-4 h-4 badge-radius border main-border accent-bg cursor-pointer"
                />
              </label>

              {usePassword && (
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="رمز عبور دلخواه را وارد کنید..."
                  className="w-full p-2 sub-bg border main-border card-radius main-text focus:outline-none"
                />
              )}
            </div>

          </div>

          {/* Generate Action */}
          <button
            onClick={handleGenerateLink}
            className="w-full h-9 card-radius font-bold accent-bg text-white transition-all shadow-xs flex items-center justify-center gap-2"
          >
            <Shield className="w-4 h-4" />
            <span>ایجاد لینک اشتراک‌گذاری</span>
          </button>

          {/* Generated Result */}
          {generatedUrl && (
            <div className="p-3 sub-bg card-radius border main-border space-y-2">
              <span className="font-semibold main-text">لینک آماده ارسال:</span>
              <div className="flex items-center gap-2 dir-ltr">
                <input
                  type="text"
                  readOnly
                  value={generatedUrl}
                  className="flex-1 p-2 card-bg border main-border btn-radius text-xs font-mono sub-text overflow-x-auto focus:outline-none"
                />
                <button
                  onClick={handleCopyLink}
                  className="p-2 btn-radius accent-bg text-white font-bold shrink-0 transition-colors flex items-center gap-1"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3 border-t main-border card-bg flex justify-end">
          <button
            onClick={onClose}
            className="px-4 h-9 flex items-center justify-center btn-radius sub-bg sub-text hover-bg border main-border text-xs font-semibold transition-colors"
          >
            بستن
          </button>
        </div>

      </div>
    </div>
  );
};
