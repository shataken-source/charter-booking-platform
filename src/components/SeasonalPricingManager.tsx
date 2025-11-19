import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, DollarSign, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface PricingRule {
  id: string;
  seasonName: string;
  startDate: string;
  endDate: string;
  multiplier: number;
  fixedPrice?: number;
}

export default function SeasonalPricingManager({ captainId }: { captainId: string }) {
  const [rules, setRules] = useState<PricingRule[]>([]);
  const [newRule, setNewRule] = useState({
    seasonName: '',
    startDate: '',
    endDate: '',
    multiplier: 1.0,
    fixedPrice: ''
  });

  const addRule = () => {
    if (!newRule.seasonName || !newRule.startDate || !newRule.endDate) {
      toast.error('Please fill all fields');
      return;
    }

    const rule: PricingRule = {
      id: Date.now().toString(),
      seasonName: newRule.seasonName,
      startDate: newRule.startDate,
      endDate: newRule.endDate,
      multiplier: newRule.multiplier,
      fixedPrice: newRule.fixedPrice ? parseFloat(newRule.fixedPrice) : undefined
    };

    setRules([...rules, rule]);
    setNewRule({ seasonName: '', startDate: '', endDate: '', multiplier: 1.0, fixedPrice: '' });
    toast.success('Pricing rule added');
  };

  const removeRule = (id: string) => {
    setRules(rules.filter(r => r.id !== id));
    toast.success('Pricing rule removed');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Seasonal Pricing Rules
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Season Name</Label>
            <Input
              placeholder="e.g., Summer Peak"
              value={newRule.seasonName}
              onChange={(e) => setNewRule({ ...newRule, seasonName: e.target.value })}
            />
          </div>
          <div>
            <Label>Price Multiplier</Label>
            <Input
              type="number"
              step="0.1"
              value={newRule.multiplier}
              onChange={(e) => setNewRule({ ...newRule, multiplier: parseFloat(e.target.value) })}
            />
          </div>
          <div>
            <Label>Start Date</Label>
            <Input
              type="date"
              value={newRule.startDate}
              onChange={(e) => setNewRule({ ...newRule, startDate: e.target.value })}
            />
          </div>
          <div>
            <Label>End Date</Label>
            <Input
              type="date"
              value={newRule.endDate}
              onChange={(e) => setNewRule({ ...newRule, endDate: e.target.value })}
            />
          </div>
        </div>

        <Button onClick={addRule} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Pricing Rule
        </Button>

        <div className="space-y-2">
          {rules.map(rule => (
            <div key={rule.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div>
                <p className="font-semibold">{rule.seasonName}</p>
                <p className="text-sm text-gray-600">
                  {rule.startDate} to {rule.endDate} • {rule.multiplier}x price
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => removeRule(rule.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}