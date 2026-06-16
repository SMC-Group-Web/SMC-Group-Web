"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedTitle from "@/components/ui/AnimatedTitle";

type Photo = { url: string; alt?: string | null };

type Project = {
  id: string | number;
  title: string;
  slug: string;
  client?: string | null;
  summary?: string | null;
  description?: string | null;
  projectType?: string | null;
  coverImage?: { url?: string | null; alt?: string | null } | null;
  gallery?: Photo[];
};

type Props = {
  projects: Project[];
};

// dir: 1=derecha, -1=izquierda; type: "project"=vertical, "photo"=horizontal
type SlideCtx = { type: "project" | "photo"; dir: 1 | -1 };

const photoVariants = {
  enter: ({ type, dir }: SlideCtx) => ({
    opacity: 0,
    y: type === "project" ? 16 : 0,
    x: type === "photo" ? (dir > 0 ? 16 : -16) : 0,
  }),
  center: { opacity: 1, y: 0, x: 0 },
  exit: ({ type, dir }: SlideCtx) => ({
    opacity: 0,
    y: type === "project" ? -16 : 0,
    x: type === "photo" ? (dir > 0 ? -16 : 16) : 0,
  }),
};

/* Botones de navegación directa — uno por proyecto */
function ProjectNavButtons({
  projects,
  active,
  onSelect,
}: {
  projects: Project[];
  active: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {projects.map((p, i) => (
        <button
          key={p.id}
          onClick={() => onSelect(i)}
          title={p.title}
          className={`rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all duration-200 ${
            active === i
              ? "text-white shadow-sm"
              : "border border-gray-200 bg-white text-slate-500 hover:border-(--primary) hover:text-(--primary)"
          }`}
          style={active === i ? { background: "var(--primary)" } : {}}
        >
          {/* Número + título truncado */}
          <span className="mr-1 opacity-60">{String(i + 1).padStart(2, "0")}</span>
          {p.client ?? p.title.split(" ").slice(0, 3).join(" ")}
        </button>
      ))}
    </div>
  );
}

export default function ProjectsScrollGallery({ projects }: Props) {
  const [active, setActive] = useState(0);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [sectionVisible, setSectionVisible] = useState(false);
  const slideCtx = useRef<SlideCtx>({ type: "project", dir: 1 });
  const sectionRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) { slideCtx.current = { type: "project", dir: 1 }; setActive(i); setPhotoIndex(0); }
        },
        { root: null, rootMargin: "-45% 0px -45% 0px", threshold: 0 },
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [projects]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setSectionVisible(entry.isIntersecting);
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (projects.length === 0) return null;

  function MobileCard({ project, index }: { project: Project; index: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    const [photoIdx, setPhotoIdx] = useState(0);

    const allPhotos: Photo[] = [
      ...(project.coverImage?.url ? [{ url: project.coverImage.url, alt: project.coverImage.alt }] : []),
      ...(project.gallery ?? []),
    ];
    const hasMultiple = allPhotos.length > 1;
    const current = allPhotos[photoIdx] ?? allPhotos[0];

    useEffect(() => {
      const el = ref.current;
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => { setVisible(entry.isIntersecting); },
        { threshold: 0.15 },
      );
      observer.observe(el);
      return () => observer.disconnect();
    }, []);

    const prev = (e: React.MouseEvent) => {
      e.preventDefault(); e.stopPropagation();
      setPhotoIdx(p => (p - 1 + allPhotos.length) % allPhotos.length);
    };
    const next = (e: React.MouseEvent) => {
      e.preventDefault(); e.stopPropagation();
      setPhotoIdx(p => (p + 1) % allPhotos.length);
    };

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.6, delay: visible ? (index % 2) * 0.1 : 0, ease: [0.22, 1, 0.36, 1] }}
      >
        <Link href={`/proyectos/${project.slug}`}>
          <article className="group relative overflow-hidden rounded-2xl">
            <div className="relative h-64 w-full overflow-hidden bg-slate-200">

              {/* Foto activa */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={photoIdx}
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {current?.url ? (
                    <Image
                      src={current.url}
                      alt={current.alt || project.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      quality={90}
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full" style={{ background: "linear-gradient(135deg, #0a1628 0%, #0f2233 100%)" }} />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Overlay */}
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,22,40,0.88) 0%, rgba(10,22,40,0.15) 60%, transparent 100%)" }} />

              {/* Flechas navegación */}
              {hasMultiple && (
                <>
                  <button
                    onClick={prev}
                    className="absolute left-2 top-1/2 z-20 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm"
                    aria-label="Foto anterior"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                  </button>
                  <button
                    onClick={next}
                    className="absolute right-2 top-1/2 z-20 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm"
                    aria-label="Foto siguiente"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                  </button>
                </>
              )}

              {/* Dots */}
              {hasMultiple && (
                <div className="absolute bottom-14 left-0 right-0 z-20 flex justify-center gap-1.5">
                  {allPhotos.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={e => { e.preventDefault(); e.stopPropagation(); setPhotoIdx(idx); }}
                      className="h-1.5 rounded-full transition-all duration-300"
                      style={{ width: idx === photoIdx ? "1.5rem" : "0.375rem", background: idx === photoIdx ? "var(--primary)" : "rgba(255,255,255,0.5)" }}
                      aria-label={`Foto ${idx + 1}`}
                    />
                  ))}
                </div>
              )}

              {/* Contador */}
              {hasMultiple && (
                <div className="absolute right-3 top-3 z-20 flex h-6 items-center rounded-full bg-black/50 px-2 text-[10px] font-bold text-white backdrop-blur-sm">
                  {photoIdx + 1}/{allPhotos.length}
                </div>
              )}

              {/* Texto */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 p-4"
                initial={{ opacity: 0, y: 12 }}
                animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                transition={{ delay: visible ? 0.2 + (index % 2) * 0.1 : 0, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                {project.client && (
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color: "var(--primary)" }}>
                    {project.client}
                  </p>
                )}
                <h3 className="text-sm font-bold leading-snug text-white">{project.title}</h3>
                <p className="mt-1 text-xs font-semibold text-white/60">Ver proyecto →</p>
              </motion.div>
            </div>
          </article>
        </Link>
      </motion.div>
    );
  }

  return (
    <div ref={sectionRef} className="relative w-full">
      {/* ── MOBILE ── */}
      <div className="md:hidden pb-10">
        {/* Header sticky mobile */}
        <motion.div
          className="sticky z-20 bg-white px-4 pb-4 pt-6 sm:px-6"
          style={{ top: "var(--header-height, 73px)" }}
          initial={{ opacity: 0, y: 24 }}
          animate={sectionVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-2 flex items-center gap-3">
            <div className="h-px w-10" style={{ background: "var(--primary)" }} />
            <p className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: "var(--primary)" }}>
              Portafolio de obras
            </p>
          </div>
          <AnimatedTitle text="Proyectos Realizados" highlight="Realizados" className="text-3xl font-black uppercase text-[#0f172a] sm:text-4xl" />
          <p className="mt-1.5 text-sm leading-6 text-slate-500">
            {projects.length} proyectos destacados ejecutados con precisión técnica.
          </p>
          <div className="mt-4 h-px w-full bg-gray-100" />
        </motion.div>

        <div className="grid gap-5 px-4 sm:grid-cols-2 sm:px-6">
          {projects.map((project, i) => (
            <MobileCard key={project.id} project={project} index={i} />
          ))}
        </div>

        <div className="mt-8 px-4 text-center sm:px-6">
          <Link
            href="/proyectos"
            className="inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-sm font-bold transition-all hover:scale-105 hover:opacity-90"
            style={{ background: "var(--primary)", color: "white" }}
          >
            Ver todos los proyectos →
          </Link>
        </div>
      </div>

      {/* ── DESKTOP: imagen sticky izquierda full height + lista derecha ── */}
      <div className="hidden md:flex">
        {/* LEFT: imagen sticky full height */}
        <motion.div
          className="w-1/2 shrink-0"
          initial={{ opacity: 0, x: -40 }}
          animate={sectionVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className="sticky"
            style={{
              top: "var(--header-height, 73px)",
              height: "calc(100vh - var(--header-height, 73px))",
              willChange: "transform",
              transform: "translateZ(0)",
            }}
          >
            {/* Imagen a pantalla completa */}
            <div className="relative h-full w-full overflow-hidden bg-slate-900">
              {(() => {
                const proj = projects[active];
                const cover = proj?.coverImage?.url
                  ? { url: proj.coverImage.url, alt: proj.coverImage.alt }
                  : null;
                const allPhotos: Photo[] = [
                  ...(cover ? [cover as Photo] : []),
                  ...(proj?.gallery ?? []),
                ];
                const currentPhoto = allPhotos[photoIndex] ?? null;
                const hasMultiple = allPhotos.length > 1;

                return (
                  <>
                    <AnimatePresence mode="wait" custom={slideCtx.current}>
                      <motion.div
                        key={`${active}-${photoIndex}`}
                        custom={slideCtx.current}
                        variants={photoVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
                        className="absolute inset-0"
                      >
                        {currentPhoto?.url ? (
                          <Image
                            src={currentPhoto.url}
                            alt={currentPhoto.alt || proj?.title || ""}
                            fill
                            sizes="50vw"
                            quality={92}
                            className="object-cover"
                            priority={active === 0 && photoIndex === 0}
                          />
                        ) : (
                          <div className="h-full w-full" style={{ background: "linear-gradient(135deg, #0a1628 0%, #0f2233 100%)" }} />
                        )}

                        {/* Overlay */}
                        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(10,22,40,0.15) 0%, transparent 50%)" }} />

                        {/* Esquinas técnicas */}
                        <div className="pointer-events-none absolute inset-0">
                          <div className="absolute left-6 top-6">
                            <div className="h-8 w-px" style={{ background: "var(--primary)" }} />
                            <div className="h-px w-8" style={{ background: "var(--primary)" }} />
                          </div>
                          <div className="absolute right-6 top-6 flex flex-col items-end">
                            <div className="h-8 w-px" style={{ background: "var(--primary)" }} />
                            <div className="h-px w-8" style={{ background: "var(--primary)" }} />
                          </div>
                        </div>

                        {/* Progress bar lateral */}
                        <div className="absolute bottom-0 right-0 top-0 w-1 bg-white/10">
                          <motion.div
                            className="w-full origin-top"
                            style={{ background: "var(--primary)" }}
                            animate={{ height: `${((active + 1) / projects.length) * 100}%` }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                          />
                        </div>
                      </motion.div>
                    </AnimatePresence>

                    {/* Badge indicador de galería — aparece solo cuando hay más fotos */}
                    {hasMultiple && (
                      <motion.div
                        key={`badge-${active}`}
                        className="absolute left-6 bottom-16 z-20 flex items-center gap-1.5 rounded-full px-3 py-1.5 backdrop-blur-sm"
                        style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.15)" }}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.4 }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7">
                          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                          <circle cx="12" cy="13" r="4"/>
                        </svg>
                        <span className="text-[11px] font-semibold text-white/80">
                          {photoIndex + 1} / {allPhotos.length} fotos
                        </span>
                      </motion.div>
                    )}

                    {/* Flechas navegación */}
                    {hasMultiple && (
                      <>
                        <button
                          onClick={() => {
                            slideCtx.current = { type: "photo", dir: -1 };
                            setPhotoIndex((p) => (p - 1 + allPhotos.length) % allPhotos.length);
                          }}
                          className="absolute left-4 top-1/2 z-20 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/60"
                          aria-label="Foto anterior"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                        </button>
                        <button
                          onClick={() => {
                            slideCtx.current = { type: "photo", dir: 1 };
                            setPhotoIndex((p) => (p + 1) % allPhotos.length);
                          }}
                          className="absolute right-6 top-1/2 z-20 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/60"
                          aria-label="Foto siguiente"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                        </button>
                      </>
                    )}

                    {/* Dots */}
                    {hasMultiple && (
                      <div className="absolute bottom-6 left-0 right-6 z-20 flex justify-center gap-2">
                        {allPhotos.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              slideCtx.current = { type: "photo", dir: idx > photoIndex ? 1 : -1 };
                              setPhotoIndex(idx);
                            }}
                            className="h-1.5 rounded-full transition-all duration-300"
                            style={{
                              width: idx === photoIndex ? "1.5rem" : "0.375rem",
                              background: idx === photoIndex ? "var(--primary)" : "rgba(255,255,255,0.4)",
                            }}
                            aria-label={`Foto ${idx + 1}`}
                          />
                        ))}
                      </div>
                    )}

                    {/* Contador top-left */}
                    <div className="absolute left-8 top-8 z-10 flex items-center gap-3">
                      <motion.span
                        key={`count-${active}`}
                        className="text-5xl font-black tabular-nums text-white"
                        style={{ lineHeight: 1, textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      >
                        {String(active + 1).padStart(2, "0")}
                      </motion.span>
                      <span className="text-xl font-light text-white/40">/</span>
                      <span className="text-lg font-semibold text-white/40">
                        {String(projects.length).padStart(2, "0")}
                      </span>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </motion.div>

        {/* RIGHT: lista scrollable */}
        <motion.div
          className="w-1/2 px-16"
          initial={{ opacity: 0, x: 40 }}
          animate={sectionVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* ── BLOQUE STICKY: título + tabs ── */}
          <div
            className="sticky z-20 bg-white pb-5 pt-8"
            style={{ top: "var(--header-height, 73px)" }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px w-10" style={{ background: "var(--primary)" }} />
              <p className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: "var(--primary)" }}>
                Portafolio de obras
              </p>
            </div>
            <AnimatedTitle text="Proyectos Realizados" highlight="Realizados" className="text-5xl font-black uppercase text-[#0f172a]" />
            <div className="mt-5">
              <ProjectNavButtons
                projects={projects}
                active={active}
                onSelect={(i) => {
                  slideCtx.current = { type: "project", dir: i > active ? 1 : -1 };
                  setActive(i);
                  setPhotoIndex(0);
                  itemRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "center" });
                }}
              />
            </div>
            <div className="mt-5 h-px w-full bg-gray-100" />
          </div>

          {/* ── LISTA SCROLLABLE ── */}
          {projects.map((project, i) => {
            const isActive = active === i;
            return (
              <div
                key={project.id}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                className="min-h-[50vh] flex items-center py-16 border-b border-gray-100 last:border-0"
              >
                <Link
                  href={`/proyectos/${project.slug}`}
                  className="group block w-full"
                >
                  <div className="flex items-start gap-6">
                    <motion.span
                      className="shrink-0 text-4xl font-black tabular-nums leading-none"
                      animate={{
                        color: isActive ? "var(--primary)" : "#e2e8f0",
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </motion.span>
                    <div className="flex-1">
                      <motion.div
                        className="mb-4 h-px"
                        animate={{ width: isActive ? "3rem" : "0rem" }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        style={{ background: "var(--primary)" }}
                      />
                      {project.client && (
                        <motion.p
                          className="mb-2 text-xs font-bold uppercase tracking-[0.25em]"
                          animate={{
                            color: isActive ? "var(--primary)" : "#94a3b8",
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          {project.client}
                        </motion.p>
                      )}
                      <motion.h3
                        className="text-3xl font-black leading-tight"
                        animate={{ color: isActive ? "#0f172a" : "#94a3b8" }}
                        transition={{ duration: 0.3 }}
                      >
                        {project.title}
                      </motion.h3>
                      {(project.description || project.summary) && (
                        <motion.p
                          className="mt-3 text-sm leading-6 text-slate-500"
                          animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 6 }}
                          transition={{ duration: 0.3, delay: isActive ? 0.05 : 0 }}
                        >
                          {project.description || project.summary}
                        </motion.p>
                      )}
                      <motion.div
                        className="mt-5 flex items-center gap-2 text-sm font-bold"
                        animate={{
                          opacity: isActive ? 1 : 0,
                          y: isActive ? 0 : 8,
                        }}
                        transition={{
                          duration: 0.3,
                          delay: isActive ? 0.1 : 0,
                        }}
                        style={{ color: "var(--primary)" }}
                      >
                        Ver proyecto completo
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </motion.div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}

          {/* CTA */}
          <div className="pt-16 pb-20">
            <Link
              href="/proyectos"
              className="inline-flex items-center gap-2 rounded-xl px-8 py-4 text-sm font-bold transition-all hover:scale-105 hover:opacity-90"
              style={{ background: "var(--primary)", color: "white" }}
            >
              Ver todos los proyectos →
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
