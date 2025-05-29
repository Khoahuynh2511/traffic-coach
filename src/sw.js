import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst } from 'workbox-strategies';

// Precache all static assets
precacheAndRoute(self.__WB_MANIFEST);

// Clean up old caches
cleanupOutdatedCaches();

// Cache the law.json file
registerRoute(
  ({ request }) => request.destination === 'document' || request.url.endsWith('.json'),
  new StaleWhileRevalidate({
    cacheName: 'law-data',
  })
);

// Cache CDN resources
registerRoute(
  ({ url }) => url.origin === 'https://cdn.jsdelivr.net' || url.origin === 'https://cdn.tailwindcss.com',
  new StaleWhileRevalidate({
    cacheName: 'cdn-cache',
  })
);

// Cache images
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      {
        cacheKeyWillBeUsed: async ({ request }) => `${request.url}?v=1`
      }
    ]
  })
);

// Listen for install event
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker installed');
  self.skipWaiting();
});

// Listen for activate event
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker activated');
  event.waitUntil(self.clients.claim());
}); 