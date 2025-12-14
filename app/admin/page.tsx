'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { addLink, deleteLink, getLinks } from '../actions'

type Link = {
  id: string
  title: string
  url: string
}

export default function Admin() {
  const [links, setLinks] = useState<Link[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function checkUser() {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/login') // Se não tiver logado, manda pro login
      } else {
        // Se tiver logado, busca os links do banco
        const data = await getLinks()
        setLinks(data)
        setLoading(false)
      }
    }
    checkUser()
  }, [])

  async function handleDelete(id: string) {
    await deleteLink(id)
    const updatedLinks = await getLinks() 
    setLinks(updatedLinks)
  }

  if (loading) return <div className="p-10 text-white">Carregando painel...</div>

  return (
    <div className="min-h-screen bg-gray-900 p-8 text-white">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Painel Admin</h1>
          <button 
            onClick={async () => {
              await supabase.auth.signOut()
              router.push('/')
            }}
            className="text-sm text-red-400 hover:text-red-300"
          >
            Sair (Logout)
          </button>
        </div>

        {/* Formulário de Adicionar */}
        <form action={async (formData) => {
            await addLink(formData)
            const data = await getLinks()
            setLinks(data)
            // Limpa o form (opcional, mas bom pra UX)
            const form = document.getElementById('add-form') as HTMLFormElement
            form.reset()
          }} 
          id="add-form"
          className="mb-8 rounded-lg bg-gray-800 p-6"
        >
          <h2 className="mb-4 text-xl font-bold">Adicionar Novo Link</h2>
          <div className="flex gap-4">
            <input
              name="title"
              placeholder="Título (ex: Instagram)"
              required
              className="w-1/3 rounded bg-gray-700 p-3 outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              name="url"
              placeholder="URL (ex: https://instagram.com/...)"
              required
              className="flex-1 rounded bg-gray-700 p-3 outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button type="submit" className="rounded bg-green-600 px-6 py-3 font-bold hover:bg-green-700">
              Salvar
            </button>
          </div>
        </form>

        <div className="space-y-4">
          {links.map((link) => (
            <div key={link.id} className="flex items-center justify-between rounded-lg bg-gray-800 p-4">
              <div>
                <p className="font-bold">{link.title}</p>
                <p className="text-sm text-gray-400">{link.url}</p>
              </div>
              <button 
                onClick={() => handleDelete(link.id)}
                className="rounded bg-red-500/10 px-4 py-2 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
              >
                Apagar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}