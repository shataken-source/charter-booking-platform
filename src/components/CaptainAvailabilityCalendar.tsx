import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import SeasonalPricingManager from './SeasonalPricingManager';
import GoogleCalendarSync from './GoogleCalendarSync';
import { DollarSign, Calendar as CalendarIcon, Settings } from 'lucide-react';

interface CaptainAvailabilityCalendarProps {
  captainId: string;
}

export default function CaptainAvailabilityCalendar({ captainId }: CaptainAvailabilityCalendarProps) {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const [unavailableDates, setUnavailableDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(false);
  const [customPrice, setCustomPrice] = useState('');
  const [priceMultiplier, setPriceMultiplier] = useState('1.0');

  useEffect(() => {
    loadAvailability();
    
    // Real-time subscription for instant updates
    const channel = supabase
      .channel('captain-availability')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'bookings', filter: `captain_id=eq.${captainId}` },
        () => loadAvailability()
      )
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'captain_availability', filter: `captain_id=eq.${captainId}` },
        () => loadAvailability()
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [captainId]);

  const loadAvailability = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('availability-manager', {
        body: { action: 'get', captainId }
      });

      if (error) throw error;

      const booked = data.bookings
        .filter((b: any) => b.status === 'confirmed')
        .map((b: any) => new Date(b.booking_date));
      
      const unavail = data.availability
        .filter((a: any) => a.status === 'unavailable')
        .map((a: any) => new Date(a.date));

      setBookedDates(booked);
      setUnavailableDates(unavail);
    } catch (error: any) {
      toast.error('Failed to load availability');
    }
  };

  const markUnavailable = async () => {
    if (selectedDates.length === 0) {
      toast.error('Please select dates first');
      return;
    }

    setLoading(true);
    try {
      const dates = selectedDates.map(d => d.toISOString().split('T')[0]);
      
      // Check for conflicts before blocking
      const { data: conflicts } = await supabase.functions.invoke('availability-manager', {
        body: { action: 'check-range', captainId, dates }
      });

      if (conflicts?.bookedDates?.length > 0) {
        toast.error(`Cannot block dates with existing bookings: ${conflicts.bookedDates.join(', ')}`);
        return;
      }

      const pricing = customPrice || priceMultiplier !== '1.0' ? {
        customPrice: customPrice ? parseFloat(customPrice) : null,
        multiplier: parseFloat(priceMultiplier)
      } : null;

      const { error } = await supabase.functions.invoke('availability-manager', {
        body: { action: 'set', captainId, dates, status: 'unavailable', pricing }
      });

      if (error) throw error;
      toast.success(`Marked ${dates.length} date(s) as unavailable`);
      setSelectedDates([]);
      setCustomPrice('');
      setPriceMultiplier('1.0');
      loadAvailability();
    } catch (error: any) {
      toast.error('Failed to update availability');
    } finally {
      setLoading(false);
    }
  };

  const markAvailable = async () => {
    if (selectedDates.length === 0) {
      toast.error('Please select dates first');
      return;
    }

    setLoading(true);
    try {
      const dates = selectedDates.map(d => d.toISOString().split('T')[0]);
      
      const pricing = customPrice || priceMultiplier !== '1.0' ? {
        customPrice: customPrice ? parseFloat(customPrice) : null,
        multiplier: parseFloat(priceMultiplier)
      } : null;

      const { error } = await supabase.functions.invoke('availability-manager', {
        body: { action: 'set', captainId, dates, status: 'available', pricing }
      });

      if (error) throw error;
      toast.success(`Marked ${dates.length} date(s) as available`);
      setSelectedDates([]);
      setCustomPrice('');
      setPriceMultiplier('1.0');
      loadAvailability();
    } catch (error: any) {
      toast.error('Failed to update availability');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Availability & Pricing Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="calendar" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="calendar">
              <CalendarIcon className="h-4 w-4 mr-2" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="pricing">
              <DollarSign className="h-4 w-4 mr-2" />
              Pricing
            </TabsTrigger>
            <TabsTrigger value="sync">
              <Settings className="h-4 w-4 mr-2" />
              Sync
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="space-y-4">
            <div className="flex gap-4 flex-wrap">
              <Badge variant="destructive">Booked: {bookedDates.length}</Badge>
              <Badge variant="secondary">Unavailable: {unavailableDates.length}</Badge>
              <Badge>Selected: {selectedDates.length}</Badge>
            </div>

            <Calendar
              mode="multiple"
              selected={selectedDates}
              onSelect={(dates) => setSelectedDates(dates || [])}
              className="rounded-md border"
              disabled={(date) => bookedDates.some(d => d.toDateString() === date.toDateString())}
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Custom Price (optional)</Label>
                <Input
                  type="number"
                  placeholder="e.g., 599"
                  value={customPrice}
                  onChange={(e) => setCustomPrice(e.target.value)}
                />
              </div>
              <div>
                <Label>Price Multiplier</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={priceMultiplier}
                  onChange={(e) => setPriceMultiplier(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={markAvailable} disabled={loading || selectedDates.length === 0}>
                Mark Available
              </Button>
              <Button onClick={markUnavailable} variant="outline" disabled={loading || selectedDates.length === 0}>
                Block Dates
              </Button>
            </div>

            <div className="text-sm text-muted-foreground space-y-1">
              <p>• Red dates have confirmed bookings (cannot be changed)</p>
              <p>• Select dates and set custom pricing or multipliers</p>
              <p>• Changes sync instantly with customer booking system</p>
              <p>• Conflict prevention ensures no double bookings</p>
            </div>
          </TabsContent>

          <TabsContent value="pricing">
            <SeasonalPricingManager captainId={captainId} />
          </TabsContent>

          <TabsContent value="sync">
            <GoogleCalendarSync captainId={captainId} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

