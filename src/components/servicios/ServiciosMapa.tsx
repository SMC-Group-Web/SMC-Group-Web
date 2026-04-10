"use client";

import { useState, useEffect, useRef } from "react";
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
    x: 20,  y: 30,  w: 205, h: 58, fallbackColor: '#2563EB',
    nx: 122, ny: 88, ex: 291, ey: 178,
  },
  consultoria: {
    x: 475, y: 30,  w: 205, h: 58, fallbackColor: '#059669',
    nx: 577, ny: 88, ex: 409, ey: 178,
  },
  estudios: {
    x: 16,  y: 178, w: 180, h: 58, fallbackColor: '#D97706',
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

function lineLength(slug: string): number {
  const n = NODE_CONFIG[slug];
  if (!n) return 100;
  return Math.sqrt(Math.pow(n.ex - n.nx, 2) + Math.pow(n.ey - n.ny, 2));
}

export default function ServiciosMapa({ services }: Props) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const svgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const toggle = (slug: string) => setActiveSlug((prev) => (prev === slug ? null : slug));

  const activeService = services.find((s) => s.slug === activeSlug) ?? null;
  const activeColor = activeService
    ? (activeService.color || NODE_CONFIG[activeService.slug]?.fallbackColor || '#2f56c9')
    : null;

  const mappedServices = services.filter((s) => NODE_CONFIG[s.slug]);

  const nodeDelay: Record<string, number> = {
    construccion: 0,
    consultoria: 80,
    estudios: 160,
    mantenimiento: 240,
    sostenibles: 320,
  };

  return (
    <>
      <style>{`
        @keyframes radarPulse {
          0%   { r: 78; opacity: 0.6; }
          100% { r: 120; opacity: 0; }
        }
        @keyframes radarPulse2 {
          0%   { r: 78; opacity: 0.4; }
          100% { r: 140; opacity: 0; }
        }
        @keyframes nodeIn {
          from { opacity: 0; transform: scale(0.85); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes ellipsePulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.82; }
        }
        @keyframes lineDrawIn {
          from { stroke-dashoffset: 200; opacity: 0; }
          to   { stroke-dashoffset: 0;   opacity: 1; }
        }
        @keyframes centerIn {
          from { opacity: 0; transform: scale(0.7); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.97) translateY(6px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>

      <div>
        {/* ── MOBILE: cards accordion ── */}
        <div className="md:hidden space-y-3">
          {mappedServices.map((s) => {
            const color = s.color || NODE_CONFIG[s.slug]?.fallbackColor || '#2f56c9';
            const isActive = activeSlug === s.slug;
            return (
              <div key={s.slug}>
                <button
                  onClick={() => toggle(s.slug)}
                  className="w-full rounded-2xl border text-left transition-all duration-200"
                  style={{
                    borderColor: isActive ? color : `${color}33`,
                    background: isActive ? `${color}10` : 'white',
                    boxShadow: isActive ? `0 4px 20px ${color}22` : '0 1px 3px rgba(0,0,0,0.06)',
                  }}
                >
                  <div className="flex items-center gap-4 px-5 py-4">
                    <div className="h-3 w-3 shrink-0 rounded-full" style={{ background: color }} />
                    <div className="flex-1 min-w-0">
                      {s.cat && (
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-0.5" style={{ color }}>
                          {s.cat}
                        </p>
                      )}
                      <p className="text-sm font-bold text-[#0f172a]">{s.title}</p>
                    </div>
                    <svg
                      className="h-4 w-4 shrink-0 transition-transform duration-200"
                      style={{ color, transform: isActive ? 'rotate(180deg)' : 'rotate(0deg)' }}
                      fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                {isActive && (
                  <div
                    className="mx-1 rounded-b-2xl border-x border-b px-5 pb-5 pt-4"
                    style={{ borderColor: `${color}33`, background: `${color}06` }}
                  >
                    <p className="text-sm leading-6 text-slate-500">{s.desc}</p>
                    {s.specs.length > 0 && (
                      <ul className="mt-4 space-y-2">
                        {s.specs.map((spec) => (
                          <li key={spec} className="flex items-start gap-2 text-sm text-slate-600">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: color }} />
                            {spec}
                          </li>
                        ))}
                      </ul>
                    )}
                    <Link
                      href="/contacto"
                      className="mt-5 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all hover:opacity-90"
                      style={{ background: color, color: '#ffffff' }}
                    >
                      Solicitar cotización →
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── DESKTOP: SVG animado ── */}
        <div ref={svgRef} className="hidden md:block w-full">
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
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* ── RADAR PULSE ── */}
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

            {/* ── LÍNEAS ANIMADAS ── */}
            {mappedServices.map((s) => {
              const node = NODE_CONFIG[s.slug];
              if (!node) return null;
              const color = s.color || node.fallbackColor;
              const isActive = activeSlug === s.slug;

              return (
                <g key={`line-${s.slug}`}>
                  <line
                    x1={node.nx} y1={node.ny}
                    x2={node.ex} y2={node.ey}
                    stroke={isActive ? color : '#cbd5e1'}
                    strokeWidth={isActive ? 2 : 1}
                    strokeDasharray={visible && isActive ? 'none' : '200'}
                    strokeDashoffset={0}
                    style={{
                      transition: 'stroke 0.3s, stroke-width 0.3s',
                      animation: visible
                        ? `lineDrawIn 0.6s cubic-bezier(0.22,1,0.36,1) ${(nodeDelay[s.slug] ?? 0) + 200}ms both`
                        : 'none',
                    }}
                  />
                  {/* Punto viajero */}
                  <circle r={isActive ? 4 : 2.5} fill={color} opacity={isActive ? 1 : 0.5}>
                    <animateMotion
                      dur={isActive ? '1.2s' : '2.5s'}
                      repeatCount="indefinite"
                      path={`M${node.nx},${node.ny} L${node.ex},${node.ey}`}
                    />
                  </circle>
                  {/* Segundo punto desfasado cuando activo */}
                  {isActive && (
                    <circle r={2.5} fill={color} opacity={0.5}>
                      <animateMotion
                        dur="1.2s"
                        begin="0.6s"
                        repeatCount="indefinite"
                        path={`M${node.nx},${node.ny} L${node.ex},${node.ey}`}
                      />
                    </circle>
                  )}
                </g>
              );
            })}

            {/* ── NODO CENTRAL ── */}
            <g
              filter="url(#centerGlow)"
              style={{
                animation: visible
                  ? 'centerIn 0.6s cubic-bezier(0.22,1,0.36,1) both'
                  : 'none',
                opacity: visible ? 1 : 0,
                transformOrigin: `${ELLIPSE.cx}px ${ELLIPSE.cy}px`,
              }}
            >
              <ellipse
                cx={ELLIPSE.cx} cy={ELLIPSE.cy}
                rx={ELLIPSE.rx} ry={ELLIPSE.ry}
                fill="url(#centerGrad)"
                style={{ animation: 'ellipsePulse 3s ease-in-out infinite' }}
              />
            </g>
            <text
              x={ELLIPSE.cx} y={ELLIPSE.cy - 7}
              textAnchor="middle" fill="white"
              fontSize="13" fontWeight="800" letterSpacing="0.1em"
              style={{ pointerEvents: 'none', userSelect: 'none' }}
            >SMC</text>
            <text
              x={ELLIPSE.cx} y={ELLIPSE.cy + 10}
              textAnchor="middle" fill="white"
              fontSize="13" fontWeight="800" letterSpacing="0.1em"
              style={{ pointerEvents: 'none', userSelect: 'none' }}
            >GROUP</text>

            {/* ── NODOS DE SERVICIO ── */}
            {mappedServices.map((s, i) => {
              const node = NODE_CONFIG[s.slug];
              if (!node) return null;
              const color = s.color || node.fallbackColor;
              const isActive = activeSlug === s.slug;
              const isHovered = hoveredSlug === s.slug;
              const cx = node.x + node.w / 2;
              const cy = node.y + node.h / 2;
              const delay = nodeDelay[s.slug] ?? i * 80;

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
                    opacity: visible ? 1 : 0,
                    animation: visible
                      ? `nodeIn 0.5s cubic-bezier(0.22,1,0.36,1) ${delay}ms both`
                      : 'none',
                    filter: isActive
                      ? `drop-shadow(0 0 10px ${color}88)`
                      : isHovered
                        ? `drop-shadow(0 0 6px ${color}55)`
                        : 'none',
                    transition: 'filter 0.2s',
                  }}
                  role="button"
                  aria-pressed={isActive}
                  aria-label={s.title}
                >
                  {(isActive || isHovered) && (
                    <rect
                      x={node.x - 4} y={node.y - 4}
                      width={node.w + 8} height={node.h + 8}
                      rx={14}
                      fill={`${color}15`}
                      stroke="none"
                    />
                  )}
                  <rect
                    x={node.x} y={node.y}
                    width={node.w} height={node.h}
                    rx={10}
                    fill={isActive ? `${color}20` : isHovered ? `${color}15` : `${color}0d`}
                    stroke={color}
                    strokeWidth={isActive ? 2.5 : isHovered ? 1.5 : 1}
                    strokeOpacity={isActive ? 1 : isHovered ? 0.8 : 0.45}
                    style={{ transition: 'all 0.2s' }}
                  />
                  {twoLines ? (
                    <>
                      <text
                        x={cx} y={cy - 7}
                        textAnchor="middle" fill={color}
                        fontSize="11" fontWeight="700"
                        style={{ pointerEvents: 'none', userSelect: 'none' }}
                      >{line1}</text>
                      <text
                        x={cx} y={cy + 8}
                        textAnchor="middle" fill={color}
                        fontSize="11" fontWeight="700"
                        style={{ pointerEvents: 'none', userSelect: 'none' }}
                      >{line2}</text>
                    </>
                  ) : (
                    <text
                      x={cx} y={cy + 4}
                      textAnchor="middle" fill={color}
                      fontSize="11" fontWeight="700"
                      style={{ pointerEvents: 'none', userSelect: 'none' }}
                    >{line1}</text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* ── Modal flotante (desktop) ── */}
        {activeService && activeColor && (
          <div
            className="hidden md:flex fixed inset-0 z-50 items-center justify-center p-6"
            style={{ background: 'rgba(15,23,42,0.6)' }}
            onClick={() => setActiveSlug(null)}
          >
            <div
              className="relative w-full max-w-140 overflow-hidden rounded-2xl bg-white shadow-2xl"
              style={{
                animation: 'modalIn 0.15s cubic-bezier(0.22,1,0.36,1)',
                borderTop: `4px solid ${activeColor}`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveSlug(null)}
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition hover:bg-slate-200 hover:text-slate-600"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="px-7 pt-7 pb-4">
                {activeService.cat && (
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] mb-1" style={{ color: activeColor }}>
                    {activeService.cat}
                  </p>
                )}
                <h3 className="text-2xl font-black text-[#0f172a]">{activeService.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{activeService.desc}</p>
              </div>
              {activeService.specs.length > 0 && (
                <div className="px-7 pb-5">
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    Especialidades incluidas
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {activeService.specs.map((spec) => (
                      <div
                        key={spec}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600"
                        style={{ background: '#f8fafc', border: `1px solid ${activeColor}20` }}
                      >
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: activeColor }} />
                        {spec}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between border-t border-slate-100 px-7 py-4">
                <p className="text-xs text-slate-400">SMC GROUP · Lima, Perú</p>
                <Link
                  href="/contacto"
                  className="inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold transition-all hover:opacity-90 hover:scale-105"
                  style={{ background: activeColor, color: '#ffffff' }}
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
