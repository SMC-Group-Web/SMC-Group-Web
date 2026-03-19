'use client'
 
import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
 
type Slide = {
  image?: {
    url?: string | null
    alt?: string | null
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
 
type Props = {
  slides: Slide[]
}
 
const stats = [
  { value: '10+', label: 'Años de experiencia' },
  { value: '200+', label: 'Proyectos completados' },
  { value: '50+', label: 'Clientes satisfechos' },
  { value: '100%', label: 'Compromiso con calidad' },
]
 
export default function HomeHeroCarousel({ slides }: Props) {
  const activeSlides = useMemo(
    () => slides.filter((slide) => slide?.isActive !== false),
    [slides],
  )
 
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
 
  useEffect(() => {
    if (activeSlides.length <= 1 || paused) return
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % activeSlides.length)
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
  const half = Math.ceil(titleWords.length / 2)
  const titleTop = titleWords.slice(0, half).join(' ')
  const titleBottom = titleWords.slice(half).join(' ')
 
  return (
   <section
  className="relative h-screen min-h-[640px] w-full overflow-hidden bg-[var(--charcoal)]"
  onMouseEnter={() => setPaused(true)}
  onMouseLeave={() => setPaused(false)}
>
      
      {/* Imagen de fondo */}
      {currentSlide.image?.url ? (
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
 
      {/* Contenido principal */}
      <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col justify-between px-6 pb-0 pt-16 md:px-10">
 
        {/* Texto hero */}
        <div className="flex flex-1 items-center">
          <div className="max-w-3xl space-y-6 text-white">
 
            {currentSlide.eyebrow && (
              <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/90 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
                {currentSlide.eyebrow}
              </span>
            )}
 
            <h1 className="text-4xl font-extrabold leading-tight md:text-6xl lg:text-7xl">
              <span className="text-white">{titleTop}</span>
              {titleBottom && (
                <>
                  {' '}
                  <span className="text-white/40">{titleBottom}</span>
                </>
              )}
            </h1>
 
            {currentSlide.description && (
              <p className="max-w-xl text-base leading-7 text-white/75 md:text-lg">
                {currentSlide.description}
              </p>
            )}
 
            <div className="flex flex-wrap gap-4 pt-2">
              {currentSlide.buttonText && currentSlide.buttonLink && (
                <a
                  href={currentSlide.buttonLink}
                  className="inline-flex items-center rounded-xl bg-[var(--primary)] px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:bg-[var(--primary-dark)]"
                >
                  {currentSlide.buttonText}
                </a>
              )}
              {currentSlide.secondButtonText && currentSlide.secondButtonLink && (
                <a
                  href={currentSlide.secondButtonLink}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
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
        <div className="relative z-10 border-t border-white/10 py-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
 
            <div className="grid grid-cols-2 gap-x-10 gap-y-4 md:flex md:gap-14">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-extrabold text-white md:text-3xl">{stat.value}</p>
                  <p className="mt-0.5 text-xs font-medium uppercase tracking-wider text-white/50">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
 
            <div className="flex flex-col items-center gap-2">
              {activeSlides.length > 1 && (
                <div className="flex items-center gap-2">
                  {activeSlides.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setCurrent(index)}
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-bounce text-white/40"
              >
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
 
      {/* Flechas laterales */}
      {activeSlides.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => setCurrent((prev) => (prev - 1 + activeSlides.length) % activeSlides.length)}
            aria-label="Slide anterior"
            className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition hover:bg-white/25"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setCurrent((prev) => (prev + 1) % activeSlides.length)}
            aria-label="Siguiente slide"
            className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition hover:bg-white/25"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </>
      )}
    </section>
  )
}
 