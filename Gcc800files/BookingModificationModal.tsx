import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { Calendar, Users, Edit } from 'lucide-react';
import { toast } from 'sonner';

interface BookingModificationModalProps {
  booking: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function BookingModificationModal({ booking, open, onOpenChange, onSuccess }: BookingModificationModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    newDate: booking?.booking_date || '',
    newGuests: booking?.guest_count || 1,
    reason: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('booking-modification-system', {
        body: {
          action: 'request-modification',
          bookingId: booking.id,
          modifications: {
            newDate: formData.newDate,
            newGuests: formData.newGuests
          },
          reason: formData.reason
        }
      });
      if (error) throw error;
      toast.success('Modification request sent to captain');
      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit modification request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="w-5 h-5" />
            Modify Booking
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              New Date
            </Label>
            <Input
              type="date"
              value={formData.newDate}
              onChange={(e) => setFormData({...formData, newDate: e.target.value})}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
          <div>
            <Label className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Number of Guests
            </Label>
            <Input
              type="number"
              min="1"
              value={formData.newGuests}
              onChange={(e) => setFormData({...formData, newGuests: parseInt(e.target.value)})}
              required
            />
          </div>
          <div>
            <Label>Reason for Change</Label>
            <Textarea
              value={formData.reason}
              onChange={(e) => setFormData({...formData, reason: e.target.value})}
              placeholder="Please explain why you need to modify this booking..."
              rows={3}
              required
            />
          </div>
          <div className="bg-blue-50 p-3 rounded-lg text-sm">
            <p className="text-blue-800">Your modification request will be sent to the captain for approval. You'll be notified once they respond.</p>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Submitting...' : 'Request Modification'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}