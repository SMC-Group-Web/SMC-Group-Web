/**
 * SEED SCRIPT — SMC GROUP
 * Pobla globals y colecciones con los datos del brochure 2026.
 *
 * Ejecutar: pnpm seed
 * (requiere que la DB ya tenga las migraciones aplicadas)
 */

import config from '@payload-config'
import { getPayload } from 'payload'

async function seed() {
  const payload = await getPayload({ config })

  console.log('🌱 Iniciando seed SMC GROUP...')

  // ─────────────────────────────────────────────────────────────
  // 1. ABOUT PAGE
  // ─────────────────────────────────────────────────────────────
  console.log('📄 Actualizando about-page...')
  await payload.updateGlobal({
    slug: 'about-page',
    data: {
      title: 'SMC GROUP — Ingeniería y Construcción',
      subtitle:
        'En SMC GROUP brindamos soluciones integrales en ingeniería, diseño y construcción de edificaciones. Nuestro valor principal es el conocimiento técnico y la experiencia de nuestro equipo multidisciplinario, lo que nos permite abordar cada proyecto con visión estratégica, compromiso y altos estándares de calidad.',
      description:
        'Cada obra que desarrollamos es reflejo de nuestra eficiencia operativa, capacidad de gestión y orientación al detalle técnico. Construimos con visión, calidad y compromiso para dejar huella en cada proyecto.',
      strengths: [
        {
          title: 'Precisión en la Ejecución',
          description:
            'Ejecutamos la ingeniería en base a planos, especificaciones y normativas, asegurando que cada componente (estructural, eléctrico, sanitario o mecánico) se construya o instale de forma precisa, garantizando funcionalidad, seguridad y durabilidad.',
        },
        {
          title: 'Intervenciones Correctivas',
          description:
            'Hacemos mantenimiento preventivo y correctivo sobre infraestructura, sistemas y equipos, reduciendo tiempos muertos, alargando la vida útil de los activos y minimizando riesgos operativos.',
        },
        {
          title: 'Coordinación Multidisciplinaria',
          description:
            'Aplicamos gestión integrada entre áreas técnicas, proveedores y operarios, asegurando cumplimiento de plazos, uso eficiente de recursos y adaptación a los entornos operativos del cliente.',
        },
        {
          title: 'Experiencia Técnica',
          description:
            'Más de 10 años ejecutando proyectos de ingeniería y construcción en Lima y el interior del país, con un equipo multidisciplinario capacitado en los más altos estándares del sector.',
        },
      ],
      values: [
        { label: 'Calidad' },
        { label: 'Precisión' },
        { label: 'Compromiso' },
        { label: 'Eficiencia' },
        { label: 'Seguridad' },
        { label: 'Sostenibilidad' },
      ],
    },
  })

  // ─────────────────────────────────────────────────────────────
  // 2. HOME PAGE
  // ─────────────────────────────────────────────────────────────
  console.log('🏠 Actualizando home-page...')
  await payload.updateGlobal({
    slug: 'home-page',
    data: {
      heroTitle: 'Ingeniería y Construcción con propósito.',
      heroSubtitle:
        'Construimos con visión, técnica y compromiso para dejar huella en cada proyecto. Obras que generan valor real.',
      stats: [
        { value: '10+',  label: 'Años de experiencia' },
        { value: '200+', label: 'Proyectos ejecutados' },
        { value: '50+',  label: 'Clientes satisfechos' },
        { value: '100%', label: 'Compromiso con calidad' },
      ],

    },
  })

  // ─────────────────────────────────────────────────────────────
  // 3. SERVICIOS PAGE
  // ─────────────────────────────────────────────────────────────
  console.log('🔧 Actualizando servicios-page...')
  await payload.updateGlobal({
    slug: 'servicios-page',
    data: {
      heroStats: [
        { value: '10+',  label: 'Años de experiencia' },
        { value: '5',    label: 'Servicios especializados' },
        { value: '100%', label: 'Calidad garantizada' },
        { value: '50+',  label: 'Clientes satisfechos' },
      ],
    },
  })

  // ─────────────────────────────────────────────────────────────
  // 4. PROYECTOS PAGE
  // ─────────────────────────────────────────────────────────────
  console.log('🏗️ Actualizando proyectos-page...')
  await payload.updateGlobal({
    slug: 'proyectos-page',
    data: {
      heroStats: [
        { value: '200+', label: 'Proyectos realizados' },
        { value: '10+',  label: 'Años de experiencia' },
        { value: '50+',  label: 'Clientes atendidos' },
        { value: '100%', label: 'Compromiso con calidad' },
      ],
    },
  })

  // ─────────────────────────────────────────────────────────────
  // 5. SERVICES COLLECTION
  // ─────────────────────────────────────────────────────────────
  console.log('🔩 Creando servicios...')

  const servicios = [
    {
      title: 'Construcción',
      slug: 'construccion',
      category: 'CONSTRUCCIÓN',
      summary:
        'Gestionamos y ejecutamos proyectos de construcción con eficiencia, garantizando entregas dentro del plazo y presupuesto establecidos, sin comprometer la calidad ni la seguridad.',
      description:
        'Obra civil, estructuras y arquitectura: concreto simple y armado, estructuras metálicas, mampostería, drywall, acabados y carpintería.',
      features: [
        { text: 'Estructura de concreto simple y armado' },
        { text: 'Estructuras metálicas' },
        { text: 'Mampostería y drywall (muros, falso cielo y techo)' },
        { text: 'Acabados en piso y pintura' },
        { text: 'Carpintería de madera y metálica' },
      ],
      color: '#2563EB',
      ctaLink: '/contacto',
      order: 1,
      isFeatured: true,
      isActive: true,
    },
    {
      title: 'Consultoría',
      slug: 'consultoria',
      category: 'CONSULTORÍA',
      summary:
        'Ofrecemos asesoría especializada durante todas las etapas del proyecto, asegurando decisiones técnicas acertadas y una planificación alineada a los objetivos del cliente.',
      description:
        'Acompañamos desde la etapa de diseño hasta la entrega final, asegurando que cada decisión técnica responda a los objetivos y normativas aplicables.',
      features: [
        { text: 'Asesoría técnica especializada en todas las etapas' },
        { text: 'Planificación estratégica del proyecto' },
        { text: 'Gestión de expedientes y permisos' },
        { text: 'Supervisión de obra y control de calidad' },
        { text: 'Optimización de costos y plazos' },
      ],
      color: '#059669',
      ctaLink: '/contacto',
      order: 2,
      isFeatured: true,
      isActive: true,
    },
    {
      title: 'Estudios Complementarios',
      slug: 'estudios',
      category: 'ESTUDIOS TÉCNICOS',
      summary:
        'Realizamos estudios técnicos que respaldan la viabilidad y correcta ejecución de cada proyecto, asegurando decisiones seguras, eficientes y alineadas a los objetivos del cliente.',
      description:
        'Estudios de suelos, topografía, impacto ambiental y otros estudios complementarios que garantizan la viabilidad y seguridad del proyecto antes de iniciar la ejecución.',
      features: [
        { text: 'Estudios de suelos y topografía' },
        { text: 'Estudios de impacto ambiental' },
        { text: 'Análisis estructural y cálculo sísmico' },
        { text: 'Memorias descriptivas y especificaciones técnicas' },
        { text: 'Evaluación de riesgos y viabilidad técnica' },
      ],
      color: '#D97706',
      ctaLink: '/contacto',
      order: 3,
      isFeatured: false,
      isActive: true,
    },
    {
      title: 'Mantenimiento',
      slug: 'mantenimiento',
      category: 'MANTENIMIENTO',
      summary:
        'Brindamos mantenimiento preventivo y correctivo para edificaciones, garantizando el óptimo funcionamiento de las instalaciones y prolongando su vida útil.',
      description:
        'Intervenciones preventivas y correctivas sobre infraestructura, sistemas eléctricos, sanitarios y mecánicos para reducir tiempos muertos y alargar la vida útil de los activos.',
      features: [
        { text: 'Instalaciones eléctricas (media, baja y tensión)' },
        { text: 'Corrientes débiles (data, CCTV, audio y control de accesos)' },
        { text: 'Detección de incendios e instalaciones sanitarias' },
        { text: 'Agua contra incendio' },
        { text: 'Instalaciones mecánicas (extracción de CO, A/C, ventilación)' },
        { text: 'Mantenimiento preventivo y correctivo de arquitectura' },
      ],
      color: '#EA580C',
      ctaLink: '/contacto',
      order: 4,
      isFeatured: false,
      isActive: true,
    },
    {
      title: 'Servicios Sostenibles',
      slug: 'sostenibles',
      category: 'SOSTENIBILIDAD',
      summary:
        'Implementamos soluciones constructivas que integran prácticas responsables con el medio ambiente, apostando por un desarrollo sostenible y consciente en cada obra.',
      description:
        'Incorporamos criterios de sostenibilidad en el diseño y ejecución de cada proyecto, desde la selección de materiales hasta los sistemas de eficiencia energética e hídrica.',
      features: [
        { text: 'Sistemas de eficiencia energética' },
        { text: 'Gestión responsable de residuos de construcción' },
        { text: 'Materiales eco-amigables y de bajo impacto' },
        { text: 'Sistemas de iluminación LED y automatización' },
        { text: 'Soluciones de agua y drenaje sostenible' },
      ],
      color: '#16A34A',
      ctaLink: '/contacto',
      order: 5,
      isFeatured: false,
      isActive: true,
    },
  ]

  for (const servicio of servicios) {
    const existing = await payload.find({
      collection: 'services',
      where: { slug: { equals: servicio.slug } },
      limit: 1,
    })
    if (existing.docs.length > 0) {
      await payload.update({
        collection: 'services',
        id: existing.docs[0].id,
        data: servicio,
      })
      console.log(`  ✅ Servicio actualizado: ${servicio.title}`)
    } else {
      await payload.create({ collection: 'services', data: servicio })
      console.log(`  ✅ Servicio creado: ${servicio.title}`)
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 6. PROJECTS COLLECTION
  // ─────────────────────────────────────────────────────────────
  console.log('🏛️ Creando proyectos...')

  const proyectos = [
    // 2025 — destacados primero
    {
      title: 'Bio Ritmo Cenco La Molina',
      slug: 'bio-ritmo-cenco-la-molina',
      projectType: 'construccion-comercial',
      summary: 'Implementación de gimnasio Bio Ritmo en C.C Cenco La Molina.',
      description: 'Proyecto de implementación integral de 1,500 m² ejecutado en 2.5 meses, incluyendo obra civil, instalaciones y acabados.',
      client: 'Bio Ritmo',
      location: 'La Molina, Lima',
      year: 2025,
      order: 1,
      isFeatured: true,
      isActive: true,
    },
    {
      title: 'Smart Fit Huacho',
      slug: 'smart-fit-huacho',
      projectType: 'construccion-comercial',
      summary: 'Implementación total de gimnasio Smart Fit en Centro Comercial Plaza Sol Huacho.',
      description: 'Ejecución integral de 1,000 m² en 2 meses. Incluye obra civil, instalaciones eléctricas, mecánicas y acabados.',
      client: 'Smart Fit',
      location: 'Huacho, Lima',
      year: 2025,
      order: 2,
      isFeatured: true,
      isActive: true,
    },
    {
      title: 'Smart Fit Trujillo',
      slug: 'smart-fit-trujillo',
      projectType: 'construccion-comercial',
      summary: 'Implementación total de gimnasio Smart Fit en Centro Comercial Pizarro Trujillo.',
      description: 'Implementación de 800 m² en 2 meses en el C.C. Pizarro de Trujillo, con todas las especialidades de ingeniería.',
      client: 'Smart Fit',
      location: 'Trujillo, La Libertad',
      year: 2025,
      order: 3,
      isFeatured: true,
      isActive: true,
    },
    {
      title: 'Tai Loy Cavenecia — Remodelación',
      slug: 'tai-loy-cavenecia-remodelacion',
      projectType: 'construccion-comercial',
      summary: 'Remodelación total de tienda Tai Loy Canevenicia.',
      description: 'Remodelación integral de 900 m² en 2 meses, incluyendo drywall, acabados, instalaciones y carpintería.',
      client: 'Tai Loy',
      location: 'San Isidro, Lima',
      year: 2025,
      order: 4,
      isFeatured: true,
      isActive: true,
    },
    {
      title: 'Tailoy Mall Plaza Angamos',
      slug: 'tailoy-mall-plaza-angamos',
      projectType: 'construccion-comercial',
      summary: 'Ampliación de tienda y habilitación de almacén en Tai Loy Mall Plaza Angamos.',
      description: 'Ejecución de 350 m² en 1 mes, incluyendo ampliación de área de ventas y habilitación de almacén.',
      client: 'Tai Loy',
      location: 'Miraflores, Lima',
      year: 2025,
      order: 5,
      isFeatured: false,
      isActive: true,
    },
    {
      title: 'BYD La Molina',
      slug: 'byd-la-molina',
      projectType: 'mantenimiento',
      summary: 'Desmontaje, retiro y sustitución de techos en mal estado por nuevas cubiertas.',
      description: 'Reemplazo de 1,000 m² de techos en instalaciones BYD La Molina, ejecutado en 1 mes.',
      client: 'BYD',
      location: 'La Molina, Lima',
      year: 2025,
      order: 6,
      isFeatured: false,
      isActive: true,
    },
    {
      title: 'Grupo Patio — Plaza del Sol Huacho',
      slug: 'grupo-patio-plaza-sol-huacho',
      projectType: 'construccion-comercial',
      summary: 'Trabajos varios en C.C Plaza del Sol Huacho.',
      description: 'Múltiples trabajos de ingeniería y construcción en 800 m² en 2 meses dentro del C.C. Plaza del Sol.',
      client: 'Grupo Patio',
      location: 'Huacho, Lima',
      year: 2025,
      order: 7,
      isFeatured: false,
      isActive: true,
    },
    {
      title: 'Tienda 3A Independencia',
      slug: 'tienda-3a-independencia',
      projectType: 'construccion-comercial',
      summary: 'Implementación y reforzamiento estructural de Tienda 3A en el distrito de Independencia.',
      description: 'Reforzamiento estructural e implementación de 200 m² en 1 mes en el distrito de Independencia.',
      client: '3A Hard Discount',
      location: 'Independencia, Lima',
      year: 2025,
      order: 8,
      isFeatured: false,
      isActive: true,
    },
    {
      title: 'Mall Aventura Santa Anita — Luces de Emergencia',
      slug: 'mall-aventura-santa-anita-luces',
      projectType: 'instalaciones-electricas',
      summary: 'Instalación de puntos de luz de emergencia para inspección ITSE.',
      description: 'Instalación de sistemas de iluminación de emergencia en 1 semana para cumplimiento de inspección ITSE en Mall Aventura Santa Anita.',
      client: 'Mall Aventura',
      location: 'Santa Anita, Lima',
      year: 2025,
      order: 9,
      isFeatured: false,
      isActive: true,
    },
    {
      title: 'Mant. Almacenes Mall Aventura',
      slug: 'mantenimiento-almacenes-mall-aventura',
      projectType: 'mantenimiento',
      summary: 'Mantenimiento de los 24 almacenes del centro comercial Mall Aventura Santa Anita.',
      description: 'Mantenimiento preventivo y correctivo de 24 almacenes en 2 semanas, incluyendo instalaciones eléctricas, mecánicas y arquitectura.',
      client: 'Mall Aventura',
      location: 'Santa Anita, Lima',
      year: 2025,
      order: 10,
      isFeatured: false,
      isActive: true,
    },
    {
      title: 'Tai Loy Ventanilla',
      slug: 'tai-loy-ventanilla',
      projectType: 'construccion-comercial',
      summary: 'Reforzamiento de estructura y remodelación de tienda en el distrito de Ventanilla.',
      description: 'Intervención estructural y remodelación de tienda Tai Loy ejecutada en 1 semana en el distrito de Ventanilla.',
      client: 'Tai Loy',
      location: 'Ventanilla, Callao',
      year: 2025,
      order: 11,
      isFeatured: false,
      isActive: true,
    },
    // 2024-2025
    {
      title: 'Tailoy Cavenecia — Torres Metálicas',
      slug: 'tailoy-cavenecia-torres-metalicas',
      projectType: 'estructuras-metalicas',
      summary: 'Habilitación de torres metálicas e instalaciones para ascensores en tienda Tailoy Cavenecia – San Isidro.',
      description: 'Fabricación y montaje de torres metálicas e instalaciones para ascensores en 3 meses. Proyecto en tienda Tailoy ubicada en San Isidro.',
      client: 'Tai Loy',
      location: 'San Isidro, Lima',
      year: 2025,
      order: 12,
      isFeatured: false,
      isActive: true,
    },
    // 2024
    {
      title: 'Tailoy Barranca',
      slug: 'tailoy-barranca',
      projectType: 'construccion-comercial',
      summary: 'Ejecución de ingenierías para tienda Tailoy en C.C Megaplaza Barranca.',
      description: 'Ejecución de todas las especialidades de ingeniería en 350 m² en 45 días en el C.C. Megaplaza de Barranca.',
      client: 'Tai Loy',
      location: 'Barranca, Lima',
      year: 2024,
      order: 13,
      isFeatured: false,
      isActive: true,
    },
    {
      title: 'Copy Ventas Eguren',
      slug: 'copy-ventas-eguren',
      projectType: 'construccion-comercial',
      summary: 'Implementación total de tienda Copy Ventas en Eguren - Trujillo.',
      description: 'Implementación integral de 500 m² en 1 mes, incluyendo obra civil, instalaciones y acabados completos.',
      client: 'Copy Ventas',
      location: 'Trujillo, La Libertad',
      year: 2024,
      order: 14,
      isFeatured: false,
      isActive: true,
    },
    {
      title: 'PTAR Taboada',
      slug: 'ptar-taboada',
      projectType: 'instalaciones-mecanicas',
      summary: 'Instalación de equipos de expansión directa en sala de control y Suministro e Instalación de equipos Rooftop para Salas Eléctricas.',
      description: 'Proyecto de 900 m² en 6 meses en la Planta de Tratamiento de Aguas Residuales Taboada. Incluye equipos de climatización de alta especificación.',
      client: 'Tedagua',
      location: 'Callao, Lima',
      year: 2024,
      order: 15,
      isFeatured: true,
      isActive: true,
    },
    {
      title: 'Tailoy SJL',
      slug: 'tailoy-sjl',
      projectType: 'instalaciones-electricas',
      summary: 'Ejecución de detección de incendios, audio y CCTV para tienda franquiciada en San Juan de Lurigancho.',
      description: 'Instalación de sistemas de detección de incendios, audio y CCTV en 250 m² en 15 días en tienda Tailoy de SJL.',
      client: 'Tai Loy',
      location: 'San Juan de Lurigancho, Lima',
      year: 2024,
      order: 16,
      isFeatured: false,
      isActive: true,
    },
    {
      title: 'Tailoy Benavides',
      slug: 'tailoy-benavides',
      projectType: 'construccion-comercial',
      summary: 'Ejecución de ingenierías para ampliación de almacén en tienda Tailoy Benavides - Miraflores.',
      description: 'Ampliación de almacén de 100 m² en 1 mes, incluyendo obras civiles e instalaciones especializadas.',
      client: 'Tai Loy',
      location: 'Miraflores, Lima',
      year: 2024,
      order: 17,
      isFeatured: false,
      isActive: true,
    },
    // 2023
    {
      title: 'Tailoy Boulevard de Asia',
      slug: 'tailoy-boulevard-de-asia',
      projectType: 'construccion-comercial',
      summary: 'Implementación total de obra para tienda Tailoy en Boulevard de Asia.',
      description: 'Implementación integral de 300 m² en 45 días. Proyecto llave en mano que incluye todas las especialidades y acabados.',
      client: 'Tai Loy',
      location: 'Asia, Lima',
      year: 2023,
      order: 18,
      isFeatured: false,
      isActive: true,
    },
    {
      title: 'Techo Rintusac',
      slug: 'techo-rintusac',
      projectType: 'mantenimiento',
      summary: 'Cambio de techo de polipropileno en almacén RINTUSAC.',
      description: 'Sustitución de cubierta de polipropileno en 800 m² de almacén industrial en 1 mes.',
      client: 'Rintusac',
      location: 'Lima',
      year: 2023,
      order: 19,
      isFeatured: false,
      isActive: true,
    },
    {
      title: 'Wiltons Mall del Sur',
      slug: 'wiltons-mall-del-sur',
      projectType: 'construccion-comercial',
      summary: 'Habilitación de local ex–Wiltons para futuro arrendatario en C.C Mall del Sur.',
      description: 'Habilitación de local de 100 m² en 15 días para nuevo arrendatario en el C.C. Mall del Sur.',
      client: "Wilton's",
      location: 'San Juan de Miraflores, Lima',
      year: 2023,
      order: 20,
      isFeatured: false,
      isActive: true,
    },
    {
      title: 'Oficina More',
      slug: 'oficina-more',
      projectType: 'instalaciones-electricas',
      summary: 'Independización de acometidas en edificio More – San Borja.',
      description: 'Trabajos de independización de acometidas eléctricas, sanitarias y mecánicas de 500 m² en 15 días en edificio corporativo San Borja.',
      client: 'More',
      location: 'San Borja, Lima',
      year: 2023,
      order: 21,
      isFeatured: false,
      isActive: true,
    },
    // 2022
    {
      title: 'Museo del Estadio Monumental',
      slug: 'museo-estadio-monumental',
      projectType: 'instalaciones-mecanicas',
      summary: 'Implementación e instalación de aire acondicionado en el Museo del Estadio Monumental.',
      description: 'Diseño e instalación de sistema de climatización de 250 m² en 1 mes para el museo del estadio más grande del Perú.',
      client: 'Museo Monumental',
      location: 'Ate, Lima',
      year: 2022,
      order: 22,
      isFeatured: true,
      isActive: true,
    },
    {
      title: 'Western Union Salaverry',
      slug: 'western-union-salaverry',
      projectType: 'construccion-comercial',
      summary: 'Implementación total de local Western Union en C.C Real Plaza Salaverry.',
      description: 'Implementación llave en mano de 100 m² en 2 meses en el C.C. Real Plaza Salaverry, incluyendo todas las especialidades e imagen de marca.',
      client: 'Western Union',
      location: 'Jesús María, Lima',
      year: 2022,
      order: 23,
      isFeatured: false,
      isActive: true,
    },
  ]

  for (const proyecto of proyectos) {
    const existing = await payload.find({
      collection: 'projects',
      where: { slug: { equals: proyecto.slug } },
      limit: 1,
    })
    if (existing.docs.length > 0) {
      await payload.update({
        collection: 'projects',
        id: existing.docs[0].id,
        data: proyecto,
      })
      console.log(`  ✅ Proyecto actualizado: ${proyecto.title}`)
    } else {
      await payload.create({ collection: 'projects', data: proyecto })
      console.log(`  ✅ Proyecto creado: ${proyecto.title}`)
    }
  }

  console.log('\n✅ Seed completado exitosamente.')
  console.log('\n📌 Pendiente (requieren subir logos/imágenes manualmente desde el admin):')
  console.log('  • Clients: Rintusac, Tai Loy, Mall Aventura, Contrans, Wilton\'s, 3A, Museo Monumental, BYD, Tedagua, Copy Ventas, Smart Fit, Ripley')
  console.log('  • Imágenes de portada y galería de cada proyecto')
  console.log('  • Imagen principal en Quiénes Somos')
  console.log('  • Slides del hero (imágenes del carrusel)')

  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Error en seed:', err)
  process.exit(1)
})
