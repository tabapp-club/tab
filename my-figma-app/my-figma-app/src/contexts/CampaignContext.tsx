"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Platform {
  id: string;
  name: string;
  costPerMessage: number;
  openRate: number;
  clickRate: number;
  rating: number;
  features: string[];
  color: string;
  icon: string;
}

export interface BudgetAllocation {
  platformId: string;
  amount: number;
  percentage: number;
}

export interface CampaignData {
  type: string;
  audience: {
    totalUsers: number;
    demographics: string;
    location: string;
    interests: string;
  };
  platforms: Platform[];
  budget: {
    total: number;
    daily: number;
    expectedReach: number;
    allocations: BudgetAllocation[];
  };
}

interface CampaignContextType {
  campaignData: CampaignData;
  selectedPlatforms: string[];
  updateCampaignType: (type: string) => void;
  updateAudience: (audience: CampaignData['audience']) => void;
  togglePlatform: (platformId: string) => void;
  updateBudget: (budget: Partial<CampaignData['budget']>) => void;
  calculateBudgetAllocations: () => void;
  resetCampaign: () => void;
}

const defaultCampaignData: CampaignData = {
  type: 'advertise',
  audience: {
    totalUsers: 125000,
    demographics: '25-40 years',
    location: 'Urban',
    interests: 'Tech, Innovation'
  },
  platforms: [
    {
      id: 'tab',
      name: 'Tab',
      costPerMessage: 0.02,
      openRate: 85,
      clickRate: 12,
      rating: 4.0,
      features: ['Rich Media', 'Interactive', 'Analytics'],
      color: '#7856ff',
      icon: 'tab'
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      costPerMessage: 0.05,
      openRate: 90,
      clickRate: 8,
      rating: 4.2,
      features: ['Global', 'Rich Media', 'Verified'],
      color: '#25D366',
      icon: 'whatsapp'
    },
    {
      id: 'sms',
      name: 'SMS',
      costPerMessage: 0.03,
      openRate: 95,
      clickRate: 3,
      rating: 3.5,
      features: ['Universal', 'Instant', 'Basic'],
      color: '#FF6B35',
      icon: 'sms'
    },
    {
      id: 'email',
      name: 'Email',
      costPerMessage: 0.01,
      openRate: 25,
      clickRate: 2.5,
      rating: 3.8,
      features: ['Cost Effective', 'Rich Content', 'Analytics'],
      color: '#4285F4',
      icon: 'email'
    }
  ],
  budget: {
    total: 5000,
    daily: 500,
    expectedReach: 100000,
    allocations: []
  }
};

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

export const useCampaign = () => {
  const context = useContext(CampaignContext);
  if (!context) {
    throw new Error('useCampaign must be used within a CampaignProvider');
  }
  return context;
};

interface CampaignProviderProps {
  children: ReactNode;
}

export const CampaignProvider: React.FC<CampaignProviderProps> = ({ children }) => {
  const [campaignData, setCampaignData] = useState<CampaignData>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('campaign_data');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (error) {
          console.error('Error parsing stored campaign data:', error);
        }
      }
    }
    return defaultCampaignData;
  });
  
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('selected_platforms');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (error) {
          console.error('Error parsing stored platforms:', error);
        }
      }
    }
    return ['tab', 'whatsapp', 'sms'];
  });

  const updateCampaignType = (type: string) => {
    setCampaignData(prev => {
      const updated = { ...prev, type };
      if (typeof window !== 'undefined') {
        localStorage.setItem('campaign_data', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const updateAudience = (audience: CampaignData['audience']) => {
    setCampaignData(prev => {
      const updated = { ...prev, audience };
      if (typeof window !== 'undefined') {
        localStorage.setItem('campaign_data', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev => {
      const updated = prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId];
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('selected_platforms', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const updateBudget = (budget: Partial<CampaignData['budget']>) => {
    setCampaignData(prev => {
      const updated = {
        ...prev,
        budget: { ...prev.budget, ...budget }
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('campaign_data', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const calculateBudgetAllocations = () => {
    const selectedPlatformsData = campaignData.platforms.filter(p => 
      selectedPlatforms.includes(p.id)
    );
    
    if (selectedPlatformsData.length === 0) return;

    const totalCost = selectedPlatformsData.reduce((sum, platform) => 
      sum + platform.costPerMessage, 0
    );
    
    const allocations: BudgetAllocation[] = selectedPlatformsData.map(platform => {
      const percentage = (platform.costPerMessage / totalCost) * 100;
      const amount = (campaignData.budget.total * percentage) / 100;
      
      return {
        platformId: platform.id,
        amount: Math.round(amount),
        percentage: Math.round(percentage)
      };
    });

    updateBudget({ allocations });
  };

  const resetCampaign = () => {
    setCampaignData(defaultCampaignData);
    setSelectedPlatforms(['tab', 'whatsapp', 'sms']);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('campaign_data');
      localStorage.removeItem('selected_platforms');
    }
  };

  return (
    <CampaignContext.Provider value={{
      campaignData,
      selectedPlatforms,
      updateCampaignType,
      updateAudience,
      togglePlatform,
      updateBudget,
      calculateBudgetAllocations,
      resetCampaign
    }}>
      {children}
    </CampaignContext.Provider>
  );
};
