import type { ReactNode } from 'react'
import { Barlow, Barlow_Condensed } from 'next/font/google'
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import WhatsAppButton from '@/components/layout/WhatsAppButton'
import '../globals.css'

const barlow = Barlow({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
})

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-heading',
  display: 'swap',
})

export default function FrontendLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={`${barlow.variable} ${barlowCondensed.variable}`}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  )
}