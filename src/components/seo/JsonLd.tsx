import { siteConfig } from '@/lib/site'

export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: siteConfig.website,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.district,
      addressRegion: siteConfig.address.city,
      postalCode: siteConfig.address.postalCode,
      addressCountry: 'PE',
    },
    sameAs: [
      siteConfig.social.instagram,
      siteConfig.social.facebook,
      siteConfig.social.linkedin,
    ],
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function LocalBusinessSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: siteConfig.name,
    url: siteConfig.website,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.district,
      addressRegion: siteConfig.address.city,
      postalCode: siteConfig.address.postalCode,
      addressCountry: 'PE',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: siteConfig.coordinates.lat,
      longitude: siteConfig.coordinates.lng,
    },
    areaServed: {
      '@type': 'City',
      name: 'Lima',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Servicios de Ingeniería y Construcción',
      itemListElement: [
        'Construcción',
        'Consultoría de Ingeniería',
        'Estudios Complementarios',
        'Mantenimiento Industrial',
        'Servicios Sostenibles',
      ].map((name) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name },
      })),
    },
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function BreadcrumbSchema({
  items,
}: {
  items: { name: string; url: string }[]
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function ProyectoSchema({
  proyecto,
}: {
  proyecto: {
    title: string
    slug: string
    description?: string | null
    client?: string | null
    year?: number | null
    coverImageUrl?: string | null
  }
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: proyecto.title,
    url: `${siteConfig.website}/proyectos/${proyecto.slug}`,
    description: proyecto.description ?? undefined,
    author: {
      '@type': 'Organization',
      name: siteConfig.name,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.website,
    },
    ...(proyecto.coverImageUrl && { image: proyecto.coverImageUrl }),
    ...(proyecto.year && { dateCreated: String(proyecto.year) }),
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
