import { Card } from '@/components/ui/card';
import { Waves, TrendingUp, TrendingDown } from 'lucide-react';

interface TideData {
  time: string;
  height: number;
  type: 'high' | 'low';
}

interface TideChartProps {
  location: string;
}

// Mock tide data - in production, integrate with NOAA Tides API
const generateTideData = (): TideData[] => {
  const now = new Date();
  const tides: TideData[] = [];
  
  for (let i = 0; i < 4; i++) {
    const highTime = new Date(now);
    highTime.setHours(6 + (i * 12), 15, 0);
    
    const lowTime = new Date(now);
    lowTime.setHours(0 + (i * 12), 30, 0);
    
    if (highTime.getDate() === now.getDate() || highTime.getDate() === now.getDate() + 1) {
      tides.push({
        time: highTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        height: 3.2 + Math.random() * 1.5,
        type: 'high'
      });
    }
    
    if (lowTime.getDate() === now.getDate() || lowTime.getDate() === now.getDate() + 1) {
      tides.push({
        time: lowTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        height: 0.3 + Math.random() * 0.5,
        type: 'low'
      });
    }
  }
  
  return tides.sort((a, b) => {
    const timeA = new Date(`1/1/2000 ${a.time}`).getTime();
    const timeB = new Date(`1/1/2000 ${b.time}`).getTime();
    return timeA - timeB;
  }).slice(0, 4);
};

export default function TideChart({ location }: TideChartProps) {
  const tides = generateTideData();
  
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Waves className="w-5 h-5 text-blue-500" />
        <h3 className="text-lg font-semibold">Tide Chart</h3>
      </div>
      
      <div className="space-y-3">
        {tides.map((tide, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              {tide.type === 'high' ? (
                <TrendingUp className="w-5 h-5 text-blue-500" />
              ) : (
                <TrendingDown className="w-5 h-5 text-orange-500" />
              )}
              <div>
                <p className="font-semibold capitalize">{tide.type} Tide</p>
                <p className="text-sm text-muted-foreground">{tide.time}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold">{tide.height.toFixed(1)} ft</p>
            </div>
          </div>
        ))}
      </div>
      
      <p className="text-xs text-muted-foreground mt-4">
        Tide data for {location}. Times shown in local timezone.
      </p>
    </Card>
  );
}
