import type { GlobalConfig } from 'payload'

export const ContactPage: GlobalConfig = {
  slug: 'contact-page',
  label: 'Contacto',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Título principal',
      required: true,
      defaultValue: 'Contáctanos',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Subtítulo',
      required: true,
      defaultValue:
        'Estamos listos para ayudarte con tu próximo proyecto de ingeniería y construcción.',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Descripción',
      required: false,
      defaultValue:
        'Completa el formulario o comunícate directamente por nuestros canales de atención.',
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Teléfono',
      required: false,
    },
    {
      name: 'email',
      type: 'text',
      label: 'Correo',
      required: false,
    },
    {
      name: 'address',
      type: 'textarea',
      label: 'Dirección',
      required: false,
    },
    {
      name: 'schedule',
      type: 'text',
      label: 'Horario',
      required: false,
    },
    {
      name: 'whatsappNumber',
      type: 'text',
      label: 'Número de WhatsApp',
      required: false,
    },
    {
      name: 'whatsappMessage',
      type: 'textarea',
      label: 'Mensaje predeterminado de WhatsApp',
      required: false,
      defaultValue: 'Hola, deseo más información sobre los servicios de SMC GROUP.',
    },
    {
      name: 'infoCards',
      type: 'array',
      label: 'Tarjetas informativas',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Título',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Descripción',
          required: true,
        },
      ],
    },
  ],
}