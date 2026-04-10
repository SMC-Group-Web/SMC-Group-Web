import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'alt',
  },
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/*', 'video/mp4', 'video/webm', 'video/ogg', 'application/pdf'],
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 1200,   // antes: 768 — actualizado para evitar pixelado en contenedores grandes
        height: 800,   // antes: 512
        position: 'centre',
      },
      {
        name: 'hero',
        width: 1920,   // antes: 1280 — actualizado para pantallas retina y full-width
        height: 1080,  // antes: 720
        position: 'centre',
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: 'Texto alternativo (describe la imagen para Google y accesibilidad)',
    },
    {
      name: 'description',
      type: 'text',
      required: false,
      label: 'Descripción del archivo (opcional)',
    },
  ],
}