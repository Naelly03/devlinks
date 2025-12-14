'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

export async function getLinks() {
  return await prisma.link.findMany({
    orderBy: { createdAt: 'asc' } 
  })
}

export async function addLink(formData: FormData) {
  const title = formData.get('title') as string
  const url = formData.get('url') as string

  await prisma.link.create({
    data: { title, url }
  })

  revalidatePath('/')
  revalidatePath('/admin')
}

export async function deleteLink(id: string) {
  await prisma.link.delete({
    where: { id }
  })

  revalidatePath('/')
  revalidatePath('/admin')
}

export async function updateLink(id: string, title: string, url: string) {
  await prisma.link.update({
    where: { id },
    data: { title, url }
  })

  revalidatePath('/')
  revalidatePath('/admin')
}