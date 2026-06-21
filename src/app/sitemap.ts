import type { MetadataRoute } from 'next'
import config from '@payload-config'
import { getPayload } from 'payload'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://smcgroupperu.com'
  const payload = await getPayload({ config })

  const [projects, services] = await Promise.all([
    payload.find({
      collection: 'projects',
      where: { isActive: { equals: true } },
      limit: 200,
      select: { slug: true },
    }),
    payload.find({
      collection: 'services',
      where: { isActive: { equals: true } },
      limit: 200,
      select: { slug: true },
    }),
  ])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/quienes-somos`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/servicios`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/proyectos`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/contacto`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ]

  const projectRoutes: MetadataRoute.Sitemap = projects.docs.map((p) => ({
    url: `${base}/proyectos/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const serviceRoutes: MetadataRoute.Sitemap = services.docs.map((s) => ({
    url: `${base}/servicios/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticRoutes, ...projectRoutes, ...serviceRoutes]
}
