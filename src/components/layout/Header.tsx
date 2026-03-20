'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { siteConfig } from '@/lib/site'

export default function Header() {
  const headerRef = useRef<HTMLElement>(null)
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const isHome = pathname === '/'
  const isTransparent = isHome && !scrolled

  useEffect(() => {
    const el = headerRef.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      document.documentElement.style.setProperty(
        '--header-height',
        `${entry.contentRect.height}px`
      )
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${
        isTransparent
          ? 'border-b border-white/10 bg-transparent backdrop-blur-sm'
          : 'border-b border-[var(--border)] bg-white/95 backdrop-blur shadow-sm'
      }`}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 md:px-10">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src={isTransparent ? '/logo-smc.png' : '/logo-smc.png'}
            alt="SMC GROUP"
            width={170}
            height={52}
            className="h-10 w-auto object-contain transition-opacity duration-300"
            priority
          />
        </Link>

        {/* Nav desktop */}
        <nav className="hidden items-center gap-6 md:flex">
          {siteConfig.nav.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname === item.href || pathname.startsWith(`${item.href}/`)

            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative pb-2 text-base font-medium transition-colors duration-300"
                style={{
                  color: isTransparent
                    ? 'white'
                    : isActive
                      ? 'var(--primary)'
                      : 'var(--foreground)',
                }}
              >
                {item.label}
                <span
                  className="absolute bottom-0 left-0 h-[2px] rounded-full transition-all duration-300"
                  style={{
                    width: isActive ? '100%' : '0%',
                    background: isTransparent ? 'white' : 'var(--primary)',
                  }}
                />
              </Link>
            )
          })}
        </nav>

        {/* Botón Solicitar Cotización desktop */}
        <a
          href="/contacto"
          className="hidden rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition hover:scale-105 active:scale-95 md:inline-flex"
          style={{
            background: isTransparent ? 'rgba(255,255,255,0.15)' : 'var(--primary)',
            border: isTransparent ? '1px solid rgba(255,255,255,0.3)' : 'none',
          }}
        >
          Solicitar cotización
        </a>

        {/* Botón hamburguesa mobile */}
        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Menú"
          className={`flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-lg transition md:hidden ${
            isTransparent ? 'hover:bg-white/10' : 'hover:bg-gray-100'
          }`}
        >
          <span
            className={`block h-0.5 w-6 rounded-full transition-all duration-300 ${
              menuOpen ? 'translate-y-2 rotate-45' : ''
            }`}
            style={{ background: isTransparent ? 'white' : 'var(--foreground)' }}
          />
          <span
            className={`block h-0.5 w-6 rounded-full transition-all duration-300 ${
              menuOpen ? 'opacity-0' : ''
            }`}
            style={{ background: isTransparent ? 'white' : 'var(--foreground)' }}
          />
          <span
            className={`block h-0.5 w-6 rounded-full transition-all duration-300 ${
              menuOpen ? '-translate-y-2 -rotate-45' : ''
            }`}
            style={{ background: isTransparent ? 'white' : 'var(--foreground)' }}
          />
        </button>
      </div>

      {/* Menú mobile desplegable */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out md:hidden ${
          menuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="flex flex-col border-t border-[var(--border)] bg-white px-6 pb-6 pt-4">
          {siteConfig.nav.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname === item.href || pathname.startsWith(`${item.href}/`)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`border-b border-[var(--border)] py-4 text-sm font-medium transition ${
                  isActive
                    ? 'text-[var(--primary)]'
                    : 'text-[var(--foreground)] hover:text-[var(--primary)]'
                }`}
              >
                {item.label}
              </Link>
            )
          })}

          <a
            href={`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
              siteConfig.whatsappMessage
            )}`}
            target="_blank"
            rel="noreferrer"
            className="mt-5 flex items-center justify-center rounded-xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            WhatsApp
          </a>
        </nav>
      </div>
    </header>
  )
}