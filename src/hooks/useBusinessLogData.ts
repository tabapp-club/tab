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
    customFields: Record<string, any>;
  }>;
  totalAmount: number;
  timestamp: Date;
  isNewCustomer: boolean;
}



// API functions
const fetchBusinessLogEntries = async (
  token: string,
  businessId: string,
  limit = 10,
  cursor?: string
): Promise<{ data: BusinessLogEntry[]; next_cursor?: string }> => {
  const response = await api.business.getBusinessLogEntries(token, businessId, limit, cursor);
  const rawEntries = Array.isArray(response?.data) ? response.data : [];
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
    };
  });
  return {
    data: entries,
    next_cursor: response.next_cursor
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
      discounts_total: 0,
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
      discount: 0,
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
  return {
    ...response.data,
    timestamp: new Date(response.data.timestamp)
  };
};

const deleteBusinessLogEntry = async (token: string, businessId: string, id: string): Promise<void> => {
  await api.business.deleteBusinessEntry(token, businessId, id);
};

export function useBusinessLogData(limit = 10, cursor?: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const token = user?.accessToken;
  const businessId = user?.business_id;



  // Fetch all entries
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['businessEntries', businessId, limit, cursor],
    queryFn: async () => {
      console.log('Fetching business entries:', { token: !!token, businessId });

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

      return fetchBusinessLogEntries(currentToken, currentBusinessId, limit, cursor);
    },
    enabled: !!token, // Enable as long as we have token
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Listen for custom events to refresh data
  useEffect(() => {
    const handleBusinessLogUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ['businessEntries', businessId] });
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
      queryClient.invalidateQueries({ queryKey: ['businessEntries', businessId] });
    },
  });

  // Update entry mutation
  const updateEntryMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<BusinessLogEntry> }) => {
      if (!token || !businessId) throw new Error('Not authenticated');
      return updateBusinessLogEntry(token, businessId, id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessEntries', businessId] });
    },
  });

  // Delete entry mutation
  const deleteEntryMutation = useMutation({
    mutationFn: (id: string) => {
      if (!token || !businessId) throw new Error('Not authenticated');
      return deleteBusinessLogEntry(token, businessId, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessEntries', businessId] });
    },
  });

  return {
    data: Array.isArray(data?.data) ? data.data : [],
    nextCursor: data?.next_cursor,
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
