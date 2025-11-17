
import React from 'react';
import AppLayout from '@/components/AppLayout';
import { AppProvider } from '@/contexts/AppContext';
import { SEO } from '@/components/SEO';

const Index: React.FC = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Gulf Charter Finder",
    "url": "https://gulfcharterfinder.com",
    "description": "Find and book charter boats across the Gulf Coast",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://gulfcharterfinder.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <AppProvider>
      <SEO
        title="Gulf Charter Finder - Find & Book Charter Boats on the Gulf Coast"
        description="Discover and book the best charter fishing boats, yacht charters, and boat tours across the Gulf Coast. Compare prices, read reviews, and book instantly with verified captains."
        keywords="charter boats, fishing charters, yacht rentals, boat tours, Gulf Coast, fishing trips, boat booking, deep sea fishing, inshore fishing, offshore charters"
        structuredData={structuredData}
      />
      <AppLayout />
    </AppProvider>
  );
};

export default Index;

