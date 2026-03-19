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
    where: {
      isActive: {
        equals: true,
      },
    },
    sort: 'order',
    limit: 100,
    depth: 1,
  })

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <section className="mx-auto w-full max-w-7xl px-6 py-16 md:px-10">
        <div className="space-y-4">
          <span className="inline-flex rounded-full border border-[var(--border)] px-4 py-1 text-sm text-[var(--muted)]">
            Servicios
          </span>
          <h1 className="text-4xl font-bold md:text-5xl">Nuestros servicios</h1>
          <p className="max-w-3xl text-[var(--muted)]">
            Conoce los servicios especializados que SMC GROUP desarrolla en el
            ámbito de ingeniería y construcción.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 pb-24 md:px-10">
        {services.docs.length === 0 ? (
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8">
            <p className="text-[var(--muted)]">
              Aún no hay servicios activos registrados en el panel.
            </p>
          </div>
        ) : (
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
                    <div className="h-64 w-full overflow-hidden border-b border-[var(--border)] bg-black/5">
                      <img
                        src={image.url}
                        alt={image.alt || service.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-64 w-full items-center justify-center border-b border-[var(--border)] bg-black/5 text-sm text-[var(--muted)]">
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
                      <h2 className="text-xl font-semibold">{service.title}</h2>
                      <p className="text-sm leading-6 text-[var(--muted)]">
                        {service.summary}
                      </p>
                    </div>
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