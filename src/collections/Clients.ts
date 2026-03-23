import type { CollectionConfig } from 'payload'

export const Clients: CollectionConfig = {
  slug: 'clients',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'order', 'isActive', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Nombre del cliente',
      required: true,
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo',
      required: true,
    },
    {
      name: 'website',
      type: 'text',
      label: 'Sitio web',
      required: false,
      admin: {
        description: 'Ej: https://www.cliente.com',
      },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Orden',
      defaultValue: 1,
      required: true,
    },
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Activo',
      defaultValue: true,
    },
  ],
}