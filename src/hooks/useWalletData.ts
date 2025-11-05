import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import {
  WalletBalance,
  WalletTransactionsResponse,
  WalletSpendingBreakdown,
  WalletFilters,
  CreatePaymentRequest,
  PaymentResponse,
  PaymentStatusResponse,
} from '@/lib/api/types';
import {
  mockWalletBalance,
  getMockTransactionsResponse,
  getMockSpendingBreakdown,
  getMockPaymentResponse,
  getMockPaymentStatus,
} from './walletMockData';

// Use mock data in development or when API is not available
const USE_MOCK_DATA = process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

export function useWalletBalance() {
  const { user } = useAuth();

  return useQuery<{ message: string; data: WalletBalance }, Error>({
    queryKey: ['wallet-balance'],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
          message: 'Balance retrieved successfully',
          data: mockWalletBalance,
        };
      }
      
      if (!user?.accessToken) {
        throw new Error('No access token available');
      }
      return api.wallet.getBalance(user.accessToken);
    },
    enabled: !!user?.accessToken || USE_MOCK_DATA,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  });
}

export function useWalletTransactions(filters?: WalletFilters) {
  const { user } = useAuth();

  return useQuery<{ message: string; data: WalletTransactionsResponse }, Error>({
    queryKey: ['wallet-transactions', filters],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        return {
          message: 'Transactions retrieved successfully',
          data: getMockTransactionsResponse({
            type: filters?.type,
            category: filters?.category as any,
            page: filters?.page,
            page_size: filters?.page_size,
            start_date: filters?.start_date,
            end_date: filters?.end_date,
            filter_days: filters?.filter_days,
          }),
        };
      }
      
      if (!user?.accessToken) {
        throw new Error('No access token available');
      }
      return api.wallet.getTransactions(user.accessToken, filters);
    },
    enabled: !!user?.accessToken || USE_MOCK_DATA,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useWalletSpendingBreakdown(startDate?: string, endDate?: string) {
  const { user } = useAuth();

  return useQuery<{ message: string; data: WalletSpendingBreakdown }, Error>({
    queryKey: ['wallet-spending-breakdown', startDate, endDate],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 600));
        return {
          message: 'Spending breakdown retrieved successfully',
          data: getMockSpendingBreakdown(startDate, endDate),
        };
      }
      
      if (!user?.accessToken) {
        throw new Error('No access token available');
      }
      return api.wallet.getSpendingBreakdown(user.accessToken, startDate, endDate);
    },
    enabled: !!user?.accessToken || USE_MOCK_DATA,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreatePayment() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<{ message: string; data: PaymentResponse }, Error, CreatePaymentRequest>({
    mutationFn: async (data: CreatePaymentRequest) => {
      if (USE_MOCK_DATA) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        return {
          message: 'Payment created successfully',
          data: getMockPaymentResponse(data.amount, data.payment_method),
        };
      }
      
      if (!user?.accessToken) {
        throw new Error('No access token available');
      }
      return api.wallet.createPayment(user.accessToken, data);
    },
    onSuccess: () => {
      // Invalidate wallet balance to refetch after payment
      queryClient.invalidateQueries({ queryKey: ['wallet-balance'] });
      queryClient.invalidateQueries({ queryKey: ['wallet-transactions'] });
    },
  });
}

export function usePaymentStatus(paymentId: string | null) {
  const { user } = useAuth();

  return useQuery<{ message: string; data: PaymentStatusResponse }, Error>({
    queryKey: ['payment-status', paymentId],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        if (!paymentId) {
          throw new Error('Payment ID is required');
        }
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return {
          message: 'Payment status retrieved successfully',
          data: getMockPaymentStatus(paymentId),
        };
      }
      
      if (!user?.accessToken || !paymentId) {
        throw new Error('No access token or payment ID available');
      }
      return api.wallet.getPaymentStatus(user.accessToken, paymentId);
    },
    enabled: (!!user?.accessToken && !!paymentId) || (USE_MOCK_DATA && !!paymentId),
    refetchInterval: (query) => {
      const status = query.state.data?.data.status;
      // Poll every 2 seconds if pending, otherwise stop
      return status === 'pending' || status === 'processing' ? 2000 : false;
    },
  });
}

