'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '../lib/prisma'
import { createClient } from '../lib/supabase/server'

async function checkAuth() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error('Não autorizado')
  }

  return user
}

export async function getLinks() {
  await checkAuth()

  return await prisma.link.findMany({
    orderBy: { createdAt: 'desc' }
  })
}

export async function addLink(formData: FormData) {
  await checkAuth()

  const title = formData.get('title') as string
  const url = formData.get('url') as string

  if (!title || !url) return

  await prisma.link.create({
    data: { title, url }
  })

  revalidatePath('/')
  revalidatePath('/admin')
}

export async function deleteLink(id: string) {
  await checkAuth()

  await prisma.link.delete({
    where: { id }
  })

  revalidatePath('/')
  revalidatePath('/admin')
}

export async function updateLink(id: string, title: string, url: string) {
  await checkAuth()

  await prisma.link.update({
    where: { id },
    data: { title, url }
  })

  revalidatePath('/')
  revalidatePath('/admin')
}