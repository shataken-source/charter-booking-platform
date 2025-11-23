// pages/sitemap.xml.js - DYNAMIC SITEMAP GENERATOR
// This creates a sitemap that Google LOVES!

function generateSiteMap() {
  const baseUrl = 'https://www.gulfcoastcharters.com'
  
  // CRITICAL PAGES - Updated DAILY for maximum crawling!
  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'hourly' },
    { url: '/booking', priority: '1.0', changefreq: 'daily' },
    { url: '/community', priority: '0.9', changefreq: 'hourly' },
    { url: '/weather', priority: '0.9', changefreq: 'hourly' },
    { url: '/fishing-reports', priority: '0.9', changefreq: 'hourly' },
    { url: '/captain/apply', priority: '0.8', changefreq: 'weekly' },
    { url: '/login', priority: '0.7', changefreq: 'monthly' },
    { url: '/tracking', priority: '0.8', changefreq: 'daily' },
  ]

  // LOCATION PAGES - Critical for local SEO!
  const gulfCoastLocations = [
    // Texas
    { url: '/charters/texas/galveston', name: 'Galveston Fishing Charters' },
    { url: '/charters/texas/corpus-christi', name: 'Corpus Christi Fishing' },
    { url: '/charters/texas/south-padre-island', name: 'South Padre Charters' },
    { url: '/charters/texas/port-aransas', name: 'Port Aransas Fishing' },
    { url: '/charters/texas/rockport', name: 'Rockport Bay Fishing' },
    
    // Louisiana
    { url: '/charters/louisiana/new-orleans', name: 'New Orleans Fishing' },
    { url: '/charters/louisiana/venice', name: 'Venice Tuna Fishing' },
    { url: '/charters/louisiana/grand-isle', name: 'Grand Isle Charters' },
    { url: '/charters/louisiana/cocodrie', name: 'Cocodrie Fishing' },
    
    // Mississippi
    { url: '/charters/mississippi/biloxi', name: 'Biloxi Fishing Charters' },
    { url: '/charters/mississippi/gulfport', name: 'Gulfport Deep Sea' },
    { url: '/charters/mississippi/pass-christian', name: 'Pass Christian Fishing' },
    
    // Alabama
    { url: '/charters/alabama/orange-beach', name: 'Orange Beach Fishing' },
    { url: '/charters/alabama/gulf-shores', name: 'Gulf Shores Charters' },
    { url: '/charters/alabama/mobile-bay', name: 'Mobile Bay Fishing' },
    { url: '/charters/alabama/dauphin-island', name: 'Dauphin Island Charters' },
    
    // Florida
    { url: '/charters/florida/pensacola', name: 'Pensacola Fishing' },
    { url: '/charters/florida/destin', name: 'Destin Fishing Charters' },
    { url: '/charters/florida/panama-city', name: 'Panama City Fishing' },
    { url: '/charters/florida/tampa', name: 'Tampa Bay Fishing' },
    { url: '/charters/florida/clearwater', name: 'Clearwater Charters' },
    { url: '/charters/florida/naples', name: 'Naples Fishing' },
    { url: '/charters/florida/marco-island', name: 'Marco Island Charters' },
  ]

  // FISH SPECIES PAGES - Target specific searches!
  const fishSpecies = [
    'red-snapper', 'redfish', 'speckled-trout', 'tarpon', 'tuna',
    'marlin', 'mahi-mahi', 'king-mackerel', 'cobia', 'grouper',
    'amberjack', 'shark', 'flounder', 'tripletail', 'wahoo'
  ]

  // TRIP TYPE PAGES - Match search intent!
  const tripTypes = [
    'deep-sea-fishing', 'inshore-fishing', 'bay-fishing',
    'offshore-fishing', 'night-fishing', 'sunset-cruise',
    'family-fishing', 'sport-fishing', 'bottom-fishing',
    'trolling-charters', 'fly-fishing', 'shark-fishing'
  ]

  // Build the sitemap
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  
  <!-- MAIN PAGES - Crawl these constantly! -->
  ${staticPages.map(page => `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('')}

  <!-- LOCATION PAGES - Critical for local SEO -->
  ${gulfCoastLocations.map(location => `
  <url>
    <loc>${baseUrl}${location.url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`).join('')}

  <!-- FISH SPECIES PAGES -->
  ${fishSpecies.map(fish => `
  <url>
    <loc>${baseUrl}/fish/${fish}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('')}

  <!-- TRIP TYPE PAGES -->
  ${tripTypes.map(trip => `
  <url>
    <loc>${baseUrl}/trips/${trip}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}

  <!-- CAPTAIN PROFILES - Add dynamically -->
  <!-- FISHING REPORTS - Updated hourly -->
  <!-- COMMUNITY POSTS - Real-time content -->
  
</urlset>`
}

export async function getServerSideProps({ res }) {
  const sitemap = generateSiteMap()

  res.setHeader('Content-Type', 'text/xml')
  res.setHeader('Cache-Control', 'public, s-maxage=1200, stale-while-revalidate')
  res.write(sitemap)
  res.end()

  return { props: {} }
}

export default function Sitemap() {
  return null
}
