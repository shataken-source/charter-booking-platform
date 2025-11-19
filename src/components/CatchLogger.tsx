import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Upload, MapPin, Calendar, Fish } from 'lucide-react';

interface Species {
  id: string;
  name: string;
  scientific_name: string;
  category: string;
}

export default function CatchLogger({ onSuccess }: { onSuccess?: () => void }) {
  const [species, setSpecies] = useState<Species[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    species_id: '',
    weight: '',
    length: '',
    location: '',
    catch_date: new Date().toISOString().split('T')[0],
    photo_url: '',
    notes: ''
  });

  useEffect(() => {
    loadSpecies();
  }, []);

  const loadSpecies = async () => {
    const { data, error } = await supabase.functions.invoke('catch-logger', {
      body: { action: 'get_species' }
    });
    if (!error && data.species) setSpecies(data.species);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { error: uploadError, data } = await supabase.storage
        .from('catch-photos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('catch-photos')
        .getPublicUrl(fileName);

      setFormData(prev => ({ ...prev, photo_url: publicUrl }));
      toast.success('Photo uploaded!');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      const { data, error } = await supabase.functions.invoke('catch-logger', {
        body: {
          action: 'log_catch',
          ...formData,
          weight: parseFloat(formData.weight),
          length: formData.length ? parseFloat(formData.length) : null,
          catch_date: new Date(formData.catch_date).toISOString()
        },
        headers: { Authorization: `Bearer ${token}` }
      });

      if (error) throw error;

      toast.success('Catch logged successfully!');
      setFormData({
        species_id: '',
        weight: '',
        length: '',
        location: '',
        catch_date: new Date().toISOString().split('T')[0],
        photo_url: '',
        notes: ''
      });
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Fish className="w-5 h-5" />
          Log Your Catch
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Species *</Label>
            <Select value={formData.species_id} onValueChange={(v) => setFormData(prev => ({ ...prev, species_id: v }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select species" />
              </SelectTrigger>
              <SelectContent>
                {species.map(s => (
                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Weight (lbs) *</Label>
              <Input type="number" step="0.01" value={formData.weight} onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))} required />
            </div>
            <div>
              <Label>Length (inches)</Label>
              <Input type="number" step="0.1" value={formData.length} onChange={(e) => setFormData(prev => ({ ...prev, length: e.target.value }))} />
            </div>
          </div>

          <div>
            <Label className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Location *
            </Label>
            <Input value={formData.location} onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))} required />
          </div>

          <div>
            <Label className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Date *
            </Label>
            <Input type="date" value={formData.catch_date} onChange={(e) => setFormData(prev => ({ ...prev, catch_date: e.target.value }))} required />
          </div>

          <div>
            <Label className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Photo
            </Label>
            <Input type="file" accept="image/*" onChange={handlePhotoUpload} disabled={uploading} />
            {formData.photo_url && <img src={formData.photo_url} alt="Catch" className="mt-2 w-32 h-32 object-cover rounded" />}
          </div>

          <div>
            <Label>Notes</Label>
            <Textarea value={formData.notes} onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))} rows={3} />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Logging...' : 'Log Catch'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}