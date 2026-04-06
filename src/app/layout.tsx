import type { Metadata } from 'next'
import { siteConfig } from '@/lib/site'

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.website),
  title: {
    default: 'SMC GROUP | Ingeniería y Construcción — Lima, Perú',
    template: '%s | SMC GROUP',
  },
  description:
    'Empresa especializada en ingeniería estructural, construcción industrial y fabricación metalmecánica en Lima, Perú. Más de 10 años ejecutando proyectos con calidad, precisión y cumplimiento normativo.',
  keywords: [
    'ingeniería Lima',
    'construcción Lima',
    'ingeniería estructural Perú',
    'construcción industrial Lima',
    'fabricación metalmecánica Lima',
    'montaje industrial Perú',
    'SMC GROUP',
    'consultoría ingeniería Lima',
    'mantenimiento industrial',
    'obras civiles Lima',
    'Surquillo Lima',
  ],
  openGraph: {
    locale: 'es_PE',
    type: 'website',
    siteName: 'SMC GROUP',
    url: siteConfig.website,
    images: [{ url: '/fondo.png', width: 1200, height: 630, alt: 'SMC GROUP Ingeniería y Construcción' }],
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}