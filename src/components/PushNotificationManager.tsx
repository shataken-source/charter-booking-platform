import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Bell, BellOff, Settings, Check, AlertCircle } from 'lucide-react';
import { subscribeToPushNotifications } from '@/utils/pushNotifications';
import { useToast } from '@/hooks/use-toast';

export default function PushNotificationManager() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
      checkSubscription();
    }
  }, []);

  const checkSubscription = async () => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      setIsSubscribed(!!subscription);
    }
  };

  const handleEnableNotifications = async () => {
    setLoading(true);
    try {
      const perm = await Notification.requestPermission();
      setPermission(perm);

      if (perm === 'granted') {
        const subscription = await subscribeToPushNotifications();
        setIsSubscribed(!!subscription);
        toast({
          title: 'Notifications Enabled!',
          description: 'You will receive booking updates and weather alerts',
        });
      } else if (perm === 'denied') {
        toast({
          title: 'Notifications Blocked',
          description: 'Please enable notifications in your device settings',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to enable notifications',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const openSettings = () => {
    toast({
      title: 'Open Settings',
      description: 'Go to Settings > Notifications > Gulf Coast Charters to enable',
    });
  };

  if (!('Notification' in window)) return null;

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${
            permission === 'granted' ? 'bg-green-100' : 'bg-gray-100'
          }`}>
            {permission === 'granted' ? (
              <Bell className="w-5 h-5 text-green-600" />
            ) : (
              <BellOff className="w-5 h-5 text-gray-600" />
            )}
          </div>
          <div>
            <h3 className="font-semibold">Push Notifications</h3>
            <p className="text-sm text-gray-600">
              {permission === 'granted' ? 'Enabled' : 'Disabled'}
            </p>
          </div>
        </div>
        {permission === 'granted' && isSubscribed && (
          <Check className="w-5 h-5 text-green-600" />
        )}
      </div>

      {permission === 'default' && (
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            Enable notifications to receive booking updates, weather alerts, and important messages
          </p>
          <Button 
            onClick={handleEnableNotifications} 
            disabled={loading}
            className="w-full"
          >
            <Bell className="w-4 h-4 mr-2" />
            Enable Notifications
          </Button>
        </div>
      )}

      {permission === 'denied' && (
        <div className="space-y-3">
          <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <p className="font-medium mb-1">Notifications are blocked</p>
              <p>To enable, go to your device settings and allow notifications for this app</p>
            </div>
          </div>
          <Button onClick={openSettings} variant="outline" className="w-full">
            <Settings className="w-4 h-4 mr-2" />
            Open Settings Instructions
          </Button>
        </div>
      )}

      {permission === 'granted' && !isSubscribed && (
        <Button onClick={handleEnableNotifications} disabled={loading} className="w-full">
          Subscribe to Updates
        </Button>
      )}
    </Card>
  );
}
