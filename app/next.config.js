const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const withPWA = require('next-pwa')

module.exports = withBundleAnalyzer(withPWA({
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  pwa: {
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
  },
  images: {
    domains: ['source.unsplash.com', "lh3.googleusercontent.com", 'example2.com', 'firebasestorage.googleapis.com', 'source.unsplash.com']
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
}));
