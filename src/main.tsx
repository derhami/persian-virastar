import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Global error shield to prevent third-party browser extension errors or polyfills
// from crashing the application inside sandboxed iframe previews.
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    const msg = event.message || '';
    const url = event.filename || '';
    if (
      url.startsWith('chrome-extension:') ||
      msg.includes('browser_polyfill') ||
      msg.includes('getManifest') ||
      msg.includes('Cannot set property fetch')
    ) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    if (reason && typeof reason === 'object') {
      const msg = (reason as any).message || '';
      const stack = (reason as any).stack || '';
      if (
        msg.includes('browser_polyfill') ||
        msg.includes('getManifest') ||
        msg.includes('Cannot set property fetch') ||
        stack.includes('chrome-extension:')
      ) {
        event.preventDefault();
        event.stopPropagation();
      }
    }
  }, true);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

