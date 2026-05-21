'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/store/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth()
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (isAuthenticated) router.replace('/')
  }, [isAuthenticated, router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const ok = login(password)
    if (ok) {
      router.replace('/')
    } else {
      setError(true)
      setPassword('')
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ backgroundColor: '#fdf6ec' }}
    >
      <div
        className="w-full max-w-sm rounded-3xl px-8 py-10 flex flex-col items-center gap-6"
        style={{ backgroundColor: '#fff8f0', border: '1px solid #e8d5b0' }}
      >
        {/* Logo */}
        <Image
          src="/pizza-lescapade-medias/identite/logo-rond-lescapade.jpg"
          alt="Pizza L'Escapade"
          width={80}
          height={80}
          className="rounded-full object-cover"
          priority
        />

        <div className="text-center">
          <h1
            style={{
              fontFamily: 'var(--font-dancing), cursive',
              fontSize: '2rem',
              color: '#7a5c2e',
            }}
          >
            L'Escapade
          </h1>
          <p className="text-xs mt-1" style={{ color: '#9a7c4e' }}>
            Accès en mode test
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError(false)
              }}
              autoFocus
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff size={15} style={{ color: '#9a7c4e' }} />
              ) : (
                <Eye size={15} style={{ color: '#9a7c4e' }} />
              )}
            </button>
          </div>

          {error && (
            <p className="text-red-500 text-xs text-center -mt-1">
              Mot de passe incorrect
            </p>
          )}

          <Button type="submit" size="lg" className="w-full" disabled={!password}>
            Accéder →
          </Button>
        </form>
      </div>
    </div>
  )
}
