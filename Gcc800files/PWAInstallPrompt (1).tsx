import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Download, X } from 'lucide-react';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 right-6 z-50 max-w-sm">
      <div className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white rounded-lg shadow-2xl p-4">
        <button onClick={() => setShowPrompt(false)} className="absolute top-2 right-2">
          <X className="w-4 h-4" />
        </button>
        <div className="flex items-start gap-3">
          <Download className="w-8 h-8 flex-shrink-0" />
          <div>
            <h4 className="font-bold mb-1">Install Gulf Coast Charters</h4>
            <p className="text-sm text-blue-100 mb-3">Get quick access and book charters offline!</p>
            <Button onClick={handleInstall} size="sm" className="bg-white text-blue-600 hover:bg-blue-50">
              Install App
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
