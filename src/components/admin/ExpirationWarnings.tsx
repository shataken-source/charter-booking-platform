import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock } from 'lucide-react';

const expiringItems = [
  { id: 1, type: 'Featured Ad', business: 'Reel Time Charters', expiresIn: 3, price: 299 },
  { id: 2, type: 'Premium Listing', business: 'Gulf Adventures', expiresIn: 7, price: 149 },
  { id: 3, type: 'Sponsored Post', business: 'Deep Sea Pro', expiresIn: 14, price: 99 }
];

export default function ExpirationWarnings() {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-orange-500" />
        <h3 className="text-lg font-bold">Expiring Promotions</h3>
      </div>
      
      <div className="space-y-3">
        {expiringItems.map(item => (
          <div key={item.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
            <div>
              <div className="font-semibold">{item.business}</div>
              <div className="text-sm text-gray-600">{item.type}</div>
            </div>
            <div className="text-right">
              <Badge variant={item.expiresIn <= 7 ? 'destructive' : 'secondary'}>
                {item.expiresIn} days left
              </Badge>
              <div className="text-sm text-gray-600 mt-1">${item.price}</div>
            </div>
          </div>
        ))}
      </div>
      
      <Button className="w-full mt-4">Send Renewal Reminders</Button>
    </Card>
  );
}
