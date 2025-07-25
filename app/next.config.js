/** @type {import('next').NextConfig} */
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
      hostname: 'image.mux.com',
      port: ''
    }, {
      protocol: 'https',
      hostname: 'mild-gecko-296.convex.site',
      port: ''
    }, {
      protocol: 'https',
      hostname: 'mild-gecko-296.convex.cloud',
      port: ''
    },
    {
      protocol: 'https',
      hostname: 'hallowed-hound-764.convex.cloud',
      port: ''
    }]
  },
  experimental: {
    scrollRestoration: true,
    instrumentationHook: true,
    // typedRoutes: true
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true
  },
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
      {
        source: "/dashboard",
        destination: "https://dashboard.convex.dev/t/arturo-rebolledo/socialu-472e8/hallowed-hound-764/data?table=post"
      }, {
        source: "/api2/:path*",
        destination: "https://hallowed-hound-764.convex.site/:path*"
      }
    ];
  },
  async headers() {
    return [{
      // Apply these headers to all routes in your application.
      source: '/:path*',
      headers: [{
        key: 'Referrer-Policy',
          value: 'no-referrer-when-downgrade',
        },
        {
          key: 'Permissions-Policy',
          value: 'geolocation=(self), microphone=()',
        },
      ]
    }];
  }
})));
// module.exports = MillionLint.next({ rsc: true })(nextConfigg);
module.exports = nextConfigg;