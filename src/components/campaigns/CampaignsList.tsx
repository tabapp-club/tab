'use client';

import { useMemo, useEffect, useState } from 'react';
import { CampaignCard } from './CampaignCard';
import { CampaignData } from './CampaignsClient';
import Pagination from '../Pagination';

// Mock campaign data
const campaignsMockData: CampaignData[] = [
  {
    id: '1',
    name: 'Welcome Email Series',
    type: 'engagement',
    status: 'active',
    audience: 12500,
    sent: 11200,
    opened: 8960,
    clicked: 1344,
    conversion: 12.5,
    budget: 5000,
    spent: 3250,
    createdDate: '15 Jul, 2024',
    endDate: '30 Aug, 2024',
    description: 'Onboarding email sequence for new customers'
  },
  {
    id: '2',
    name: 'Customer Feedback Survey',
    type: 'feedback',
    status: 'active',
    audience: 8500,
    sent: 8100,
    opened: 6480,
    clicked: 972,
    conversion: 15.2,
    budget: 2000,
    spent: 1200,
    createdDate: '10 Jul, 2024',
    endDate: '25 Jul, 2024',
    description: 'Post-purchase satisfaction survey campaign'
  },
  {
    id: '3',
    name: 'Win-Back Campaign',
    type: 'retention',
    status: 'paused',
    audience: 6200,
    sent: 5800,
    opened: 2320,
    clicked: 464,
    conversion: 8.7,
    budget: 3500,
    spent: 2100,
    createdDate: '5 Jul, 2024',
    endDate: '20 Jul, 2024',
    description: 'Re-engage inactive customers with special offers'
  },
  {
    id: '4',
    name: 'Summer Sale Promo',
    type: 'advertise',
    status: 'completed',
    audience: 15000,
    sent: 14500,
    opened: 11600,
    clicked: 2320,
    conversion: 16.8,
    budget: 8000,
    spent: 7200,
    createdDate: '1 Jun, 2024',
    endDate: '30 Jun, 2024',
    description: 'Promotional campaign for summer sale event'
  },
  {
    id: '5',
    name: 'Product Launch Announcement',
    type: 'engagement',
    status: 'draft',
    audience: 20000,
    sent: 0,
    opened: 0,
    clicked: 0,
    conversion: 0,
    budget: 10000,
    spent: 0,
    createdDate: '20 Jul, 2024',
    endDate: '5 Aug, 2024',
    description: 'Announce new product line to customer base'
  },
  {
    id: '6',
    name: 'Loyalty Program Enrollment',
    type: 'retention',
    status: 'active',
    audience: 9500,
    sent: 9200,
    opened: 6440,
    clicked: 1288,
    conversion: 13.6,
    budget: 4000,
    spent: 2800,
    createdDate: '12 Jul, 2024',
    endDate: '12 Aug, 2024',
    description: 'Drive enrollment in customer loyalty program'
  },
  {
    id: '7',
    name: 'Cart Abandonment Recovery',
    type: 'retention',
    status: 'active',
    audience: 7800,
    sent: 7500,
    opened: 5250,
    clicked: 1050,
    conversion: 14.2,
    budget: 3000,
    spent: 1800,
    createdDate: '8 Jul, 2024',
    endDate: '22 Jul, 2024',
    description: 'Recover abandoned shopping carts with incentives'
  },
  {
    id: '8',
    name: 'Brand Awareness Survey',
    type: 'feedback',
    status: 'completed',
    audience: 5500,
    sent: 5200,
    opened: 3640,
    clicked: 520,
    conversion: 10.4,
    budget: 1500,
    spent: 1500,
    createdDate: '25 Jun, 2024',
    endDate: '10 Jul, 2024',
    description: 'Measure brand perception and awareness metrics'
  }
];

interface CampaignsListProps {
  searchTerm?: string;
  onCampaignsUpdate?: (campaigns: CampaignData[]) => void;
}

export function CampaignsList({
  searchTerm = '',
  onCampaignsUpdate
}: CampaignsListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  // Filter campaigns based on search term
  const filteredCampaigns = useMemo(() => {
    return campaignsMockData.filter(campaign => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        campaign.name.toLowerCase().includes(searchLower) ||
        campaign.type.toLowerCase().includes(searchLower) ||
        campaign.status.toLowerCase().includes(searchLower) ||
        campaign.description.toLowerCase().includes(searchLower)
      );
    });
  }, [searchTerm]);

  // Paginate the filtered campaigns
  const paginatedCampaigns = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredCampaigns.slice(startIndex, endIndex);
  }, [filteredCampaigns, currentPage, itemsPerPage]);

  // Reset to page 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Update parent component with filtered campaigns
  useEffect(() => {
    if (onCampaignsUpdate) {
      onCampaignsUpdate(filteredCampaigns);
    }
  }, [filteredCampaigns, onCampaignsUpdate]);

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Campaigns Grid */}
      <div className="flex-1 min-h-0">
        {paginatedCampaigns.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns found</h3>
            <p className="text-gray-500 max-w-sm">
              {searchTerm
                ? `No campaigns match "${searchTerm}". Try adjusting your search or filters.`
                : "You don't have any campaigns yet. Create your first campaign to get started."
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4 w-full min-w-0">
            {paginatedCampaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredCampaigns.length > 0 && (
        <div className="mt-4">
          <Pagination
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalItems={filteredCampaigns.length}
            onPageChange={(page) => {
              setCurrentPage(page);
            }}
            onItemsPerPageChange={(items) => {
              setItemsPerPage(items);
              setCurrentPage(1); // Reset to first page when changing items per page
            }}
          />
        </div>
      )}
    </div>
  );
}

export type { CampaignData };
