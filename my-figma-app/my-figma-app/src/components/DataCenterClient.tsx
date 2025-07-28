'use client';

import { useState, useCallback } from 'react';
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
import { useEffect } from 'react';

interface UserData {
  id: string;
  mobile: string;
  categories: string[];
  userType: string;
  visits: number;
  status: string;
  addedOn: string;
}

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
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTableData, setCurrentTableData] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<any>({});
  const [metrics, setMetrics] = useState<any>(null);
  const [categories, setCategories] = useState<Array<{name: string, label: string}>>([]);
  const [selectedCard, setSelectedCard] = useState<string>('total');
  const { isCollapsed, isMobile } = useSidebar();
  const { user } = useAuth();

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
      if (result.metrics) setMetrics(result.metrics);
      // Set categories from API response if available
      if (result.categories && Array.isArray(result.categories)) {
        setCategories(result.categories);
      }
    } catch (err: any) {
      setError(err.message || 'Unknown error');
      setCurrentTableData([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [user?.accessToken, page, pageSize, filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
    <div className="data-center-container flex bg-gray-50 font-sans min-h-screen overflow-hidden">
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
              <div className="bg-white rounded-lg shadow-sm flex-1 flex flex-col min-h-0 min-w-0">
            <DataCenterFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onFiltersChange={handleFiltersChange}
              totalUsers={total}
              visibleUsers={currentTableData.length}
              categories={categories}
            />
                <div className="flex-1 min-h-0 min-w-0">
            {loading ? (
              <div className="text-center py-10 text-[#a1a1a1]">Loading data...</div>
            ) : error ? (
              <div className="text-center py-10 text-red-500">{error}</div>
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
          <ImportModal onClose={() => setIsImportModalOpen(false)} />
        )}
      </div>
  );
}
