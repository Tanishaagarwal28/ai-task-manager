'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      alert('Please enter email and password')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim(),
    })

    setLoading(false)

    if (error) {
      alert(error.message)
      return
    }

    router.push('/dashboard')
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-md rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:p-8">
        <h1 className="text-3xl font-bold">Login</h1>
        <p className="mt-2 text-slate-600">
          Sign in to access your dashboard.
        </p>

        <div className="mt-6 space-y-4">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-blue-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-blue-500"
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full rounded-xl bg-green-600 px-4 py-3 text-white hover:bg-green-700 disabled:opacity-60"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </div>
    </main>
  )
}