import { Eye, Users, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

export function LiveAvailabilityBadge({ charterId }: { charterId: string }) {
  const [viewers, setViewers] = useState(Math.floor(Math.random() * 8) + 3);
  const [spotsLeft] = useState(Math.floor(Math.random() * 5) + 1);

  useEffect(() => {
    const interval = setInterval(() => {
      setViewers(prev => Math.max(1, prev + (Math.random() > 0.5 ? 1 : -1)));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute top-3 left-3 space-y-2">
      <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 animate-pulse">
        <Eye className="w-3 h-3" />
        {viewers} viewing now
      </div>
      {spotsLeft <= 3 && (
        <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
          <Users className="w-3 h-3" />
          Only {spotsLeft} spots left!
        </div>
      )}
    </div>
  );
}

export function RecentBookingTicker() {
  const [currentBooking, setCurrentBooking] = useState(0);
  
  const bookings = [
    { name: 'Sarah M.', location: 'Miami', time: '2 minutes ago' },
    { name: 'John D.', location: 'Caribbean', time: '5 minutes ago' },
    { name: 'Emma L.', location: 'Mediterranean', time: '12 minutes ago' },
    { name: 'Michael R.', location: 'Greek Islands', time: '18 minutes ago' },
    { name: 'Lisa K.', location: 'Bahamas', time: '23 minutes ago' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBooking(prev => (prev + 1) % bookings.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-8">
      <div className="flex items-center gap-3">
        <TrendingUp className="w-5 h-5 text-green-600" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-green-900">
            <span className="font-bold">{bookings[currentBooking].name}</span> just booked a charter in{' '}
            <span className="font-bold">{bookings[currentBooking].location}</span>
          </p>
          <p className="text-xs text-green-700">{bookings[currentBooking].time}</p>
        </div>
      </div>
    </div>
  );
}
