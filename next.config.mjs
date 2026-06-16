import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2560, 3840],
    imageSizes: [128, 256, 384, 512],
    minimumCacheTTL: 2592000,
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', port: '3000', pathname: '/media/**' },
      { protocol: 'http', hostname: '127.0.0.1', port: '3000', pathname: '/media/**' },
      { protocol: 'https', hostname: 'smcgroupperu.com', pathname: '/media/**' },
    ],
  },
  async headers() {
    return [
      {
        source: '/:all*(jpg|jpeg|png|gif|ico|svg|webp|avif|woff2|woff|ttf)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ]
  },
}

export default withPayload(nextConfig)