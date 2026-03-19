import type { ReactNode } from 'react'
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import WhatsAppButton from '@/components/layout/WhatsAppButton'
import '../globals.css'

export default function FrontendLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="es" data-scroll-behavior="smooth">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  )
}