import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SEO } from '@/components/SEO';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, DollarSign, Users, CheckCircle, Clock, Mail, Star, Shield } from 'lucide-react';
import { ReviewModeration } from './ReviewModeration';
import { supabase } from '@/lib/supabase';
import SMSVerificationModal from './SMSVerificationModal';
import CaptainEarnings from './CaptainEarnings';
import CaptainAvailabilityCalendar from './CaptainAvailabilityCalendar';
import InsuranceVerification from './InsuranceVerification';
import { CertificationManager } from './CertificationManager';
import { FleetManagement } from './FleetManagement';
import CaptainAlertPreferences from './CaptainAlertPreferences';
import AlertHistoryPanel from './AlertHistoryPanel';







interface Booking {
  id: string;
  charterName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  bookingDate: string;
  bookingTime: string;
  guests: number;
  totalPrice: number;
  status: string;
  notes: string;
  reminderSent: boolean;
}

export default function CaptainDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const captainId = 'captain1'; // In production, get from auth context

  useEffect(() => {
    loadBookings();
    loadAnalytics();
  }, [statusFilter, startDate, endDate]);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const { data } = await supabase.functions.invoke('captain-bookings', {
        body: {
          action: 'getBookings',
          captainId,
          data: { status: statusFilter, startDate, endDate }
        }
      });
      setBookings(data.bookings || []);
    } catch (error) {
      console.error('Error loading bookings:', error);
    }
    setLoading(false);
  };

  const loadAnalytics = async () => {
    try {
      const { data } = await supabase.functions.invoke('captain-bookings', {
        body: { action: 'getAnalytics', captainId }
      });
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  const updateStatus = async (bookingId: string, status: string) => {
    await supabase.functions.invoke('captain-bookings', {
      body: { action: 'updateStatus', bookingId, data: { status } }
    });
    loadBookings();
    loadAnalytics();
  };

  const saveNotes = async () => {
    if (!selectedBooking) return;
    await supabase.functions.invoke('captain-bookings', {
      body: { action: 'addNotes', bookingId: selectedBooking.id, data: { notes } }
    });
    setSelectedBooking(null);
    loadBookings();
  };

  const sendReminder = async (bookingId: string) => {
    await supabase.functions.invoke('captain-bookings', {
      body: { action: 'triggerReminder', bookingId }
    });
    alert('Reminder sent successfully!');
    loadBookings();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
      <SEO
        title="Captain Dashboard - Gulf Charter Finder"
        description="Manage your charter bookings, view analytics, and communicate with customers on Gulf Charter Finder."
        type="article"
      />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">Captain Dashboard</h1>


        {analytics && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <Card className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600 truncate">Total Revenue</p>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold truncate">${analytics.totalRevenue}</p>
                </div>
              </div>
            </Card>
            <Card className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600 truncate">Total Bookings</p>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold">{analytics.totalBookings}</p>
                </div>
              </div>
            </Card>
            <Card className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600 truncate">Completed</p>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold">{analytics.completedBookings}</p>
                </div>
              </div>
            </Card>
            <Card className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600 truncate">Upcoming</p>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold">{analytics.upcomingBookings}</p>
                </div>
              </div>
            </Card>
          </div>
        )}



        <Tabs defaultValue="bookings" className="w-full">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="fleet">Fleet</TabsTrigger>
            <TabsTrigger value="certifications">Certs</TabsTrigger>
            <TabsTrigger value="availability">Calendar</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="insurance">Insurance</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
          </TabsList>






          
          <TabsContent value="bookings" className="space-y-3 sm:space-y-4">
            <Card className="p-3 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  placeholder="Start Date"
                  className="text-sm"
                />
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  placeholder="End Date"
                  className="text-sm"
                />
                <Button onClick={loadBookings} className="text-sm">Apply Filters</Button>
              </div>
            </Card>


            <div className="space-y-3 sm:space-y-4">
              {bookings.map((booking) => (
                <Card key={booking.id} className="p-3 sm:p-4 md:p-6">
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <h3 className="text-base sm:text-lg md:text-xl font-bold truncate">{booking.charterName}</h3>
                        <Badge variant={booking.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                          {booking.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                        <div className="min-w-0">
                          <p className="text-gray-600 font-medium mb-1">Customer</p>
                          <p className="font-semibold truncate">{booking.customerName}</p>
                          <p className="text-gray-500 truncate">{booking.customerEmail}</p>
                          <p className="text-gray-500 truncate">{booking.customerPhone}</p>
                        </div>
                        <div className="min-w-0">
                          <p className="text-gray-600 font-medium mb-1">Booking Details</p>
                          <p className="font-semibold break-words">{booking.bookingDate} at {booking.bookingTime}</p>
                          <p className="text-gray-500">{booking.guests} guests</p>
                          <p className="font-bold text-green-600 text-sm sm:text-base">${booking.totalPrice}</p>
                        </div>
                      </div>
                      {booking.notes && (
                        <div className="mt-3 p-2 sm:p-3 bg-gray-50 rounded">
                          <p className="text-xs sm:text-sm text-gray-600 font-medium">Notes:</p>
                          <p className="text-xs sm:text-sm break-words">{booking.notes}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-row lg:flex-col gap-2 flex-wrap lg:flex-nowrap">
                      <Button size="sm" variant="outline" onClick={() => { setSelectedBooking(booking); setNotes(booking.notes); }} className="text-xs flex-1 lg:flex-none whitespace-nowrap">
                        Add Notes
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => sendReminder(booking.id)} disabled={booking.reminderSent} className="text-xs flex-1 lg:flex-none">
                        <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        <span className="truncate">{booking.reminderSent ? 'Sent' : 'Reminder'}</span>
                      </Button>
                      {booking.status === 'confirmed' && (
                        <Button size="sm" onClick={() => updateStatus(booking.id, 'completed')} className="text-xs flex-1 lg:flex-none whitespace-nowrap">Complete</Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

          </TabsContent>

          <TabsContent value="certifications">
            <CertificationManager captainId={captainId} />
          </TabsContent>

          <TabsContent value="availability">
            <CaptainAvailabilityCalendar captainId={captainId} />
          </TabsContent>

          
          <TabsContent value="earnings">
            <CaptainEarnings captainId={captainId} />
          </TabsContent>
          
          <TabsContent value="reviews">
            <ReviewModeration captainId={captainId} />
          </TabsContent>

          <TabsContent value="insurance">
            <InsuranceVerification captainId={captainId} />
          </TabsContent>


          <TabsContent value="alerts" className="space-y-6">
            <CaptainAlertPreferences />
            <AlertHistoryPanel />
          </TabsContent>

          <TabsContent value="fleet">
            <FleetManagement captainId={captainId} />
          </TabsContent>



        </Tabs>


      </div>

      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Notes</DialogTitle>
          </DialogHeader>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter notes about this charter..."
            rows={5}
          />
          <Button onClick={saveNotes}>Save Notes</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}