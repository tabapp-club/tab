// Cache versioning for better control
const CACHE_VERSION = 'v1.0.1';
const STATIC_CACHE_NAME = `static-${CACHE_VERSION}`;
const DYNAMIC_CACHE_NAME = `dynamic-${CACHE_VERSION}`;

// Only cache static assets - be very conservative
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  '/favicon.svg',
  // Add specific static assets that don't change frequently
];

// Routes that should NEVER be cached (dynamic business data)
const NO_CACHE_ROUTES = [
  /\/api\//,
  /\/_next\/data\//, // Next.js data routes
  /\/customer\//, // Dynamic customer pages
];

// Routes that can be cached aggressively (static assets)
const STATIC_ROUTES = [
  /\/_next\/static\//,
  /\/icons\//,
  /\/favicon/,
];

// Install event - only cache essential static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing');
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .catch((error) => {
        console.log('Static cache install failed:', error);
      })
  );
  // Force activation of new service worker
  self.skipWaiting();
});

// Fetch event - implement selective caching strategy
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Never cache API routes or dynamic data
  if (NO_CACHE_ROUTES.some(pattern => pattern.test(url.pathname))) {
    // Network-first for API calls - always try fresh data
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Only cache successful GET requests briefly
          if (response.ok && event.request.method === 'GET') {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
              // Add cache expiry header (1 minute for API data)
              const headers = new Headers(responseClone.headers);
              headers.set('sw-cache-timestamp', Date.now().toString());
              headers.set('sw-cache-expiry', (Date.now() + 60 * 1000).toString());

              const modifiedResponse = new Response(responseClone.body, {
                status: responseClone.status,
                statusText: responseClone.statusText,
                headers: headers
              });
              cache.put(event.request, modifiedResponse);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache only for GET requests
          if (event.request.method === 'GET') {
            return caches.match(event.request).then((cachedResponse) => {
              if (cachedResponse) {
                // Check if cached response is still fresh (within 1 minute)
                const cacheTimestamp = cachedResponse.headers.get('sw-cache-timestamp');
                if (cacheTimestamp) {
                  const age = Date.now() - parseInt(cacheTimestamp);
                  if (age < 60 * 1000) { // 1 minute
                    return cachedResponse;
                  }
                }
              }
              // No fresh cache available
              return new Response('Network unavailable', { status: 503 });
            });
          }
          return new Response('Network unavailable', { status: 503 });
        })
    );
    return;
  }

  // Cache-first for static assets
  if (STATIC_ROUTES.some(pattern => pattern.test(url.pathname))) {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          if (response) {
            return response;
          }
          return fetch(event.request).then((response) => {
            if (response.ok) {
              const responseClone = response.clone();
              caches.open(STATIC_CACHE_NAME).then((cache) => {
                cache.put(event.request, responseClone);
              });
            }
            return response;
          });
        })
    );
    return;
  }

  // Network-first for navigation and other requests
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache navigation requests briefly
        if (response.ok && event.request.destination === 'document') {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache for navigation
        if (event.request.destination === 'document') {
          return caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || caches.match('/');
          });
        }
        return new Response('Network unavailable', { status: 503 });
      })
  );
});

// Activate event - clean up old caches and claim clients
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating');
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Take control of all clients immediately
      self.clients.claim()
    ])
  );
});

// Message event - handle cache invalidation and updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    console.log('Clearing all caches');
    caches.keys().then(names => {
      names.forEach(name => caches.delete(name));
    });
  }

  if (event.data && event.data.type === 'CLEAR_DYNAMIC_CACHE') {
    console.log('Clearing dynamic cache');
    caches.delete(DYNAMIC_CACHE_NAME);
  }

  if (event.data && event.data.type === 'CHECK_CACHE_STATUS') {
    // Respond to cache status check
    const port = event.ports[0];
    port.postMessage({ fromCache: false }); // We're network-first, so usually not from cache
  }
});

// Handle background sync - only for critical data
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  console.log('Background sync triggered - refreshing critical data');
  // Only sync critical data, not all cached data
  return Promise.resolve();
}

// Periodic cache cleanup - run every hour
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'cache-cleanup') {
    event.waitUntil(cleanupExpiredCache());
  }
});

function cleanupExpiredCache() {
  console.log('Running periodic cache cleanup');
  return caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
    return cache.keys().then((requests) => {
      const deletePromises = requests.map((request) => {
        return cache.match(request).then((response) => {
          if (response) {
            const cacheTimestamp = response.headers.get('sw-cache-timestamp');
            if (cacheTimestamp) {
              const age = Date.now() - parseInt(cacheTimestamp);
              // Delete cache entries older than 5 minutes
              if (age > 5 * 60 * 1000) {
                console.log('Deleting expired cache entry:', request.url);
                return cache.delete(request);
              }
            }
          }
        });
      });
      return Promise.all(deletePromises);
    });
  });
}

// Handle push notifications - only for important updates
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body || 'New update available',
    icon: '/icons/icon-192x192.svg',
    badge: '/icons/icon-72x72.svg',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
      url: data.url || '/dashboard'
    },
    actions: [
      {
        action: 'view',
        title: 'View',
        icon: '/icons/icon-96x96.svg'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/icons/icon-96x96.svg'
      }
    ],
    // Auto-hide after 10 seconds
    requireInteraction: false,
    silent: false
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Business Dashboard', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'view') {
    const url = event.notification.data?.url || '/dashboard';
    event.waitUntil(
      clients.openWindow(url)
    );
  } else if (event.action === 'dismiss') {
    // Just close the notification
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Cache size management - prevent cache from growing too large
function enforceCacheSizeLimit(cacheName, maxEntries = 50) {
  return caches.open(cacheName).then((cache) => {
    return cache.keys().then((keys) => {
      if (keys.length > maxEntries) {
        // Delete oldest entries (simple FIFO)
        const entriesToDelete = keys.slice(0, keys.length - maxEntries);
        return Promise.all(
          entriesToDelete.map(key => cache.delete(key))
        );
      }
    });
  });
}

// Clean up function called periodically
function performMaintenance() {
  console.log('Performing service worker maintenance');

  // Enforce cache size limits
  enforceCacheSizeLimit(DYNAMIC_CACHE_NAME, 30); // Max 30 dynamic entries
  enforceCacheSizeLimit(STATIC_CACHE_NAME, 20);  // Max 20 static entries

  // Clean expired entries
  return cleanupExpiredCache();
}

// Run maintenance every 30 minutes when service worker is active
setInterval(performMaintenance, 30 * 60 * 1000);
