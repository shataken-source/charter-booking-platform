import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User, MessageCircle, GitCompare, Globe, Users, Award, Plane, Calendar, MessagesSquare, Mail, Plus, Anchor, Fish, Settings, Bell } from 'lucide-react';
import { useFeatureFlags } from '@/contexts/FeatureFlagContext';
import { useI18n } from '@/contexts/I18nContext';
import { Button } from '@/components/ui/button';

import TestimonialsSection from '@/components/TestimonialsSection';
import EmailMarketingDashboard from '@/components/EmailMarketingDashboard';
import { SendConversationEmail } from '@/components/SendConversationEmail';
import { SessionTimeoutWarning } from '@/components/SessionTimeoutWarning';
import { useSessionMonitor } from '@/hooks/useSessionMonitor';
import TrustBadges from '@/components/TrustBadges';
import FAQSection from '@/components/FAQSection';
import ExitIntentModal from '@/components/ExitIntentModal';
import { LiveAvailabilityBadge, RecentBookingTicker } from '@/components/LiveAvailability';
import HowItWorks from '@/components/HowItWorks';
import NewsletterCTA from '@/components/NewsletterCTA';
import LiveChatWidget from '@/components/LiveChatWidget';
import FishingLicensePortal from '@/components/FishingLicensePortal';
import CommunityDropdown from '@/components/CommunityDropdown';
import NotificationCenter from '@/components/NotificationCenter';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import MobileMenu from '@/components/MobileMenu';
import DestinationCrawler from '@/components/DestinationCrawler';
import ActivitySearch from '@/components/ActivitySearch';
import ScraperDashboard from '@/components/ScraperDashboard';
import AdvancedAnalyticsDashboard from '@/components/AdvancedAnalyticsDashboard';
import AutomatedEmailSequence from '@/components/AutomatedEmailSequence';
import YourAdHereBanner from '@/components/YourAdHereBanner';
import BoatRentalCard from '@/components/BoatRentalCard';
import RentalCalendarView from '@/components/RentalCalendarView';
import LicenseStorage from '@/components/LicenseStorage';
import SeasonalDeals from '@/components/SeasonalDeals';
import AIRecommendations from '@/components/AIRecommendations';
import ReferralLeaderboard from '@/components/ReferralLeaderboard';
import LocalGuides from '@/components/LocalGuides';
import TravelBlog from '@/components/TravelBlog';
import PremiumMembership from '@/components/PremiumMembership';
import RealtimeMessenger from '@/components/RealtimeMessenger';
import MessageBoard from '@/components/MessageBoard';
import AdSpots from '@/components/AdSpots';
import SocialMediaBar from '@/components/SocialMediaBar';
import RentalBookingModal from '@/components/RentalBookingModal';
import UserAuth from '@/components/UserAuth';
import UserProfile from '@/components/UserProfile';
import Footer from '@/components/Footer';
import AdminPanel from '@/components/AdminPanel';
import CatchOfTheDay from '@/components/CatchOfTheDay';
import FishingReports from '@/components/FishingReports';
import FeaturedPhotoCarousel from '@/components/FeaturedPhotoCarousel';
import TripPhotoGallery from '@/components/TripPhotoGallery';
import TripAlbumManager from '@/components/TripAlbumManager';
import TripPhotoUpload from '@/components/TripPhotoUpload';



import { useUser } from '@/hooks/useStoreCompat';
import { useUser as useUserContext } from '@/contexts/UserContext';
import { useRequireAuth } from '@/hooks/useRequireAuth';

import { destinations as mockDestinations } from '@/data/mockDestinations';
import { featuredCharters } from '@/data/featuredCharters';
import { boatRentals } from '@/data/boatRentals';

export default function AppLayout() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useUser();
  const { showAuthModal, setShowAuthModal } = useUserContext();
  const { requireAuth } = useRequireAuth();
  const { t } = useI18n();
  const { isFeatureEnabled } = useFeatureFlags();



  // Initialize session monitoring for authenticated users
  const { 
    showWarning, 
    remainingSeconds, 
    handleExtend, 
    handleLogout 
  } = useSessionMonitor();

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCrawler, setShowCrawler] = useState(false);
  const [showMessageBoard, setShowMessageBoard] = useState(false);
  const [showMessenger, setShowMessenger] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showEmailMarketing, setShowEmailMarketing] = useState(false);
  const [showAddCharter, setShowAddCharter] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [compareList, setCompareList] = useState<any[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [selectedDestination, setSelectedDestination] = useState<any>(null);
  const [selectedCharter, setSelectedCharter] = useState<any>(null);
  const [selectedRental, setSelectedRental] = useState<any>(null);
  const [rentalFilter, setRentalFilter] = useState<'all' | 'paddle' | 'motorized'>('all');
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: [0, 10000] as [number, number],
    guests: 1,
    location: '',
    type: 'all'
  });


  // Exit intent detection
  useEffect(() => {
    const hasSeenExitIntent = localStorage.getItem('exit_intent_shown');
    if (hasSeenExitIntent) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !showExitIntent) {
        setShowExitIntent(true);
        localStorage.setItem('exit_intent_shown', 'true');
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [showExitIntent]);







  // Filter destinations based on selected activities
  const filteredDestinations = selectedActivities.length > 0
    ? mockDestinations.filter(dest => 
        selectedActivities.some(activity => dest.activities.includes(activity))
      )
    : mockDestinations;


  const handleSearch = (activities: string[], searchTerm: string = '') => {
    setSelectedActivities(activities);
    console.log('Searching for activities:', activities, 'with term:', searchTerm);
  };


  const handleAddToCompare = (id: string) => {
    setCompareList(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleRemoveFromCompare = (id: string) => {
    setCompareList(prev => prev.filter(i => i !== id));
  };

  const handleBooking = () => {
    requireAuth(() => {
      alert('Booking functionality - integrate with your booking system!');
    }, 'Please login or create an account to book a charter');
  };


  const handleActivityClick = (activity: string) => {
    // Close the modal first
    setSelectedDestination(null);
    // Filter by the clicked activity
    handleSearch([activity]);
    // Scroll to destinations section after a brief delay to allow modal to close
    setTimeout(() => {
      const element = document.getElementById('destinations');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };




  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 text-white shadow-xl sticky top-0 z-30 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="bg-white/10 backdrop-blur-md rounded-full p-2">
                <Anchor className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold tracking-tight">Gulf Coast Charters</div>
                <div className="text-xs text-blue-100">Premier Fishing Adventures</div>
              </div>
            </div>
            <div className="hidden md:flex space-x-6 items-center">
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-blue-100 transition font-medium">{t('nav.home')}</button>
              <button onClick={() => document.getElementById('charters')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-blue-100 transition font-medium">Charters</button>
              <button onClick={() => navigate('/captains')} className="hover:text-blue-100 transition font-medium">Captains</button>
              <button onClick={() => navigate('/marine-gear')} className="hover:text-blue-100 transition font-medium">Marine Gear</button>

              <CommunityDropdown 
                onShowMessageBoard={() => setShowMessageBoard(true)}
                onScrollToMessenger={() => {
                  const element = document.getElementById('community-chat');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
              />

              <Button 
                variant="ghost" 
                className="text-white hover:bg-white/10 font-medium" 
                onClick={() => navigate('/apply-captain')}
              >
                <Anchor className="w-4 h-4 mr-2" />
                Become a Captain
              </Button>

              <Button 
                variant="ghost" 
                className="text-white hover:bg-white/10 font-medium" 
                onClick={() => navigate('/captain-login')}
              >
                <User className="w-4 h-4 mr-2" />
                Captain Login
              </Button>


              {isAuthenticated ? (
                <>
                  <NotificationCenter />
                  
                  {user?.level === 1 && (
                    <>
                      <Button variant="ghost" className="text-white hover:bg-white/10" onClick={() => setShowAdminPanel(!showAdminPanel)}>
                        <Award className="w-4 h-4 mr-2" />
                        Admin Panel
                      </Button>
                      <Button variant="ghost" className="text-white hover:bg-white/10" onClick={() => navigate('/feature-flags')}>
                        <Settings className="w-4 h-4 mr-2" />
                        Feature Flags
                      </Button>
                    </>
                  )}

                  <Button variant="ghost" className="text-white hover:bg-white/10" onClick={() => navigate('/my-bookings')}>
                    <Calendar className="w-4 h-4 mr-2" />
                    {t('dashboard.bookings')}
                  </Button>
                  <Button variant="ghost" className="text-white hover:bg-white/10" onClick={() => setShowProfile(true)}>
                    <User className="w-4 h-4 mr-2" />
                    {user?.name}
                  </Button>
                </>

              ) : (
                <Button className="bg-white text-blue-600 hover:bg-blue-50 font-semibold shadow-lg" onClick={() => setShowAuth(true)}>
                  <User className="w-4 h-4 mr-2" />
                  Login / Sign Up
                </Button>
              )}
              <LanguageSwitcher />
            </div>

            <button onClick={() => setMobileMenuOpen(true)} className="md:hidden text-2xl">☰</button>
          </div>
        </div>
      </nav>

      <MobileMenu 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)}
        onShowCrawler={() => setShowCrawler(!showCrawler)}
        onShowMessageBoard={() => setShowMessageBoard(!showMessageBoard)}
        onShowAuth={() => setShowAuth(true)}
        onShowProfile={() => setShowProfile(true)}
        onShowComparison={() => setShowComparison(true)}
        isAuthenticated={isAuthenticated}
        userName={user?.name}
        compareCount={compareList.length}
      />

      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/70 via-cyan-900/60 to-blue-800/70 z-10"></div>
        <img
          src="https://d64gsuwffb70l.cloudfront.net/6918960e54362d714f32b6fc_1763349026286_fce8a245.webp"
          alt="Gulf Coast Fishing Charter"
          className="absolute inset-0 w-full h-full object-cover scale-105 animate-subtle-zoom"
        />
        <div className="relative z-20 text-center px-4 max-w-5xl">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 drop-shadow-2xl leading-tight">
            Gulf Coast's Premier<br />Fishing Charters
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-blue-50 font-light">
            From Texas to Florida - Book your unforgettable fishing adventure today
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 font-semibold text-lg px-8 py-6 shadow-2xl" onClick={() => document.getElementById('charters')?.scrollIntoView({ behavior: 'smooth' })}>
              Browse Charters
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 font-semibold text-lg px-8 py-6 backdrop-blur-sm" onClick={() => setShowAuth(true)}>
              Book Now
            </Button>
          </div>
        </div>
      </section>




      {/* AI Crawler Section */}
      {showCrawler && (
        <section className="container mx-auto px-4 mb-16">
          <DestinationCrawler />
        </section>
      )}

      {/* Activity Search */}
      <section className="container mx-auto px-4 mb-16">
        <ActivitySearch onSearch={handleSearch} />
      </section>

      {/* Send Transcript Button - Admin Only */}
      {user?.level === 1 && (
        <>
          <section className="container mx-auto px-4 mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold mb-3">Email Conversation Summary</h3>
              <p className="text-gray-600 mb-4">Send a complete summary of this development conversation</p>
              <SendConversationEmail />
            </div>
          </section>

          {/* Scraper Dashboard - Admin Only */}
          <section className="container mx-auto px-4 mb-8">
            <ScraperDashboard />
          </section>

          {/* Email Marketing Dashboard - Admin Only */}
          <section className="container mx-auto px-4 mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Email Marketing System</h2>
                <Button onClick={() => setShowEmailMarketing(!showEmailMarketing)}>
                  {showEmailMarketing ? 'Hide' : 'Show'} Email Marketing
                </Button>
              </div>
              {showEmailMarketing && <EmailMarketingDashboard />}

            </div>
          </section>

          {/* Advanced Analytics Dashboard - Admin Only */}
          <section className="container mx-auto px-4 mb-8">
            <AdvancedAnalyticsDashboard />
          </section>

          {/* Automated Email Sequences - Admin Only */}
          <section className="container mx-auto px-4 mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Automated Email Sequences</h2>
              <AutomatedEmailSequence />
            </div>
          </section>
        </>
      )}


      {/* Trust Badges Section */}
      <TrustBadges />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Recent Booking Ticker */}
      <section className="container mx-auto px-4 mb-8">
        <RecentBookingTicker />
      </section>

      {/* Ad Banner - Your Ad Here */}
      <section className="container mx-auto px-4 mb-16">
        <YourAdHereBanner format="horizontal" />
      </section>

      {/* Featured Charters Section */}
      <section id="charters" className="container mx-auto px-4 py-16 mb-16">

        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Gulf Coast Fishing Charters
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            From Texas to Florida - Professional captains, top-rated boats, and unforgettable fishing experiences
          </p>
        </div>


        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuredCharters.map(charter => (
            <div key={charter.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group"
              onClick={() => setSelectedCharter(charter)}>
              <div className="relative overflow-hidden">
                <img src={charter.image} alt={charter.name} className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-blue-600">
                  {charter.type}
                </div>
                <div className="absolute bottom-3 left-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                  ★ {charter.rating}
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-2xl font-bold mb-2 text-gray-900">{charter.name}</h3>
                <p className="text-gray-600 text-sm mb-3 flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  {charter.location}
                </p>
                <p className="text-gray-700 text-sm mb-4 line-clamp-2">{charter.description}</p>
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">${charter.price}</div>
                    <div className="text-xs text-gray-500">per day</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-700">{charter.guests} Guests</div>
                    <Button size="sm" className="mt-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700" onClick={(e) => {
                      e.stopPropagation();
                      handleBooking();
                    }}>
                      Book Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-blue-600 to-cyan-600 py-16 mb-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div className="transform hover:scale-105 transition">
              <Anchor className="w-14 h-14 mx-auto mb-3 opacity-90" />
              <div className="text-4xl font-bold mb-1">500+</div>
              <div className="text-blue-100 font-medium">Charter Boats</div>
            </div>
            <div className="transform hover:scale-105 transition">
              <Globe className="w-14 h-14 mx-auto mb-3 opacity-90" />
              <div className="text-4xl font-bold mb-1">5 States</div>
              <div className="text-blue-100 font-medium">Gulf Coast Coverage</div>
            </div>
            <div className="transform hover:scale-105 transition">
              <Users className="w-14 h-14 mx-auto mb-3 opacity-90" />
              <div className="text-4xl font-bold mb-1">15K+</div>
              <div className="text-blue-100 font-medium">Happy Anglers</div>
            </div>
            <div className="transform hover:scale-105 transition">
              <Award className="w-14 h-14 mx-auto mb-3 opacity-90" />
              <div className="text-4xl font-bold mb-1">4.8★</div>
              <div className="text-blue-100 font-medium">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Inshore Boat Rentals Section */}
      <section id="rentals" className="container mx-auto px-4 py-16 mb-16">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Inshore Boat Rentals
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Explore the inland waterways at your own pace - Kayaks, paddleboards, pontoons, and fishing boats
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center gap-3 mb-8">
          <Button
            variant={rentalFilter === 'all' ? 'default' : 'outline'}
            onClick={() => setRentalFilter('all')}
            className="px-6"
          >
            All Rentals
          </Button>
          <Button
            variant={rentalFilter === 'paddle' ? 'default' : 'outline'}
            onClick={() => setRentalFilter('paddle')}
            className="px-6"
          >
            Paddle Craft
          </Button>
          <Button
            variant={rentalFilter === 'motorized' ? 'default' : 'outline'}
            onClick={() => setRentalFilter('motorized')}
            className="px-6"
          >
            Motorized Boats
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {boatRentals
            .filter(rental => rentalFilter === 'all' || rental.category === rentalFilter)
            .map(rental => (
              <BoatRentalCard
                key={rental.id}
                rental={rental}
                onClick={() => setSelectedRental(rental)}
              />
            ))}
        </div>
      </section>

      {/* Rental Calendar View Section */}
      <section id="rental-calendar" className="container mx-auto px-4 py-16 mb-16">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Rental Calendar
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Check availability and plan your boat rental adventure
          </p>
        </div>
        <RentalCalendarView />
      </section>

      {/* License Storage Section */}
      {isAuthenticated && (
        <section id="license-storage" className="container mx-auto px-4 py-16 mb-16">
          <LicenseStorage />
        </section>
      )}

      {/* Fishing License Portal Section */}
      <section id="fishing-license" className="container mx-auto px-4 py-16 mb-16 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl">
        <FishingLicensePortal />
      </section>


      {/* Destinations Grid */}

      <section id="destinations" className="container mx-auto px-4 mb-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            {selectedActivities.length > 0 ? 'Matching Destinations' : 'Popular Destinations'}
          </h2>
          <p className="text-gray-600 text-lg">
            {selectedActivities.length > 0
              ? `Found ${filteredDestinations.length} destinations for your activities`
              : 'Discover amazing places around the world'}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDestinations.map(destination => (
            <div key={destination.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer"
              onClick={() => setSelectedDestination(destination)}>
              <img src={destination.image} alt={destination.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2">{destination.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{destination.country}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {destination.activities.slice(0, 3).map(activity => (
                    <span key={activity} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">{activity}</span>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-blue-600">${destination.avgCost}</span>
                  <span className="text-yellow-500">★ {destination.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredDestinations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No destinations found. Try selecting different activities!</p>
          </div>
        )}
      </section>

      {/* Community Catch of the Day Section */}
      <section id="catch-of-day" className="container mx-auto px-4 py-16 mb-16 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Catch of the Day
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            See what our anglers are catching! Share your trophy catches and connect with the community
          </p>
        </div>
        <CatchOfTheDay />
      </section>

      {/* Live Fishing Reports Section */}
      <section id="fishing-reports" className="container mx-auto px-4 py-16 mb-16">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Live Fishing Reports
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Real-time conditions and catches from captains and anglers on the water
          </p>
        </div>
        <FishingReports />
      </section>

      {/* Featured Photo Carousel Section */}
      <section id="featured-photos" className="container mx-auto px-4 py-16 mb-16">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Featured Trip Photos
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Stunning catches and memorable moments from our fishing community
          </p>
        </div>
        <FeaturedPhotoCarousel />
      </section>

      {/* Trip Photo Gallery Section */}
      <section id="trip-gallery" className="container mx-auto px-4 py-16 mb-16 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Community Photo Gallery
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Browse thousands of fishing trip photos shared by our community
          </p>
        </div>
        <TripPhotoGallery />
      </section>

      {/* Trip Album Manager - Authenticated Users Only */}
      {isAuthenticated && (
        <section id="my-albums" className="container mx-auto px-4 py-16 mb-16">
          <TripAlbumManager />
          <div className="mt-8">
            <h3 className="text-2xl font-bold mb-6">Upload Trip Photos</h3>
            <TripPhotoUpload onUploadComplete={(photos) => console.log('Uploaded:', photos)} />
          </div>
        </section>
      )}

      {/* Seasonal Deals Section */}


      {/* Seasonal Deals Section */}
      <SeasonalDeals />

      {/* AI Recommendations Section */}
      <section className="container mx-auto px-4 mb-16">
        <AIRecommendations 
          preferences={selectedActivities} 
          budget={filters.priceRange[1]} 
          travelerType="explorer" 
        />
      </section>
      
      {/* Referral Leaderboard Section */}
      <section className="container mx-auto px-4 mb-16">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-4">Top Referrers</h2>
          <p className="text-gray-600 text-lg">Earn $25 for every friend who books. Your friend gets $10 off!</p>
        </div>
        <div className="max-w-2xl mx-auto">
          <ReferralLeaderboard />
        </div>
      </section>


      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Newsletter CTA */}
      <NewsletterCTA />

      {/* FAQ Section */}
      <FAQSection />

      {/* Local Guides Section */}
      <LocalGuides />

      {/* Travel Blog Section */}
      <TravelBlog />

      {/* Premium Membership Section */}
      <PremiumMembership />

      {/* Real-time Messenger Section */}
      <section id="community-chat" className="container mx-auto px-4 mb-16">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-4">Travel Community Chat</h2>
          <p className="text-gray-600 text-lg">Connect with fellow travelers in real-time</p>
        </div>
        <RealtimeMessenger />
      </section>

      {/* Message Board Section */}
      {showMessageBoard && (
        <section id="community" className="container mx-auto px-4 mb-16">
          <MessageBoard />
        </section>
      )}

      {/* Advertising Section */}
      <section id="advertise" className="mb-16">
        <AdSpots />
      </section>

      {/* Social Media Bar */}
      <SocialMediaBar />

      {/* Live Chat Widget */}
      <LiveChatWidget />

      {/* Exit Intent Modal */}
      {showExitIntent && <ExitIntentModal onClose={() => setShowExitIntent(false)} />}



      {/* Charter Detail Modal */}
      {selectedCharter && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedCharter(null)}>
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              <img src={selectedCharter.image} alt={selectedCharter.name} className="w-full h-80 object-cover rounded-t-2xl" />
              <button onClick={() => setSelectedCharter(null)} className="absolute top-4 right-4 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition">
                <User className="w-6 h-6" />
              </button>
            </div>
            <div className="p-8">
              <h2 className="text-4xl font-bold mb-4">{selectedCharter.name}</h2>
              <p className="text-gray-700 mb-4">{selectedCharter.description}</p>
              <div className="flex gap-4">
                <Button size="lg" className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600" onClick={handleBooking}>
                  Book Now - ${selectedCharter.price}/day
                </Button>
                <Button size="lg" variant="outline" onClick={() => setSelectedCharter(null)}>Close</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rental Booking Modal */}
      {selectedRental && (
        <RentalBookingModal rental={selectedRental} onClose={() => setSelectedRental(null)} />
      )}


      {/* Auth Modal - Controlled by both local state and context */}
      {(showAuth || showAuthModal) && (
        <UserAuth 
          onClose={() => {
            setShowAuth(false);
            setShowAuthModal(false);
            sessionStorage.removeItem('authMessage');
            sessionStorage.removeItem('authReturnAction');
          }} 
        />
      )}
      
      {/* Profile Modal */}
      {showProfile && <UserProfile onClose={() => setShowProfile(false)} />}


      {/* Session Timeout Warning Modal - Only for authenticated users */}
      {isAuthenticated && (
        <SessionTimeoutWarning
          isOpen={showWarning}
          remainingSeconds={remainingSeconds}
          onExtend={handleExtend}
          onLogout={handleLogout}
        />
      )}

      <Footer />
      {user?.level === 1 && showAdminPanel && <AdminPanel />}

    </div>
  );
}

