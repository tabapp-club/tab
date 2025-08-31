import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardApiResponse {
  success: boolean;
  data: {
    all_customers?: number;
    all_customers_prev?: number;
    all_customers_change?: number;
    total_revenue?: number;
    total_revenue_prev?: number;
    total_revenue_change?: number;
    new_customers?: number;
    new_customers_prev?: number;
    new_customers_change?: number;
    retained_customers?: number;
    retained_customers_prev?: number;
    retained_customers_change?: number;
    active_customers?: number;
    active_customers_prev?: number;
    active_customers_change?: number;
    inactive_customers?: number;
    inactive_customers_prev?: number;
    inactive_customers_change?: number;
  };
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

      const url = "https://api.tabapp.club/v1/business-data";
      const params = new URLSearchParams();

      if (dateRange?.from && dateRange?.to) {
        params.append('start_date', dateRange.from.toISOString().split('T')[0]);
        params.append('end_date', dateRange.to.toISOString().split('T')[0]);
      } else if (days !== undefined) {
        params.append('filter_days', days.toString());
      }

      const finalUrl = params.toString() ? `${url}?${params.toString()}` : url;

      const response = await fetch(finalUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch dashboard data: ${response.status}`);
      }

      const result = await response.json();
      return result;
    },
    enabled: !!user?.accessToken,
    staleTime: 2 * 60 * 1000, // 2 minutes for dashboard data
    gcTime: 5 * 60 * 1000, // 5 minutes in cache
  });
}
