import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { useToast } from '@/hooks/use-toast';
import { Save, Building2, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube, Key } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

export default function SiteSettingsManager() {
  const { settings, updateSettings } = useSiteSettings();
  const { toast } = useToast();
  const [formData, setFormData] = useState(settings);

  const handleSave = () => {
    updateSettings(formData);
    toast({
      title: 'Settings saved',
      description: 'Site settings have been updated successfully',
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="w-5 h-5" />
          Site Settings & Links Manager
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Company Information</h3>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="tagline">Tagline</Label>
              <Input
                id="tagline"
                value={formData.tagline}
                onChange={(e) => handleChange('tagline', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t">
          <h3 className="font-semibold text-lg">Contact Information</h3>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="address" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Address
              </Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t">
          <h3 className="font-semibold text-lg">Social Media Links</h3>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="facebook" className="flex items-center gap-2">
                <Facebook className="w-4 h-4" />
                Facebook URL
              </Label>
              <Input
                id="facebook"
                value={formData.facebook}
                onChange={(e) => handleChange('facebook', e.target.value)}
                placeholder="https://facebook.com/yourpage"
              />
            </div>
            <div>
              <Label htmlFor="twitter" className="flex items-center gap-2">
                <Twitter className="w-4 h-4" />
                Twitter/X URL
              </Label>
              <Input
                id="twitter"
                value={formData.twitter}
                onChange={(e) => handleChange('twitter', e.target.value)}
                placeholder="https://twitter.com/yourhandle"
              />
            </div>
            <div>
              <Label htmlFor="instagram" className="flex items-center gap-2">
                <Instagram className="w-4 h-4" />
                Instagram URL
              </Label>
              <Input
                id="instagram"
                value={formData.instagram}
                onChange={(e) => handleChange('instagram', e.target.value)}
                placeholder="https://instagram.com/yourhandle"
              />
            </div>
            <div>
              <Label htmlFor="linkedin" className="flex items-center gap-2">
                <Linkedin className="w-4 h-4" />
                LinkedIn URL
              </Label>
              <Input
                id="linkedin"
                value={formData.linkedin}
                onChange={(e) => handleChange('linkedin', e.target.value)}
                placeholder="https://linkedin.com/company/yourcompany"
              />
            </div>
            <div>
              <Label htmlFor="youtube" className="flex items-center gap-2">
                <Youtube className="w-4 h-4" />
                YouTube URL
              </Label>
              <Input
                id="youtube"
                value={formData.youtube}
                onChange={(e) => handleChange('youtube', e.target.value)}
                placeholder="https://youtube.com/@yourchannel"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t">
          <h3 className="font-semibold text-lg">API Keys & Integrations</h3>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="firebaseServerKey" className="flex items-center gap-2">
                <Key className="w-4 h-4" />
                Firebase Server Key
              </Label>
              <Textarea
                id="firebaseServerKey"
                value={formData.firebaseServerKey}
                onChange={(e) => handleChange('firebaseServerKey', e.target.value)}
                placeholder="Enter your Firebase Cloud Messaging server key for push notifications"
                className="font-mono text-sm"
                rows={3}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Used for sending push notifications to mobile app users. Get this from Firebase Console → Project Settings → Cloud Messaging.
              </p>
            </div>
          </div>
        </div>

        <Button onClick={handleSave} className="w-full" size="lg">
          <Save className="w-4 h-4 mr-2" />
          Save All Settings
        </Button>
      </CardContent>
    </Card>
  );
}
