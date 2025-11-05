import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api, DataCenterFilters } from '@/lib/api';

export interface UserData {
  id: string;
  mobile: string;
  categories: string[];
  userType: string;
  visits: number;
  status: 'Active' | 'In Active';
  addedOn: string;
}

interface DataCenterApiResponse {
  success: boolean;
  data: any[] | {
    data: any[];
    total: number;
    metrics?: any;
    categories?: Array<{ name: string; label: string }>;
  };
  total?: number;
  metrics?: any;
  categories?: Array<{ name: string; label: string }>;
}

interface UseDataCenterDataProps {
  page: number;
  pageSize: number;
  filters: DataCenterFilters;
  refreshTrigger?: number;
}

export function useDataCenterData({ page, pageSize, filters, refreshTrigger = 0 }: UseDataCenterDataProps) {
  const { user } = useAuth();

  const isEnabled = !!user?.accessToken;

  // Create stable query key to prevent unnecessary re-renders
  const queryKey = useMemo(() => [
    'data-center-data',
    page,
    pageSize,
    filters.search || '',
    Array.isArray(filters.category) ? filters.category.join(',') : (filters.category || ''),
    filters.userType || '',
    filters.status || '',
    filters.no_of_visits_from || '',
    filters.no_of_visits_to || '',
    refreshTrigger
  ], [page, pageSize, filters.search, filters.category, filters.userType, filters.status, filters.no_of_visits_from, filters.no_of_visits_to, refreshTrigger]);

  return useQuery<DataCenterApiResponse, Error>({
    queryKey,
    queryFn: async () => {
      if (!user?.accessToken) {
        throw new Error('No access token available');
      }

      const apiFilters: any = {
        page,
        page_size: pageSize,
        category: Array.isArray(filters.category) ? filters.category[0] : filters.category,
        user_type: (filters as any).userType, // Map userType to user_type
        no_of_visits_from: filters.no_of_visits_from,
        no_of_visits_to: filters.no_of_visits_to,
        status_filter: filters.status,
        search: filters.search,
      };

      const result = await api.dataCenter.getCustomers(user.accessToken, apiFilters);
      return result;
    },
    enabled: isEnabled,
    staleTime: filters.search ? 10 * 1000 : 5 * 60 * 1000, // 10 seconds for search, 5 minutes for regular data
    gcTime: 10 * 60 * 1000, // 10 minutes in cache
    // Keep previous data while fetching new data to avoid loading states during search
    placeholderData: (previousData) => previousData,
    // Reduce retries for faster failure feedback
    retry: (failureCount, error) => {
      // Don't retry if there's no access token
      if (error.message === 'No access token available') {
        return false;
      }
      // Retry only once for network errors
      return failureCount < 1;
    },
    // Return default data structure when query is disabled
    initialData: isEnabled ? undefined : {
      success: true,
      data: [],
      total: 0
    },
    // Add refetch on window focus for better UX
    refetchOnWindowFocus: false,
    // Add network mode for better offline handling
    networkMode: 'online'
  });
}

// Helper function to map API response to UserData[]
export const mapApiDataToTable = (apiData: any[]): UserData[] => {
  if (!Array.isArray(apiData)) {
    console.warn('mapApiDataToTable: Expected array but got:', typeof apiData, apiData);
    return [];
  }

  return apiData.map((r: any) => {
    let status: 'Active' | 'In Active' = 'In Active';
    if (typeof r.status === 'string' && r.status.toLowerCase() === 'active') status = 'Active';
    return {
      id: r.user_id || r.id || '',
      mobile: r.mobile_number || r.mobile || '',
      categories: Array.isArray(r.category) ? r.category : [r.category || ''],
      userType: r.user_type || r.userType || '',
      visits: r.no_of_visits || r.visits || 0,
      status,
      addedOn: r.added_on || r.addedOn || '',
    };
  });
};
