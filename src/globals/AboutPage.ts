import type { GlobalConfig } from 'payload'

export const AboutPage: GlobalConfig = {
  slug: 'about-page',
  label: 'Quiénes somos',
  access: {
    read: () => true,
    update: ({ req: { user } }) => user?.role === 'admin',
  },
  admin: {
    hidden: ({ user }) => user?.role !== 'admin',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Título principal',
      required: true,
      defaultValue: 'Quiénes somos',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Subtítulo',
      required: true,
      defaultValue:
        'SMC GROUP es una empresa orientada al desarrollo de soluciones en ingeniería y construcción con enfoque en calidad, eficiencia y cumplimiento.',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Descripción principal',
      required: true,
      defaultValue:
        'Trabajamos con un enfoque técnico y profesional para desarrollar proyectos de alto nivel, priorizando la normativa, la sostenibilidad, la seguridad y la satisfacción del cliente.',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagen principal',
      required: false,
    },
    {
      name: 'strengths',
      type: 'array',
      label: 'Fortalezas',
      fields: [
        { name: 'title',       type: 'text',     label: 'Título',      required: true },
        { name: 'description', type: 'textarea', label: 'Descripción', required: true },
      ],
    },
    {
      name: 'values',
      type: 'array',
      label: 'Valores de la empresa (badges)',
      maxRows: 10,
      admin: {
        description: 'Etiquetas de valores que aparecen debajo del texto principal. Ej: Calidad, Precisión, Compromiso.',
      },
      defaultValue: [
        { label: 'Calidad' },
        { label: 'Precisión' },
        { label: 'Compromiso' },
        { label: 'Innovación' },
        { label: 'Seguridad' },
      ],
      fields: [
        { name: 'label', type: 'text', label: 'Valor', required: true },
      ],
    },
  ],
}