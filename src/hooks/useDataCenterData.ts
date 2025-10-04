import { useQuery } from '@tanstack/react-query';
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
}

export function useDataCenterData({ page, pageSize, filters }: UseDataCenterDataProps) {
  const { user } = useAuth();

  const isEnabled = !!user?.accessToken;

  return useQuery<DataCenterApiResponse, Error>({
    queryKey: ['data-center-data', page, pageSize, filters],
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
      console.log('DataCenter API response:', result);
      return result;
    },
    enabled: isEnabled,
    staleTime: filters.search ? 30 * 1000 : 1 * 60 * 1000, // 30 seconds for search, 1 minute for regular data
    gcTime: 3 * 60 * 1000, // 3 minutes in cache
    // Keep previous data while fetching new data to avoid loading states during search
    placeholderData: (previousData) => previousData,
    retry: (failureCount, error) => {
      // Don't retry if there's no access token
      if (error.message === 'No access token available') {
        return false;
      }
      return false;
    },
    // Return default data structure when query is disabled
    initialData: isEnabled ? undefined : {
      success: true,
      data: [],
      total: 0
    }
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
