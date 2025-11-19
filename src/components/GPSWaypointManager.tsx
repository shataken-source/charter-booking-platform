import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Share2, Bell, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

interface Waypoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  notes?: string;
  captainId: string;
  shared: boolean;
}

export function GPSWaypointManager({ captainId }: { captainId: string }) {
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadWaypoints();
    watchLocation();
  }, []);

  const loadWaypoints = async () => {
    const { data } = await supabase.functions.invoke('gps-waypoints', {
      body: { action: 'list', captainId }
    });
    setWaypoints(data?.waypoints || []);
  };

  const saveCurrentLocation = async () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      await supabase.functions.invoke('gps-waypoints', {
        body: { 
          action: 'save', 
          captainId, 
          name, 
          lat: pos.coords.latitude, 
          lng: pos.coords.longitude,
          notes 
        }
      });
      toast.success('Waypoint saved!');
      setName('');
      setNotes('');
      loadWaypoints();
    });
  };

  const shareWaypoint = async (id: string) => {
    await supabase.functions.invoke('gps-waypoints', {
      body: { action: 'share', waypointId: id }
    });
    toast.success('Waypoint shared with other captains!');
  };

  const watchLocation = () => {
    navigator.geolocation.watchPosition((pos) => {
      waypoints.forEach(wp => {
        const distance = calculateDistance(pos.coords.latitude, pos.coords.longitude, wp.lat, wp.lng);
        if (distance < 0.1) {
          toast.info(`Near waypoint: ${wp.name}`);
        }
      });
    });
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold mb-4">GPS Waypoints</h3>
      <div className="space-y-3 mb-4">
        <Input placeholder="Waypoint name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input placeholder="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} />
        <Button onClick={saveCurrentLocation} className="w-full">
          <MapPin className="w-4 h-4 mr-2" />Save Current Location
        </Button>
      </div>
      <div className="space-y-2">
        {waypoints.map(wp => (
          <div key={wp.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
            <div>
              <p className="font-medium">{wp.name}</p>
              <p className="text-xs text-gray-500">{wp.lat.toFixed(4)}, {wp.lng.toFixed(4)}</p>
            </div>
            <Button size="sm" variant="ghost" onClick={() => shareWaypoint(wp.id)}>
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}
