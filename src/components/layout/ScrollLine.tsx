"use client";

import { useEffect, useRef } from "react";

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const update = () => {
      const scrollY   = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress  = maxScroll > 0 ? Math.min(scrollY / maxScroll, 1) : 0;

      /* Barra superior — scaleX es GPU-composited, zero layout cost */
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${progress})`;
      }

      /* Dot lateral — translateY también GPU-composited */
      if (dotRef.current) {
        const trackH = window.innerHeight - 48;
        dotRef.current.style.transform = `translateY(${progress * trackH}px)`;
        dotRef.current.style.opacity   = scrollY > 40 ? "1" : "0";
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      {/* ── Barra de progreso superior ── */}
      <div
        className="pointer-events-none fixed left-0 right-0 z-50 h-0.5"
        style={{ top: "var(--header-height, 73px)" }}
      >
        <div
          ref={barRef}
          className="h-full w-full origin-left"
          style={{
            background: "linear-gradient(to right, var(--primary), #5b82ff)",
            transform: "scaleX(0)",
          }}
        />
      </div>

      {/* ── Dot lateral derecho (solo desktop) ── */}
      <div className="pointer-events-none fixed right-3 top-24 hidden lg:block" style={{ zIndex: 40 }}>
        {/* Riel */}
        <div
          className="absolute left-1/2 top-0 w-px -translate-x-1/2"
          style={{
            height: "calc(100vh - 96px)",
            background: "var(--primary)",
            opacity: 0.1,
          }}
        />
        {/* Dot */}
        <div
          ref={dotRef}
          className="relative h-3 w-3 -translate-x-px rounded-full transition-opacity duration-300"
          style={{
            background: "var(--primary)",
            opacity: 0,
            boxShadow: "0 0 8px var(--primary)",
          }}
        />
      </div>
    </>
  );
}
