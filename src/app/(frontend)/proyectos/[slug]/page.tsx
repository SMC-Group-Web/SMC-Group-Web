import type { Metadata } from "next";
import config from "@payload-config";
import { getPayload } from "payload";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BreadcrumbSchema, ProyectoSchema } from "@/components/seo/JsonLd";
import type { MediaType, GalleryItem } from "@/lib/types";
import { siteConfig } from "@/lib/site";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const payload = await getPayload({ config });

  const result = await payload.find({
    collection: "projects",
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
    select: {
      title: true,
      slug: true,
      client: true,
      year: true,
      summary: true,
      seo: true,
      coverImage: true,
    },
  });

  const project = result.docs[0];
  if (!project) return {};

  type SeoGroup = {
    titulo?: string;
    descripcion?: string;
    imagen?: MediaType;
    noIndex?: boolean;
  } | null;
  const seo = (project.seo as SeoGroup) ?? null;

  const title =
    seo?.titulo ||
    `${project.title}${project.client ? ` — ${project.client}` : ""}${project.year ? ` (${project.year})` : ""}`;
  const description =
    seo?.descripcion ||
    (project.summary as string | null) ||
    `Proyecto de ingeniería y construcción: ${project.title}`;

  const cover =
    project.coverImage && typeof project.coverImage === "object"
      ? (project.coverImage as MediaType)
      : null;
  const ogImage = seo?.imagen?.url || cover?.url || null;

  return {
    title,
    description,
    ...(seo?.noIndex && { robots: { index: false, follow: false } }),
    openGraph: {
      title,
      description,
      ...(ogImage && { images: [{ url: ogImage }] }),
    },
  };
}

export async function generateStaticParams() {
  const payload = await getPayload({ config });
  const projects = await payload.find({
    collection: "projects",
    limit: 200,
    select: { slug: true },
  });
  return projects.docs.map((p) => ({ slug: p.slug as string }));
}

export default async function ProyectoDetailPage({ params }: Props) {
  const { slug } = await params;
  const payload = await getPayload({ config });

  const result = await payload.find({
    collection: "projects",
    where: { slug: { equals: slug }, isActive: { equals: true } },
    limit: 1,
    depth: 1,
  });

  const project = result.docs[0];
  if (!project) notFound();

  const cover =
    project.coverImage && typeof project.coverImage === "object"
      ? (project.coverImage as MediaType)
      : null;

  const galleryItems = ((project.gallery || []) as GalleryItem[])
    .filter((item) => item.image && typeof item.image === "object")
    .map((item) => ({
      image: item.image as MediaType,
      caption: item.caption ?? null,
    }));

  // Bloques alternados: portada primero, luego galería
  const blocks = [
    ...(cover
      ? [{ image: cover, caption: (project.coverCaption as string) ?? null }]
      : []),
    ...galleryItems,
  ];

  return (
    <main className="min-h-screen bg-[#f7f9fc] text-[#0f172a]">
      <BreadcrumbSchema
        items={[
          { name: "Inicio", url: siteConfig.website },
          { name: "Proyectos", url: `${siteConfig.website}/proyectos` },
          {
            name: project.title,
            url: `${siteConfig.website}/proyectos/${project.slug}`,
          },
        ]}
      />
      <ProyectoSchema
        proyecto={{
          title: project.title,
          slug: project.slug as string,
          description: project.description as string | null,
          client: project.client as string | null,
          year: project.year as number | null,
          coverImageUrl: cover?.url ?? null,
        }}
      />

      {/* ── HERO ── */}
      <div
        className="relative overflow-hidden pt-(--header-height)"
        style={{
          backgroundImage: "url('/fondo.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #0a1628ee 0%, #0f2233dd 60%, #0d1b2acc 100%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(var(--primary) 1px, transparent 1px), linear-gradient(90deg, var(--primary) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        <div
          className="absolute left-0 top-0 h-0.5 w-full"
          style={{ background: "var(--primary)" }}
        />

        <div className="relative mx-auto w-full max-w-7xl px-6 py-14 md:px-10 md:py-20">
          <div className="max-w-3xl">
            <span className="mb-5 mt-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.3em] text-white/70 backdrop-blur-sm">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: "var(--primary)" }}
              />
              SMC GROUP — Proyectos
            </span>

            <h1 className="mt-3 text-4xl font-black uppercase leading-tight tracking-tight text-white! md:text-6xl">
              {project.title}
            </h1>

            {project.summary && (
              <p className="mt-5 max-w-2xl text-base leading-7 text-white/60">
                {project.summary}
              </p>
            )}

            {/* Meta chips */}
            <div className="mt-8 flex flex-wrap gap-6 border-t border-white/10 pt-8">
              {project.client && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/35">
                    Cliente
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-white">
                    {project.client}
                  </p>
                </div>
              )}
              {project.year && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/35">
                    Año
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-white">
                    {project.year}
                  </p>
                </div>
              )}
              {project.location && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/35">
                    Ubicación
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-white">
                    {project.location}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="relative h-10 w-full">
          <svg
            className="absolute bottom-0 w-full"
            viewBox="0 0 1440 40"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d="M0 40L1440 40L1440 0C1440 0 1080 40 720 40C360 40 0 0 0 0L0 40Z"
              fill="#f7f9fc"
            />
          </svg>
        </div>
      </div>

      {/* ── DESCRIPCIÓN PRINCIPAL ── */}
      {project.description && (
        <section className="mx-auto w-full max-w-7xl px-6 py-14 md:px-10">
          <div className="mx-auto max-w-3xl">
            <div className="mb-4 flex items-center gap-3">
              <div
                className="h-px w-8"
                style={{ background: "var(--primary)" }}
              />
              <p
                className="text-xs font-bold uppercase tracking-[0.3em]"
                style={{ color: "var(--primary)" }}
              >
                Descripción
              </p>
            </div>
            <p className="text-base leading-8 text-slate-600">
              {project.description}
            </p>
          </div>
        </section>
      )}

      {/* ── BLOQUES ALTERNADOS IMAGEN / TEXTO ── */}
      {blocks.length > 0 && (
        <section className="mx-auto w-full max-w-7xl px-6 pb-28 md:px-10">
          <div className="space-y-0">
            {blocks.map((block, i) => {
              const isEven = i % 2 === 0;
              return (
                <div
                  key={i}
                  className={`flex flex-col gap-0 md:flex-row ${isEven ? "" : "md:flex-row-reverse"}`}
                >
                  {/* Imagen */}
                  <div className="relative h-72 w-full overflow-hidden md:h-auto md:min-h-96 md:w-1/2">
                    {block.image.url ? (
                      <Image
                        src={block.image.url}
                        alt={block.caption || block.image.alt || project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                      />
                    ) : (
                      <div
                        className="h-full w-full"
                        style={{
                          background:
                            "linear-gradient(135deg, #0a1628 0%, #0f2233 100%)",
                        }}
                      />
                    )}
                    {/* Número de foto */}
                    <div className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-xs font-bold text-white backdrop-blur-sm">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                  </div>

                  {/* Texto */}
                  <div
                    className={`flex w-full flex-col justify-center px-8 py-12 md:w-1/2 md:px-14 md:py-16 ${
                      isEven ? "bg-white" : "text-white"
                    }`}
                    style={
                      isEven
                        ? {}
                        : {
                            background:
                              "linear-gradient(135deg, #0a1628 0%, #0f2233 100%)",
                          }
                    }
                  >
                    <div
                      className="mb-4 h-0.5 w-10"
                      style={{ background: "var(--primary)" }}
                    />
                    <p
                      className="mb-2 text-xs font-bold uppercase tracking-[0.3em]"
                      style={{ color: "var(--primary)" }}
                    >
                      Foto {String(i + 1).padStart(2, "0")}
                    </p>
                    {block.caption ? (
                      <p
                        className={`text-xl font-semibold leading-8 md:text-2xl ${isEven ? "text-[#0f172a]" : "text-white"}`}
                      >
                        {block.caption}
                      </p>
                    ) : (
                      <p
                        className={`text-xl font-semibold leading-8 md:text-2xl ${isEven ? "text-[#0f172a]" : "text-white"}`}
                      >
                        {project.title}
                      </p>
                    )}
                    {i === 0 && project.summary && (
                      <p
                        className={`mt-4 text-sm leading-7 ${isEven ? "text-slate-500" : "text-white/60"}`}
                      >
                        {project.summary}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── CTA FINAL ── */}
      <section className="mx-auto w-full max-w-7xl px-6 py-20 text-center md:px-10">
        <p
          className="mb-2 text-xs font-bold uppercase tracking-[0.3em]"
          style={{ color: "var(--primary)" }}
        >
          ¿Tienes un proyecto similar?
        </p>
        <h2 className="text-3xl font-black uppercase text-[#0f172a] md:text-4xl">
          Trabajemos juntos
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-500">
          Contáctanos y cuéntanos sobre tu proyecto. Nuestro equipo está listo
          para ofrecerte la mejor solución de ingeniería.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/contacto"
            className="rounded-xl px-8 py-3.5 text-sm font-bold text-white transition hover:scale-105 hover:opacity-90 active:scale-95"
            style={{ background: "var(--primary)" }}
          >
            Solicitar Cotización →
          </Link>
          <Link
            href="/proyectos"
            className="rounded-xl border border-gray-300 px-8 py-3.5 text-sm font-bold text-slate-600 transition hover:border-(--primary) hover:text-(--primary)"
          >
            Ver más proyectos
          </Link>
        </div>
      </section>
    </main>
  );
}
