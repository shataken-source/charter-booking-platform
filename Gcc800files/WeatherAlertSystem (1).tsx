import { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, CloudRain, Wind, Waves } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

interface WeatherAlert {
  type: 'wind' | 'rain' | 'wave' | 'general';
  severity: 'warning' | 'danger';
  title: string;
  message: string;
}

interface WeatherAlertSystemProps {
  latitude: number;
  longitude: number;
  onAlert?: (alert: WeatherAlert) => void;
}

export default function WeatherAlertSystem({ latitude, longitude, onAlert }: WeatherAlertSystemProps) {
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);

  useEffect(() => {
    checkWeatherConditions();
    const interval = setInterval(checkWeatherConditions, 300000); // Check every 5 minutes
    return () => clearInterval(interval);
  }, [latitude, longitude]);

  const checkWeatherConditions = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('weather-api', {
        body: { latitude, longitude }
      });

      if (error) throw error;

      const newAlerts: WeatherAlert[] = [];

      // Check wind conditions
      if (data.current.windSpeed > 25) {
        const alert: WeatherAlert = {
          type: 'wind',
          severity: 'danger',
          title: 'Dangerous Wind Conditions',
          message: `Wind speed ${data.current.windSpeed} mph with gusts up to ${data.current.windGust} mph. Charter operations should be suspended.`
        };
        newAlerts.push(alert);
        notifyCaptainsAndCustomers(alert);
      } else if (data.current.windSpeed > 15) {
        newAlerts.push({
          type: 'wind',
          severity: 'warning',
          title: 'High Wind Advisory',
          message: `Wind speed ${data.current.windSpeed} mph. Exercise caution during charter operations.`
        });
      }

      // Check visibility
      if (data.current.visibility < 2) {
        const alert: WeatherAlert = {
          type: 'general',
          severity: 'danger',
          title: 'Low Visibility Warning',
          message: `Visibility reduced to ${data.current.visibility} miles. Navigation hazardous.`
        };
        newAlerts.push(alert);
        notifyCaptainsAndCustomers(alert);
      }

      setAlerts(newAlerts);
      
      if (newAlerts.length > 0 && onAlert) {
        onAlert(newAlerts[0]);
      }
    } catch (err) {
      console.error('Weather alert check failed:', err);
    }
  };

  const notifyCaptainsAndCustomers = async (alert: WeatherAlert) => {
    toast({
      title: alert.title,
      description: alert.message,
      variant: alert.severity === 'danger' ? 'destructive' : 'default'
    });

    // Send notifications via email/SMS (integrate with booking-notifications function)
    try {
      await supabase.functions.invoke('booking-notifications', {
        body: {
          type: 'weather_alert',
          alert: alert
        }
      });
    } catch (err) {
      console.error('Failed to send weather notifications:', err);
    }
  };

  if (alerts.length === 0) return null;

  return (
    <div className="space-y-3">
      {alerts.map((alert, idx) => (
        <Alert key={idx} variant={alert.severity === 'danger' ? 'destructive' : 'default'}>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>{alert.title}</AlertTitle>
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      ))}
    </div>
  );
}
