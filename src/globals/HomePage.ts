import type { GlobalConfig } from 'payload'

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Página de Inicio',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'heroTitle',
      type: 'text',
      label: 'Título principal',
      required: true,
      defaultValue:
        'Soluciones en ingeniería y construcción con enfoque técnico y resultados reales.',
    },
    {
      name: 'heroSubtitle',
      type: 'textarea',
      label: 'Subtítulo principal',
      required: true,
      defaultValue:
        'Presentamos nuestros servicios especializados y proyectos ejecutados con calidad, eficiencia y cumplimiento.',
    },
    {
      name: 'heroSlides',
      type: 'array',
      label: 'Slides del carrusel',
      minRows: 1,
      fields: [
        {
          name: 'mediaType',
          type: 'radio',
          label: 'Tipo de media',
          defaultValue: 'image',
          options: [
            { label: 'Imagen', value: 'image' },
            { label: 'Video', value: 'video' },
          ],
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Imagen',
          required: false,
          admin: {
            condition: (_, siblingData) => siblingData?.mediaType !== 'video',
          },
        },
        {
          name: 'video',
          type: 'upload',
          relationTo: 'media',
          label: 'Video (.mp4)',
          required: false,
          admin: {
            condition: (_, siblingData) => siblingData?.mediaType === 'video',
          },
        },
        {
          name: 'eyebrow',
          type: 'text',
          label: 'Texto superior',
          required: false,
        },
        {
          name: 'title',
          type: 'text',
          label: 'Título del slide',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Descripción del slide',
          required: false,
        },
        {
          name: 'buttonText',
          type: 'text',
          label: 'Texto del botón principal',
          required: false,
        },
        {
          name: 'buttonLink',
          type: 'text',
          label: 'Enlace del botón principal',
          required: false,
        },
        {
          name: 'secondButtonText',
          type: 'text',
          label: 'Texto del segundo botón',
          required: false,
        },
        {
          name: 'secondButtonLink',
          type: 'text',
          label: 'Enlace del segundo botón',
          required: false,
        },
        {
          name: 'isActive',
          type: 'checkbox',
          label: 'Activo',
          defaultValue: true,
        },
      ],
    },
    {
      name: 'stats',
      type: 'array',
      label: 'Estadísticas',
      minRows: 1,
      maxRows: 6,
      fields: [
        {
          name: 'value',
          type: 'text',
          label: 'Valor (ej: 10+, 100%)',
          required: true,
        },
        {
          name: 'label',
          type: 'text',
          label: 'Descripción (ej: Años de experiencia)',
          required: true,
        },
      ],
    },
    {
      name: 'highlights',
      type: 'array',
      label: 'Tarjetas de ventajas (sección ¿Por qué elegirnos?)',
      maxRows: 6,
      admin: {
        description: 'Aparecen debajo de los proyectos en la home. Máximo 6.',
      },
      defaultValue: [
        { title: 'Calidad Certificada',      description: 'Ejecutamos cada proyecto bajo estándares técnicos con control de calidad en cada etapa.' },
        { title: 'Ingeniería de Precisión',  description: 'Equipo técnico especializado con herramientas de última generación para resultados exactos.' },
        { title: 'Seguridad y Cumplimiento', description: 'Protocolos rigurosos de seguridad industrial y cumplimiento normativo en todos nuestros servicios.' },
      ],
      fields: [
        { name: 'title',       type: 'text',     label: 'Título',       required: true },
        { name: 'description', type: 'textarea', label: 'Descripción',  required: true },
      ],
    },
  ],
}