import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { Media } from './src/collections/Media'
import { Projects } from './src/collections/Projects'
import { Services } from './src/collections/Services'
import { Users } from './src/collections/Users'
import { AboutPage } from './src/globals/AboutPage'
import { ContactPage } from './src/globals/ContactPage'
import { HomePage } from './src/globals/HomePage'

export default buildConfig({
  editor: lexicalEditor(),
  collections: [Users, Media, Services, Projects],
  globals: [HomePage, AboutPage, ContactPage],
  secret: process.env.PAYLOAD_SECRET || '',
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
  }),
  sharp,
  admin: {
    user: 'users',
  },
})