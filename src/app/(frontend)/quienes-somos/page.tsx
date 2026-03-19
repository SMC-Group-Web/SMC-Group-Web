import config from '@payload-config'
import { getPayload } from 'payload'

type MediaType = {
  id: string | number
  url?: string | null
  alt?: string | null
}

export default async function QuienesSomosPage() {
  const payload = await getPayload({ config })

  const aboutPage = await payload.findGlobal({
    slug: 'about-page',
    depth: 1,
  })

  const image =
    aboutPage.image && typeof aboutPage.image === 'object'
      ? (aboutPage.image as MediaType)
      : null

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <section className="mx-auto w-full max-w-7xl px-6 py-16 md:px-10">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="space-y-5">
            <span className="inline-flex rounded-full border border-[var(--border)] px-4 py-1 text-sm text-[var(--muted)]">
              Quiénes somos
            </span>

            <h1 className="text-4xl font-bold md:text-5xl">
              {aboutPage.title}
            </h1>

            <p className="text-lg leading-8 text-[var(--muted)]">
              {aboutPage.subtitle}
            </p>

            <p className="leading-7 text-[var(--muted)]">
              {aboutPage.description}
            </p>
          </div>

          <div className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-xl">
            {image?.url ? (
              <img
                src={image.url}
                alt={image.alt || aboutPage.title || 'Quiénes somos'}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex min-h-[420px] items-center justify-center bg-black/5 text-sm text-[var(--muted)]">
                Sin imagen principal
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 pb-24 md:px-10">
        <div className="mb-8">
          <h2 className="text-3xl font-semibold md:text-4xl">
            Nuestro enfoque
          </h2>
          <p className="mt-3 max-w-3xl text-[var(--muted)]">
            Principios que definen la forma en que desarrollamos cada proyecto.
          </p>
        </div>

        {aboutPage.strengths && aboutPage.strengths.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {aboutPage.strengths.map((item, index) => (
              <article
                key={index}
                className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xl"
              >
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="text-sm leading-6 text-[var(--muted)]">
                    {item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8">
            <p className="text-[var(--muted)]">
              Aún no se han registrado fortalezas en el panel.
            </p>
          </div>
        )}
      </section>
    </main>
  )
}