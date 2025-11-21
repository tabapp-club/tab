'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MobileHeaderButton } from '../MobileHeaderButton';
import { useSidebar } from '../SidebarContext';
import { CampaignsHeader } from './CampaignsHeader';
import { CampaignsFilters } from './CampaignsFilters';
import { CampaignsList } from './CampaignsList';

export interface CampaignData {
  id: string;
  name: string;
  type: 'feedback' | 'retention' | 'engagement' | 'advertise';
  status: 'active' | 'paused' | 'draft' | 'completed' | 'pending' | 'rejected';
  audience: number;
  sent: number;
  opened: number;
  clicked: number;
  conversion: number;
  budget: number;
  spent: number;
  createdAt?: number;
  createdDate: string;
  endDate: string;
  description: string;
}


export function CampaignsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCampaigns, setFilteredCampaigns] = useState<CampaignData[]>([]);
  const [allCampaigns, setAllCampaigns] = useState<CampaignData[]>([]);
  const [totalCampaigns, setTotalCampaigns] = useState(0);
  const [visibleCampaigns, setVisibleCampaigns] = useState(0);
  const { isCollapsed, isMobile } = useSidebar();

  // Load search term from URL parameters
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    if (urlSearch) {
      setSearchTerm(urlSearch);
    }
  }, [searchParams]);

  // Update URL when search term changes
  useEffect(() => {
    // Skip URL updates during initial load
    if (!searchTerm && searchParams.get('search')) return;
    
    const timer = setTimeout(() => {
      const currentParams = new URLSearchParams(searchParams.toString());
      const newParams = new URLSearchParams();
      
      if (searchTerm) {
        newParams.set('search', searchTerm);
      }
      
      // Only update URL if parameters have actually changed
      if (currentParams.toString() !== newParams.toString()) {
        const queryString = newParams.toString();
        const newUrl = queryString ? `/campaigns?${queryString}` : '/campaigns';
        router.push(newUrl, { scroll: false });
      }
    }, 300); // Reduced debounce to prevent history conflicts

    return () => clearTimeout(timer);
  }, [searchTerm, searchParams, router]);

  // Force uncollapsed state on mobile
  const actualIsCollapsed = isMobile ? false : isCollapsed;

  const handleCampaignsUpdate = useCallback((campaigns: CampaignData[]) => {
    setFilteredCampaigns(campaigns);
  }, []);

  const handleAllCampaignsUpdate = useCallback((campaigns: CampaignData[]) => {
    setAllCampaigns(campaigns);
  }, []);

  const handleCountsUpdate = useCallback((total: number, visible: number) => {
    setTotalCampaigns(total);
    setVisibleCampaigns(visible);
  }, []);

  return (
    <main className={`flex-1 transition-sidebar bg-[#f6f6f6] ${
      actualIsCollapsed ? 'main-content sidebar-collapsed' : 'main-content'
    }`}>
      {/* Mobile Header with Menu Toggle */}
      <header className="lg:hidden flex items-center justify-start p-3 sm:p-4 bg-[#F6F6F6] fixed top-0 left-0 right-0 z-50">
        <MobileHeaderButton />
      </header>

      {/* Main Content */}
      <div className="w-full max-w-full px-3 py-4 sm:px-4 sm:py-5 lg:px-8 lg:py-8 overflow-x-hidden">
        <div className="pt-12 lg:pt-0 space-y-6">
          {/* Header */}
          <CampaignsHeader />

          {/* Filters */}
          <CampaignsFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            totalCampaigns={totalCampaigns}
            visibleCampaigns={visibleCampaigns}
            allCampaigns={allCampaigns}
          />

          {/* Campaigns List */}
          <CampaignsList
            searchTerm={searchTerm}
            onCampaignsUpdate={handleCampaignsUpdate}
            onCountsUpdate={handleCountsUpdate}
            onAllCampaignsUpdate={handleAllCampaignsUpdate}
          />
        </div>
      </div>
    </main>
  );
}
