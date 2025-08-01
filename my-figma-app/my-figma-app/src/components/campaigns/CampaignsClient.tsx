'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '../Sidebar';
import { MobileMenuToggle } from '../MobileMenuToggle';
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

// CSV Export Utility Function
const exportCampaignsToCSV = (data: CampaignData[], filename: string = 'campaigns-export.csv') => {
  if (!data || data.length === 0) {
    alert('No campaigns to export');
    return;
  }

  // Define CSV headers
  const headers = [
    'Campaign Name',
    'Type',
    'Status',
    'Audience Size',
    'Messages Sent',
    'Opened',
    'Clicked',
    'Conversion Rate (%)',
    'Budget',
    'Spent',
    'Created Date',
    'End Date',
    'Description'
  ];

  // Convert data to CSV format
  const csvContent = [
    headers.join(','),
    ...data.map(campaign => [
      `"${campaign.name}"`,
      `"${campaign.type}"`,
      `"${campaign.status}"`,
      campaign.audience,
      campaign.sent,
      campaign.opened,
      campaign.clicked,
      campaign.conversion.toFixed(2),
      campaign.budget,
      campaign.spent,
      `"${campaign.createdDate}"`,
      `"${campaign.endDate}"`,
      `"${campaign.description}"`
    ].join(','))
  ].join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

export function CampaignsClient() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCampaigns, setFilteredCampaigns] = useState<CampaignData[]>([]);
  const { isCollapsed, isMobile } = useSidebar();
  const router = useRouter();

  // Force uncollapsed state on mobile
  const actualIsCollapsed = isMobile ? false : isCollapsed;

  const handleCreateCampaign = useCallback(() => {
    router.push('/new-campaign');
  }, [router]);

  const handleImportClick = useCallback(() => {
    // Handle import functionality
    console.log('Import campaigns');
  }, []);

  const handleExportClick = useCallback(() => {
    exportCampaignsToCSV(filteredCampaigns);
  }, [filteredCampaigns]);

  const handleCampaignsUpdate = useCallback((campaigns: CampaignData[]) => {
    setFilteredCampaigns(campaigns);
  }, []);

  return (
    <div className="campaigns-container flex bg-gray-50 font-sans min-h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 lg:hidden">
          <MobileMenuToggle />
          <h1 className="text-base sm:text-lg font-bold truncate">Campaigns</h1>
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
                onImportClick={handleImportClick}
                onExportClick={handleExportClick}
              />

              {/* Stats */}
              <CampaignsStats />

              {/* Main Content Area */}
              <div className="bg-white rounded-lg shadow-sm flex-1 flex flex-col min-h-0 min-w-0">
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
          </div>
        </main>
      </div>


    </div>
  );
}
