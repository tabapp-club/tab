'use client';

import { useState, useCallback, useMemo } from 'react';
import { MobileHeaderButton } from '../MobileHeaderButton';
import { useSidebar } from '../SidebarContext';
import { FunnelHeader } from './FunnelHeader';
import { FunnelVisualization } from './FunnelVisualization';
import { FunnelTypeSelector } from './FunnelTypeSelector';
import { TimeFilter } from '../TimeFilter';
import { FunnelCharts } from './FunnelCharts';
import { FunnelTypeSelectorVertical } from './FunnelTypeSelectorVertical';
import { FunnelCampaignCards } from './FunnelCampaignCards';
import { CampaignDetailsSidepane } from '../campaigns/CampaignDetailsSidepane';
import { RecommendedCampaign } from '../campaigns/RecommendedCampaigns';

export type FunnelType = 
  | 'status' 
  | 'value' 
  | 'engagement' 
  | 'retention' 
  | 'purchase_behavior';

export interface FunnelData {
  stage: string;
  count: number;
  percentage: number;
  color: string;
  value?: number;
  change?: number;
}

export interface FunnelMetrics {
  totalCustomers: number;
  conversionRate: number;
  dropOffRate: number;
  avgTimeInStage: number;
}

export function CustomerFunnelClient() {
  const [selectedFunnelType, setSelectedFunnelType] = useState<FunnelType>('status');
  const { isCollapsed, isMobile } = useSidebar();
  const [campaignSidePaneOpen, setCampaignSidePaneOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<RecommendedCampaign | null>(null);

  // Handle filter change from TimeFilter
  const handleFilterChange = useCallback((filter: { type: string; days?: number; dateRange?: { from: Date | null; to: Date | null } }) => {
    // Handle the filter change - you can map this to your existing logic if needed
    console.log('Filter changed:', filter);
  }, []);

  // Handle campaign send now - opens sidepane
  const handleSendNow = useCallback((campaign: RecommendedCampaign) => {
    setSelectedCampaign(campaign);
    setCampaignSidePaneOpen(true);
  }, []);

  // Handle campaign sidepane close
  const handleCampaignSidePaneClose = useCallback(() => {
    setCampaignSidePaneOpen(false);
    setSelectedCampaign(null);
  }, []);

  // Mock funnel data based on type - using brand color shades (#9747FF)
  const funnelData: Record<FunnelType, FunnelData[]> = useMemo(() => ({
    status: [
      { stage: 'Active', count: 5420, percentage: 42.5, color: '#9747FF', value: 5420, change: 8.2 },
      { stage: 'Inactive', count: 3280, percentage: 25.7, color: '#B891FF', value: 3280, change: -3.1 },
      { stage: 'Dormant', count: 2450, percentage: 19.2, color: '#C9A8FF', value: 2450, change: -5.4 },
      { stage: 'At Risk', count: 1620, percentage: 12.6, color: '#7C3AED', value: 1620, change: 2.3 },
    ],
    value: [
      { stage: 'Premium Customers', count: 1850, percentage: 14.5, color: '#9747FF', value: 1850, change: 12.5 },
      { stage: 'High Value', count: 4250, percentage: 33.3, color: '#A877FF', value: 4250, change: 5.2 },
      { stage: 'Regular Customers', count: 4680, percentage: 36.7, color: '#B891FF', value: 4680, change: -2.1 },
      { stage: 'Low Value', count: 1990, percentage: 15.6, color: '#D4C5FF', value: 1990, change: -8.3 },
    ],
    engagement: [
      { stage: 'Highly Engaged', count: 3120, percentage: 24.4, color: '#9747FF', value: 3120, change: 15.3 },
      { stage: 'Moderately Engaged', count: 4850, percentage: 38.0, color: '#A877FF', value: 4850, change: 3.7 },
      { stage: 'Low Engagement', count: 3420, percentage: 26.8, color: '#B891FF', value: 3420, change: -4.2 },
      { stage: 'No Engagement', count: 1380, percentage: 10.8, color: '#C9A8FF', value: 1380, change: -12.5 },
    ],
    retention: [
      { stage: 'Highly Retained', count: 2100, percentage: 16.5, color: '#9747FF', value: 2100, change: 18.2 },
      { stage: 'Retained', count: 3850, percentage: 30.2, color: '#A877FF', value: 3850, change: 8.5 },
      { stage: 'At Risk', count: 3420, percentage: 26.8, color: '#B891FF', value: 3420, change: -2.1 },
      { stage: 'Churned', count: 3400, percentage: 26.6, color: '#C9A8FF', value: 3400, change: -6.8 },
    ],
    purchase_behavior: [
      { stage: 'Frequent Buyers', count: 2450, percentage: 19.2, color: '#9747FF', value: 2450, change: 14.3 },
      { stage: 'Regular Buyers', count: 3850, percentage: 30.2, color: '#A877FF', value: 3850, change: 7.2 },
      { stage: 'Occasional Buyers', count: 4280, percentage: 33.5, color: '#B891FF', value: 4280, change: -1.8 },
      { stage: 'One-time Buyers', count: 2190, percentage: 17.2, color: '#C9A8FF', value: 2190, change: -5.2 },
    ],
  }), []);

  const currentFunnelData = funnelData[selectedFunnelType];

  const funnelMetrics: FunnelMetrics = useMemo(() => {
    const total = currentFunnelData.reduce((sum, stage) => sum + stage.count, 0);
    const firstStage = currentFunnelData[0];
    const lastStage = currentFunnelData[currentFunnelData.length - 1];
    const conversionRate = firstStage && lastStage 
      ? ((lastStage.count / firstStage.count) * 100) 
      : 0;
    const dropOffRate = 100 - conversionRate;
    
    return {
      totalCustomers: total,
      conversionRate: conversionRate,
      dropOffRate: dropOffRate,
      avgTimeInStage: 12.5, // Mock data
    };
  }, [currentFunnelData]);

  const handleFunnelTypeChange = useCallback((type: FunnelType) => {
    setSelectedFunnelType(type);
  }, []);


  const actualIsCollapsed = isMobile ? false : isCollapsed;

  return (
    <main className={`flex-1 transition-sidebar bg-[#f6f6f6] ${
      actualIsCollapsed ? 'main-content sidebar-collapsed' : 'main-content'
    }`}>
      {/* Mobile Header with Menu Toggle */}
      <header className="lg:hidden flex items-center justify-start p-3 sm:p-4 bg-[#F6F6F6] fixed top-0 left-0 right-0 z-50">
        <MobileHeaderButton />
      </header>

      {/* Header Section - Fixed on Desktop */}
      <div className={`hidden lg:block fixed top-0 z-20 bg-[#f6f6f6] pt-2 pb-4 px-8 ${
        actualIsCollapsed ? 'left-[64px] right-0' : 'left-[232px] right-0'
      }`}>
        <FunnelHeader />
      </div>

      {/* Main Content */}
      <div className="w-full max-w-full overflow-x-hidden">
        <div className="px-4 pt-20 pb-40 py-4 lg:px-8 lg:py-8 lg:pb-20 lg:pt-8 lg:pt-24">
          {/* Mobile Header Section */}
          <div className="mb-4 lg:hidden">
            <FunnelHeader />
          </div>

          {/* Mobile Layout - Stacked */}
          <div className="lg:hidden space-y-6">

            {/* Funnel Type Selector - Mobile */}
            <FunnelTypeSelector
              selectedType={selectedFunnelType}
              onTypeChange={handleFunnelTypeChange}
            />

            {/* Filters */}
            <div className="mb-0 flex justify-end">
              <TimeFilter onFilterChange={handleFilterChange} />
            </div>

            {/* Main Funnel Visualization */}
            <FunnelVisualization
              data={currentFunnelData}
              type={selectedFunnelType}
            />

            {/* Create Campaigns Section */}
            <FunnelCampaignCards
              data={currentFunnelData}
              type={selectedFunnelType}
              onSendNow={handleSendNow}
            />

            {/* Distribution Analysis */}
            <FunnelCharts
              data={currentFunnelData}
              type={selectedFunnelType}
            />
          </div>

          {/* Desktop Layout - Row View (like new-campaign) */}
          <div className="hidden lg:block">
            <div className="flex gap-0 items-start justify-start w-full">
              {/* Left Sidebar - Funnel Type Selector (Vertical) - Fixed */}
              <div className={`flex flex-col gap-2 items-start justify-start w-full max-w-[420px] shrink-0 fixed top-24 bottom-0 overflow-y-auto bg-[#f6f6f6] pl-10 ${
                actualIsCollapsed ? 'left-[64px]' : 'left-[232px]'
              }`}>
                <FunnelTypeSelectorVertical
                  selectedType={selectedFunnelType}
                  onTypeChange={handleFunnelTypeChange}
                />
              </div>

              {/* Right Side - Main Content - Scrollable */}
              <div className={`flex-1 min-w-0 space-y-6 ${
                actualIsCollapsed ? 'ml-[420px]' : 'ml-[588px]'
              }`}>
              {/* Filters */}
              <div className="mb-0 flex justify-end">
                <TimeFilter onFilterChange={handleFilterChange} />
              </div>

              {/* Main Funnel Visualization */}
              <FunnelVisualization
                data={currentFunnelData}
                type={selectedFunnelType}
              />

              {/* Create Campaigns Section */}
              <FunnelCampaignCards
                data={currentFunnelData}
                type={selectedFunnelType}
                onSendNow={handleSendNow}
              />

              {/* Distribution Analysis */}
              <FunnelCharts
                data={currentFunnelData}
                type={selectedFunnelType}
              />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Campaign Details Sidepane */}
      <CampaignDetailsSidepane
        isOpen={campaignSidePaneOpen}
        onClose={handleCampaignSidePaneClose}
        campaign={selectedCampaign}
      />
    </main>
  );
}

