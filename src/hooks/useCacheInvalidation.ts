/**
 * Hook for cache invalidation - ensures fresh data after mutations
 */
import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { invalidateCacheEntry, clearDynamicCache } from '@/lib/cacheUtils';

export function useCacheInvalidation() {
  const queryClient = useQueryClient();

  // Invalidate specific query keys
  const invalidateQueries = useCallback((queryKey: string | string[]) => {
    queryClient.invalidateQueries({ queryKey: Array.isArray(queryKey) ? queryKey : [queryKey] });
  }, [queryClient]);

  // Invalidate all queries
  const invalidateAllQueries = useCallback(() => {
    queryClient.invalidateQueries();
  }, [queryClient]);

  // Clear React Query cache
  const clearQueryCache = useCallback(() => {
    queryClient.clear();
  }, [queryClient]);

  // Invalidate service worker cache for specific URL
  const invalidateServiceWorkerCache = useCallback((url: string) => {
    invalidateCacheEntry(url);
  }, []);

  // Clear all dynamic caches (service worker + React Query)
  const clearAllCaches = useCallback(() => {
    clearDynamicCache();
    queryClient.clear();
  }, [queryClient]);

  // Invalidate dashboard-related caches
  const invalidateDashboard = useCallback(() => {
    invalidateQueries(['dashboard', 'analytics', 'metrics']);
    invalidateServiceWorkerCache('/api/dashboard');
    invalidateServiceWorkerCache('/api/analytics');
  }, [invalidateQueries, invalidateServiceWorkerCache]);

  // Invalidate campaign-related caches
  const invalidateCampaigns = useCallback(() => {
    invalidateQueries(['campaigns', 'campaign']);
    invalidateServiceWorkerCache('/api/campaigns');
  }, [invalidateQueries, invalidateServiceWorkerCache]);

  // Invalidate customer-related caches
  const invalidateCustomers = useCallback(() => {
    invalidateQueries(['customers', 'customer']);
    invalidateServiceWorkerCache('/api/customers');
  }, [invalidateQueries, invalidateServiceWorkerCache]);

  return {
    invalidateQueries,
    invalidateAllQueries,
    clearQueryCache,
    invalidateServiceWorkerCache,
    clearAllCaches,
    invalidateDashboard,
    invalidateCampaigns,
    invalidateCustomers,
  };
}