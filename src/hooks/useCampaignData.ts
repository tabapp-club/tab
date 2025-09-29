import { useState, useEffect } from 'react';
import { CampaignData } from '@/contexts/CampaignContext';

const CAMPAIGN_DATA_KEY = 'campaign_data';

export const useCampaignData = () => {
  const [campaignData, setCampaignData] = useState<CampaignData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load campaign data from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CAMPAIGN_DATA_KEY);
      if (stored) {
        setCampaignData(JSON.parse(stored));
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save campaign data to localStorage
  const saveCampaignData = (data: CampaignData) => {
    try {
      localStorage.setItem(CAMPAIGN_DATA_KEY, JSON.stringify(data));
      setCampaignData(data);
    } catch (error) {
    }
  };

  // Clear campaign data
  const clearCampaignData = () => {
    try {
      localStorage.removeItem(CAMPAIGN_DATA_KEY);
      setCampaignData(null);
    } catch (error) {
    }
  };

  return {
    campaignData,
    saveCampaignData,
    clearCampaignData,
    isLoading
  };
};
