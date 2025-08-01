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
}

const DataCenterFilters = ({
  searchTerm: externalSearchTerm,
  onSearchChange,
  onFiltersChange,
  totalUsers = 0,
  visibleUsers = 0,
  categories = []
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

  // Effect to handle filter change notifications
  useEffect(() => {
    if (pendingFilterChange.current && onFiltersChange) {
      onFiltersChange(pendingFilterChange.current);
      pendingFilterChange.current = null;
    }
  }, [filters, onFiltersChange]);

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
    if (onSearchChange) {
      onSearchChange(value);
    } else {
      setInternalSearchTerm(value);
    }

    // Store search filter change in ref
    pendingFilterChange.current = { search: value };
  };

  // Add a function to clear all filters
  const handleClearFilters = () => {
    setFilters({
      category: filters.category.map(option => ({ ...option, checked: false })),
      userType: filters.userType.map(option => ({ ...option, checked: false })),
      visits: filters.visits.map(option => ({ ...option, checked: false })),
      status: filters.status.map(option => ({ ...option, checked: false })),
    });

    // Store clear filters action in ref
    pendingFilterChange.current = {
      category: [],
      userType: undefined,
      no_of_visits_from: undefined,
      no_of_visits_to: undefined,
      status: undefined,
      search: currentSearchTerm || undefined,
    };
  };

  return (
    <div className="bg-white sticky top-0 z-10 border-b border-t border-gray-200 min-w-0">
      <div className="flex flex-col gap-2 sm:gap-3 lg:gap-0 lg:flex-row lg:items-center lg:justify-between p-2 sm:p-3 lg:px-4 lg:py-0 lg:h-[60px] min-w-0">
        <div className="flex-shrink-0 text-xs sm:text-sm font-medium text-gray-700 truncate">
          Showing {visibleUsers} of {totalUsers} users
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 lg:gap-4 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 min-w-0">
            <span className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap flex-shrink-0">
              Filter by
            </span>
            <div className="flex flex-wrap gap-2 items-center mb-2 relative">
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
            />
            <FilterDropdown
              title="Status"
              options={filters.status}
              onSelectionChange={(selectedIds) => handleFilterChange('status', selectedIds)}
              isOpen={openFilter === 'status'}
              onToggle={() => handleFilterToggle('status')}
              selectedCount={getSelectedCount('status')}
            />
            </div>
          </div>
          {/* Add Clear Filters button */}
          <button
            type="button"
            onClick={handleClearFilters}
            className="text-xs sm:text-sm text-[#7856ff] hover:underline ml-0 sm:ml-4 mt-2 sm:mt-0 font-medium"
          >
            Clear filters
          </button>
          <div className="relative flex-shrink-0 min-w-0">
            <div className="bg-[#f6f6f6] rounded-md flex items-center h-8 w-full min-w-0 max-w-full sm:max-w-[200px]">
              <div className="pl-2 pr-1 flex-shrink-0">
                <SearchIcon />
              </div>
              <input
                type="text"
                placeholder="Search customers"
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

export default DataCenterFilters;
