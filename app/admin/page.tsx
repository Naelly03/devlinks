'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase/client'
import { addLink, deleteLink, getLinks, reorderLinks, toggleLink, updateLink } from '../actions'
import Backdrop from '../components/Backdrop'
import LinkIcon, { getLinkKind } from '../components/LinkIcon'
import ThemeToggle from '../components/ThemeToggle'

type LinkItem = {
  id: string
  title: string
  url: string
  active: boolean
}

const fieldClass =
  'h-12 w-full rounded-xl border border-glass-border bg-field px-3.5 text-[15px] text-ink outline-none transition focus:border-accent focus:shadow-[0_0_0_3px_var(--ring)]'

const ghostButton =
  'h-11 cursor-pointer rounded-xl border border-glass-border bg-glass px-4 text-sm font-semibold text-ink transition-colors hover:bg-glass-hover'

export default function Admin() {
  const [links, setLinks] = useState<LinkItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<LinkItem | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [dragId, setDragId] = useState<string | null>(null)
  const [overId, setOverId] = useState<string | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const router = useRouter()

  const [titleInput, setTitleInput] = useState('')
  const [urlInput, setUrlInput] = useState('')

  async function fetchLinks() {
    const data = await getLinks()
    setLinks(data)
    setLoading(false)
  }

  useEffect(() => {
    getLinks().then((data) => {
      setLinks(data)
      setLoading(false)
    })
    return () => clearTimeout(toastTimer.current)
  }, [])

  function say(message: string) {
    setToast(message)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 2400)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (saving) return
    setSaving(true)

    if (editingLink) {
      await updateLink(editingLink.id, titleInput, urlInput)
      setEditingLink(null)
      say('Link atualizado')
    } else {
      const formData = new FormData()
      formData.append('title', titleInput)
      formData.append('url', urlInput)
      await addLink(formData)
      say('Link adicionado')
    }

    setTitleInput('')
    setUrlInput('')
    await fetchLinks()
    setSaving(false)
  }

  function handleEditClick(link: LinkItem) {
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

  async function handleConfirmDelete() {
    if (!deleteTarget) return
    const target = deleteTarget
    setDeleteTarget(null)

    await deleteLink(target.id)
    if (editingLink?.id === target.id) handleCancelEdit()
    say('Link apagado')
    fetchLinks()
  }

  async function handleToggle(link: LinkItem) {
    const active = !link.active
    setLinks((prev) => prev.map((l) => (l.id === link.id ? { ...l, active } : l)))
    try {
      await toggleLink(link.id, active)
      say(active ? 'Link ativado' : 'Link desativado')
    } catch {
      say('Erro ao atualizar o link')
      fetchLinks()
    }
  }

  async function handleDrop(targetId: string) {
    const from = dragId
    setDragId(null)
    setOverId(null)
    if (!from || from === targetId) return

    const next = links.slice()
    const a = next.findIndex((l) => l.id === from)
    const b = next.findIndex((l) => l.id === targetId)
    const [moved] = next.splice(a, 1)
    next.splice(b, 0, moved)
    setLinks(next)

    try {
      await reorderLinks(next.map((l) => l.id))
      say('Ordem atualizada')
    } catch {
      say('Erro ao salvar a ordem')
      fetchLinks()
    }
  }

  const activeLinks = links.filter((l) => l.active)

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-page text-muted">
        Carregando painel...
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-page text-ink">
      <Backdrop />

      <div className="relative z-10 px-6 pb-16 pt-7">
        <div className="fade-up mx-auto max-w-[1080px]">
          <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="mb-1 font-display text-[28px] font-bold tracking-tight">Painel Admin</h1>
              <p className="text-sm text-muted">
                {links.length} {links.length === 1 ? 'link' : 'links'} · {activeLinks.length}{' '}
                {activeLinks.length === 1 ? 'ativo' : 'ativos'}
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <Link href="/" className={`${ghostButton} flex items-center`}>
                Ver página
              </Link>
              <ThemeToggle className="rounded-xl" />
              <button
                onClick={async () => {
                  await supabase.auth.signOut()
                  router.push('/')
                  router.refresh()
                }}
                className="h-11 cursor-pointer rounded-xl border border-danger-border bg-transparent px-4 text-sm font-semibold text-danger transition-colors hover:bg-danger-bg"
              >
                Sair
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-start gap-7">
            <div className="flex min-w-0 flex-[1_1_480px] flex-col gap-7">
              <form
                onSubmit={handleSave}
                className={`glass flex flex-col gap-3.5 rounded-[22px] p-6 shadow-[var(--shadow)] backdrop-blur-[18px] transition-colors ${
                  editingLink ? 'border-accent' : ''
                }`}
              >
                <h2 className="font-display text-lg font-semibold text-accent-soft">
                  {editingLink ? `Editando: ${editingLink.title}` : 'Adicionar novo link'}
                </h2>
                <input
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  placeholder="Título (ex: Instagram)"
                  required
                  aria-label="Título"
                  className={fieldClass}
                />
                <input
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="URL (ex: https://instagram.com/...)"
                  required
                  aria-label="URL"
                  className={fieldClass}
                />
                <div className="flex flex-wrap gap-2.5">
                  <button
                    type="submit"
                    disabled={saving}
                    className="h-12 cursor-pointer rounded-xl bg-accent px-6 text-[15px] font-bold text-accent-fg shadow-[0_10px_28px_-10px_var(--accent-glow)] transition hover:brightness-110 disabled:opacity-70"
                  >
                    {saving ? 'Salvando…' : editingLink ? 'Atualizar link' : 'Salvar novo'}
                  </button>
                  {editingLink && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="h-12 cursor-pointer rounded-xl border border-glass-border bg-transparent px-[22px] text-[15px] font-semibold text-ink transition-colors hover:bg-glass-hover"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>

              <div>
                <div className="mb-3 flex items-baseline justify-between px-1">
                  <h2 className="font-display text-base font-semibold">Seus links</h2>
                  <span className="text-[13px] text-muted">Arraste para reordenar</span>
                </div>
                <div className="flex flex-col gap-2.5">
                  {links.length === 0 && (
                    <p className="px-1 text-sm text-muted">Nenhum link cadastrado ainda...</p>
                  )}
                  {links.map((link) => (
                    <div
                      key={link.id}
                      draggable
                      onDragStart={(e) => {
                        setDragId(link.id)
                        e.dataTransfer.effectAllowed = 'move'
                        try {
                          e.dataTransfer.setData('text/plain', link.id)
                        } catch {}
                      }}
                      onDragOver={(e) => {
                        e.preventDefault()
                        if (overId !== link.id) setOverId(link.id)
                      }}
                      onDrop={(e) => {
                        e.preventDefault()
                        handleDrop(link.id)
                      }}
                      onDragEnd={() => {
                        setDragId(null)
                        setOverId(null)
                      }}
                      className={`glass flex items-center gap-3 rounded-2xl py-3 pl-2 pr-3 transition hover:bg-glass-hover ${
                        dragId === link.id ? 'opacity-40' : ''
                      } ${
                        overId === link.id && dragId !== link.id
                          ? 'border-accent'
                          : editingLink?.id === link.id
                            ? 'border-accent-soft'
                            : ''
                      }`}
                    >
                      <span aria-hidden="true" className="flex cursor-grab px-0.5 py-1.5 text-muted">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <circle cx="9" cy="6" r="1.7" />
                          <circle cx="15" cy="6" r="1.7" />
                          <circle cx="9" cy="12" r="1.7" />
                          <circle cx="15" cy="12" r="1.7" />
                          <circle cx="9" cy="18" r="1.7" />
                          <circle cx="15" cy="18" r="1.7" />
                        </svg>
                      </span>
                      <div className={`flex ${link.active ? '' : 'opacity-45'}`}>
                        <LinkIcon kind={getLinkKind(link.title, link.url)} size={40} />
                      </div>
                      <div className={`min-w-0 flex-1 ${link.active ? '' : 'opacity-45'}`}>
                        <p className="text-[15px] font-semibold">{link.title}</p>
                        <p className="mt-0.5 truncate text-[13px] text-muted">{link.url}</p>
                      </div>
                      <button
                        role="switch"
                        aria-checked={link.active}
                        aria-label="Ativar link"
                        onClick={() => handleToggle(link)}
                        className={`relative h-6 w-[42px] flex-none cursor-pointer rounded-xl transition-colors ${
                          link.active ? 'bg-accent' : 'bg-[rgba(128,124,150,0.45)]'
                        }`}
                      >
                        <span
                          className={`absolute top-[3px] h-[18px] w-[18px] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.3)] transition-[left] ${
                            link.active ? 'left-[21px]' : 'left-[3px]'
                          }`}
                        />
                      </button>
                      <button
                        aria-label="Editar"
                        onClick={() => handleEditClick(link)}
                        className="flex h-[38px] w-[38px] flex-none cursor-pointer items-center justify-center rounded-[10px] text-muted transition-colors hover:bg-glass-hover hover:text-ink"
                      >
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                        </svg>
                      </button>
                      <button
                        aria-label="Apagar"
                        onClick={() => setDeleteTarget(link)}
                        className="flex h-[38px] w-[38px] flex-none cursor-pointer items-center justify-center rounded-[10px] text-muted transition-colors hover:bg-danger-bg hover:text-danger"
                      >
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18" />
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="sticky top-6 mx-auto w-[340px] max-w-full flex-none">
              <div className="mb-3 flex items-center gap-2 px-1 text-[13px] text-muted">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Preview ao vivo
              </div>
              <div className="relative h-[610px] overflow-hidden rounded-[38px] border-[6px] border-glass-border bg-page shadow-[var(--shadow)]">
                <div
                  className="absolute -left-[100px] -top-[120px] h-[340px] w-[340px] rounded-full"
                  style={{ background: 'radial-gradient(closest-side, var(--glow-1), transparent)' }}
                />
                <div className="relative flex flex-col items-center px-[18px] pb-[18px] pt-[52px]">
                  <div className="rounded-full bg-gradient-to-br from-accent-soft to-accent p-0.5">
                    <Image
                      src="https://github.com/Naelly03.png"
                      alt=""
                      width={72}
                      height={72}
                      className="block h-[72px] w-[72px] rounded-full border-[3px] border-page bg-glass object-cover"
                    />
                  </div>
                  <p className="mb-0.5 mt-3.5 font-display text-[19px] font-bold tracking-tight">Naelly Vitoria</p>
                  <p className="mb-[22px] text-[13px] text-muted">Developer &amp; Tech Enthusiast</p>
                  <div className="flex w-full flex-col gap-[9px]">
                    {activeLinks.length === 0 ? (
                      <p className="text-center text-[13px] text-muted">Nenhum link ativo</p>
                    ) : (
                      activeLinks.map((link) => (
                        <div
                          key={link.id}
                          className="flex items-center gap-2.5 rounded-[14px] border border-glass-border bg-glass py-[7px] pl-[7px] pr-3"
                        >
                          <LinkIcon kind={getLinkKind(link.title, link.url)} size={32} />
                          <span className="flex-1 truncate text-sm font-semibold">{link.title}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {deleteTarget && (
        <div
          onClick={() => setDeleteTarget(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-overlay p-5"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            role="alertdialog"
            aria-label="Apagar link"
            className="w-full max-w-[380px] rounded-3xl border border-glass-border bg-surface p-[26px] shadow-[var(--shadow)]"
          >
            <h2 className="mb-2 font-display text-[19px] font-semibold">Apagar link?</h2>
            <p className="mb-[22px] text-[15px] leading-normal text-muted">
              “{deleteTarget.title}” será removido da sua página pública. Essa ação não pode ser desfeita.
            </p>
            <div className="flex justify-end gap-2.5">
              <button
                onClick={() => setDeleteTarget(null)}
                className="h-[46px] cursor-pointer rounded-xl border border-glass-border bg-transparent px-5 text-[15px] font-semibold text-ink transition-colors hover:bg-glass-hover"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="h-[46px] cursor-pointer rounded-xl bg-[#e11d48] px-5 text-[15px] font-bold text-white transition hover:brightness-110"
              >
                Apagar
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div
          role="status"
          className="fixed left-1/2 top-5 z-[60] flex -translate-x-1/2 items-center gap-2.5 whitespace-nowrap rounded-[14px] border border-glass-border bg-surface px-[18px] py-3 text-sm font-semibold shadow-[var(--shadow)]"
        >
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          {toast}
        </div>
      )}
    </div>
  )
}
