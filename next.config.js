/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'i.imgur.com',
      'www.eurofirany.com.pl',
      'placehold.co',
      'siyavnvmbwjhwgjwunjr.supabase.co',
    ],
  },
  env: {
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder',
    STRIPE_PUBLISHABLE_KEY:
      process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder',
  },
  experimental: {
    optimizeCss: false,
  },
  reactStrictMode: true,
  output: 'standalone',
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
  typescript: {
    // Ignorowanie błędów TypeScript podczas budowania produkcyjnego
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignorowanie błędów ESLint podczas budowania produkcyjnego
    ignoreDuringBuilds: true,
  },
  // Ignorowanie błędów renderowania stron podczas budowania
  distDir: '.next',
};

module.exports = nextConfig;
