import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useUser } from '@/contexts/UserContext';
import { MessageCircle, Send, Reply } from 'lucide-react';
import { initialTopics } from '@/data/messageBoardTopics';


interface Message {
  id: string;
  userId: string;
  userName: string;
  title?: string;
  content: string;
  parentId?: string;
  createdAt: string;
  replies?: Message[];
}

export default function MessageBoard() {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    initializeMessageBoard();
    loadMessages();
  }, []);

  const initializeMessageBoard = () => {
    const stored = localStorage.getItem('messageBoard');
    if (!stored) {
      // Seed with initial topics on first load
      localStorage.setItem('messageBoard', JSON.stringify(initialTopics));
    }
  };

  const loadMessages = () => {
    const stored = localStorage.getItem('messageBoard');
    if (stored) {
      const allMessages = JSON.parse(stored);
      const threaded = buildThreads(allMessages);
      setMessages(threaded);
    }
  };


  const buildThreads = (allMessages: Message[]) => {
    const threads = allMessages.filter(m => !m.parentId);
    threads.forEach(thread => {
      thread.replies = allMessages.filter(m => m.parentId === thread.id);
    });
    return threads.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  };

  const postMessage = () => {
    if (!user) {
      alert('Please login to post');
      return;
    }
    if (!newTitle.trim() || !newContent.trim()) return;

    const stored = localStorage.getItem('messageBoard');
    const allMessages = stored ? JSON.parse(stored) : [];
    
    const newMsg: Message = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      title: newTitle,
      content: newContent,
      createdAt: new Date().toISOString()
    };

    allMessages.push(newMsg);
    localStorage.setItem('messageBoard', JSON.stringify(allMessages));
    
    setNewTitle('');
    setNewContent('');
    loadMessages();
  };

  const postReply = (parentId: string) => {
    if (!user) {
      alert('Please login to reply');
      return;
    }
    if (!replyContent.trim()) return;

    const stored = localStorage.getItem('messageBoard');
    const allMessages = stored ? JSON.parse(stored) : [];
    
    const reply: Message = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      content: replyContent,
      parentId,
      createdAt: new Date().toISOString()
    };

    allMessages.push(reply);
    localStorage.setItem('messageBoard', JSON.stringify(allMessages));
    
    setReplyTo(null);
    setReplyContent('');
    loadMessages();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-8">
        <MessageCircle className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold">Community Message Board</h1>
      </div>

      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Start a New Thread</h2>
        <Input
          placeholder="Thread Title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="mb-3"
        />
        <Textarea
          placeholder="What's on your mind?"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          rows={4}
          className="mb-3"
        />
        <Button onClick={postMessage} disabled={!user}>
          <Send className="w-4 h-4 mr-2" />
          Post Thread
        </Button>
        {!user && <p className="text-sm text-gray-500 mt-2">Login to post</p>}
      </Card>

      <div className="space-y-6">
        {messages.map(msg => (
          <Card key={msg.id} className="p-6">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-xl font-semibold">{msg.title}</h3>
                <p className="text-sm text-gray-500">
                  by {msg.userName} • {new Date(msg.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">{msg.content}</p>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setReplyTo(msg.id)}
            >
              <Reply className="w-4 h-4 mr-2" />
              Reply
            </Button>

            {replyTo === msg.id && (
              <div className="mt-4 pl-4 border-l-2">
                <Textarea
                  placeholder="Write your reply..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  rows={3}
                  className="mb-2"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => postReply(msg.id)}>Post Reply</Button>
                  <Button size="sm" variant="outline" onClick={() => setReplyTo(null)}>Cancel</Button>
                </div>
              </div>
            )}

            {msg.replies && msg.replies.length > 0 && (
              <div className="mt-4 pl-6 border-l-2 space-y-3">
                {msg.replies.map(reply => (
                  <div key={reply.id} className="bg-gray-50 p-4 rounded">
                    <p className="text-sm text-gray-500 mb-2">
                      {reply.userName} • {new Date(reply.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-gray-700">{reply.content}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}