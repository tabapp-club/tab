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
  isLoading?: boolean;
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
  alignRight = false,
  isLoading = false
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
      console.log('Sending filter changes to parent:', pendingFilterChange.current);
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
        // Try to preserve checked state for all selected options
        const prevCheckedIds = prev.category.filter(option => option.checked).map(option => option.id);
        const categoryOptions = categories.map(cat => ({
          id: cat.name,
          label: cat.label,
          checked: prevCheckedIds.includes(cat.name)
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
    console.log('DataCenterFilters handleFilterChange called:', { filterType, selectedIds });

    setFilters(prev => {
      console.log('Previous filters state:', prev[filterType]);

      let newOptions;
      if (filterType === 'category') {
        // Multi-select for categories
        newOptions = prev[filterType].map(option => ({
          ...option,
          checked: selectedIds.includes(option.id)
        }));
        console.log('New category options:', newOptions);
      } else if (filterType === 'userType' || filterType === 'visits') {
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
        // Multi-select for other filters
        newOptions = prev[filterType].map(option => ({
          ...option,
          checked: selectedIds.includes(option.id)
        }));
      }

      // Store filter change in ref to be handled by useEffect
      const filterObj: any = {};
      if (filterType === 'category') {
        // Multiple categories can be selected
        const selectedOptions = newOptions.filter(option => option.checked);
        filterObj.category = selectedOptions.map(option => option.label);
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

    // Call parent immediately for responsive UI
    if (onSearchChange) {
      onSearchChange(value);
    }

    // Store search filter change in ref
    pendingFilterChange.current = { search: value };
  };

  return (
    <div className="bg-transparent min-w-0 data-center-filters py-3 px-3 sm:py-4 sm:px-4">
      <div className={`flex flex-col lg:flex-row items-start lg:items-center gap-4 min-w-0 ${alignRight ? 'justify-end' : 'justify-between'}`}>
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
        <div className={`flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4 lg:gap-6 min-w-0 w-full md:w-auto ${alignRight ? 'justify-end' : ''}`}>
          {/* Filter section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 md:gap-3 min-w-0 filter-section w-full md:w-auto">
            {/* Filter by label with vertical border - hidden on mobile */}
            <div className="hidden sm:flex flex-row items-start justify-start pl-4 pr-[15px] py-0 relative shrink-0 filter-by-label">
              <div className="flex flex-col font-medium justify-center leading-[0] relative shrink-0 text-[#2a2a2f] text-[13.891px] text-left text-nowrap tracking-[-0.1px]">
                <p className="adjustLetterSpacing block leading-[19.6px] whitespace-pre">
                  Filter by
                </p>
              </div>
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap sm:flex-row gap-2 items-start justify-start min-w-0 filter-buttons w-full sm:w-auto">
              <FilterDropdown
                title="Category"
                options={filters.category}
                onSelectionChange={(selectedIds) => handleFilterChange('category', selectedIds)}
                isOpen={openFilter === 'category'}
                onToggle={() => handleFilterToggle('category')}
                selectedCount={getSelectedCount('category')}
                singleSelect={false}
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
            <div className="flex flex-row items-center justify-start w-full sm:w-auto sm:min-w-[168px] relative shrink-0 search-input">
              <div className="flex flex-col items-start justify-start relative w-full sm:w-auto">
                <div className="bg-[#f6f6f6] flex flex-row h-8 items-center justify-start p-px relative rounded-md shrink-0 w-full sm:w-[168px] sm:min-w-[168px]">
                  <div className="flex items-center justify-center h-full w-7 shrink-0 mt-1 ml-1">
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#6E4EFF] border-t-transparent"></div>
                    ) : (
                      <SearchIcon />
                    )}
                  </div>
                  <div className="flex-1 flex items-center h-full min-w-0">
                    <div className="flex-1 flex items-center h-full px-1 py-0">
                      <input
                        type="text"
                        placeholder="Search customers"
                        value={currentSearchTerm}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="w-full h-full bg-transparent border-none outline-none text-[#757575] text-[13.344px] placeholder:text-[#757575] font-normal placeholder:text-[12px] sm:placeholder:text-[13.344px]"
                      />
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
    width="18"
    height="18"
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
      r="5"
      stroke="#757575"
      strokeWidth="1.5"
    />
  </svg>
);

export default DataCenterFilters;
