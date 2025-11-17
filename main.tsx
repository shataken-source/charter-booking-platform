import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initSentry } from './lib/sentry';
import { ErrorBoundary } from './components/ErrorBoundary';
import { initPerformanceMonitoring } from './lib/performance';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { FeatureFlagProvider } from './contexts/FeatureFlagContext';

// Initialize Sentry (disabled - no DSN configured)
initSentry();

// Initialize Web Vitals monitoring
initPerformanceMonitoring();

// Register service worker for PWA
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((error) => {
      console.error('Service Worker registration failed:', error);
    });
  });
}

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <FeatureFlagProvider>
        <App />
      </FeatureFlagProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

