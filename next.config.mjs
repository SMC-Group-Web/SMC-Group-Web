import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      // Bug in @payloadcms/plugin-cloud-storage@3.85.1: the utilities barrel
      // re-exports resolveSignedURLKey which imports payload/dist/exports/internal
      // (server-only — pino, undici, migrations, telemetry). The client upload
      // handler only needs getFileKey from that barrel; resolveSignedURLKey is
      // only called server-side. Replace it with an empty stub in browser bundles.
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          /resolveSignedURLKey\.js$/,
          new URL('./src/webpack-stubs/resolveSignedURLKey.js', import.meta.url).pathname,
        ),
      )

      // @vercel/blob uses undici's fetch as a polyfill — forward to native
      // browser fetch so the direct-to-Blob upload works without Node.js APIs.
      config.resolve.alias = {
        ...config.resolve.alias,
        undici: new URL('./src/webpack-stubs/undici.js', import.meta.url).pathname,
      }
    }
    return config
  },
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