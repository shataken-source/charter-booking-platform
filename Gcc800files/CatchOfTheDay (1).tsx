import { useState } from 'react';
import { Fish, ThumbsUp, MessageCircle, Share2, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Catch {
  id: string;
  userName: string;
  userAvatar: string;
  fishType: string;
  weight: string;
  location: string;
  captain: string;
  image: string;
  likes: number;
  comments: number;
  timeAgo: string;
}

const mockCatches: Catch[] = [
  {
    id: '1',
    userName: 'Mike Johnson',
    userAvatar: 'https://d64gsuwffb70l.cloudfront.net/6918960e54362d714f32b6fc_1763383421235_ab13a1ba.webp',
    fishType: 'Red Snapper',
    weight: '28 lbs',
    location: 'Destin, FL',
    captain: 'Capt. Steve',
    image: 'https://d64gsuwffb70l.cloudfront.net/6918960e54362d714f32b6fc_1763383398811_a0738b37.webp',
    likes: 47,
    comments: 12,
    timeAgo: '2 hours ago'
  },
  {
    id: '2',
    userName: 'Sarah Martinez',
    userAvatar: 'https://d64gsuwffb70l.cloudfront.net/6918960e54362d714f32b6fc_1763383423188_8f6127eb.webp',
    fishType: 'Mahi-Mahi',
    weight: '35 lbs',
    location: 'Key West, FL',
    captain: 'Capt. Rodriguez',
    image: 'https://d64gsuwffb70l.cloudfront.net/6918960e54362d714f32b6fc_1763383400744_76ba64b9.webp',
    likes: 63,
    comments: 18,
    timeAgo: '5 hours ago'
  },
  {
    id: '3',
    userName: 'Tom Wilson',
    userAvatar: 'https://d64gsuwffb70l.cloudfront.net/6918960e54362d714f32b6fc_1763383425517_2994ebfa.webp',
    fishType: 'King Mackerel',
    weight: '42 lbs',
    location: 'Galveston, TX',
    captain: 'Capt. Mike',
    image: 'https://d64gsuwffb70l.cloudfront.net/6918960e54362d714f32b6fc_1763383402665_238844a4.webp',
    likes: 89,
    comments: 24,
    timeAgo: '1 day ago'
  }
];

export default function CatchOfTheDay() {
  const [catches, setCatches] = useState(mockCatches);
  const [likedCatches, setLikedCatches] = useState<Set<string>>(new Set());

  const handleLike = (catchId: string) => {
    setLikedCatches(prev => {
      const newSet = new Set(prev);
      if (newSet.has(catchId)) {
        newSet.delete(catchId);
        setCatches(catches.map(c => c.id === catchId ? {...c, likes: c.likes - 1} : c));
      } else {
        newSet.add(catchId);
        setCatches(catches.map(c => c.id === catchId ? {...c, likes: c.likes + 1} : c));
      }
      return newSet;
    });
  };

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {catches.map(catchItem => (
        <Card key={catchItem.id} className="overflow-hidden hover:shadow-xl transition">
          <div className="relative">
            <img src={catchItem.image} alt={catchItem.fishType} className="w-full h-64 object-cover" />
            <div className="absolute top-3 right-3 bg-yellow-500 text-white px-3 py-1 rounded-full font-bold flex items-center gap-1">
              <Award className="w-4 h-4" />
              Trophy
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <img src={catchItem.userAvatar} alt={catchItem.userName} className="w-10 h-10 rounded-full object-cover" />
              <div>
                <div className="font-semibold">{catchItem.userName}</div>
                <div className="text-xs text-gray-500">{catchItem.timeAgo}</div>
              </div>
            </div>
            <h3 className="text-xl font-bold text-blue-600 mb-2">{catchItem.fishType}</h3>
            <div className="space-y-1 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-2">
                <Fish className="w-4 h-4" />
                <span className="font-semibold">{catchItem.weight}</span>
              </div>
              <div>📍 {catchItem.location}</div>
              <div>⚓ with {catchItem.captain}</div>
            </div>
            <div className="flex gap-2 pt-3 border-t">
              <Button 
                variant={likedCatches.has(catchItem.id) ? "default" : "outline"} 
                size="sm" 
                className="flex-1"
                onClick={() => handleLike(catchItem.id)}
              >
                <ThumbsUp className="w-4 h-4 mr-1" />
                {catchItem.likes}
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <MessageCircle className="w-4 h-4 mr-1" />
                {catchItem.comments}
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
