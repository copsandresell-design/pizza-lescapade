import { createServiceClient } from './service'

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
  return (
    url.startsWith('https://') &&
    !url.includes('xxxx') &&
    key.length > 20 &&
    !key.includes('...')
  )
}

export function getDb() {
  return createServiceClient()
}
