"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Intercepta todos los clicks en links internos
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;

      // Solo proyectos y servicios (páginas pesadas con CMS)
      const isHeavy =
        href.startsWith("/proyectos") || href.startsWith("/servicios");

      if (!isHeavy) return;
      if (href === pathname) return;

      // Muestra overlay inmediatamente al hacer click
      setLoading(true);
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [pathname]);

  useEffect(() => {
    // Cuando la ruta ya cambió, oculta el overlay
    const timer = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      {children}

      <AnimatePresence>
        {loading && (
          <motion.div
            key="overlay"
            className="fixed inset-0 z-9999 flex flex-col items-center justify-center"
            style={{ background: '#2f56c9' }}
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={{ clipPath: "inset(0 0% 0 0)" }}
            exit={{ clipPath: "inset(0 0 0 100%)" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          >
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, delay: 0.25 }}
              className="flex flex-col items-center gap-6"
            >
              <Image
                src="/logo-smc.png"
                alt="SMC GROUP"
                width={180}
                height={60}
                priority
                className="object-contain"
              />
              <div className="h-0.5 w-24 overflow-hidden rounded-full bg-white/30">
                <motion.div
                  className="h-full bg-white"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.7, ease: "easeInOut" }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
