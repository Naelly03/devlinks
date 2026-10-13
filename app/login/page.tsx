'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Backdrop from '../components/Backdrop'
import LinkIcon from '../components/LinkIcon'
import ThemeToggle from '../components/ThemeToggle'

const fieldClass =
  'h-12 w-full rounded-xl border border-glass-border bg-field px-3.5 text-[15px] font-normal text-ink outline-none transition focus:border-accent focus:shadow-[0_0_0_3px_var(--ring)]'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return

    setError(null)
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError('Erro ao entrar. Verifique e-mail e senha.')
      setLoading(false)
    } else {
      router.push('/admin')
      router.refresh()
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-page px-5 py-6 text-ink">
      <Backdrop />
      <ThemeToggle className="absolute right-6 top-6 z-10 rounded-full" />

      <form
        onSubmit={handleLogin}
        className="glass fade-up relative z-10 w-full max-w-[400px] rounded-3xl p-8 shadow-[var(--shadow)] backdrop-blur-[22px]"
      >
        <div className="mb-[26px] flex flex-col items-center text-center">
          <LinkIcon kind="link" size={52} />
          <h1 className="mb-1.5 mt-[18px] font-display text-2xl font-bold tracking-tight">
            Login Admin
          </h1>
          <p className="text-sm text-muted">Acesso restrito ao painel</p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-4 rounded-xl border border-danger-border bg-danger-bg px-3.5 py-3 text-sm text-danger"
          >
            {error}
          </div>
        )}

        <div className="flex flex-col gap-3.5">
          <label className="flex flex-col gap-1.5 text-[13px] font-semibold text-muted">
            E-mail
            <input
              type="email"
              placeholder="Seu e-mail"
              className={fieldClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1.5 text-[13px] font-semibold text-muted">
            Senha
            <input
              type="password"
              placeholder="Sua senha"
              className={fieldClass}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-1.5 h-[50px] cursor-pointer rounded-xl bg-accent text-base font-bold text-accent-fg shadow-[0_10px_28px_-10px_var(--accent-glow)] transition hover:-translate-y-px disabled:opacity-70"
          >
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
          <Link href="/" className="text-center text-sm text-muted transition-colors hover:text-ink">
            ← Voltar para a página
          </Link>
        </div>
      </form>
    </div>
  )
}
