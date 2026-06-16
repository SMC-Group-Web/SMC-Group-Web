"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type ImageBlock = {
  url: string;
  alt?: string | null;
  caption?: string | null;
};

type Props = {
  title: string;
  slug: string;
  client?: string | null;
  year?: number | null;
  location?: string | null;
  projectType?: string | null;
  summary?: string | null;
  description?: string | null;
  cover?: ImageBlock | null;
  gallery: ImageBlock[];
};

/* Hook simple de reveal al hacer scroll */
function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* Imagen con reveal animado */
function RevealImage({
  src, alt, sizes, priority, delay = 0,
}: {
  src: string; alt: string; sizes?: string;
  priority?: boolean; delay?: number;
}) {
  const { ref, visible } = useReveal(0.1);
  return (
    <div
      ref={ref}
      className="h-full w-full overflow-hidden"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes || "100vw"}
        quality={90}
        priority={priority}
        className={`object-cover transition-transform duration-700 ${visible ? "scale-100" : "scale-105"}`}
      />
    </div>
  );
}

/* Texto con reveal */
function RevealText({ children, delay = 0, className = "" }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  const { ref, visible } = useReveal(0.2);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export default function ProyectoDetail({
  title, slug, client, year, location, projectType,
  summary, description, cover, gallery,
}: Props) {
  // La portada solo va en el hero. La galería muestra solo las fotos adicionales.
  const allImages: ImageBlock[] = gallery;
  const hasImages = allImages.length > 0;

  /* Agrupa la galería en bloques de layout variado */
  type GalleryGroup =
    | { type: "full"; image: ImageBlock; index: number }
    | { type: "duo"; images: [ImageBlock, ImageBlock]; indices: [number, number] }
    | { type: "trio"; images: [ImageBlock, ImageBlock, ImageBlock]; indices: [number, number, number] };

  const buildGroups = (images: ImageBlock[]): GalleryGroup[] => {
    const groups: GalleryGroup[] = [];
    let i = 0;
    let layoutCycle = 0;

    while (i < images.length) {
      const remaining = images.length - i;
      // Ciclo: full → duo → full → trio → repeat
      const pattern = layoutCycle % 4;

      if (pattern === 0 || remaining === 1) {
        groups.push({ type: "full", image: images[i], index: i });
        i += 1;
      } else if (pattern === 1 && remaining >= 2) {
        groups.push({ type: "duo", images: [images[i], images[i + 1]], indices: [i, i + 1] });
        i += 2;
      } else if (pattern === 2 || remaining === 1) {
        groups.push({ type: "full", image: images[i], index: i });
        i += 1;
      } else if (pattern === 3 && remaining >= 3) {
        groups.push({ type: "trio", images: [images[i], images[i + 1], images[i + 2]], indices: [i, i + 1, i + 2] });
        i += 3;
      } else if (remaining >= 2) {
        groups.push({ type: "duo", images: [images[i], images[i + 1]], indices: [i, i + 1] });
        i += 2;
      } else {
        groups.push({ type: "full", image: images[i], index: i });
        i += 1;
      }
      layoutCycle++;
    }
    return groups;
  };

  const groups = buildGroups(allImages);

  const metaChips = [
    client && { label: "Cliente", value: client },
    year && { label: "Año", value: String(year) },
    location && { label: "Ubicación", value: location },
    projectType && { label: "Tipo", value: projectType.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()) },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <main className="min-h-screen text-[#0f172a]">

      {/* ══ HERO — imagen real del proyecto a pantalla completa ══ */}
      <section className="relative h-screen min-h-150 w-full overflow-hidden">
        {/* Imagen de fondo */}
        {cover?.url ? (
          <Image
            src={cover.url}
            alt={cover.alt || title}
            fill
            priority
            sizes="100vw"
            quality={95}
            className="object-cover"
          />
        ) : (
          <div style={{ background: "linear-gradient(135deg, #0a1628 0%, #0f2233 100%)" }} className="absolute inset-0" />
        )}

        {/* Overlay en capas — más oscuro abajo para el texto */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(7,17,31,0.3) 0%, rgba(7,17,31,0.55) 50%, rgba(7,17,31,0.92) 100%)" }} />

        {/* Grid técnico sutil */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.06]" style={{ backgroundImage: `linear-gradient(var(--primary) 1px, transparent 1px), linear-gradient(90deg, var(--primary) 1px, transparent 1px)`, backgroundSize: "80px 80px" }} />

        {/* Línea azul superior */}
        <div className="absolute left-0 top-0 h-0.5 w-full" style={{ background: "var(--primary)" }} />

        {/* Breadcrumb top */}
        <div className="absolute left-0 right-0 top-0 z-10 pt-(--header-height)">
          <div className="mx-auto flex w-full max-w-7xl items-center gap-2 px-6 pt-6 text-xs text-white/40 md:px-10">
            <Link href="/proyectos" className="transition hover:text-white/80">Proyectos</Link>
            <span>/</span>
            <span className="text-white/70">{title}</span>
          </div>
        </div>

        {/* Contenido hero — anclado al fondo */}
        <div className="absolute bottom-0 left-0 right-0 z-10 pb-14 md:pb-20">
          <div className="mx-auto w-full max-w-7xl px-6 md:px-10">

            {/* Meta chips */}
            {metaChips.length > 0 && (
              <div className="mb-6 flex flex-wrap gap-3">
                {metaChips.map((chip) => (
                  <span
                    key={chip.label}
                    className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest backdrop-blur-sm"
                  >
                    <span className="text-white/40">{chip.label}:</span>
                    <span className="text-white/80">{chip.value}</span>
                  </span>
                ))}
              </div>
            )}

            {/* Título — siempre blanco sobre la imagen oscura */}
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

        {/* Contador de fotos — esquina inferior derecha */}
        {hasImages && (
          <div className="absolute bottom-14 right-6 z-10 text-right md:bottom-20 md:right-10">
            <span className="text-5xl font-black tabular-nums text-white/20 md:text-8xl">
              {String(allImages.length).padStart(2, "0")}
            </span>
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/25">fotos</p>
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
                  Sobre el proyecto
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

      {/* ══ GALERÍA MAGAZINE ══ */}
      {hasImages && (
        <section className="fondo-bg relative">
          <div className="absolute inset-0 bg-white/72" />
          {/* Línea separadora */}
          <div className="relative mx-auto max-w-7xl px-6 py-6 md:px-10">
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-200" />
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-slate-400">
                {allImages.length} {allImages.length === 1 ? "imagen" : "imágenes"}
              </p>
              <div className="h-px flex-1 bg-gray-200" />
            </div>
          </div>

          <div className="relative space-y-2 pb-6">
            {groups.map((group, gi) => {
              if (group.type === "full") {
                return (
                  <div key={gi} className="relative w-full" style={{ height: "clamp(420px, 75vh, 820px)" }}>
                    <RevealImage
                      src={group.image.url}
                      alt={group.image.alt || title}
                      sizes="100vw"
                      priority={group.index === 0}
                    />
                    {/* Overlay + caption */}
                    {group.image.caption && (
                      <RevealText
                        delay={200}
                        className="absolute bottom-0 left-0 right-0 z-10 bg-linear-to-t from-black/70 to-transparent px-8 pb-8 pt-16 md:px-16"
                      >
                        <p className="text-base font-semibold text-white/90 md:text-xl">
                          {group.image.caption}
                        </p>
                      </RevealText>
                    )}
                    {/* Número */}
                    <div className="absolute right-6 top-6 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-xs font-bold text-white backdrop-blur-sm">
                      {String(group.index + 1).padStart(2, "0")}
                    </div>
                  </div>
                );
              }

              if (group.type === "duo") {
                return (
                  <div key={gi} className="flex gap-2">
                    {group.images.map((img, ii) => (
                      <div key={ii} className="relative flex-1" style={{ height: "clamp(280px, 50vh, 600px)" }}>
                        <RevealImage
                          src={img.url}
                          alt={img.alt || title}
                          sizes="50vw"
                          delay={ii * 100}
                        />
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
              }

              if (group.type === "trio") {
                return (
                  <div key={gi} className="flex flex-col gap-2 md:flex-row">
                    {/* Primera imagen: 60% del ancho en desktop */}
                    <div className="relative w-full md:w-[60%]" style={{ height: "clamp(280px, 55vh, 640px)" }}>
                      <RevealImage
                        src={group.images[0].url}
                        alt={group.images[0].alt || title}
                        sizes="(max-width: 768px) 100vw, 60vw"
                      />
                      {group.images[0].caption && (
                        <div className="absolute bottom-0 left-0 right-0 z-10 bg-linear-to-t from-black/65 to-transparent px-5 pb-5 pt-12">
                          <p className="text-sm font-medium text-white/85">{group.images[0].caption}</p>
                        </div>
                      )}
                      <div className="absolute right-4 top-4 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-[10px] font-bold text-white backdrop-blur-sm">
                        {String(group.indices[0] + 1).padStart(2, "0")}
                      </div>
                    </div>
                    {/* Dos imágenes apiladas: 40% */}
                    <div className="flex flex-row gap-2 md:w-[40%] md:flex-col">
                      {[group.images[1], group.images[2]].map((img, ii) => (
                        <div key={ii} className="relative flex-1" style={{ minHeight: "clamp(140px, 27vh, 316px)" }}>
                          <RevealImage
                            src={img.url}
                            alt={img.alt || title}
                            sizes="(max-width: 768px) 50vw, 40vw"
                            delay={(ii + 1) * 100}
                          />
                          <div className="absolute right-3 top-3 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-[9px] font-bold text-white backdrop-blur-sm">
                            {String(group.indices[ii + 1] + 1).padStart(2, "0")}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              return null;
            })}
          </div>
        </section>
      )}

      {/* ══ CTA FINAL ══ */}
      <section className="fondo-bg relative py-20 md:py-28">
        <div className="absolute inset-0 bg-white/72" />
        <div className="relative mx-auto w-full max-w-4xl px-6 text-center md:px-10">
          <RevealText>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em]" style={{ color: "var(--primary)" }}>
              ¿Tienes un proyecto similar?
            </p>
            <h2 className="text-3xl font-black uppercase text-[#0f172a] md:text-4xl">
              Trabajemos juntos
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-500">
              Contáctanos y cuéntanos sobre tu proyecto. Nuestro equipo está listo para ofrecerte la mejor solución de ingeniería.
            </p>
          </RevealText>
          <RevealText delay={120} className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contacto"
              className="rounded-xl px-8 py-3.5 text-sm font-bold transition hover:scale-105 hover:opacity-90 active:scale-95"
              style={{ background: "var(--primary)", color: "white" }}
            >
              Solicitar Cotización →
            </Link>
            <Link
              href="/proyectos"
              className="rounded-xl border border-gray-300 px-8 py-3.5 text-sm font-bold text-slate-600 transition hover:border-(--primary) hover:text-(--primary)"
            >
              Ver más proyectos
            </Link>
          </RevealText>
        </div>
      </section>
    </main>
  );
}
