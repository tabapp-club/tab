'use client';

import { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { MobileHeaderButton } from './MobileHeaderButton';
import DataCenterStats from './DataCenterStats';
import DataCenterFilters from './DataCenterFilters';
import DataTable from './DataTable';
import DataTableSkeleton from './DataTableSkeleton';
import Pagination from './Pagination';
import ImportModal from './ImportModal';
import { useSidebar } from './SidebarContext';
import DataCenterHeader from './data-center/DataCenterHeader';
import { useAuth } from '@/contexts/AuthContext';
import { useDataCenterData, mapApiDataToTable, UserData } from '@/hooks/useDataCenterData';
import { CampaignDetailsSidepane } from './campaigns/CampaignDetailsSidepane';
import { RecommendedCampaign } from './campaigns/RecommendedCampaigns';

// CSV Export Utility Function
const exportToCSV = (data: UserData[], filename: string = 'data-center-export.csv') => {
  if (!data || data.length === 0) {
    alert('No data to export');
    return;
  }

  // Define CSV headers
  const headers = [
    'User ID',
    'Mobile Number',
    'Category',
    'User Type',
    'No of Visits',
    'Status',
    'Added On'
  ];

  // Convert data to CSV format
  const csvContent = [
    headers.join(','),
    ...data.map(row => [
      `"${row.id}"`,
      `"${row.mobile}"`,
      `"${Array.isArray(row.categories) ? row.categories.join('; ') : row.categories}"`,
      `"${row.addedOn}"`
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

export default function DataCenterClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // For UI display (immediate)
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(''); // For API calls (debounced)
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<any>({});
  const [selectedCard, setSelectedCard] = useState<string>('total');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [campaignSidePaneOpen, setCampaignSidePaneOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<RecommendedCampaign | null>(null);
  const { isCollapsed, isMobile } = useSidebar();
  const { user } = useAuth();

  // Load filters and search from URL parameters
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    const urlPage = searchParams.get('page');
    const urlPageSize = searchParams.get('pageSize');
    const urlCard = searchParams.get('card');

    if (urlSearch) {
      setSearchTerm(urlSearch);
      setDebouncedSearchTerm(urlSearch);
    }

    if (urlPage) {
      const pageNum = parseInt(urlPage);
      if (!isNaN(pageNum) && pageNum > 0) {
        setPage(pageNum);
      }
    }

    if (urlPageSize) {
      const pageSizeNum = parseInt(urlPageSize);
      if (!isNaN(pageSizeNum) && [10, 25, 50, 100].includes(pageSizeNum)) {
        setPageSize(pageSizeNum);
      }
    }

    if (urlCard) {
      setSelectedCard(urlCard);
    }

    // Load filters from URL
    const urlFilters: any = {};
    const category = searchParams.get('category');
    const userType = searchParams.get('userType');
    const status = searchParams.get('status');
    const visitsFrom = searchParams.get('visitsFrom');
    const visitsTo = searchParams.get('visitsTo');

    if (category) urlFilters.category = category.split(',');
    if (userType) urlFilters.userType = userType;
    if (status) urlFilters.status = status;
    if (visitsFrom) urlFilters.no_of_visits_from = parseInt(visitsFrom);
    if (visitsTo) urlFilters.no_of_visits_to = parseInt(visitsTo);

    if (Object.keys(urlFilters).length > 0) {
      setFilters(urlFilters);
    }
  }, [searchParams]);

  // Function to update URL with current state
  const updateURL = useCallback(() => {
    const currentParams = new URLSearchParams(searchParams.toString());
    const newParams = new URLSearchParams();

    if (searchTerm) newParams.set('search', searchTerm);
    if (page > 1) newParams.set('page', page.toString());
    if (pageSize !== 10) newParams.set('pageSize', pageSize.toString());
    if (selectedCard !== 'total') newParams.set('card', selectedCard);

    if (filters.category?.length) newParams.set('category', filters.category.join(','));
    if (filters.userType) newParams.set('userType', filters.userType);
    if (filters.status) newParams.set('status', filters.status);
    if (filters.no_of_visits_from) newParams.set('visitsFrom', filters.no_of_visits_from.toString());
    if (filters.no_of_visits_to) newParams.set('visitsTo', filters.no_of_visits_to.toString());

    // Only update URL if parameters have actually changed
    if (currentParams.toString() !== newParams.toString()) {
      const queryString = newParams.toString();
      const newUrl = queryString ? `/data-center?${queryString}` : '/data-center';
      router.push(newUrl, { scroll: false });
    }
  }, [searchTerm, page, pageSize, selectedCard, filters, router, searchParams]);

  // Debounce timer ref
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Debounce search term to avoid excessive API calls while keeping UI responsive
  useEffect(() => {
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer for debounced search
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      // Reset to first page when search changes
      if (searchTerm !== debouncedSearchTerm) {
        setPage(1);
      }
    }, 500); // Optimized to 500ms to reduce API calls while maintaining responsiveness

    // Cleanup function
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchTerm, debouncedSearchTerm]);

  // Update URL when state changes (debounced to avoid excessive updates)
  useEffect(() => {
    // Skip URL updates during initial load from URL parameters
    const isInitialLoad = !searchTerm && !debouncedSearchTerm && page === 1 && pageSize === 10 && selectedCard === 'total' && Object.keys(filters).length === 0;
    if (isInitialLoad) return;

    const urlUpdateTimer = setTimeout(() => {
      updateURL();
    }, 100); // Reduced debounce to prevent history conflicts

    return () => clearTimeout(urlUpdateTimer);
  }, [debouncedSearchTerm, page, pageSize, selectedCard, filters, updateURL, searchTerm]);

  // Use React Query to fetch data center data
  const { data: dataCenterResponse, isLoading: loading, error } = useDataCenterData({
    page,
    pageSize,
    filters: { ...filters, search: debouncedSearchTerm, refreshTrigger }
  });

  // Process the API response data
  const currentTableData = useMemo(() => {
    if (!dataCenterResponse?.data) return [];

    // Handle nested data structure (data.data) or flat structure (data)
    let dataArray = [];
    const responseData = dataCenterResponse.data as any;

    if (Array.isArray(responseData)) {
      // Flat structure: data is directly an array
      dataArray = responseData;
    } else if (responseData && Array.isArray(responseData.data)) {
      // Nested structure: data.data is the array
      dataArray = responseData.data;
    } else {
      console.warn('DataCenter API response data is not in expected format:', dataCenterResponse);
      return [];
    }

    const mappedData = mapApiDataToTable(dataArray);
    return mappedData;
  }, [dataCenterResponse]);

  // Handle both nested and flat response structures for total, metrics, and categories
  const responseData = dataCenterResponse?.data as any;
  const total = responseData?.total || dataCenterResponse?.total || 0;
  const metrics = responseData?.metrics || dataCenterResponse?.metrics || null;
  const categories = responseData?.categories || dataCenterResponse?.categories || [];

  // Handle stats card click
  const handleCardClick = (cardType: string) => {
    setSelectedCard(cardType);
    setPage(1); // Reset to first page

    // Apply appropriate filters based on card type
    let newFilters: any = {};

    switch (cardType) {
      case 'total':
        // No filters - show all users
        newFilters = {
          userType: undefined,
          status: undefined
        };
        break;
      case 'new':
        newFilters = { userType: 'new' };
        break;
      case 'retained':
        newFilters = { userType: 'retained' };
        break;
      case 'active':
        newFilters = { status: 'active' };
        break;
      case 'inactive':
        newFilters = { status: 'inactive' };
        break;
      default:
        newFilters = {};
    }

    setFilters(newFilters);
  };



  // Handle filter/search changes
  const handleFiltersChange = (newFilters: any) => {
    setFilters((prev: any) => ({ ...prev, ...newFilters }));
    setPage(1); // Reset to first page on filter change
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(1);
  };

  const handleImportClick = useCallback(() => {
    setIsImportModalOpen(true);
  }, []);

  const handleExportClick = useCallback(() => {
    exportToCSV(currentTableData);
  }, [currentTableData]);

  // Map data center stat to RecommendedCampaign format
  const mapStatToCampaign = useCallback((filterType: string, stat: any, metrics: any): RecommendedCampaign => {
    const metric = metrics?.[stat.key as keyof typeof metrics];
    const count = metric?.count || 0;
    
    // Map filter types to campaign data
    const campaignMap: Record<string, Partial<RecommendedCampaign>> = {
      'total': {
        id: 'total-users',
        title: 'Total Users',
        description: 'Reach your entire audience at once with a comprehensive campaign',
        bgColor: 'bg-gray-100',
        iconColor: 'text-gray-600',
        expectedCampaignCost: '₹15K',
        expectedConversion: '25%',
        expectedRevenue: '₹75K',
        urgency: 'medium' as const,
        priority: false,
        estimatedImpact: 'Broad reach campaign'
      },
      'new': {
        id: 'new-users',
        title: 'New Users',
        description: 'Welcome and onboard new customers with personalized messages',
        bgColor: 'bg-blue-100',
        iconColor: 'text-blue-600',
        expectedCampaignCost: '₹8K',
        expectedConversion: '35%',
        expectedRevenue: '₹45K',
        urgency: 'high' as const,
        priority: true,
        estimatedImpact: 'Strong onboarding impact'
      },
      'retained': {
        id: 'retained-users',
        title: 'Retained Users',
        description: 'Reward loyal customers and boost retention with exclusive offers',
        bgColor: 'bg-green-100',
        iconColor: 'text-green-600',
        expectedCampaignCost: '₹10K',
        expectedConversion: '40%',
        expectedRevenue: '₹85K',
        urgency: 'medium' as const,
        priority: false,
        estimatedImpact: 'High retention value'
      },
      'active': {
        id: 'active-users',
        title: 'Active Users',
        description: 'Engage your most responsive audience with targeted promotions',
        bgColor: 'bg-purple-100',
        iconColor: 'text-purple-600',
        expectedCampaignCost: '₹12K',
        expectedConversion: '30%',
        expectedRevenue: '₹65K',
        urgency: 'high' as const,
        priority: true,
        estimatedImpact: 'Maximum engagement potential'
      },
      'inactive': {
        id: 'inactive-users',
        title: 'Inactive Users',
        description: 'Re-engage dormant customers with offers and personalized content',
        bgColor: 'bg-orange-100',
        iconColor: 'text-orange-600',
        expectedCampaignCost: '₹9K',
        expectedConversion: '20%',
        expectedRevenue: '₹35K',
        urgency: 'high' as const,
        priority: true,
        estimatedImpact: 'Revenue recovery opportunity'
      }
    };

    const baseCampaign = campaignMap[filterType] || campaignMap['total'];
    
    return {
      id: baseCampaign.id!,
      title: baseCampaign.title!,
      count,
      description: baseCampaign.description!,
      icon: stat.icon,
      bgColor: baseCampaign.bgColor!,
      iconColor: baseCampaign.iconColor!,
      expectedCampaignCost: baseCampaign.expectedCampaignCost!,
      expectedConversion: baseCampaign.expectedConversion!,
      expectedRevenue: baseCampaign.expectedRevenue!,
      urgency: baseCampaign.urgency!,
      priority: baseCampaign.priority!,
      estimatedImpact: baseCampaign.estimatedImpact!
    };
  }, []);

  // Handle send campaign from data center
  const handleSendCampaign = useCallback((filterType: string, stat: any) => {
    const campaign = mapStatToCampaign(filterType, stat, metrics);
    setSelectedCampaign(campaign);
    setCampaignSidePaneOpen(true);
  }, [metrics, mapStatToCampaign]);

  // Handle campaign sidepane close
  const handleCampaignSidePaneClose = useCallback(() => {
    setCampaignSidePaneOpen(false);
    setSelectedCampaign(null);
  }, []);

  // Force uncollapsed state on mobile
  const actualIsCollapsed = isMobile ? false : isCollapsed;

  return (
    <div className="data-center-container flex bg-[#f6f6f6] font-sans min-h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center justify-start p-3 sm:p-4 lg:hidden">
        <MobileHeaderButton />
        </header>
        <main
          className={`data-center-main flex-1 transition-all duration-300 min-w-0 ${
            actualIsCollapsed ? 'lg:ml-[64px]' : 'lg:ml-[232px]'
          }`}
        >
          <div className="h-full flex flex-col min-w-0">
            <div className="p-2 sm:p-3 lg:p-4 xl:p-6 space-y-6 flex-1 flex flex-col min-w-0">
              <DataCenterHeader onImportClick={handleImportClick} onExportClick={handleExportClick} />

            <DataCenterStats
              metrics={metrics}
              onCardClick={handleCardClick}
              selectedCard={selectedCard}
              onSendCampaign={handleSendCampaign}
            />
              <div className="lg:bg-white lg:rounded-lg flex-1 flex flex-col min-h-0 min-w-0">
            <div className="mb-4">
              <DataCenterFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onFiltersChange={handleFiltersChange}
                totalUsers={total}
                visibleUsers={currentTableData.length}
                categories={categories}
                isLoading={loading && searchTerm !== debouncedSearchTerm}
              />
            </div>
                <div className="flex-1 min-h-0 min-w-0">
            {loading && currentTableData.length === 0 ? (
              <DataTableSkeleton />
            ) : error ? (
              <div className="text-center py-10 text-red-500">{error.message}</div>
            ) : (
            <DataTable
              searchTerm={searchTerm}
                data={currentTableData}
            />
            )}
                </div>
            <div className="mt-4 pb-6 sm:pb-0">
              <Pagination
                currentPage={page}
                itemsPerPage={pageSize}
                totalItems={total}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handlePageSizeChange}
              />
            </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      {/* Blurred background overlay for ImportModal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-40 backdrop-blur-sm bg-white/30 transition-all duration-300"></div>
      )}
        {isImportModalOpen && (
          <ImportModal
            onClose={() => setIsImportModalOpen(false)}
            onUploadSuccess={() => setRefreshTrigger(prev => prev + 1)}
          />
        )}

      {/* Campaign Details Sidepane */}
      <CampaignDetailsSidepane
        isOpen={campaignSidePaneOpen}
        onClose={handleCampaignSidePaneClose}
        campaign={selectedCampaign}
      />
      </div>
  );
}
