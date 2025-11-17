import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Mail, Phone, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function NewsletterSignup() {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    emailEnabled: true,
    smsEnabled: false
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email && !formData.phone) {
      toast.error('Please provide at least email or phone number');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('mailing-list-manager', {
        body: {
          action: 'subscribe',
          data: formData
        }
      });

      if (error) throw error;

      if (data.success) {
        setSuccess(true);
        toast.success('Successfully subscribed to our mailing list!');
        setFormData({
          email: '',
          phone: '',
          firstName: '',
          lastName: '',
          emailEnabled: true,
          smsEnabled: false
        });
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to subscribe');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="p-8 text-center">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-2">You're All Set!</h3>
        <p className="text-muted-foreground">
          Thank you for subscribing. You'll receive updates based on your preferences.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
        <p className="text-muted-foreground">
          Get the latest charter deals, captain tips, and boating news delivered to you.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              placeholder="John"
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              placeholder="Doe"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your@email.com"
              className="pl-10"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="phone">Phone Number (Optional)</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1 (555) 123-4567"
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="emailEnabled"
              checked={formData.emailEnabled}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, emailEnabled: checked as boolean })
              }
            />
            <Label htmlFor="emailEnabled" className="cursor-pointer">
              Receive email updates
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="smsEnabled"
              checked={formData.smsEnabled}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, smsEnabled: checked as boolean })
              }
            />
            <Label htmlFor="smsEnabled" className="cursor-pointer">
              Receive SMS updates (standard rates apply)
            </Label>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Subscribing...' : 'Subscribe Now'}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          We respect your privacy. Unsubscribe anytime.
        </p>
      </form>
    </Card>
  );
}
