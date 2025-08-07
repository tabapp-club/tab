'use client';

import { useState, useEffect, useRef } from 'react';
import FilterDropdown from './FilterDropdown';

interface FilterOption {
  id: string;
  label: string;
  checked: boolean;
}

interface FilterState {
  category: FilterOption[];
  userType: FilterOption[];
  visits: FilterOption[];
  status: FilterOption[];
}

interface DataCenterFiltersProps {
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  onFiltersChange?: (filters: {
    category?: string[];
    userType?: string;
    no_of_visits_from?: number;
    no_of_visits_to?: number;
    status?: string;
    search?: string;
  }) => void;
  totalUsers?: number;
  visibleUsers?: number;
  categories?: Array<{name: string, label: string}>;
  clearFilters?: boolean;
  showUserCount?: boolean;
  showSearchBar?: boolean;
  alignRight?: boolean;
}

const DataCenterFilters = ({
  searchTerm: externalSearchTerm,
  onSearchChange,
  onFiltersChange,
  totalUsers = 0,
  visibleUsers = 0,
  categories = [],
  clearFilters = false,
  showUserCount = true,
  showSearchBar = true,
  alignRight = false
}: DataCenterFiltersProps = {}) => {
  const [internalSearchTerm, setInternalSearchTerm] = useState('');
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    category: [],
    userType: [
      { id: 'retained', label: 'Retained', checked: false },
      { id: 'new', label: 'New', checked: false },
    ],
    visits: [
      { id: '1', label: '1', checked: false },
      { id: '2-5', label: '2-5', checked: false },
      { id: '6-10', label: '6-10', checked: false },
      { id: '11-20', label: '11-20', checked: false },
      { id: '21+', label: '21+', checked: false },
    ],
    status: [
      { id: 'active', label: 'Active', checked: false },
      { id: 'inactive', label: 'Inactive', checked: false },
    ],
  });

  // Use ref to store pending filter changes
  const pendingFilterChange = useRef<any>(null);

  // Debounce timer for search
  const searchDebounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Effect to handle filter change notifications
  useEffect(() => {
    if (pendingFilterChange.current && onFiltersChange) {
      onFiltersChange(pendingFilterChange.current);
      pendingFilterChange.current = null;
    }
  }, [filters.category, filters.status, filters.userType, filters.visits, onFiltersChange]);

  // Clear filters when clearFilters prop is true
  useEffect(() => {
    if (clearFilters) {
      setFilters({
        category: filters.category.map(option => ({ ...option, checked: false })),
        userType: filters.userType.map(option => ({ ...option, checked: false })),
        visits: filters.visits.map(option => ({ ...option, checked: false })),
        status: filters.status.map(option => ({ ...option, checked: false })),
      });
      setInternalSearchTerm('');
      setOpenFilter(null);

      // Notify parent about cleared filters
      if (onFiltersChange) {
        onFiltersChange({
          category: [],
          userType: undefined,
          no_of_visits_from: undefined,
          no_of_visits_to: undefined,
          status: undefined,
          search: ''
        });
      }
      if (onSearchChange) {
        onSearchChange('');
      }
    }
  }, [clearFilters, onFiltersChange, onSearchChange]);

  // Update category filter options when categories prop changes
  useEffect(() => {
    if (categories && categories.length > 0) {
      setFilters(prev => {
        // Try to preserve checked state if possible
        const prevChecked = prev.category.find(option => option.checked)?.id;
        const categoryOptions = categories.map(cat => ({
          id: cat.name,
          label: cat.label,
          checked: prevChecked === cat.name
        }));
        return {
          ...prev,
          category: categoryOptions
        };
      });
    } else {
      setFilters(prev => ({
        ...prev,
        category: [
          { id: 'mobile', label: 'Mobile', checked: false },
          { id: 'electronics', label: 'Electronics', checked: false },
          { id: 'fashion', label: 'Fashion', checked: false },
          { id: 'appliances', label: 'Appliances', checked: false },
          { id: 'grocery', label: 'Grocery', checked: false },
          { id: 'other', label: 'Other', checked: false },
        ]
      }));
    }
  }, [categories]);

  // Cleanup search debounce timer on unmount
  useEffect(() => {
    return () => {
      if (searchDebounceTimer.current) {
        clearTimeout(searchDebounceTimer.current);
      }
    };
  }, []);

  // Helper to parse visit range
  function parseVisitRange(id: string): { from?: number; to?: number } {
    if (id === '1') return { from: 1, to: 1 };
    if (id === '2-5') return { from: 2, to: 5 };
    if (id === '6-10') return { from: 6, to: 10 };
    if (id === '11-20') return { from: 11, to: 20 };
    if (id === '21+') return { from: 21 };
    return {};
  }

  const handleFilterToggle = (filterType: string) => {
    setOpenFilter(openFilter === filterType ? null : filterType);
  };

  const handleFilterChange = (filterType: keyof FilterState, selectedIds: string[]) => {
    setFilters(prev => {
      let newOptions;
      if (filterType === 'category' || filterType === 'userType' || filterType === 'visits') {
        // Single-select toggle: if already selected, unselect; else select only the clicked one
        const prevChecked = prev[filterType].find(option => option.checked)?.id;
        const clickedId = selectedIds[0];
        newOptions = prev[filterType].map(option => {
          if (option.id === clickedId) {
            // If already checked, uncheck; else check
            return { ...option, checked: prevChecked === clickedId ? false : true };
          } else {
            return { ...option, checked: false };
          }
        });
      } else {
        // Multi-select
        newOptions = prev[filterType].map(option => ({
          ...option,
          checked: selectedIds.includes(option.id)
        }));
      }

      // Store filter change in ref to be handled by useEffect
      const filterObj: any = {};
      if (filterType === 'category') {
        // Only one can be selected
        const selected = newOptions.find(option => option.checked);
        filterObj.category = selected ? [selected.label] : [];
      }
      if (filterType === 'userType') {
        const selected = newOptions.find(option => option.checked);
        filterObj.userType = selected ? selected.id : undefined;
      }
      if (filterType === 'visits') {
        const selected = newOptions.find(option => option.checked);
        if (selected) {
          const range = parseVisitRange(selected.id);
          if (range.from !== undefined) filterObj.no_of_visits_from = range.from;
          if (range.to !== undefined) filterObj.no_of_visits_to = range.to;
        } else {
          // No visits selected, clear the filter
          filterObj.no_of_visits_from = undefined;
          filterObj.no_of_visits_to = undefined;
        }
      }
      if (filterType === 'status') filterObj.status = selectedIds[0] || undefined;

      // Store in ref to be handled by useEffect
      pendingFilterChange.current = filterObj;

      return {
        ...prev,
        [filterType]: newOptions
      };
    });
  };

  const getSelectedCount = (filterType: keyof FilterState) => {
    return filters[filterType].filter(option => option.checked).length;
  };

  const currentSearchTerm = externalSearchTerm !== undefined ? externalSearchTerm : internalSearchTerm;

  const handleSearchChange = (value: string) => {
    // Update internal state immediately for UI responsiveness
    setInternalSearchTerm(value);

    // Clear existing timer
    if (searchDebounceTimer.current) {
      clearTimeout(searchDebounceTimer.current);
    }

    // Set new timer for debounced search
    searchDebounceTimer.current = setTimeout(() => {
      if (onSearchChange) {
        onSearchChange(value);
      }

      // Store search filter change in ref
      pendingFilterChange.current = { search: value };
    }, 500); // 500ms debounce for search
  };

  return (
    <div className="bg-transparent min-w-0 data-center-filters py-4 px-4">
      <div className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 min-w-0 ${alignRight ? 'justify-end' : 'justify-between'}`}>
        {/* Left side - User count */}
        {showUserCount && (
          <div className="flex flex-row items-center gap-2 min-w-0 user-count">
            <div className="flex flex-col font-medium justify-center leading-[0] relative shrink-0 text-[#2a2a2f] text-[14px] text-left text-nowrap">
              <p className="block leading-[14px] whitespace-pre">
                Showing {visibleUsers} of {totalUsers.toLocaleString()} users
              </p>
            </div>
          </div>
        )}

        {/* Right side - Filters and Search */}
        <div className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 min-w-0 ${alignRight ? 'justify-end' : ''}`}>
          {/* Filter section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 min-w-0 filter-section">
            {/* Filter by label with vertical border */}
            <div className="flex flex-row items-start justify-start pl-4 pr-[15px] py-0 relative shrink-0 filter-by-label">
              <div className="flex flex-col font-medium justify-center leading-[0] relative shrink-0 text-[#2a2a2f] text-[13.891px] text-left text-nowrap tracking-[-0.1px]">
                <p className="adjustLetterSpacing block leading-[19.6px] whitespace-pre">
                  Filter by
                </p>
              </div>
            </div>

            {/* Filter buttons */}
            <div className="flex flex-row gap-2 items-start justify-start min-w-0 filter-buttons">
              <FilterDropdown
                title="Category"
                options={filters.category}
                onSelectionChange={(selectedIds) => handleFilterChange('category', selectedIds)}
                isOpen={openFilter === 'category'}
                onToggle={() => handleFilterToggle('category')}
                selectedCount={getSelectedCount('category')}
                singleSelect={true}
              />
              <FilterDropdown
                title="User Type"
                options={filters.userType}
                onSelectionChange={(selectedIds) => handleFilterChange('userType', selectedIds)}
                isOpen={openFilter === 'userType'}
                onToggle={() => handleFilterToggle('userType')}
                selectedCount={getSelectedCount('userType')}
                singleSelect={true}
              />
              <FilterDropdown
                title="No of visits"
                options={filters.visits}
                onSelectionChange={(selectedIds) => handleFilterChange('visits', selectedIds)}
                isOpen={openFilter === 'visits'}
                onToggle={() => handleFilterToggle('visits')}
                selectedCount={getSelectedCount('visits')}
                singleSelect={true}
              />
              <FilterDropdown
                title="Status"
                options={filters.status}
                onSelectionChange={(selectedIds) => handleFilterChange('status', selectedIds)}
                isOpen={openFilter === 'status'}
                onToggle={() => handleFilterToggle('status')}
                selectedCount={getSelectedCount('status')}
                singleSelect={true}
              />

              {/* Clear Filters Button */}
              <button
                onClick={() => {
                  setFilters({
                    category: filters.category.map(option => ({ ...option, checked: false })),
                    userType: filters.userType.map(option => ({ ...option, checked: false })),
                    visits: filters.visits.map(option => ({ ...option, checked: false })),
                    status: filters.status.map(option => ({ ...option, checked: false })),
                  });
                  setInternalSearchTerm('');
                  setOpenFilter(null);

                  // Notify parent about cleared filters
                  if (onFiltersChange) {
                    onFiltersChange({
                      category: [],
                      userType: undefined,
                      no_of_visits_from: undefined,
                      no_of_visits_to: undefined,
                      status: undefined,
                      search: ''
                    });
                  }
                  if (onSearchChange) {
                    onSearchChange('');
                  }
                }}
                className="bg-white h-8 px-3 py-px border border-[#e9e9e9] rounded-md flex items-center justify-center overflow-clip hover:bg-gray-50 transition-colors filter-button text-[#2a2a2f] text-[13.453px] font-medium"
              >
                Clear filters
              </button>
            </div>
          </div>

          {/* Search input */}
          {showSearchBar && (
            <div className="flex flex-row items-center justify-start min-w-[168px] relative shrink-0 search-input">
              <div className="flex flex-col items-start justify-start relative self-stretch shrink-0">
                <div className="bg-[#f6f6f6] flex flex-row h-8 items-start justify-start p-px relative rounded-md shrink-0 w-[168px] min-w-[168px]">
                  <div className="flex flex-row h-full items-center justify-start relative shrink-0">
                    <div className="flex flex-row items-start justify-start pl-1 pr-0 py-0 relative shrink-0">
                      <div className="relative shrink-0 size-[22px]">
                        <SearchIcon />
                      </div>
                    </div>
                  </div>
                  <div className="basis-0 flex flex-row grow h-full items-center justify-center min-h-px min-w-px relative shrink-0">
                    <div className="basis-0 flex flex-col grow h-[30px] items-start justify-start min-h-px min-w-px overflow-clip px-2 py-[6.5px] relative rounded-md shrink-0">
                      <div className="flex flex-col items-start justify-start overflow-clip relative shrink-0 w-full">
                        <input
                          type="text"
                          placeholder="Search customers"
                          value={currentSearchTerm}
                          onChange={(e) => handleSearchChange(e.target.value)}
                          className="flex flex-col font-normal justify-center leading-[0] relative shrink-0 text-[#757575] text-[13.344px] text-left w-full bg-transparent border-none outline-none placeholder:text-[#757575]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SearchIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 22 22"
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

export default DataCenterFilters;
