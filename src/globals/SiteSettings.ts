import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Configuración del Sitio',
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'maintenanceMode',
      type: 'checkbox',
      label: 'Modo Mantenimiento',
      defaultValue: false,
      admin: {
        description:
          'Activa esta opción para mostrar la página de mantenimiento a los visitantes mientras realizas cambios. Desactívala cuando termines.',
      },
    },
  ],
}
