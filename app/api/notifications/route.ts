import { NextResponse } from 'next/server'
import type { AppNotification } from '@/types'

declare global {
  // eslint-disable-next-line no-var
  var __notifications: Map<string, AppNotification> | undefined
}

if (!global.__notifications) {
  global.__notifications = new Map()
  const now = new Date().toISOString()
  const seed: AppNotification[] = [
    {
      id: 'seed-1',
      title: 'Pizza du moment : Tartufo',
      description: 'Truffe noire, burrata, jambon blanc — notre signature. Disponible toute la semaine !',
      image: '/pizza-lescapade-medias/pizzas/pizza-truffe-burrata.jpg',
      type: 'pizza',
      startDate: '2026-05-20',
      endDate: '2026-05-31',
      channels: ['inapp'],
      targetAudience: 'all',
      sentCount: 0,
      active: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'seed-2',
      title: 'Soirée Live Music · Samedi 25 mai',
      description: 'Concert live dès 19h dans notre guinguette. Entrée libre, ambiance garantie !',
      type: 'event',
      startDate: '2026-05-22',
      endDate: '2026-05-25',
      channels: ['inapp', 'push'],
      targetAudience: 'all',
      sentCount: 0,
      active: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'seed-3',
      title: 'Code promo ESCAPADE15',
      description: '-15% sur votre prochaine commande. Valable jusqu\'au 31 mai.',
      type: 'promo',
      startDate: '2026-05-15',
      endDate: '2026-05-31',
      channels: ['inapp', 'email'],
      targetAudience: 'all',
      sentCount: 247,
      active: true,
      createdAt: now,
      updatedAt: now,
    },
  ]
  seed.forEach((n) => global.__notifications!.set(n.id, n))
}

const store = global.__notifications

function isActive(n: AppNotification) {
  const today = new Date().toISOString().slice(0, 10)
  return n.active && n.startDate <= today && n.endDate >= today
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const activeOnly = searchParams.get('active') === 'true'

  let all = Array.from(store.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  if (activeOnly) all = all.filter(isActive)

  return NextResponse.json(all)
}

export async function POST(req: Request) {
  const body = await req.json()
  const { title, description, image, type, startDate, endDate, channels, targetAudience } = body

  if (!title || !description || !type || !startDate || !endDate) {
    return NextResponse.json({ error: 'Données manquantes' }, { status: 400 })
  }

  const now = new Date().toISOString()
  const notification: AppNotification = {
    id: Date.now().toString(),
    title,
    description,
    image: image || undefined,
    type,
    startDate,
    endDate,
    channels: channels ?? ['inapp'],
    targetAudience: targetAudience ?? 'all',
    sentCount: 0,
    active: true,
    createdAt: now,
    updatedAt: now,
  }

  store.set(notification.id, notification)
  return NextResponse.json(notification, { status: 201 })
}
