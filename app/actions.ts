'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const prisma = new PrismaClient()

async function checkAuth() {
  const cookieStore = await cookies()
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
      },
      global: {
        headers: {
          cookie: cookieStore.toString(),
        },
      },
    }
  )

  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error('Não autorizado')
  }

  return user
}

export async function getLinks() {
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