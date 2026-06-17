import type { CollectionConfig } from 'payload'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'year', 'client', 'isFeatured', 'isActive', 'updatedAt'],
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
    {
      name: 'projectType',
      type: 'select',
      label: 'Tipo de proyecto',
      required: false,
      defaultValue: 'construccion-comercial',
      options: [
        { label: 'Construcción Comercial', value: 'construccion-comercial' },
        { label: 'Obra Civil',             value: 'obra-civil' },
        { label: 'Mantenimiento',          value: 'mantenimiento' },
        { label: 'Instalaciones Eléctricas', value: 'instalaciones-electricas' },
        { label: 'Instalaciones Mecánicas',  value: 'instalaciones-mecanicas' },
        { label: 'Instalaciones Sanitarias', value: 'instalaciones-sanitarias' },
        { label: 'Estructuras Metálicas',    value: 'estructuras-metalicas' },
      ],
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
    {
      name: 'seo',
      type: 'group',
      label: '🔍 SEO',
      admin: { description: 'Controla cómo aparece esta página en Google' },
      fields: [
        { name: 'titulo',      type: 'text',     label: 'Título para Google (máx. 60 caracteres)' },
        { name: 'descripcion', type: 'textarea', label: 'Descripción para Google (máx. 160 caracteres)' },
        { name: 'imagen',      type: 'upload',   relationTo: 'media', label: 'Imagen para redes sociales (1200×630px)' },
        { name: 'noIndex',     type: 'checkbox', label: 'Ocultar de Google', defaultValue: false },
      ],
    },
  ],
}