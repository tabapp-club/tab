/**
 * Cache utilities for PWA - conservative caching management
 */

// Invalidate specific cache entries
export function invalidateCacheEntry(url: string): void {
  if ('serviceWorker' in navigator && 'caches' in window) {
    caches.open('dynamic-v1.0.1').then(cache => {
      cache.delete(url);
    });
  }
}

// Clear all dynamic cache (for when user logs out or major data changes)
export function clearDynamicCache(): void {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.controller?.postMessage({
      type: 'CLEAR_DYNAMIC_CACHE'
    });
  }
}

// Clear all caches (for app updates or user requests)
export function clearAllCaches(): void {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.controller?.postMessage({
      type: 'CLEAR_CACHE'
    });
  }

  // Also clear React Query cache
  if (typeof window !== 'undefined') {
    import('@tanstack/react-query').then(({ QueryClient }) => {
      const queryClient = new QueryClient();
      queryClient.clear();
    });
  }
}

// Force service worker update
export function updateServiceWorker(): void {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.controller?.postMessage({
      type: 'SKIP_WAITING'
    });
  }
}

// Check if app is running from cache vs network
export function isRunningFromCache(): Promise<boolean> {
  return new Promise((resolve) => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      // Send a message to service worker to check cache status
      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = (event) => {
        resolve(event.data.fromCache || false);
      };

      navigator.serviceWorker.controller.postMessage(
        { type: 'CHECK_CACHE_STATUS' },
        [messageChannel.port2]
      );

      // Fallback timeout
      setTimeout(() => resolve(false), 1000);
    } else {
      resolve(false);
    }
  });
}