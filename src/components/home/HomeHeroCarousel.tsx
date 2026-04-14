"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

type Slide = {
  mediaType?: "image" | "video" | null;
  image?: {
    url?: string | null;
    alt?: string | null;
  } | null;
  video?: {
    url?: string | null;
  } | null;
  eyebrow?: string | null;
  title?: string | null;
  description?: string | null;
  buttonText?: string | null;
  buttonLink?: string | null;
  secondButtonText?: string | null;
  secondButtonLink?: string | null;
  isActive?: boolean | null;
};

type Stat = {
  value: string;
  label: string;
};

type Props = {
  slides: Slide[];
  stats: Stat[];
};

const defaultStats: Stat[] = [
  { value: "10+", label: "Años de experiencia" },
  { value: "200+", label: "Proyectos completados" },
  { value: "50+", label: "Clientes satisfechos" },
  { value: "100%", label: "Compromiso con calidad" },
];

function parseValue(value: string): { number: number; suffix: string } {
  const match = value.match(/^(\d+)(.*)$/);
  return match
    ? { number: parseInt(match[1]), suffix: match[2] }
    : { number: 0, suffix: value };
}

function useCountUp(target: number, duration = 1800, started = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!started) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);

  return count;
}

function AnimatedStat({
  value,
  label,
  isLast,
}: {
  value: string;
  label: string;
  isLast: boolean;
}) {
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { number, suffix } = parseValue(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const count = useCountUp(number, 1800, started);

  return (
    <div ref={ref} className="flex items-stretch gap-5 md:gap-14">
      <div className="flex flex-col justify-center">
        <p className="text-2xl font-extrabold text-white sm:text-3xl md:text-5xl">
          {started ? `${count}${suffix}` : value}
        </p>
        <p className="mt-1 text-[9px] font-semibold uppercase tracking-widest text-white/50 sm:text-[10px] md:text-xs">
          {label}
        </p>
      </div>
      {!isLast && (
        <div className="hidden w-px self-stretch bg-white/40 md:block" />
      )}
    </div>
  );
}

export default function HomeHeroCarousel({ slides, stats }: Props) {
  const activeSlides = useMemo(
    () => slides.filter((slide) => slide?.isActive !== false),
    [slides],
  );

  const activeStats = stats && stats.length > 0 ? stats : defaultStats;

  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    if (activeSlides.length <= 1 || paused) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % activeSlides.length);
      setAnimKey((prev) => prev + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeSlides.length, paused]);

  useEffect(() => {
    if (current >= activeSlides.length) setCurrent(0);
  }, [activeSlides.length, current]);

  if (activeSlides.length === 0) {
    return (
      <div className="flex h-[calc(100vh-var(--header-height))] items-center justify-center bg-(--charcoal) text-white">
        No hay slides activos cargados en el panel.
      </div>
    );
  }

  const currentSlide = activeSlides[current];

  const titleWords = currentSlide.title?.split(" ") ?? [];
  const titleTop = titleWords.slice(0, -1).join(" ");
  const titleBottom = titleWords.slice(-1)[0] ?? "";

  return (
    <>
      <section
        className="relative h-screen min-h-160 w-full overflow-hidden bg-(--charcoal)"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {currentSlide.mediaType === "video" && currentSlide.video?.url ? (
          <>
            <video
              key={currentSlide.video.url}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
              src={currentSlide.video.url}
            />
            <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/50 to-black/75" />
          </>
        ) : currentSlide.image?.url ? (
          <>
            <Image
              key={currentSlide.image.url}
              src={currentSlide.image.url}
              alt={currentSlide.image.alt || currentSlide.title || "Slide"}
              fill
              className="object-cover animate-fade-in"
              priority={current === 0}
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/50 to-black/75" />
          </>
        ) : (
          <div className="absolute inset-0 bg-(--charcoal)" />
        )}

        <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col justify-between px-8 pb-0 pt-0 md:px-16 lg:px-20">
          {/* Contenido hero */}
          <div className="flex flex-1 items-center pb-8">
            <motion.div
              key={animKey}
              className="w-full max-w-3xl space-y-4 text-white md:space-y-6"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.12 } },
              }}
            >
              {currentSlide.eyebrow && (
                <motion.span
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
                  }}
                  className="hero-text-shadow inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/90 backdrop-blur-sm"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-(--primary)" />
                  {currentSlide.eyebrow}
                </motion.span>
              )}

              <motion.h1
                variants={{
                  hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
                  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
                }}
                className="hero-text-shadow text-3xl font-extrabold uppercase tracking-tight leading-tight sm:text-4xl md:text-6xl lg:text-7xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                <span className="text-white">{titleTop}</span>
                {titleBottom && (
                  <>
                    {" "}
                    <span className="text-(--primary)">{titleBottom}</span>{" "}
                  </>
                )}
              </motion.h1>

              {currentSlide.description && (
                <motion.p
                  variants={{
                    hidden: { opacity: 0, y: 24 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
                  }}
                  className="hero-text-shadow max-w-xl text-base leading-7 text-white/90 md:text-lg md:leading-8"
                >
                  {currentSlide.description}
                </motion.p>
              )}

              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
                }}
                className="flex flex-wrap gap-3 pt-1 md:gap-4 md:pt-2"
              >
                {currentSlide.buttonText && currentSlide.buttonLink && (
                  <motion.a
                    href={currentSlide.buttonLink}
                    className="relative inline-flex items-center overflow-hidden rounded-xl bg-(--primary) px-5 py-3 text-sm font-semibold text-white shadow-lg md:px-7 md:py-3.5"
                    whileHover={{ scale: 1.05, boxShadow: "0 0 32px rgba(47,86,201,0.6)" }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  >
                    <motion.span
                      className="relative z-10 flex items-center gap-2"
                      whileHover={{ x: 3 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    >
                      {currentSlide.buttonText}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </motion.span>
                  </motion.a>
                )}
                {currentSlide.secondButtonText && currentSlide.secondButtonLink && (
                  <motion.a
                    href={currentSlide.secondButtonLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={currentSlide.secondButtonLink.endsWith(".pdf") ? true : undefined}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm md:px-7 md:py-3.5"
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.18)", borderColor: "rgba(255,255,255,0.6)" }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  >
                    <motion.span
                      className="flex items-center gap-2"
                      whileHover={{ x: 2 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    >
                      {currentSlide.secondButtonText}
                      {currentSlide.secondButtonLink.endsWith(".pdf") ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M10 8l4 4-4 4" />
                        </svg>
                      )}
                    </motion.span>
                  </motion.a>
                )}
              </motion.div>
            </motion.div>
          </div>

          {/* Stats + explorar */}
          <motion.div
            key={`stats-${animKey}`}
            className="relative z-10 border-t border-white/10 py-7 md:py-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between gap-4">
              {/* Stats: 2×2 en mobile, fila en desktop */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-4 sm:gap-y-0 md:flex md:items-stretch md:gap-0">
                {activeStats.map((stat, index) => (
                  <AnimatedStat
                    key={stat.label}
                    value={stat.value}
                    label={stat.label}
                    isLast={index === activeStats.length - 1}
                  />
                ))}
              </div>

              {/* Explorar + dots — solo desktop */}
              <div className="hidden shrink-0 flex-col items-center gap-1.5 md:flex">
                {activeSlides.length > 1 && (
                  <div className="flex items-center gap-1.5">
                    {activeSlides.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => {
                          setCurrent(index);
                          setAnimKey((prev) => prev + 1);
                        }}
                        aria-label={`Ir al slide ${index + 1}`}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          index === current
                            ? "w-8 bg-white"
                            : "w-3 bg-white/30 hover:bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                )}
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
                  Explorar
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="animate-bounce text-white/40"
                >
                  <path d="M12 5v14M5 12l7 7 7-7" />
                </svg>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Flechas — ocultas en mobile para no tapar botones */}
        {activeSlides.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => {
                setCurrent(
                  (prev) =>
                    (prev - 1 + activeSlides.length) % activeSlides.length,
                );
                setAnimKey((prev) => prev + 1);
              }}
              aria-label="Slide anterior"
              className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition hover:bg-white/25 hidden md:flex"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrent((prev) => (prev + 1) % activeSlides.length);
                setAnimKey((prev) => prev + 1);
              }}
              aria-label="Siguiente slide"
              className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition hover:bg-white/25 hidden md:flex"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </>
        )}
      </section>
    </>
  );
}
