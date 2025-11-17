import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AvatarCreator from '@/components/AvatarCreator';
import InstantMessenger from '@/components/InstantMessenger';
import MessageBoard from '@/components/MessageBoard';
import CommunityEventsCalendar from '@/components/CommunityEventsCalendar';
import { mockThreads } from '@/data/mockCommunityData';
import { Users, MessageSquare, MessageCircle, User, Calendar } from 'lucide-react';

import { useNavigate } from 'react-router-dom';

export default function Community() {
  const { user, updateUser } = useUser();
  const navigate = useNavigate();
  const [showAvatarCreator, setShowAvatarCreator] = useState(false);

  useEffect(() => {
    // Initialize mock data if not present
    const stored = localStorage.getItem('messageBoard');
    if (!stored) {
      localStorage.setItem('messageBoard', JSON.stringify(mockThreads));
    }
  }, []);

  const handleAvatarSave = (avatarId: string) => {
    if (user) {
      updateUser({ ...user, avatar: avatarId });
      setShowAvatarCreator(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <Button 
            variant="ghost" 
            className="text-white mb-4"
            onClick={() => navigate('/')}
          >
            ← Back to Home
          </Button>
          <div className="flex items-center gap-4 mb-4">
            <Users className="w-12 h-12" />
            <h1 className="text-5xl font-bold">Community Hub</h1>
          </div>
          <p className="text-xl text-blue-100">
            Connect with fellow charter enthusiasts, share experiences, and get advice
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* User Profile Section */}
        {user && (
          <Card className="p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{user.name}</h2>
                  <p className="text-gray-600">{user.email}</p>
                </div>
              </div>
              <Button onClick={() => setShowAvatarCreator(!showAvatarCreator)}>
                <User className="w-4 h-4 mr-2" />
                {showAvatarCreator ? 'Hide' : 'Edit'} Avatar
              </Button>
            </div>
            {showAvatarCreator && (
              <div className="mt-6">
                <AvatarCreator 
                  currentAvatar={user.avatar} 
                  onSave={handleAvatarSave}
                />
              </div>
            )}
          </Card>
        )}

        {/* Main Content Tabs */}

        <Tabs defaultValue="events" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="events" className="text-lg">
              <Calendar className="w-5 h-5 mr-2" />
              Events
            </TabsTrigger>
            <TabsTrigger value="chat" className="text-lg">
              <MessageSquare className="w-5 h-5 mr-2" />
              Live Chat
            </TabsTrigger>
            <TabsTrigger value="board" className="text-lg">
              <MessageCircle className="w-5 h-5 mr-2" />
              Message Board
            </TabsTrigger>
          </TabsList>

          <TabsContent value="events">
            <CommunityEventsCalendar />
          </TabsContent>


          <TabsContent value="chat">
            <InstantMessenger />
          </TabsContent>

          <TabsContent value="board">
            <MessageBoard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
