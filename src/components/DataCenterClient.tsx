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
import { useDataCenterData, mapApiDataToTable } from '@/hooks/useDataCenterData';

// CSV Export Utility Function
const exportToCSV = (data: Array<{id: string; mobile: string; categories: string[]; addedOn: string}>, filename: string = 'data-center-export.csv') => {
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
  const { isCollapsed, isMobile } = useSidebar();
  const { user } = useAuth();

  // Load filters and search from URL parameters - only on mount
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    const urlPage = searchParams.get('page');
    const urlPageSize = searchParams.get('pageSize');
    const urlCard = searchParams.get('card');

    if (urlSearch !== null) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  // Function to update URL with current state - memoized
  const updateURL = useCallback(() => {
    const newParams = new URLSearchParams();

    if (debouncedSearchTerm) newParams.set('search', debouncedSearchTerm);
    if (page > 1) newParams.set('page', page.toString());
    if (pageSize !== 10) newParams.set('pageSize', pageSize.toString());
    if (selectedCard !== 'total') newParams.set('card', selectedCard);

    if (filters.category?.length) newParams.set('category', filters.category.join(','));
    if (filters.userType) newParams.set('userType', filters.userType);
    if (filters.status) newParams.set('status', filters.status);
    if (filters.no_of_visits_from) newParams.set('visitsFrom', filters.no_of_visits_from.toString());
    if (filters.no_of_visits_to) newParams.set('visitsTo', filters.no_of_visits_to.toString());

    const queryString = newParams.toString();
    const newUrl = queryString ? `/data-center?${queryString}` : '/data-center';
    router.replace(newUrl, { scroll: false });
  }, [debouncedSearchTerm, page, pageSize, selectedCard, filters, router]);

  // Debounce timer ref
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Debounce search term to avoid excessive API calls
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      if (searchTerm !== debouncedSearchTerm) {
        setPage(1);
      }
    }, 500);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchTerm, debouncedSearchTerm]);

  // Update URL when state changes - debounced
  const urlUpdateTimerRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (urlUpdateTimerRef.current) {
      clearTimeout(urlUpdateTimerRef.current);
    }

    urlUpdateTimerRef.current = setTimeout(() => {
      updateURL();
    }, 300);

    return () => {
      if (urlUpdateTimerRef.current) {
        clearTimeout(urlUpdateTimerRef.current);
      }
    };
  }, [debouncedSearchTerm, page, pageSize, selectedCard, filters, updateURL]);

  // Memoize filters to prevent unnecessary re-renders
  const apiFilters = useMemo(() => ({
    ...filters,
    search: debouncedSearchTerm
  }), [filters, debouncedSearchTerm]);

  // Use React Query to fetch data center data
  const { data: dataCenterResponse, isLoading: loading, error } = useDataCenterData({
    page,
    pageSize,
    filters: apiFilters,
    refreshTrigger
  });

  // Process the API response data - optimized
  const currentTableData = useMemo(() => {
    if (!dataCenterResponse?.data) return [];

    const responseData = dataCenterResponse.data as any;
    const dataArray = Array.isArray(responseData) 
      ? responseData 
      : (responseData?.data && Array.isArray(responseData.data) ? responseData.data : []);

    if (dataArray.length === 0) return [];

    return mapApiDataToTable(dataArray);
  }, [dataCenterResponse]);

  // Extract total, metrics, and categories from response - memoized
  const { total, metrics, categories } = useMemo(() => {
    const responseData = dataCenterResponse?.data as any;
    return {
      total: responseData?.total || dataCenterResponse?.total || 0,
      metrics: responseData?.metrics || dataCenterResponse?.metrics || null,
      categories: responseData?.categories || dataCenterResponse?.categories || []
    };
  }, [dataCenterResponse]);

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



  // Handle filter/search changes - memoized to prevent unnecessary re-renders
  const handleFiltersChange = useCallback((newFilters: any) => {
    setFilters((prev: any) => {
      // Only update if filters actually changed
      const hasChanges = Object.keys(newFilters).some(key => {
        if (Array.isArray(newFilters[key]) && Array.isArray(prev[key])) {
          return newFilters[key].join(',') !== prev[key].join(',');
        }
        return newFilters[key] !== prev[key];
      });
      
      if (!hasChanges) return prev;
      return { ...prev, ...newFilters };
    });
    setPage(1); // Reset to first page on filter change
  }, []);

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
              isLoading={loading && !dataCenterResponse}
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
      </div>
  );
}
