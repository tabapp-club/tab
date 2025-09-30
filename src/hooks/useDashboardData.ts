import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { BusinessDataResponse } from '@/lib/api/types';

interface DashboardApiResponse {
  message: string;
  data: BusinessDataResponse;
}

interface UseDashboardDataProps {
  days?: number;
  dateRange?: { from: Date | null; to: Date | null };
}

export function useDashboardData({ days, dateRange }: UseDashboardDataProps = {}) {
  const { user } = useAuth();

  return useQuery<DashboardApiResponse, Error>({
    queryKey: ['dashboard-data', days, dateRange?.from, dateRange?.to],
    queryFn: async () => {
      if (!user?.accessToken) {
        throw new Error('No access token available');
      }

      const filters = dateRange?.from && dateRange?.to ? {
        start_date: dateRange.from.toISOString().split('T')[0],
        end_date: dateRange.to.toISOString().split('T')[0],
      } : days !== undefined ? { filter_days: days } : undefined;

      const result = await api.business.getDashboardData(user.accessToken, filters);
      return result;
    },
    enabled: !!user?.accessToken,
    staleTime: 2 * 60 * 1000, // 2 minutes for dashboard data
    gcTime: 5 * 60 * 1000, // 5 minutes in cache
  });
}
