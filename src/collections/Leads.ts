import type { CollectionConfig } from 'payload'

export const Leads: CollectionConfig = {
  slug: 'leads',
  labels: {
    singular: 'Solicitud',
    plural: 'Solicitudes',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'projectType', 'status', 'createdAt'],
    group: 'Ventas',
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: () => true,
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nombre completo',
    },
    {
      name: 'company',
      type: 'text',
      label: 'Empresa',
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      label: 'Correo electrónico',
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Teléfono',
    },
    {
      name: 'projectType',
      type: 'select',
      label: 'Tipo de proyecto',
      options: [
        'Ingeniería estructural',
        'Construcción industrial',
        'Fabricación metalmecánica',
        'Montaje industrial',
        'Mantenimiento',
        'Otro',
      ],
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Descripción del requerimiento',
    },
    {
      name: 'urgent',
      type: 'checkbox',
      label: 'Proyecto urgente',
      defaultValue: false,
    },
    {
      name: 'status',
      type: 'select',
      label: 'Estado',
      defaultValue: 'nuevo',
      options: [
        { label: 'Nuevo', value: 'nuevo' },
        { label: 'En contacto', value: 'en_contacto' },
        { label: 'Cotizado', value: 'cotizado' },
        { label: 'Cerrado', value: 'cerrado' },
        { label: 'Descartado', value: 'descartado' },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Notas internas',
      admin: {
        description: 'Notas del equipo de ventas, no visibles para el cliente',
      },
    },
  ],
}
