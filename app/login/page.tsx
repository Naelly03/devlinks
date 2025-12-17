'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleLogin() {
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError('Erro ao entrar. Verifique e-mail e senha.')
    } else {
      router.push('/admin') 
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-xl border border-gray-100">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">Login Admin</h1>
        
        {error && (
          <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600 border border-red-100">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Seu e-mail"
            className="rounded-lg border border-gray-300 bg-gray-50 p-3 text-gray-900 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Sua senha"
            className="rounded-lg border border-gray-300 bg-gray-50 p-3 text-gray-900 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          <button
            onClick={handleLogin}
            className="mt-2 rounded-lg bg-purple-600 p-3 font-bold text-white hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200"
          >
            Entrar
          </button>
        </div>
      </div>
    </div>
  )
}