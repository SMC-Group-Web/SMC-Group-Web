import type { GlobalConfig } from 'payload'

export const ProyectosPage: GlobalConfig = {
  slug: 'proyectos-page',
  label: 'Página de Proyectos',
  access: {
    read: () => true,
    update: ({ req: { user } }) => user?.role === 'admin',
  },
  admin: {
    hidden: ({ user }) => user?.role !== 'admin',
  },
  fields: [
    {
      name: 'heroStats',
      type: 'array',
      label: 'Estadísticas del hero',
      maxRows: 4,
      admin: { description: 'Cifras que aparecen en el hero de la página de proyectos' },
      defaultValue: [
        { value: '200+', label: 'Proyectos realizados' },
        { value: '10+',  label: 'Años de experiencia' },
        { value: '100%', label: 'Compromiso con calidad' },
      ],
      fields: [
        { name: 'value', type: 'text', label: 'Valor (ej: 200+, 10+)', required: true },
        { name: 'label', type: 'text', label: 'Descripción',            required: true },
      ],
    },
  ],
}
