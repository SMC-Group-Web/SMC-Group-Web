import type { Metadata } from "next";
import config from "@payload-config";
import HomeHeroCarousel from "@/components/home/HomeHeroCarousel";
import RevealWrapper from "@/components/home/RevealWrapper";
import ProjectsScrollGallery from "@/components/home/ProjectsScrollGallery";
import ClientsMarquee from "@/components/home/ClientsMarquee";
import QuienesSomosSection from "@/components/home/QuienesSomosSection";
import ServiciosScrollGallery from "@/components/servicios/ServiciosScrollGallery";
import { getPayload } from "payload";
import type { MediaType } from "@/lib/types";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Ingeniería y Construcción en Lima",
  description:
    "SMC GROUP, empresa especializada en ingeniería estructural, construcción industrial y fabricación metalmecánica en Lima, Perú.",
  openGraph: {
    title: "SMC GROUP | Ingeniería y Construcción — Lima, Perú",
    description:
      "Empresa especializada en ingeniería estructural, construcción industrial y fabricación metalmecánica en Lima, Perú.",
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
        and: [{ isActive: { equals: true } }, { isFeatured: { equals: true } }],
      },
      sort: "order",
      limit: 6,
      depth: 1,
      select: { title: true, slug: true, client: true, summary: true, description: true, coverImage: true, gallery: true },
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
      depth: 1,
      select: {
        title: true,
        slug: true,
        category: true,
        summary: true,
        features: true,
        image: true,
      },
    }),
  ]);

  const galleryServices = servicesRaw.docs.map((s) => ({
    id: s.id,
    title: s.title,
    slug: s.slug as string,
    category: (s.category as string | null) ?? null,
    summary: (s.summary as string | null) ?? null,
    features: ((s.features || []) as { text: string }[]),
    image:
      s.image && typeof s.image === "object"
        ? { url: (s.image as MediaType).url ?? null, alt: (s.image as MediaType).alt ?? null }
        : null,
  }));

  // Highlights from CMS (fallback to empty array if not yet configured)
  const highlights = (homePage.highlights || []) as {
    title: string;
    description: string;
  }[];

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
      <div className="fondo-bg relative w-full">
        <div className="absolute inset-0 bg-white/72" />

        {/* ══ PROYECTOS DESTACADOS ══ */}
        <section id="proyectos" className="relative pt-16 md:pt-0">
          <ProjectsScrollGallery
            projects={projects.docs.map((p) => ({
              id: p.id,
              title: p.title,
              slug: p.slug as string,
              client: (p.client as string | null) ?? null,
              summary: (p.summary as string | null) ?? null,
              description: (p.description as string | null) ?? null,
              gallery: ((p.gallery || []) as { image: unknown; caption?: string }[])
                .map((g) =>
                  g.image && typeof g.image === "object"
                    ? { url: (g.image as MediaType).url ?? null, alt: (g.image as MediaType).alt ?? null }
                    : null
                )
                .filter(Boolean) as { url: string; alt: string | null }[],
              coverImage:
                p.coverImage && typeof p.coverImage === "object"
                  ? {
                      url: (p.coverImage as MediaType).url ?? null,
                      alt: (p.coverImage as MediaType).alt ?? null,
                    }
                  : null,
            }))}
          />
        </section>

        {/* ══ HIGHLIGHTS (desde Payload) ══ */}
        {highlights.length > 0 && (
          <section className="relative mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 md:px-10 md:py-20">
            <div className="grid gap-4 sm:gap-5 md:grid-cols-3">
              {highlights.map((h, i) => {
                const icons = [
                  // Experiencia técnica — casco de obra
                  <svg
                    key="0"
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z"
                    />
                  </svg>,
                  // Cumplimiento — checklist
                  <svg
                    key="1"
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>,
                  // Calidad — estrella
                  <svg
                    key="2"
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                    />
                  </svg>,
                ];
                const icon = icons[i % icons.length];
                const numbers = ["01", "02", "03", "04", "05", "06"];

                return (
                  <RevealWrapper key={h.title} delay={i * 120}>
                    <div className="group relative h-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_24px_48px_rgba(47,86,201,0.14)]">
                      {/* Línea azul superior animada */}
                      <div
                        className="absolute left-0 top-0 h-0.5 w-0 transition-all duration-500 group-hover:w-full"
                        style={{ background: "var(--primary)" }}
                      />
                      {/* Número de fondo decorativo */}
                      <span className="pointer-events-none absolute right-4 top-2 select-none text-5xl font-black text-slate-50 md:text-7xl">
                        {numbers[i]}
                      </span>
                      <div className="relative p-5 md:p-7">
                        {/* Ícono */}
                        <div
                          className="mb-5 inline-flex items-center justify-center rounded-xl p-3 text-white"
                          style={{ background: "var(--primary)" }}
                        >
                          {icon}
                        </div>
                        <h3 className="mb-2 text-base font-bold text-[#0f172a]">
                          {h.title}
                        </h3>
                        <p className="text-sm leading-6 text-slate-500">
                          {h.description}
                        </p>
                      </div>
                    </div>
                  </RevealWrapper>
                );
              })}
            </div>
          </section>
        )}

        {/* ══ SERVICIOS ══ */}
        <section id="servicios" className="relative w-full py-10 md:py-0">
          <ServiciosScrollGallery services={galleryServices} />
        </section>

      {/* ══ QUIÉNES SOMOS ══ */}
      <QuienesSomosSection />

        {/* ══ CLIENTES ══ */}
        {clients.docs.length > 0 && (
          <section className="relative mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 md:px-10 md:py-20">
            <RevealWrapper>
              <div className="mb-12 text-center">
                <p
                  className="mb-2 text-xs font-bold uppercase tracking-[0.3em]"
                  style={{ color: "var(--primary)" }}
                >
                  Nuestros Clientes
                </p>
                <h2 className="text-3xl font-bold text-[#0f172a] md:text-4xl">
                  Confían en Nosotros
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">
                  Empresas líderes que confían en SMC GROUP para sus proyectos
                  de ingeniería y construcción.
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
                    ? {
                        url: (c.logo as MediaType).url ?? null,
                        alt: (c.logo as MediaType).alt ?? null,
                      }
                    : null,
              }))}
            />
          </section>
        )}
      </div>
    </main>
  );
}
