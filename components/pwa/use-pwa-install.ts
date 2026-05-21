'use client'
import { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export type InstallState =
  | 'loading'       // hydration pas encore finie
  | 'installed'     // déjà en mode standalone
  | 'installable'   // Android / Chrome : prompt dispo
  | 'ios'           // iOS Safari : instructions manuelles
  | 'unsupported'   // navigateur non compatible

export function usePwaInstall() {
  const [state, setState] = useState<InstallState>('loading')
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    // Déjà installée → mode standalone
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as { standalone?: boolean }).standalone === true

    if (isStandalone) {
      setState('installed')
      return
    }

    // iOS Safari
    const ua = navigator.userAgent.toLowerCase()
    const isIos = /iphone|ipad|ipod/.test(ua)
    const isSafari = /safari/.test(ua) && !/crios|fxios|opios|chrome/.test(ua)
    if (isIos && isSafari) {
      setState('ios')
      return
    }

    // Android / Chrome : écouter beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault()
      setPrompt(e as BeforeInstallPromptEvent)
      setState('installable')
    }
    window.addEventListener('beforeinstallprompt', handler)

    // Déjà installée via un autre chemin
    window.addEventListener('appinstalled', () => setState('installed'))

    // Si aucun prompt après 2 s → probablement non supporté
    const timeout = setTimeout(() => {
      setState((s) => (s === 'loading' ? 'unsupported' : s))
    }, 2000)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      clearTimeout(timeout)
    }
  }, [])

  const triggerInstall = async (): Promise<'accepted' | 'dismissed' | 'no-prompt'> => {
    if (!prompt) return 'no-prompt'
    await prompt.prompt()
    const { outcome } = await prompt.userChoice
    if (outcome === 'accepted') setState('installed')
    setPrompt(null)
    return outcome
  }

  return { state, triggerInstall }
}
