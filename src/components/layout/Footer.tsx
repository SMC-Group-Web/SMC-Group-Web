import { siteConfig } from '@/lib/site'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-[var(--border)] bg-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-10 md:px-10 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <h3 className="text-lg font-bold">SMC GROUP</h3>
          <p className="max-w-xl text-sm leading-6 text-[var(--muted)]">
            Soluciones en ingeniería y construcción con enfoque técnico, calidad,
            eficiencia y cumplimiento.
          </p>
        </div>

        <div className="space-y-2 text-sm text-[var(--muted)] lg:text-right">
          <p>{siteConfig.website}</p>
          <p>© {year} SMC GROUP. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}