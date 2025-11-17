import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Anchor, User, Globe, Users, Award, Calendar, Settings } from 'lucide-react';
import { useFeatureFlags } from '@/contexts/FeatureFlagContext';
import { useI18n } from '@/contexts/I18nContext';
import { Button } from '@/components/ui/button';
import TestimonialsSection from '@/components/TestimonialsSection';
import TrustBadges from '@/components/TrustBadges';
import FAQSection from '@/components/FAQSection';
import HowItWorks from '@/components/HowItWorks';
import NewsletterCTA from '@/components/NewsletterCTA';
import CommunityDropdown from '@/components/CommunityDropdown';
import NotificationCenter from '@/components/NotificationCenter';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import MobileMenu from '@/components/MobileMenu';
import ActivitySearch from '@/components/ActivitySearch';
import BoatRentalCard from '@/components/BoatRentalCard';
import SeasonalDeals from '@/components/SeasonalDeals';
import RentalBookingModal from '@/components/RentalBookingModal';
import UserAuth from '@/components/UserAuth';
import UserProfile from '@/components/UserProfile';
import Footer from '@/components/Footer';
import AdminPanel from '@/components/AdminPanel';
import EnhancedFilterBar from '@/components/EnhancedFilterBar';
import CharterMapView from '@/components/CharterMapView';
import TrustBadgesBar from '@/components/TrustBadgesBar';
import SocialProofNotification from '@/components/SocialProofNotification';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';
import SmartChatbot from '@/components/SmartChatbot';
import PersonalizedRecommendations from '@/components/PersonalizedRecommendations';
import VideoPlayer from '@/components/VideoPlayer';
import PrimeTimesWidget from '@/components/PrimeTimesWidget';
import MoonPhaseWidget from '@/components/MoonPhaseWidget';
import SpeciesTargetingFilter from '@/components/SpeciesTargetingFilter';
import PackageBundleCard from '@/components/PackageBundleCard';
import CaptainLeaderboard from '@/components/CaptainLeaderboard';
import SmartNotificationSystem from '@/components/SmartNotificationSystem';
import CorporateAccountManager from '@/components/CorporateAccountManager';

import { useUser } from '@/hooks/useStoreCompat';
import { useUser as useUserContext } from '@/contexts/UserContext';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { featuredCharters } from '@/data/featuredCharters';
import { boatRentals } from '@/data/boatRentals';

export default function AppLayout() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useUser();
  const { showAuthModal, setShowAuthModal } = useUserContext();
  const { requireAuth } = useRequireAuth();
  const { t } = useI18n();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [selectedCharter, setSelectedCharter] = useState<any>(null);
  const [selectedRental, setSelectedRental] = useState<any>(null);
  const [rentalFilter, setRentalFilter] = useState<'all' | 'paddle' | 'motorized'>('all');
  const [charterView, setCharterView] = useState<'grid' | 'map'>('grid');
  const [filters, setFilters] = useState({ priceRange: [0, 2000] as [number, number], guests: 4, location: '', type: 'all' });

  const handleBooking = () => {
    requireAuth(() => alert('Booking functionality'), 'Please login to book');
  };

  const filteredCharters = featuredCharters.filter(c => 
    c.price >= filters.priceRange[0] && c.price <= filters.priceRange[1] &&
    (filters.location === '' || c.location.toLowerCase().includes(filters.location.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <nav className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg sticky top-0 z-30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <Anchor className="w-7 h-7" />
              <div className="text-xl font-bold">Gulf Coast Charters</div>
            </div>
            <div className="hidden md:flex space-x-4 items-center text-sm">
              <button onClick={() => document.getElementById('charters')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-blue-100">Charters</button>
              <button onClick={() => navigate('/captains')} className="hover:text-blue-100">Captains</button>
              {isAuthenticated ? (
                <>
                  <NotificationCenter />
                  {user?.level === 1 && <Button variant="ghost" size="sm" onClick={() => setShowAdminPanel(!showAdminPanel)}>Admin</Button>}
                  <Button variant="ghost" size="sm" onClick={() => setShowProfile(true)}>{user?.name}</Button>
                </>
              ) : (
                <Button size="sm" className="bg-white text-blue-600" onClick={() => setShowAuth(true)}>Login</Button>
              )}
            </div>
            <button onClick={() => setMobileMenuOpen(true)} className="md:hidden">☰</button>
          </div>
        </div>
      </nav>

      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} onShowAuth={() => setShowAuth(true)} onShowProfile={() => setShowProfile(true)} isAuthenticated={isAuthenticated} userName={user?.name} />

      {/* Hero - Responsive */}
      <section className="relative h-[400px] md:h-[500px] flex items-center justify-center text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/70 to-cyan-900/60 z-10"></div>
        <img src="https://d64gsuwffb70l.cloudfront.net/6918960e54362d714f32b6fc_1763349026286_fce8a245.webp" alt="Gulf Coast" className="absolute inset-0 w-full h-full object-cover" />
        <div className="relative z-20 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Gulf Coast's Premier Fishing Charters</h1>
          <p className="text-lg md:text-xl mb-6">From Texas to Florida</p>
          <Button size="lg" className="bg-white text-blue-600" onClick={() => document.getElementById('charters')?.scrollIntoView({ behavior: 'smooth' })}>Browse Charters</Button>
        </div>
      </section>

      <TrustBadgesBar />
      <ActivitySearch onSearch={() => {}} />
      <TrustBadges />

      <HowItWorks />

      {/* Smart Scheduling & Fishing Intelligence */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Plan Your Perfect Trip</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PrimeTimesWidget />
          <MoonPhaseWidget />
          <SpeciesTargetingFilter />
        </div>
      </section>

      {/* Captain Leaderboard */}
      <section className="container mx-auto px-4 py-12">
        <CaptainLeaderboard />
      </section>

      {/* Package Deals */}
      <section className="container mx-auto px-4 py-12 bg-gradient-to-br from-blue-50 to-cyan-50">
        <h2 className="text-3xl font-bold text-center mb-8">Vacation Packages</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <PackageBundleCard bundle={{
            id: '1',
            name: 'Weekend Warrior',
            description: '2-day fishing adventure with hotel',
            includes: ['2-night hotel stay', 'Full-day charter', 'Breakfast included'],
            price: 899,
            originalPrice: 1199,
            duration: '2 days',
            maxGuests: 4,
            image: 'https://d64gsuwffb70l.cloudfront.net/6918960e54362d714f32b6fc_1763349026286_fce8a245.webp'
          }} />
          <PackageBundleCard bundle={{
            id: '2',
            name: 'Family Getaway',
            description: '3-day family fishing package',
            includes: ['3-night beachfront hotel', '2 half-day charters', 'All meals included'],
            price: 1599,
            originalPrice: 2199,
            duration: '3 days',
            maxGuests: 6,
            image: 'https://d64gsuwffb70l.cloudfront.net/6918960e54362d714f32b6fc_1763349026286_fce8a245.webp'
          }} />
          <PackageBundleCard bundle={{
            id: '3',
            name: 'Tournament Package',
            description: 'Multi-day tournament experience',
            includes: ['5-night luxury resort', '3 full-day charters', 'Tournament entry fee'],
            price: 2999,
            originalPrice: 3999,
            duration: '5 days',
            maxGuests: 4,
            image: 'https://d64gsuwffb70l.cloudfront.net/6918960e54362d714f32b6fc_1763349026286_fce8a245.webp'
          }} />
        </div>
      </section>

      {/* Corporate Accounts */}
      <section className="container mx-auto px-4 py-12">
        <CorporateAccountManager />
      </section>

      {/* Personalized Recommendations */}
      {isAuthenticated && <div className="container mx-auto px-4 py-12"><PersonalizedRecommendations userId={user?.email} /></div>}

      {/* Charters with Enhanced Filters & Map */}
      <section id="charters" className="container mx-auto px-4 py-12">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Gulf Coast Fishing Charters</h2>
        
        <EnhancedFilterBar onFilterChange={setFilters} onViewChange={setCharterView} currentView={charterView} />

        {charterView === 'map' ? (
          <CharterMapView charters={filteredCharters} onCharterClick={setSelectedCharter} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filteredCharters.map(charter => (
              <div key={charter.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition cursor-pointer" onClick={() => setSelectedCharter(charter)}>
                <img src={charter.image} alt={charter.name} className="w-full h-48 object-cover rounded-t-xl" />
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-2">{charter.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{charter.location}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-blue-600">${charter.price}</span>
                    <Button size="sm" className="bg-gradient-to-r from-blue-600 to-cyan-600" onClick={(e) => { e.stopPropagation(); handleBooking(); }}>Book</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Stats */}
      <section className="bg-gradient-to-r from-blue-600 to-cyan-600 py-12">
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
          <div><Anchor className="w-12 h-12 mx-auto mb-2" /><div className="text-3xl font-bold">500+</div><div>Charters</div></div>
          <div><Globe className="w-12 h-12 mx-auto mb-2" /><div className="text-3xl font-bold">5 States</div><div>Coverage</div></div>
          <div><Users className="w-12 h-12 mx-auto mb-2" /><div className="text-3xl font-bold">15K+</div><div>Anglers</div></div>
          <div><Award className="w-12 h-12 mx-auto mb-2" /><div className="text-3xl font-bold">4.8★</div><div>Rating</div></div>
        </div>
      </section>

      {/* Rentals */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-4xl font-bold text-center mb-8">Boat Rentals</h2>
        <div className="flex justify-center gap-3 mb-6">
          <Button variant={rentalFilter === 'all' ? 'default' : 'outline'} onClick={() => setRentalFilter('all')}>All</Button>
          <Button variant={rentalFilter === 'paddle' ? 'default' : 'outline'} onClick={() => setRentalFilter('paddle')}>Paddle</Button>
          <Button variant={rentalFilter === 'motorized' ? 'default' : 'outline'} onClick={() => setRentalFilter('motorized')}>Motorized</Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {boatRentals.filter(r => rentalFilter === 'all' || r.category === rentalFilter).map(rental => (
            <BoatRentalCard key={rental.id} rental={rental} onClick={() => setSelectedRental(rental)} />
          ))}
        </div>
      </section>

      <SeasonalDeals />
      <TestimonialsSection />
      <NewsletterCTA />
      <FAQSection />

      {selectedCharter && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setSelectedCharter(null)}>
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-3xl font-bold mb-4">{selectedCharter.name}</h2>
            <p className="mb-4">{selectedCharter.description}</p>
            <Button className="bg-gradient-to-r from-blue-600 to-cyan-600" onClick={handleBooking}>Book Now - ${selectedCharter.price}/day</Button>
          </div>
        </div>
      )}

      {selectedRental && <RentalBookingModal rental={selectedRental} onClose={() => setSelectedRental(null)} />}
      {(showAuth || showAuthModal) && <UserAuth onClose={() => { setShowAuth(false); setShowAuthModal(false); }} />}
      {showProfile && <UserProfile onClose={() => setShowProfile(false)} />}

      {/* New Features */}
      <SocialProofNotification />
      <PWAInstallPrompt />
      <SmartChatbot />

      <Footer />
      {user?.level === 1 && showAdminPanel && <AdminPanel />}
    </div>
  );
}

