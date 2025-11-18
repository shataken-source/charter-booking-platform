import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Settings, Plus, Trash2, Edit2, Eye, EyeOff, Save, X } from 'lucide-react';

interface ConfigVariable {
  id: string;
  key: string;
  value: string;
  description: string;
  is_secret: boolean;
  created_at: string;
  updated_at: string;
}

export default function ConfigurationManager() {
  const { toast } = useToast();
  const [configs, setConfigs] = useState<ConfigVariable[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showValues, setShowValues] = useState<Record<string, boolean>>({});
  
  const [formData, setFormData] = useState({
    key: '',
    value: '',
    description: '',
    is_secret: false
  });

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('configuration_variables')
        .select('*')
        .order('key');
      
      if (error) throw error;
      setConfigs(data || []);
    } catch (error) {
      console.error('Failed to load configs:', error);
      toast({ title: 'Error', description: 'Failed to load configuration variables', variant: 'destructive' });
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!formData.key || !formData.value) {
      toast({ title: 'Validation Error', description: 'Key and value are required', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        const { error } = await supabase
          .from('configuration_variables')
          .update({
            key: formData.key,
            value: formData.value,
            description: formData.description,
            is_secret: formData.is_secret,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingId);
        
        if (error) throw error;
        toast({ title: 'Success', description: 'Configuration updated successfully' });
      } else {
        const { error } = await supabase
          .from('configuration_variables')
          .insert([{
            key: formData.key,
            value: formData.value,
            description: formData.description,
            is_secret: formData.is_secret
          }]);
        
        if (error) throw error;
        toast({ title: 'Success', description: 'Configuration added successfully' });
      }
      
      setFormData({ key: '', value: '', description: '', is_secret: false });
      setEditingId(null);
      loadConfigs();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
    setLoading(false);
  };

  const handleEdit = (config: ConfigVariable) => {
    setFormData({
      key: config.key,
      value: config.value,
      description: config.description,
      is_secret: config.is_secret
    });
    setEditingId(config.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this configuration?')) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('configuration_variables')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast({ title: 'Success', description: 'Configuration deleted successfully' });
      loadConfigs();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
    setLoading(false);
  };

  const toggleShowValue = (id: string) => {
    setShowValues(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            {editingId ? 'Edit Configuration' : 'Add New Configuration'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Key Name *</Label>
            <Input
              value={formData.key}
              onChange={(e) => setFormData({ ...formData, key: e.target.value })}
              placeholder="FIREBASE_SERVER_KEY"
            />
          </div>
          <div>
            <Label>Value *</Label>
            <Textarea
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              placeholder="Enter configuration value"
              rows={3}
            />
          </div>
          <div>
            <Label>Description</Label>
            <Input
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="What is this configuration for?"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_secret"
              checked={formData.is_secret}
              onChange={(e) => setFormData({ ...formData, is_secret: e.target.checked })}
              className="w-4 h-4"
            />
            <Label htmlFor="is_secret">Mark as secret (hide value by default)</Label>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              {editingId ? 'Update' : 'Add'} Configuration
            </Button>
            {editingId && (
              <Button variant="outline" onClick={() => {
                setEditingId(null);
                setFormData({ key: '', value: '', description: '', is_secret: false });
              }}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configuration Variables</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && configs.length === 0 ? (
            <p className="text-gray-500">Loading...</p>
          ) : configs.length === 0 ? (
            <p className="text-gray-500">No configuration variables yet</p>
          ) : (
            <div className="space-y-3">
              {configs.map((config) => (
                <div key={config.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{config.key}</h4>
                      {config.description && (
                        <p className="text-sm text-gray-600 mt-1">{config.description}</p>
                      )}
                      <div className="mt-2 flex items-center gap-2">
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                          {config.is_secret && !showValues[config.id] 
                            ? '••••••••••••' 
                            : config.value}
                        </code>
                        {config.is_secret && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleShowValue(config.id)}
                          >
                            {showValues[config.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        Updated: {new Date(config.updated_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(config)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(config.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
