'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { addLink, deleteLink, getLinks, updateLink } from '../actions'

type Link = {
  id: string
  title: string
  url: string
}

export default function Admin() {
  const [links, setLinks] = useState<Link[]>([])
  const [loading, setLoading] = useState(true)
  const [editingLink, setEditingLink] = useState<Link | null>(null) 
  const router = useRouter()

  const [titleInput, setTitleInput] = useState('')
  const [urlInput, setUrlInput] = useState('')

  useEffect(() => {
    async function checkUser() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
      } else {
        fetchLinks()
      }
    }
    checkUser()
  }, [])

  async function fetchLinks() {
    const data = await getLinks()
    setLinks(data)
    setLoading(false)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault() 

    if (editingLink) {
      await updateLink(editingLink.id, titleInput, urlInput)
      setEditingLink(null) 
    } else {
      const formData = new FormData()
      formData.append('title', titleInput)
      formData.append('url', urlInput)
      await addLink(formData)
    }
    setTitleInput('')
    setUrlInput('')
    await fetchLinks()
  }

  function handleEditClick(link: Link) {
    setEditingLink(link)
    setTitleInput(link.title)
    setUrlInput(link.url)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleCancelEdit() {
    setEditingLink(null)
    setTitleInput('')
    setUrlInput('')
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
            Sair
          </button>
        </div>

        <form onSubmit={handleSave} className="mb-8 rounded-lg bg-gray-800 p-6 border border-gray-700">
          <h2 className="mb-4 text-xl font-bold text-purple-400">
            {editingLink ? `Editando: ${editingLink.title}` : 'Adicionar Novo Link'}
          </h2>
          
          <div className="flex flex-col gap-3 md:flex-row">
            <input
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              placeholder="Título (ex: Instagram)"
              required
              className="w-full md:w-1/3 rounded bg-gray-700 p-3 outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            />
            <input
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="URL (ex: https://instagram.com/...)"
              required
              className="flex-1 rounded bg-gray-700 p-3 outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            />
          </div>

          <div className="mt-4 flex gap-2">
            <button 
              type="submit" 
              className={`rounded px-6 py-2 font-bold transition-colors ${
                editingLink ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {editingLink ? 'Atualizar Link' : 'Salvar Novo'}
            </button>

            {editingLink && (
              <button 
                type="button" 
                onClick={handleCancelEdit}
                className="rounded bg-gray-600 px-6 py-2 font-bold hover:bg-gray-500 transition-colors"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>

        {/* Lista de Links */}
        <div className="space-y-4">
          {links.map((link) => (
            <div key={link.id} className={`flex items-center justify-between rounded-lg p-4 border border-gray-700 transition-all ${
              editingLink?.id === link.id ? 'bg-gray-700 ring-2 ring-blue-500' : 'bg-gray-800'
            }`}>
              <div className="flex-1 pr-4">
                <p className="font-bold text-lg">{link.title}</p>
                <p className="text-sm text-gray-400 truncate">{link.url}</p>
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => handleEditClick(link)}
                  className="rounded bg-blue-500/20 px-3 py-2 text-blue-300 hover:bg-blue-500 hover:text-white transition-all"
                >
                  Editar
                </button>
                <button 
                  onClick={async () => {
                    if(confirm('Tem certeza que deseja apagar?')) {
                      await deleteLink(link.id)
                      fetchLinks()
                    }
                  }}
                  className="rounded bg-red-500/20 px-3 py-2 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                >
                  Apagar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}