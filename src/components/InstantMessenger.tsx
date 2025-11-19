import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUser } from '@/contexts/UserContext';
import { Send, Anchor } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export default function InstantMessenger() {
  const { user } = useUser();
  const { toast } = useToast();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadMessages = () => {
    const stored = localStorage.getItem('communityChat');
    if (stored) setMessages(JSON.parse(stored));
  };

  const sendMessage = async () => {
    if (!user || !newMessage.trim()) return;
    const all = JSON.parse(localStorage.getItem('communityChat') || '[]');
    all.push({ id: Date.now().toString(), sender: user.name || user.email, content: newMessage, timestamp: Date.now() });
    localStorage.setItem('communityChat', JSON.stringify(all));
    await supabase.functions.invoke('points-rewards-system', { body: { action: 'award_points', userId: user.id, actionType: 'message_post' }});
    toast({ title: '⚓ +10 points!' });
    setNewMessage(''); loadMessages();
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Card className="flex flex-col h-[600px] border-2 border-cyan-200">
      <div className="p-4 border-b bg-gradient-to-r from-blue-500 to-cyan-500 text-white flex items-center gap-2">
        <Anchor className="w-6 h-6" />
        <h2 className="text-xl font-bold">Gulf Coast Chat</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-cyan-50 to-blue-50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.sender === user?.name ? 'flex-row-reverse' : ''}`}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">{msg.sender.charAt(0)}</div>
            <div className={`flex-1 ${msg.sender === user?.name ? 'text-right' : ''}`}>
              <p className="text-sm font-semibold text-blue-900">{msg.sender}</p>
              <div className={`inline-block p-3 rounded-lg ${msg.sender === user?.name ? 'bg-blue-600 text-white' : 'bg-white border-2 border-cyan-200'}`}>{msg.content}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t bg-white">
        <div className="flex gap-2">
          <Input placeholder={user ? "Type a message..." : "Login to chat"} value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendMessage()} disabled={!user} />
          <Button onClick={sendMessage} disabled={!user} className="bg-gradient-to-r from-blue-500 to-cyan-500"><Send className="w-4 h-4" /></Button>
        </div>
      </div>
    </Card>
  );
}
