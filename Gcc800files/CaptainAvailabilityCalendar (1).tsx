import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface CaptainAvailabilityCalendarProps {
  captainId: string;
}

export default function CaptainAvailabilityCalendar({ captainId }: CaptainAvailabilityCalendarProps) {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const [unavailableDates, setUnavailableDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAvailability();
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
      const { error } = await supabase.functions.invoke('availability-manager', {
        body: { action: 'set', captainId, dates, status: 'unavailable' }
      });

      if (error) throw error;
      toast.success(`Marked ${dates.length} date(s) as unavailable`);
      setSelectedDates([]);
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
      const { error } = await supabase.functions.invoke('availability-manager', {
        body: { action: 'set', captainId, dates, status: 'available' }
      });

      if (error) throw error;
      toast.success(`Marked ${dates.length} date(s) as available`);
      setSelectedDates([]);
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
        <CardTitle>Manage Your Availability</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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

        <div className="flex gap-2">
          <Button onClick={markUnavailable} disabled={loading || selectedDates.length === 0}>
            Mark Unavailable
          </Button>
          <Button onClick={markAvailable} variant="outline" disabled={loading || selectedDates.length === 0}>
            Mark Available
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">
          <p>• Red dates are already booked (cannot be changed)</p>
          <p>• Select multiple dates and mark as available/unavailable</p>
          <p>• Customers will only see available dates when booking</p>
        </div>
      </CardContent>
    </Card>
  );
}
