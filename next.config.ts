// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;

import createMDX from '@next/mdx';
import { withSentryConfig } from '@sentry/nextjs/config';

const isolatedHeaders = [
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
];

const quickToolRoutes = [
  '/blur-background',
  '/zh/blur-background',
  '/white-background',
  '/zh/white-background',
  '/remove-exif',
  '/zh/remove-exif',
  '/blur-face',
  '/zh/blur-face',
  '/images-to-pdf',
  '/zh/images-to-pdf',
  '/pdf-to-jpg',
  '/zh/pdf-to-jpg',
  '/compress-gif',
  '/zh/compress-gif',
];

const passportRoutes = [
  '/passport-photo',
  '/zh/passport-photo',
  '/us-passport-photo',
  '/zh/us-passport-photo',
  '/uk-passport-photo',
  '/zh/uk-passport-photo',
  '/india-passport-photo',
  '/zh/india-passport-photo',
  '/schengen-passport-photo',
  '/zh/schengen-passport-photo',
  '/canada-passport-photo',
  '/zh/canada-passport-photo',
  '/australia-passport-photo',
  '/zh/australia-passport-photo',
  '/japan-passport-photo',
  '/zh/japan-passport-photo',
  '/china-passport-photo',
  '/zh/china-passport-photo',
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  trailingSlash: false,
  agentRules: false,

  async redirects() {
    return [
      { source: '/removebg', destination: '/', permanent: true },
      { source: '/removebg/', destination: '/', permanent: true },
    ];
  },

  async headers() {
    return [
      ...['/', '/zh', '/zh/'].map((source) => ({
        source,
        headers: isolatedHeaders,
      })),
      ...passportRoutes.map((source) => ({
        source,
        headers: isolatedHeaders,
      })),
      ...quickToolRoutes.map((source) => ({
        source,
        headers: isolatedHeaders,
      })),
      {
        source: '/pdf/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/eruda.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
  extension: /\.(md|mdx)$/,
});

// Merge MDX config with Next.js config
const mdxConfig = withMDX(nextConfig);

export default process.env.SENTRY_AUTH_TOKEN
  ? withSentryConfig(mdxConfig, {
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
      widenClientFileUpload: true,
      tunnelRoute: '/monitoring',
      sourcemaps: {
        deleteSourcemapsAfterUpload: true,
      },
    })
  : mdxConfig;
