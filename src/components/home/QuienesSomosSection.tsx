"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const team = [
  { name: "Carlos López",  role: "Operario",          x: 7  },
  { name: "José Ramírez",  role: "Ingeniero",         x: 20 },
  { name: "María Torres",  role: "Arquitecta",        x: 33 },
  { name: "Pedro Sánchez", role: "Gerente General",   x: 50 },
  { name: "Luis Vega",     role: "Jefe de Proyectos", x: 63 },
  { name: "Ana Flores",    role: "Administración",    x: 76 },
  { name: "Rosa Díaz",     role: "Supervisora",       x: 89 },
];

export default function QuienesSomosSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setVisible(true); obs.disconnect(); }
      },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full py-0">

      {/* ── ENCABEZADO STICKY ── */}
      <div
        className="sticky z-20 bg-white px-6 py-8 text-center md:px-10"
        style={{ top: "var(--header-height, 73px)" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-3 flex items-center justify-center gap-3">
            <div className="h-px w-8" style={{ background: "var(--primary)" }} />
            <p className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: "var(--primary)" }}>
              Quiénes Somos
            </p>
            <div className="h-px w-8" style={{ background: "var(--primary)" }} />
          </div>
          <h2 className="text-3xl font-black uppercase text-[#0f172a] md:text-4xl">
            Nuestro <span style={{ color: "var(--primary)" }}>Equipo</span>
          </h2>
        </motion.div>
          {/* Nombres desktop — dentro del sticky */}
          <div className="relative mt-6 hidden h-12 w-full md:block">
            {team.map((p, i) => (
              <motion.div
                key={p.name}
                className="absolute bottom-0 -translate-x-1/2 text-center"
                style={{ left: `${p.x}%` }}
                initial={{ opacity: 0, y: 14 }}
                animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="text-xs font-bold leading-tight text-[#0f172a]">{p.name}</p>
                <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--primary)" }}>
                  {p.role}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Líneas conectoras — dentro del sticky */}
          <div className="relative hidden h-4 w-full md:block">
            {team.map((p) => (
              <div
                key={p.name}
                className="absolute top-0 h-full w-px -translate-x-1/2"
                style={{ left: `${p.x}%`, background: "var(--primary)", opacity: 0.2 }}
              />
            ))}
          </div>
        </div>

      {/* ── Desktop — solo imagen (lo sticky lo maneja el bloque de arriba) ── */}
      <div className="hidden w-full md:block">

        {/* Imagen — zoom desde el fondo, solo al llegar a la sección */}
        <div className="overflow-hidden px-10 md:px-20">
          <motion.div
            initial={{ scale: 0.72, y: 80, opacity: 0 }}
            whileInView={{ scale: 1, y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src="/equipo.png"
              alt="Equipo SMC GROUP"
              width={764}
              height={327}
              priority
              className="block w-full"
            />
          </motion.div>
        </div>
      </div>

      {/* ── Mobile ── */}
      <div className="mt-8 w-full md:hidden">
        <div className="overflow-hidden">
          <motion.div
            initial={{ scale: 0.72, y: 60, opacity: 0 }}
            whileInView={{ scale: 1, y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src="/equipo.png"
              alt="Equipo SMC GROUP"
              width={764}
              height={327}
              priority
              className="block w-full"
            />
          </motion.div>
        </div>

        <div className="mx-auto mt-6 grid max-w-sm grid-cols-2 gap-x-4 gap-y-3 px-4 sm:gap-x-6">
          {team.map((p, i) => (
            <motion.div
              key={p.name}
              className="flex items-start gap-2"
              initial={{ opacity: 0, x: -10 }}
              animate={visible ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
              transition={{ duration: 0.35, delay: 0.35 + i * 0.055, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "var(--primary)" }} />
              <div>
                <p className="text-xs font-bold leading-tight text-[#0f172a] sm:text-sm">{p.name}</p>
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] sm:tracking-[0.15em]" style={{ color: "var(--primary)" }}>
                  {p.role}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <motion.div
        className="mt-8 text-center"
        initial={{ opacity: 0 }}
        animate={visible ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Link
          href="/quienes-somos"
          className="text-sm font-semibold underline-offset-4 hover:underline"
          style={{ color: "var(--primary)" }}
        >
          Conoce más sobre nosotros →
        </Link>
      </motion.div>

    </section>
  );
}
