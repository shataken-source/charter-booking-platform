import React, { useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { AppProvider } from '@/contexts/AppContext';
import { SEO } from '@/components/SEO';
import { generateReferralMetaTags, generateReferralStructuredData } from '@/utils/referralMetaTags';
import { useLocation } from 'react-router-dom';

const Index: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const referralCode = searchParams.get('ref');

  // Generate meta tags if referral code exists
  const metaTags = referralCode 
    ? generateReferralMetaTags(referralCode)
    : {};

  const structuredData = referralCode 
    ? generateReferralStructuredData(referralCode)
    : undefined;

  return (
    <AppProvider>
      {referralCode && (
        <SEO
          title={metaTags.title}
          description={metaTags.description}
          image={metaTags.image}
          structuredData={structuredData}
        />
      )}
      <AppLayout />
    </AppProvider>
  );
};

export default Index;
