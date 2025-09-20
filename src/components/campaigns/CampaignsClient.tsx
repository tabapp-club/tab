'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sidebar } from '../Sidebar';
import { MobileHeaderButton } from '../MobileHeaderButton';
import { useSidebar } from '../SidebarContext';
import { CampaignsHeader } from './CampaignsHeader';
import { CampaignsStats } from './CampaignsStats';
import { CampaignsFilters } from './CampaignsFilters';
import { CampaignsList } from './CampaignsList';

export interface CampaignData {
  id: string;
  name: string;
  type: 'feedback' | 'retention' | 'engagement' | 'advertise';
  status: 'active' | 'paused' | 'draft' | 'completed';
  audience: number;
  sent: number;
  opened: number;
  clicked: number;
  conversion: number;
  budget: number;
  spent: number;
  createdDate: string;
  endDate: string;
  description: string;
}


export function CampaignsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCampaigns, setFilteredCampaigns] = useState<CampaignData[]>([]);
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

  const handleCreateCampaign = useCallback(() => {
    router.push('/new-campaign', { scroll: false });
  }, [router]);


  const handleCampaignsUpdate = useCallback((campaigns: CampaignData[]) => {
    setFilteredCampaigns(campaigns);
  }, []);

  return (
    <div className="campaigns-container flex bg-[#F6F6F6] font-sans min-h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="flex items-center justify-between p-3 sm:p-4 lg:hidden">
          <MobileHeaderButton />
            <button
              onClick={handleCreateCampaign}
              className="flex items-center justify-center gap-2 h-9 px-3 bg-gradient-to-r from-[#6E4EFF] to-[#8B6AFF] text-white rounded font-semibold text-sm hover:from-[#5D3EE8] hover:to-[#7A59FF] hover:shadow-lg transition-all duration-300 ease-in-out active:scale-[0.98] flex-shrink-0"
              style={{ height: '36px' }}
            >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 1V15M1 8H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>New Campaign</span>
          </button>
        </header>

        {/* Main Content */}
        <main
          className={`campaigns-main flex-1 transition-all duration-300 min-w-0 ${
            actualIsCollapsed ? 'lg:ml-[64px]' : 'lg:ml-[232px]'
          }`}
        >
          <div className="h-full flex flex-col min-w-0">
            <div className="p-2 sm:p-3 lg:p-4 xl:p-6 space-y-3 sm:space-y-4 lg:space-y-6 flex-1 flex flex-col min-w-0">
              {/* Header */}
              <CampaignsHeader
                onCreateCampaign={handleCreateCampaign}
              />

              {/* Stats */}
              <CampaignsStats />

              {/* Filters */}
              <CampaignsFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
              />

              {/* Campaigns List */}
              <div className="flex-1 min-h-0 min-w-0">
                <CampaignsList
                  searchTerm={searchTerm}
                  onCampaignsUpdate={handleCampaignsUpdate}
                />
              </div>
            </div>
          </div>
        </main>
      </div>


    </div>
  );
}
