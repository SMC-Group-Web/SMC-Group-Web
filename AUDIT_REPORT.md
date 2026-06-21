# AUDIT REPORT — SMC GROUP Web
**Fecha:** 2026-06-20  
**Auditor:** Claude Code (claude-sonnet-4-6)  
**Stack:** Next.js 15 (App Router) + Payload CMS v3 + PostgreSQL  
**Base path:** `/Users/tonydzpineda/SMC-Group-Web`

---

## 1. Resumen ejecutivo

El proyecto está en un estado funcional y bien estructurado para una web corporativa de ingeniería. Todas las colecciones y globals tienen al menos un punto de consumo en el frontend. La implementación de `revalidate`, `Promise.all`, `next/image` con `sizes` y manejo de fallbacks es consistente y correcta en la mayoría de páginas. Sin embargo, se identificaron varios hallazgos importantes: (1) dos componentes creados pero **nunca importados** en ninguna página (`QuienesSomosSection` y `ServiciosMapa`), lo que representa trabajo muerto; (2) el campo `highlights` del global `HomePage` se extrae de la API pero **nunca se renderiza** en el JSX de la home; (3) el campo `website` de `Clients` tampoco se renderiza visualmente aunque sí se pasa al marquee de clientes; (4) hay duplicación severa de la función `buildGroups` entre `ProyectoDetail` y `ServicioDetail`; (5) el rol `ventas` no tiene restricción de acceso a colecciones distintas de `Leads`, pudiendo ver Projects, Services y Clients en el panel (hidden visual pero no seguro); (6) el `sitemap.ts` no incluye las rutas de servicios. En general el código es limpio y bien pensado, con buenas prácticas de SEO, fallbacks visuales y acceso condicional.

---

## 2. Inventario de colecciones y globals registrados

### Colecciones (en `payload.config.ts`)
| Slug | Archivo | Propósito |
|------|---------|-----------|
| `users` | `src/collections/Users.ts` | Autenticación + roles admin/ventas |
| `media` | `src/collections/Media.ts` | Upload de imágenes, videos y PDFs |
| `services` | `src/collections/Services.ts` | Servicios de ingeniería |
| `projects` | `src/collections/Projects.ts` | Portafolio de proyectos |
| `clients` | `src/collections/Clients.ts` | Logos de clientes para marquee |
| `leads` | `src/collections/Leads.ts` | Formularios de contacto / CRM |

### Globals (en `payload.config.ts`)
| Slug | Archivo | Propósito |
|------|---------|-----------|
| `home-page` | `src/globals/HomePage.ts` | Contenido Hero, stats y highlights |
| `about-page` | `src/globals/AboutPage.ts` | Contenido Quiénes Somos |
| `contact-page` | `src/globals/ContactPage.ts` | Datos de contacto e infoCards |
| `servicios-page` | `src/globals/ServiciosPage.ts` | Stats del hero de servicios |
| `proyectos-page` | `src/globals/ProyectosPage.ts` | Stats del hero de proyectos |

---

## 3. Tabla por colección/global

| Colección/Global | Consumida en frontend | Optimización | UX del panel | Problemas principales |
|---|---|---|---|---|
| `users` | No aplica (auth only) | N/A | Buena (hidden para no-admin) | Rol `ventas` tiene acceso visual a colecciones no restringidas |
| `media` | Indirectamente via upload | N/A | Buena (alt required, adminThumbnail) | `description` nunca renderizado en frontend |
| `services` | Si (servicios/page, servicios/[slug], home) | Buena (Promise.all, revalidate, select) | Buena (labels, admin.description) | `ctaLink` ignorado en página /servicios (lista), `color` solo para ServiciosMapa que no se usa |
| `projects` | Si (proyectos/page, proyectos/[slug], home) | Buena (Promise.all, revalidate, select) | Buena (labels, defaultColumns) | `order` campo de la colección nunca renderizado; `isFeatured` usado solo como filtro, nunca badge prominente en la vista detalle |
| `clients` | Si (home page via ClientsMarquee) | Buena (select, Promise.all) | Buena | Campo `website` se pasa al componente pero no se renderiza como texto (solo wrappea el logo como enlace, correcto) |
| `leads` | Si (actions.ts, solo escritura) | N/A (server action) | Buena (labels, grupo Ventas, status) | `status` de Leads no tiene flujo de notificación por email; no hay webhook/email al equipo cuando entra un lead |
| `home-page` | Parcial | Buena (Promise.all, revalidate) | Buena | Campo `highlights` se extrae pero NUNCA se renderiza en el JSX; solo queda en variable local sin uso |
| `about-page` | Si (quienes-somos/page) | Buena (revalidate) | Buena | `subtitle` se duplica: aparece tanto en el hero como en la sección principal de texto |
| `contact-page` | Si (contacto/page) | Buena (revalidate) | Buena | Campo `email` usa type `text` en lugar de `email` en la definición del global |
| `servicios-page` | Si (servicios/page) | Buena (Promise.all, revalidate) | Buena | Solo tiene un campo (`heroStats`), global muy minimalista |
| `proyectos-page` | Si (proyectos/page) | Buena (Promise.all, revalidate) | Buena | Solo tiene un campo (`heroStats`), global muy minimalista |

---

## 4. Lista de hallazgos priorizados

---

### ALTA PRIORIDAD

---

#### H-01: Campo `highlights` de `home-page` extraído pero nunca renderizado
- **Colección afectada:** Global `home-page` (campo `highlights`)
- **Archivos:** `src/app/(frontend)/page.tsx` (línea 80), `src/globals/HomePage.ts` (línea 138)
- **Descripción:** El servidor extrae `homePage.highlights` en la variable `highlights` (línea 80), pero esa variable nunca se usa en el JSX retornado. La sección "Tarjetas de ventajas (¿Por qué elegirnos?)" que aparece en el global del panel NUNCA se muestra en la página de inicio. El administrador puede editar este campo pensando que tendrá efecto, pero no lo tiene.
- **Impacto:** Contenido del CMS silenciosamente ignorado. El equipo de marketing no puede configurar esa sección desde el panel aunque existe. Posible confusión operativa.

---

#### H-02: Componente `QuienesSomosSection` creado pero no importado en ninguna página
- **Colección afectada:** N/A (componente huérfano)
- **Archivos:** `src/components/home/QuienesSomosSection.tsx`
- **Descripción:** El componente existe con lógica completa (sticky header, animaciones framer-motion, lista de equipo hardcodeada), pero no está importado en `page.tsx` (home), ni en `quienes-somos/page.tsx`, ni en ningún otro archivo del proyecto. Además internamente usa datos de equipo hardcodeados (nombres y roles ficticios: Carlos López, José Ramírez, María Torres, Pedro Sánchez, Luis Vega, Ana Flores, Rosa Díaz), lo que sería un problema si se expusiera.
- **Impacto:** Código muerto con datos ficticios. Si algún día se importa accidentalmente, mostraría empleados inventados en producción.

---

#### H-03: Componente `ServiciosMapa` creado pero no importado en ninguna página
- **Colección afectada:** `services` (campo `color`)
- **Archivos:** `src/components/servicios/ServiciosMapa.tsx`
- **Descripción:** El componente SVG interactivo de mapa de servicios existe completo (>560 líneas, lógica scroll-driven, NODE_CONFIG hardcodeado para 5 slugs fijos: construccion, consultoria, estudios, mantenimiento, sostenibles), pero no está importado en ninguna página. El campo `color` de la colección `services` fue diseñado específicamente para este mapa, y tampoco tiene otro uso en el frontend.
- **Impacto:** Código muerto significativo. El campo `color` de `services` es actualmente un campo "muerto" para el administrador. NODE_CONFIG está hardcodeado con slugs específicos que deben coincidir con los slugs reales en la BD.

---

#### H-04: Rol `ventas` no tiene restricción de lectura en colecciones de contenido
- **Colección afectada:** `projects`, `services`, `clients`, globals
- **Archivos:** `src/collections/Projects.ts`, `src/collections/Services.ts`, `src/collections/Clients.ts`, `src/globals/`
- **Descripción:** El rol `ventas` está oculto visualmente del panel para colecciones como Projects, Services y Clients (`hidden: ({ user }) => user?.role !== 'admin'`), pero la restricción es solo visual. El acceso a la API de lectura es `() => true` (público), lo que significa que un usuario con rol `ventas` podría hacer requests directos a `/api/projects`, `/api/services`, etc. sin restricción. Solo `Leads` tiene `create: () => true` abierto intencionalmente. La restricción de acceso correcta requiere lógica en `access.read`, no solo en `admin.hidden`.
- **Impacto:** Esto es aceptable en colecciones con `read: () => true` (datos públicos), pero sugiere que el modelo de acceso no está completamente pensado: si se agregara contenido privado, la visibilidad `hidden` no protegería la API.

---

#### H-05: El sitemap no incluye rutas de servicios (`/servicios/[slug]`)
- **Colección afectada:** `services`
- **Archivos:** `src/app/sitemap.ts`
- **Descripción:** El archivo `sitemap.ts` genera rutas estáticas para `/servicios` pero NO genera rutas dinámicas para `/servicios/[slug]`. Las páginas de detalle de servicios (que tienen `generateStaticParams` y son indexables) quedan fuera del sitemap XML enviado a Google.
- **Impacto:** SEO degradado. Los motores de búsqueda no recibirán señal explícita de que existen páginas de detalle de servicios. Especialmente importante dado que cada servicio tiene campos SEO configurables.

---

### MEDIA PRIORIDAD

---

#### H-06: Campo `email` del global `contact-page` definido con type `text` en lugar de `email`
- **Colección afectada:** Global `contact-page`
- **Archivos:** `src/globals/ContactPage.ts` (línea 48)
- **Descripción:** El campo `email` en `ContactPage` está definido como `type: 'text'` en lugar de `type: 'email'`. Payload CMS tiene un tipo nativo `email` que aplica validación de formato automáticamente en el panel admin. Con `type: 'text'`, el administrador podría ingresar un valor mal formateado que luego se renderizaría en el frontend sin validación.
- **Impacto:** Posible dato incorrecto en producción. UX del panel degradada (sin validación de formato de email).

---

#### H-07: Duplicación de la función `buildGroups` entre `ProyectoDetail` y `ServicioDetail`
- **Colección afectada:** `projects`, `services`
- **Archivos:** `src/components/proyectos/ProyectoDetail.tsx` (líneas 108-140), `src/components/servicios/ServicioDetail.tsx` (líneas 89-113)
- **Descripción:** La función `buildGroups` que organiza la galería en layouts full/duo/trio es idéntica en ambos componentes. Cualquier bug o cambio de layout debe aplicarse en dos lugares. Asimismo, `useReveal`, `RevealImage` y `RevealText` se reimplementan localmente en ambos archivos en lugar de usar el hook `src/lib/useReveal.ts` que ya existe en el proyecto.
- **Impacto:** Mantenibilidad degradada. El archivo `src/lib/useReveal.ts` existe pero solo se usa para exportación, no se consume en estos componentes.

---

#### H-08: Campo `subtitle` del global `about-page` se renderiza dos veces en la misma página
- **Colección afectada:** Global `about-page`
- **Archivos:** `src/app/(frontend)/quienes-somos/page.tsx` (líneas 87 y 129)
- **Descripción:** El campo `aboutPage.subtitle` se usa en el hero (línea 87, párrafo bajo el h1) y nuevamente en la sección principal de texto (línea 129, párrafo grande). El campo `aboutPage.description` aparece correctamente en el blockquote (línea 137). El administrador que actualice el `subtitle` verá su texto duplicado en la página.
- **Impacto:** UX del panel confusa. El administrador no puede controlar de forma independiente el texto del hero y el texto principal.

---

#### H-09: Slugs en `ServiciosMapa` (`NODE_CONFIG`) hardcodeados sin coincidir con los slugs definidos en `Services`
- **Colección afectada:** `services`
- **Archivos:** `src/components/servicios/ServiciosMapa.tsx` (líneas 27-48)
- **Descripción:** `NODE_CONFIG` tiene posiciones SVG fijas para exactamente 5 slugs: `construccion`, `consultoria`, `estudios`, `mantenimiento`, `sostenibles`. La colección `Services` no impone estos slugs. Si el administrador crea servicios con slugs diferentes (lo más probable dado que el panel no muestra restricción), el mapa no mostrará ningún nodo para esos servicios (el filtro `mappedServices = services.filter(s => NODE_CONFIG[s.slug])` los descarta silenciosamente). El mapa no es dinámico.
- **Impacto:** Componente no funcional en el estado real del CMS a menos que los slugs coincidan exactamente.

---

#### H-10: `name` campo de `Users` no es required
- **Colección afectada:** `users`
- **Archivos:** `src/collections/Users.ts` (línea 33)
- **Descripción:** El campo `name` (Nombre completo) del usuario no es `required: true`. Esto significa que el campo puede estar vacío. El panel usa `email` como `useAsTitle`, lo cual es correcto, pero si el nombre es opcional, reportes o listados de leads/actividad del panel pueden mostrar emails en lugar de nombres legibles.
- **Impacto:** UX del panel degradada. Posible inconsistencia en registros de auditoría si Payload los genera.

---

#### H-11: No existe ningún `loading.tsx` en las rutas del frontend
- **Colección afectada:** Todas las páginas
- **Archivos:** Ausencia en `src/app/(frontend)/`
- **Descripción:** Next.js App Router permite archivos `loading.tsx` por ruta que muestran un skeleton/spinner durante la carga del Server Component. Ninguna ruta del frontend tiene `loading.tsx`, ni global ni por ruta. Las páginas que hacen múltiples fetches (`page.tsx` home hace 4 en Promise.all) no tienen UI de carga visible.
- **Impacto:** UX de usuario: navegaciones lentas (especialmente en la primera carga o sin caché ISR) muestran pantalla en blanco sin feedback.

---

#### H-12: `projectType` del campo `Projects` no mapea los mismos valores que `Leads`
- **Colección afectada:** `projects`, `leads`
- **Archivos:** `src/collections/Projects.ts` (líneas 32-44), `src/collections/Leads.ts` (líneas 47-57)
- **Descripción:** Los valores de `projectType` en `Projects` usan formato kebab-case (`construccion-comercial`, `obra-civil`, etc.) mientras que en `Leads` usan texto libre con espacios (`Ingeniería estructural`, `Construcción industrial`). No hay relación entre ambos, pero semánticamente representan categorías similares. Esto complica cualquier análisis cruzado de leads vs. proyectos realizados.
- **Impacto:** Inconsistencia de datos. Si en el futuro se quiere relacionar leads con tipos de proyecto, se necesitaría una migración.

---

#### H-13: Las estadísticas de globals (`ServiciosPage`, `ProyectosPage`, `HomePage`) son hardcoded en `defaultValue` y no se actualizan automáticamente
- **Colección afectada:** Globals `servicios-page`, `proyectos-page`, `home-page`
- **Archivos:** `src/globals/ServiciosPage.ts`, `src/globals/ProyectosPage.ts`, `src/globals/HomePage.ts`
- **Descripción:** Los `defaultValue` en las estadísticas muestran "200+ Proyectos", "50+ Clientes", "10+ Años de experiencia", pero son valores editables manualmente en el panel. No se calculan a partir del número real de registros en la BD (ej: `payload.count({ collection: 'projects' })`). Un administrador puede olvidar actualizarlos cuando el número real cambie.
- **Impacto:** Datos posiblemente desactualizados en producción. Riesgo bajo si hay un proceso editorial activo.

---

### BAJA PRIORIDAD

---

#### H-14: Campo `description` de `Media` nunca se consume en el frontend
- **Colección afectada:** `media`
- **Archivos:** `src/collections/Media.ts` (línea 54)
- **Descripción:** El campo `description` (Descripción del archivo, opcional) existe en la colección `Media` pero nunca se usa en ninguna query ni componente del frontend. Solo `alt` y `url` se utilizan vía `MediaType`.
- **Impacto:** Campo muerto en el panel. Genera confusión en el administrador que lo rellene sin efecto visible.

---

#### H-15: `Clients.website` se pasa al marquee pero no se renderiza como texto visible
- **Colección afectada:** `clients`
- **Archivos:** `src/components/home/ClientsMarquee.tsx` (líneas 46-63)
- **Descripción:** El campo `website` de Clients se usa correctamente para convertir el logo en un enlace (`<a href={website}>`), pero no hay texto visible que muestre el website ni tooltip. El comportamiento es correcto (enlace funcional), pero el campo en el panel podría confundir si el administrador espera que aparezca en algún lugar visible.
- **Impacto:** Menor. El comportamiento es correcto funcionalmente.

---

#### H-16: `Services.ctaLink` ignorado en la página `/servicios` (lista)
- **Colección afectada:** `services`
- **Archivos:** `src/app/(frontend)/servicios/page.tsx` (líneas 183-189), `src/collections/Services.ts` (línea 73)
- **Descripción:** En la página de lista de servicios (`/servicios`), el botón "Ver servicio completo →" enlaza siempre a `/servicios/${service.slug}` (la página de detalle), ignorando el `ctaLink` configurado en el CMS. En cambio, `ServicioDetail` sí usa `ctaLink` correctamente en el CTA del footer. Si el administrador configura un `ctaLink` diferente (ej: `/contacto?servicio=ingenieria`), solo funciona en la página de detalle, no en la lista.
- **Impacto:** Comportamiento inconsistente entre lista y detalle. Baja prioridad porque el comportamiento actual (ir al detalle) es razonable.

---

#### H-17: Metadata de páginas de lista (`/servicios`, `/proyectos`) tiene texto estático no gestionable desde el CMS
- **Colección afectada:** Globals `servicios-page`, `proyectos-page`
- **Archivos:** `src/app/(frontend)/servicios/page.tsx` (líneas 11-20), `src/app/(frontend)/proyectos/page.tsx` (líneas 11-20)
- **Descripción:** Los metadatos `<title>` y `<description>` de las páginas de lista están hardcodeados en el componente, no se extraen de los globals `servicios-page` o `proyectos-page`. El administrador no puede modificar el título SEO de estas páginas desde el panel.
- **Impacto:** SEO no gestionable por marketing. Los globals correspondientes deberían tener campos de SEO (título, descripción) igual que lo tienen las colecciones Services y Projects.

---

#### H-18: Imagen del equipo (`/equipo.png`) y logo (`/logo-smc.png`) son archivos estáticos no gestionables por el CMS
- **Colección afectada:** N/A
- **Archivos:** `src/components/home/QuienesSomosSection.tsx`, `src/components/layout/Header.tsx`, `src/components/layout/Footer.tsx`
- **Descripción:** El logo del header/footer y la imagen del equipo son archivos estáticos en `/public`. Si el cliente quiere cambiar el logo o la foto del equipo, necesita acceso al servidor o un deploy, no puede hacerlo desde el panel CMS.
- **Impacto:** Flexibilidad operativa reducida. Podría mitigarse agregando un campo en un global (ej: `SiteSettings`).

---

#### H-19: `ProyectoDetailPage` no verifica `revalidate` con el mismo valor que la página de lista
- **Colección afectada:** `projects`
- **Archivos:** `src/app/(frontend)/proyectos/[slug]/page.tsx` (sin `export const revalidate`)
- **Descripción:** La página de lista `/proyectos/page.tsx` tiene `export const revalidate = 3600`. La página de detalle `/proyectos/[slug]/page.tsx` NO tiene `export const revalidate`, lo cual significa que usa el valor por defecto de Next.js (que puede ser `false` o el del layout). Comportamiento inconsistente: la lista se revalida en 1 hora, el detalle puede no revalidarse según herencia del layout.
- **Impacto:** Posible contenido stale en páginas de detalle más tiempo del esperado.

---

#### H-20: Emoji en label del campo SEO (`label: '🔍 SEO'`) puede causar problemas de encoding
- **Colección afectada:** `projects`, `services`
- **Archivos:** `src/collections/Projects.ts` (línea 138), `src/collections/Services.ts` (línea 144)
- **Descripción:** El label del grupo SEO usa un emoji (`'🔍 SEO'`). Aunque funciona en la mayoría de navegadores modernos, puede tener problemas en entornos de logging o herramientas CLI que no soporten Unicode. Es una práctica no estándar en Payload.
- **Impacto:** Cosmético. Muy baja prioridad.

---

#### H-21: Footer usa dirección de Google Maps hardcodeada diferente a la de `siteConfig`
- **Colección afectada:** N/A
- **Archivos:** `src/components/layout/Footer.tsx` (línea 166)
- **Descripción:** El footer enlaza a `https://www.google.com/maps/place/Gaviotas+132,Lima+15047`, una URL hardcodeada con una dirección diferente a la que aparece en `siteConfig.address.full` ("Calle Las Gaviotas 122, Ofi. 401") y en las coordenadas de `siteConfig.coordinates`. Hay inconsistencia entre las dos referencias de dirección.
- **Impacto:** El enlace de Maps en el footer podría llevar a una ubicación ligeramente incorrecta. La página de contacto usa las coordenadas de `siteConfig` (correctas).

---

#### H-22: `Leads.projectType` usa string values sin label (array de strings simples)
- **Colección afectada:** `leads`
- **Archivos:** `src/collections/Leads.ts` (líneas 47-57)
- **Descripción:** El campo `projectType` de `Leads` define las opciones como un array de strings simples (`'Ingeniería estructural'`, etc.) en lugar del formato `{ label: string, value: string }`. Esto funciona en Payload (los strings se usan como label y value), pero hace que el value almacenado en la BD sea el texto completo con tildes y espacios. Esto puede complicar filtros programáticos o exportaciones.
- **Impacto:** Baja prioridad. Funcional pero no idiomático.

---

## 5. Análisis por paso de auditoría

### PASO 2 — Trazabilidad Panel → Frontend

| Campo | Colección | Usado en frontend | Notas |
|---|---|---|---|
| `title`, `slug`, `summary`, `description`, `coverImage`, `gallery`, `client`, `location`, `year`, `projectType`, `isFeatured`, `isActive`, `seo` | `projects` | Si | Todos renderizados excepto `order` (solo para filtro de sort) |
| `coverCaption` | `projects` | Si | En proyectos/page.tsx y [slug]/page.tsx |
| `title`, `slug`, `summary`, `description`, `image`, `gallery`, `features`, `category`, `ctaLink`, `isFeatured`, `isActive`, `seo` | `services` | Si | `ctaLink` solo en detail page |
| `color` | `services` | No | Solo para ServiciosMapa (componente huérfano) |
| `name`, `logo`, `website`, `order`, `isActive` | `clients` | Si | `website` usado como href, no renderizado como texto |
| `name`, `email`, `phone`, `company`, `projectType`, `description`, `urgent`, `status`, `notes` | `leads` | Solo escritura vía server action | `status` y `notes` son campos de gestión interna |
| `role`, `name` | `users` | No aplica | Campos de autenticación/autorización |
| `alt`, `url` | `media` | Si | `description` nunca consumido |
| `heroTitle`, `heroSubtitle`, `heroSlides`, `stats` | `home-page` | Si | Usados en HomeHeroCarousel |
| `highlights` | `home-page` | NO | Extraído pero no renderizado (H-01) |
| `title`, `subtitle`, `description`, `image`, `strengths`, `values` | `about-page` | Si | `subtitle` duplicado (H-08) |
| `title`, `subtitle`, `description`, `phone`, `email`, `address`, `schedule`, `whatsappNumber`, `whatsappMessage`, `infoCards` | `contact-page` | Si | Todos renderizados |
| `heroStats` | `servicios-page` | Si | Renderizado en hero de /servicios |
| `heroStats` | `proyectos-page` | Si | Renderizado en hero de /proyectos |

### PASO 3 — Estado de optimización

| Ruta | revalidate | Fetches | next/image sizes | Fallbacks | loading.tsx |
|---|---|---|---|---|---|
| `/` (home) | 3600 | Promise.all (4) | Si | Si | No |
| `/servicios` | 3600 | Promise.all (2) | Si | Si | No |
| `/proyectos` | 3600 | Promise.all (2) | Si | Si | No |
| `/quienes-somos` | 3600 | 1 fetch | Si | Si | No |
| `/contacto` | 3600 | 1 fetch | N/A | Si | No |
| `/servicios/[slug]` | 3600 | 2 fetches (metadata + data) | Si | Si | No |
| `/proyectos/[slug]` | Sin revalidate | 2 fetches | Si | Si | No |

**Observaciones positivas:**
- `Promise.all` usado en todas las páginas con múltiples fetches.
- `select` en todas las queries limita los campos traídos de la BD.
- `next/image` con `sizes` apropiados en todos los componentes.
- Fallbacks visuales correctos para imágenes ausentes.
- `generateStaticParams` implementado en ambas rutas dinámicas.

### PASO 4 — Experiencia del administrador en el panel

**Aspectos positivos:**
- Todas las colecciones y globals tienen `label` en español.
- La mayoría de campos tienen `admin.description` con ejemplos concretos.
- `Media.alt` es `required: true` con descripción clara para accesibilidad/SEO.
- `Leads` usa `labels.singular/plural` para "Solicitudes" (UX clara en panel).
- `Leads` está agrupado en "Ventas" (`admin.group: 'Ventas'`), separado visualmente.
- El rol `ventas` tiene visibilidad limitada (solo ve Leads), apropiado para CRM básico.
- `Projects` y `Services` tienen `defaultColumns` útiles.
- Los campos condicionales de `heroSlides` (`image` visible solo si `mediaType !== 'video'`) están bien implementados.

**Aspectos a mejorar:**
- `contact-page.email` debería ser `type: 'email'` (H-06).
- `users.name` debería ser `required: true` para mejor legibilidad en auditorías.
- `services.color` no tiene ningún efecto visible actualmente (H-03).
- Los globals `servicios-page` y `proyectos-page` son muy simples (solo `heroStats`) y podrían confundir al admin que espere más configuración.
- Los slugs de Projects y Services no tienen `admin.description` que advierta que deben ser únicos y en kebab-case.
- No hay hook `beforeChange` que auto-genere el slug a partir del título.

---

## 6. Resumen de campos "muertos" por colección

| Campo | Colección/Global | Estado |
|---|---|---|
| `highlights` | `home-page` | Extraído del CMS, nunca renderizado |
| `description` | `media` | Nunca consultado en ninguna query |
| `color` | `services` | Diseñado para ServiciosMapa (componente huérfano) |
| `order` | `projects` | Solo usado como criterio de sort, no renderizado |
| `order` | `services` | Solo usado como criterio de sort, no renderizado |
| `order` | `clients` | Solo usado como criterio de sort, no renderizado |

---

*Reporte generado el 2026-06-20. Basado en lectura estática del código; no incluye análisis de runtime ni de la base de datos en producción.*
