/* ═══════════════════════════════════════════════════════
   হালখাতা ডিজিটাল — Service Worker
   Offline-first caching strategy
═══════════════════════════════════════════════════════ */

const CACHE_NAME = 'halkhata-v2';
const CACHE_URLS = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/sw.js',
  'https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&family=Tiro+Bangla:ital@0;1&display=swap'
];

// ─── Install: Cache core assets ───────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(CACHE_URLS);
    }).then(() => self.skipWaiting())
  );
});

// ─── Activate: Clean old caches ──────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// ─── Fetch: Network-first for API, Cache-first for assets ─
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // API calls: network first, fallback to stored offline response
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        // Return empty/offline response for API calls when offline
        if (url.pathname === '/api/dashboard') {
          return new Response(JSON.stringify({
            totalCustomers: 0, totalReceivable: 0, totalPaid: 0,
            overdueAmount: 0, overdueCount: 0, highRiskCustomers: 0,
            weeklyCredit: 0, weeklyDebit: 0, recentTransactions: [],
            offline: true
          }), { headers: { 'Content-Type': 'application/json' } });
        }
        if (url.pathname === '/api/customers') {
          return new Response('[]', { headers: { 'Content-Type': 'application/json' } });
        }
        if (url.pathname === '/api/transactions') {
          return new Response('[]', { headers: { 'Content-Type': 'application/json' } });
        }
        return new Response(JSON.stringify({ error: 'Offline', offline: true }),
          { status: 503, headers: { 'Content-Type': 'application/json' } });
      })
    );
    return;
  }

  // Static assets: Cache first, fallback to network
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type === 'opaque') return response;
        const cloned = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, cloned));
        return response;
      });
    }).catch(() => {
      // Return cached index.html for navigation requests
      if (event.request.mode === 'navigate') {
        return caches.match('/index.html');
      }
    })
  );
});

// ─── Background Sync (for offline transactions) ───────
self.addEventListener('sync', event => {
  if (event.tag === 'sync-transactions') {
    event.waitUntil(syncPendingTransactions());
  }
});

async function syncPendingTransactions() {
  // Notify all clients to trigger sync
  const clients = await self.clients.matchAll();
  clients.forEach(client => client.postMessage({ type: 'SYNC_REQUIRED' }));
}

// Listen for messages from client
self.addEventListener('message', event => {
  if (event.data === 'skipWaiting') self.skipWaiting();
});
