/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['i.imgur.com', 'www.eurofirany.com.pl', 'placehold.co'],
  },
  env: {
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder',
    STRIPE_PUBLISHABLE_KEY:
      process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder',
  },
  experimental: {
    optimizeCss: false,
  },
};

module.exports = nextConfig;
