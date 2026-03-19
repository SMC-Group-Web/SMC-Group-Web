import Link from 'next/link'
import config from '@payload-config'
import HomeHeroCarousel from '@/components/home/HomeHeroCarousel'
import { getPayload } from 'payload'

type MediaType = {
  id: string | number
  url?: string | null
  alt?: string | null
  filename?: string | null
}

export default async function HomePage() {
  const payload = await getPayload({ config })

  const homePage = await payload.findGlobal({
    slug: 'home-page',
    depth: 1,
  })

  const featuredServices = await payload.find({
    collection: 'services',
    where: {
      and: [
        {
          isActive: {
            equals: true,
          },
        },
        {
          isFeatured: {
            equals: true,
          },
        },
      ],
    },
    sort: 'order',
    limit: 3,
    depth: 1,
  })

  const services =
    featuredServices.docs.length > 0
      ? featuredServices
      : await payload.find({
          collection: 'services',
          where: {
            isActive: {
              equals: true,
            },
          },
          sort: 'order',
          limit: 3,
          depth: 1,
        })

  const featuredProjects = await payload.find({
    collection: 'projects',
    where: {
      and: [
        {
          isActive: {
            equals: true,
          },
        },
        {
          isFeatured: {
            equals: true,
          },
        },
      ],
    },
    sort: 'order',
    limit: 3,
    depth: 1,
  })

  const projects =
    featuredProjects.docs.length > 0
      ? featuredProjects
      : await payload.find({
          collection: 'projects',
          where: {
            isActive: {
              equals: true,
            },
          },
          sort: 'order',
          limit: 3,
          depth: 1,
        })

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <HomeHeroCarousel
  slides={(homePage.heroSlides || []).map((slide) => ({
    ...slide,
    image: typeof slide.image === 'object' ? slide.image : null,
  }))}
  stats={homePage.stats || []}
/>

      <section className="mx-auto w-full max-w-7xl px-6 pb-20 pt-20 md:px-10">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">
              Servicios
            </p>
            <h2 className="mt-2 text-3xl font-semibold md:text-4xl">
              Servicios destacados
            </h2>
            <p className="mt-3 max-w-3xl text-[var(--muted)]">
              Soluciones especializadas para proyectos de ingeniería y construcción.
            </p>
          </div>

          <Link
            href="/servicios"
            className="hidden rounded-xl border border-[var(--border)] px-5 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--primary)] hover:text-[var(--primary)] md:inline-flex"
          >
            Ver todos los servicios
          </Link>
        </div>

        {services.docs.length === 0 ? (
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8">
            <p className="text-[var(--muted)]">
              Aún no hay servicios activos registrados en el panel.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {services.docs.map((service) => {
                const image =
                  service.image && typeof service.image === 'object'
                    ? (service.image as MediaType)
                    : null

                return (
                  <article
                    key={service.id}
                    className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-xl"
                  >
                    {image?.url ? (
                      <div className="h-56 w-full overflow-hidden border-b border-[var(--border)] bg-black/5">
                        <img
                          src={image.url}
                          alt={image.alt || service.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-56 w-full items-center justify-center border-b border-[var(--border)] bg-black/5 text-sm text-[var(--muted)]">
                        Sin imagen
                      </div>
                    )}

                    <div className="space-y-4 p-6">
                      <div className="flex items-center justify-between gap-3">
                        <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--muted)]">
                          Servicio
                        </span>

                        {service.isFeatured && (
                          <span className="rounded-full bg-[var(--primary)] px-3 py-1 text-xs font-medium text-white">
                            Destacado
                          </span>
                        )}
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-xl font-semibold">{service.title}</h3>
                        <p className="text-sm leading-6 text-[var(--muted)]">
                          {service.summary}
                        </p>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>

            <div className="mt-8 md:hidden">
              <Link
                href="/servicios"
                className="inline-flex rounded-xl border border-[var(--border)] px-5 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
              >
                Ver todos los servicios
              </Link>
            </div>
          </>
        )}
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 pb-24 md:px-10">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">
              Proyectos
            </p>
            <h2 className="mt-2 text-3xl font-semibold md:text-4xl">
              Proyectos destacados
            </h2>
            <p className="mt-3 max-w-3xl text-[var(--muted)]">
              Una selección de proyectos ejecutados por SMC GROUP.
            </p>
          </div>

          <Link
            href="/proyectos"
            className="hidden rounded-xl border border-[var(--border)] px-5 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--primary)] hover:text-[var(--primary)] md:inline-flex"
          >
            Ver todos los proyectos
          </Link>
        </div>

        {projects.docs.length === 0 ? (
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8">
            <p className="text-[var(--muted)]">
              Aún no hay proyectos activos registrados en el panel.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {projects.docs.map((project) => {
                const cover =
                  project.coverImage && typeof project.coverImage === 'object'
                    ? (project.coverImage as MediaType)
                    : null

                return (
                  <article
                    key={project.id}
                    className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-xl"
                  >
                    {cover?.url ? (
                      <div className="h-56 w-full overflow-hidden border-b border-[var(--border)] bg-black/5">
                        <img
                          src={cover.url}
                          alt={cover.alt || project.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-56 w-full items-center justify-center border-b border-[var(--border)] bg-black/5 text-sm text-[var(--muted)]">
                        Sin imagen
                      </div>
                    )}

                    <div className="space-y-4 p-6">
                      <div className="flex items-center justify-between gap-3">
                        <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--muted)]">
                          Proyecto
                        </span>

                        {project.isFeatured && (
                          <span className="rounded-full bg-[var(--primary)] px-3 py-1 text-xs font-medium text-white">
                            Destacado
                          </span>
                        )}
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-xl font-semibold">{project.title}</h3>
                        <p className="text-sm leading-6 text-[var(--muted)]">
                          {project.summary}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-3 pt-2 text-sm text-[var(--muted)]">
                        {project.client && <span>Cliente: {project.client}</span>}
                        {project.location && <span>Ubicación: {project.location}</span>}
                        {project.year && <span>Año: {project.year}</span>}
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>

            <div className="mt-8 md:hidden">
              <Link
                href="/proyectos"
                className="inline-flex rounded-xl border border-[var(--border)] px-5 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
              >
                Ver todos los proyectos
              </Link>
            </div>
          </>
        )}
      </section>
    </main>
  )
}