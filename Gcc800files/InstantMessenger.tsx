import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUser } from '@/contexts/UserContext';
import { Send, MessageSquare } from 'lucide-react';

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  message: string;
  timestamp: string;
}

export default function InstantMessenger() {
  const { user } = useUser();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = () => {
    const stored = localStorage.getItem('communityChat');
    if (stored) {
      setMessages(JSON.parse(stored));
    }
  };

  const sendMessage = () => {
    if (!user || !newMessage.trim()) return;

    const stored = localStorage.getItem('communityChat');
    const allMessages = stored ? JSON.parse(stored) : [];
    
    const msg: ChatMessage = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar || 'avatar1',
      message: newMessage,
      timestamp: new Date().toISOString()
    };

    allMessages.push(msg);
    localStorage.setItem('communityChat', JSON.stringify(allMessages));
    
    setNewMessage('');
    loadMessages();
  };

  return (
    <Card className="flex flex-col h-[600px]">
      <div className="p-4 border-b flex items-center gap-3">
        <MessageSquare className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-bold">Community Chat</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.userId === user?.id ? 'flex-row-reverse' : ''}`}>
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold flex-shrink-0">
              {msg.userName.charAt(0)}
            </div>
            <div className={`flex-1 ${msg.userId === user?.id ? 'text-right' : ''}`}>
              <p className="text-sm font-semibold">{msg.userName}</p>
              <div className={`inline-block p-3 rounded-lg ${
                msg.userId === user?.id ? 'bg-blue-600 text-white' : 'bg-gray-100'
              }`}>
                {msg.message}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            placeholder={user ? "Type a message..." : "Login to chat"}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            disabled={!user}
          />
          <Button onClick={sendMessage} disabled={!user}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
