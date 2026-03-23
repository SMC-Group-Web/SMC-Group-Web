import config from '@payload-config'
import { getPayload } from 'payload'

type MediaType = {
  id: string | number
  url?: string | null
  alt?: string | null
  filename?: string | null
}

export default async function ServiciosPage() {
  const payload = await getPayload({ config })

  const services = await payload.find({
    collection: 'services',
    where: { isActive: { equals: true } },
    sort: '-isFeatured,order',
    limit: 100,
    depth: 1,
  })

  return (
    <main className="min-h-screen bg-white text-[#0f172a] pt-[var(--header-height)]">

      {/* ── HERO ── */}
      <section className="mx-auto w-full max-w-7xl px-6 py-16 md:px-10">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-[var(--primary)]">
          Servicios
        </p>
        <h1 className="text-4xl font-bold md:text-5xl">Nuestros servicios</h1>
        <p className="mt-4 max-w-3xl text-slate-500">
          Conoce los servicios especializados que SMC GROUP desarrolla en el
          ámbito de ingeniería y construcción.
        </p>
      </section>

      {/* ── GRID ── */}
      <section className="mx-auto w-full max-w-7xl px-6 pb-24 md:px-10">
        {services.docs.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <p className="text-slate-500">
              Aún no hay servicios activos registrados en el panel.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {services.docs.map((service, i) => {
              const image =
                service.image && typeof service.image === 'object'
                  ? (service.image as MediaType)
                  : null
              const num = String(i + 1).padStart(2, '0')
              const features = (service.features || []) as { text: string }[]

              return (
                <article
                  key={service.id}
                  className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--primary)] hover:shadow-[0_20px_40px_rgba(37,99,235,0.12)]"
                >
                  {/* ── IMAGEN ── */}
                  <div className="relative h-56 w-full overflow-hidden bg-gray-100">
                    {image?.url ? (
                      <img
                        src={image.url}
                        alt={image.alt || service.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-100">
                        <svg className="h-12 w-12 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                        </svg>
                      </div>
                    )}

                    {/* Badge destacado — arriba izquierda sobre imagen */}
                    {service.isFeatured && (
                      <span className="absolute left-3 top-3 rounded-full bg-[var(--primary)] px-3 py-1 text-xs font-bold text-white shadow">
                        Destacado
                      </span>
                    )}

                    {/* Número — arriba derecha */}
                    <span className="absolute right-3 top-3 rounded-lg bg-black/50 px-2 py-1 text-xs font-black text-white/80 backdrop-blur-sm">
                      {num}
                    </span>
                  </div>

                  {/* ── CONTENIDO ── */}
                  <div className="p-6">
                    <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[var(--primary)]">
                      {(service.category as string) || 'Servicio'}
                    </p>

                    <h2 className="mb-2 text-xl font-bold text-[#0f172a]">
                      {service.title}
                    </h2>

                    <p className="mb-4 text-sm leading-6 text-slate-500">
                      {service.summary}
                    </p>

                    {/* Bullets */}
                    {features.length > 0 && (
                      <ul className="mb-5 space-y-2">
                        {features.map((f, fi) => (
                          <li key={fi} className="flex items-center gap-2 text-sm text-slate-600">
                            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--primary)]" />
                            {f.text}
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Línea azul animada */}
                    <div className="mb-4 h-px w-0 bg-[var(--primary)] transition-all duration-500 group-hover:w-full" />

                    {/* CTA */}
                    <a
                      href={(service.ctaLink as string) || '/contacto'}
                      className="inline-flex items-center gap-2 text-sm font-bold text-[var(--primary)] transition-all hover:gap-3"
                    >
                      Solicitar Cotización <span>→</span>
                    </a>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>
    </main>
  )
}