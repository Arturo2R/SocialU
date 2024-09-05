const MillionLint = require('@million/lint');
const million = require('million/compiler');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
});
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development'
});

// next.config.js
const withMDX = require('@next/mdx')({
  // Optionally provide remark and rehype plugins
  options: {
    // If you use remark-gfm, you'll need to use next.config.mjs
    // as the package is ESM only
    // https://github.com/remarkjs/remark-gfm#install
    remarkPlugins: [],
    rehypePlugins: []
    // If you use `MDXProvider`, uncomment the following line.
    // providerImportSource: "@mdx-js/react",
  }
});
const millionConfig = {
  auto: true
  // if you're using RSC:
  // auto: { rsc: true },
};
const nextConfigg = withBundleAnalyzer(withPWA(withMDX({
  // {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true
  },
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  images: {
    remotePatterns: [{
      protocol: 'https',
      hostname: 'firebasestorage.googleapis.com',
      port: ''
    }, {
      protocol: 'https',
      hostname: 'mild-gecko-296.convex.cloud',
      port: ''
    }]
  },
  experimental: {
    scrollRestoration: true,
    instrumentationHook: true
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true
  },
  async rewrites() {
    return [{
      source: "/ingest/:path*",
      destination: "https://app.posthog.com/:path*"
    }];
  },
  async headers() {
    return [{
      // Apply these headers to all routes in your application.
      source: '/:path*',
      headers: [{
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin'
      }]
    }];
  }
})));
module.exports = MillionLint.next({ rsc: true })(nextConfigg);