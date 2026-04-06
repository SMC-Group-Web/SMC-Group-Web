import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin/', '/api/'] }],
    sitemap: 'https://smcgroupperu.com/sitemap.xml',
    host: 'https://smcgroupperu.com',
  }
}
