'use server'

import config from '@payload-config'
import { getPayload } from 'payload'

export async function submitLead(formData: {
  name: string
  company?: string
  email: string
  phone?: string
  projectType?: string
  description?: string
  urgent?: boolean
}) {
  try {
    const payload = await getPayload({ config })

    type ProjectTypeValue =
      | 'Ingeniería estructural'
      | 'Construcción industrial'
      | 'Fabricación metalmecánica'
      | 'Montaje industrial'
      | 'Mantenimiento'
      | 'Otro'

    await payload.create({
      collection: 'leads',
      data: {
        name: formData.name,
        company: formData.company || '',
        email: formData.email,
        phone: formData.phone || '',
        projectType: (formData.projectType || undefined) as ProjectTypeValue | undefined,
        description: formData.description || '',
        urgent: formData.urgent || false,
        status: 'nuevo',
      },
    })

    return { success: true }
  } catch (error) {
    console.error('Error al guardar lead:', error)
    return { success: false, error: 'No se pudo enviar la solicitud' }
  }
}
