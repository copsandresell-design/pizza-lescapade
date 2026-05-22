'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import * as Dialog from '@radix-ui/react-dialog'
import { X, Mail, Lock, UtensilsCrossed, AlertCircle } from 'lucide-react'
import { useManagerAuth } from '@/store/manager-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Props {
  open: boolean
  onClose: () => void
}

export function ManagerLoginModal({ open, onClose }: Props) {
  const { login } = useManagerAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error: loginError } = await login(email, password)

    setLoading(false)

    if (loginError) {
      setError('Identifiants incorrects')
      return
    }

    onClose()
    router.push('/admin/orders')
  }

  const handleClose = () => {
    setEmail('')
    setPassword('')
    setError(null)
    onClose()
  }

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && handleClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-3xl p-8 shadow-2xl focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
          style={{ backgroundColor: '#fdf6ec', border: '1px solid #e8d5b0' }}
          aria-describedby={undefined}
        >
          <Dialog.Title className="sr-only">Espace Gérant</Dialog.Title>

          {/* Close */}
          <Dialog.Close asChild>
            <button
              className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-[#e8d5b0] transition-colors"
              aria-label="Fermer"
            >
              <X size={16} style={{ color: '#9a7c4e' }} />
            </button>
          </Dialog.Close>

          {/* Header */}
          <div className="flex flex-col items-center gap-3 mb-7">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#f5e9d2', border: '1px solid #e8d5b0' }}
            >
              <UtensilsCrossed size={22} style={{ color: '#7a5c2e' }} />
            </div>
            <div className="text-center">
              <h2
                style={{ fontFamily: 'var(--font-dancing), cursive', fontSize: '1.6rem', color: '#7a5c2e' }}
              >
                Espace Gérant
              </h2>
              <p className="text-xs mt-0.5" style={{ color: '#9a7c4e' }}>
                Pizza L'Escapade · Back-office
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#9a7c4e' }} />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(null) }}
                autoFocus
                required
                className="pl-9"
              />
            </div>

            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#9a7c4e' }} />
              <Input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(null) }}
                required
                className="pl-9"
              />
            </div>

            {error && (
              <p className="flex items-center gap-1.5 text-red-500 text-xs">
                <AlertCircle size={12} /> {error}
              </p>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full mt-1"
              disabled={loading || !email || !password}
            >
              {loading ? 'Connexion…' : 'Se connecter'}
            </Button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
