import Image from "next/image";
import { siteConfig } from "@/lib/site";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="relative overflow-hidden text-white"
      style={{
        backgroundImage: "url('/fondo.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay oscuro igual que los heroes */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, #0a1628f0 0%, #0f2233ee 50%, #0a1628f0 100%)",
        }}
      />
      {/* Línea azul superior */}
      <div className="h-0.75 w-full" style={{ background: "var(--primary)" }} />

      {/* Grid técnico decorativo */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(var(--primary) 1px, transparent 1px),
            linear-gradient(90deg, var(--primary) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Círculos decorativos */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full border border-white/5" />
      <div
        className="pointer-events-none absolute -right-20 top-10 h-64 w-64 rounded-full border"
        style={{ borderColor: "var(--primary)" + "30" }}
      />

      <div className="relative mx-auto w-full max-w-7xl px-6 pt-14 pb-10 md:px-10">
        {/* TOP — Logo + Slogan + Certificaciones */}
        <div className="mb-12 flex flex-col items-start gap-6 border-b border-white/10 pb-10 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <Image
              src="/logo-smc.png"
              alt="SMC GROUP"
              width={160}
              height={50}
              className="h-10 w-auto object-contain brightness-0 invert"
            />
            <p className="text-sm italic text-white/40 tracking-wide">
              "Construimos con precisión. Entregamos con compromiso."
            </p>
          </div>
        </div>

        {/* GRID — 3 columnas */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {/* Columna 1 — Sobre SMC */}
          <div className="space-y-4">
            <h4
              className="text-[11px] font-bold uppercase tracking-[0.3em]"
              style={{ color: "var(--primary)" }}
            >
              Sobre SMC GROUP
            </h4>
            <p className="text-sm leading-7 text-white/50">
              Empresa peruana especializada en ingeniería estructural,
              fabricación metalmecánica y construcción industrial con más de 5
              años de trayectoria.
            </p>
            {/* LinkedIn */}
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://www.linkedin.com/company/smc-group"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/40 transition-all hover:border-(--primary) hover:bg-(--primary) hover:text-white"
                aria-label="LinkedIn SMC GROUP"
              >
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <span className="text-xs text-white/25">SMC GROUP SAC</span>
            </div>
          </div>

          {/* Columna 2 — Navegación */}
          <div className="space-y-4">
            <h4
              className="text-[11px] font-bold uppercase tracking-[0.3em]"
              style={{ color: "var(--primary)" }}
            >
              Navegación
            </h4>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-3">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="group flex items-center gap-1.5 text-sm text-white/50 transition-colors hover:text-white"
                  >
                    <span
                      className="h-1 w-1 rounded-full transition-colors group-hover:bg-white"
                      style={{ background: "var(--primary)" }}
                    />
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3 — Contacto */}
          <div className="space-y-4">
            <h4
              className="text-[11px] font-bold uppercase tracking-[0.3em]"
              style={{ color: "var(--primary)" }}
            >
              Contacto
            </h4>
            <ul className="space-y-3 text-sm text-white/50">
              {/* Dirección */}
              <li className="flex items-start gap-3">
                <svg
                  className="mt-0.5 h-4 w-4 shrink-0 text-white/25"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                  />
                </svg>
                <a
                  href="https://www.google.com/maps/place/Gaviotas+132,+Lima+15047/@-12.1040084,-77.0241048,17z"
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-white"
                >
                  Gaviotas 132, Lima 15047, Perú
                </a>
              </li>

              {/* Website */}
              <li className="flex items-start gap-3">
                <svg
                  className="mt-0.5 h-4 w-4 shrink-0 text-white/25"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253M3 12a8.959 8.959 0 0 0 .284 2.253"
                  />
                </svg>
                <span>{siteConfig.website}</span>
              </li>

              {/* WhatsApp */}
              <li className="flex items-start gap-3">
                <svg
                  className="mt-0.5 h-4 w-4 shrink-0 text-white/25"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                  />
                </svg>
                <a
                  href={`https://wa.me/${siteConfig.whatsappNumber}`}
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-white"
                >
                  +{siteConfig.whatsappNumber}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-8 text-xs text-white/25 md:flex-row">
          <p>© {year} SMC GROUP SAC. Todos los derechos reservados.</p>
          <p className="tracking-wide">
            Lima, Perú — Ingeniería & Construcción
          </p>
        </div>
      </div>
    </footer>
  );
}
