'use client';

import { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { MobileMenuToggle } from './MobileMenuToggle';
import DataCenterStats from './DataCenterStats';
import DataCenterFilters from './DataCenterFilters';
import DataTable from './DataTable';
import Pagination from './Pagination';
import ImportModal from './ImportModal';
import { useSidebar } from './SidebarContext';
import DataCenterHeader from './data-center/DataCenterHeader';
import { useAuth } from '@/contexts/AuthContext';
import { useDataCenterData, mapApiDataToTable, UserData } from '@/hooks/useDataCenterData';

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
      `"${row.userType}"`,
      row.visits,
      `"${row.status}"`,
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
    }, 300); // Reduced to 300ms for better responsiveness

    // Cleanup function
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchTerm, debouncedSearchTerm]);

  // Use React Query to fetch data center data
  const { data: dataCenterResponse, isLoading: loading, error } = useDataCenterData({
    page,
    pageSize,
    filters: { ...filters, search: debouncedSearchTerm, refreshTrigger }
  });

  // Process the API response data
  const currentTableData = useMemo(() => {
    if (!dataCenterResponse?.data) return [];
    const mappedData = mapApiDataToTable(dataCenterResponse.data);
    console.log('Data Center - Original API data:', dataCenterResponse.data);
    console.log('Data Center - Mapped table data:', mappedData);
    return mappedData;
  }, [dataCenterResponse]);

  const total = dataCenterResponse?.total || 0;
  const metrics = dataCenterResponse?.metrics || null;
  const categories = dataCenterResponse?.categories || [];

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

  // Force uncollapsed state on mobile
  const actualIsCollapsed = isMobile ? false : isCollapsed;

  return (
    <div className="data-center-container flex bg-[#f6f6f6] font-sans min-h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 lg:hidden">
        <MobileMenuToggle />
          <h1 className="text-base sm:text-lg font-bold truncate">Data Center</h1>
        </header>
        <main
          className={`data-center-main flex-1 transition-all duration-300 min-w-0 ${
            actualIsCollapsed ? 'lg:ml-[64px]' : 'lg:ml-[232px]'
          }`}
        >
          <div className="h-full flex flex-col min-w-0">
            <div className="p-2 sm:p-3 lg:p-4 xl:p-6 space-y-3 sm:space-y-4 lg:space-y-6 flex-1 flex flex-col min-w-0">
              <DataCenterHeader onImportClick={handleImportClick} onExportClick={handleExportClick} />

            <DataCenterStats
              metrics={metrics}
              onCardClick={handleCardClick}
              selectedCard={selectedCard}
            />
              <div className="bg-white rounded-lg flex-1 flex flex-col min-h-0 min-w-0">
            <DataCenterFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onFiltersChange={handleFiltersChange}
              totalUsers={total}
              visibleUsers={currentTableData.length}
              categories={categories}
              isLoading={loading && searchTerm !== debouncedSearchTerm}
            />
                <div className="flex-1 min-h-0 min-w-0">
            {loading && currentTableData.length === 0 ? (
              <div className="text-center py-10 text-[#a1a1a1]">Loading data...</div>
            ) : error ? (
              <div className="text-center py-10 text-red-500">{error.message}</div>
            ) : (
            <DataTable
              searchTerm={searchTerm}
                data={currentTableData}
            />
            )}
                </div>
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
