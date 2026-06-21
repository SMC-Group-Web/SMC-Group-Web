import type { CollectionConfig } from 'payload'

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'order', 'isActive', 'updatedAt'],
    hidden: ({ user }) => user?.role !== 'admin',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Título',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug',
      required: true,
      unique: true,
    },
    // 🆕 Eyebrow de la card (ej: INGENIERÍA, MONTAJE)
    {
      name: 'category',
      type: 'text',
      label: 'Categoría',
      required: false,
      admin: {
        description: 'Texto superior de la card. Ej: INGENIERÍA, CONSTRUCCIÓN, MONTAJE',
      },
    },
    {
      name: 'summary',
      type: 'textarea',
      label: 'Resumen corto',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Descripción',
      required: true,
    },
    // 🆕 Bullets del servicio
    {
      name: 'features',
      type: 'array',
      label: 'Características',
      maxRows: 6,
      admin: {
        description: 'Lista de características que aparecen en la card',
      },
      fields: [
        {
          name: 'text',
          type: 'text',
          label: 'Característica',
          required: true,
        },
      ],
    },
    // 🆕 Link del botón CTA
    {
      name: 'ctaLink',
      type: 'text',
      label: 'Link del botón',
      required: false,
      defaultValue: '/contacto',
      admin: {
        description: 'Ej: /contacto o /servicios/ingenieria',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagen principal',
      required: false,
    },
    {
      name: 'gallery',
      type: 'array',
      label: 'Galería de imágenes',
      required: false,
      admin: {
        description: 'Fotos adicionales que aparecen debajo del hero en la página del servicio',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Imagen',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
          label: 'Descripción (opcional)',
          required: false,
        },
      ],
    },
    {
      name: 'order',
      type: 'number',
      label: 'Orden',
      defaultValue: 1,
      required: true,
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      label: 'Destacado',
      defaultValue: false,
    },
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Activo',
      defaultValue: true,
    },
    {
      name: 'seo',
      type: 'group',
      label: '🔍 SEO',
      admin: { description: 'Controla cómo aparece esta página en Google' },
      fields: [
        { name: 'titulo', type: 'text', label: 'Título para Google (máx. 60 caracteres)' },
        { name: 'descripcion', type: 'textarea', label: 'Descripción para Google (máx. 160 caracteres)' },
        { name: 'imagen', type: 'upload', relationTo: 'media', label: 'Imagen para redes sociales (1200×630px)' },
        { name: 'noIndex', type: 'checkbox', label: 'Ocultar de Google', defaultValue: false },
      ],
    },
  ],
}