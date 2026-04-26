"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

type Servicio = {
  id: string | number;
  title: string;
  slug: string;
  category?: string | null;
  summary?: string | null;
  features?: { text: string }[];
  image?: { url?: string | null; alt?: string | null } | null;
};

type Props = {
  services: Servicio[];
};

function MobileCard({
  servicio,
  index,
}: {
  servicio: Servicio;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
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
      <Link href={`/servicios/${servicio.slug}`}>
        <article className="group relative overflow-hidden rounded-2xl">
          <div className="relative h-64 w-full overflow-hidden bg-slate-200">
            {servicio.image?.url ? (
              <Image
                src={servicio.image.url}
                alt={servicio.image.alt || servicio.title}
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
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(10,22,40,0.88) 0%, rgba(10,22,40,0.1) 60%, transparent 100%)",
              }}
            />
            <div className="pointer-events-none absolute inset-0">
              <div
                className="absolute left-3 top-3"
                style={{ opacity: visible ? 1 : 0, transition: "opacity 0.3s" }}
              >
                <div
                  className="h-4 w-px"
                  style={{ background: "var(--primary)" }}
                />
                <div
                  className="h-px w-4"
                  style={{ background: "var(--primary)" }}
                />
              </div>
              <div
                className="absolute right-3 top-3 flex flex-col items-end"
                style={{ opacity: visible ? 1 : 0, transition: "opacity 0.3s" }}
              >
                <div
                  className="h-4 w-px"
                  style={{ background: "var(--primary)" }}
                />
                <div
                  className="h-px w-4"
                  style={{ background: "var(--primary)" }}
                />
              </div>
            </div>
            <motion.div
              className="absolute bottom-0 left-0 right-0 p-4"
              initial={{ opacity: 0, y: 12 }}
              animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              transition={{
                delay: visible ? 0.2 : 0,
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {servicio.category && (
                <p
                  className="mb-1 text-[10px] font-bold uppercase tracking-[0.25em]"
                  style={{ color: "var(--primary)" }}
                >
                  {servicio.category}
                </p>
              )}
              <h3 className="text-base font-bold leading-snug text-white">
                {servicio.title}
              </h3>
              <p className="mt-1.5 text-xs font-semibold text-white/60">
                Ver servicio →
              </p>
            </motion.div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}

function CategoryTabs({
  categories,
  services,
  activeCategory,
  onSelect,
}: {
  categories: string[];
  services: Servicio[];
  activeCategory: string;
  onSelect: (cat: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect("all")}
        className={`rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all duration-200 ${
          activeCategory === "all"
            ? "text-white shadow-sm"
            : "border border-gray-200 bg-white text-slate-500 hover:border-(--primary) hover:text-(--primary)"
        }`}
        style={activeCategory === "all" ? { background: "var(--primary)" } : {}}
      >
        Todos ({services.length})
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all duration-200 ${
            activeCategory === cat
              ? "text-white shadow-sm"
              : "border border-gray-200 bg-white text-slate-500 hover:border-(--primary) hover:text-(--primary)"
          }`}
          style={activeCategory === cat ? { background: "var(--primary)" } : {}}
        >
          {cat} ({services.filter((s) => s.category === cat).length})
        </button>
      ))}
    </div>
  );
}

export default function ServiciosScrollGallery({ services }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [active, setActive] = useState(0);
  const [sectionVisible, setSectionVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const categories = useMemo(() => {
    const seen = new Set<string>();
    const result: string[] = [];
    services.forEach((s) => {
      if (s.category && !seen.has(s.category)) {
        seen.add(s.category);
        result.push(s.category);
      }
    });
    return result;
  }, [services]);

  const filteredServices = useMemo(() => {
    if (activeCategory === "all") return services;
    return services.filter((s) => s.category === activeCategory);
  }, [services, activeCategory]);

  useEffect(() => {
    setActive(0);
    // No borrar itemRefs aquí — React llama los ref callbacks con null al desmontar
    // y con el nuevo elemento al montar. El observer effect los recogerá ya populados.
  }, [activeCategory]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(i);
        },
        { root: null, rootMargin: "-45% 0px -45% 0px", threshold: 0 },
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [filteredServices]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSectionVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  if (services.length === 0) return null;

  return (
    <div ref={sectionRef} className="relative w-full">
      {/* ── MOBILE ── */}
      <div className="px-4 pb-10 sm:px-6 md:hidden">
        {/* Header */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 24 }}
          animate={sectionVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-3 flex items-center gap-3">
            <div className="h-px w-10" style={{ background: "var(--primary)" }} />
            <p className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: "var(--primary)" }}>
              Capacidades técnicas
            </p>
          </div>
          <h2 className="text-3xl font-black uppercase text-[#0f172a] sm:text-4xl">
            Nuestros <span style={{ color: "var(--primary)" }}>Servicios</span>
          </h2>
          {/* Retail badge compacto */}
          <div className="mt-3 flex items-center gap-2">
            <svg className="h-3.5 w-3.5 shrink-0" fill="currentColor" style={{ color: "var(--primary)" }} viewBox="0 0 24 24">
              <path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
            </svg>
            <p className="text-xs text-slate-500">
              <span className="font-bold" style={{ color: "var(--primary)" }}>Líderes en Retail</span>
              {" · "}Soluciones para cualquier industria
            </p>
          </div>
        </motion.div>

        {/* Grid — todos los servicios sin filtro en mobile */}
        <div className="grid gap-5 sm:grid-cols-2">
          {services.map((s, i) => (
            <MobileCard key={s.id} servicio={s} index={i} />
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/servicios"
            className="inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-sm font-semibold transition-all hover:scale-105 hover:opacity-90"
            style={{ background: "var(--primary)", color: "white" }}
          >
            Ver todos los servicios →
          </Link>
        </div>
      </div>

      {/* ── DESKTOP ── */}
      {/* Sin overflow:clip — necesario para que position:sticky funcione en el panel izquierdo */}
      <div className="hidden md:flex">
        {/* LEFT: header sticky + lista scrollable */}
        <motion.div
          className="w-1/2 px-16"
          initial={{ opacity: 0, x: -40 }}
          animate={
            sectionVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }
          }
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* ── BLOQUE STICKY: título + badge + tabs ── */}
          <div
            className="sticky z-20 bg-white pb-5 pt-8"
            style={{ top: "var(--header-height, 73px)" }}
          >
            {/* Header */}
            <div className="mb-6">
              <div className="mb-3 flex items-center gap-3">
                <div
                  className="h-px w-10"
                  style={{ background: "var(--primary)" }}
                />
                <p
                  className="text-xs font-bold uppercase tracking-[0.3em]"
                  style={{ color: "var(--primary)" }}
                >
                  Capacidades técnicas
                </p>
              </div>
              <h2 className="text-5xl font-black uppercase text-[#0f172a]">
                NUESTROS{" "}
                <span style={{ color: "var(--primary)" }}>SERVICIOS</span>
              </h2>
            </div>

            {/* Retail leader badge */}
            <div
              className="mb-6 flex items-center gap-4 rounded-2xl border p-4"
              style={{
                borderColor: "var(--primary)" + "25",
                background: "var(--primary)" + "06",
              }}
            >
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                style={{ background: "var(--primary)" }}
              >
                <svg
                  className="h-5 w-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-bold"
                  style={{ color: "var(--primary)" }}
                >
                  Líderes en el Sector Retail
                </p>
                <p className="text-xs leading-5 text-slate-500">
                  +5 años ejecutando proyectos de alto estándar en retail. La
                  misma excelencia para cualquier sector.
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p
                  className="text-2xl font-black tabular-nums"
                  style={{ color: "var(--primary)" }}
                >
                  200+
                </p>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Proyectos
                </p>
              </div>
            </div>

            {/* Category tabs */}
            <CategoryTabs
              categories={categories}
              services={services}
              activeCategory={activeCategory}
              onSelect={setActiveCategory}
            />

            {/* Separador visual — los items scrollan por debajo de este borde */}
            <div className="mt-5 h-px w-full bg-gray-100" />
          </div>

          {/* ── LISTA SCROLLABLE ── */}
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {filteredServices.map((s, i) => {
              const isActive = active === i;
              return (
                <div
                  key={s.id}
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  className="flex min-h-[50vh] items-center border-b border-gray-100 py-16 last:border-0"
                >
                  <Link
                    href={`/servicios/${s.slug}`}
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
                          transition={{
                            duration: 0.4,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          style={{ background: "var(--primary)" }}
                        />

                        {s.category && (
                          <motion.p
                            className="mb-2 text-xs font-bold uppercase tracking-[0.25em]"
                            animate={{
                              color: isActive ? "var(--primary)" : "#94a3b8",
                            }}
                            transition={{ duration: 0.3 }}
                          >
                            {s.category}
                          </motion.p>
                        )}

                        <motion.h3
                          className="text-3xl font-black leading-tight"
                          animate={{ color: isActive ? "#0f172a" : "#94a3b8" }}
                          transition={{ duration: 0.3 }}
                        >
                          {s.title}
                        </motion.h3>

                        <motion.p
                          className="mt-3 text-sm leading-6 text-slate-500"
                          animate={{
                            opacity: isActive ? 1 : 0,
                            y: isActive ? 0 : 6,
                          }}
                          transition={{
                            duration: 0.3,
                            delay: isActive ? 0.05 : 0,
                          }}
                        >
                          {s.summary}
                        </motion.p>

                        {s.features && s.features.length > 0 && (
                          <motion.ul
                            className="mt-4 space-y-1.5"
                            animate={{
                              opacity: isActive ? 1 : 0,
                              y: isActive ? 0 : 6,
                            }}
                            transition={{
                              duration: 0.3,
                              delay: isActive ? 0.1 : 0,
                            }}
                          >
                            {s.features.slice(0, 4).map((f) => (
                              <li
                                key={f.text}
                                className="flex items-center gap-2 text-xs text-slate-500"
                              >
                                <div
                                  className="h-1 w-1 shrink-0 rounded-full"
                                  style={{ background: "var(--primary)" }}
                                />
                                {f.text}
                              </li>
                            ))}
                          </motion.ul>
                        )}

                        <motion.div
                          className="mt-5 flex items-center gap-2 text-sm font-bold"
                          animate={{
                            opacity: isActive ? 1 : 0,
                            y: isActive ? 0 : 8,
                          }}
                          transition={{
                            duration: 0.3,
                            delay: isActive ? 0.15 : 0,
                          }}
                          style={{ color: "var(--primary)" }}
                        >
                          Ver servicio completo
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
          </motion.div>

          {/* CTA */}
          <div className="pb-20 pt-16">
            <Link
              href="/servicios"
              className="inline-flex items-center gap-2 rounded-xl px-8 py-4 text-sm font-bold transition-all hover:scale-105 hover:opacity-90"
              style={{ background: "var(--primary)", color: "white" }}
            >
              Ver todos los servicios →
            </Link>
          </div>
        </motion.div>

        {/* RIGHT: imagen sticky */}
        <motion.div
          className="w-1/2 shrink-0"
          initial={{ opacity: 0, x: 40 }}
          animate={
            sectionVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }
          }
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
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
            <div className="relative h-full w-full overflow-hidden bg-slate-900">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeCategory}-${active}`}
                  className="absolute inset-0"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  {filteredServices[active]?.image?.url ? (
                    <Image
                      src={filteredServices[active].image!.url!}
                      alt={
                        filteredServices[active].image?.alt ||
                        filteredServices[active].title
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

                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(225deg, rgba(10,22,40,0.15) 0%, transparent 50%)",
                    }}
                  />

                  {/* Esquinas técnicas */}
                  <div className="pointer-events-none absolute inset-0">
                    <div className="absolute left-6 top-6">
                      <div
                        className="h-8 w-px"
                        style={{ background: "var(--primary)" }}
                      />
                      <div
                        className="h-px w-8"
                        style={{ background: "var(--primary)" }}
                      />
                    </div>
                    <div className="absolute right-6 top-6 flex flex-col items-end">
                      <div
                        className="h-8 w-px"
                        style={{ background: "var(--primary)" }}
                      />
                      <div
                        className="h-px w-8"
                        style={{ background: "var(--primary)" }}
                      />
                    </div>
                  </div>

                  {/* Categoría badge en imagen */}
                  {filteredServices[active]?.category && (
                    <div className="absolute left-6 bottom-16 z-10">
                      <span
                        className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur-sm"
                        style={{ background: "var(--primary)" + "cc" }}
                      >
                        {filteredServices[active].category}
                      </span>
                    </div>
                  )}

                  {/* Progress bar */}
                  <div className="absolute bottom-0 left-0 top-0 w-1 bg-white/10">
                    <motion.div
                      className="w-full origin-top"
                      style={{ background: "var(--primary)" }}
                      animate={{
                        height: `${((active + 1) / filteredServices.length) * 100}%`,
                      }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>

                  {/* Contador */}
                  <div className="absolute right-8 top-8 z-10 flex items-center gap-3">
                    <motion.span
                      key={`count-${activeCategory}-${active}`}
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
                      {String(filteredServices.length).padStart(2, "0")}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
