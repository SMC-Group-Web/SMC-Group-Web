import config from "@payload-config";
import { getPayload } from "payload";

type MediaType = {
  id: string | number;
  url?: string | null;
  alt?: string | null;
  filename?: string | null;
};

export default async function ServiciosPage() {
  const payload = await getPayload({ config });

  const services = await payload.find({
    collection: "services",
    where: { isActive: { equals: true } },
    sort: "-isFeatured,order",
    limit: 100,
    depth: 1,
  });

  return (
    <main className="min-h-screen bg-[#f7f9fc] text-[#0f172a]">
      {/* ── HERO OSCURO CON TEXTURA TÉCNICA ── */}
      <div
        className="relative overflow-hidden pt-(--header-height)"
        style={{
          backgroundImage: "url('/fondo.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Overlay oscuro azul marino */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #0a1628ee 0%, #0f2233dd 60%, #0d1b2acc 100%)",
          }}
        />

        {/* Grid técnico tipo plano */}
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
        <div className="pointer-events-none absolute right-20 top-20 h-48 w-48 rounded-full border border-white/5" />

        {/* Línea superior azul */}
        <div
          className="absolute left-0 top-0 h-0.75 w-full"
          style={{ background: "var(--primary)" }}
        />

        <div className="relative mx-auto w-full max-w-7xl px-6 py-14 md:px-10 md:py-16">
          <div className="max-w-2xl">
            {/* Eyebrow */}
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.3em] text-white/70 backdrop-blur-sm">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: "var(--primary)" }}
              />
              SMC GROUP — Servicios
            </span>

            {/* Título */}
            <h1 className="text-white! mt-2 text-4xl font-black uppercase leading-tight tracking-tight md:text-6xl">
              Nuestros{" "}
              <span style={{ color: "var(--primary)" }}>Servicios</span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-white/60">
              Servicios especializados en ingeniería y construcción con los más
              altos estándares técnicos, calidad y cumplimiento normativo.
            </p>

            {/* Stats */}
            <div className="mt-8 flex flex-wrap gap-8 border-t border-white/10 pt-8">
              {[
                { value: "10+", label: "Años de experiencia" },
                { value: "100%", label: "Calidad garantizada" },
                { value: "50+", label: "Clientes satisfechos" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-2xl font-black text-white">{s.value}</p>
                  <p className="text-xs font-semibold uppercase tracking-widest text-white/40">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Ola de transición */}
        <div className="relative h-10 w-full">
          <svg
            className="absolute bottom-0 w-full"
            viewBox="0 0 1440 40"
            fill="none"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 40L1440 40L1440 0C1440 0 1080 40 720 40C360 40 0 0 0 0L0 40Z"
              fill="#f7f9fc"
            />
          </svg>
        </div>
      </div>

      {/* ── GRID DE SERVICIOS ── */}
      <section className="mx-auto w-full max-w-7xl px-6 py-14 pb-24 md:px-10">
        {services.docs.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <p className="text-slate-500">
              Aún no hay servicios activos registrados en el panel.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {services.docs.map((service, i) => {
              const image =
                service.image && typeof service.image === "object"
                  ? (service.image as MediaType)
                  : null;
              const num = String(i + 1).padStart(2, "0");
              const features = (service.features || []) as { text: string }[];

              return (
                <article
                  key={service.id}
                  className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_24px_48px_rgba(47,86,201,0.15)]"
                >
                  {/* ── IMAGEN ── */}
                  <div className="relative h-52 w-full overflow-hidden bg-gray-50 flex items-center justify-center p-4">
                    {image?.url ? (
                      <img
                        src={image.url}
                        alt={image.alt || service.title}
                        className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div
                        className="relative flex h-full w-full items-center justify-center overflow-hidden"
                        style={{
                          background:
                            "linear-gradient(135deg, #0a1628 0%, #0f2233 100%)",
                        }}
                      >
                        {/* Mini grid técnico en placeholder */}
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
                        <svg
                          className="relative h-14 w-14 opacity-30"
                          style={{ color: "var(--primary)" }}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={1}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z"
                          />
                        </svg>
                      </div>
                    )}

                    {/* Badge destacado */}
                    {service.isFeatured && (
                      <span
                        className="absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold text-white shadow"
                        style={{ background: "var(--primary)" }}
                      >
                        Destacado
                      </span>
                    )}

                    {/* Número */}
                    <span className="absolute right-3 top-3 rounded-lg bg-black/40 px-2 py-1 text-xs font-black text-white/80 backdrop-blur-sm">
                      {num}
                    </span>

                    {/* Franja azul bottom hover */}
                    <div
                      className="absolute bottom-0 left-0 h-0.75 w-0 transition-all duration-500 group-hover:w-full"
                      style={{ background: "var(--primary)" }}
                    />
                  </div>
                  {/* ── CONTENIDO ── */}
                  <div className="p-6">
                    <p
                      className="mb-2 text-xs font-bold uppercase tracking-[0.25em]"
                      style={{ color: "var(--primary)" }}
                    >
                      {(service.category as string) || "Servicio"}
                    </p>

                    <h2 className="mb-3 text-xl font-bold text-[#0f172a]">
                      {service.title}
                    </h2>

                    <p className="mb-4 text-sm leading-6 text-slate-500">
                      {service.summary}
                    </p>

                    {/* Bullets */}
                    {features.length > 0 && (
                      <ul className="mb-5 space-y-2 border-t border-gray-100 pt-4">
                        {features.map((f, fi) => (
                          <li
                            key={fi}
                            className="flex items-center gap-2 text-sm text-slate-600"
                          >
                            <span
                              className="h-1.5 w-1.5 shrink-0 rounded-full"
                              style={{ background: "var(--primary)" }}
                            />
                            {f.text}
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* CTA */}
                    <a
                      href={(service.ctaLink as string) || "/contacto"}
                      className="mt-2 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all hover:gap-3 hover:opacity-90 hover:scale-105"
                      style={{ background: "var(--primary)", color: "white" }}
                    >
                      Solicitar Cotización →
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
