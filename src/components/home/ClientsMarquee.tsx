"use client";

import { useRef } from "react";
import Image from "next/image";

type Client = {
  id: string | number;
  name: string;
  website?: string | null;
  logo?: {
    url?: string | null;
    alt?: string | null;
  } | null;
};

type Props = {
  clients: Client[];
};

export default function ClientsMarquee({ clients }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);

  const doubled = [...clients, ...clients];

  return (
    <div className="relative w-full overflow-hidden">
      {/* Gradientes en los bordes */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-8 bg-linear-to-r from-white to-transparent sm:w-16 md:w-24" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-8 bg-linear-to-l from-white to-transparent sm:w-16 md:w-24" />

      <div
        ref={trackRef}
        className="marquee-track flex gap-8"
        style={{
          animation: "marquee 18s linear infinite",
          width: "max-content",
        }}
        onMouseEnter={() => { if (trackRef.current) trackRef.current.style.animationPlayState = 'paused'; }}
        onMouseLeave={() => { if (trackRef.current) trackRef.current.style.animationPlayState = 'running'; }}
      >
        {doubled.map((client, i) => (
          <div
            key={`${client.id}-${i}`}
            className="flex h-44 w-80 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-(--primary) hover:shadow-md"
          >
            {client.logo?.url ? (
              client.website ? (
                <a
                  href={client.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-full w-full items-center justify-center"
                >
                  <Image
                    src={client.logo.url}
                    alt={client.logo.alt || client.name}
                    width={160}
                    height={80}
                    loading="lazy"
                    className="max-h-24 max-w-full object-contain"
                  />
                </a>
              ) : (
                <Image
                  src={client.logo.url}
                  alt={client.logo.alt || client.name}
                  width={160}
                  height={80}
                  loading="lazy"
                  className="max-h-24 max-w-full object-contain"
                />
              )
            ) : (
              <span className="text-sm font-semibold text-slate-400">
                {client.name}
              </span>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}
