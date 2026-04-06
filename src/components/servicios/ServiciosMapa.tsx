"use client";

import { useState } from "react";
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

// viewBox: 0 0 700 420
// Central ellipse: cx=350, cy=210, rx=78, ry=48
const ELLIPSE = { cx: 350, cy: 210, rx: 78, ry: 48 };

const NODE_CONFIG: Record<string, {
  x: number; y: number; w: number; h: number;
  fallbackColor: string;
  // point on NODE edge closest to ellipse
  nx: number; ny: number;
  // point on ELLIPSE edge closest to node
  ex: number; ey: number;
}> = {
  construccion: {
    x: 20,  y: 30,  w: 205, h: 58, fallbackColor: '#2563EB',
    nx: 122, ny: 88,   // bottom-center of node
    ex: 291, ey: 178,  // top-left of ellipse
  },
  consultoria: {
    x: 475, y: 30,  w: 205, h: 58, fallbackColor: '#059669',
    nx: 577, ny: 88,   // bottom-center of node
    ex: 409, ey: 178,  // top-right of ellipse
  },
  estudios: {
    x: 16,  y: 178, w: 180, h: 58, fallbackColor: '#D97706',
    nx: 196, ny: 207,  // right-center of node
    ex: 272, ey: 207,  // left of ellipse
  },
  mantenimiento: {
    x: 504, y: 178, w: 180, h: 58, fallbackColor: '#EA580C',
    nx: 504, ny: 207,  // left-center of node
    ex: 428, ey: 207,  // right of ellipse
  },
  sostenibles: {
    x: 213, y: 338, w: 274, h: 58, fallbackColor: '#16A34A',
    nx: 350, ny: 338,  // top-center of node
    ex: 350, ey: 258,  // bottom of ellipse
  },
};

export default function ServiciosMapa({ services }: Props) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  const toggle = (slug: string) => setActiveSlug((prev) => (prev === slug ? null : slug));

  const activeService = services.find((s) => s.slug === activeSlug) ?? null;
  const activeColor = activeService
    ? (activeService.color || NODE_CONFIG[activeService.slug]?.fallbackColor || '#2f56c9')
    : null;

  const mappedServices = services.filter((s) => NODE_CONFIG[s.slug]);

  return (
    <div>
      {/* ── MOBILE: cards grid ── */}
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
                  {/* Color dot */}
                  <div
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ background: color }}
                  />
                  <div className="flex-1 min-w-0">
                    {s.cat && (
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-0.5" style={{ color }}>
                        {s.cat}
                      </p>
                    )}
                    <p className="text-sm font-bold text-[#0f172a]">{s.title}</p>
                  </div>
                  {/* Chevron */}
                  <svg
                    className="h-4 w-4 shrink-0 transition-transform duration-200"
                    style={{ color, transform: isActive ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {/* Expanded content */}
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

      {/* ── DESKTOP: SVG map ── */}
      <div className="hidden md:block w-full">
        <svg
          viewBox="0 0 700 420"
          className="w-full"
          aria-label="Mapa de servicios SMC GROUP"
        >
          {/* Connector lines — from node edge to ellipse edge */}
          {mappedServices.map((s) => {
            const node = NODE_CONFIG[s.slug];
            if (!node) return null;
            const color = s.color || node.fallbackColor;
            const isActive = activeSlug === s.slug;
            return (
              <line
                key={`line-${s.slug}`}
                x1={node.nx} y1={node.ny}
                x2={node.ex} y2={node.ey}
                stroke={isActive ? color : '#cbd5e1'}
                strokeWidth={isActive ? 2 : 1.5}
                strokeDasharray={isActive ? '0' : '6 4'}
                style={{ transition: 'stroke 0.25s, stroke-width 0.25s' }}
              />
            );
          })}

          {/* Central ellipse */}
          <ellipse
            cx={ELLIPSE.cx} cy={ELLIPSE.cy}
            rx={ELLIPSE.rx} ry={ELLIPSE.ry}
            fill="#2f56c9"
          />
          <text x={ELLIPSE.cx} y={ELLIPSE.cy - 7}
            textAnchor="middle" fill="white"
            fontSize="12" fontWeight="800" letterSpacing="0.08em"
          >SMC</text>
          <text x={ELLIPSE.cx} y={ELLIPSE.cy + 10}
            textAnchor="middle" fill="white"
            fontSize="12" fontWeight="800" letterSpacing="0.08em"
          >GROUP</text>

          {/* Service nodes */}
          {mappedServices.map((s) => {
            const node = NODE_CONFIG[s.slug];
            const color = s.color || node.fallbackColor;
            const isActive = activeSlug === s.slug;
            const cx = node.x + node.w / 2;
            const cy = node.y + node.h / 2;

            // Split title into max 2 lines
            const words = s.title.split(" ");
            const mid = Math.ceil(words.length / 2);
            const line1 = words.slice(0, mid).join(" ");
            const line2 = words.slice(mid).join(" ");
            const twoLines = line2.length > 0;

            return (
              <g
                key={s.slug}
                onClick={() => toggle(s.slug)}
                style={{ cursor: "pointer" }}
                role="button"
                aria-pressed={isActive}
                aria-label={s.title}
              >
                {/* Shadow / glow when active */}
                {isActive && (
                  <rect
                    x={node.x - 3} y={node.y - 3}
                    width={node.w + 6} height={node.h + 6}
                    rx={13}
                    fill={`${color}20`}
                    stroke="none"
                  />
                )}
                <rect
                  x={node.x} y={node.y}
                  width={node.w} height={node.h}
                  rx={10}
                  fill={isActive ? `${color}18` : `${color}0d`}
                  stroke={color}
                  strokeWidth={isActive ? 2 : 1}
                  strokeOpacity={isActive ? 1 : 0.5}
                  style={{ transition: 'fill 0.25s, stroke-width 0.25s, stroke-opacity 0.25s' }}
                />
                {twoLines ? (
                  <>
                    <text x={cx} y={cy - 7} textAnchor="middle" fill={color} fontSize="11" fontWeight="700">{line1}</text>
                    <text x={cx} y={cy + 8} textAnchor="middle" fill={color} fontSize="11" fontWeight="700">{line2}</text>
                  </>
                ) : (
                  <text x={cx} y={cy + 4} textAnchor="middle" fill={color} fontSize="11" fontWeight="700">{line1}</text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* ── Detail panel (desktop only, below SVG) ── */}
      <div className="hidden md:block">
        <div
          className="mt-4 rounded-2xl border transition-all duration-300"
          style={{
            borderColor: activeColor ? `${activeColor}33` : '#e2e8f0',
            boxShadow: activeColor ? `0 8px 32px ${activeColor}1a` : '0 1px 4px rgba(0,0,0,0.06)',
          }}
        >
          {activeService && activeColor ? (
            <div className="overflow-hidden rounded-2xl">
              <div className="flex items-stretch">
                <div className="w-1 shrink-0 rounded-l-2xl" style={{ background: activeColor }} />
                <div className="flex-1 px-6 py-5">
                  {activeService.cat && (
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: activeColor }}>
                      {activeService.cat}
                    </p>
                  )}
                  <h3 className="mt-0.5 text-xl font-black text-[#0f172a]">{activeService.title}</h3>
                </div>
              </div>
              <div className="px-7 pb-7">
                <p className="text-sm leading-6 text-slate-500">{activeService.desc}</p>
                {activeService.specs.length > 0 && (
                  <div className="mt-5 grid gap-2 sm:grid-cols-2">
                    {activeService.specs.map((spec) => (
                      <div
                        key={spec}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600"
                        style={{ background: '#f8fafc' }}
                      >
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: activeColor }} />
                        {spec}
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-6">
                  <Link
                    href="/contacto"
                    className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition-all hover:opacity-90 hover:scale-105"
                    style={{ background: activeColor, color: '#ffffff' }}
                  >
                    Solicitar cotización →
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="px-7 py-6 text-center">
              <p className="text-sm font-medium text-slate-400">
                Selecciona un servicio del mapa para ver los detalles
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
