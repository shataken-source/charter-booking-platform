// next.config.js
// Next.js configuration for the charter booking platform

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Environment variables that are safe to expose to the browser
  env: {
    NEXT_PUBLIC_PLATFORM_NAME: process.env.NEXT_PUBLIC_PLATFORM_NAME || 'Gulf Coast Charters',
    NEXT_PUBLIC_PLATFORM_URL: process.env.NEXT_PUBLIC_PLATFORM_URL || 'http://localhost:3000',
  },

  // Image domains for Next.js Image component
  images: {
    domains: [
      'localhost',
      'gulfcoastcharters.com',
      'supabase.co',
      'supabase.com',
      'githubusercontent.com',
      'googleusercontent.com',
      'avatars.githubusercontent.com',
    ],
  },

  // Redirect configuration
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/configuration',
        permanent: false,
      },
    ]
  },

  // API routes configuration
  async rewrites() {
    return [
      {
        source: '/api/weather/:path*',
        destination: 'https://www.ndbc.noaa.gov/:path*',
      },
    ]
  },

  // Headers for security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ]
  },

  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Fix for node modules in browser
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      }
    }

    return config
  },

  // Enable experimental features
  experimental: {
    // Enable server components
    serverComponents: true,
  },

  // Production optimizations
  productionBrowserSourceMaps: false,
  compress: true,

  // TypeScript and ESLint
  typescript: {
    // During development, allow builds with TypeScript errors
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },
  eslint: {
    // During development, allow builds with ESLint errors
    ignoreDuringBuilds: process.env.NODE_ENV === 'development',
  },
}

module.exports = nextConfig
