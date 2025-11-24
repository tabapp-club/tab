'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import type { CSSProperties } from 'react';
import FilterDropdownShadcn from './FilterDropdownShadcn';
import { getAllEventTypes, getEventTypeLabel } from '@/lib/eventTypes';

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
  eventType: FilterOption[];
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
    event_type?: string;
    search?: string;
  }) => void;
  totalUsers?: number;
  visibleUsers?: number;
  categories?: Array<{name: string, label: string}>;
  clearFilters?: boolean;
  showUserCount?: boolean;
  showSearchBar?: boolean;
  showFilterByLabel?: boolean;
  showImportButton?: boolean;
  onImportClick?: () => void;
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
  showFilterByLabel = true,
  showImportButton = false,
  onImportClick,
  alignRight = false,
  isLoading = false
}: DataCenterFiltersProps = {}) => {
  const [internalSearchTerm, setInternalSearchTerm] = useState('');
  // Initialize event types from storage
  const [eventTypes, setEventTypes] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      return getAllEventTypes();
    }
    return [];
  });

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
    eventType: [],
  });

  // Listen for event type updates
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleEventTypesUpdate = () => {
      const updatedTypes = getAllEventTypes();
      setEventTypes(updatedTypes);
      
      // Update eventType filter options
      setFilters(prev => {
        const prevCheckedIds = prev.eventType.filter(option => option.checked).map(option => option.id);
        const eventTypeOptions = updatedTypes.map(eventType => ({
          id: eventType,
          label: getEventTypeLabel(eventType),
          checked: prevCheckedIds.includes(eventType)
        }));
        return {
          ...prev,
          eventType: eventTypeOptions
        };
      });
    };

    // Initial load
    handleEventTypesUpdate();

    // Listen for updates
    window.addEventListener('eventTypesUpdated', handleEventTypesUpdate);
    return () => {
      window.removeEventListener('eventTypesUpdated', handleEventTypesUpdate);
    };
  }, []);

  // Initialize eventType filter options
  useEffect(() => {
    if (eventTypes.length > 0) {
      setFilters(prev => {
        // Only update if eventType is empty or structure changed
        if (prev.eventType.length === 0 || 
            prev.eventType.map(e => e.id).sort().join(',') !== eventTypes.sort().join(',')) {
          const prevCheckedIds = prev.eventType.filter(option => option.checked).map(option => option.id);
          const eventTypeOptions = eventTypes.map(eventType => ({
            id: eventType,
            label: getEventTypeLabel(eventType),
            checked: prevCheckedIds.includes(eventType)
          }));
          return {
            ...prev,
            eventType: eventTypeOptions
          };
        }
        return prev;
      });
    }
  }, [eventTypes]);

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
  }, [filters.category, filters.status, filters.userType, filters.visits, filters.eventType, onFiltersChange]);

  // Track previous clearFilters value to prevent infinite loops
  const prevClearFiltersRef = useRef(clearFilters);

  // Clear filters when clearFilters prop is true
  useEffect(() => {
    // Only run if clearFilters changed from false to true
    if (clearFilters && !prevClearFiltersRef.current) {
      setFilters(prev => ({
        category: prev.category.map(option => ({ ...option, checked: false })),
        userType: prev.userType.map(option => ({ ...option, checked: false })),
        visits: prev.visits.map(option => ({ ...option, checked: false })),
        status: prev.status.map(option => ({ ...option, checked: false })),
        eventType: prev.eventType.map(option => ({ ...option, checked: false })),
      }));
      setInternalSearchTerm('');

      // Notify parent about cleared filters
      if (onFiltersChange) {
        onFiltersChange({
          category: [],
          userType: undefined,
          no_of_visits_from: undefined,
          no_of_visits_to: undefined,
          status: undefined,
          event_type: undefined,
          search: ''
        });
      }
      if (onSearchChange) {
        onSearchChange('');
      }
    }
    // Update ref to track current value
    prevClearFiltersRef.current = clearFilters;
  }, [clearFilters, onFiltersChange, onSearchChange]);

  // Memoize categories to prevent unnecessary re-renders
  const categoriesString = useMemo(() => {
    return categories ? JSON.stringify(categories.map(c => ({ name: c.name, label: c.label }))) : '';
  }, [categories]);

  // Update category filter options when categories prop changes
  useEffect(() => {
    if (categories && categories.length > 0) {
      setFilters(prev => {
        // Check if categories actually changed by comparing IDs
        const currentCategoryIds = prev.category.map(c => c.id).sort().join(',');
        const newCategoryIds = categories.map(c => c.name).sort().join(',');
        
        // Only update if categories actually changed
        if (currentCategoryIds === newCategoryIds) {
          return prev;
        }

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
      setFilters(prev => {
        // Only update if category structure is different
        const defaultCategories = [
          { id: 'mobile', label: 'Mobile', checked: false },
          { id: 'electronics', label: 'Electronics', checked: false },
          { id: 'fashion', label: 'Fashion', checked: false },
          { id: 'appliances', label: 'Appliances', checked: false },
          { id: 'grocery', label: 'Grocery', checked: false },
          { id: 'other', label: 'Other', checked: false },
        ];
        
        const currentCategoryIds = prev.category.map(c => c.id).sort().join(',');
        const defaultCategoryIds = defaultCategories.map(c => c.id).sort().join(',');
        
        if (currentCategoryIds === defaultCategoryIds) {
          return prev;
        }

        return {
          ...prev,
          category: defaultCategories
        };
      });
    }
  }, [categoriesString]);

  // Cleanup search debounce timer on unmount
  useEffect(() => {
    const timer = searchDebounceTimer.current;
    return () => {
      if (timer) {
        clearTimeout(timer);
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


    const handleFilterChange = (filterType: keyof FilterState, selectedIds: string[]) => {
    setFilters(prev => {
      let newOptions;
      if (filterType === 'category') {
        // Multi-select for categories
        newOptions = prev[filterType].map(option => ({
          ...option,
          checked: selectedIds.includes(option.id)
        }));
      } else if (filterType === 'userType') {
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
      } else if (filterType === 'visits' || filterType === 'eventType') {
        // Multi-select for visits and eventType
        newOptions = prev[filterType].map(option => ({
          ...option,
          checked: selectedIds.includes(option.id)
        }));
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
        const selected = newOptions.filter(option => option.checked);
        if (selected.length > 0) {
          // For multiple selections, use the first selected range
          // In a real implementation, you might want to handle multiple ranges differently
          const firstSelected = selected[0];
          const range = parseVisitRange(firstSelected.id);
          if (range.from !== undefined) filterObj.no_of_visits_from = range.from;
          if (range.to !== undefined) filterObj.no_of_visits_to = range.to;
        } else {
          // No visits selected, clear the filter
          filterObj.no_of_visits_from = undefined;
          filterObj.no_of_visits_to = undefined;
        }
      }
      if (filterType === 'status') filterObj.status = selectedIds[0] || undefined;
      if (filterType === 'eventType') {
        const selected = newOptions.filter(option => option.checked);
        // For multiple selections, use the first selected event type
        // In a real implementation, you might want to handle multiple event types differently
        filterObj.event_type = selected.length > 0 ? selected[0].id : undefined;
      }

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
      <div className="flex flex-col gap-6">
        {/* Top row - User count and Search */}
        <div className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 min-w-0 ${alignRight ? 'justify-end' : 'justify-between'}`}>
          {/* Left side - User count */}
          {showUserCount && (
            <div className="flex flex-row items-center gap-2 min-w-0 user-count">
              <div className="flex flex-col font-normal justify-center leading-[0] relative shrink-0 text-[#2a2a2f] text-[14px] text-left text-nowrap">
                <p className="block leading-[14px] whitespace-pre">
                  Showing {visibleUsers} of {totalUsers.toLocaleString()} users
                </p>
              </div>
            </div>
          )}

          {/* Search and Import - Left aligned */}
          <div className="flex flex-row items-center gap-3 w-full sm:w-auto">
            {/* Search input */}
            {showSearchBar && (
              <div className="flex flex-row items-center justify-start w-full sm:w-auto sm:min-w-[336px] relative shrink-0 search-input">
                <div className="flex flex-col items-start justify-start relative w-full sm:w-auto">
                  <div className="group bg-[#f6f6f6] border border-[#e9e9e9] hover:border-[#d1d5db] focus-within:border-[#9747FF] focus-within:ring-2 focus-within:ring-[#9747FF]/20 flex flex-row h-10 items-center justify-start p-px relative rounded shrink-0 w-full sm:w-[336px] sm:min-w-[336px] transition-all duration-200">
                    <div className="flex items-center justify-center h-full w-7 shrink-0 mt-1 ml-1 text-[#757575] group-focus-within:text-[#9747FF] transition-colors duration-200">
                      {isLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#9747FF] border-t-transparent"></div>
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
                          className="w-full h-full bg-transparent border-none outline-none text-[#2a2a2f] text-[13.344px] placeholder:text-[#757575] font-normal placeholder:text-[12px] sm:placeholder:text-[13.344px] focus:text-[#2a2a2f] transition-colors duration-200"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Import CSV Button - Secondary button */}
            {showImportButton && (
              <button
                onClick={onImportClick}
                className="flex items-center justify-center gap-2 h-10 px-4 bg-white border border-[#e9e9e9] rounded-md hover:bg-gray-50 hover:border-[#d1d5db] transition-colors flex-shrink-0"
              >
                <ImportIcon />
                <span className="text-sm font-medium text-[#2a2a2f] whitespace-nowrap">
                  Import CSV
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Bottom row - Filters */}
        <div className={`flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-4 lg:gap-6 min-w-0 w-full ${alignRight ? 'justify-end' : ''}`}>
          {/* Filter section */}
          <div 
            className="flex flex-col sm:flex-row items-start sm:items-center gap-2 md:gap-3 min-w-0 filter-section w-full md:w-auto overflow-x-auto sm:overflow-x-visible scrollbar-hide"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            } as CSSProperties}
          >
            {/* Filter by label with vertical border - hidden on mobile */}
            {showFilterByLabel && (
              <div className="hidden sm:flex flex-row items-start justify-start pl-4 pr-[15px] py-0 relative shrink-0 filter-by-label">
                <div className="flex flex-col font-medium justify-center leading-[0] relative shrink-0 text-[#2a2a2f] text-[13.891px] text-left text-nowrap tracking-[-0.1px]">
                  <p className="adjustLetterSpacing block leading-[19.6px] whitespace-pre">
                    Filter by
                  </p>
                </div>
              </div>
            )}

            {/* Filter buttons */}
            <div 
              className="flex gap-2 items-start justify-start min-w-0 filter-buttons w-full sm:w-auto overflow-x-auto sm:flex-wrap sm:overflow-x-visible scrollbar-hide pb-1 sm:pb-0"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                minWidth: 'max-content',
              } as CSSProperties}
            >
              <FilterDropdownShadcn
                title="Category"
                options={filters.category}
                sections={(() => {
                  if (filters.category.length === 0) return undefined;
                  // Group categories into sections
                  const productCategories = filters.category.filter(cat => 
                    ['mobile', 'electronics', 'appliances'].includes(cat.id.toLowerCase())
                  );
                  const serviceCategories = filters.category.filter(cat => 
                    ['fashion', 'grocery', 'other'].includes(cat.id.toLowerCase())
                  );
                  const customCategories = filters.category.filter(cat => 
                    !['mobile', 'electronics', 'appliances', 'fashion', 'grocery', 'other'].includes(cat.id.toLowerCase())
                  );
                  
                  const sections = [];
                  if (productCategories.length > 0) {
                    sections.push({ title: 'Product Categories', options: productCategories });
                  }
                  if (serviceCategories.length > 0) {
                    sections.push({ title: 'Service Categories', options: serviceCategories });
                  }
                  if (customCategories.length > 0) {
                    sections.push({ title: 'Custom Categories', options: customCategories });
                  }
                  return sections.length > 0 ? sections : undefined;
                })()}
                onSelectionChange={(selectedIds) => handleFilterChange('category', selectedIds)}
                selectedCount={getSelectedCount('category')}
                singleSelect={false}
              />
              <FilterDropdownShadcn
                title="User Type"
                options={filters.userType}
                onSelectionChange={(selectedIds) => handleFilterChange('userType', selectedIds)}
                selectedCount={getSelectedCount('userType')}
                singleSelect={true}
              />
              <FilterDropdownShadcn
                title="No of visits"
                options={filters.visits}
                sections={[
                  { 
                    title: 'Low Visits', 
                    options: filters.visits.filter(v => ['1', '2-5'].includes(v.id))
                  },
                  { 
                    title: 'Medium Visits', 
                    options: filters.visits.filter(v => ['6-10', '11-20'].includes(v.id))
                  },
                  { 
                    title: 'High Visits', 
                    options: filters.visits.filter(v => v.id === '21+')
                  }
                ]}
                onSelectionChange={(selectedIds) => handleFilterChange('visits', selectedIds)}
                selectedCount={getSelectedCount('visits')}
                singleSelect={false}
              />
              <FilterDropdownShadcn
                title="Status"
                options={filters.status}
                onSelectionChange={(selectedIds) => handleFilterChange('status', selectedIds)}
                selectedCount={getSelectedCount('status')}
                singleSelect={true}
              />
              <FilterDropdownShadcn
                title="Event Type"
                options={filters.eventType}
                sections={(() => {
                  if (filters.eventType.length === 0) return undefined;
                  
                  // Group event types into sections
                  const appointmentEvents = filters.eventType.filter(et => 
                    et.id.includes('APPOINTMENT') || et.id.includes('appointment')
                  );
                  const treatmentEvents = filters.eventType.filter(et => 
                    et.id.includes('TREATMENT') || et.id.includes('SESSION') || et.id.includes('CONSULTATION') || 
                    et.id.includes('treatment') || et.id.includes('session') || et.id.includes('consultation')
                  );
                  const followupEvents = filters.eventType.filter(et => 
                    et.id.includes('FOLLOWUP') || et.id.includes('FOLLOW_UP') || 
                    et.id.includes('followup') || et.id.includes('follow_up')
                  );
                  const paymentEvents = filters.eventType.filter(et => 
                    et.id.includes('PAYMENT') || et.id.includes('payment')
                  );
                  const otherEvents = filters.eventType.filter(et => 
                    !et.id.includes('APPOINTMENT') && !et.id.includes('TREATMENT') && 
                    !et.id.includes('SESSION') && !et.id.includes('CONSULTATION') &&
                    !et.id.includes('FOLLOWUP') && !et.id.includes('FOLLOW_UP') &&
                    !et.id.includes('PAYMENT') &&
                    !et.id.includes('appointment') && !et.id.includes('treatment') && 
                    !et.id.includes('session') && !et.id.includes('consultation') &&
                    !et.id.includes('followup') && !et.id.includes('follow_up') &&
                    !et.id.includes('payment')
                  );
                  
                  const sections = [];
                  if (appointmentEvents.length > 0) {
                    sections.push({ title: 'Appointments', options: appointmentEvents });
                  }
                  if (treatmentEvents.length > 0) {
                    sections.push({ title: 'Treatments', options: treatmentEvents });
                  }
                  if (followupEvents.length > 0) {
                    sections.push({ title: 'Follow-ups', options: followupEvents });
                  }
                  if (paymentEvents.length > 0) {
                    sections.push({ title: 'Payments', options: paymentEvents });
                  }
                  if (otherEvents.length > 0) {
                    sections.push({ title: 'Other Events', options: otherEvents });
                  }
                  return sections.length > 0 ? sections : undefined;
                })()}
                onSelectionChange={(selectedIds) => handleFilterChange('eventType', selectedIds)}
                selectedCount={getSelectedCount('eventType')}
                singleSelect={false}
              />

              {/* Clear Filters Button */}
              <button
                onClick={() => {
                  setFilters({
                    category: filters.category.map(option => ({ ...option, checked: false })),
                    userType: filters.userType.map(option => ({ ...option, checked: false })),
                    visits: filters.visits.map(option => ({ ...option, checked: false })),
                    status: filters.status.map(option => ({ ...option, checked: false })),
                    eventType: filters.eventType.map(option => ({ ...option, checked: false })),
                  });
                  setInternalSearchTerm('');

                  // Notify parent about cleared filters
                  if (onFiltersChange) {
                    onFiltersChange({
                      category: [],
                      userType: undefined,
                      no_of_visits_from: undefined,
                      no_of_visits_to: undefined,
                      status: undefined,
                      event_type: undefined,
                      search: ''
                    });
                  }
                  if (onSearchChange) {
                    onSearchChange('');
                  }
                }}
                className="bg-white h-10 px-3 py-px border border-[#e9e9e9] rounded-md flex items-center justify-center overflow-clip hover:bg-gray-50 transition-colors filter-button flex-shrink-0"
              >
                <span className="text-[13.453px] font-normal text-[#2a2a2f]">
                  Clear filters
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SearchIcon = ({ className }: { className?: string }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 22 22"
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
      r="5"
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </svg>
);

const ImportIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 2V7.25M8 7.25L5.75 5M8 7.25L10.25 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2.75 8.75V12.25C2.75 12.6642 3.08579 13 3.5 13H12.5C12.9142 13 13.25 12.6642 13.25 12.25V8.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M1.75 11.25H2.5M13.5 11.25H14.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default DataCenterFilters;
