import config from "@payload-config";
import { getPayload } from "payload";
import ProjectGallery from "@/components/proyectos/ProjectGallery";

type MediaType = {
  id: string | number;
  url?: string | null;
  alt?: string | null;
  filename?: string | null;
};

type GalleryItem = {
  image?: MediaType | number | null;
  caption?: string | null;
  id?: string | null;
};

export default async function ProyectosPage() {
  const payload = await getPayload({ config });

  const projects = await payload.find({
    collection: "projects",
    where: { isActive: { equals: true } },
    sort: "-isFeatured,order",
    limit: 100,
    depth: 2,
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
              SMC GROUP — Proyectos
            </span>

            {/* Título */}
            <h1 className="text-white! mt-2 text-4xl font-black uppercase leading-tight tracking-tight md:text-6xl">
              Nuestros{" "}
              <span style={{ color: "var(--primary)" }}>Proyectos</span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-white/60">
              Obras ejecutadas con precisión técnica, calidad y cumplimiento.
              Cada proyecto refleja el compromiso de SMC GROUP con la
              excelencia.
            </p>

            {/* Stats */}
            <div className="mt-8 flex flex-wrap gap-8 border-t border-white/10 pt-8">
              {[
                { value: "200+", label: "Proyectos realizados" },
                { value: "10+", label: "Años de experiencia" },
                { value: "100%", label: "Compromiso con calidad" },
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

      {/* ── GRID DE PROYECTOS ── */}
      <section className="mx-auto w-full max-w-7xl px-6 py-14 pb-24 md:px-10">
        {projects.docs.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <p className="text-slate-500">
              Aún no hay proyectos activos registrados en el panel.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {projects.docs.map((project) => {
              const cover =
                project.coverImage && typeof project.coverImage === "object"
                  ? (project.coverImage as MediaType)
                  : null;

              const galleryItems = ((project.gallery || []) as GalleryItem[])
                .filter((item) => item.image && typeof item.image === "object")
                .map((item) => ({
                  image: item.image as MediaType,
                  caption: item.caption ?? null,
                }));

              const allItems = [
                ...(cover
                  ? [
                      {
                        image: cover,
                        caption: (project.coverCaption as string) ?? null,
                      },
                    ]
                  : []),
                ...galleryItems,
              ];

              const allImages = allItems.map((i) => i.image);
              const allCaptions = allItems.map((i) => i.caption);

              return (
                <article
                  key={project.id}
                  className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_24px_48px_rgba(47,86,201,0.15)]"
                >
                  <ProjectGallery
                    images={allImages}
                    captions={allCaptions}
                    title={project.title}
                    isFeatured={project.isFeatured}
                  />

                  <div className="p-6">
                    <p
                      className="mb-2 text-xs font-bold uppercase tracking-[0.25em]"
                      style={{ color: "var(--primary)" }}
                    >
                      Proyecto
                    </p>

                    <h2 className="mb-2 text-xl font-bold text-[#0f172a]">
                      {project.title}
                    </h2>

                    <p className="mb-2 text-sm leading-6 text-slate-500">
                      {project.summary}
                    </p>

                    {project.description && (
                      <p
                        className="mb-4 mt-2 border-l-2 pl-3 text-sm leading-6 text-slate-400"
                        style={{ borderColor: "var(--primary)" }}
                      >
                        {project.description}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-x-4 gap-y-1 border-t border-gray-100 pt-4 text-xs text-slate-400">
                      {project.client && (
                        <span>
                          Cliente:{" "}
                          <span className="font-semibold text-slate-600">
                            {project.client}
                          </span>
                        </span>
                      )}
                      {project.location && (
                        <span>
                          Ubicación:{" "}
                          <span className="font-semibold text-slate-600">
                            {project.location}
                          </span>
                        </span>
                      )}
                      {project.year && (
                        <span>
                          Año:{" "}
                          <span className="font-semibold text-slate-600">
                            {project.year}
                          </span>
                        </span>
                      )}
                    </div>
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
