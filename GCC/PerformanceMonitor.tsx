import { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Activity, Zap } from 'lucide-react';

interface PerformanceMetrics {
  FCP?: number;
  LCP?: number;
  FID?: number;
  CLS?: number;
  TTFB?: number;
}

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development
    if (import.meta.env.DEV) {
      setIsVisible(true);
      
      // Listen for performance entries
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'paint') {
            setMetrics(prev => ({
              ...prev,
              FCP: entry.startTime,
            }));
          }
        }
      });
      
      observer.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });
      
      return () => observer.disconnect();
    }
  }, []);

  if (!isVisible) return null;

  const getRating = (value: number, thresholds: [number, number]) => {
    if (value <= thresholds[0]) return 'good';
    if (value <= thresholds[1]) return 'needs-improvement';
    return 'poor';
  };

  return (
    <Card className="fixed bottom-4 right-4 p-4 w-64 z-50 bg-background/95 backdrop-blur">
      <div className="flex items-center gap-2 mb-3">
        <Activity className="w-4 h-4" />
        <h3 className="font-semibold text-sm">Performance</h3>
      </div>
      <div className="space-y-2 text-xs">
        {Object.entries(metrics).map(([key, value]) => (
          <div key={key} className="flex justify-between items-center">
            <span>{key}</span>
            <Badge variant="outline">{Math.round(value)}ms</Badge>
          </div>
        ))}
      </div>
    </Card>
  );
}
