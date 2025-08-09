import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';

export interface UserData {
  id: string;
  mobile: string;
  categories: string[];
  userType: string;
  visits: number;
  status: 'Active' | 'In Active';
  addedOn: string;
}

interface DataCenterFilters {
  category?: string[];
  userType?: string;
  no_of_visits_from?: number;
  no_of_visits_to?: number;
  status?: string;
  search?: string;
}

interface DataCenterApiResponse {
  success: boolean;
  data: any[];
  total: number;
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

  return useQuery<DataCenterApiResponse, Error>({
    queryKey: ['data-center-data', page, pageSize, filters],
    queryFn: async () => {
      if (!user?.accessToken) {
        throw new Error('No access token available');
      }

      const params = new URLSearchParams();
      params.append('page', String(page));
      params.append('page_size', String(pageSize));

      if (filters.category && filters.category.length > 0) {
        params.append('category', filters.category.join(','));
      }
      if (filters.userType) params.append('user_type', filters.userType);
      if (filters.no_of_visits_from !== undefined) params.append('no_of_visits_from', String(filters.no_of_visits_from));
      if (filters.no_of_visits_to !== undefined) params.append('no_of_visits_to', String(filters.no_of_visits_to));
      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);

      const url = `https://api.tabapp.club/v1/dashboard-data-centre?${params.toString()}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch data center data: ${response.status}`);
      }

      const result = await response.json();
      return result;
    },
    enabled: !!user?.accessToken,
    staleTime: filters.search ? 30 * 1000 : 1 * 60 * 1000, // 30 seconds for search, 1 minute for regular data
    gcTime: 3 * 60 * 1000, // 3 minutes in cache
    // Keep previous data while fetching new data to avoid loading states during search
    placeholderData: (previousData) => previousData
  });
}

// Helper function to map API response to UserData[]
export const mapApiDataToTable = (apiData: any[]): UserData[] => {
  return apiData.map((r: any) => {
    let status: 'Active' | 'In Active' = 'In Active';
    if (typeof r.status === 'string' && r.status.toLowerCase() === 'active') status = 'Active';
    return {
      id: r.user_id,
      mobile: r.mobile_number,
      categories: Array.isArray(r.category) ? r.category : [r.category],
      userType: r.user_type,
      visits: r.no_of_visits,
      status,
      addedOn: r.added_on,
    };
  });
};
