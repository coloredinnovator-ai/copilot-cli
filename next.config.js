/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // For static export (GitHub Pages)
  output: process.env.BUILD_TARGET === 'static' ? 'export' : undefined,
  
  // Base path for GitHub Pages
  basePath: process.env.BASE_PATH || '',
  
  // Image optimization
  images: {
    unoptimized: process.env.BUILD_TARGET === 'static',
    domains: ['api.census.gov', 'geonames.usgs.gov'],
  },
  
  // Environment variables available to browser
  env: {
    NEXT_PUBLIC_CENSUS_API_URL: process.env.CENSUS_API_URL,
    NEXT_PUBLIC_GNIS_API_URL: process.env.GNIS_API_URL,
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
        ],
      },
    ];
  },
  
  // Redirects
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
  
  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Custom webpack config if needed
    return config;
  },
};

module.exports = nextConfig;
