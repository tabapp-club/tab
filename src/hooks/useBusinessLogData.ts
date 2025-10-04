"use client";

import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';

export interface BusinessLogEntry {
  id: string;
  customerPhone: string;
  customerName: string;
  products: Array<{
    name: string;
    quantity: number;
    price: number;
    discount: number;
    customFields: Record<string, any>;
  }>;
  totalAmount: number;
  timestamp: Date;
  isNewCustomer: boolean;
  customer_status?: 'new' | 'returning';
}



// API functions
const fetchBusinessLogEntries = async (
  token: string,
  businessId: string,
  page = 1,
  limit = 10,
  status?: 'new' | 'returning'
): Promise<{
  data: BusinessLogEntry[];
  has_next: boolean;
  total_entries_count: number;
  filtered_entries_count: number;
  total_pages: number;
  current_page: number;
  limit: number;
}> => {
  const response = await api.business.getBusinessLogEntries(token, businessId, page, limit, status);
  console.log('API Response:', response);
  console.log('Response data:', response?.data);
  console.log('Result array:', response?.data?.result);
  const rawEntries = Array.isArray(response?.data?.result) ? response.data.result : [];
  console.log('Raw entries:', rawEntries);
  console.log('Raw entries length:', rawEntries.length);

  const normalizeDate = (value?: string | null): Date => {
    if (!value) {
      return new Date();
    }

    const trimmed = value.trim();

    try {
      const isoCandidate = trimmed.includes('T') ? trimmed : trimmed.replace(' ', 'T');
      const hasZone = /([Zz]|[\+\-]\d{2}:?\d{2})$/.test(isoCandidate);
      const normalized = hasZone ? isoCandidate : `${isoCandidate}Z`;
      const parsed = new Date(normalized);
      if (!isNaN(parsed.getTime())) {
        return parsed;
      }
    } catch (error) {
      console.warn('Failed to normalise date', value, error);
    }

    const fallback = new Date(trimmed);
    return isNaN(fallback.getTime()) ? new Date() : fallback;
  };

  const entries = rawEntries.map((entry: any) => {
    const issuedAt = entry?.entry?.issued_at || entry?.issued_date || entry?.created_at;

    const timestamp = normalizeDate(issuedAt);

    const products = Array.isArray(entry?.items)
      ? entry.items.map((item: any) => {
          const rawQuantity = Number(item?.quantity) || 0;
          const rawUnitPrice = typeof item?.unit_price === 'number'
            ? item.unit_price
            : (typeof item?.amounts?.line_total === 'number' && rawQuantity > 0)
              ? item.amounts.line_total / rawQuantity
              : 0;

          return {
            name: item?.name || 'Unnamed item',
            quantity: rawQuantity,
            price: rawUnitPrice,
            discount: item?.discount || 0,
            customFields: item?.metadata || {},
          };
        })
      : [];

    return {
      id: String(entry?._id || entry?.id || Date.now()),
      customerPhone: entry?.buyer?.contact?.phone || '',
      customerName: entry?.buyer?.legal_name || '',
      products,
      totalAmount: Number(entry?.totals?.grand_total) || 0,
      customFields: {
        gst: entry?.seller?.gstin || entry?.buyer?.gstin || '',
        discount: Number(entry?.totals?.discounts_total) || 0,
        issued_at: timestamp.toISOString(),
      },
      timestamp,
      isNewCustomer: false,
      customer_status: entry?.customer_status || (entry?.metadata?.isNewCustomer ? 'new' : 'returning'),
    };
  });
  return {
    data: entries,
    has_next: response.data?.has_next || false,
    total_entries_count: response.data?.total_entries_count || 0,
    filtered_entries_count: response.data?.filtered_entries_count || 0,
    total_pages: response.data?.total_pages || 0,
    current_page: response.data?.current_page || 1,
    limit: response.data?.limit || limit
  };
};

const addBusinessLogEntry = async (token: string, businessId: string, entry: Omit<BusinessLogEntry, 'id' | 'timestamp'>): Promise<BusinessLogEntry> => {
  // Transform to API payload
  const apiPayload = {
    entry: {
      number: `INV-${Date.now()}`,
      status: "DRFT",
      type: "SALE",
      issued_at: new Date().toISOString(),
      currency: "INR"
    },
    buyer: {
      legal_name: entry.customerName,
      trade_name: entry.customerName,
      gstin: null,
      contact: {
        phone: entry.customerPhone,
        email: null
      }
    },
    totals: {
      items_subtotal: entry.products.reduce((sum, p) => sum + (p.quantity * p.price), 0),
      discounts_total: entry.products.reduce((sum, p) => sum + (p.quantity * p.price * (p.discount || 0) / 100), 0),
      tax_total: 0,
      rounding: 0,
      grand_total: entry.totalAmount,
      paid_total: 0,
      balance_due: entry.totalAmount
    },
    items: entry.products.map((product, index) => ({
      line_id: `ITEM-${index + 1}`,
      name: product.name,
      sku: null,
      category: "General",
      quantity: product.quantity,
      unit_price: product.price,
      discount: product.discount || 0,
      tax_rate: 0,
      metadata: {}
    })),
    payments: [],
    source: "business-log",
    ingestion_id: `ING-${Date.now()}`,
    metadata: {
      isNewCustomer: entry.isNewCustomer,
      submitted_at: new Date().toISOString(),
      total_products: entry.products.length
    }
  };

  const response = await api.business.createBusinessEntry(token, businessId, apiPayload);
  return {
    id: response.data.id,
    ...entry,
    timestamp: new Date()
  };
};

const updateBusinessLogEntry = async (token: string, businessId: string, id: string, updates: Partial<BusinessLogEntry>): Promise<BusinessLogEntry> => {
  // For update, we'd need to transform back to API format, but keeping simple for now
  const response = await api.business.updateBusinessEntry(token, businessId, id, updates);

  // Check if the response is successful
  if (!response || !response.data) {
    throw new Error('Invalid response from server');
  }

  return {
    ...response.data,
    timestamp: new Date(response.data.timestamp)
  };
};

const deleteBusinessLogEntry = async (token: string, businessId: string, id: string): Promise<void> => {
  await api.business.deleteBusinessEntry(token, businessId, id);
};

export function useBusinessLogData(limit = 10, page = 1, status?: 'new' | 'returning') {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const token = user?.accessToken;
  const businessId = user?.business_id;



  // Fetch all entries
  console.log('useBusinessLogData hook called with:', { businessId, limit, page, status, token: !!token });
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['businessEntries', businessId, limit, page, status],
    queryFn: async () => {
      console.log('Query function executing - Fetching business entries:', { token: !!token, businessId, page, status });

      let currentBusinessId = businessId;
      const currentToken = token;

      // If businessId is missing but we have token, try to fetch it
      if (!currentBusinessId && currentToken) {
        console.log('BusinessId missing, fetching...');
        try {
          const businessesResponse = await api.business.getBusinesses(currentToken);
          if (businessesResponse.data && businessesResponse.data.length > 0) {
            currentBusinessId = businessesResponse.data[0]._id;
            console.log('Fetched businessId:', currentBusinessId);
          }
        } catch (error) {
          console.warn('Failed to fetch businessId:', error);
          throw new Error('Failed to get business ID');
        }
      }

      if (!currentToken || !currentBusinessId) {
        throw new Error('Not authenticated or no business ID');
      }

      return fetchBusinessLogEntries(currentToken, currentBusinessId, page, limit, status);
    },
    enabled: !!token, // Enable as long as we have token
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Listen for custom events to refresh data
  useEffect(() => {
    const handleBusinessLogUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ['businessEntries'] });
    };

    window.addEventListener('businessLogUpdated', handleBusinessLogUpdate);

    return () => {
      window.removeEventListener('businessLogUpdated', handleBusinessLogUpdate);
    };
  }, [queryClient, businessId]);

  // Add entry mutation
  const addEntryMutation = useMutation({
    mutationFn: (entry: Omit<BusinessLogEntry, 'id' | 'timestamp'>) => {
      if (!token || !businessId) throw new Error('Not authenticated');
      return addBusinessLogEntry(token, businessId, entry);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessEntries'] });
    },
  });

  // Update entry mutation
  const updateEntryMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<BusinessLogEntry> }) => {
      if (!token || !businessId) throw new Error('Not authenticated');
      return updateBusinessLogEntry(token, businessId, id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessEntries'] });
    },
  });

  // Delete entry mutation
  const deleteEntryMutation = useMutation({
    mutationFn: (id: string) => {
      if (!token || !businessId) throw new Error('Not authenticated');
      return deleteBusinessLogEntry(token, businessId, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessEntries'] });
    },
  });

  console.log('Hook data:', data);
  console.log('Hook data.data:', data?.data);
  console.log('Hook isLoading:', isLoading);
  console.log('Hook error:', error);

  return {
    data: Array.isArray(data?.data) ? data.data : [],
    hasNext: data?.has_next || false,
    totalEntriesCount: data?.total_entries_count || 0,
    filteredEntriesCount: data?.filtered_entries_count || 0,
    totalPages: data?.total_pages || 0,
    currentPage: data?.current_page || 1,
    limit: data?.limit || limit,
    isLoading,
    error,
    refetch,
    addEntry: addEntryMutation.mutateAsync,
    updateEntry: updateEntryMutation.mutateAsync,
    deleteEntry: deleteEntryMutation.mutateAsync,
    isAdding: addEntryMutation.isPending,
    isUpdating: updateEntryMutation.isPending,
    isDeleting: deleteEntryMutation.isPending,
  };
}
