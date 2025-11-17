import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

interface Credentials {
  retailer: string;
  apiKey: string;
  secretKey: string;
  partnerId: string;
  isActive: boolean;
}

export default function AffiliateCredentialsManager() {
  const { toast } = useToast();
  const [credentials, setCredentials] = useState<Record<string, Credentials>>({
    amazon: { retailer: 'Amazon', apiKey: '', secretKey: '', partnerId: '', isActive: false },
    walmart: { retailer: 'Walmart', apiKey: '', secretKey: '', partnerId: '', isActive: false },
    boatus: { retailer: 'BoatUS', apiKey: '', secretKey: '', partnerId: '', isActive: false }
  });

  useEffect(() => {
    const saved = localStorage.getItem('affiliateCredentials');
    if (saved) setCredentials(JSON.parse(saved));
  }, []);

  const handleSave = (retailer: string) => {
    localStorage.setItem('affiliateCredentials', JSON.stringify(credentials));
    toast({ title: 'Saved', description: `${credentials[retailer].retailer} credentials updated` });
  };

  const handleChange = (retailer: string, field: string, value: string | boolean) => {
    setCredentials(prev => ({
      ...prev,
      [retailer]: { ...prev[retailer], [field]: value }
    }));
  };

  return (
    <div className="space-y-6">
      {Object.entries(credentials).map(([key, cred]) => (
        <Card key={key}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {cred.retailer} API Credentials
              <Switch checked={cred.isActive} onCheckedChange={(v) => handleChange(key, 'isActive', v)} />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>API Key</Label>
              <Input value={cred.apiKey} onChange={(e) => handleChange(key, 'apiKey', e.target.value)} />
            </div>
            <div>
              <Label>Secret Key</Label>
              <Input type="password" value={cred.secretKey} onChange={(e) => handleChange(key, 'secretKey', e.target.value)} />
            </div>
            <div>
              <Label>Partner/Tracking ID</Label>
              <Input value={cred.partnerId} onChange={(e) => handleChange(key, 'partnerId', e.target.value)} />
            </div>
            <Button onClick={() => handleSave(key)}>Save Credentials</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
