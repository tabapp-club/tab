'use client';

import { useState } from 'react';
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
    <div className="bg-white sticky top-0 z-10 border-b border-t border-gray-200 min-w-0">
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
            <div className="bg-[#f6f6f6] rounded-md flex items-center h-8 w-full min-w-0 max-w-full sm:max-w-[200px]">
              <div className="pl-2 pr-1 flex-shrink-0">
                <SearchIcon />
              </div>
              <input
                type="text"
                placeholder="Search campaigns"
                value={currentSearchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="bg-transparent w-full h-full border-none outline-none text-xs sm:text-sm text-gray-600 placeholder-gray-500 min-w-0"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SearchIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11.5 11.5L14.5 14.5"
      stroke="#757575"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle
      cx="7"
      cy="7"
      r="5.75"
      stroke="#757575"
      strokeWidth="1.5"
    />
  </svg>
);

export { CampaignsFilters };
