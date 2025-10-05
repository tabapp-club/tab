'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { BusinessFeatures } from '@/lib/api/types';

interface BusinessContextType {
  features: BusinessFeatures | null;
  isLoading: boolean;
  hasFeature: (feature: keyof BusinessFeatures) => boolean;
  refreshFeatures: () => Promise<void>;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export function BusinessProvider({ children }: { children: React.ReactNode }) {
  const [features, setFeatures] = useState<BusinessFeatures | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshFeatures = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('access_token');
      if (!token) {
        setFeatures(null);
        return;
      }

      const response = await api.business.getBusinessDetails(token);

      // Check if features are in response.data.features or directly in response.data
      let featuresData = null;
      const responseData = response.data as any;
      const responseAny = response as any;

      if (responseData && responseData.features) {
        featuresData = responseData.features;
      } else if (responseData && responseData.dashboard !== undefined) {
        // Features might be directly in response.data
        featuresData = responseData;
      } else if (responseAny.dashboard !== undefined) {
        // Features might be directly in response
        featuresData = responseAny;
      } else if (responseAny.tribly_ai !== undefined) {
        // Features might be directly in response with different structure
        featuresData = responseAny;
      } else if (responseData && responseData.tribly_ai !== undefined) {
        // Features might be in response.data with tribly_ai key
        featuresData = responseData;
      } else {
        console.log('No features found in any expected location');
      }

      if (featuresData) {
        console.log('Setting features from API:', featuresData);

        // Validate that all required features are present
        const requiredFeatures = ['dashboard', 'data_center', 'tribly_ai', 'achievements', 'cohorts', 'automation', 'campaigns'];
        const hasAllFeatures = requiredFeatures.every(feature => feature in featuresData);

        if (hasAllFeatures) {
          setFeatures(featuresData);
        } else {
          // Fallback to string extraction
          const responseStr = JSON.stringify(response);
          const extractFeature = (featureName: string): boolean => {
            const regex = new RegExp(`"${featureName}":\\s*(true|false)`);
            const match = responseStr.match(regex);
            return match ? match[1] === 'true' : false;
          };

          const extractedFeatures = {
            dashboard: extractFeature('dashboard'),
            data_center: extractFeature('data_center'),
            tribly_ai: extractFeature('tribly_ai'),
            achievements: extractFeature('achievements'),
            cohorts: extractFeature('cohorts'),
            automation: extractFeature('automation'),
            campaigns: extractFeature('campaigns'),
          };

          setFeatures(extractedFeatures);
        }
      } else {
        const responseStr = JSON.stringify(response);

        // Extract individual features from the response string
        const extractFeature = (featureName: string): boolean => {
          const regex = new RegExp(`"${featureName}":\\s*(true|false)`);
          const match = responseStr.match(regex);
          return match ? match[1] === 'true' : false;
        };

        const extractedFeatures = {
          dashboard: extractFeature('dashboard'),
          data_center: extractFeature('data_center'),
          tribly_ai: extractFeature('tribly_ai'),
          achievements: extractFeature('achievements'),
          cohorts: extractFeature('cohorts'),
          automation: extractFeature('automation'),
          campaigns: extractFeature('campaigns'),
        };
        setFeatures(extractedFeatures);
      }
    } catch (error) {
      console.error('Failed to fetch business features:', error);
      // Set default features if API fails
      setFeatures({
        dashboard: true,
        data_center: true,
        tribly_ai: false,
        achievements: false,
        cohorts: false,
        automation: false,
        campaigns: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load features on mount
  useEffect(() => {
    refreshFeatures();
  }, []);

  const hasFeature = (feature: keyof BusinessFeatures): boolean => {
    if (!features) {
      return false;
    }
    const hasAccess = features[feature] === true;
    return hasAccess;
  };

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
