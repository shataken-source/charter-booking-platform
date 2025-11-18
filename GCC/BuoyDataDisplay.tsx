import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Waves, Thermometer, Wind, Eye, AlertTriangle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface BuoyData {
  buoyId: string;
  buoyInfo: { name: string; location: string; lat: number; lon: number };
  waveHeight: number | null;
  waterTemp: number | null;
  windSpeed: number | null;
  windGust: number | null;
  visibility: number | null;
  timestamp: string;
}

interface BuoyDataDisplayProps {
  buoyId: string;
}

export default function BuoyDataDisplay({ buoyId }: BuoyDataDisplayProps) {
  const [buoyData, setBuoyData] = useState<BuoyData | null>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBuoyData();
    const interval = setInterval(fetchBuoyData, 300000); // Refresh every 5 min
    return () => clearInterval(interval);
  }, [buoyId]);

  const fetchBuoyData = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('noaa-buoy-data', {
        body: { buoyId }
      });

      if (error) throw error;
      if (data.success) {
        setBuoyData(data.data);
        setAlerts(data.alerts || []);
      }
    } catch (err) {
      console.error('Error fetching buoy data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="animate-pulse">Loading buoy data...</div>;
  if (!buoyData) return <div>No buoy data available</div>;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>NOAA Buoy {buoyData.buoyId}</span>
            <Badge variant="outline">{buoyData.buoyInfo.name}</Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground">{buoyData.buoyInfo.location}</p>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <Waves className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-xs text-muted-foreground">Wave Height</p>
              <p className="text-lg font-bold">
                {buoyData.waveHeight ? `${buoyData.waveHeight} ft` : 'N/A'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Thermometer className="h-5 w-5 text-orange-500" />
            <div>
              <p className="text-xs text-muted-foreground">Water Temp</p>
              <p className="text-lg font-bold">
                {buoyData.waterTemp ? `${buoyData.waterTemp}°F` : 'N/A'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Wind className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-xs text-muted-foreground">Wind Speed</p>
              <p className="text-lg font-bold">
                {buoyData.windSpeed ? `${buoyData.windSpeed} kt` : 'N/A'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-purple-500" />
            <div>
              <p className="text-xs text-muted-foreground">Visibility</p>
              <p className="text-lg font-bold">
                {buoyData.visibility ? `${buoyData.visibility} nm` : 'N/A'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {alerts.length > 0 && (
        <Card className="border-orange-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-600">
              <AlertTriangle className="h-5 w-5" />
              Marine Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {alerts.map((alert, idx) => (
              <div key={idx} className="p-3 bg-orange-50 rounded-lg">
                <p className="font-semibold">{alert.event}</p>
                <p className="text-sm text-muted-foreground">{alert.headline}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}