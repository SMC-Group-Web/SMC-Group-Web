'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'

type Slide = {
  mediaType?: 'image' | 'video' | null
  image?: {
    url?: string | null
    alt?: string | null
  } | null
  video?: {
    url?: string | null
  } | null
  eyebrow?: string | null
  title?: string | null
  description?: string | null
  buttonText?: string | null
  buttonLink?: string | null
  secondButtonText?: string | null
  secondButtonLink?: string | null
  isActive?: boolean | null
}

type Stat = {
  value: string
  label: string
}

type Props = {
  slides: Slide[]
  stats: Stat[]
}

const defaultStats: Stat[] = [
  { value: '10+', label: 'Años de experiencia' },
  { value: '200+', label: 'Proyectos completados' },
  { value: '50+', label: 'Clientes satisfechos' },
  { value: '100%', label: 'Compromiso con calidad' },
]

function parseValue(value: string): { number: number; suffix: string } {
  const match = value.match(/^(\d+)(.*)$/)
  return match
    ? { number: parseInt(match[1]), suffix: match[2] }
    : { number: 0, suffix: value }
}

function useCountUp(target: number, duration = 1800, started = false) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!started) return
    let startTime: number | null = null
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [started, target, duration])

  return count
}

function AnimatedStat({ value, label, isLast }: { value: string; label: string; isLast: boolean }) {
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { number, suffix } = parseValue(value)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true)
          observer.disconnect()
        }
      },
      { threshold: 0.5 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const count = useCountUp(number, 1800, started)

  return (
    <div ref={ref} className="flex items-stretch gap-4 md:gap-10">
      <div className="flex flex-col justify-center">
        <p className="text-xl font-extrabold text-white md:text-3xl">
          {started ? `${count}${suffix}` : value}
        </p>
        <p className="mt-1 text-[9px] font-semibold uppercase tracking-widest text-white/50 md:text-[10px]">
          {label}
        </p>
      </div>
      {!isLast && (
        <div className="w-px self-stretch bg-white/40" />
      )}
    </div>
  )
}

export default function HomeHeroCarousel({ slides, stats }: Props) {
  const activeSlides = useMemo(
    () => slides.filter((slide) => slide?.isActive !== false),
    [slides],
  )

  const activeStats = stats && stats.length > 0 ? stats : defaultStats

  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const [animKey, setAnimKey] = useState(0)

  useEffect(() => {
    if (activeSlides.length <= 1 || paused) return
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % activeSlides.length)
      setAnimKey((prev) => prev + 1)
    }, 5000)
    return () => clearInterval(interval)
  }, [activeSlides.length, paused])

  useEffect(() => {
    if (current >= activeSlides.length) setCurrent(0)
  }, [activeSlides.length, current])

  if (activeSlides.length === 0) {
    return (
      <div className="flex h-[calc(100vh-var(--header-height))] items-center justify-center bg-[var(--charcoal)] text-white">
        No hay slides activos cargados en el panel.
      </div>
    )
  }

  const currentSlide = activeSlides[current]

  const titleWords = currentSlide.title?.split(' ') ?? []
  const titleTop = titleWords.slice(0, -1).join(' ')
  const titleBottom = titleWords.slice(-1)[0] ?? ''

  return (
    <>
      <style>{`
        @keyframes heroIn {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-in {
          opacity: 0;
          animation: heroIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .hero-d1 { animation-delay: 100ms; }
        .hero-d2 { animation-delay: 250ms; }
        .hero-d3 { animation-delay: 400ms; }
        .hero-d4 { animation-delay: 550ms; }
        .hero-d5 { animation-delay: 700ms; }
      `}</style>

      <section
        className="relative h-screen min-h-[640px] w-full overflow-hidden bg-[var(--charcoal)]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {currentSlide.mediaType === 'video' && currentSlide.video?.url ? (
  <>
    <video
      key={currentSlide.video.url}
      autoPlay
      muted
      loop
      playsInline
      className="absolute inset-0 h-full w-full object-cover"
      src={currentSlide.video.url}
    />
    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/75" />
  </>
) : currentSlide.image?.url ? (
  <>
    <Image
      key={currentSlide.image.url}
      src={currentSlide.image.url}
      alt={currentSlide.image.alt || currentSlide.title || 'Slide'}
      fill
      className="object-cover animate-fade-in"
      priority={current === 0}
      sizes="100vw"
    />
    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/75" />
  </>
) : (
  <div className="absolute inset-0 bg-[var(--charcoal)]" />
)}

<div className="relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col justify-between px-8 pb-0 pt-0 md:px-16 lg:px-20">
          {/* Contenido hero */}
          <div className="flex flex-1 items-center pb-8">
            <div key={animKey} className="w-full max-w-3xl space-y-4 text-white md:space-y-6">

              {currentSlide.eyebrow && (
                <span className="hero-in hero-d1 hero-text-shadow inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/90 backdrop-blur-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
                  {currentSlide.eyebrow}
                </span>
              )}

              <h1 className="hero-in hero-d2 hero-text-shadow text-3xl font-extrabold uppercase tracking-tight leading-tight sm:text-4xl md:text-6xl lg:text-7xl" style={{ fontFamily: 'var(--font-heading)' }}>
                <span className="text-white">{titleTop}</span>
                {titleBottom && (
                  <>
                    {' '}
                    <span className="text-[var(--primary)]">{titleBottom}</span>  {/* ← azul SMC, visible */}
                  </>
                )}
              </h1>

              {currentSlide.description && (
                <p className="hero-in hero-d3 hero-text-shadow max-w-xl text-base leading-7 text-white/90 md:text-lg md:leading-8">
                  {currentSlide.description}
                </p>
              )}

              <div className="hero-in hero-d4 flex flex-wrap gap-3 pt-1 md:gap-4 md:pt-2">
                {currentSlide.buttonText && currentSlide.buttonLink && (
                  <a
                    href={currentSlide.buttonLink}
                    className="inline-flex items-center rounded-xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-[var(--primary-dark)] hover:scale-105 active:scale-95 md:px-7 md:py-3.5"
                  >
                    {currentSlide.buttonText}
                  </a>
                )}
                {currentSlide.secondButtonText && currentSlide.secondButtonLink && (
                  <a
                    href={currentSlide.secondButtonLink}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 hover:scale-105 active:scale-95 md:px-7 md:py-3.5"
                  >
                    {currentSlide.secondButtonText}
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M10 8l4 4-4 4" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>

         {/* Stats + explorar */}
<div className="hero-in hero-d5 relative z-10 border-t border-white/10 py-4 md:py-6">
  <div className="flex items-center justify-between gap-4">

    {/* Stats en una sola fila horizontal */}
    <div className="flex items-stretch gap-0 overflow-x-auto">
      {activeStats.map((stat, index) => (
        <AnimatedStat
          key={stat.label}
          value={stat.value}
          label={stat.label}
          isLast={index === activeStats.length - 1}
        />
      ))}
    </div>

    {/* Explorar + dots — solo desktop */}
    <div className="hidden shrink-0 flex-col items-center gap-1.5 md:flex">
      {activeSlides.length > 1 && (
        <div className="flex items-center gap-1.5">
          {activeSlides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => {
                setCurrent(index)
                setAnimKey((prev) => prev + 1)
              }}
              aria-label={`Ir al slide ${index + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === current ? 'w-8 bg-white' : 'w-3 bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
        Explorar
      </span>
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-bounce text-white/40">
        <path d="M12 5v14M5 12l7 7 7-7" />
      </svg>
    </div>
  </div>
</div>
        </div>

        {/* Flechas — ocultas en mobile para no tapar botones */}
        {activeSlides.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => {
                setCurrent((prev) => (prev - 1 + activeSlides.length) % activeSlides.length)
                setAnimKey((prev) => prev + 1)
              }}
              aria-label="Slide anterior"
              className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition hover:bg-white/25 hidden md:flex"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrent((prev) => (prev + 1) % activeSlides.length)
                setAnimKey((prev) => prev + 1)
              }}
              aria-label="Siguiente slide"
              className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition hover:bg-white/25 hidden md:flex"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </>
        )}
      </section>
    </>
  )
}