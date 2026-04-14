"use client";

import { useState, useEffect, useRef } from "react";
import { useScroll, motion } from "framer-motion";
import Link from "next/link";

export type ServicioItem = {
  slug: string;
  title: string;
  cat?: string | null;
  color?: string | null;
  desc: string;
  specs: string[];
};

type Props = {
  services: ServicioItem[];
};

const ELLIPSE = { cx: 350, cy: 210, rx: 78, ry: 48 };

const NODE_CONFIG: Record<string, {
  x: number; y: number; w: number; h: number;
  fallbackColor: string;
  nx: number; ny: number;
  ex: number; ey: number;
}> = {
  construccion: {
    x: 20, y: 30, w: 205, h: 58, fallbackColor: '#2563EB',
    nx: 122, ny: 88, ex: 291, ey: 178,
  },
  consultoria: {
    x: 475, y: 30, w: 205, h: 58, fallbackColor: '#059669',
    nx: 577, ny: 88, ex: 409, ey: 178,
  },
  estudios: {
    x: 16, y: 178, w: 180, h: 58, fallbackColor: '#D97706',
    nx: 196, ny: 207, ex: 272, ey: 207,
  },
  mantenimiento: {
    x: 504, y: 178, w: 180, h: 58, fallbackColor: '#EA580C',
    nx: 504, ny: 207, ex: 428, ey: 207,
  },
  sostenibles: {
    x: 213, y: 338, w: 274, h: 58, fallbackColor: '#16A34A',
    nx: 350, ny: 338, ex: 350, ey: 258,
  },
};

const BUILD_ORDER = ['construccion', 'consultoria', 'estudios', 'mantenimiento', 'sostenibles'];

// Centro: 0.0–0.16 | Nodos 1–5: 0.16–1.0 (cada uno 1/6)
const STEP_SIZE = 1 / 6;

export default function ServiciosMapa({ services }: Props) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const [buildStep, setBuildStep] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      if (v < STEP_SIZE) setBuildStep(1);
      else if (v < STEP_SIZE * 2) setBuildStep(2);
      else if (v < STEP_SIZE * 3) setBuildStep(3);
      else if (v < STEP_SIZE * 4) setBuildStep(4);
      else if (v < STEP_SIZE * 5) setBuildStep(5);
      else setBuildStep(6);
    });
  }, [scrollYProgress]);

  const toggle = (slug: string) => setActiveSlug((prev) => (prev === slug ? null : slug));

  const activeService = services.find((s) => s.slug === activeSlug) ?? null;
  const activeColor = activeService
    ? (activeService.color || NODE_CONFIG[activeService.slug]?.fallbackColor || '#2f56c9')
    : null;

  const mappedServices = services.filter((s) => NODE_CONFIG[s.slug]);

  const isNodeVisible = (slug: string) => {
    const idx = BUILD_ORDER.indexOf(slug);
    return buildStep >= 2 + idx;
  };

  const isLineVisible = (slug: string) => {
    const idx = BUILD_ORDER.indexOf(slug);
    return buildStep >= 2 + idx;
  };

  return (
    <>
      <style>{`
        @keyframes centerPop {
          0%   { opacity: 0; transform: scale(0.5); }
          60%  { transform: scale(1.08); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes nodePop {
          0%   { opacity: 0; transform: scale(0.6); }
          60%  { transform: scale(1.06); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes lineGrow {
          from { stroke-dashoffset: 300; opacity: 0; }
          to   { stroke-dashoffset: 0; opacity: 1; }
        }
        @keyframes radarPulse {
          0%   { r: 78; opacity: 0.5; }
          100% { r: 130; opacity: 0; }
        }
        @keyframes radarPulse2 {
          0%   { r: 78; opacity: 0.3; }
          100% { r: 150; opacity: 0; }
        }
        @keyframes ellipsePulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes overlayIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>

      <div>
        {/* ══ MOBILE: nodos en columna ══ */}
        <div className="md:hidden space-y-3">
          {mappedServices.map((s, i) => {
            const color = s.color || NODE_CONFIG[s.slug]?.fallbackColor || '#2f56c9';
            const isActive = activeSlug === s.slug;
            return (
              <MobileServiceNode
                key={s.slug}
                service={s}
                color={color}
                isActive={isActive}
                index={i}
                onToggle={() => toggle(s.slug)}
              />
            );
          })}
        </div>

        {/* ══ DESKTOP: sticky scroll-driven ══ */}
        <div
          ref={containerRef}
          className="hidden md:block"
          style={{ height: "600vh", position: "relative" }}
        >
          <div
            className="sticky top-0 flex h-screen items-center justify-center"
            style={{ paddingTop: "var(--header-height, 73px)" }}
          >
            {/* Hint de scroll */}
            {buildStep < 6 && (
              <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: buildStep >= 1 ? 1 : 0 }}
                transition={{ delay: 0.5 }}
              >
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  Sigue scrolleando
                </span>
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="#94a3b8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14M5 12l7 7 7-7" />
                  </svg>
                </motion.div>
              </motion.div>
            )}

            {/* Indicador de progreso lateral */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-2">
              <div
                className="h-2 w-2 rounded-full transition-all duration-300"
                style={{
                  background: buildStep >= 1 ? '#2f56c9' : '#e2e8f0',
                  transform: buildStep >= 1 ? 'scale(1.3)' : 'scale(1)',
                }}
              />
              {BUILD_ORDER.map((slug, i) => {
                const color = mappedServices.find((s) => s.slug === slug)?.color
                  || NODE_CONFIG[slug]?.fallbackColor || '#2f56c9';
                const done = buildStep >= 2 + i;
                return (
                  <div
                    key={slug}
                    className="h-2 w-2 rounded-full transition-all duration-300"
                    style={{
                      background: done ? color : '#e2e8f0',
                      transform: done ? 'scale(1.3)' : 'scale(1)',
                    }}
                  />
                );
              })}
            </div>

            {/* SVG */}
            <div className="w-full max-w-4xl px-10">
              <svg
                viewBox="0 0 700 420"
                className="w-full"
                aria-label="Mapa de servicios SMC GROUP"
              >
                <defs>
                  <radialGradient id="centerGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#4f7ef0" />
                    <stop offset="100%" stopColor="#1f3fa8" />
                  </radialGradient>
                  <filter id="centerGlow" x="-40%" y="-40%" width="180%" height="180%">
                    <feGaussianBlur stdDeviation="5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* RADAR */}
                {buildStep >= 1 && (
                  <>
                    <ellipse
                      cx={ELLIPSE.cx} cy={ELLIPSE.cy}
                      rx={ELLIPSE.rx} ry={ELLIPSE.ry * 0.6}
                      fill="none" stroke="#2f56c9" strokeWidth={1.5}
                      style={{
                        animation: 'radarPulse 2.4s ease-out infinite',
                        transformOrigin: `${ELLIPSE.cx}px ${ELLIPSE.cy}px`,
                      }}
                    />
                    <ellipse
                      cx={ELLIPSE.cx} cy={ELLIPSE.cy}
                      rx={ELLIPSE.rx} ry={ELLIPSE.ry * 0.6}
                      fill="none" stroke="#2f56c9" strokeWidth={1}
                      style={{
                        animation: 'radarPulse2 2.4s ease-out infinite 1.2s',
                        transformOrigin: `${ELLIPSE.cx}px ${ELLIPSE.cy}px`,
                      }}
                    />
                  </>
                )}

                {/* LÍNEAS */}
                {mappedServices.map((s) => {
                  const node = NODE_CONFIG[s.slug];
                  if (!node || !isLineVisible(s.slug)) return null;
                  const color = s.color || node.fallbackColor;
                  const isActive = activeSlug === s.slug;
                  return (
                    <g key={`line-${s.slug}`}>
                      <line
                        x1={node.nx} y1={node.ny}
                        x2={node.ex} y2={node.ey}
                        stroke={isActive ? color : '#cbd5e1'}
                        strokeWidth={isActive ? 2 : 1}
                        strokeDasharray="300"
                        strokeDashoffset="0"
                        style={{
                          animation: 'lineGrow 0.6s cubic-bezier(0.22,1,0.36,1) both',
                          transition: 'stroke 0.3s, stroke-width 0.3s',
                        }}
                      />
                      <circle r={isActive ? 4 : 2.5} fill={color} opacity={isActive ? 1 : 0.4}>
                        <animateMotion
                          dur={isActive ? '1s' : '2.5s'}
                          repeatCount="indefinite"
                          path={`M${node.nx},${node.ny} L${node.ex},${node.ey}`}
                        />
                      </circle>
                      {isActive && (
                        <circle r={2.5} fill={color} opacity={0.5}>
                          <animateMotion
                            dur="1s"
                            begin="0.5s"
                            repeatCount="indefinite"
                            path={`M${node.nx},${node.ny} L${node.ex},${node.ey}`}
                          />
                        </circle>
                      )}
                    </g>
                  );
                })}

                {/* NODO CENTRAL */}
                {buildStep >= 1 && (
                  <g
                    filter="url(#centerGlow)"
                    style={{
                      animation: 'centerPop 0.7s cubic-bezier(0.22,1,0.36,1) both',
                      transformOrigin: `${ELLIPSE.cx}px ${ELLIPSE.cy}px`,
                    }}
                  >
                    <ellipse
                      cx={ELLIPSE.cx} cy={ELLIPSE.cy}
                      rx={ELLIPSE.rx} ry={ELLIPSE.ry}
                      fill="url(#centerGrad)"
                      style={{ animation: 'ellipsePulse 3s ease-in-out infinite' }}
                    />
                    <text x={ELLIPSE.cx} y={ELLIPSE.cy - 7}
                      textAnchor="middle" fill="white"
                      fontSize="13" fontWeight="800" letterSpacing="0.1em"
                      style={{ pointerEvents: 'none', userSelect: 'none' }}
                    >SMC</text>
                    <text x={ELLIPSE.cx} y={ELLIPSE.cy + 10}
                      textAnchor="middle" fill="white"
                      fontSize="13" fontWeight="800" letterSpacing="0.1em"
                      style={{ pointerEvents: 'none', userSelect: 'none' }}
                    >GROUP</text>
                  </g>
                )}

                {/* NODOS */}
                {mappedServices.map((s) => {
                  const node = NODE_CONFIG[s.slug];
                  if (!node || !isNodeVisible(s.slug)) return null;
                  const color = s.color || node.fallbackColor;
                  const isActive = activeSlug === s.slug;
                  const isHovered = hoveredSlug === s.slug;
                  const cx = node.x + node.w / 2;
                  const cy = node.y + node.h / 2;
                  const words = s.title.split(" ");
                  const mid = Math.ceil(words.length / 2);
                  const line1 = words.slice(0, mid).join(" ");
                  const line2 = words.slice(mid).join(" ");
                  const twoLines = line2.length > 0;

                  return (
                    <g
                      key={s.slug}
                      onClick={() => toggle(s.slug)}
                      onMouseEnter={() => setHoveredSlug(s.slug)}
                      onMouseLeave={() => setHoveredSlug(null)}
                      style={{
                        cursor: 'pointer',
                        animation: 'nodePop 0.5s cubic-bezier(0.22,1,0.36,1) both',
                        transformOrigin: `${cx}px ${cy}px`,
                        filter: isActive
                          ? `drop-shadow(0 0 12px ${color}99)`
                          : isHovered
                            ? `drop-shadow(0 0 7px ${color}66)`
                            : 'none',
                        transition: 'filter 0.2s',
                      }}
                      role="button"
                      aria-pressed={isActive}
                      aria-label={s.title}
                    >
                      {(isActive || isHovered) && (
                        <rect
                          x={node.x - 5} y={node.y - 5}
                          width={node.w + 10} height={node.h + 10}
                          rx={15} fill={`${color}18`} stroke="none"
                        />
                      )}
                      <rect
                        x={node.x} y={node.y}
                        width={node.w} height={node.h}
                        rx={10}
                        fill={isActive ? `${color}22` : isHovered ? `${color}16` : `${color}0e`}
                        stroke={color}
                        strokeWidth={isActive ? 2.5 : isHovered ? 1.8 : 1}
                        strokeOpacity={isActive ? 1 : isHovered ? 0.8 : 0.5}
                        style={{ transition: 'all 0.2s' }}
                      />
                      {twoLines ? (
                        <>
                          <text x={cx} y={cy - 7} textAnchor="middle" fill={color}
                            fontSize="11" fontWeight="700"
                            style={{ pointerEvents: 'none', userSelect: 'none' }}
                          >{line1}</text>
                          <text x={cx} y={cy + 8} textAnchor="middle" fill={color}
                            fontSize="11" fontWeight="700"
                            style={{ pointerEvents: 'none', userSelect: 'none' }}
                          >{line2}</text>
                        </>
                      ) : (
                        <text x={cx} y={cy + 4} textAnchor="middle" fill={color}
                          fontSize="11" fontWeight="700"
                          style={{ pointerEvents: 'none', userSelect: 'none' }}
                        >{line1}</text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </div>

        {/* ══ MODAL — desktop y mobile ══ */}
        {activeService && activeColor && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6"
            style={{ animation: 'overlayIn 0.2s ease both', background: 'rgba(15,23,42,0.65)' }}
            onClick={() => setActiveSlug(null)}
          >
            <div
              className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
              style={{ animation: 'modalIn 0.2s cubic-bezier(0.22,1,0.36,1) both' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-1 w-full" style={{ background: activeColor }} />
              <div className="px-6 pt-6 pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                      style={{ background: `${activeColor}18`, border: `1.5px solid ${activeColor}33` }}
                    >
                      <div className="h-3 w-3 rounded-full" style={{ background: activeColor }} />
                    </div>
                    <div>
                      {activeService.cat && (
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em]"
                          style={{ color: activeColor }}>
                          {activeService.cat}
                        </p>
                      )}
                      <h3 className="text-xl font-black text-[#0f172a] leading-tight">
                        {activeService.title}
                      </h3>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveSlug(null)}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition hover:bg-slate-200 hover:text-slate-600"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-500">{activeService.desc}</p>
              </div>
              {activeService.specs.length > 0 && (
                <div className="px-6 pb-5">
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    Especialidades incluidas
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {activeService.specs.map((spec) => (
                      <div
                        key={spec}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600"
                        style={{ background: `${activeColor}0a`, border: `1px solid ${activeColor}22` }}
                      >
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: activeColor }} />
                        {spec}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div
                className="flex items-center justify-between px-6 py-4"
                style={{ background: `${activeColor}08`, borderTop: `1px solid ${activeColor}18` }}
              >
                <p className="text-xs text-slate-400">SMC GROUP · Lima, Perú</p>
                <Link
                  href="/contacto"
                  className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-all hover:opacity-90 hover:scale-105"
                  style={{ background: activeColor }}
                  onClick={() => setActiveSlug(null)}
                >
                  Solicitar cotización →
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ══ MOBILE NODE ══
function MobileServiceNode({
  service, color, isActive, index, onToggle,
}: {
  service: ServicioItem;
  color: string;
  isActive: boolean;
  index: number;
  onToggle: () => void;
}) {
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
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(-24px)',
        transition: `opacity 0.5s cubic-bezier(0.22,1,0.36,1) ${index * 80}ms, transform 0.5s cubic-bezier(0.22,1,0.36,1) ${index * 80}ms`,
      }}
    >
      <button
        onClick={onToggle}
        className="w-full rounded-2xl border-2 text-left transition-all duration-200"
        style={{
          borderColor: isActive ? color : `${color}30`,
          background: isActive ? `${color}0e` : 'white',
          boxShadow: isActive ? `0 4px 24px ${color}25` : '0 1px 4px rgba(0,0,0,0.05)',
        }}
      >
        <div className="flex items-center gap-4 px-5 py-4">
          <div className="relative shrink-0">
            <div className="h-3 w-3 rounded-full" style={{ background: color }} />
            {isActive && (
              <div
                className="absolute inset-0 rounded-full animate-ping"
                style={{ background: color, opacity: 0.4 }}
              />
            )}
          </div>
          <div className="flex-1 min-w-0">
            {service.cat && (
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-0.5" style={{ color }}>
                {service.cat}
              </p>
            )}
            <p className="text-sm font-bold text-[#0f172a]">{service.title}</p>
          </div>
          <svg
            className="h-4 w-4 shrink-0 transition-transform duration-300"
            style={{ color, transform: isActive ? 'rotate(90deg)' : 'rotate(0deg)' }}
            fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </div>
      </button>
    </div>
  );
}
