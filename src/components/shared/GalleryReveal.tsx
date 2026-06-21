"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

function useRevealVisible(threshold = 0.15) {
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

export function RevealText({ children, delay = 0, className = "" }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  const { ref, visible } = useRevealVisible(0.15);
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

export function RevealImage({
  src, alt, sizes, priority, delay = 0,
}: {
  src: string; alt: string; sizes?: string; priority?: boolean; delay?: number;
}) {
  const { ref, visible } = useRevealVisible(0.1);
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
