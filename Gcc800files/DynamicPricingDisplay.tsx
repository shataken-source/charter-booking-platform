import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { TrendingUp, Calendar, Users } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface PricingData {
  basePrice: number;
  finalPrice: number;
  multiplier: number;
  factors: {
    season: boolean;
    weekend: boolean;
    demand: number;
  };
}

interface DynamicPricingDisplayProps {
  boatId: string;
  startDate: string;
  endDate: string;
}

export default function DynamicPricingDisplay({ boatId, startDate, endDate }: DynamicPricingDisplayProps) {
  const [pricing, setPricing] = useState<PricingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    calculatePricing();
  }, [boatId, startDate, endDate]);

  const calculatePricing = async () => {
    setLoading(true);
    try {
      const { data } = await supabase.functions.invoke("calculate-dynamic-pricing", {
        body: { boatId, startDate, endDate },
      });

      if (data) {
        setPricing(data);
      }
    } catch (error) {
      console.error("Pricing calculation error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="animate-pulse h-32 bg-gray-200 rounded" />;
  if (!pricing) return null;

  const discount = ((pricing.basePrice - pricing.finalPrice) / pricing.basePrice * 100);
  const isDiscounted = discount > 0;

  return (
    <Card className="p-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm text-gray-600">Price per day</p>
          <div className="flex items-baseline gap-2">
            {isDiscounted && (
              <span className="text-lg line-through text-gray-400">${pricing.basePrice}</span>
            )}
            <span className="text-3xl font-bold text-blue-600">${pricing.finalPrice}</span>
          </div>
        </div>
        {pricing.multiplier > 1 && (
          <Badge variant="destructive" className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            +{((pricing.multiplier - 1) * 100).toFixed(0)}%
          </Badge>
        )}
      </div>

      <div className="space-y-2 text-sm">
        {pricing.factors.season && (
          <div className="flex items-center gap-2 text-orange-600">
            <Calendar className="h-4 w-4" />
            <span>Peak season pricing</span>
          </div>
        )}
        {pricing.factors.weekend && (
          <div className="flex items-center gap-2 text-purple-600">
            <Calendar className="h-4 w-4" />
            <span>Weekend premium</span>
          </div>
        )}
        {pricing.factors.demand > 3 && (
          <div className="flex items-center gap-2 text-red-600">
            <Users className="h-4 w-4" />
            <span>High demand period</span>
          </div>
        )}
      </div>
    </Card>
  );
}
