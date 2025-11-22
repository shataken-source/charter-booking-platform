# Enhanced Vessel Management System
## Support for All Watercraft Types - Charter Fishing + Inland Waterways

---

## 📋 Vessel Categories Supported

### 🎣 Charter Fishing Vessels
- Offshore Sport Fishing Boats
- Inshore Fishing Boats
- Bay Boats
- Center Console Boats
- Party Boats / Head Boats

### 🌊 Inland Waterway Vessels (NEW!)
- **PWC (Personal Watercraft)** - Jet Skis, WaveRunners
- **Pontoon Boats** - Party pontoons, fishing pontoons
- **Ski Boats** - Wakeboard boats, ski boats
- **Deck Boats** - Recreation, family cruising
- **Bowriders** - Runabouts, day cruisers
- **Kayaks & Paddleboards** - Individual rentals
- **Sailboats** - Small sailboats, catamarans

---

## 🗄️ Database Schema Enhancement

### Vessels Table (Enhanced)

```sql
CREATE TABLE vessels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  captain_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Basic Information
  vessel_name TEXT NOT NULL,
  vessel_type VARCHAR(50) NOT NULL, -- See vessel types below
  vessel_category VARCHAR(50) NOT NULL, -- 'charter_fishing', 'inland_waterway', 'sailboat'
  
  -- Specifications
  make VARCHAR(100),
  model VARCHAR(100),
  year INTEGER,
  length_feet DECIMAL(5, 2),
  beam_feet DECIMAL(5, 2),
  draft_feet DECIMAL(5, 2),
  
  -- Capacity
  max_passengers INTEGER NOT NULL,
  max_weight_lbs INTEGER,
  
  -- Engine/Propulsion
  engine_type VARCHAR(50), -- 'outboard', 'inboard', 'jet', 'sail', 'electric'
  engine_count INTEGER DEFAULT 1,
  horsepower INTEGER,
  fuel_type VARCHAR(50), -- 'gas', 'diesel', 'electric'
  fuel_capacity_gallons DECIMAL(6, 2),
  
  -- Features & Amenities
  features JSONB DEFAULT '[]', -- Array of feature IDs
  amenities JSONB DEFAULT '[]', -- Bathroom, shower, kitchen, etc.
  
  -- Safety Equipment
  safety_equipment JSONB DEFAULT '[]', -- Life jackets, fire extinguisher, etc.
  uscg_certified BOOLEAN DEFAULT false,
  last_inspection_date DATE,
  
  -- Fishing-specific (if applicable)
  fishing_features JSONB, -- Rod holders, live wells, fish finder, etc.
  
  -- Water Sports (if applicable)
  watersports_equipment JSONB, -- Skis, wakeboards, tubes, etc.
  
  -- Pricing
  hourly_rate DECIMAL(10, 2),
  half_day_rate DECIMAL(10, 2),
  full_day_rate DECIMAL(10, 2),
  weekly_rate DECIMAL(10, 2),
  deposit_percentage INTEGER DEFAULT 20,
  
  -- Availability
  available_for_rental BOOLEAN DEFAULT true,
  available_days JSONB DEFAULT '["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]',
  operating_area TEXT, -- "Gulf Coast", "Lake Martin", "Intracoastal Waterway", etc.
  
  -- Location
  home_port TEXT,
  marina_name TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Photos & Media
  photos TEXT[] DEFAULT '{}',
  primary_photo TEXT,
  video_url TEXT,
  
  -- Insurance & Documentation
  insurance_company TEXT,
  insurance_policy TEXT,
  insurance_expiry DATE,
  registration_number TEXT,
  registration_state VARCHAR(2),
  
  -- Status
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'maintenance', 'retired'
  listed BOOLEAN DEFAULT true,
  verified BOOLEAN DEFAULT false,
  
  -- Metadata
  description TEXT,
  rules TEXT, -- Rental rules and restrictions
  cancellation_policy TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_vessels_captain ON vessels(captain_id);
CREATE INDEX idx_vessels_type ON vessels(vessel_type);
CREATE INDEX idx_vessels_category ON vessels(vessel_category);
CREATE INDEX idx_vessels_location ON vessels(latitude, longitude);
CREATE INDEX idx_vessels_status ON vessels(status, listed);
CREATE INDEX idx_vessels_available ON vessels(available_for_rental, status);
```

---

## 🚤 Vessel Types Enum

```sql
CREATE TYPE vessel_type AS ENUM (
  -- Charter Fishing
  'offshore_sportfish',
  'inshore_fishing',
  'bay_boat',
  'center_console',
  'party_boat',
  
  -- PWC
  'jet_ski',
  'waverunner',
  'seadoo',
  
  -- Pontoon
  'party_pontoon',
  'fishing_pontoon',
  'tritoon',
  
  -- Ski/Wake
  'ski_boat',
  'wakeboard_boat',
  'wake_surf_boat',
  
  -- Deck/Bowrider
  'deck_boat',
  'bowrider',
  'runabout',
  'cuddy_cabin',
  
  -- Sailboat
  'sailboat_small',
  'sailboat_large',
  'catamaran',
  
  -- Paddle
  'kayak_single',
  'kayak_tandem',
  'paddleboard',
  'canoe',
  
  -- Other
  'yacht',
  'houseboat',
  'other'
);
```

---

## 🎯 Feature Categories

### Standard Features (All Vessels)
```json
{
  "features": [
    "gps_navigation",
    "vhf_radio",
    "depth_finder",
    "anchor",
    "first_aid_kit",
    "life_jackets",
    "fire_extinguisher",
    "throwable_flotation",
    "sound_system",
    "bimini_top",
    "swim_ladder"
  ]
}
```

### Fishing Features
```json
{
  "fishing_features": [
    "rod_holders",
    "live_well",
    "fish_finder",
    "trolling_motor",
    "downriggers",
    "outriggers",
    "fish_cleaning_station",
    "coolers",
    "tackle_storage",
    "fighting_chair",
    "tuna_tower"
  ]
}
```

### Water Sports Features
```json
{
  "watersports_equipment": [
    "water_skis",
    "wakeboard",
    "wake_surf_board",
    "knee_board",
    "tube_towable",
    "tow_rope",
    "ski_pole",
    "wakesurf_ballast",
    "tower_speakers",
    "board_racks"
  ]
}
```

### Comfort Amenities
```json
{
  "amenities": [
    "bathroom",
    "shower",
    "cabin",
    "galley",
    "refrigerator",
    "air_conditioning",
    "heating",
    "dining_area",
    "sleeping_berths",
    "generator",
    "shore_power",
    "wifi"
  ]
}
```

---

## 📝 Example Vessel Listings

### Example 1: PWC Rental
```javascript
{
  vessel_name: "Yamaha VX Cruiser #3",
  vessel_type: "waverunner",
  vessel_category: "inland_waterway",
  make: "Yamaha",
  model: "VX Cruiser",
  year: 2023,
  length_feet: 11.3,
  max_passengers: 3,
  engine_type: "jet",
  horsepower: 180,
  fuel_type: "gas",
  features: ["gps_navigation", "storage_compartment", "reverse", "cruise_control"],
  hourly_rate: 99.00,
  half_day_rate: 299.00, // 4 hours
  full_day_rate: 499.00, // 8 hours
  operating_area: "Gulf Shores beaches, intracoastal waterway",
  home_port: "Gulf Shores Marina",
  description: "Brand new 2023 Yamaha VX Cruiser. Perfect for cruising the coast or exploring the intracoastal. Easy to operate, stable, and fun!",
  rules: "Must be 18+ to operate. Renters under 21 require guardian signature. Life jackets provided and must be worn.",
  cancellation_policy: "Full refund 48 hours in advance. 50% refund 24 hours. No refund same day."
}
```

### Example 2: Pontoon Boat
```javascript
{
  vessel_name: "Party Barge 24",
  vessel_type: "party_pontoon",
  vessel_category: "inland_waterway",
  make: "Sun Tracker",
  model: "Party Barge 24 DLX",
  year: 2022,
  length_feet: 24,
  beam_feet: 8.5,
  max_passengers: 12,
  engine_type: "outboard",
  horsepower: 150,
  fuel_type: "gas",
  features: ["bimini_top", "sound_system", "swim_ladder", "anchor", "cooler_storage"],
  amenities: ["changing_room", "sink", "table"],
  watersports_equipment: ["tube_towable", "tow_rope"],
  hourly_rate: 149.00,
  half_day_rate: 449.00,
  full_day_rate: 699.00,
  operating_area: "Lake Martin, Alabama",
  description: "Spacious 24ft party pontoon perfect for family outings! Seats 12 comfortably. Includes tube for towing. Bluetooth speakers, bimini for shade.",
  rules: "Captain must be 25+ with valid boating license. No glass containers. Maximum 12 people.",
  cancellation_policy: "Full refund 72 hours notice. 50% refund 24-72 hours. No refund within 24 hours."
}
```

### Example 3: Wake Boat
```javascript
{
  vessel_name: "Malibu Wakesetter",
  vessel_type: "wakeboard_boat",
  vessel_category: "inland_waterway",
  make: "Malibu",
  model: "Wakesetter 23 LSV",
  year: 2021,
  length_feet: 23,
  max_passengers: 15,
  engine_type: "inboard",
  horsepower: 450,
  fuel_type: "gas",
  features: ["surf_system", "tower_speakers", "tower", "ballast_system", "cruise_control"],
  watersports_equipment: [
    "wake_surf_board",
    "wakeboard", 
    "water_skis",
    "knee_board",
    "tube_towable",
    "multiple_tow_ropes"
  ],
  hourly_rate: 249.00,
  half_day_rate: 749.00,
  full_day_rate: 1199.00,
  operating_area: "Lake Martin",
  description: "Premium Malibu wakeboard/surf boat with surf system. Perfect wake every time! Includes all equipment: boards, skis, tubes. Professional instruction available.",
  rules: "Experienced wakeboat operator required or captain service available ($100/hr)."
}
```

### Example 4: Charter Fishing Boat (Original)
```javascript
{
  vessel_name: "Reel Deal",
  vessel_type: "offshore_sportfish",
  vessel_category: "charter_fishing",
  make: "Contender",
  model: "39 ST",
  year: 2020,
  length_feet: 39,
  beam_feet: 12.6,
  max_passengers: 6,
  engine_type: "outboard",
  engine_count: 3,
  horsepower: 1050, // Total
  fuel_type: "gas",
  fishing_features: [
    "rod_holders",
    "live_well",
    "fish_finder",
    "outriggers",
    "fish_cleaning_station",
    "fighting_chair",
    "tuna_tower"
  ],
  amenities: ["bathroom", "cabin", "air_conditioning"],
  half_day_rate: 800.00, // 4 hours
  full_day_rate: 1400.00, // 8 hours
  operating_area: "Gulf of Mexico - Orange Beach to Pensacola",
  description: "39ft Contender center console. Target snapper, grouper, tuna, mahi. All tackle included. USCG certified captain.",
  rules: "Fishing license included. Bring food/drinks. We clean your catch."
}
```

---

## 🎨 Booking Flow by Vessel Type

### Charter Fishing
```
1. Select date & duration (half day / full day)
2. Choose target species (optional)
3. Number of anglers (max 6)
4. Add-ons: Fish cleaning, photos, tackle upgrade
5. Pay deposit (20%)
6. Balance due 3 days before trip
```

### PWC / Jet Ski
```
1. Select date & time
2. Choose duration (hourly / half-day / full-day)
3. Number of units (1-4 jet skis)
4. Safety briefing scheduled
5. Valid driver's license required
6. Pay full amount upfront
```

### Pontoon / Ski Boat
```
1. Select date
2. Choose duration (half-day / full-day / multi-day)
3. With captain OR bareboat rental
4. Number of passengers
5. Add-ons: Water toys, fishing gear
6. Pay deposit (30%)
7. Balance due 7 days before
```

---

## 📊 Enhanced Search & Filters

### Search Parameters
```javascript
const searchFilters = {
  // Basic
  vessel_category: ['charter_fishing', 'inland_waterway', 'sailboat'],
  vessel_type: ['pontoon', 'jet_ski', 'ski_boat', etc.],
  
  // Dates & Duration
  start_date: '2024-12-01',
  end_date: '2024-12-07',
  duration: 'half_day', // 'hourly', 'half_day', 'full_day', 'multi_day'
  
  // Capacity
  min_passengers: 4,
  max_passengers: 12,
  
  // Location
  location: 'Gulf Shores, AL',
  radius_miles: 50,
  waterway: 'Lake Martin', // Or 'Gulf Coast', 'Intracoastal'
  
  // Price
  max_hourly_rate: 200,
  max_daily_rate: 1000,
  
  // Features (ANY match)
  required_features: ['bathroom', 'sound_system'],
  
  // Fishing-specific
  fishing_types: ['offshore', 'inshore'],
  target_species: ['redfish', 'snapper'],
  
  // Water sports
  watersports: ['wakeboard', 'tube'],
  
  // Certifications
  uscg_certified: true,
  captain_included: true, // Or available
  bareboat_available: true
};
```

---

## 🔌 API Endpoints (Enhanced)

### Search Vessels
```javascript
POST /api/vessels/search

Request:
{
  category: "inland_waterway",
  vessel_types: ["pontoon", "deck_boat"],
  date: "2024-12-15",
  duration: "full_day",
  passengers: 8,
  location: { lat: 30.2736, lon: -87.5928 },
  radius: 25,
  features: ["bathroom", "bimini_top"]
}

Response:
{
  success: true,
  vessels: [
    {
      id: "uuid",
      vessel_name: "Party Barge 24",
      vessel_type: "party_pontoon",
      photos: ["https://..."],
      rating: 4.8,
      reviews_count: 127,
      pricing: {
        hourly: 149,
        half_day: 449,
        full_day: 699
      },
      captain: {
        name: "Captain Mike",
        rating: 4.9,
        experience_years: 15
      },
      distance_miles: 2.3,
      available: true
    }
  ],
  total: 18,
  filters_applied: {...}
}
```

### Get Vessel Details
```javascript
GET /api/vessels/:id

Response:
{
  success: true,
  vessel: {
    // All vessel details
    id: "uuid",
    vessel_name: "Party Barge 24",
    vessel_type: "party_pontoon",
    specifications: {
      make: "Sun Tracker",
      model: "Party Barge 24 DLX",
      year: 2022,
      length_feet: 24,
      max_passengers: 12
    },
    features: [...],
    amenities: [...],
    pricing: {...},
    availability_calendar: {
      "2024-12-15": { available: true, price: 699 },
      "2024-12-16": { available: false },
      ...
    },
    captain: {
      id: "uuid",
      name: "Captain Mike",
      bio: "...",
      certifications: [...],
      rating: 4.9,
      total_trips: 450
    },
    reviews: [...]
  }
}
```

---

## 💡 Captain Dashboard Enhancements

### Multi-Vessel Management
```javascript
// Captain can manage multiple vessel types
const captainFleet = [
  {
    category: "charter_fishing",
    vessels: [
      { name: "Reel Deal", type: "offshore_sportfish" },
      { name: "Bay Runner", type: "inshore_fishing" }
    ]
  },
  {
    category: "inland_waterway",
    vessels: [
      { name: "Party Barge 24", type: "pontoon" },
      { name: "Yamaha VX #1", type: "jet_ski" },
      { name: "Yamaha VX #2", type: "jet_ski" },
      { name: "Yamaha VX #3", type: "jet_ski" }
    ]
  }
];

// Captain features:
// - Bulk calendar management across fleet
// - Pricing rules (peak season, weekday/weekend)
// - Automatic booking coordination
// - Maintenance scheduling per vessel
// - Individual vessel analytics
```

---

## 🎣 User Benefits

### For Charter Fishing Customers:
- ✅ Find offshore/inshore fishing charters
- ✅ See captain experience & certifications
- ✅ Read trip reports from past customers
- ✅ Target species-based search
- ✅ All tackle & licenses included

### For Inland Waterway Customers:
- ✅ Rent jet skis, pontoons, ski boats
- ✅ Choose hourly, half-day, or full-day
- ✅ Option for captain or bareboat
- ✅ Water sports equipment included
- ✅ Perfect for lake vacations

### For All Customers:
- ✅ One platform for all water activities
- ✅ Compare prices & features easily
- ✅ Verified captains & vessels
- ✅ Insurance coverage included
- ✅ Weather alerts & safety info
- ✅ Easy booking & payment

---

## 🚀 Implementation Priority

### Phase 1: Database & Backend (Week 1)
- [x] Enhance vessels table schema
- [ ] Create vessel type enums
- [ ] Add search API with filters
- [ ] Implement availability calendar
- [ ] Add pricing rules engine

### Phase 2: Captain Tools (Week 2)
- [ ] Multi-vessel management UI
- [ ] Bulk calendar editor
- [ ] Pricing strategy builder
- [ ] Maintenance tracker
- [ ] Fleet analytics dashboard

### Phase 3: User Experience (Week 3)
- [ ] Category-based browsing
- [ ] Advanced search filters
- [ ] Vessel comparison tool
- [ ] Interactive maps
- [ ] Photo galleries

### Phase 4: Booking & Payment (Week 4)
- [ ] Different booking flows per category
- [ ] Hourly pricing support
- [ ] Multi-day rentals
- [ ] Equipment add-ons
- [ ] Deposit & balance handling

---

## 🎯 Success Metrics

### Expansion Goals:
- **Month 1:** 50 inland waterway vessels listed
- **Month 3:** 200 vessels across all categories
- **Month 6:** 500+ vessels, 50% inland waterway
- **Year 1:** 2,000 vessels, balanced mix

### Revenue Impact:
- PWC rentals: $99-$499/day × 20 units = ~$3,000/day potential
- Pontoon rentals: $449-$699/day × 30 units = ~$16,000/day potential
- Ski boat rentals: $749-$1,199/day × 15 units = ~$14,000/day potential
- **Total inland waterway revenue potential: $33,000/day peak season**

---

**This expanded platform now serves the ENTIRE watercraft rental market! 🚤**
