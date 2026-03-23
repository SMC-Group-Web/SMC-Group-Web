'use client'

import { useRef } from 'react'

type Client = {
  id: string | number
  name: string
  website?: string | null
  logo?: {
    url?: string | null
    alt?: string | null
  } | null
}

type Props = {
  clients: Client[]
}

export default function ClientsMarquee({ clients }: Props) {
  const trackRef = useRef<HTMLDivElement>(null)

  const doubled = [...clients, ...clients]

  return (
    <div className="relative w-full overflow-hidden">
      {/* Gradientes en los bordes */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-white to-transparent" />

      <div
        ref={trackRef}
        className="flex gap-8"
        style={{
          animation: 'marquee 18s linear infinite', // ← más rápido (era 30s)
          width: 'max-content',
        }}
      >
        {doubled.map((client, i) => (
          <div
            key={`${client.id}-${i}`}
            className="flex h-28 w-52 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-[var(--primary)] hover:shadow-md"
          >
            {client.logo?.url ? (
              client.website ? (
                <a
                  href={client.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-full w-full items-center justify-center"
                >
                  <img
                    src={client.logo.url}
                    alt={client.logo.alt || client.name}
                    className="max-h-16 max-w-full object-contain grayscale transition-all duration-300 hover:grayscale-0"
                  />
                </a>
              ) : (
                <img
                  src={client.logo.url}
                  alt={client.logo.alt || client.name}
                  className="max-h-16 max-w-full object-contain grayscale transition-all duration-300 hover:grayscale-0"
                />
              )
            ) : (
              <span className="text-sm font-semibold text-slate-400">{client.name}</span>
            )}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}