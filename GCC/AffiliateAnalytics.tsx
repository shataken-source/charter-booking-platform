import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AffiliateAnalyticsDashboard from '@/components/admin/AffiliateAnalyticsDashboard';
import AffiliateCredentialsManager from '@/components/admin/AffiliateCredentialsManager';
import { useUser } from '@/contexts/UserContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';

export default function AffiliateAnalytics() {
  const { user } = useUser();

  if (user?.level !== 1) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>You need admin privileges to access this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Affiliate Analytics & Management</h1>
      
      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="analytics">Analytics Dashboard</TabsTrigger>
          <TabsTrigger value="credentials">API Credentials</TabsTrigger>
        </TabsList>
        
        <TabsContent value="analytics" className="mt-6">
          <AffiliateAnalyticsDashboard />
        </TabsContent>
        
        <TabsContent value="credentials" className="mt-6">
          <AffiliateCredentialsManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
