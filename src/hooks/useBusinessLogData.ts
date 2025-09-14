"use client";

import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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

// Dummy data for demonstration
const generateDummyData = (): BusinessLogEntry[] => {
  const dummyEntries: BusinessLogEntry[] = [
    {
      id: '1',
      customerPhone: '9876543210',
      customerName: 'John Doe',
      products: [
        { name: 'Coffee', quantity: 2, price: 120 },
        { name: 'Sandwich', quantity: 1, price: 150 }
      ],
      totalAmount: 390,
      customFields: {
        gst: '22ABCDE1234F1Z5',
        discount: 30,
        coupon: 'WELCOME10'
      },
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      isNewCustomer: false
    },
    {
      id: '2',
      customerPhone: '9876543211',
      customerName: 'Jane Smith',
      products: [
        { name: 'Pizza', quantity: 1, price: 299 },
        { name: 'Soft Drink', quantity: 2, price: 50 }
      ],
      totalAmount: 399,
      customFields: {
        gst: '22ABCDE1234F1Z6',
        cgst: 18,
        discount: 0
      },
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      isNewCustomer: true
    },
    {
      id: '3',
      customerPhone: '9876543212',
      customerName: 'Bob Johnson',
      products: [
        { name: 'Burger', quantity: 2, price: 180 },
        { name: 'Fries', quantity: 1, price: 80 }
      ],
      totalAmount: 440,
      customFields: {
        gst: '22ABCDE1234F1Z7',
        cgst: 12,
        discount: 20
      },
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      isNewCustomer: false
    },
    {
      id: '4',
      customerPhone: '9876543213',
      customerName: 'Alice Brown',
      products: [
        { name: 'Pasta', quantity: 1, price: 250 },
        { name: 'Salad', quantity: 1, price: 120 }
      ],
      totalAmount: 370,
      customFields: {
        gst: '22ABCDE1234F1Z8',
        cgst: 18,
        discount: 0,
        coupon: 'SAVE20'
      },
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
      isNewCustomer: true
    },
    {
      id: '5',
      customerPhone: '9876543214',
      customerName: 'Charlie Wilson',
      products: [
        { name: 'Steak', quantity: 1, price: 450 },
        { name: 'Wine', quantity: 1, price: 300 }
      ],
      totalAmount: 750,
      customFields: {
        gst: '22ABCDE1234F1Z9',
        cgst: 18,
        discount: 50
      },
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
      isNewCustomer: false
    },
    {
      id: '6',
      customerPhone: '9876543215',
      customerName: 'Diana Prince',
      products: [
        { name: 'Sushi Roll', quantity: 2, price: 200 },
        { name: 'Miso Soup', quantity: 1, price: 80 }
      ],
      totalAmount: 480,
      customFields: {
        gst: '22ABCDE1234F1Z0',
        cgst: 18,
        discount: 0
      },
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      isNewCustomer: true
    }
  ];

  return dummyEntries;
};

// Mock API functions
const fetchBusinessLogEntries = async (): Promise<BusinessLogEntry[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  try {
    // Get from localStorage
    const stored = localStorage.getItem('businessLogEntries');
    
    if (stored && stored !== 'null' && stored !== '') {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        // Return existing data, even if empty array
        return parsed.map((entry: any) => ({
          ...entry,
          timestamp: new Date(entry.timestamp)
        }));
      }
    }
    
    // Only initialize with dummy data if localStorage is completely empty
    // This should only happen on first visit
    const dummyData = generateDummyData();
    localStorage.setItem('businessLogEntries', JSON.stringify(dummyData));
    return dummyData;
  } catch (error) {
    console.error('Error fetching business log entries:', error);
    // Return empty array on error, don't overwrite existing data
    return [];
  }
};

const addBusinessLogEntry = async (entry: Omit<BusinessLogEntry, 'id'>): Promise<BusinessLogEntry> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const newEntry: BusinessLogEntry = {
    ...entry,
    id: Date.now().toString()
  };
  
  try {
    // Get existing entries
    const existing = localStorage.getItem('businessLogEntries');
    let entries: BusinessLogEntry[] = [];
    
    if (existing && existing !== 'null') {
      const parsed = JSON.parse(existing);
      entries = Array.isArray(parsed) ? parsed : [];
    }
    
    // Add new entry at the beginning
    entries.unshift(newEntry);
    
    // Save to localStorage
    localStorage.setItem('businessLogEntries', JSON.stringify(entries));
    
    return newEntry;
  } catch (error) {
    console.error('Error adding business log entry:', error);
    throw new Error('Failed to save entry');
  }
};

const updateBusinessLogEntry = async (id: string, updates: Partial<BusinessLogEntry>): Promise<BusinessLogEntry> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  try {
    const existing = localStorage.getItem('businessLogEntries');
    let entries: BusinessLogEntry[] = [];
    
    if (existing && existing !== 'null') {
      const parsed = JSON.parse(existing);
      entries = Array.isArray(parsed) ? parsed : [];
    }
    
    const index = entries.findIndex((entry: BusinessLogEntry) => entry.id === id);
    if (index === -1) {
      throw new Error('Entry not found');
    }
    
    entries[index] = { ...entries[index], ...updates };
    localStorage.setItem('businessLogEntries', JSON.stringify(entries));
    
    return entries[index];
  } catch (error) {
    console.error('Error updating business log entry:', error);
    throw new Error('Failed to update entry');
  }
};

const deleteBusinessLogEntry = async (id: string): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  try {
    const existing = localStorage.getItem('businessLogEntries');
    let entries: BusinessLogEntry[] = [];
    
    if (existing && existing !== 'null') {
      const parsed = JSON.parse(existing);
      entries = Array.isArray(parsed) ? parsed : [];
    }
    
    const filtered = entries.filter((entry: BusinessLogEntry) => entry.id !== id);
    localStorage.setItem('businessLogEntries', JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting business log entry:', error);
    throw new Error('Failed to delete entry');
  }
};

export function useBusinessLogData() {
  const queryClient = useQueryClient();

  // Fetch all entries
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['businessLogEntries'],
    queryFn: fetchBusinessLogEntries,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Listen for custom events to refresh data
  useEffect(() => {
    const handleBusinessLogUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ['businessLogEntries'] });
    };

    window.addEventListener('businessLogUpdated', handleBusinessLogUpdate);
    
    return () => {
      window.removeEventListener('businessLogUpdated', handleBusinessLogUpdate);
    };
  }, [queryClient]);

  // Add entry mutation
  const addEntryMutation = useMutation({
    mutationFn: addBusinessLogEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessLogEntries'] });
    },
  });

  // Update entry mutation
  const updateEntryMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<BusinessLogEntry> }) =>
      updateBusinessLogEntry(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessLogEntries'] });
    },
  });

  // Delete entry mutation
  const deleteEntryMutation = useMutation({
    mutationFn: deleteBusinessLogEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessLogEntries'] });
    },
  });

  return {
    data,
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
