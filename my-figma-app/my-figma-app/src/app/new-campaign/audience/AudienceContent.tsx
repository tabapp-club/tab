"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MobileMenuToggle } from "@/components/MobileMenuToggle";
import { useSidebar } from "@/components/SidebarContext";
import { usePopup } from "@/contexts/PopupContext";
import { useAuth } from "@/contexts/AuthContext";
import DataTable from "@/components/DataTable";
import Pagination from "@/components/Pagination";
import DataCenterFilters from "@/components/DataCenterFilters";
import FilterDropdown from "@/components/FilterDropdown";

interface UserData {
  id: string;
  mobile: string;
  categories: string[];
  userType: string;
  visits: number;
  status: string;
  addedOn: string;
}

interface CampaignMedium {
  id: string;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
}

const campaignMediums: CampaignMedium[] = [
  {
    id: 'sms',
    name: 'Text Message (SMS)',
    description: 'Send text messages to your customer',
    icon: '📱',
    enabled: true
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    description: 'Send Whatsapp to your customer',
    icon: '💬',
    enabled: true
  },
  {
    id: 'tab',
    name: 'tab',
    description: 'Engage more with your users',
    icon: '📋',
    enabled: true
  }
];

const progressSteps = [
  { id: 1, title: 'Choose campaign type', completed: true },
  { id: 2, title: 'Create campaign', completed: true },
  { id: 3, title: 'Choose Audience', completed: true },
  { id: 4, title: 'Schedule Date & Time', completed: false }
];

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.5 4.5L6 12L2.5 8.5" stroke="#7856ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Animated Step Component
const AnimatedStep = ({ step, index, isLast }: { step: any; index: number; isLast: boolean }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Stagger animation for each step
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 150);

    return () => clearTimeout(timer);
  }, [index]);

  useEffect(() => {
    if (step.completed) {
      const timer = setTimeout(() => {
        setIsCompleted(true);
      }, 300 + index * 150);
      return () => clearTimeout(timer);
    }
  }, [step.completed, index]);

  // Simulate loading animation for current step
  useEffect(() => {
    if (!step.completed && index === 2) { // Current step (Audience)
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [step.completed, index]);

  return (
    <div className={`flex items-center flex-1 transition-all duration-500 ease-out ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}>
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10">
          {step.completed ? (
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#7856ff]/10 flex items-center justify-center transition-all duration-500 ease-out ${
              isCompleted ? 'scale-110' : 'scale-100'
            }`}>
              <div className={`transition-all duration-300 ease-out ${
                isCompleted ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
              }`}>
                <CheckIcon />
              </div>
            </div>
          ) : isLoading ? (
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-[#7856ff] flex items-center justify-center transition-all duration-300">
              <div className="w-4 h-4 border-2 border-[#7856ff] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-[#e9e9e9] flex items-center justify-center transition-all duration-300">
              <span className="text-sm font-medium text-[#626266]">{step.id}</span>
            </div>
          )}
        </div>
        <span className={`text-sm sm:text-base font-semibold text-[#2a2a2f] tracking-tight transition-all duration-300 ${
          step.completed ? 'text-[#7856ff]' : isLoading ? 'text-[#7856ff]' : 'text-[#2a2a2f]'
        }`}>
          {step.title}
        </span>
      </div>
      {!isLast && (
        <div className="hidden sm:block flex-1 mx-6 relative">
          <div className="h-px bg-[#e9e9e9] w-full"></div>
          {step.completed && (
            <div className={`absolute top-0 left-0 h-full bg-[#7856ff] transition-all duration-1000 ease-out ${
              isCompleted ? 'w-full' : 'w-0'
            }`}></div>
          )}
          {isLoading && (
            <div className="absolute top-0 left-0 h-full bg-[#7856ff] animate-pulse">
              <div className="h-full bg-gradient-to-r from-[#7856ff] via-[#9b7cff] to-[#7856ff] animate-shimmer"></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export function AudienceContent() {
  const { isCollapsed, isMobile } = useSidebar();
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showWarning } = usePopup();
  const campaignType = searchParams.get('type') || 'advertise';

  // Force uncollapsed state on mobile
  const actualIsCollapsed = isMobile ? false : isCollapsed;

  const [selectedMediums, setSelectedMediums] = useState<string[]>(['sms', 'whatsapp', 'tab']);
  const [userCount, setUserCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<any>({});
  const [allUsersEnabled, setAllUsersEnabled] = useState(true);
  const [currentTableData, setCurrentTableData] = useState<UserData[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState<Array<{name: string, label: string}>>([]);
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [filterState, setFilterState] = useState({
    category: [] as string[],
    userType: [] as string[],
    visits: [] as string[],
    status: [] as string[]
  });
  const [isLoading, setIsLoading] = useState(false);

  // Helper to map API response to UserData[]
  const mapApiDataToTable = (apiData: any[]): UserData[] => {
    return apiData.map((r: any) => {
      let status: 'Active' | 'In Active' = 'In Active';
      if (typeof r.status === 'string' && r.status.toLowerCase() === 'active') status = 'Active';
      return {
        id: r.user_id,
        mobile: r.mobile_number,
        categories: Array.isArray(r.category) ? r.category : [r.category],
        userType: r.user_type,
        visits: r.no_of_visits,
        status,
        addedOn: r.added_on,
      };
    });
  };

  // Fetch data from API
  const fetchData = useCallback(async () => {
    if (!user?.accessToken) return;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.append('page', String(page));
      params.append('page_size', String(pageSize));
      if (filters.category && filters.category.length > 0) {
        filters.category.forEach((cat: string) => params.append('category', cat));
      }
      if (filters.userType) params.append('user_type', filters.userType);
      if (filters.no_of_visits_from !== undefined) params.append('no_of_visits_from', String(filters.no_of_visits_from));
      if (filters.no_of_visits_to !== undefined) params.append('no_of_visits_to', String(filters.no_of_visits_to));
      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);
      const url = `https://api.tabapp.club/v1/dashboard-data-centre?${params.toString()}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.accessToken}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch data center data');
      const result = await response.json();
      setCurrentTableData(mapApiDataToTable(result.data));
      setTotal(result.total);
      setUserCount(result.total);
      if (result.categories && Array.isArray(result.categories)) {
        setCategories(result.categories);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      setUserCount(0);
      setCurrentTableData([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [user?.accessToken, page, pageSize, filters]);

  // Fetch data on component mount and when filters change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleMediumToggle = (mediumId: string) => {
    setSelectedMediums(prev =>
      prev.includes(mediumId)
        ? prev.filter(id => id !== mediumId)
        : [...prev, mediumId]
    );
  };

  const handleAllUsersToggle = () => {
    const newAllUsersEnabled = !allUsersEnabled;
    setAllUsersEnabled(newAllUsersEnabled);

    if (newAllUsersEnabled) {
      // Reset filters when enabling all users
      setFilters({});
      setFilterState({
        category: [],
        userType: [],
        visits: [],
        status: []
      });
    }
  };

  const handleFilterToggle = (filterType: string) => {
    setOpenFilter(openFilter === filterType ? null : filterType);
  };

  const handleFilterSelection = (filterType: string, selectedIds: string[]) => {
    // Turn off "All users" toggle when any filter is selected
    if (selectedIds.length > 0) {
      setAllUsersEnabled(false);
    }

    setFilterState(prev => ({
      ...prev,
      [filterType]: selectedIds
    }));

    // Convert to API format and update filters
    const apiFilters: any = {};
    if (filterType === 'category') {
      apiFilters.category = selectedIds;
    } else if (filterType === 'userType') {
      apiFilters.userType = selectedIds[0];
    } else if (filterType === 'visits') {
      // Parse visit ranges
      const visitRanges = selectedIds.map(id => {
        if (id === '1') return { from: 1, to: 1 };
        if (id === '2-5') return { from: 2, to: 5 };
        if (id === '6-10') return { from: 6, to: 10 };
        if (id === '11-20') return { from: 11, to: 20 };
        if (id === '21+') return { from: 21, to: 999 };
        return null;
      }).filter(Boolean);

      if (visitRanges.length > 0) {
        apiFilters.no_of_visits_from = Math.min(...visitRanges.map(r => r!.from));
        apiFilters.no_of_visits_to = Math.max(...visitRanges.map(r => r!.to));
      }
    } else if (filterType === 'status') {
      apiFilters.status = selectedIds[0];
    }

    handleFiltersChange(apiFilters);
  };

  const getSelectedCount = (filterType: string) => {
    return filterState[filterType as keyof typeof filterState]?.length || 0;
  };

  const handleFiltersChange = (newFilters: any) => {
    setFilters((prev: any) => ({ ...prev, ...newFilters }));
    setPage(1); // Reset to first page on filter change
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(1);
  };

  const formatUserCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

        const handleProceed = async () => {
      if (selectedMediums.length === 0) {
        showWarning(
          'No Campaign Medium Selected',
          'Please select at least one campaign medium before proceeding.'
        );
        return;
      }

      if (!allUsersEnabled && Object.keys(filters).length === 0) {
        showWarning(
          'No Audience Selected',
          'Please either enable "All users" or select specific filters for your audience.'
        );
        return;
      }

      setIsLoading(true);
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      router.push(`/new-campaign/schedule?type=${campaignType}&medium=${selectedMediums.join(',')}`);
    };

  return (
    <main className={`flex-1 transition-sidebar ${
      actualIsCollapsed ? 'main-content sidebar-collapsed' : 'main-content'
    }`}>
      {/* Mobile Menu Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <MobileMenuToggle />
      </div>

      <div className="w-full max-w-full px-3 py-4 sm:px-4 sm:py-5 lg:px-8 lg:py-8 overflow-x-hidden min-h-screen">
        {/* Header */}
        <header className="mb-6 sm:mb-8 lg:mb-12 pt-12 lg:pt-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-[32px] font-bold text-[#2a2a2f] leading-tight sm:leading-[39.2px] lg:leading-[44px] tracking-[-0.1px]">
                Choose Audience
              </h1>
              <p className="text-sm sm:text-base text-[#626266] mt-2 sm:mt-3">
                Select your campaign medium and target audience
              </p>
            </div>
            <div className="flex justify-end">
                              <button
                  onClick={handleProceed}
                  disabled={isLoading}
                  className={`px-6 py-3 text-white rounded-lg font-medium transition-all duration-200 shadow-lg ${
                    isLoading
                      ? 'bg-[#7856ff] cursor-not-allowed opacity-75'
                      : 'bg-[#7856ff] hover:bg-[#6a4fd8] hover:shadow-xl'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Scheduling...</span>
                    </div>
                  ) : (
                    'Proceed to Schedule Campaign'
                  )}
                </button>
            </div>
          </div>
        </header>

        {/* Progress Indicator */}
        <section className="mb-6 sm:mb-8 lg:mb-12 rounded-lg bg-[#fff] border border-[#fff] box-border overflow-hidden">
          <div className="p-3 sm:p-4 lg:p-6 lg:pl-[35px]">
            {/* <h2 className="text-sm sm:text-[16px] font-semibold text-[#696969] leading-[1.4] sm:leading-[22.4px] tracking-[-0.1px] mb-3 sm:mb-4 lg:mb-[17px]">
              Campaign Progress
            </h2> */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
              {progressSteps.map((step, index) => (
                <AnimatedStep
                  key={step.id}
                  step={step}
                  index={index}
                  isLast={index === progressSteps.length - 1}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Audience Overview & Campaign Medium */}
        <section className="mb-6 sm:mb-8 lg:mb-12 rounded-lg bg-[#f6f6f6] border border-[#dbdbdb] box-border overflow-hidden">
          <div className="p-3 sm:p-4 lg:p-6 lg:pl-[35px]">
            <h3 className="text-sm sm:text-[16px] font-semibold text-[#696969] leading-[1.4] sm:leading-[22.4px] tracking-[-0.1px] mb-3 sm:mb-4 lg:mb-[17px]">
              Campaign Overview
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                              {/* User Count Card with Filters */}
                <div className="bg-white rounded-lg border border-[#e9e9e9] p-4 sm:p-6">
                  {/* Filters Section */}
                  <div className="mb-4">
                    <div className="flex flex-col gap-4">
                      {/* All Users Toggle Row */}
                      <div className="flex flex-row gap-2.5 items-center">
                        <div className="font-medium text-[#99a1b7] text-[13px] leading-[14px] tracking-[-0.13px]">
                          All users
                        </div>
                        <div className="h-[20px] w-[36px] relative">
                          <button
                            onClick={handleAllUsersToggle}
                            className={`relative inline-flex h-[20px] w-[36px] items-center rounded-full transition-colors ${
                              allUsersEnabled ? 'bg-[#7856ff]' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-[16px] w-[16px] transform rounded-full bg-white transition-transform ${
                                allUsersEnabled ? 'translate-x-4' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                                            {/* Filter Dropdowns Row */}
                      <div className="flex flex-row gap-4 items-center">
                        <div className="font-medium text-[#99a1b7] text-[13px] leading-[14px] tracking-[-0.13px] flex-shrink-0">
                          Filters
                        </div>
                        <div className="flex flex-row gap-2 flex-wrap min-w-0">
                          {/* Category Filter */}
                          <div className="flex-shrink-0">
                            <FilterDropdown
                              title="Category"
                              options={categories.map(cat => ({
                                id: cat.name,
                                label: cat.label,
                                checked: filterState.category.includes(cat.name)
                              }))}
                              onSelectionChange={(selectedIds: string[]) => handleFilterSelection('category', selectedIds)}
                              isOpen={openFilter === 'category'}
                              onToggle={() => handleFilterToggle('category')}
                              selectedCount={getSelectedCount('category')}
                              singleSelect={true}
                            />
                          </div>

                          {/* User Type Filter */}
                          <div className="flex-shrink-0">
                            <FilterDropdown
                              title="User type"
                              options={[
                                { id: 'retained', label: 'Retained', checked: filterState.userType.includes('retained') },
                                { id: 'new', label: 'New', checked: filterState.userType.includes('new') }
                              ]}
                              onSelectionChange={(selectedIds: string[]) => handleFilterSelection('userType', selectedIds)}
                              isOpen={openFilter === 'userType'}
                              onToggle={() => handleFilterToggle('userType')}
                              selectedCount={getSelectedCount('userType')}
                              singleSelect={true}
                            />
                          </div>

                          {/* No of Visits Filter */}
                          <div className="flex-shrink-0">
                            <FilterDropdown
                              title="No of visits"
                              options={[
                                { id: '1', label: '1', checked: filterState.visits.includes('1') },
                                { id: '2-5', label: '2-5', checked: filterState.visits.includes('2-5') },
                                { id: '6-10', label: '6-10', checked: filterState.visits.includes('6-10') },
                                { id: '11-20', label: '11-20', checked: filterState.visits.includes('11-20') },
                                { id: '21+', label: '21+', checked: filterState.visits.includes('21+') }
                              ]}
                              onSelectionChange={(selectedIds: string[]) => handleFilterSelection('visits', selectedIds)}
                              isOpen={openFilter === 'visits'}
                              onToggle={() => handleFilterToggle('visits')}
                              selectedCount={getSelectedCount('visits')}
                            />
                          </div>

                          {/* Status Filter */}
                          <div className="flex-shrink-0">
                            <FilterDropdown
                              title="Status"
                              options={[
                                { id: 'active', label: 'Active', checked: filterState.status.includes('active') },
                                { id: 'inactive', label: 'Inactive', checked: filterState.status.includes('inactive') }
                              ]}
                              onSelectionChange={(selectedIds: string[]) => handleFilterSelection('status', selectedIds)}
                              isOpen={openFilter === 'status'}
                              onToggle={() => handleFilterToggle('status')}
                              selectedCount={getSelectedCount('status')}
                              singleSelect={true}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* User Count Section */}
                  <div className="border-t border-[#e9e9e9] pt-4">
                    <p className="text-[#4b5675] text-base mb-2">Sending campaign to</p>
                    <div className="text-[#071437] text-3xl font-semibold tracking-[-0.6px]">
                      {loading ? 'Loading...' : `${formatUserCount(userCount)} users`}
                    </div>
                    {error && (
                      <p className="text-red-500 text-sm mt-2">{error}</p>
                    )}
                  </div>
                </div>

              {/* Campaign Medium Selection */}
              <div className="bg-white rounded-lg border border-[#e9e9e9] p-4 sm:p-6">
                <h4 className="text-[#071437] font-medium text-sm mb-3">Campaign Medium</h4>
                <div className="space-y-3">
                  {campaignMediums.map((medium) => (
                    <div
                      key={medium.id}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        selectedMediums.includes(medium.id)
                          ? 'border-[#7856ff] bg-[#7856ff]/5'
                          : 'border-[#e9e9e9] bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-[40px] h-[40px] bg-[#f6f6f6] rounded-lg flex items-center justify-center text-[#7856ff] text-lg">
                          {medium.icon}
                        </div>
                        <div>
                          <h5 className="text-[#071437] font-medium text-sm">
                            {medium.name}
                          </h5>
                          <p className="text-[#4b5675] text-xs">
                            {medium.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <button
                          onClick={() => handleMediumToggle(medium.id)}
                          className={`relative inline-flex h-[16px] w-[28px] items-center rounded-full transition-colors ${
                            selectedMediums.includes(medium.id) ? 'bg-[#7856ff]' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-[12px] w-[12px] transform rounded-full bg-white transition-transform ${
                              selectedMediums.includes(medium.id) ? 'translate-x-3' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>


      </div>
    </main>
  );
}
