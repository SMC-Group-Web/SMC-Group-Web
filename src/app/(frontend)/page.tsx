import Link from 'next/link'
import config from '@payload-config'
import HomeHeroCarousel from '@/components/home/HomeHeroCarousel'
import RevealWrapper from '@/components/home/RevealWrapper'
import ClientsMarquee from '@/components/home/ClientsMarquee'
import { getPayload } from 'payload'

type MediaType = {
  id: string | number
  url?: string | null
  alt?: string | null
  filename?: string | null
}

const IconCalidad = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.745 3.745 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.745 3.745 0 0 1 3.296-1.043A3.745 3.745 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.745 3.745 0 0 1 3.296 1.043 3.745 3.745 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
  </svg>
)

const IconPrecision = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
  </svg>
)

const IconSeguridad = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
  </svg>
)

const HIGHLIGHTS = [
  {
    icon: <IconCalidad />,
    title: 'Calidad Certificada',
    description: 'Ejecutamos cada proyecto bajo estándares técnicos con control de calidad en cada etapa.',
  },
  {
    icon: <IconPrecision />,
    title: 'Ingeniería de Precisión',
    description: 'Equipo técnico especializado con herramientas de última generación para resultados exactos.',
  },
  {
    icon: <IconSeguridad />,
    title: 'Seguridad y Cumplimiento',
    description: 'Protocolos rigurosos de seguridad industrial y cumplimiento normativo en todos nuestros servicios.',
  },
]

export default async function HomePage() {
  const payload = await getPayload({ config })

  const homePage = await payload.findGlobal({ slug: 'home-page', depth: 1 })

  const services = await payload.find({
    collection: 'services',
    where: { isActive: { equals: true } },
    sort: '-isFeatured,order',
    limit: 4,
    depth: 1,
  })

  const projects = await payload.find({
    collection: 'projects',
    where: { isActive: { equals: true } },
    sort: '-isFeatured,order',
    limit: 4,
    depth: 1,
  })

  const clients = await payload.find({
    collection: 'clients',
    where: { isActive: { equals: true } },
    sort: 'order',
    limit: 50,
    depth: 1,
  })

  return (
    <main className="min-h-screen bg-white text-[#0f172a]">

      {/* ── HERO ── */}
      <HomeHeroCarousel
        slides={(homePage.heroSlides || []).map((slide) => ({
          ...slide,
          image: typeof slide.image === 'object' ? slide.image : null,
          video: typeof slide.video === 'object' ? slide.video : null,
        }))}
        stats={homePage.stats || []}
      />

      {/* ══ SECCIÓN CON FONDO.PNG ══ */}
      <div
        className="relative w-full"
        style={{
          backgroundImage: "url('/fondo.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* Overlay blanco */}
        <div className="absolute inset-0 bg-white/90" />

        {/* ── 3 CAJITAS HIGHLIGHTS ── */}
        <section className="relative mx-auto w-full max-w-7xl px-6 pt-20 pb-10 md:px-10">
          <div className="grid gap-5 md:grid-cols-3">
            {HIGHLIGHTS.map((h, i) => (
              <RevealWrapper key={h.title} delay={i * 120}>
                <div className="h-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--primary)] hover:shadow-[0_20px_40px_rgba(47,86,201,0.12)]">
                  <div className="mb-4 inline-flex rounded-xl bg-blue-50 p-3 text-[var(--primary)]">
                    {h.icon}
                  </div>
                  <h3 className="mb-2 text-base font-bold text-[#0f172a]">{h.title}</h3>
                  <p className="text-sm leading-6 text-slate-500">{h.description}</p>
                </div>
              </RevealWrapper>
            ))}
          </div>
        </section>

        {/* ── SERVICIOS DESTACADOS ── */}
        <section id="servicios" className="relative mx-auto w-full max-w-7xl px-6 py-16 md:px-10">
          <RevealWrapper>
            <div className="mb-10 flex items-end justify-between gap-4">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-[var(--primary)]">
                  Servicios
                </p>
                <h2 className="text-3xl font-bold text-[#0f172a] md:text-4xl">
                  Servicios destacados
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
                  Soluciones especializadas para proyectos de ingeniería y construcción.
                </p>
              </div>
              <Link
                href="/servicios"
                className="hidden shrink-0 rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-[#0f172a] transition hover:border-[var(--primary)] hover:text-[var(--primary)] md:inline-flex"
              >
                Ver todos los servicios
              </Link>
            </div>
          </RevealWrapper>

          {services.docs.length === 0 ? (
            <RevealWrapper>
              <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                <p className="text-slate-500">Aún no hay servicios activos registrados en el panel.</p>
              </div>
            </RevealWrapper>
          ) : (
            <>
              <div className="grid gap-5 md:grid-cols-2">
                {services.docs.map((service, i) => {
                  const features = (service.features || []) as { text: string }[]
                  const num = String(i + 1).padStart(2, '0')
                  return (
                    <RevealWrapper key={service.id} delay={i * 100}>
                      <article className="group relative h-full overflow-hidden rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--primary)] hover:shadow-[0_20px_40px_rgba(47,86,201,0.12)]">
                        <span className="absolute right-5 top-4 select-none text-7xl font-black leading-none text-gray-100 transition-colors duration-300 group-hover:text-blue-50">
                          {num}
                        </span>
                        <div className="mb-5 flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--primary)]">
                            {(service.category as string) || 'Servicio'}
                          </span>
                          <span className="text-xs text-gray-300">{num}</span>
                        </div>
                        <h3 className="mb-3 text-xl font-bold text-[#0f172a]">{service.title}</h3>
                        <p className="mb-5 text-sm leading-6 text-slate-500">{service.summary}</p>
                        {features.length > 0 && (
                          <ul className="mb-6 space-y-2">
                            {features.map((f, fi) => (
                              <li key={fi} className="flex items-center gap-2 text-sm text-slate-600">
                                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--primary)]" />
                                {f.text}
                              </li>
                            ))}
                          </ul>
                        )}
                        <div className="mb-5 h-px w-0 bg-[var(--primary)] transition-all duration-500 group-hover:w-full" />
                        <Link
                          href={(service.ctaLink as string) || '/contacto'}
                          className="inline-flex items-center gap-2 text-sm font-bold text-[var(--primary)] transition-all hover:gap-3"
                        >
                          Solicitar Cotización <span>→</span>
                        </Link>
                      </article>
                    </RevealWrapper>
                  )
                })}
              </div>
              <div className="mt-6 md:hidden">
                <Link href="/servicios" className="inline-flex rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-[#0f172a]">
                  Ver todos los servicios
                </Link>
              </div>
            </>
          )}
        </section>

        {/* ── PROYECTOS DESTACADOS ── */}
        <section id="proyectos" className="relative mx-auto w-full max-w-7xl px-6 pb-24 md:px-10">
          <RevealWrapper>
            <div className="mb-16 flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400">SMC Group</span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>
          </RevealWrapper>

          <RevealWrapper>
            <div className="mb-10 flex items-end justify-between gap-4">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-[var(--primary)]">
                  Proyectos
                </p>
                <h2 className="text-3xl font-bold text-[#0f172a] md:text-4xl">
                  Proyectos destacados
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
                  Una selección de proyectos ejecutados por SMC GROUP.
                </p>
              </div>
              <Link
                href="/proyectos"
                className="hidden shrink-0 rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-[#0f172a] transition hover:border-[var(--primary)] hover:text-[var(--primary)] md:inline-flex"
              >
                Ver todos los proyectos
              </Link>
            </div>
          </RevealWrapper>

          {projects.docs.length === 0 ? (
            <RevealWrapper>
              <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                <p className="text-slate-500">Aún no hay proyectos activos registrados en el panel.</p>
              </div>
            </RevealWrapper>
          ) : (
            <>
              <div className="grid gap-5 md:grid-cols-2">
                {projects.docs.map((project, i) => {
                  const cover =
                    project.coverImage && typeof project.coverImage === 'object'
                      ? (project.coverImage as MediaType)
                      : null
                  const num = String(i + 1).padStart(2, '0')
                  return (
                    <RevealWrapper key={project.id} delay={i * 100}>
                      <article className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--primary)] hover:shadow-[0_20px_40px_rgba(47,86,201,0.12)]">
                        {cover?.url ? (
                          <div className="relative h-52 w-full overflow-hidden">
                            <img
                              src={cover.url}
                              alt={cover.alt || project.title}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            {project.isFeatured && (
                              <span className="absolute left-4 top-4 rounded-full bg-[var(--primary)] px-3 py-1 text-xs font-bold text-white shadow">
                                Destacado
                              </span>
                            )}
                            <span className="absolute right-4 top-4 rounded-lg bg-black/50 px-2 py-1 text-xs font-black text-white/70 backdrop-blur-sm">
                              {num}
                            </span>
                          </div>
                        ) : (
                          <div className="relative flex h-52 w-full items-center justify-center bg-gray-100">
                            <span className="text-sm text-gray-400">Sin imagen</span>
                            {project.isFeatured && (
                              <span className="absolute left-4 top-4 rounded-full bg-[var(--primary)] px-3 py-1 text-xs font-bold text-white">
                                Destacado
                              </span>
                            )}
                          </div>
                        )}
                        <div className="p-6">
                          <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[var(--primary)]">
                            Proyecto
                          </p>
                          <h3 className="mb-2 text-xl font-bold text-[#0f172a]">{project.title}</h3>
                          <p className="mb-4 text-sm leading-6 text-slate-500">{project.summary}</p>
                          <div className="flex flex-wrap gap-x-5 gap-y-1 border-t border-gray-100 pt-4 text-xs text-slate-400">
                            {project.client && (
                              <span>Cliente: <span className="font-semibold text-slate-600">{project.client}</span></span>
                            )}
                            {project.location && (
                              <span>Ubicación: <span className="font-semibold text-slate-600">{project.location}</span></span>
                            )}
                            {project.year && (
                              <span>Año: <span className="font-semibold text-slate-600">{project.year}</span></span>
                            )}
                          </div>
                        </div>
                      </article>
                    </RevealWrapper>
                  )
                })}
              </div>
              <div className="mt-6 md:hidden">
                <Link href="/proyectos" className="inline-flex rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-[#0f172a]">
                  Ver todos los proyectos
                </Link>
              </div>
            </>
          )}
        </section>
      </div>

      {/* ══ SECCIÓN CLIENTES ══ */}
      {clients.docs.length > 0 && (
        <div
          className="relative w-full py-20"
          style={{
            backgroundImage: "url('/fondo.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed',
          }}
        >
          <div className="absolute inset-0 bg-white/92" />

          <div className="relative mx-auto w-full max-w-7xl px-6 md:px-10">
            <RevealWrapper>
              <div className="mb-12 text-center">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-[var(--primary)]">
                  Nuestros Clientes
                </p>
                <h2 className="text-3xl font-bold text-[#0f172a] md:text-4xl">
                  Confían en Nosotros
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">
                  Empresas líderes que confían en SMC GROUP para sus proyectos de
                  ingeniería y construcción.
                </p>
              </div>
            </RevealWrapper>

            <ClientsMarquee
              clients={clients.docs.map((c) => ({
                id: c.id,
                name: c.name,
                website: (c.website as string | null) ?? null,
                logo:
                  c.logo && typeof c.logo === 'object'
                    ? {
                        url: (c.logo as MediaType).url ?? null,
                        alt: (c.logo as MediaType).alt ?? null,
                      }
                    : null,
              }))}
            />
          </div>
        </div>
      )}

    </main>
  )
}