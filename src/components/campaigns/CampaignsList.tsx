'use client';

import { useMemo, useEffect, useState } from 'react';
import { CampaignCard } from './CampaignCard';
import { CampaignData } from './CampaignsClient';
import Pagination from '../Pagination';

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
  const [allCampaigns, setAllCampaigns] = useState<CampaignData[]>([]);

  // Load all sent campaigns from localStorage
  useEffect(() => {
    const loadCampaigns = () => {
      // Load all campaigns (pending, active, completed, etc.)
      const storedCampaigns = JSON.parse(localStorage.getItem('sentCampaigns') || '[]');
      
      // Also check for pending campaigns (for backward compatibility)
      const pendingCampaigns = JSON.parse(localStorage.getItem('pendingCampaigns') || '[]');
      
      // Merge and deduplicate by ID
      const allStoredCampaigns = [...storedCampaigns, ...pendingCampaigns];
      const uniqueCampaigns = allStoredCampaigns.filter((campaign, index, self) =>
        index === self.findIndex((c) => c.id === campaign.id)
      );
      
      // Sort by creation date (newest first), with pending campaigns at the top
      const sortedCampaigns = uniqueCampaigns.sort((a, b) => {
        // Pending campaigns first
        if (a.status === 'pending' && b.status !== 'pending') return -1;
        if (a.status !== 'pending' && b.status === 'pending') return 1;
        // Then by date (newest first) - handle date parsing safely
        try {
          const dateA = new Date(a.createdDate).getTime();
          const dateB = new Date(b.createdDate).getTime();
          if (isNaN(dateA) || isNaN(dateB)) {
            // If dates can't be parsed, sort by ID (newer IDs first)
            return b.id.localeCompare(a.id);
          }
          return dateB - dateA;
        } catch {
          // Fallback to ID sorting if date parsing fails
          return b.id.localeCompare(a.id);
        }
      });
      
      setAllCampaigns(sortedCampaigns);
    };

    loadCampaigns();

    // Listen for storage changes (in case campaigns are added from another tab/window)
    const handleStorageChange = () => {
      loadCampaigns();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom event for same-tab updates
    window.addEventListener('campaignsUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('campaignsUpdated', handleStorageChange);
    };
  }, []);

  // Filter campaigns based on search term
  const filteredCampaigns = useMemo(() => {
    return allCampaigns.filter(campaign => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        campaign.name.toLowerCase().includes(searchLower) ||
        campaign.type.toLowerCase().includes(searchLower) ||
        campaign.status.toLowerCase().includes(searchLower) ||
        campaign.description.toLowerCase().includes(searchLower)
      );
    });
  }, [searchTerm, allCampaigns]);

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
