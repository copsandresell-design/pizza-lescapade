const CACHE_NAME = 'escapade-v1'

const PRECACHE = [
  '/',
  '/menu',
  '/track',
  '/offline',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/apple-touch-icon.png',
  '/images/devanture-enseigne.png',
  '/images/galerie-pizzas.png',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.allSettled(PRECACHE.map((url) => cache.add(url).catch(() => null)))
    )
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
      )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Ne pas intercepter les routes API ni les requêtes cross-origin
  if (url.pathname.startsWith('/api/') || url.origin !== self.location.origin) return

  // Navigation (HTML) : network-first → fallback cache → /offline
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const clone = res.clone()
          caches.open(CACHE_NAME).then((c) => c.put(request, clone))
          return res
        })
        .catch(() =>
          caches.match(request).then((cached) => cached || caches.match('/offline'))
        )
    )
    return
  }

  // Assets statiques (images, fonts, CSS, JS) : cache-first → network
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached
      return fetch(request).then((res) => {
        if (
          res.ok &&
          ['image', 'style', 'script', 'font'].includes(request.destination)
        ) {
          const clone = res.clone()
          caches.open(CACHE_NAME).then((c) => c.put(request, clone))
        }
        return res
      })
    })
  )
})
