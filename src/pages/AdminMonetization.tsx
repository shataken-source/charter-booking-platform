import { useUser } from '@/contexts/UserContext';
import { Navigate } from 'react-router-dom';
import MonetizationDashboard from '@/components/MonetizationDashboard';

export default function AdminMonetization() {
  const { user } = useUser();

  if (!user || user.level !== 1) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Monetization Dashboard</h1>
      <p className="text-gray-600 mb-6">Track revenue from all 10 monetization strategies</p>
      <MonetizationDashboard />
    </div>
  );
}
