import Link from 'next/link'
import type { Metadata } from 'next'
import { siteConfig } from '@/lib/site'

export const metadata: Metadata = {
  title: 'En mantenimiento | SMC GROUP',
  robots: { index: false, follow: false },
}

export default function MantenimientoPage() {
  const waUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(siteConfig.whatsappMessage)}`

  return (
    <main className="fondo-bg relative flex min-h-screen flex-col items-center justify-center px-6 py-24">
      {/* Overlay semitransparente — deja respirar el fondo */}
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 flex max-w-lg flex-col items-center gap-10 text-center">
        {/* Texto principal */}
        <div className="flex flex-col gap-4">
          <h1
            className="text-7xl font-black uppercase leading-none tracking-tight text-white md:text-9xl"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            EN OBRA.
          </h1>
          <p
            className="mt-2 text-lg text-white/70 md:text-xl"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Estamos trabajando para traerte algo mejor.{' '}
            <br className="hidden sm:block" />
            Volvemos pronto.
          </p>
          <p
            className="text-sm text-white/45"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Mientras tanto, escríbenos directamente.
          </p>
        </div>

        {/* CTA WhatsApp */}
        <Link
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex animate-bounce items-center gap-3 rounded-2xl px-8 py-4 text-base font-bold text-white shadow-lg shadow-black/30 transition-[opacity,transform] hover:opacity-90 active:scale-95"
          style={{ background: '#25D366' }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5 shrink-0"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.116 1.527 5.845L.057 23.882l6.184-1.622A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.8 9.8 0 01-5.002-1.366l-.36-.213-3.67.963.979-3.58-.234-.369A9.818 9.818 0 1112 21.818z" />
          </svg>
          Escríbenos por WhatsApp
        </Link>
      </div>
    </main>
  )
}
