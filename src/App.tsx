import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { I18nProvider } from "@/contexts/I18nContext";
import { UserProvider } from "@/contexts/UserContext";
import { SiteSettingsProvider } from "@/contexts/SiteSettingsContext";

import DashboardSkeleton from "@/components/skeletons/DashboardSkeleton";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import PerformanceMonitor from "@/components/PerformanceMonitor";


const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const CaptainLogin = lazy(() => import("./pages/CaptainLogin"));
const ApplyCaptain = lazy(() => import("./pages/ApplyCaptain"));
const CaptainDirectory = lazy(() => import("./pages/CaptainDirectory"));
const CaptainProfile = lazy(() => import("./pages/CaptainProfile"));
const CaptainDashboard = lazy(() => import("./components/CaptainDashboard"));
const CustomerDashboard = lazy(() => import("./components/CustomerDashboard"));
const Community = lazy(() => import("./pages/Community"));
const OAuthSetupWizard = lazy(() => import("./components/OAuthSetupWizard"));
const EmailCampaignManager = lazy(() => import("./components/EmailCampaignManager"));
const MailingListManager = lazy(() => import("./components/MailingListManager"));
const SMSCampaignManager = lazy(() => import("./components/SMSCampaignManager"));
const FeatureFlagAdmin = lazy(() => import("./components/FeatureFlagAdmin"));
const UserManagementPanel = lazy(() => import("./components/admin/UserManagementPanel"));
const UserActivityAnalytics = lazy(() => import("./components/UserActivityAnalytics"));
const MarineGearShop = lazy(() => import("./pages/MarineGearShop"));
const MarineProductsAdmin = lazy(() => import("./pages/MarineProductsAdmin"));
const AffiliateAnalytics = lazy(() => import("./pages/AffiliateAnalytics"));
const SiteSettingsManager = lazy(() => import("./components/admin/SiteSettingsManager"));
const PhotoModerationPage = lazy(() => import("./pages/PhotoModerationPage"));
const LocationLanding = lazy(() => import("./pages/LocationLanding"));















const App = () => (
  <ThemeProvider defaultTheme="light">
    <I18nProvider>
      <SiteSettingsProvider>
        <UserProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <PerformanceMonitor />
            <BrowserRouter>
              <Suspense fallback={<DashboardSkeleton />}>
                <Routes>
                  <Route path="/" element={<ErrorBoundary><Index /></ErrorBoundary>} />
                  <Route path="/community" element={<ErrorBoundary><Community /></ErrorBoundary>} />
                  <Route path="/captain-login" element={<ErrorBoundary><CaptainLogin /></ErrorBoundary>} />
                  <Route path="/apply-captain" element={<ErrorBoundary><ApplyCaptain /></ErrorBoundary>} />
                  <Route path="/captains" element={<ErrorBoundary><CaptainDirectory /></ErrorBoundary>} />
                  <Route path="/captain/:id" element={<ErrorBoundary><CaptainProfile /></ErrorBoundary>} />
                  <Route path="/captain-dashboard" element={<ErrorBoundary><CaptainDashboard /></ErrorBoundary>} />
                  <Route path="/my-bookings" element={<ErrorBoundary><CustomerDashboard /></ErrorBoundary>} />
                  <Route path="/payment-success" element={<ErrorBoundary><PaymentSuccess /></ErrorBoundary>} />
                  <Route path="/admin/oauth-setup" element={<ErrorBoundary><OAuthSetupWizard /></ErrorBoundary>} />
                  <Route path="/admin/email-campaigns" element={<ErrorBoundary><EmailCampaignManager /></ErrorBoundary>} />
                  <Route path="/admin/mailing-list" element={<ErrorBoundary><MailingListManager /></ErrorBoundary>} />
                  <Route path="/admin/sms-campaigns" element={<ErrorBoundary><SMSCampaignManager /></ErrorBoundary>} />
                  <Route path="/feature-flags" element={<ErrorBoundary><FeatureFlagAdmin /></ErrorBoundary>} />
                  <Route path="/admin/user-management" element={<ErrorBoundary><UserManagementPanel /></ErrorBoundary>} />
                  <Route path="/admin/analytics" element={<ErrorBoundary><UserActivityAnalytics /></ErrorBoundary>} />
                  <Route path="/marine-gear" element={<ErrorBoundary><MarineGearShop /></ErrorBoundary>} />
                  <Route path="/admin/marine-products" element={<ErrorBoundary><MarineProductsAdmin /></ErrorBoundary>} />
                  <Route path="/admin/affiliate-analytics" element={<ErrorBoundary><AffiliateAnalytics /></ErrorBoundary>} />
                  <Route path="/admin/photo-moderation" element={<ErrorBoundary><PhotoModerationPage /></ErrorBoundary>} />
                  <Route path="/admin/site-settings" element={<ErrorBoundary><SiteSettingsManager /></ErrorBoundary>} />
                  <Route path="/charters/:location" element={<ErrorBoundary><LocationLanding /></ErrorBoundary>} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>

            </BrowserRouter>
          </TooltipProvider>
        </UserProvider>
      </SiteSettingsProvider>
    </I18nProvider>
  </ThemeProvider>
);




export default App;
