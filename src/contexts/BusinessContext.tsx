'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { BusinessFeatures } from '@/lib/api/types';

interface BusinessContextType {
  features: BusinessFeatures | null;
  isLoading: boolean;
  hasFeature: (feature: keyof BusinessFeatures) => boolean;
  refreshFeatures: () => Promise<void>;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export function BusinessProvider({ children }: { children: React.ReactNode }) {
  const [features, setFeatures] = useState<BusinessFeatures | null>({
    dashboard: true,
    data_center: true,
    tribly_ai: true,
    achievements: true,
    cohorts: true,
    automation: true,
    campaigns: true,
  });
  const [isLoading, setIsLoading] = useState(false);

  const hasFeature = (feature: keyof BusinessFeatures): boolean => {
    // Always return true to enable all features
    return true;
  };

  const refreshFeatures = useCallback(async () => {
    // No-op function since we want all features enabled by default
  }, []);

  const value: BusinessContextType = {
    features,
    isLoading,
    hasFeature,
    refreshFeatures,
  };

  return (
    <BusinessContext.Provider value={value}>
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusiness() {
  const context = useContext(BusinessContext);
  if (context === undefined) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
}
