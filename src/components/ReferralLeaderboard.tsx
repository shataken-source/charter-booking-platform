import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function ReferralLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const { data } = await supabase.functions.invoke('referral-system', {
        body: { action: 'get_leaderboard' }
      });

      if (data?.leaderboard) {
        setLeaderboard(data.leaderboard);
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (index === 1) return <Medal className="h-5 w-5 text-gray-400" />;
    if (index === 2) return <Award className="h-5 w-5 text-amber-600" />;
    return <span className="text-gray-500">#{index + 1}</span>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Referral Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-center py-8 text-gray-500">Loading...</p>
        ) : leaderboard.length === 0 ? (
          <p className="text-center py-8 text-gray-500">No referrals yet. Be the first!</p>
        ) : (
          <div className="space-y-3">
            {leaderboard.map((user, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  index < 3 ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 flex justify-center">{getRankIcon(index)}</div>
                  <div>
                    <p className="font-medium">{user.email}</p>
                    <p className="text-sm text-gray-600">{user.referralCount} referrals</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  ${user.totalEarned}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
