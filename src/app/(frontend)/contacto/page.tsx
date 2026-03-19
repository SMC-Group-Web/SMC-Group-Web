import config from '@payload-config'
import { getPayload } from 'payload'

export default async function ContactoPage() {
  const payload = await getPayload({ config })

  const contactPage = await payload.findGlobal({
    slug: 'contact-page',
    depth: 1,
  })

  const whatsappHref = contactPage.whatsappNumber
    ? `https://wa.me/${contactPage.whatsappNumber}?text=${encodeURIComponent(
        contactPage.whatsappMessage || 'Hola, deseo más información.'
      )}`
    : null

  return (
<main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-[var(--header-height)]">      <section className="mx-auto w-full max-w-7xl px-6 py-16 md:px-10">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <span className="inline-flex rounded-full border border-[var(--border)] px-4 py-1 text-sm text-[var(--muted)]">
              Contacto
            </span>

            <h1 className="text-4xl font-bold md:text-5xl">
              {contactPage.title}
            </h1>

            <p className="text-lg leading-8 text-[var(--muted)]">
              {contactPage.subtitle}
            </p>

            {contactPage.description && (
              <p className="leading-7 text-[var(--muted)]">
                {contactPage.description}
              </p>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              {contactPage.phone && (
                <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-xl">
                  <p className="text-sm text-[var(--muted)]">Teléfono</p>
                  <p className="mt-2 text-base font-semibold">{contactPage.phone}</p>
                </div>
              )}

              {contactPage.email && (
                <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-xl">
                  <p className="text-sm text-[var(--muted)]">Correo</p>
                  <p className="mt-2 text-base font-semibold break-all">{contactPage.email}</p>
                </div>
              )}

              {contactPage.schedule && (
                <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-xl">
                  <p className="text-sm text-[var(--muted)]">Horario</p>
                  <p className="mt-2 text-base font-semibold">{contactPage.schedule}</p>
                </div>
              )}

              {contactPage.address && (
                <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-xl">
                  <p className="text-sm text-[var(--muted)]">Dirección</p>
                  <p className="mt-2 text-base font-semibold">{contactPage.address}</p>
                </div>
              )}
            </div>

            {contactPage.infoCards && contactPage.infoCards.length > 0 && (
              <div className="grid gap-4 md:grid-cols-2">
                {contactPage.infoCards.map((item, index) => (
                  <article
                    key={index}
                    className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xl"
                  >
                    <h2 className="text-xl font-semibold">{item.title}</h2>
                    <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                      {item.description}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xl md:p-8">
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">
                Formulario
              </p>
              <h2 className="text-2xl font-semibold">Cuéntanos tu proyecto</h2>
              <p className="text-sm leading-6 text-[var(--muted)]">
                Este formulario ya queda montado visualmente. En el siguiente paso
                podemos hacer que envíe datos reales.
              </p>
            </div>

            <form className="mt-8 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  type="text"
                  placeholder="Nombres"
                  className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--primary)]"
                />
                <input
                  type="text"
                  placeholder="Empresa"
                  className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--primary)]"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--primary)]"
                />
                <input
                  type="text"
                  placeholder="Teléfono"
                  className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--primary)]"
                />
              </div>

              <textarea
                placeholder="Cuéntanos sobre tu proyecto"
                rows={6}
                className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--primary)]"
              />

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  className="rounded-xl bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  Enviar consulta
                </button>

                {whatsappHref && (
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl border border-[var(--border)] px-6 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
                  >
                    Escribir por WhatsApp
                  </a>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}