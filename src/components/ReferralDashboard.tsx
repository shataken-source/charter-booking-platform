import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { Copy, Gift, Users, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ReferralDashboard({ userEmail }: { userEmail: string }) {
  const [referralCode, setReferralCode] = useState('');
  const [referrals, setReferrals] = useState<any[]>([]);
  const [credits, setCredits] = useState({ totalEarned: 0, availableBalance: 0, totalSpent: 0 });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadReferralData();
  }, [userEmail]);

  const loadReferralData = async () => {
    try {
      const { data: codeData } = await supabase.functions.invoke('referral-system', {
        body: { action: 'generate_code', userEmail }
      });

      if (codeData?.referralCode) {
        setReferralCode(codeData.referralCode);
      }

      const { data: refData } = await supabase.functions.invoke('referral-system', {
        body: { action: 'get_referrals', userEmail }
      });

      if (refData?.referrals) {
        setReferrals(refData.referrals);
        setCredits(refData.credits);
      }
    } catch (error) {
      console.error('Error loading referral data:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast({ title: 'Copied!', description: 'Referral code copied to clipboard' });
  };

  const shareUrl = `${window.location.origin}?ref=${referralCode}`;

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Available Credits</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${credits.availableBalance}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
            <Gift className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${credits.totalEarned}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Successful Referrals</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{referrals.filter(r => r.status === 'completed').length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Referral Code</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input value={referralCode} readOnly className="font-mono text-lg" />
            <Button onClick={copyReferralCode} variant="outline">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-gray-600">
            Share your code with friends. When they complete their first booking, you earn $25 in credits and they get $10 off!
          </p>

        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Referral History</CardTitle>
        </CardHeader>
        <CardContent>
          {referrals.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No referrals yet. Start sharing your code!</p>
          ) : (
            <div className="space-y-3">
              {referrals.map((ref) => (
                <div key={ref.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{ref.refereeEmail}</p>
                    <p className="text-sm text-gray-500">{new Date(ref.createdAt).toLocaleDateString()}</p>
                  </div>
                  <Badge variant={ref.status === 'completed' ? 'default' : 'secondary'}>
                    {ref.status === 'completed' ? `+$${ref.rewardAmount}` : 'Pending'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}