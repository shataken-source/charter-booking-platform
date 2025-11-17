import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface Notification {
  id: string;
  title: string;
  body: string;
  type: string;
  read: boolean;
  created_at: string;
}

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: "1", title: "Booking Confirmed", body: "Your charter booking for July 15 is confirmed", type: "booking", read: false, created_at: new Date().toISOString() },
    { id: "2", title: "Payment Received", body: "Payment of $500 processed successfully", type: "payment", read: false, created_at: new Date().toISOString() },
  ]);
  const [unreadCount, setUnreadCount] = useState(2);
  const [showPanel, setShowPanel] = useState(false);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  return (
    <div className="relative">
      <Button variant="ghost" size="icon" onClick={() => setShowPanel(!showPanel)}>
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </Button>

      {showPanel && (
        <Card className="absolute right-0 top-12 w-80 max-h-96 overflow-y-auto z-50 shadow-xl">
          <div className="p-4">
            <h3 className="font-semibold mb-4">Notifications</h3>
            {notifications.length === 0 ? (
              <p className="text-sm text-gray-500">No notifications</p>
            ) : (
              <div className="space-y-2">
                {notifications.map(notif => (
                  <div
                    key={notif.id}
                    className={`p-3 rounded border cursor-pointer hover:bg-gray-50 ${!notif.read ? "bg-blue-50 border-blue-200" : "border-gray-200"}`}
                    onClick={() => markAsRead(notif.id)}
                  >
                    <p className="font-medium text-sm">{notif.title}</p>
                    <p className="text-xs text-gray-600 mt-1">{notif.body}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
