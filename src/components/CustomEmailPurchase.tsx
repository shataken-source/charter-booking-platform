import { useState } from 'react';
import { Mail, CreditCard, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface CustomEmailPurchaseProps {
  captainEmail: string;
  currentCustomEmail?: string;
  hasCustomEmail?: boolean;
  onPurchaseSuccess: (customEmail: string) => void;
}

export default function CustomEmailPurchase({ 
  captainEmail, 
  currentCustomEmail, 
  hasCustomEmail,
  onPurchaseSuccess 
}: CustomEmailPurchaseProps) {
  const [customEmailPrefix, setCustomEmailPrefix] = useState(currentCustomEmail?.split('@')[0] || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePurchase = async () => {
    if (!customEmailPrefix.trim()) {
      setError('Please enter a custom email prefix');
      return;
    }

    if (!/^[a-z0-9-]+$/.test(customEmailPrefix)) {
      setError('Only lowercase letters, numbers, and hyphens allowed');
      return;
    }

    setLoading(true);
    setError('');

    // Demo mode - simulate successful purchase
    const isDemoMode = window.confirm(
      'Demo Mode: Click OK to simulate purchase (no payment required)\n\nClick Cancel to use real Stripe payment'
    );

    if (isDemoMode) {
      setTimeout(() => {
        const customEmail = `${customEmailPrefix}@gulfcoastcharters.com`;


        onPurchaseSuccess(customEmail);
        setLoading(false);
      }, 1000);
      return;
    }

    try {
      const { data, error: invokeError } = await supabase.functions.invoke('stripe-custom-email', {
        body: { customEmailPrefix, captainEmail },
      });

      if (invokeError) throw invokeError;
      
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      setError(err.message || 'Payment failed. Try demo mode instead.');
      setLoading(false);
    }
  };


  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
      <div className="flex items-start gap-3 mb-4">
        <Mail className="h-6 w-6 text-blue-600 mt-1" />
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-1">Custom Email Address</h3>
          <p className="text-sm text-gray-600 mb-4">
            Get a professional @gulfcoastcharters.com email for just $10 (valid until listing deletion)
          </p>



          {hasCustomEmail ? (
            <div className="bg-white rounded-lg p-4 border border-green-200">
              <div className="flex items-center gap-2 text-green-700 mb-2">
                <Check className="h-5 w-5" />
                <span className="font-semibold">Active Custom Email</span>
              </div>
              <p className="text-lg font-mono">{currentCustomEmail}</p>
            </div>
          ) : (
            <div>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={customEmailPrefix}
                  onChange={(e) => setCustomEmailPrefix(e.target.value.toLowerCase())}
                  placeholder="yourname"
                  className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <span className="flex items-center px-3 bg-gray-100 rounded-lg text-gray-700">
                  @gulfcoastcharters.com
                </span>


              </div>
              {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
              <button
                onClick={handlePurchase}
                disabled={loading}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-semibold transition"
              >
                <CreditCard className="h-5 w-5" />
                {loading ? 'Processing...' : 'Purchase for $10'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
