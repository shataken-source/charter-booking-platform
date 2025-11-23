// pages/_document.js - SEO OPTIMIZED DOCUMENT WITH ALL META TAGS
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* 🎣 MAXIMUM SEO META TAGS - GET FOUND EVERYWHERE! */}
        <meta name="description" content="Book Gulf Coast fishing charters from Texas to Florida. Join 15,000+ anglers worldwide in our fishing community. Real-time weather, GPS tracking, verified captains!" />
        <meta name="keywords" content="gulf coast fishing charters, deep sea fishing, fishing charter booking, texas fishing, florida fishing, louisiana fishing charters, alabama fishing, mississippi fishing, orange beach charters, destin fishing, galveston fishing, fishing community, fishing social network, charter boat rental, fishing guides gulf coast, inshore fishing, offshore fishing, fishing trips, sport fishing, fishing captain, book fishing charter online" />
        
        {/* Open Graph for Social Media - VIRAL POTENTIAL! */}
        <meta property="og:title" content="Gulf Coast Charters - Book Fishing Trips & Join 15,000+ Anglers Worldwide!" />
        <meta property="og:description" content="⚓ Book verified Gulf Coast charters from Texas to Florida. 🌍 Join our global fishing community. 🎣 Real-time weather, GPS tracking, rewards program!" />
        <meta property="og:image" content="https://gulfcoastcharters.com/social-share.jpg" />
        <meta property="og:url" content="https://gulfcoastcharters.com" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Gulf Coast Charters" />
        <meta property="fb:app_id" content="YOUR_FB_APP_ID" />
        
        {/* Twitter Card - GO VIRAL ON X! */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@GulfCoastFish" />
        <meta name="twitter:creator" content="@GulfCoastFish" />
        <meta name="twitter:title" content="🎣 Book Gulf Coast Fishing Charters - Join 15,000+ Anglers!" />
        <meta name="twitter:description" content="Book verified charters from Texas to Florida. GPS tracking, weather alerts, rewards program. Join the world's fishing community!" />
        <meta name="twitter:image" content="https://gulfcoastcharters.com/twitter-share.jpg" />
        
        {/* Pinterest Rich Pins */}
        <meta property="article:author" content="Gulf Coast Charters" />
        <meta property="article:published_time" content="2024-11-22" />
        
        {/* Apple Smart App Banner */}
        <meta name="apple-itunes-app" content="app-id=YOUR_APP_ID" />
        
        {/* Google Site Verification */}
        <meta name="google-site-verification" content="YOUR_GOOGLE_VERIFICATION_CODE" />
        <meta name="msvalidate.01" content="YOUR_BING_VERIFICATION_CODE" />
        <meta name="yandex-verification" content="YOUR_YANDEX_CODE" />
        <meta name="p:domain_verify" content="YOUR_PINTEREST_CODE"/>
        
        {/* Canonical URL - CRITICAL FOR SEO! */}
        <link rel="canonical" href="https://gulfcoastcharters.com" />
        
        {/* Language Alternatives - GO GLOBAL! */}
        <link rel="alternate" hrefLang="en" href="https://gulfcoastcharters.com" />
        <link rel="alternate" hrefLang="es" href="https://gulfcoastcharters.com/es" />
        <link rel="alternate" hrefLang="fr" href="https://gulfcoastcharters.com/fr" />
        
        {/* Favicons for Every Platform */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* 🔥 SCHEMA.ORG STRUCTURED DATA - RICH SNIPPETS! */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://gulfcoastcharters.com/#organization",
                  "name": "Gulf Coast Charters",
                  "url": "https://gulfcoastcharters.com",
                  "logo": "https://gulfcoastcharters.com/logo.png",
                  "description": "Premier fishing charter booking platform for the Gulf Coast",
                  "address": {
                    "@type": "PostalAddress",
                    "addressRegion": "Gulf Coast",
                    "addressCountry": "US"
                  },
                  "sameAs": [
                    "https://facebook.com/gulfcoastcharters",
                    "https://twitter.com/GulfCoastFish",
                    "https://instagram.com/gulfcoastcharters",
                    "https://youtube.com/gulfcoastcharters",
                    "https://linkedin.com/company/gulf-coast-charters"
                  ],
                  "contactPoint": {
                    "@type": "ContactPoint",
                    "telephone": "+1-800-FISHING",
                    "contactType": "customer service",
                    "availableLanguage": ["English", "Spanish"]
                  }
                },
                {
                  "@type": "WebSite",
                  "@id": "https://gulfcoastcharters.com/#website",
                  "url": "https://gulfcoastcharters.com",
                  "name": "Gulf Coast Charters",
                  "description": "Book fishing charters from Texas to Florida",
                  "publisher": {"@id": "https://gulfcoastcharters.com/#organization"},
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://gulfcoastcharters.com/search?q={search_term_string}",
                    "query-input": "required name=search_term_string"
                  }
                },
                {
                  "@type": "Service",
                  "name": "Fishing Charter Booking",
                  "description": "Book verified fishing charters across the Gulf Coast",
                  "provider": {"@id": "https://gulfcoastcharters.com/#organization"},
                  "serviceType": "Charter Boat Rental",
                  "areaServed": [
                    {"@type": "State", "name": "Texas"},
                    {"@type": "State", "name": "Louisiana"},
                    {"@type": "State", "name": "Mississippi"},
                    {"@type": "State", "name": "Alabama"},
                    {"@type": "State", "name": "Florida"}
                  ],
                  "hasOfferCatalog": {
                    "@type": "OfferCatalog",
                    "name": "Fishing Charters",
                    "itemListElement": [
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "Service",
                          "name": "Deep Sea Fishing Charter",
                          "description": "Full day offshore fishing adventure"
                        }
                      },
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "Service",
                          "name": "Inshore Fishing Charter",
                          "description": "Half day bay and inshore fishing"
                        }
                      }
                    ]
                  },
                  "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": "4.8",
                    "reviewCount": "1247",
                    "bestRating": "5"
                  }
                },
                {
                  "@type": "FAQPage",
                  "mainEntity": [
                    {
                      "@type": "Question",
                      "name": "What areas do you cover for fishing charters?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "We exclusively cover the Gulf Coast from Texas to Florida, including Galveston, New Orleans, Mobile, Orange Beach, Destin, and the Florida Keys."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Are all captains licensed and insured?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Yes! 100% of our charter captains are USCG licensed, fully insured, and background checked for your safety."
                      }
                    }
                  ]
                }
              ]
            })
          }}
        />
        
        {/* Google Analytics 4 - TRACK EVERYTHING! */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XXXXXXXXXX');
            `
          }}
        />
        
        {/* Facebook Pixel - RETARGETING! */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', 'YOUR_PIXEL_ID');
              fbq('track', 'PageView');
            `
          }}
        />
        
        {/* TikTok Pixel - VIRAL POTENTIAL! */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function (w, d, t) {
                w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];
                ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],
                ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
                for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
                ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},
                ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";
                ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};
                var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;
                var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
                ttq.load('YOUR_TIKTOK_PIXEL');
                ttq.page();
              }(window, document, 'ttq');
            `
          }}
        />
        
        {/* Microsoft Clarity - HEATMAPS! */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "YOUR_CLARITY_ID");
            `
          }}
        />
        
        {/* Hotjar Tracking - USER BEHAVIOR! */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(h,o,t,j,a,r){
                  h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                  h._hjSettings={hjid:YOUR_HOTJAR_ID,hjsv:6};
                  a=o.getElementsByTagName('head')[0];
                  r=o.createElement('script');r.async=1;
                  r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                  a.appendChild(r);
              })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
            `
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
