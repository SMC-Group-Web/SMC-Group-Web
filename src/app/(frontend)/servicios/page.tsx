import type { Metadata } from "next";
import config from "@payload-config";
import { getPayload } from "payload";
import Link from "next/link";
import Image from "next/image";
import type { MediaType } from "@/lib/types";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Servicios de Construcción e Ingeniería en Lima",
  description:
    "Servicios especializados en ingeniería estructural, construcción industrial, fabricación metalmecánica y mantenimiento. SMC GROUP, Lima, Perú.",
  openGraph: {
    title: "Servicios de Ingeniería y Construcción | SMC GROUP",
    description: "Construcción, consultoría, estudios complementarios, mantenimiento y servicios sostenibles en Lima, Perú.",
    images: [{ url: "/fondo.png", width: 1200, height: 630, alt: "SMC GROUP Servicios" }],
  },
};

export default async function ServiciosPage() {
  const payload = await getPayload({ config });

  const [serviciosPage, services] = await Promise.all([
    payload.findGlobal({ slug: "servicios-page", depth: 0 }),
    payload.find({
      collection: "services",
      where: { isActive: { equals: true } },
      sort: "-isFeatured,order",
      limit: 100,
      depth: 1,
      select: {
        title: true,
        slug: true,
        summary: true,
        category: true,
        features: true,
        image: true,
        isFeatured: true,
        ctaLink: true,
      },
    }),
  ]);

  return (
    <main className="min-h-screen text-[#0f172a]">

      {/* ── HERO ── */}
      <div className="fondo-hero relative overflow-hidden pt-(--header-height)">
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #0a1628f0 0%, #0f2233e0 60%, #0d1b2ad0 100%)" }} />
        <div className="pointer-events-none absolute inset-0 opacity-10" style={{ backgroundImage: `linear-gradient(var(--primary) 1px, transparent 1px), linear-gradient(90deg, var(--primary) 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />
        <div className="absolute left-0 top-0 h-0.5 w-full" style={{ background: "var(--primary)" }} />

        <div className="relative mx-auto w-full max-w-7xl px-6 py-16 md:px-10 md:py-24">
          <div className="max-w-2xl">
            <span className="hero-in hero-d1 mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.3em] text-white/70 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--primary)" }} />
              SMC GROUP — Servicios
            </span>
            <h1 className="hero-in hero-d2 mt-3 text-4xl font-black uppercase leading-tight tracking-tight text-white md:text-6xl">
              Nuestros <span style={{ color: "var(--primary)" }}>Servicios</span>
            </h1>
            <p className="hero-in hero-d3 mt-4 max-w-xl text-base leading-7 text-white/60">
              Servicios especializados en ingeniería y construcción con los más altos estándares técnicos, calidad y cumplimiento normativo.
            </p>

            {/* Stats */}
            {((serviciosPage.heroStats || []) as { value: string; label: string }[]).length > 0 && (
              <div className="hero-in hero-d4 mt-8 grid grid-cols-4 gap-4 border-t border-white/10 pt-8">
                {((serviciosPage.heroStats || []) as { value: string; label: string }[]).map((s) => (
                  <div key={s.label} className="min-w-0">
                    <p className="text-xl font-black text-white md:text-2xl">{s.value}</p>
                    <p className="text-[10px] font-semibold uppercase leading-4 tracking-widest text-white/40 md:text-xs">{s.label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Wave */}
        <div className="relative h-10 w-full">
          <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 40" fill="none" preserveAspectRatio="none">
            <path d="M0 40L1440 40L1440 0C1440 0 1080 40 720 40C360 40 0 0 0 0L0 40Z" fill="#f7f9fc" />
          </svg>
        </div>
      </div>

      {/* ── FONDO CONTINUO ── */}
      <div className="fondo-bg relative w-full">
        <div className="absolute inset-0 bg-white/72" />

      {/* ── GRID DE SERVICIOS ── */}
      <section className="relative mx-auto w-full max-w-7xl px-6 py-16 pb-28 md:px-10">
        {services.docs.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <p className="text-slate-400">Aún no hay servicios activos registrados en el panel.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {services.docs.map((service) => {
              const image =
                service.image && typeof service.image === "object"
                  ? (service.image as MediaType)
                  : null;
              const features = (service.features || []) as { text: string }[];

              return (
                <article
                  key={service.id}
                  className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-(--primary)/30"
                >
                  {/* Foto grande */}
                  {image?.url ? (
                    <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100">
                      <Image
                        src={image.url}
                        alt={image.alt || service.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    /* Placeholder sin foto — fondo oscuro con grid técnico */
                    <div
                      className="relative aspect-4/3 w-full overflow-hidden"
                      style={{ background: "linear-gradient(135deg, #0a1628 0%, #0f2233 100%)" }}
                    >
                      <div
                        className="absolute inset-0 opacity-10"
                        style={{
                          backgroundImage: `linear-gradient(var(--primary) 1px, transparent 1px), linear-gradient(90deg, var(--primary) 1px, transparent 1px)`,
                          backgroundSize: "28px 28px",
                        }}
                      />
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                        <svg className="h-10 w-10 opacity-30" style={{ color: "var(--primary)" }} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
                        </svg>
                        <p className="text-xs font-semibold uppercase tracking-widest text-white/20">{service.title}</p>
                      </div>
                    </div>
                  )}

                  {/* Contenido */}
                  <div className="flex flex-1 flex-col p-5">
                    {/* Categoría + badge destacado */}
                    <div className="mb-3 flex items-center justify-between">
                      {service.category && (
                        <span
                          className="rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider"
                          style={{ background: "var(--primary)", color: "white" }}
                        >
                          {service.category as string}
                        </span>
                      )}
                      {service.isFeatured && (
                        <span className="rounded-md border border-amber-300 bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-600">
                          Destacado
                        </span>
                      )}
                    </div>

                    <h2 className="mb-2 text-lg font-bold leading-snug text-[#0f172a]">{service.title}</h2>

                    <p className="mb-4 text-sm leading-6 text-slate-500 line-clamp-2">{service.summary}</p>

                    {features.length > 0 && (
                      <ul className="mb-4 mt-auto space-y-1.5 border-t border-gray-100 pt-4">
                        {features.map((f, fi) => (
                          <li key={fi} className="flex items-center gap-2 text-sm text-slate-600">
                            <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "var(--primary)" }} />
                            {f.text}
                          </li>
                        ))}
                      </ul>
                    )}

                    <Link
                      href={`/servicios/${service.slug as string}`}
                      className="mt-auto inline-flex items-center gap-1.5 text-sm font-bold transition-all hover:gap-2.5"
                      style={{ color: "var(--primary)" }}
                    >
                      Ver servicio completo →
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
      </div>
    </main>
  );
}
