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

function revalidateAll() {
  revalidatePath('/')
  revalidatePath('/admin')
}

export async function getLinks() {
  await checkAuth()

  return await prisma.link.findMany({
    orderBy: [{ position: 'asc' }, { createdAt: 'desc' }]
  })
}

export async function addLink(formData: FormData) {
  await checkAuth()

  const title = formData.get('title') as string
  const url = formData.get('url') as string

  if (!title || !url) return

  // Novo link entra no fim da lista
  const last = await prisma.link.aggregate({ _max: { position: true } })

  await prisma.link.create({
    data: { title, url, position: (last._max.position ?? -1) + 1 }
  })

  revalidateAll()
}

export async function deleteLink(id: string) {
  await checkAuth()

  await prisma.link.delete({
    where: { id }
  })

  revalidateAll()
}

export async function updateLink(id: string, title: string, url: string) {
  await checkAuth()

  await prisma.link.update({
    where: { id },
    data: { title, url }
  })

  revalidateAll()
}

export async function toggleLink(id: string, active: boolean) {
  await checkAuth()

  await prisma.link.update({
    where: { id },
    data: { active }
  })

  revalidateAll()
}

export async function reorderLinks(ids: string[]) {
  await checkAuth()

  if (!Array.isArray(ids) || ids.some((id) => typeof id !== 'string')) {
    throw new Error('Lista de links inválida')
  }

  await prisma.$transaction(
    ids.map((id, position) =>
      prisma.link.update({ where: { id }, data: { position } })
    )
  )

  revalidateAll()
}
