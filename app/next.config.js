const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const withPWA = require('next-pwa')

module.exports = withBundleAnalyzer({
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  pwa: {
    dest: 'public'
  },
  images: {
    domains: ['source.unsplash.com', 'example2.com'],
  },
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: '/:path*',
        headers: [{
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin'
        }],
      },
    ]
  },
});
