# Gulf Coast Charters - Captain Sample Data & Feature Flags Implementation

## ✅ COMPLETED FEATURES

### 1. Promotions & Leaderboards Page
- **Route**: `/promotions`
- **Features**:
  - Biggest Fish of the Month leaderboard
  - Top Affiliate Earners leaderboard
  - Most Bookings leaderboard
  - Top Rated Captains leaderboard
- **File**: `src/components/PromotionsPage.tsx`

### 2. Feature Flags Manager (Admin Panel)
- **Location**: Admin Panel > Feature Flags Manager section
- **Features**:
  - Control visibility of ALL website sections
  - Toggle pages (Promotions, Captain Directory, Marine Shop)
  - Toggle homepage sections (Hero, Featured Charters, Destinations, Testimonials, Blog)
  - Toggle features (Weather, Tide Chart, Fishing Reports, Booking System)
  - Toggle community (Message Board, Photo Contests, Events)
  - Toggle marketing (Newsletter, Referral, Loyalty Rewards)
  - Toggle monetization (Ads, Affiliate Links)
- **File**: `src/components/FeatureFlagManager.tsx`
- **Storage**: LocalStorage based (persists across sessions)

### 3. Sample Captain Data Generator
- **Edge Function**: `sample-captain-data`
- **Generates**:
  - Captain profile (Mike Johnson)
  - Sample documents (USCG License, Insurance)
  - Trip photos with fish data
  - Complete captain statistics

### 4. Email Notification Service
- **Edge Function**: `email-document-service`
- **Email Types**:
  - Booking confirmations
  - Weather alerts
  - Promotion announcements
- **Integration**: SendGrid API

## 📋 HOW TO USE AS A CAPTAIN

### Create Sample Captain Account:
```javascript
// Call the edge function to generate sample data
const { data } = await supabase.functions.invoke('sample-captain-data', {
  body: { action: 'create_sample_captain' }
});

// Returns:
// - Captain profile with email: captain.mike@gulfcoast.com
// - Sample documents (licenses, insurance)
// - Trip photos with catches
```

### Send Sample Emails:
```javascript
// Send booking confirmation
await supabase.functions.invoke('email-document-service', {
  body: {
    type: 'booking_confirmation',
    to: 'shataken@gmail.com',
    data: {
      customerName: 'John Doe',
      captainName: 'Captain Mike',
      charterName: 'Deep Sea Fishing',
      date: '2024-12-01',
      time: '7:00 AM',
      duration: 6,
      location: 'Gulf of Mexico',
      total: 850
    }
  }
});

// Send weather alert
await supabase.functions.invoke('email-document-service', {
  body: {
    type: 'weather_alert',
    to: 'shataken@gmail.com',
    data: {
      customerName: 'John Doe',
      date: '2024-12-01',
      forecast: 'Winds 15-20 mph, seas 3-5 feet'
    }
  }
});

// Send promotion
await supabase.functions.invoke('email-document-service', {
  body: {
    type: 'promotion_announcement',
    to: 'shataken@gmail.com',
    data: {
      message: 'Book your winter fishing trip and save big!',
      promoCode: 'WINTER25',
      discount: 25
    }
  }
});
```

## 🎯 ADMIN PANEL FEATURES

### Turn On/Off Website Sections:
1. Navigate to Admin Panel
2. Scroll to "Feature Flags Manager"
3. Use tabs to switch between categories:
   - **Pages**: Control entire pages (Promotions, Captain Directory, Marine Shop)
   - **Homepage**: Control homepage sections
   - **Features**: Control functional features
   - **Community**: Control community tools
   - **Marketing**: Control marketing elements
   - **Revenue**: Control monetization features
4. Toggle switches to enable/disable features
5. Changes save automatically to LocalStorage

## 📊 LEADERBOARDS DATA

The promotions page displays:
- **Biggest Fish**: Captain Mike Johnson - 287 lb Blue Marlin
- **Top Affiliate**: Captain Mike Johnson - $4,250 earned
- **Most Bookings**: Captain Mike Johnson - 156 trips
- **Top Rated**: Captain Mike Johnson - 4.9 stars (89 reviews)

## 🔧 NEXT STEPS TO COMPLETE

To fully implement the captain experience:

1. **Upload Documents via OCR**: Use existing `ocr-document-processor` function
2. **Upload Trip Photos**: Use existing photo upload components
3. **Post to Message Board**: Use existing `MessageBoard` component
4. **Check Weather**: Use existing `WeatherWidget` component
5. **View Profile**: Navigate to `/captain/captain.mike@gulfcoast.com`

## 📁 FILES MODIFIED
- `src/components/PromotionsPage.tsx` (NEW)
- `src/components/FeatureFlagManager.tsx` (NEW)
- `src/components/AdminPanel.tsx` (UPDATED - added Feature Flags section)
- `src/App.tsx` (UPDATED - added /promotions route)
- Edge function: `sample-captain-data` (NEW)
- Edge function: `email-document-service` (NEW)

## ✨ KEY FEATURES
- ✅ Promotions page with 4 leaderboards
- ✅ Feature flags for ALL website sections
- ✅ Sample captain data generator
- ✅ Email notification system (booking, weather, promotions)
- ✅ Admin control panel integration
- ✅ LocalStorage persistence for feature flags
