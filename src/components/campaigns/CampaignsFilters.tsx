'use client';

import { useState, useEffect } from 'react';
import FilterDropdown from '../FilterDropdown';

interface FilterOption {
  id: string;
  label: string;
  checked: boolean;
}

interface FilterState {
  type: FilterOption[];
  status: FilterOption[];
  budget: FilterOption[];
  performance: FilterOption[];
}

interface CampaignsFiltersProps {
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
}

const CampaignsFilters = ({
  searchTerm: externalSearchTerm,
  onSearchChange
}: CampaignsFiltersProps = {}) => {
  const [internalSearchTerm, setInternalSearchTerm] = useState('');
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    type: [
      { id: 'feedback', label: 'Feedback & Survey', checked: false },
      { id: 'retention', label: 'Retention', checked: false },
      { id: 'engagement', label: 'Engagement', checked: false },
      { id: 'advertise', label: 'Advertise', checked: false },
    ],
    status: [
      { id: 'active', label: 'Active', checked: false },
      { id: 'paused', label: 'Paused', checked: false },
      { id: 'draft', label: 'Draft', checked: false },
      { id: 'completed', label: 'Completed', checked: false },
    ],
    budget: [
      { id: 'low', label: 'Under $1,000', checked: false },
      { id: 'medium', label: '$1,000 - $5,000', checked: false },
      { id: 'high', label: 'Over $5,000', checked: false },
    ],
    performance: [
      { id: 'excellent', label: 'Excellent (>10%)', checked: false },
      { id: 'good', label: 'Good (5-10%)', checked: false },
      { id: 'average', label: 'Average (2-5%)', checked: false },
      { id: 'poor', label: 'Poor (<2%)', checked: false },
    ],
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleFilterToggle = (filterType: string) => {
    setOpenFilter(openFilter === filterType ? null : filterType);
  };

  const handleFilterChange = (filterType: keyof FilterState, selectedIds: string[]) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].map(option => ({
        ...option,
        checked: selectedIds.includes(option.id)
      }))
    }));
  };

  const getSelectedCount = (filterType: keyof FilterState) => {
    return filters[filterType].filter(option => option.checked).length;
  };

  const currentSearchTerm = externalSearchTerm !== undefined ? externalSearchTerm : internalSearchTerm;

  const handleSearchChange = (value: string) => {
    if (onSearchChange) {
      onSearchChange(value);
    } else {
      setInternalSearchTerm(value);
    }
  };

  // Calculate total campaigns for display (mock data)
  const totalCampaigns = 48;
  const visibleCampaigns = 12;

  return (
    <div className="bg-white sticky top-0 z-10 border border-gray-200 rounded-lg min-w-0">
      {/* Mobile Layout */}
      {isMobile && (
        <div className="p-3 space-y-3" style={{ overflow: 'visible' }}>
          {/* Search Bar - Full Width on Mobile */}
          <div className="relative">
            <div className="group bg-[#f6f6f6] border border-[#e9e9e9] hover:border-[#d1d5db] focus-within:border-[#9747FF] focus-within:ring-2 focus-within:ring-[#9747FF]/20 flex flex-row h-10 items-center justify-start p-px relative rounded shrink-0 w-full transition-all duration-200">
              <div className="flex items-center justify-center h-full w-7 shrink-0 mt-1 ml-1 text-[#757575] group-focus-within:text-[#9747FF] transition-colors duration-200">
                <SearchIcon />
              </div>
              <div className="flex-1 flex items-center h-full min-w-0">
                <div className="flex-1 flex items-center h-full px-1 py-0">
                  <input
                    type="text"
                    placeholder="Search campaigns..."
                    value={currentSearchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-full h-full bg-transparent border-none outline-none text-[#2a2a2f] text-[14px] placeholder:text-[#757575] font-normal focus:text-[#2a2a2f] transition-colors duration-200"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Filters Row - Horizontal Scroll on Mobile */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide overflow-y-visible" style={{ overflowY: 'visible' }}>
            <span className="text-sm font-medium text-gray-700 whitespace-nowrap flex-shrink-0 mr-1">
              Filters:
            </span>
            <FilterDropdown
              title="Type"
              options={filters.type}
              onSelectionChange={(selectedIds) => handleFilterChange('type', selectedIds)}
              isOpen={openFilter === 'type'}
              onToggle={() => handleFilterToggle('type')}
              selectedCount={getSelectedCount('type')}
            />
            <FilterDropdown
              title="Status"
              options={filters.status}
              onSelectionChange={(selectedIds) => handleFilterChange('status', selectedIds)}
              isOpen={openFilter === 'status'}
              onToggle={() => handleFilterToggle('status')}
              selectedCount={getSelectedCount('status')}
            />
            <FilterDropdown
              title="Budget"
              options={filters.budget}
              onSelectionChange={(selectedIds) => handleFilterChange('budget', selectedIds)}
              isOpen={openFilter === 'budget'}
              onToggle={() => handleFilterToggle('budget')}
              selectedCount={getSelectedCount('budget')}
            />
            <FilterDropdown
              title="Performance"
              options={filters.performance}
              onSelectionChange={(selectedIds) => handleFilterChange('performance', selectedIds)}
              isOpen={openFilter === 'performance'}
              onToggle={() => handleFilterToggle('performance')}
              selectedCount={getSelectedCount('performance')}
            />
          </div>

          {/* Results Count */}
          <div className="text-xs text-gray-600 pt-1 border-t border-gray-100">
            Showing {visibleCampaigns} of {totalCampaigns} campaigns
          </div>
        </div>
      )}

      {/* Desktop Layout */}
      {!isMobile && (
        <div className="flex flex-col gap-2 sm:gap-3 lg:gap-0 lg:flex-row lg:items-center lg:justify-between p-2 sm:p-3 lg:px-4 lg:py-0 lg:h-[60px] min-w-0">
          <div className="flex-shrink-0 text-xs sm:text-sm font-medium text-gray-700 truncate">
            Showing {visibleCampaigns} of {totalCampaigns} campaigns
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 lg:gap-4 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 min-w-0">
              <span className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap flex-shrink-0">
                Filter by
              </span>
              <div className="flex flex-wrap items-center gap-1 sm:gap-2 min-w-0">
                <FilterDropdown
                  title="Type"
                  options={filters.type}
                  onSelectionChange={(selectedIds) => handleFilterChange('type', selectedIds)}
                  isOpen={openFilter === 'type'}
                  onToggle={() => handleFilterToggle('type')}
                  selectedCount={getSelectedCount('type')}
                />
                <FilterDropdown
                  title="Status"
                  options={filters.status}
                  onSelectionChange={(selectedIds) => handleFilterChange('status', selectedIds)}
                  isOpen={openFilter === 'status'}
                  onToggle={() => handleFilterToggle('status')}
                  selectedCount={getSelectedCount('status')}
                />
                <FilterDropdown
                  title="Budget"
                  options={filters.budget}
                  onSelectionChange={(selectedIds) => handleFilterChange('budget', selectedIds)}
                  isOpen={openFilter === 'budget'}
                  onToggle={() => handleFilterToggle('budget')}
                  selectedCount={getSelectedCount('budget')}
                />
                <FilterDropdown
                  title="Performance"
                  options={filters.performance}
                  onSelectionChange={(selectedIds) => handleFilterChange('performance', selectedIds)}
                  isOpen={openFilter === 'performance'}
                  onToggle={() => handleFilterToggle('performance')}
                  selectedCount={getSelectedCount('performance')}
                />
              </div>
            </div>

            <div className="relative flex-shrink-0 min-w-0">
              <div className="group bg-[#f6f6f6] border border-[#e9e9e9] hover:border-[#d1d5db] focus-within:border-[#9747FF] focus-within:ring-2 focus-within:ring-[#9747FF]/20 flex flex-row h-8 items-center justify-start p-px relative rounded shrink-0 w-full sm:w-[200px] sm:min-w-[200px] transition-all duration-200">
                <div className="flex items-center justify-center h-full w-7 shrink-0 mt-1 ml-1 text-[#757575] group-focus-within:text-[#9747FF] transition-colors duration-200">
                  <SearchIcon />
                </div>
                <div className="flex-1 flex items-center h-full min-w-0">
                  <div className="flex-1 flex items-center h-full px-1 py-0">
                    <input
                      type="text"
                      placeholder="Search campaigns"
                      value={currentSearchTerm}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="w-full h-full bg-transparent border-none outline-none text-[#2a2a2f] text-[13.344px] placeholder:text-[#757575] font-normal placeholder:text-[12px] sm:placeholder:text-[13.344px] focus:text-[#2a2a2f] transition-colors duration-200"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SearchIcon = ({ className }: { className?: string } = {}) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M11.5 11.5L14.5 14.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle
      cx="7"
      cy="7"
      r="5.75"
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </svg>
);

export { CampaignsFilters };
