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

  if (loading) return <div className="p-10 text-gray-600 text-center">Carregando painel...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 text-gray-800">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Painel Admin</h1>
          <button 
            onClick={async () => {
              await supabase.auth.signOut()
              router.push('/')
            }}
            className="w-full sm:w-auto rounded border border-red-200 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            Sair (Logout)
          </button>
        </div>

        <form onSubmit={handleSave} className="mb-8 rounded-xl bg-white p-4 md:p-6 border border-gray-100 shadow-lg">
          <h2 className="mb-4 text-xl font-bold text-purple-600">
            {editingLink ? `Editando: ${editingLink.title}` : 'Adicionar Novo Link'}
          </h2>
          
          <div className="flex flex-col gap-3">
            <input
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              placeholder="Título (ex: Instagram)"
              required
              className="w-full rounded-lg border border-gray-200 bg-gray-50 p-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
            />
            <input
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="URL (ex: https://instagram.com/...)"
              required
              className="w-full rounded-lg border border-gray-200 bg-gray-50 p-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
            />
          </div>

          <div className="mt-4 flex flex-col sm:flex-row gap-2">
            <button 
              type="submit" 
              className={`w-full sm:w-auto rounded-lg px-6 py-3 font-bold text-white transition-all shadow-md ${
                editingLink ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200' : 'bg-green-600 hover:bg-green-700 shadow-green-200'
              }`}
            >
              {editingLink ? 'Atualizar Link' : 'Salvar Novo'}
            </button>

            {editingLink && (
              <button 
                type="button" 
                onClick={handleCancelEdit}
                className="w-full sm:w-auto rounded-lg bg-gray-200 px-6 py-3 font-bold text-gray-700 hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>

        <div className="space-y-4">
          {links.map((link) => (
            <div 
              key={link.id} 
              className={`flex flex-col gap-4 rounded-xl p-4 border transition-all sm:flex-row sm:items-center sm:justify-between shadow-sm ${
                editingLink?.id === link.id ? 'bg-white border-blue-500 ring-2 ring-blue-100' : 'bg-white border-gray-100 hover:border-purple-200 hover:shadow-md'
              }`}
            >
              <div className="flex-1 min-w-0">
                <p className="font-bold text-lg text-gray-800">{link.title}</p>
                <p className="text-sm text-gray-500 truncate block">{link.url}</p>
              </div>
              
              <div className="flex gap-2 w-full sm:w-auto">
                <button 
                  onClick={() => handleEditClick(link)}
                  className="flex-1 sm:flex-none rounded-lg bg-blue-50 px-4 py-2 text-center text-blue-600 hover:bg-blue-100 transition-all font-medium"
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
                  className="flex-1 sm:flex-none rounded-lg bg-red-50 px-4 py-2 text-center text-red-600 hover:bg-red-100 transition-all font-medium"
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