import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import { es } from '@payloadcms/translations/languages/es'
import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

import { Media } from './src/collections/Media'
import { Projects } from './src/collections/Projects'
import { Services } from './src/collections/Services'
import { Users } from './src/collections/Users'
import { AboutPage } from './src/globals/AboutPage'
import { ContactPage } from './src/globals/ContactPage'
import { HomePage } from './src/globals/HomePage'
import { ServiciosPage } from './src/globals/ServiciosPage'
import { ProyectosPage } from './src/globals/ProyectosPage'
import { Clients } from './src/collections/Clients'
import { Leads } from './src/collections/Leads'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  editor: lexicalEditor(),
  collections: [Users, Media, Services, Projects, Clients, Leads],
  globals: [HomePage, AboutPage, ContactPage, ServiciosPage, ProyectosPage],
  secret: process.env.PAYLOAD_SECRET || '',
  db: postgresAdapter({
    push: process.env.NODE_ENV !== 'production',
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
  }),
  sharp,
  i18n: {
    supportedLanguages: { es },
    fallbackLanguage: 'es',
  },
  admin: {
    user: 'users',
    components: {
      graphics: {
        Logo: '/src/components/payload/logo#Logo',
        Icon: '/src/components/payload/logo#Icon',
      },
    },
  },
})