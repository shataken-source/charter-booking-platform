// Simple performance monitoring without external dependencies
export function initPerformanceMonitoring() {
  if (typeof window === 'undefined') return;
  
  // Use native Performance API
  if ('PerformanceObserver' in window) {
    try {
      // Monitor Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('[Performance] LCP:', Math.round(lastEntry.startTime), 'ms');
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // Monitor First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: any) => {
          console.log('[Performance] FID:', Math.round(entry.processingStart - entry.startTime), 'ms');
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
    } catch (e) {
      console.log('Performance monitoring not supported');
    }
  }
}
