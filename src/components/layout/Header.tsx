"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { siteConfig } from "@/lib/site";

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  const isHome = pathname === "/";
  const isTransparent = isHome && !scrolled;

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      document.documentElement.style.setProperty(
        "--header-height",
        `${entry.contentRect.height}px`,
      );
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!isHome) {
      setActiveSection("");
      return;
    }

    const handleSectionTracking = () => {
      const headerHeight = headerRef.current?.offsetHeight || 73;

      if (window.scrollY < 200) {
        setActiveSection("");
        return;
      }

      const sections = ["servicios", "proyectos"];
      let current = "";

      for (const id of sections) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= headerHeight + 100) {
          current = id;
        }
      }

      setActiveSection(current);
    };

    handleSectionTracking();
    window.addEventListener("scroll", handleSectionTracking, { passive: true });
    return () => window.removeEventListener("scroll", handleSectionTracking);
  }, [isHome]);

  const closeMenu = () => setMenuOpen(false);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (!href.includes("#")) {
      closeMenu();
      return;
    }
    e.preventDefault();
    const anchor = href.split("#")[1];

    if (isHome) {
      const el = document.getElementById(anchor);
      if (el) {
        const headerHeight = headerRef.current?.offsetHeight || 73;
        const top =
          el.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({ top, behavior: "smooth" });
      }
    } else {
      router.push(`/#${anchor}`);
    }
    closeMenu();
  };

  const isActive = (href: string) => {
    if (href === "/") return isHome && activeSection === "";
    if (href === "/#servicios") return isHome && activeSection === "servicios";
    if (href === "/#proyectos") return isHome && activeSection === "proyectos";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 z-50 w-full transition-all duration-500 ${
          isTransparent
            ? "border-b border-white/10 bg-transparent backdrop-blur-sm"
            : "border-b border-(--border) bg-white/95 shadow-sm backdrop-blur"
        }`}
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 md:px-10">
          {/* Logo */}
          <Link
            href="/"
            className="flex shrink-0 items-center gap-3"
            onClick={closeMenu}
          >
            <Image
              src="/logo-smc.png"
              alt="SMC GROUP"
              width={200}
              height={64}
              className="h-10 w-auto object-contain transition-opacity duration-300"
              priority
            />
          </Link>

          {/* Nav desktop */}
          <nav className="hidden items-center gap-6 md:flex">
            {siteConfig.nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="relative cursor-pointer pb-2 text-base font-medium transition-colors duration-300"
                style={{
                  color: isTransparent
                    ? "white"
                    : isActive(item.href)
                      ? "var(--primary)"
                      : "var(--foreground)",
                }}
              >
                {item.label}
                <span
                  className="absolute bottom-0 left-0 h-0.5 rounded-full transition-all duration-300"
                  style={{
                    width: isActive(item.href) ? "100%" : "0%",
                    background: isTransparent ? "white" : "var(--primary)",
                  }}
                />
              </a>
            ))}
          </nav>

          {/* CTA desktop */}
          <a
            href="/contacto"
            className="hidden rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition hover:scale-105 active:scale-95 md:inline-flex"
            style={{ background: "var(--primary)", color: "white" }}
          >
            Solicitar cotización
          </a>

          {/* Botón hamburguesa mobile */}
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
            className={`relative z-70 flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-2xl border backdrop-blur transition md:hidden ${
              isTransparent
                ? "border-white/20 bg-white/10 hover:bg-white/15"
                : "border-(--border) bg-white/80 hover:bg-white"
            }`}
          >
            <span
              className={`block h-0.5 w-6 rounded-full transition-all duration-300 ${menuOpen ? "translate-y-2 rotate-45" : ""}`}
              style={{
                background: isTransparent ? "white" : "var(--foreground)",
              }}
            />
            <span
              className={`block h-0.5 w-6 rounded-full transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
              style={{
                background: isTransparent ? "white" : "var(--foreground)",
              }}
            />
            <span
              className={`block h-0.5 w-6 rounded-full transition-all duration-300 ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`}
              style={{
                background: isTransparent ? "white" : "var(--foreground)",
              }}
            />
          </button>
        </div>
      </header>

      {/* Overlay mobile */}
      <div
        onClick={closeMenu}
        aria-hidden="true"
        className={`fixed inset-0 z-55 bg-black/45 backdrop-blur-[2px] transition-all duration-300 md:hidden ${
          menuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      {/* Drawer mobile — paleta SMC */}
      <aside
        className={`fixed right-0 top-0 z-60 h-screen w-[86%] max-w-sm overflow-hidden border-l border-white/10 text-white shadow-2xl transition-transform duration-500 md:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          background:
            "linear-gradient(160deg, var(--charcoal) 0%, #1a2030 50%, var(--charcoal) 100%)",
        }}
        aria-hidden={!menuOpen}
      >
        {/* Decoración con colores SMC */}
        <div className="pointer-events-none absolute -right-24 top-20 h-72 w-72 rounded-full border border-white/10" />
        <div
          className="pointer-events-none absolute -right-12 top-28 h-60 w-60 rounded-full border"
          style={{ borderColor: "var(--primary)" + "50" }}
        />
        <div className="pointer-events-none absolute -right-4 top-36 h-44 w-44 rounded-full border border-white/10" />
        <div
          className="pointer-events-none absolute right-0 top-0 h-full w-40"
          style={{
            background: `linear-gradient(to bottom, var(--primary)25, transparent)`,
          }}
        />
        <div className="pointer-events-none absolute left-0 top-0 h-px w-full bg-linear-to-r from-transparent via-white/20 to-transparent" />

        <div className="relative flex h-full flex-col px-6 pb-8 pt-24">
          {/* Encabezado del drawer */}
          <div className="mb-8">
            <p className="text-[11px] uppercase tracking-[0.35em] text-white/45">
              Navegación
            </p>
            <h3
              className="mt-3 text-2xl font-semibold leading-tight"
              style={{ color: "white" }}
            >
              Ingeniería y Construcción
            </h3>
            <p className="mt-2 text-sm text-white/60">
              Soluciones, proyectos y contacto en un solo lugar.
            </p>
          </div>

          {/* Links nav */}
          <nav className="flex flex-col">
            {siteConfig.nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`group flex cursor-pointer items-center justify-between border-b border-white/10 py-4 text-base font-medium transition ${
                  isActive(item.href)
                    ? "text-white"
                    : "text-white/75 hover:text-white"
                }`}
              >
                <span
                  style={{
                    color: isActive(item.href) ? "var(--primary)" : undefined,
                  }}
                >
                  {item.label}
                </span>
                <span
                  className={`text-lg transition-all duration-300 ${
                    isActive(item.href)
                      ? "translate-x-0 opacity-100"
                      : "translate-x-1 opacity-40 group-hover:translate-x-0 group-hover:opacity-100"
                  }`}
                  style={{
                    color: isActive(item.href) ? "var(--primary)" : undefined,
                  }}
                >
                  ↗
                </span>
              </a>
            ))}
          </nav>

          {/* Botones CTA */}
          <div className="mt-auto space-y-3 pt-8">
            <a
              href="/contacto"
              onClick={closeMenu}
              className="flex items-center justify-center rounded-2xl px-5 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.01] hover:opacity-90 active:scale-[0.99]"
              style={{ background: "var(--primary)" }}
            >
              Solicitar cotización
            </a>

            <a
              href={`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(siteConfig.whatsappMessage)}`}
              target="_blank"
              rel="noreferrer"
              onClick={closeMenu}
              className="flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-5 py-3.5 text-sm font-medium text-white/85 backdrop-blur transition hover:bg-white/10"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}
