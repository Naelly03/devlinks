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
      console.log(error.message)
    } else {
      router.push('/admin') 
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md rounded-lg bg-gray-800 p-8 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-bold text-white">Login Admin</h1>
        
        {error && (
          <div className="mb-4 rounded bg-red-500/20 p-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Seu e-mail"
            className="rounded bg-gray-700 p-3 text-white outline-none focus:ring-2 focus:ring-purple-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Sua senha"
            className="rounded bg-gray-700 p-3 text-white outline-none focus:ring-2 focus:ring-purple-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          <button
            onClick={handleLogin}
            className="mt-2 rounded bg-purple-600 p-3 font-bold text-white hover:bg-purple-700 transition-colors"
          >
            Entrar
          </button>
        </div>
      </div>
    </div>
  )
}