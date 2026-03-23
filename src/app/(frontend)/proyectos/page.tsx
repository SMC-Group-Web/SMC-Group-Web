import config from '@payload-config'
import { getPayload } from 'payload'
import ProjectGallery from '@/components/proyectos/ProjectGallery'

type MediaType = {
  id: string | number
  url?: string | null
  alt?: string | null
  filename?: string | null
}

type GalleryItem = {
  image?: MediaType | number | null
  caption?: string | null
  id?: string | null
}

export default async function ProyectosPage() {
  const payload = await getPayload({ config })

  const projects = await payload.find({
    collection: 'projects',
    where: { isActive: { equals: true } },
    sort: '-isFeatured,order',
    limit: 100,
    depth: 2,
  })

  return (
    <main className="min-h-screen bg-white text-[#0f172a] pt-[var(--header-height)]">

      <section className="mx-auto w-full max-w-7xl px-6 py-16 md:px-10">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-[var(--primary)]">
          Proyectos
        </p>
        <h1 className="text-4xl font-bold md:text-5xl">Proyectos ejecutados</h1>
        <p className="mt-4 max-w-3xl text-slate-500">
          Conoce los proyectos desarrollados por SMC GROUP en el ámbito de
          ingeniería y construcción.
        </p>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 pb-24 md:px-10">
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
                project.coverImage && typeof project.coverImage === 'object'
                  ? (project.coverImage as MediaType)
                  : null

              const galleryItems = ((project.gallery || []) as GalleryItem[])
                .filter((item) => item.image && typeof item.image === 'object')
                .map((item) => ({
                  image: item.image as MediaType,
                  caption: item.caption ?? null,
                }))

              // Cover + galería sin duplicados
              const allItems = [
                ...(cover ? [{ image: cover, caption: null }] : []),
                ...galleryItems.filter((g) => g.image.url !== cover?.url),
              ]

              const allImages = allItems.map((i) => i.image)
              const allCaptions = allItems.map((i) => i.caption)

              return (
                <article
                  key={project.id}
                  className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--primary)] hover:shadow-[0_20px_40px_rgba(37,99,235,0.12)]"
                >
                  <ProjectGallery
                    images={allImages}
                    captions={allCaptions}
                    title={project.title}
                    isFeatured={project.isFeatured}
                  />

                  <div className="p-6">
                    <h2 className="mb-2 text-xl font-bold text-[#0f172a]">
                      {project.title}
                    </h2>
                    <p className="mb-2 text-sm leading-6 text-slate-500">
                      {project.summary}
                    </p>

                    {project.description && (
                      <p className="mb-4 text-sm leading-6 text-slate-400 border-l-2 border-[var(--primary)] pl-3 mt-2">
                        {project.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 border-t border-gray-100 pt-4 text-xs text-slate-400">
                      {project.client && (
                        <span>Cliente: <span className="font-semibold text-slate-600">{project.client}</span></span>
                      )}
                      {project.location && (
                        <span>Ubicación: <span className="font-semibold text-slate-600">{project.location}</span></span>
                      )}
                      {project.year && (
                        <span>Año: <span className="font-semibold text-slate-600">{project.year}</span></span>
                      )}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>
    </main>
  )
}