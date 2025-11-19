import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MobileCaptainDashboard from '@/components/MobileCaptainDashboard';
import { OfflineDocumentManager } from '@/components/OfflineDocumentManager';
import { GPSWaypointManager } from '@/components/GPSWaypointManager';
import { EmergencyContacts } from '@/components/EmergencyContacts';
import { SuggestionBox } from '@/components/SuggestionBox';
import { BuoyDataDisplay } from '@/components/BuoyDataDisplay';
import { TideChart } from '@/components/TideChart';
import { WeatherEmailReport } from '@/components/WeatherEmailReport';
import { FileText, Navigation, Phone, MessageCircle, Cloud } from 'lucide-react';

export default function MobileCaptainDashboardPage() {
  const captainId = 'captain-123';

  return (
    <div className="min-h-screen bg-gray-50">
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="w-full grid grid-cols-6 sticky top-0 z-50 bg-white">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="weather"><Cloud className="w-4 h-4" /></TabsTrigger>
          <TabsTrigger value="docs"><FileText className="w-4 h-4" /></TabsTrigger>
          <TabsTrigger value="gps"><Navigation className="w-4 h-4" /></TabsTrigger>
          <TabsTrigger value="emergency"><Phone className="w-4 h-4" /></TabsTrigger>
          <TabsTrigger value="feedback"><MessageCircle className="w-4 h-4" /></TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="p-0">
          <MobileCaptainDashboard />
        </TabsContent>

        <TabsContent value="weather" className="p-4 space-y-4">
          <BuoyDataDisplay stationId="42040" />
          <TideChart stationId="8729108" />
          <WeatherEmailReport />
        </TabsContent>

        <TabsContent value="docs" className="p-4">
          <OfflineDocumentManager captainId={captainId} />
        </TabsContent>

        <TabsContent value="gps" className="p-4">
          <GPSWaypointManager captainId={captainId} />
        </TabsContent>

        <TabsContent value="emergency" className="p-4">
          <EmergencyContacts />
        </TabsContent>

        <TabsContent value="feedback" className="p-4">
          <SuggestionBox userType="captain" />
        </TabsContent>
      </Tabs>
    </div>
  );
}

