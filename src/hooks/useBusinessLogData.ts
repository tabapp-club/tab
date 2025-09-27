"use client";

import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';

interface BusinessLogEntry {
  id: string;
  customerPhone: string;
  customerName: string;
  products: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  customFields: Record<string, any>;
  timestamp: Date;
  isNewCustomer: boolean;
}



// API functions
const fetchBusinessLogEntries = async (token: string, businessId: string, limit?: number, cursor?: string): Promise<{ data: BusinessLogEntry[]; next_cursor?: string }> => {
  const response = await api.business.getBusinessEntries(token, businessId, limit, cursor);
  const entries = response.data.map((entry: any) => ({
    id: entry._id,
    customerPhone: entry.buyer?.contact?.phone || '',
    customerName: entry.buyer?.legal_name || '',
    products: [], // Items not included in this response, would need separate call if needed
    totalAmount: entry.totals?.grand_total || 0,
    customFields: {
      gst: entry.buyer?.gstin,
      discount: entry.totals?.discounts_total || 0,
      ...entry.entry
    },
    timestamp: (() => {
      const dateStr = entry.entry?.issued_at || entry.created_at;
      let date;
      try {
        // Try to parse as ISO string, append Z if needed
        const isoStr = dateStr.includes('T') ? dateStr : dateStr.replace(' ', 'T');
        date = new Date(isoStr + (isoStr.includes('Z') || isoStr.includes('+') || isoStr.includes('-') ? '' : 'Z'));
        if (isNaN(date.getTime())) {
          throw new Error('Invalid date');
        }
      } catch (e) {
        console.warn('Failed to parse date:', dateStr, e);
        date = new Date(); // fallback to now
      }
      return date;
    })(),
    isNewCustomer: false // Default, could be derived from data
  }));
  return {
    data: entries,
    next_cursor: response.next_cursor
  };
};

const addBusinessLogEntry = async (token: string, businessId: string, entry: Omit<BusinessLogEntry, 'id'>): Promise<BusinessLogEntry> => {
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
      schema_version: 1,
      legal_name: entry.customerName,
      trade_name: entry.customerName,
      gstin: entry.customFields.gst || null,
      contact: {
        schema_version: 1,
        phone: entry.customerPhone,
        email: null
      }
    },
    totals: {
      schema_version: 1,
      items_subtotal: entry.products.reduce((sum, p) => sum + (p.quantity * p.price), 0),
      discounts_total: entry.customFields.discount || 0,
      tax_total: ((entry.customFields.cgst || 0) / 100) * (entry.products.reduce((sum, p) => sum + (p.quantity * p.price), 0) - (entry.customFields.discount || 0)),
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
      tax_rate: entry.customFields.cgst || 0,
      metadata: {}
    })),
    payments: [],
    source: "business-log",
    ingestion_id: `ING-${Date.now()}`,
    metadata: entry.customFields
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

export function useBusinessLogData(limit?: number, cursor?: string) {
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
    mutationFn: (entry: Omit<BusinessLogEntry, 'id'>) => {
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
