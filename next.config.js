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
  typescript: {
    // Ignorowanie błędów TypeScript podczas budowania produkcyjnego
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignorowanie błędów ESLint podczas budowania produkcyjnego
    ignoreDuringBuilds: true,
  },
  // Pozostałe ustawienia
  distDir: '.next',
  swcMinify: true,
};

module.exports = nextConfig;
