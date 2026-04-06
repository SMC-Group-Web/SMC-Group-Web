import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import config from "@payload-config";
import HomeHeroCarousel from "@/components/home/HomeHeroCarousel";
import RevealWrapper from "@/components/home/RevealWrapper";
import ClientsMarquee from "@/components/home/ClientsMarquee";
import ServiciosMapa from "@/components/servicios/ServiciosMapa";
import type { ServicioItem } from "@/components/servicios/ServiciosMapa";
import { getPayload } from "payload";
import type { MediaType } from "@/lib/types";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Ingeniería y Construcción en Lima",
  description:
    "SMC GROUP, empresa especializada en ingeniería estructural, construcción industrial y fabricación metalmecánica en Lima, Perú.",
  openGraph: {
    title: "SMC GROUP | Ingeniería y Construcción — Lima, Perú",
    description: "Empresa especializada en ingeniería estructural, construcción industrial y fabricación metalmecánica en Lima, Perú.",
    images: [{ url: "/fondo.png", width: 1200, height: 630, alt: "SMC GROUP" }],
  },
};

export default async function HomePage() {
  const payload = await getPayload({ config });

  const [homePage, projects, clients, servicesRaw] = await Promise.all([
    payload.findGlobal({ slug: "home-page", depth: 1 }),
    payload.find({
      collection: "projects",
      where: {
        and: [
          { isActive: { equals: true } },
          { isFeatured: { equals: true } },
        ],
      },
      sort: "order",
      limit: 6,
      depth: 1,
      select: { title: true, slug: true, client: true, coverImage: true },
    }),
    payload.find({
      collection: "clients",
      where: { isActive: { equals: true } },
      sort: "order",
      limit: 50,
      depth: 1,
      select: { name: true, website: true, logo: true },
    }),
    payload.find({
      collection: "services",
      where: { isActive: { equals: true } },
      sort: "order",
      limit: 10,
      depth: 0,
      select: { title: true, slug: true, category: true, summary: true, description: true, features: true, color: true },
    }),
  ]);

  // Map services to ServiciosMapa format
  const mapaServices: ServicioItem[] = servicesRaw.docs.map((s) => ({
    slug: s.slug as string,
    title: s.title,
    cat: (s.category as string | null) ?? null,
    color: (s.color as string | null) ?? null,
    desc: (s.summary as string) || (s.description as string) || "",
    specs: ((s.features || []) as { text: string }[]).map((f) => f.text),
  }));

  // Highlights from CMS (fallback to empty array if not yet configured)
  const highlights = (homePage.highlights || []) as { title: string; description: string }[];

  return (
    <main className="min-h-screen text-[#0f172a]">
      {/* ══ HERO ══ */}
      <HomeHeroCarousel
        slides={(homePage.heroSlides || []).map((slide) => ({
          ...slide,
          image: typeof slide.image === "object" ? slide.image : null,
          video: typeof slide.video === "object" ? slide.video : null,
        }))}
        stats={homePage.stats || []}
      />

      {/* ══ FONDO CONTINUO ══ */}
      <div
        className="relative w-full"
        style={{
          backgroundImage: "url('/fondo.png')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center top",
        }}
      >
        <div className="absolute inset-0 bg-white/72" />

        {/* ══ PROYECTOS DESTACADOS ══ */}
        <section id="proyectos" className="relative mx-auto w-full max-w-7xl px-6 py-20 md:px-10">
          <RevealWrapper>
            <div className="mb-8 text-center">
              <h2 className="text-4xl font-bold text-[#0f172a] md:text-5xl">PROYECTOS</h2>
              <div className="mx-auto mt-3 h-0.5 w-10" style={{ background: "var(--primary)" }} />
            </div>
          </RevealWrapper>

          {projects.docs.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.docs.map((project, i) => {
                const cover =
                  project.coverImage && typeof project.coverImage === "object"
                    ? (project.coverImage as MediaType)
                    : null;
                return (
                  <RevealWrapper key={project.id} delay={i * 80}>
                    <Link href={`/proyectos/${project.slug}`}>
                      <article className="group relative overflow-hidden rounded-2xl">
                        <div className="relative h-80 w-full overflow-hidden bg-slate-200 md:h-96">
                          {cover?.url ? (
                            <Image
                              src={cover.url}
                              alt={cover.alt || project.title}
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                              className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                          ) : (
                            <div className="h-full w-full" style={{ background: "linear-gradient(135deg, #0a1628 0%, #0f2233 100%)" }} />
                          )}
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a1628]/80 px-8 py-10 text-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                            {project.client && (
                              <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em]" style={{ color: "var(--primary)" }}>
                                {project.client}
                              </p>
                            )}
                            <h3 className="mb-7 max-w-[85%] text-2xl font-bold leading-snug text-white">{project.title}</h3>
                            <span className="inline-flex items-center gap-2 rounded-xl px-7 py-3 text-sm font-semibold text-white" style={{ background: "var(--primary)" }}>
                              Ver proyecto →
                            </span>
                          </div>
                        </div>
                      </article>
                    </Link>
                  </RevealWrapper>
                );
              })}
            </div>
          )}

          <RevealWrapper>
            <div className="mt-12 flex justify-center">
              <Link
                href="/proyectos"
                className="inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-sm font-semibold transition-all hover:scale-105 hover:opacity-90 active:scale-95"
                style={{ background: "var(--primary)", color: "white" }}
              >
                Ver todos los proyectos →
              </Link>
            </div>
          </RevealWrapper>
        </section>

        {/* ══ HIGHLIGHTS (desde Payload) ══ */}
        {highlights.length > 0 && (
          <section className="relative mx-auto w-full max-w-7xl px-6 pb-10 md:px-10">
            <div className="grid gap-5 md:grid-cols-3">
              {highlights.map((h, i) => (
                <RevealWrapper key={h.title} delay={i * 120}>
                  <div className="h-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(47,86,201,0.12)]">
                    <div className="mb-4 inline-flex rounded-xl p-3" style={{ background: "var(--primary)", opacity: 1 }}>
                      <div className="h-6 w-6 rounded-full bg-white/80" />
                    </div>
                    <h3 className="mb-2 text-base font-bold text-[#0f172a]">{h.title}</h3>
                    <p className="text-sm leading-6 text-slate-500">{h.description}</p>
                  </div>
                </RevealWrapper>
              ))}
            </div>
          </section>
        )}

        {/* ══ SERVICIOS (mapa desde Payload) ══ */}
        <section id="servicios" className="relative mx-auto w-full max-w-5xl px-6 py-20 md:px-10">
          <RevealWrapper>
            <div className="mb-4 flex items-center gap-3">
              <div className="h-px w-10" style={{ background: "var(--primary)" }} />
              <p className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: "var(--primary)" }}>
                Capacidades técnicas
              </p>
            </div>
            <h2 className="text-4xl font-black uppercase leading-tight text-[#0f172a] md:text-5xl">
              Soluciones integrales{" "}
              <span style={{ color: "var(--primary)" }}>de ingeniería</span>
            </h2>
            <p className="mt-3 text-sm text-slate-500">Selecciona un servicio para ver todos los detalles</p>
          </RevealWrapper>

          <div className="mt-10">
            <ServiciosMapa services={mapaServices} />
          </div>

          <RevealWrapper>
            <div className="mt-10 text-center">
              <Link
                href="/servicios"
                className="inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-sm font-semibold transition-all hover:scale-105 hover:opacity-90 active:scale-95"
                style={{ background: "var(--primary)", color: "white" }}
              >
                Ver todos los servicios →
              </Link>
            </div>
          </RevealWrapper>
        </section>

        {/* ══ CLIENTES ══ */}
        {clients.docs.length > 0 && (
          <section className="relative mx-auto w-full max-w-7xl px-6 py-20 md:px-10">
            <RevealWrapper>
              <div className="mb-12 text-center">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em]" style={{ color: "var(--primary)" }}>
                  Nuestros Clientes
                </p>
                <h2 className="text-3xl font-bold text-[#0f172a] md:text-4xl">Confían en Nosotros</h2>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">
                  Empresas líderes que confían en SMC GROUP para sus proyectos de ingeniería y construcción.
                </p>
              </div>
            </RevealWrapper>
            <ClientsMarquee
              clients={clients.docs.map((c) => ({
                id: c.id,
                name: c.name,
                website: (c.website as string | null) ?? null,
                logo:
                  c.logo && typeof c.logo === "object"
                    ? { url: (c.logo as MediaType).url ?? null, alt: (c.logo as MediaType).alt ?? null }
                    : null,
              }))}
            />
          </section>
        )}
      </div>
    </main>
  );
}
