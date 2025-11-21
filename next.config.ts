import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Removed static export to allow dynamic customer pages
  // output: 'export',

  images: {
    unoptimized: true,
  },
  devIndicators: false,

  // PWA and caching configuration
  async headers() {
    return [
      {
        // API routes - no caching for dynamic data
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
      {
        // Static assets - cache aggressively but with revalidation
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Icons and favicons - cache for 24 hours
        source: '/icons/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400',
          },
        ],
      },
      {
        // Manifest - cache for 1 hour
        source: '/manifest.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600',
          },
        ],
      },
    ];
  },

  // Optional: Change links `/me` -> `/me/` and emit `/me.html` -> `/me/index.html`
  // trailingSlash: true,

  // Optional: Prevent automatic `/me` -> `/me/`, instead preserve `href`
  // skipTrailingSlashRedirect: true,

  // Optional: Change the output directory `out` -> `dist`
  // distDir: 'dist',

  // Custom webpack configuration (for webpack builds)
  webpack: (config: any, { buildId, dev, isServer, defaultLoaders, webpack }: any) => {
    // Example: Add custom webpack plugins
    // config.plugins.push(new webpack.DefinePlugin({
    //   'process.env.CUSTOM_VAR': JSON.stringify('value'),
    // }));

    // Example: Modify webpack rules
    // config.module.rules.push({
    //   test: /\.custom$/,
    //   use: ['custom-loader'],
    // });

    // Example: Add alias
    // config.resolve.alias = {
    //   ...config.resolve.alias,
    //   '@custom': path.resolve(__dirname, 'src/custom'),
    // };

    // Important: Always return the modified config
    return config;
  },

  // Turbopack configuration (Next.js 16+ uses Turbopack by default)
  // Add empty config to allow builds with webpack config present
  turbopack: {},
}

export default nextConfig;
