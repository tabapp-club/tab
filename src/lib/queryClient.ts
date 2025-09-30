import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache data for 30 seconds (much more conservative for business data)
      staleTime: 30 * 1000,
      // Keep data in cache for 2 minutes (reduced from 10 minutes)
      gcTime: 2 * 60 * 1000,
      // Retry failed requests 1 time
      retry: 1,
      // Refetch on window focus to get fresh data
      refetchOnWindowFocus: true,
      // Refetch on reconnect to get fresh data
      refetchOnReconnect: true,
      // Enable refetch on mount
      refetchOnMount: true,
      // Network mode: always prefer fresh data
      networkMode: 'online',
    },
  },
});
