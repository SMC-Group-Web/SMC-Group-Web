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
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Imagen',
          required: true,
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
  ],
}