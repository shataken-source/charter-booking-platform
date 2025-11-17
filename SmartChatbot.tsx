import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { MessageCircle, X, Send } from 'lucide-react';
import { Card } from './ui/card';

export default function SmartChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ text: string; sender: 'user' | 'bot' }>>([
    { text: 'Hi! How can I help you today?', sender: 'bot' }
  ]);
  const [input, setInput] = useState('');

  const quickQuestions = [
    'What types of charters do you offer?',
    'How do I book a charter?',
    'What is your cancellation policy?',
    'Do you provide fishing equipment?'
  ];

  const handleQuickQuestion = (question: string) => {
    setMessages(prev => [...prev, { text: question, sender: 'user' }]);
    setTimeout(() => {
      let response = '';
      if (question.includes('types')) response = 'We offer Deep Sea Fishing, Inshore Fishing, Sunset Cruises, and Private Charters!';
      else if (question.includes('book')) response = 'Simply browse our charters, select your date, and complete the booking form. Payment is secure via Stripe.';
      else if (question.includes('cancellation')) response = 'Free cancellation up to 48 hours before your trip. See our terms for details.';
      else if (question.includes('equipment')) response = 'Yes! All charters include rods, reels, bait, and tackle. Just bring yourself!';
      setMessages(prev => [...prev, { text: response, sender: 'bot' }]);
    }, 500);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { text: input, sender: 'user' }]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, { text: 'Thanks for your question! A team member will respond shortly.', sender: 'bot' }]);
    }, 500);
  };

  return (
    <>
      <Button onClick={() => setIsOpen(!isOpen)} className="fixed bottom-6 right-6 z-50 rounded-full w-14 h-14 shadow-2xl bg-gradient-to-br from-blue-600 to-cyan-600">
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </Button>
      {isOpen && (
        <Card className="fixed bottom-24 right-6 z-50 w-96 h-[500px] flex flex-col shadow-2xl">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-4 rounded-t-lg">
            <h3 className="font-bold">Chat with us</h3>
            <p className="text-xs text-blue-100">Avg. response time: 2 min</p>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'}`}>
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t space-y-2">
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((q, idx) => (
                <Button key={idx} onClick={() => handleQuickQuestion(q)} variant="outline" size="sm" className="text-xs">
                  {q}
                </Button>
              ))}
            </div>
            <div className="flex gap-2">
              <Input value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} placeholder="Type a message..." />
              <Button onClick={handleSend} size="icon"><Send className="w-4 h-4" /></Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
}
