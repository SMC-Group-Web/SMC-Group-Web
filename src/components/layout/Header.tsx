"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { siteConfig } from "@/lib/site";

type SubItem = { label: string; href: string };
type NavItem = {
  label: string;
  href: string;
  subItems?: SubItem[];
  isPage?: boolean;
};

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null);
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    setMenuOpen(false);
    setExpandedMobile(null);
  }, [pathname]);

  useEffect(() => {
    if (!isHome) setActiveSection("");

    let rafId = 0;

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      if (!isHome) return;

      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const headerHeight = headerRef.current?.offsetHeight || 73;
        if (window.scrollY < 200) {
          setActiveSection("");
          return;
        }
        const sections = ["proyectos", "servicios"];
        let current = "";
        for (const id of sections) {
          const el = document.getElementById(id);
          if (el && el.getBoundingClientRect().top <= headerHeight + 100)
            current = id;
        }
        setActiveSection(current);
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, [isHome]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => {
    setMenuOpen(false);
    setExpandedMobile(null);
  };

  const handleAnchorClick = (
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
    if (href === "/servicios")
      return (
        (isHome && activeSection === "servicios") ||
        pathname.startsWith("/servicios")
      );
    if (href === "/proyectos")
      return (
        (isHome && activeSection === "proyectos") ||
        pathname.startsWith("/proyectos")
      );
    if (href.startsWith("/#")) return false;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleMouseEnter = (label: string) => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setHoveredItem(label);
  };

  const handleMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => setHoveredItem(null), 180);
  };

  const nav = siteConfig.nav as NavItem[];

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
              sizes="200px"
              className="h-10 w-auto object-contain transition-opacity duration-300"
              priority
            />
          </Link>

          {/* Nav desktop */}
          <nav className="hidden items-center gap-6 md:flex">
            {nav.map((item) => {
              const active = isActive(item.href);
              const hasDropdown = item.subItems && item.subItems.length > 0;

              if (hasDropdown) {
                return (
                  <div
                    key={item.href}
                    className="relative"
                    onMouseEnter={() => handleMouseEnter(item.label)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link
                      href={item.href}
                      className="relative flex cursor-pointer items-center gap-1 pb-2 text-base font-medium transition-colors duration-300"
                      style={{
                        color: isTransparent
                          ? "white"
                          : active
                            ? "var(--primary)"
                            : "var(--foreground)",
                      }}
                    >
                      {item.label}
                      {/* Chevron down */}
                      <svg
                        className={`mt-0.5 h-3.5 w-3.5 transition-transform duration-200 ${hoveredItem === item.label ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                      <span
                        className="absolute bottom-0 left-0 h-0.5 rounded-full transition-all duration-300"
                        style={{
                          width: active ? "100%" : "0%",
                          background: isTransparent
                            ? "white"
                            : "var(--primary)",
                        }}
                      />
                    </Link>

                    {/* Dropdown */}
                    <div
                      className={`absolute left-0 top-full z-50 mt-1 min-w-50 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl transition-all duration-200 ${
                        hoveredItem === item.label
                          ? "pointer-events-auto translate-y-0 opacity-100"
                          : "pointer-events-none -translate-y-1 opacity-0"
                      }`}
                    >
                      {/* Opción principal → página completa */}
                      <Link
                        href={item.href}
                        className="flex items-center justify-between px-4 py-3 text-sm font-semibold text-[#0f172a] transition-colors hover:bg-slate-50"
                        onClick={closeMenu}
                      >
                        <span>Todos los {item.label.toLowerCase()}</span>
                        <svg
                          className="h-3.5 w-3.5 shrink-0 text-slate-400"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                          />
                        </svg>
                      </Link>

                      <div className="mx-3 border-t border-gray-100" />

                      {/* Sub-items (anclas home) */}
                      {item.subItems!.map((sub) => (
                        <a
                          key={sub.href}
                          href={sub.href}
                          onClick={(e) =>
                            handleAnchorClick(
                              e as React.MouseEvent<HTMLAnchorElement>,
                              sub.href,
                            )
                          }
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700"
                        >
                          {/* Home icon */}
                          <svg
                            className="h-3.5 w-3.5 shrink-0 text-slate-400"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                            />
                          </svg>
                          {sub.label}
                        </a>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) =>
                    handleAnchorClick(
                      e as React.MouseEvent<HTMLAnchorElement>,
                      item.href,
                    )
                  }
                  className="relative flex cursor-pointer items-center gap-1 pb-2 text-base font-medium transition-colors duration-300"
                  style={{
                    color: isTransparent
                      ? "white"
                      : active
                        ? "var(--primary)"
                        : "var(--foreground)",
                  }}
                >
                  {item.label}
                  {item.isPage && (
                    <svg
                      className="mb-1.5 h-3 w-3 opacity-50"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                      />
                    </svg>
                  )}
                  <span
                    className="absolute bottom-0 left-0 h-0.5 rounded-full transition-all duration-300"
                    style={{
                      width: active ? "100%" : "0%",
                      background: isTransparent ? "white" : "var(--primary)",
                    }}
                  />
                </a>
              );
            })}
          </nav>

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

      {/* Drawer mobile */}
      <aside
        className={`fixed right-0 top-0 z-60 h-screen w-[86%] max-w-sm overflow-y-auto overflow-x-hidden border-l border-white/10 text-white shadow-2xl transition-transform duration-500 md:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          background:
            "linear-gradient(160deg, var(--charcoal) 0%, #1a2030 50%, var(--charcoal) 100%)",
        }}
        aria-hidden={!menuOpen}
      >
        {/* Decoración */}
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
          {/* Encabezado */}
          <div className="mb-8">
            <p className="text-[11px] uppercase tracking-[0.35em] text-white/45">
              Navegación
            </p>
            <h3 className="mt-3 text-2xl font-semibold leading-tight text-white">
              Ingeniería y Construcción
            </h3>
            <p className="mt-2 text-sm text-white/60">
              Soluciones, proyectos y contacto en un solo lugar.
            </p>
          </div>

          {/* Links nav */}
          <nav className="flex flex-col">
            {nav.map((item) => {
              const active = isActive(item.href);
              const hasDropdown = item.subItems && item.subItems.length > 0;
              const isExpanded = expandedMobile === item.label;

              return (
                <div key={item.href}>
                  {/* Fila principal */}
                  <div className="flex items-center border-b border-white/10">
                    {hasDropdown ? (
                      <>
                        {/* Enlace principal → página completa */}
                        <Link
                          href={item.href}
                          onClick={closeMenu}
                          className={`flex flex-1 items-center py-4 text-base font-medium transition ${
                            active
                              ? "text-white"
                              : "text-white/75 hover:text-white"
                          }`}
                          style={{
                            color: active ? "var(--primary)" : undefined,
                          }}
                        >
                          {item.label}
                        </Link>
                        {/* Botón expandir sub-items */}
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedMobile(isExpanded ? null : item.label)
                          }
                          aria-label={isExpanded ? "Colapsar" : "Expandir"}
                          className="flex h-10 w-10 items-center justify-center rounded-xl text-white/50 transition hover:bg-white/10 hover:text-white"
                        >
                          <svg
                            className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2.5}
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>
                      </>
                    ) : (
                      <a
                        href={item.href}
                        onClick={(e) =>
                          handleAnchorClick(
                            e as React.MouseEvent<HTMLAnchorElement>,
                            item.href,
                          )
                        }
                        className={`group flex flex-1 cursor-pointer items-center justify-between py-4 text-base font-medium transition ${
                          active
                            ? "text-white"
                            : "text-white/75 hover:text-white"
                        }`}
                      >
                        <span
                          style={{
                            color: active ? "var(--primary)" : undefined,
                          }}
                        >
                          {item.label}
                        </span>
                        {/* Indicador de página para Quiénes somos y Contacto */}
                        <span
                          className={`text-sm transition-all duration-300 ${
                            active
                              ? "translate-x-0 opacity-100"
                              : "translate-x-1 opacity-40 group-hover:translate-x-0 group-hover:opacity-100"
                          }`}
                          style={{
                            color: active ? "var(--primary)" : undefined,
                          }}
                        >
                          ↗
                        </span>
                      </a>
                    )}
                  </div>

                  {/* Sub-items expandibles */}
                  {hasDropdown && isExpanded && (
                    <div className="border-b border-white/10 bg-white/5">
                      {/* Ir a página completa */}
                      <Link
                        href={item.href}
                        onClick={closeMenu}
                        className="flex items-center justify-between px-4 py-3 text-sm font-semibold text-white/90 transition hover:text-white"
                      >
                        <span>Todos los {item.label.toLowerCase()}</span>
                        <svg
                          className="h-3.5 w-3.5 shrink-0 opacity-60"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                          />
                        </svg>
                      </Link>
                      {/* Ver en inicio */}
                      {item.subItems!.map((sub) => (
                        <a
                          key={sub.href}
                          href={sub.href}
                          onClick={(e) =>
                            handleAnchorClick(
                              e as React.MouseEvent<HTMLAnchorElement>,
                              sub.href,
                            )
                          }
                          className="flex items-center gap-2.5 px-4 py-3 text-sm text-white/55 transition hover:text-white/80"
                        >
                          <svg
                            className="h-3.5 w-3.5 shrink-0 opacity-60"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                            />
                          </svg>
                          {sub.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* CTAs */}
          <div className="mt-auto space-y-3 pt-8">
            <a
              href="/proyectos"
              onClick={closeMenu}
              className="flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.01] hover:opacity-90 active:scale-[0.99]"
              style={{ background: "var(--primary)" }}
            >
              Ver Portafolio
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
            </a>

            <a
              href={`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(siteConfig.whatsappMessage)}`}
              target="_blank"
              rel="noreferrer"
              onClick={closeMenu}
              className="flex items-center justify-center gap-2.5 rounded-2xl border border-white/15 bg-white/5 px-5 py-3.5 text-sm font-medium text-white/85 backdrop-blur transition hover:bg-white/10"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}
