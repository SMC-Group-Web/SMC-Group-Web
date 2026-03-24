import config from "@payload-config";
import { getPayload } from "payload";

export default async function ContactoPage() {
  const payload = await getPayload({ config });

  const contactPage = await payload.findGlobal({
    slug: "contact-page",
    depth: 1,
  });

  const whatsappHref = contactPage.whatsappNumber
    ? `https://wa.me/${contactPage.whatsappNumber}?text=${encodeURIComponent(
        contactPage.whatsappMessage || "Hola, deseo más información.",
      )}`
    : null;

  const mapsLink =
    "https://www.google.com/maps/place/Gaviotas+132,+Lima+15047/@-12.1040084,-77.0241048,17z";
  const mapsEmbed =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3900.8!2d-77.0241048!3d-12.1040084!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c87279c1f0d3%3A0xb8849b5b5633b9ac!2sGaviotas%20132%2C%20Lima%2015047!5e0!3m2!1ses!2spe!4v1234567890";

  return (
    <main className="min-h-screen bg-[#f7f9fc] text-[#0f172a]">
      {/* ── HERO ── */}
      <div
        className="relative overflow-hidden pt-(--header-height)"
        style={{
          backgroundImage: "url('/fondo.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #0a1628ee 0%, #0f2233dd 60%, #0d1b2acc 100%)",
          }}
        />
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
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full border border-white/5" />
        <div
          className="pointer-events-none absolute -right-16 top-10 h-72 w-72 rounded-full border"
          style={{ borderColor: "var(--primary)" + "40" }}
        />
        <div
          className="absolute left-0 top-0 h-0.75 w-full"
          style={{ background: "var(--primary)" }}
        />

        <div className="relative mx-auto w-full max-w-7xl px-6 py-14 md:px-10 md:py-16">
          <div className="max-w-2xl">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.3em] text-white/70 backdrop-blur-sm">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: "var(--primary)" }}
              />
              SMC GROUP
            </span>
            <h1 className="text-white! mt-2 text-4xl font-black uppercase leading-tight tracking-tight md:text-6xl">
              {contactPage.title || "Contáctanos"}{" "}
              <span style={{ color: "var(--primary)" }}>con nosotros</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/60">
              {contactPage.subtitle}
            </p>
          </div>
        </div>

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

      {/* ── CONTENIDO PRINCIPAL ── */}
      {/* ── ¿POR QUÉ ELEGIRNOS? ── */}
      {contactPage.infoCards && contactPage.infoCards.length > 0 && (
        <section
          className="relative w-full py-16"
          style={{
            backgroundImage: "url('/fondo.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        >
          <div className="absolute inset-0 bg-white/88" />
          <div className="relative mx-auto w-full max-w-7xl px-6 md:px-10">
            <div className="mb-10 text-center">
              <p
                className="mb-2 text-xs font-bold uppercase tracking-[0.3em]"
                style={{ color: "var(--primary)" }}
              >
                ¿Por qué elegirnos?
              </p>
              <h2 className="text-3xl font-black uppercase">
                Razones para trabajar{" "}
                <span style={{ color: "var(--primary)" }}>con nosotros</span>
              </h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {contactPage.infoCards.map((item, index) => (
                <article
                  key={index}
                  className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-(--primary) hover:shadow-[0_20px_40px_rgba(47,86,201,0.12)]"
                >
                  <span className="absolute right-4 top-3 select-none text-6xl font-black leading-none text-gray-100 transition-colors group-hover:text-blue-50">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div
                    className="absolute bottom-0 left-0 h-0.75 w-0 transition-all duration-500 group-hover:w-full"
                    style={{ background: "var(--primary)" }}
                  />
                  <div
                    className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
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
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
      <section className="mx-auto w-full max-w-7xl px-6 py-16 pb-24 md:px-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:items-start">
          {/* ══ COLUMNA IZQUIERDA ══ */}
          <div className="space-y-6">
            {/* Header info */}
            <div>
              <p
                className="mb-2 text-xs font-bold uppercase tracking-[0.3em]"
                style={{ color: "var(--primary)" }}
              >
                Información de contacto
              </p>
              <h2 className="text-2xl font-black uppercase text-[#0f172a]">
                Hablemos de tu{" "}
                <span style={{ color: "var(--primary)" }}>Proyecto</span>
              </h2>
              {contactPage.description && (
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {contactPage.description}
                </p>
              )}
            </div>

            {/* Cards de contacto del CMS */}
            <div className="grid gap-3 sm:grid-cols-2">
              {contactPage.phone && (
                <div className="group flex items-start gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-(--primary) hover:shadow-md">
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                    style={{ background: "var(--primary)" + "12" }}
                  >
                    <svg
                      className="h-4 w-4"
                      style={{ color: "var(--primary)" }}
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
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Teléfono
                    </p>
                    <p className="mt-0.5 text-sm font-bold text-[#0f172a]">
                      {contactPage.phone}
                    </p>
                  </div>
                </div>
              )}

              {contactPage.email && (
                <div className="group flex items-start gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-(--primary) hover:shadow-md">
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                    style={{ background: "var(--primary)" + "12" }}
                  >
                    <svg
                      className="h-4 w-4"
                      style={{ color: "var(--primary)" }}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Email
                    </p>
                    <a
                      href={`mailto:${contactPage.email}`}
                      className="mt-0.5 block text-sm font-bold text-[#0f172a] transition hover:text-(--primary) break-all"
                    >
                      {contactPage.email}
                    </a>
                  </div>
                </div>
              )}

              {contactPage.schedule && (
                <div className="group flex items-start gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-(--primary) hover:shadow-md">
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                    style={{ background: "var(--primary)" + "12" }}
                  >
                    <svg
                      className="h-4 w-4"
                      style={{ color: "var(--primary)" }}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Horario
                    </p>
                    <p className="mt-0.5 text-sm font-bold text-[#0f172a]">
                      {contactPage.schedule}
                    </p>
                  </div>
                </div>
              )}

              {contactPage.address && (
                <div className="group flex items-start gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-(--primary) hover:shadow-md">
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                    style={{ background: "var(--primary)" + "12" }}
                  >
                    <svg
                      className="h-4 w-4"
                      style={{ color: "var(--primary)" }}
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
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Dirección
                    </p>
                    <p className="mt-0.5 text-sm font-bold text-[#0f172a]">
                      {contactPage.address}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* WhatsApp CTA */}
            {whatsappHref && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 rounded-2xl border-2 p-4 transition-all hover:shadow-lg"
                style={{
                  borderColor: "var(--primary)",
                  background: "var(--primary)" + "06",
                }}
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                  style={{ background: "var(--primary)" }}
                >
                  <svg
                    className="h-5 w-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                  </svg>
                </div>
                <div>
                  <p
                    className="text-[10px] font-bold uppercase tracking-wider"
                    style={{ color: "var(--primary)" }}
                  >
                    Respuesta inmediata
                  </p>
                  <p className="text-sm font-bold text-[#0f172a]">
                    Escribir por WhatsApp →
                  </p>
                </div>
              </a>
            )}

            {/* Mapa */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
              <iframe
                src={mapsEmbed}
                width="100%"
                height="200"
                style={{ border: 0, display: "block" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación SMC GROUP"
              />
              <div className="flex items-center justify-between bg-white px-4 py-3">
                <div>
                  <p className="text-xs font-bold text-[#0f172a]">
                    Gaviotas 132, Lima 15047
                  </p>
                  <p className="text-xs text-slate-400">Lima, Perú</p>
                </div>
                <a
                  href={mapsLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition hover:opacity-80"
                  style={{
                    background: "var(--primary)" + "12",
                    color: "var(--primary)",
                  }}
                >
                  Abrir en Maps →
                </a>
              </div>
            </div>

            {/* LinkedIn */}
            <div className="flex items-center gap-3">
              <p className="text-xs text-slate-400">Síguenos en</p>
              <a
                href="https://www.linkedin.com/company/smc-group"
                target="_blank"
                rel="noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-slate-400 shadow-sm transition hover:border-(--primary) hover:bg-(--primary) hover:text-white"
              >
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>

          {/* ══ COLUMNA DERECHA — Formulario ══ */}
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md">
            <div className="px-8 py-6" style={{ background: "var(--primary)" }}>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/60">
                Formulario de contacto
              </p>
              <h2 className="text-white! mt-1 text-2xl font-black uppercase">
                Solicitud de Cotización
              </h2>
              <p className="mt-1 text-sm text-white/70">
                Complete el formulario y un ingeniero se contactará en menos de
                24 horas hábiles.
              </p>
            </div>

            <div className="p-7 md:p-8">
              <form className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Juan Pérez"
                      className="w-full rounded-xl border border-gray-200 bg-[#f7f9fc] px-4 py-3 text-sm outline-none transition focus:border-(--primary) focus:bg-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Empresa
                    </label>
                    <input
                      type="text"
                      placeholder="Nombre de su organización"
                      className="w-full rounded-xl border border-gray-200 bg-[#f7f9fc] px-4 py-3 text-sm outline-none transition focus:border-(--primary) focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      placeholder="email@empresa.com"
                      className="w-full rounded-xl border border-gray-200 bg-[#f7f9fc] px-4 py-3 text-sm outline-none transition focus:border-(--primary) focus:bg-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Teléfono de Contacto
                    </label>
                    <input
                      type="text"
                      placeholder="+51 999 999 999"
                      className="w-full rounded-xl border border-gray-200 bg-[#f7f9fc] px-4 py-3 text-sm outline-none transition focus:border-(--primary) focus:bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Tipo de Proyecto
                  </label>
                  <select className="w-full rounded-xl border border-gray-200 bg-[#f7f9fc] px-4 py-3 text-sm text-slate-500 outline-none transition focus:border-(--primary) focus:bg-white">
                    <option value="">Selecciona una opción</option>
                    <option>Ingeniería estructural</option>
                    <option>Construcción industrial</option>
                    <option>Fabricación metalmecánica</option>
                    <option>Montaje industrial</option>
                    <option>Mantenimiento</option>
                    <option>Otro</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Descripción del Requerimiento
                  </label>
                  <textarea
                    placeholder="Cuéntenos sobre su proyecto, dimensiones, materiales o plazos estimados..."
                    rows={5}
                    className="w-full resize-none rounded-xl border border-gray-200 bg-[#f7f9fc] px-4 py-3 text-sm outline-none transition focus:border-(--primary) focus:bg-white"
                  />
                </div>

                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 accent-(--primary)"
                  />
                  <span className="text-sm text-slate-500">
                    Este proyecto es de carácter{" "}
                    <span
                      className="font-bold"
                      style={{ color: "var(--primary)" }}
                    >
                      urgente
                    </span>
                  </span>
                </label>

                <p className="text-xs text-slate-400">
                  Al enviar, usted acepta que nos comuniquemos para atender su
                  consulta.
                </p>

                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-3 rounded-xl py-4 text-sm font-black uppercase tracking-widest transition hover:opacity-90 hover:scale-[1.01] active:scale-[0.99]"
                  style={{ background: "var(--primary)", color: "white" }}
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                    />
                  </svg>
                  Enviar Solicitud de Cotización
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
