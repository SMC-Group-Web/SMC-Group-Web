import type { GlobalConfig } from 'payload'

export const ServiciosPage: GlobalConfig = {
  slug: 'servicios-page',
  label: 'Página de Servicios',
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
      admin: { description: 'Cifras que aparecen en el hero de la página de servicios' },
      defaultValue: [
        { value: '10+',  label: 'Años de experiencia' },
        { value: '100%', label: 'Calidad garantizada' },
        { value: '50+',  label: 'Clientes satisfechos' },
      ],
      fields: [
        { name: 'value', type: 'text', label: 'Valor (ej: 10+, 100%)', required: true },
        { name: 'label', type: 'text', label: 'Descripción',           required: true },
      ],
    },
  ],
}
