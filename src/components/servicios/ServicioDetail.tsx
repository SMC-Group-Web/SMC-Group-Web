"use client";

import Image from "next/image";
import Link from "next/link";
import { type ImageBlock, buildGroups } from "@/lib/buildGroups";
import { RevealText, RevealImage } from "@/components/shared/GalleryReveal";

type Props = {
  title: string;
  slug: string;
  category?: string | null;
  summary?: string | null;
  description?: string | null;
  features?: { text: string }[];
  image?: { url: string; alt?: string | null } | null;
  gallery?: ImageBlock[];
  ctaLink?: string | null;
};

export default function ServicioDetail({
  title, category, summary, description, features, image, gallery = [], ctaLink,
}: Props) {
  const groups = buildGroups(gallery);
  const hasGallery = gallery.length > 0;

  return (
    <main className="min-h-screen text-[#0f172a]">

      {/* ══ HERO — imagen a pantalla completa ══ */}
      <section className="relative h-screen min-h-150 w-full overflow-hidden">
        {image?.url ? (
          <Image
            src={image.url} alt={image.alt || title}
            fill priority sizes="100vw" quality={95}
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #0a1628 0%, #0f2233 100%)" }} />
        )}

        {/* Overlay en capas */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(7,17,31,0.3) 0%, rgba(7,17,31,0.55) 50%, rgba(7,17,31,0.92) 100%)" }} />

        {/* Grid técnico */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.06]" style={{ backgroundImage: `linear-gradient(var(--primary) 1px, transparent 1px), linear-gradient(90deg, var(--primary) 1px, transparent 1px)`, backgroundSize: "80px 80px" }} />

        {/* Línea azul superior */}
        <div className="absolute left-0 top-0 h-0.5 w-full" style={{ background: "var(--primary)" }} />

        {/* Breadcrumb */}
        <div className="absolute left-0 right-0 top-0 z-10 pt-(--header-height)">
          <div className="mx-auto flex w-full max-w-7xl items-center gap-2 px-6 pt-6 text-xs text-white/40 md:px-10">
            <Link href="/servicios" className="transition hover:text-white/80">Servicios</Link>
            <span>/</span>
            <span className="text-white/70">{title}</span>
          </div>
        </div>

        {/* Contenido anclado al fondo */}
        <div className="absolute bottom-0 left-0 right-0 z-10 pb-14 md:pb-20">
          <div className="mx-auto w-full max-w-7xl px-6 md:px-10">
            {/* Meta chip */}
            {category && (
              <div className="mb-6">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-white/70 backdrop-blur-sm">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--primary)" }} />
                  {category}
                </span>
              </div>
            )}

            {/* Título */}
            <h1
              className="text-4xl font-black uppercase leading-tight tracking-tight text-white md:text-7xl"
              style={{ textShadow: "0 4px 32px rgba(0,0,0,0.5)" }}
            >
              {title}
            </h1>

            {summary && (
              <p className="mt-4 max-w-2xl text-base leading-7 text-white/70 md:text-lg">
                {summary}
              </p>
            )}

            {/* Scroll indicator */}
            <div className="mt-10 flex items-center gap-3">
              <div className="h-px w-12" style={{ background: "var(--primary)" }} />
              <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-white/50">Scroll para explorar</span>
            </div>
          </div>
        </div>

        {/* Ícono servicio — esquina inferior derecha */}
        {features && features.length > 0 && (
          <div className="absolute bottom-14 right-6 z-10 text-right md:bottom-20 md:right-10">
            <span className="text-5xl font-black tabular-nums text-white/20 md:text-8xl">
              {String(features.length).padStart(2, "0")}
            </span>
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/25">características</p>
          </div>
        )}
      </section>

      {/* ══ DESCRIPCIÓN ══ */}
      {description && (
        <section className="fondo-bg relative py-20 md:py-28">
          <div className="absolute inset-0 bg-white/80" />
          <div className="relative mx-auto w-full max-w-4xl px-6 md:px-10">
            <RevealText delay={0}>
              <div className="mb-6 flex items-center gap-4">
                <div className="h-px w-10" style={{ background: "var(--primary)" }} />
                <p className="text-xs font-bold uppercase tracking-[0.35em]" style={{ color: "var(--primary)" }}>
                  Sobre este servicio
                </p>
              </div>
            </RevealText>
            <RevealText delay={100}>
              <p className="text-xl leading-9 text-slate-600 md:text-2xl md:leading-10">
                {description}
              </p>
            </RevealText>
          </div>
        </section>
      )}

      {/* ══ CARACTERÍSTICAS — mismo peso visual que la galería de proyectos ══ */}
      {features && features.length > 0 && (
        <section className="fondo-bg relative">
          <div className="absolute inset-0 bg-white/72" />

          {/* Separador */}
          <div className="relative mx-auto max-w-7xl px-6 py-6 md:px-10">
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-200" />
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-slate-400">
                {features.length} {features.length === 1 ? "característica" : "características"}
              </p>
              <div className="h-px flex-1 bg-gray-200" />
            </div>
          </div>

          {/* Grid de características */}
          <div className="relative mx-auto max-w-7xl px-6 pt-2 pb-12 md:px-10">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f, i) => (
                <RevealText key={i} delay={i * 50}>
                  <div className="group flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-(--primary) hover:shadow-[0_16px_40px_rgba(47,86,201,0.1)]">
                    <span
                      className="shrink-0 text-2xl font-black tabular-nums leading-none"
                      style={{ color: "var(--primary)" + "30" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="pt-0.5 text-sm leading-6 text-slate-600">{f.text}</p>
                  </div>
                </RevealText>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══ GALERÍA — igual que ProyectoDetail ══ */}
      {hasGallery && (
        <section className="fondo-bg relative">
          <div className="absolute inset-0 bg-white/72" />
          <div className="relative mx-auto max-w-7xl px-6 py-6 md:px-10">
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-200" />
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-slate-400">
                {gallery.length} {gallery.length === 1 ? "imagen" : "imágenes"}
              </p>
              <div className="h-px flex-1 bg-gray-200" />
            </div>
          </div>
          <div className="relative space-y-2 pb-6">
            {groups.map((group, gi) => {
              if (group.type === "full") return (
                <div key={gi} className="relative w-full" style={{ height: "clamp(420px, 75vh, 820px)" }}>
                  <RevealImage src={group.image.url} alt={group.image.alt || title} />
                  {group.image.caption && (
                    <RevealText delay={200} className="absolute bottom-0 left-0 right-0 z-10 bg-linear-to-t from-black/70 to-transparent px-8 pb-8 pt-16 md:px-16">
                      <p className="text-base font-semibold text-white/90 md:text-xl">{group.image.caption}</p>
                    </RevealText>
                  )}
                  <div className="absolute right-6 top-6 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-xs font-bold text-white backdrop-blur-sm">
                    {String(group.index + 1).padStart(2, "0")}
                  </div>
                </div>
              );
              if (group.type === "duo") return (
                <div key={gi} className="flex gap-2">
                  {group.images.map((img, ii) => (
                    <div key={ii} className="relative flex-1" style={{ height: "clamp(280px, 50vh, 600px)" }}>
                      <RevealImage src={img.url} alt={img.alt || title} delay={ii * 100} />
                      {img.caption && (
                        <div className="absolute bottom-0 left-0 right-0 z-10 bg-linear-to-t from-black/65 to-transparent px-5 pb-5 pt-12">
                          <p className="text-sm font-medium text-white/85">{img.caption}</p>
                        </div>
                      )}
                      <div className="absolute right-4 top-4 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-[10px] font-bold text-white backdrop-blur-sm">
                        {String(group.indices[ii] + 1).padStart(2, "0")}
                      </div>
                    </div>
                  ))}
                </div>
              );
              if (group.type === "trio") return (
                <div key={gi} className="flex flex-col gap-2 md:flex-row">
                  <div className="relative w-full md:w-[60%]" style={{ height: "clamp(280px, 55vh, 640px)" }}>
                    <RevealImage src={group.images[0].url} alt={group.images[0].alt || title} />
                    <div className="absolute right-4 top-4 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-[10px] font-bold text-white backdrop-blur-sm">
                      {String(group.indices[0] + 1).padStart(2, "0")}
                    </div>
                  </div>
                  <div className="flex flex-row gap-2 md:w-[40%] md:flex-col">
                    {[group.images[1], group.images[2]].map((img, ii) => (
                      <div key={ii} className="relative flex-1" style={{ minHeight: "clamp(140px, 27vh, 316px)" }}>
                        <RevealImage src={img.url} alt={img.alt || title} delay={(ii + 1) * 100} />
                        <div className="absolute right-3 top-3 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-[9px] font-bold text-white backdrop-blur-sm">
                          {String(group.indices[ii + 1] + 1).padStart(2, "0")}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
              return null;
            })}
          </div>
        </section>
      )}

      {/* ══ CTA — mismo estilo que ProyectoDetail ══ */}
      <section className="fondo-bg relative py-20 md:py-28">
        <div className="absolute inset-0 bg-white/72" />
        <div className="relative mx-auto w-full max-w-4xl px-6 text-center md:px-10">
          <RevealText>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em]" style={{ color: "var(--primary)" }}>
              ¿Te interesa este servicio?
            </p>
            <h2 className="text-3xl font-black uppercase text-[#0f172a] md:text-4xl">
              Solicita una cotización
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-500">
              Contáctanos y cuéntanos tu necesidad. Nuestro equipo te responderá en menos de 24 horas.
            </p>
          </RevealText>
          <RevealText delay={120} className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href={ctaLink || "/contacto"}
              className="rounded-xl px-8 py-3.5 text-sm font-bold transition hover:scale-105 hover:opacity-90 active:scale-95"
              style={{ background: "var(--primary)", color: "white" }}
            >
              Solicitar Cotización →
            </Link>
            <Link
              href="/servicios"
              className="rounded-xl border border-gray-300 px-8 py-3.5 text-sm font-bold text-slate-600 transition hover:border-(--primary) hover:text-(--primary)"
            >
              Ver todos los servicios
            </Link>
          </RevealText>
        </div>
      </section>
    </main>
  );
}
