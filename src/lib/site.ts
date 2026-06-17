export const siteConfig = {
  name: 'SMC GROUP',
  legalName: 'SMC GROUP Ingeniería y Construcción',
  description:
    'Empresa especializada en ingeniería, diseño y construcción de edificaciones en Lima, Perú. Comprometidos con la calidad, la eficiencia y la excelencia técnica.',
  website: 'https://smcgroupperu.com',
  email: 'pvalentin@smcgroupperu.com',
  phone: '+51 953 860 041',
  whatsappNumber: '51953860041',
  whatsappMessage:
    'Hola, deseo información sobre los servicios de SMC GROUP.',
  address: {
    street: 'Calle Las Gaviotas 122, Ofi. 401',
    district: 'Surquillo',
    city: 'Lima',
    country: 'Perú',
    postalCode: '15038',
    full: 'Calle Las Gaviotas 122, Ofi. 401, Surquillo, Lima, Perú',
  },
  coordinates: {
    lat: -12.103934967760534,
    lng: -77.02154060821528,
  },
  social: {
    instagram: 'https://www.instagram.com/smcgroupperu',
    facebook: 'https://www.facebook.com/smcgroupperu',
    linkedin: 'https://www.linkedin.com/company/smc-group-sac',
  },
  nav: [
    { label: 'Inicio', href: '/' },
    {
      label: 'Proyectos',
      href: '/proyectos',
      subItems: [
        { label: 'Ver sección en inicio', href: '/#proyectos' },
      ],
    },
    {
      label: 'Servicios',
      href: '/servicios',
      subItems: [
        { label: 'Ver sección en inicio', href: '/#servicios' },
      ],
    },
    { label: 'Quiénes somos', href: '/quienes-somos', isPage: true },
    { label: 'Contacto', href: '/contacto', isPage: true },
  ],
}