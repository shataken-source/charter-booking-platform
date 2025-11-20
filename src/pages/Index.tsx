import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { AppProvider } from '@/contexts/AppContext';
import SEO from '@/components/SEO';
import HeroSection from '@/components/HeroSection';
import CharterGrid from '@/components/CharterGrid';
import FeaturesSection from '@/components/FeaturesSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import { generateReferralMetaTags, generateReferralStructuredData } from '@/utils/referralMetaTags';
import { useLocation } from 'react-router-dom';

const Index: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const referralCode = searchParams.get('ref');
  const [filters, setFilters] = useState({});

  const metaTags = referralCode 
    ? generateReferralMetaTags(referralCode)
    : {};

  const structuredData = referralCode 
    ? generateReferralStructuredData(referralCode)
    : undefined;

  return (
    <AppProvider>
      <SEO
        title={metaTags.title || "Gulf Charter Finder - Book Your Perfect Charter"}
        description={metaTags.description || "Find and book the best charter boats in the Gulf Coast"}
        image={metaTags.image}
        structuredData={structuredData}
      />
      <AppLayout>
        <HeroSection onFilterChange={setFilters} />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <CharterGrid filters={filters} />
        </div>
        <FeaturesSection />
        <TestimonialsSection />
      </AppLayout>
    </AppProvider>
  );
};

export default Index;
