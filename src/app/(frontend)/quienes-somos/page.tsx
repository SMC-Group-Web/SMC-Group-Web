import type { Metadata } from "next";
import Image from "next/image";
import config from "@payload-config";
import { getPayload } from "payload";
import RevealWrapper from "@/components/home/RevealWrapper";
import AnimatedTitle from "@/components/ui/AnimatedTitle";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Quiénes Somos",
  description:
    "Conoce a SMC GROUP, empresa peruana de ingeniería y construcción con más de 10 años de trayectoria ejecutando proyectos con calidad y precisión.",
  openGraph: {
    title: "Quiénes Somos | SMC GROUP",
    description: "Empresa peruana de ingeniería y construcción con más de 10 años ejecutando proyectos con calidad y precisión.",
    images: [{ url: "/fondo.png", width: 1200, height: 630, alt: "SMC GROUP — Quiénes Somos" }],
  },
};

import type { MediaType } from "@/lib/types";

export default async function QuienesSomosPage() {
  const payload = await getPayload({ config });

  const aboutPage = await payload.findGlobal({
    slug: "about-page",
    depth: 1,
  });

  const image =
    aboutPage.image && typeof aboutPage.image === "object"
      ? (aboutPage.image as MediaType)
      : null;

  return (
    <main className="min-h-screen text-[#0f172a]">
      {/* ── HERO OSCURO CON TEXTURA TÉCNICA ── */}
      <div className="fondo-hero relative overflow-hidden pt-(--header-height)">
        {/* Overlay oscuro */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #0a1628ee 0%, #0f2233dd 60%, #0d1b2acc 100%)",
          }}
        />

        {/* Grid técnico */}
        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(var(--primary) 1px, transparent 1px),
              linear-gradient(90deg, var(--primary) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Círculos decorativos */}
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full border border-white/5" />
        <div
          className="pointer-events-none absolute -right-16 top-10 h-72 w-72 rounded-full border"
          style={{ borderColor: "var(--primary)" + "40" }}
        />

        {/* Línea superior azul */}
        <div
          className="absolute left-0 top-0 h-0.75 w-full"
          style={{ background: "var(--primary)" }}
        />

        <div className="relative mx-auto w-full max-w-7xl px-6 py-14 md:px-10 md:py-16">
          <div className="max-w-2xl">
            <span className="hero-in hero-d1 mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.3em] text-white/70 backdrop-blur-sm">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: "var(--primary)" }}
              />
              SMC GROUP
            </span>
            <h1 className="hero-in hero-d2 text-white! mt-2 text-4xl font-black uppercase leading-tight tracking-tight md:text-6xl">
              Quiénes <span style={{ color: "var(--primary)" }}>Somos</span>
            </h1>
            <p className="hero-in hero-d3 mt-5 max-w-xl text-base leading-7 text-white/60">
              {aboutPage.subtitle}
            </p>
          </div>
        </div>

        {/* Ola de transición */}
        <div className="relative h-10 w-full">
          <svg
            className="absolute bottom-0 w-full"
            viewBox="0 0 1440 40"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d="M0 40L1440 40L1440 0C1440 0 1080 40 720 40C360 40 0 0 0 0L0 40Z"
              fill="#f7f9fc"
            />
          </svg>
        </div>
      </div>

      {/* ── FONDO CONTINUO ── */}
      <div className="fondo-bg relative w-full">
        <div className="absolute inset-0 bg-white/72" />

      {/* ── SECCIÓN PRINCIPAL — Texto + Imagen ── */}
      <section className="relative mx-auto w-full max-w-7xl px-6 py-16 md:px-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Texto */}
          <RevealWrapper className="space-y-6">
            <div>
              <p
                className="mb-2 text-xs font-bold uppercase tracking-[0.3em]"
                style={{ color: "var(--primary)" }}
              >
                Nuestra Historia
              </p>
              <h2 className="text-3xl font-black uppercase md:text-4xl">
                {aboutPage.title}
              </h2>
            </div>

            <p className="text-lg leading-8 text-slate-600">
              {aboutPage.subtitle}
            </p>

            <div
              className="border-l-4 pl-5 text-base leading-7 text-slate-500"
              style={{ borderColor: "var(--primary)" }}
            >
              {aboutPage.description}
            </div>

            {/* Badges de valores */}
            {((aboutPage.values || []) as { label: string }[]).length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {((aboutPage.values || []) as { label: string }[]).map((v) => (
                <span
                  key={v.label}
                  className="rounded-lg border px-3 py-1.5 text-xs font-bold uppercase tracking-wider"
                  style={{
                    borderColor: "var(--primary)" + "40",
                    color: "var(--primary)",
                    background: "var(--primary)" + "08",
                  }}
                >
                  {v.label}
                </span>
              ))}
            </div>
            )}
          </RevealWrapper>

          {/* Imagen */}
          <RevealWrapper delay={120} className="relative">
            {/* Borde decorativo */}
            <div
              className="absolute -right-3 -top-3 h-full w-full rounded-2xl"
              style={{ background: "var(--primary)", opacity: 0.15 }}
            />
            <div className="relative min-h-105 overflow-hidden rounded-2xl shadow-2xl">
              {image?.url ? (
                <Image
                  src={image.url}
                  alt={image.alt || aboutPage.title || "SMC GROUP"}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <div
                  className="relative flex min-h-105 items-center justify-center overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(135deg, #0a1628 0%, #0f2233 100%)",
                  }}
                >
                  <div
                    className="pointer-events-none absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: `
                        linear-gradient(var(--primary) 1px, transparent 1px),
                        linear-gradient(90deg, var(--primary) 1px, transparent 1px)
                      `,
                      backgroundSize: "30px 30px",
                    }}
                  />
                  <p className="relative text-sm font-semibold text-white/30 uppercase tracking-widest">
                    SMC GROUP SAC
                  </p>
                </div>
              )}
            </div>
          </RevealWrapper>
        </div>
      </section>

      {/* ── FORTALEZAS ── */}
      <section className="fondo-hero relative w-full py-20">
        <div className="absolute inset-0 bg-white/88" />

        <div className="relative mx-auto w-full max-w-7xl px-6 md:px-10">
          <div className="mb-12 text-center">
            <p
              className="mb-2 text-xs font-bold uppercase tracking-[0.3em]"
              style={{ color: "var(--primary)" }}
            >
              Nuestro Enfoque
            </p>
            <AnimatedTitle text="Principios que nos definen" className="text-3xl font-black uppercase md:text-4xl" />
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">
              Valores y fortalezas que guían cada proyecto que desarrollamos.
            </p>
          </div>

          {aboutPage.strengths && aboutPage.strengths.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {aboutPage.strengths.map((item, index) => (
                <RevealWrapper key={index} delay={index * 100}>
                <article
                  className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-(--primary) hover:shadow-[0_20px_40px_rgba(47,86,201,0.12)]"
                >
                  {/* Número decorativo */}
                  <span className="absolute right-4 top-3 select-none text-6xl font-black leading-none text-gray-100 transition-colors duration-300 group-hover:text-blue-50">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {/* Ícono círculo */}
                  <div
                    className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ background: "var(--primary)" + "15" }}
                  >
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ background: "var(--primary)" }}
                    />
                  </div>

                  <h3 className="mb-2 text-base font-bold text-[#0f172a]">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-6 text-slate-500">
                    {item.description}
                  </p>

                  {/* Línea azul hover */}
                  <div
                    className="absolute bottom-0 left-0 h-0.75 w-0 transition-all duration-500 group-hover:w-full"
                    style={{ background: "var(--primary)" }}
                  />
                </article>
                </RevealWrapper>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <p className="text-slate-500">
                Aún no se han registrado fortalezas en el panel.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="relative mx-auto w-full max-w-7xl px-6 py-20 text-center md:px-10">
        <RevealWrapper>
        <p
          className="mb-2 text-xs font-bold uppercase tracking-[0.3em]"
          style={{ color: "var(--primary)" }}
        >
          ¿Listo para trabajar juntos?
        </p>
        <AnimatedTitle text="Hablemos de tu Proyecto" highlight="Proyecto" className="text-3xl font-black uppercase md:text-4xl" />
        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-500">
          Contáctanos y cuéntanos sobre tu proyecto. Nuestro equipo está listo
          para ofrecerte la mejor solución de ingeniería.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href="/contacto"
            className="rounded-xl px-8 py-3.5 text-sm font-bold text-white transition hover:scale-105 hover:opacity-90 active:scale-95"
            style={{ background: "var(--primary)", color: "white" }}
          >
            Solicitar Cotización →
          </a>
          <a
            href="/proyectos"
            className="rounded-xl border border-gray-300 px-8 py-3.5 text-sm font-bold text-slate-600 transition hover:border-(--primary) hover:text-(--primary)"
          >
            Ver Proyectos
          </a>
        </div>
        </RevealWrapper>
      </section>
      </div>
    </main>
  );
}
