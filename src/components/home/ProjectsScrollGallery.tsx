"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

type Project = {
  id: string | number;
  title: string;
  slug: string;
  client?: string | null;
  coverImage?: {
    url?: string | null;
    alt?: string | null;
  } | null;
};

type Props = {
  projects: Project[];
};

export default function ProjectsScrollGallery({ projects }: Props) {
  const [active, setActive] = useState(0);
  const [sectionVisible, setSectionVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(i);
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
        if (entry.isIntersecting) {
          setSectionVisible(true);
          observer.disconnect();
        }
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

    useEffect(() => {
      const el = ref.current;
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        },
        { threshold: 0.15 },
      );
      observer.observe(el);
      return () => observer.disconnect();
    }, []);

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{
          duration: 0.6,
          delay: visible ? (index % 2) * 0.1 : 0,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <Link href={`/proyectos/${project.slug}`}>
          <article className="group relative overflow-hidden rounded-2xl">
            <div className="relative h-72 w-full overflow-hidden bg-slate-200">
              {project.coverImage?.url ? (
                <Image
                  src={project.coverImage.url}
                  alt={project.coverImage.alt || project.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  quality={85}
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
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

              {/* Overlay gradiente permanente */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(10,22,40,0.88) 0%, rgba(10,22,40,0.15) 60%, transparent 100%)",
                }}
              />

              {/* Esquinas técnicas */}
              <div className="pointer-events-none absolute inset-0">
                <motion.div
                  className="absolute left-3 top-3"
                  initial={{ opacity: 0 }}
                  animate={visible ? { opacity: 1 } : { opacity: 0 }}
                  transition={{
                    delay: visible ? 0.3 + (index % 2) * 0.1 : 0,
                    duration: 0.3,
                  }}
                >
                  <div
                    className="h-4 w-px"
                    style={{ background: "var(--primary)" }}
                  />
                  <div
                    className="h-px w-4"
                    style={{ background: "var(--primary)" }}
                  />
                </motion.div>
                <motion.div
                  className="absolute right-3 top-3 flex flex-col items-end"
                  initial={{ opacity: 0 }}
                  animate={visible ? { opacity: 1 } : { opacity: 0 }}
                  transition={{
                    delay: visible ? 0.3 + (index % 2) * 0.1 : 0,
                    duration: 0.3,
                  }}
                >
                  <div
                    className="h-4 w-px"
                    style={{ background: "var(--primary)" }}
                  />
                  <div
                    className="h-px w-4"
                    style={{ background: "var(--primary)" }}
                  />
                </motion.div>
              </div>

              {/* Texto abajo siempre visible */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 p-4"
                initial={{ opacity: 0, y: 12 }}
                animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                transition={{
                  delay: visible ? 0.2 + (index % 2) * 0.1 : 0,
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {project.client && (
                  <p
                    className="mb-1 text-[10px] font-bold uppercase tracking-[0.25em]"
                    style={{ color: "var(--primary)" }}
                  >
                    {project.client}
                  </p>
                )}
                <h3 className="text-base font-bold leading-snug text-white">
                  {project.title}
                </h3>
                <p className="mt-1.5 text-xs font-semibold text-white/60">
                  Ver proyecto →
                </p>
              </motion.div>
            </div>
          </article>
        </Link>
      </motion.div>
    );
  }

  return (
    <div ref={sectionRef} className="relative w-full">
      {/* ── MOBILE: grid animado ── */}
      <div className="md:hidden px-6">
        {/* HEADER mobile */}
        <motion.div
          className="mb-8 flex flex-col gap-2"
          initial={{ opacity: 0, y: 30 }}
          animate={sectionVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center gap-3">
            <div
              className="h-px w-10"
              style={{ background: "var(--primary)" }}
            />
            <p
              className="text-xs font-bold uppercase tracking-[0.3em]"
              style={{ color: "var(--primary)" }}
            >
              Portafolio de obras
            </p>
          </div>
          <h2 className="text-4xl font-black uppercase text-[#0f172a]">
            PROYECTOS{" "}
            <span style={{ color: "var(--primary)" }}>REALIZADOS</span>
          </h2>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2">
          {projects.map((project, i) => (
            <MobileCard key={project.id} project={project} index={i} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/proyectos"
            className="inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-sm font-semibold transition-all hover:scale-105 hover:opacity-90"
            style={{ background: "var(--primary)", color: "white" }}
          >
            Ver todos los proyectos →
          </Link>
        </div>
      </div>

      {/* ── DESKTOP: imagen sticky izquierda full height + lista derecha ── */}
      <div className="hidden md:flex" style={{ overflow: "clip" }}>
        {/* LEFT: imagen sticky full height */}
        <motion.div
          className="w-1/2 shrink-0"
          initial={{ clipPath: "inset(0 100% 0 0)", opacity: 0 }}
          animate={sectionVisible
            ? { clipPath: "inset(0 0% 0 0)", opacity: 1 }
            : { clipPath: "inset(0 100% 0 0)", opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
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
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  className="absolute inset-0"
                  initial={{ clipPath: "inset(100% 0% 0% 0%)", opacity: 0 }}
                  animate={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }}
                  exit={{ clipPath: "inset(0% 0% 100% 0%)", opacity: 0 }}
                  transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
                >
                  {projects[active]?.coverImage?.url ? (
                    <Image
                      src={projects[active].coverImage!.url!}
                      alt={
                        projects[active].coverImage?.alt ||
                        projects[active].title
                      }
                      fill
                      sizes="50vw"
                      quality={92}
                      className="object-cover"
                      priority={active === 0}
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

                  {/* Overlay sutil */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(10,22,40,0.15) 0%, transparent 50%)",
                    }}
                  />

                  {/* Esquinas técnicas */}
                  <div className="pointer-events-none absolute inset-0">
                    <motion.div
                      key={`tl-${active}`}
                      className="absolute left-6 top-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4, duration: 0.3 }}
                    >
                      <div
                        className="h-8 w-px"
                        style={{ background: "var(--primary)" }}
                      />
                      <div
                        className="h-px w-8"
                        style={{ background: "var(--primary)" }}
                      />
                    </motion.div>
                    <motion.div
                      key={`tr-${active}`}
                      className="absolute right-6 top-6 flex flex-col items-end"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4, duration: 0.3 }}
                    >
                      <div
                        className="h-8 w-px"
                        style={{ background: "var(--primary)" }}
                      />
                      <div
                        className="h-px w-8"
                        style={{ background: "var(--primary)" }}
                      />
                    </motion.div>
                  </div>

                  {/* Progress bar lateral */}
                  <div className="absolute bottom-0 right-0 top-0 w-1 bg-white/10">
                    <motion.div
                      className="w-full origin-top"
                      style={{ background: "var(--primary)" }}
                      animate={{
                        height: `${((active + 1) / projects.length) * 100}%`,
                      }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Contador top-left */}
              <div className="absolute left-8 top-8 z-10 flex items-center gap-3">
                <motion.span
                  key={`count-${active}`}
                  className="text-5xl font-black tabular-nums text-white"
                  style={{
                    lineHeight: 1,
                    textShadow: "0 2px 12px rgba(0,0,0,0.5)",
                  }}
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
            </div>
          </div>
        </motion.div>

        {/* RIGHT: lista scrollable */}
        <motion.div
          className="w-1/2 px-16 py-20"
          initial={{ clipPath: "inset(0 0 0 100%)", opacity: 0 }}
          animate={sectionVisible
            ? { clipPath: "inset(0 0 0 0%)", opacity: 1 }
            : { clipPath: "inset(0 0 0 100%)", opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Header dentro de la lista */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="h-px w-10"
                style={{ background: "var(--primary)" }}
              />
              <p
                className="text-xs font-bold uppercase tracking-[0.3em]"
                style={{ color: "var(--primary)" }}
              >
                Portafolio de obras
              </p>
            </div>
            <h2 className="text-5xl font-black uppercase text-[#0f172a]">
              PROYECTOS{" "}
              <span style={{ color: "var(--primary)" }}>REALIZADOS</span>
            </h2>
          </div>

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
