import type { Metadata } from "next";
import config from "@payload-config";
import { getPayload } from "payload";
import Link from "next/link";
import ProjectGallery from "@/components/proyectos/ProjectGallery";
import RevealWrapper from "@/components/home/RevealWrapper";
import type { MediaType, GalleryItem } from "@/lib/types";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Proyectos Realizados — Portafolio de Obras",
  description:
    "Portafolio de proyectos de ingeniería y construcción ejecutados por SMC GROUP en Lima y Perú. Más de 200 proyectos completados.",
  openGraph: {
    title: "Portafolio de Proyectos | SMC GROUP",
    description: "Más de 200 proyectos de ingeniería y construcción ejecutados en Lima y Perú.",
    images: [{ url: "/fondo.png", width: 1200, height: 630, alt: "SMC GROUP Proyectos" }],
  },
};

export default async function ProyectosPage() {
  const payload = await getPayload({ config });

  const [proyectosPage, projects] = await Promise.all([
    payload.findGlobal({ slug: "proyectos-page", depth: 0 }),
    payload.find({
      collection: "projects",
      where: { isActive: { equals: true } },
      sort: "-isFeatured,order",
      limit: 100,
      depth: 1,
      select: {
        title: true,
        slug: true,
        summary: true,
        description: true,
        projectType: true,
        year: true,
        client: true,
        location: true,
        coverImage: true,
        coverCaption: true,
        gallery: true,
        isFeatured: true,
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
              SMC GROUP — Proyectos
            </span>
            <h1 className="hero-in hero-d2 mt-3 text-4xl font-black uppercase leading-tight tracking-tight text-white md:text-6xl">
              Nuestros <span style={{ color: "var(--primary)" }}>Proyectos</span>
            </h1>
            <p className="hero-in hero-d3 mt-4 max-w-xl text-base leading-7 text-white/60">
              Obras ejecutadas con precisión técnica, calidad y cumplimiento. Cada proyecto refleja el compromiso de SMC GROUP con la excelencia.
            </p>

            {/* Stats */}
            {((proyectosPage.heroStats || []) as { value: string; label: string }[]).length > 0 && (
              <div className="hero-in hero-d4 mt-8 grid grid-cols-4 gap-4 border-t border-white/10 pt-8">
                {((proyectosPage.heroStats || []) as { value: string; label: string }[]).map((s, i) => (
                  <RevealWrapper key={s.label} delay={i * 80}>
                    <div className="min-w-0">
                      <p className="text-xl font-black text-white md:text-2xl">{s.value}</p>
                      <p className="text-[10px] font-semibold uppercase leading-4 tracking-widest text-white/40 md:text-xs">{s.label}</p>
                    </div>
                  </RevealWrapper>
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

      {/* ── GRID DE PROYECTOS ── */}
      <section className="relative mx-auto w-full max-w-7xl px-6 py-16 pb-28 md:px-10">
        {projects.docs.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <p className="text-slate-400">Aún no hay proyectos activos registrados en el panel.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {projects.docs.map((project) => {
              const cover =
                project.coverImage && typeof project.coverImage === "object"
                  ? (project.coverImage as MediaType)
                  : null;

              const galleryItems = ((project.gallery || []) as GalleryItem[])
                .filter((item) => item.image && typeof item.image === "object")
                .map((item) => ({ image: item.image as MediaType, caption: item.caption ?? null }));

              const allItems = [
                ...(cover ? [{ image: cover, caption: (project.coverCaption as string) ?? null }] : []),
                ...galleryItems,
              ];

              const allImages = allItems.map((i) => i.image);
              const allCaptions = allItems.map((i) => i.caption);

              return (
                <RevealWrapper key={project.id} delay={(projects.docs.indexOf(project) % 6) * 100}>
                <article
                  className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-(--primary)/30"
                >
                  {/* Foto grande */}
                  <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100">
                    <ProjectGallery
                      images={allImages}
                      captions={allCaptions}
                      title={project.title}
                      isFeatured={project.isFeatured}
                    />
                  </div>

                  {/* Contenido */}
                  <div className="flex flex-1 flex-col p-5">
                    {/* Tipo + año */}
                    <div className="mb-3 flex items-center justify-between">
                      <span
                        className="rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider"
                        style={{ background: "var(--primary)", color: "white" }}
                      >
                        {project.projectType
                          ? project.projectType.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
                          : "Proyecto"}
                      </span>
                      {project.year && (
                        <span className="text-xs font-semibold text-slate-400">{project.year}</span>
                      )}
                    </div>

                    <h2 className="mb-2 text-lg font-bold leading-snug text-[#0f172a]">{project.title}</h2>

                    {project.summary && (
                      <p className="mb-4 text-sm leading-6 text-slate-500 line-clamp-2">{project.summary}</p>
                    )}

                    {/* Metadata cliente / ubicación */}
                    <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-gray-100 pt-4 text-xs text-slate-400">
                      {project.client && (
                        <span className="flex items-center gap-1.5">
                          <svg className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                          </svg>
                          <span className="font-semibold text-slate-600">{project.client}</span>
                        </span>
                      )}
                      {project.location && (
                        <span className="flex items-center gap-1.5">
                          <svg className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                          </svg>
                          <span className="font-semibold text-slate-600">{project.location}</span>
                        </span>
                      )}
                    </div>

                    <Link
                      href={`/proyectos/${project.slug}`}
                      className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold transition-all hover:gap-2.5"
                      style={{ color: "var(--primary)" }}
                    >
                      Ver proyecto →
                    </Link>
                  </div>
                </article>
                </RevealWrapper>
              );
            })}
          </div>
        )}
      </section>
      </div>
    </main>
  );
}
