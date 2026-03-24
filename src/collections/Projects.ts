import type { CollectionConfig } from 'payload'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'year', 'client', 'isFeatured', 'isActive', 'updatedAt'],
  },
  access: {
    read: () => true,
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
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagen de portada',
      required: false,
    },
    {
      name: 'coverCaption',
      type: 'text',
      label: 'Descripción de la imagen de portada',
      required: false,
      admin: {
        description: 'Ej: Vista frontal del proyecto terminado',
      },
    },
    {
      name: 'gallery',
      type: 'array',
      label: 'Galería',
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
          label: 'Descripción de la foto',
          required: false,
          admin: {
            description: 'Ej: Instalación de estructura metálica - Planta Lima Norte',
          },
        },
      ],
    },
    {
      name: 'client',
      type: 'text',
      label: 'Cliente',
      required: false,
    },
    {
      name: 'location',
      type: 'text',
      label: 'Ubicación',
      required: false,
    },
    {
      name: 'year',
      type: 'number',
      label: 'Año',
      required: false,
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
  ],
}