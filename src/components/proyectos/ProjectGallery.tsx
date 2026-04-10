"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

type MediaType = {
  id?: string | number;
  url?: string | null;
  alt?: string | null;
};

type Props = {
  images: MediaType[];
  captions: (string | null)[];
  title: string;
  isFeatured?: boolean | null;
};

export default function ProjectGallery({
  images,
  captions,
  title,
  isFeatured,
}: Props) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const prev = useCallback(() => {
    setCurrentIndex((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  const next = useCallback(() => {
    setCurrentIndex((i) => (i + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxOpen, prev, next]);

  useEffect(() => {
    document.body.style.overflow = lightboxOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxOpen]);

  if (images.length === 0) {
    return (
      <div className="flex h-56 w-full items-center justify-center bg-gray-100">
        <span className="text-sm text-gray-400">Sin imagen</span>
      </div>
    );
  }

  const currentCaption = captions[currentIndex] || images[currentIndex].alt;

  const lightbox = (
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/95 backdrop-blur-sm"
      onClick={closeLightbox}
    >
      <div
        className="relative flex h-full w-full max-w-5xl flex-col items-center justify-center px-16"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Contador */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur-sm">
          {currentIndex + 1} / {images.length}
        </div>

        {/* Cerrar */}
        <button
          onClick={closeLightbox}
          aria-label="Cerrar galería"
          className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition hover:bg-white/25"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* ✅ Imagen lightbox — next/image con fill */}
        <div className="relative max-h-[70vh] w-full flex items-center justify-center">
          <div className="relative w-full h-[70vh]">
            <Image
              src={images[currentIndex].url!}
              alt={currentCaption || title}
              fill
              sizes="100vw"
              className="object-contain rounded-xl shadow-2xl"
              priority
            />
          </div>
        </div>

        {/* Caption */}
        {currentCaption && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-white/10 px-5 py-2.5 backdrop-blur-sm">
            <svg
              className="h-4 w-4 shrink-0 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
              />
            </svg>
            <p className="text-sm text-white/90">{currentCaption}</p>
          </div>
        )}

        {/* Flechas */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Foto anterior"
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition hover:bg-white/25"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={next}
              aria-label="Siguiente foto"
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition hover:bg-white/25"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}

        {/* ✅ Miniaturas lightbox — next/image con fill */}
        {images.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 px-4 max-w-[90vw] overflow-x-auto scrollbar-none">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                  idx === currentIndex
                    ? "border-white opacity-100 scale-110"
                    : "border-white/20 opacity-50 hover:opacity-80"
                }`}
              >
                <Image
                  src={img.url!}
                  alt={captions[idx] || img.alt || `Foto ${idx + 1}`}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* ── IMAGEN PRINCIPAL ── */}
      <div
        className="relative h-56 w-full cursor-pointer overflow-hidden bg-gray-100"
        onClick={() => openLightbox(0)}
      >
        <Image
          src={images[0].url!}
          alt={captions[0] || images[0].alt || title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
          quality={90}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* ✅ Miniaturas esquina — next/image con fill */}
        {images.length > 1 && (
          <div className="absolute bottom-2 right-2 flex gap-1.5">
            {images.slice(1, 4).map((img, idx) => (
              <div
                key={idx}
                className="relative h-12 w-12 overflow-hidden rounded-lg border-2 border-white shadow-md"
                onClick={(e) => {
                  e.stopPropagation();
                  openLightbox(idx + 1);
                }}
              >
                <Image
                  src={img.url!}
                  alt={captions[idx + 1] || img.alt || `Foto ${idx + 2}`}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
            ))}
            {images.length > 4 && (
              <div
                className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-lg border-2 border-white bg-black/60 text-xs font-bold text-white shadow-md"
                onClick={(e) => {
                  e.stopPropagation();
                  openLightbox(4);
                }}
              >
                +{images.length - 4}
              </div>
            )}
          </div>
        )}

        {/* Badges */}
        <div className="absolute left-3 top-3 flex gap-2">
          {isFeatured && (
            <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white shadow">
              Destacado
            </span>
          )}
          {images.length > 1 && (
            <span className="rounded-full bg-black/50 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
              {images.length} fotos
            </span>
          )}
        </div>

        {/* Zoom hover */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/20 group-hover:opacity-100">
          <div className="rounded-full bg-black/50 p-3 backdrop-blur-sm">
            <svg
              className="h-6 w-6 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* ── LIGHTBOX PORTAL ── */}
      {mounted && lightboxOpen && createPortal(lightbox, document.body)}
    </>
  );
}
