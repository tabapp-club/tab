import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { config } from '@/lib/config';

interface AIAnalysisApiResponse {
  success: boolean;
  data: any;
  message?: string;
}

interface UseAIAnalysisProps {
  cardType: string;
  filterDays?: number;
  dateRange?: { from: Date | null; to: Date | null };
  enabled?: boolean;
}

export function useAIAnalysis({ cardType, filterDays, dateRange, enabled = true }: UseAIAnalysisProps) {
  const { user } = useAuth();

  const getTypeParam = (cardType: string): string => {
    switch (cardType) {
      case "Total Patients/Clients":
        return "all_customers";
      case "Total Business":
        return "total_revenue";
      case "New patients/clients":
        return "new_customers";
      case "Retained patients/clients":
        return "retained_customers";
      case "Active patients/clients":
        return "active_customers";
      case "Inactive patients/clients":
        return "inactive_customers";
      default:
        return "all_customers";
    }
  };

  return useQuery<AIAnalysisApiResponse, Error>({
    queryKey: ['ai-analysis', cardType, filterDays, dateRange?.from, dateRange?.to],
    queryFn: async () => {
      if (!user?.accessToken) {
        throw new Error('Authentication required');
      }

      const url = `${config.api.baseURL}/dashboard/v1/overview/ai_analysis`;
      const params = new URLSearchParams();

      params.append('type_', getTypeParam(cardType));

      if (dateRange?.from && dateRange?.to) {
        params.append('start_date', format(dateRange.from, 'yyyy-MM-dd'));
        params.append('end_date', format(dateRange.to, 'yyyy-MM-dd'));
      } else if (filterDays) {
        params.append('filter_days', filterDays.toString());
      }

      const response = await fetch(`${url}?${params.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.accessToken}`
        }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `HTTP error! status: ${response.status}`);
      }

      // Validate that the response has the expected structure
      if (!result.data || typeof result.data !== 'object') {
        throw new Error('Invalid response format from AI analysis API');
      }

      return result;
    },
    enabled: enabled && !!user?.accessToken,
    staleTime: 10 * 60 * 1000, // 10 minutes for AI analysis (expensive operation)
    gcTime: 30 * 60 * 1000, // 30 minutes in cache
    retry: 1, // Only retry once for AI analysis
  });
}
