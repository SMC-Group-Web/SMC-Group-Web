import type { ReactNode } from 'react'
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import WhatsAppButton from '@/components/layout/WhatsAppButton'

export default function FrontendLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}