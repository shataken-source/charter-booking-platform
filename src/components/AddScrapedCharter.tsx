import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useAppStore } from '@/stores/appStore';

export default function AddScrapedCharter() {
  const [url, setUrl] = useState('https://www.gulfcoastfamilycharters.com/');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<any>(null);
  const addCharter = useAppStore((state) => state.addCharter);

  const handleScrape = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('web-scraper', {
        body: { url },
      });

      if (error) throw error;

      if (data.success) {
        setResult(data.data);
        alert('Charter information extracted successfully!');
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error: any) {
      console.error('Scraping error:', error);
      alert('Failed to scrape website: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!result) return;
    
    setSaving(true);
    try {
      // Parse pricing if available
      let priceHalfDay = 0;
      let priceFullDay = 0;
      if (result.pricing) {
        const priceMatch = result.pricing.match(/\$?(\d+)/g);
        if (priceMatch && priceMatch.length > 0) {
          priceHalfDay = parseInt(priceMatch[0].replace('$', ''));
          if (priceMatch.length > 1) {
            priceFullDay = parseInt(priceMatch[1].replace('$', ''));
          }
        }
      }

      // Create charter object matching the app's charter structure
      const charter = {
        id: crypto.randomUUID(),
        businessName: result.name || 'Unknown Business',
        boatName: result.boatType || 'Charter Boat',
        captainName: result.captain || 'Captain',
        captainEmail: result.email || '',
        captainPhone: result.phone || '',
        contactPreferences: { email: true, phone: true },
        location: result.location?.split(',')[1]?.trim() || 'Gulf Coast',
        city: result.location?.split(',')[0]?.trim() || 'Unknown',
        latitude: 29.3013,
        longitude: -94.7977,
        boatType: result.boatType || 'Charter',
        boatLength: 35,
        maxPassengers: parseInt(result.capacity) || 6,
        priceHalfDay,
        priceFullDay,
        rating: 0,
        reviewCount: 0,
        image: 'https://d64gsuwffb70l.cloudfront.net/6918960e54362d714f32b6fc_1763224699486_cabce3b8.webp',
        isFeatured: false,
      };

      // Add to app store
      addCharter(charter);

      // Also save to backend
      await supabase.functions.invoke('charter-storage', {
        body: { action: 'save', charter },
      });

      alert('Charter saved successfully! It will now appear in the listings.');
      setResult(null);
      setUrl('');
    } catch (error: any) {
      console.error('Save error:', error);
      alert('Failed to save charter: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h2 className="text-3xl font-bold mb-6">Add Charter from Website</h2>
      
      <div className="flex gap-4 mb-8">
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter charter website URL"
          className="flex-1"
        />
        <Button onClick={handleScrape} disabled={loading || !url}>
          {loading ? 'Scraping...' : 'Scrape Website'}
        </Button>
      </div>

      {result && (
        <Card className="p-6">
          <h3 className="text-2xl font-bold mb-4">{result.name}</h3>
          <div className="space-y-3 text-gray-700">
            <p><strong>Location:</strong> {result.location}</p>
            <p><strong>Description:</strong> {result.description}</p>
            <p><strong>Phone:</strong> {result.phone}</p>
            <p><strong>Email:</strong> {result.email}</p>
            <p><strong>Website:</strong> <a href={result.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{result.website}</a></p>
            {result.captain && <p><strong>Captain:</strong> {result.captain}</p>}
            {result.boatType && <p><strong>Boat Type:</strong> {result.boatType}</p>}
            {result.capacity && <p><strong>Capacity:</strong> {result.capacity}</p>}
            {result.pricing && <p><strong>Pricing:</strong> {result.pricing}</p>}
            {result.services && result.services.length > 0 && (
              <div>
                <strong>Services:</strong>
                <ul className="list-disc ml-6 mt-2">
                  {result.services.map((service: string, i: number) => (
                    <li key={i}>{service}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <div className="mt-6 flex gap-4">
            <Button onClick={handleSave} disabled={saving} className="bg-green-600 hover:bg-green-700">
              {saving ? 'Saving...' : 'Save to Database'}
            </Button>
            <Button onClick={() => setResult(null)} variant="outline">
              Clear
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}

