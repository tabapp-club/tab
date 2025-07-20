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
  const { isCollapsed, isMobile } = useSidebar();

  // Force uncollapsed state on mobile
  const actualIsCollapsed = isMobile ? false : isCollapsed;

  const handleImportClick = useCallback(() => {
    setIsImportModalOpen(true);
  }, []);

  const handleExportClick = useCallback(() => {
    exportToCSV(currentTableData);
  }, [currentTableData]);

  const handleDataChange = useCallback((data: UserData[]) => {
    setCurrentTableData(data);
  }, []);

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

              <DataCenterStats />
              <div className="bg-white rounded-lg shadow-sm flex-1 flex flex-col min-h-0 min-w-0">
                <DataCenterFilters
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                />
                <div className="flex-1 min-h-0 min-w-0">
                  <DataTable
                    searchTerm={searchTerm}
                    onDataChange={handleDataChange}
                  />
                </div>
                <Pagination />
              </div>
            </div>
          </div>
        </main>
      </div>
      {isImportModalOpen && (
        <ImportModal onClose={() => setIsImportModalOpen(false)} />
      )}
    </div>
  );
}
