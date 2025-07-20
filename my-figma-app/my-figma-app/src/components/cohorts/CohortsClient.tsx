'use client';

import { useState, useCallback } from 'react';
import { Sidebar } from '../Sidebar';
import { MobileMenuToggle } from '../MobileMenuToggle';
import { CohortsHeader } from './CohortsHeader';
import { CohortsFilterBar } from './CohortsFilterBar';
import { CohortsList } from './CohortsList';
import ImportModal from '../ImportModal';
import { useSidebar } from '../SidebarContext';
import { CohortData } from './CohortsList';

// CSV Export Utility Function for Cohorts
const exportCohortsToCSV = (data: CohortData[], filename: string = 'cohorts-export.csv') => {
  if (!data || data.length === 0) {
    alert('No cohorts data to export');
    return;
  }

  // Define CSV headers
  const headers = [
    'Cohort Name',
    'Count',
    'Category',
    'Created By',
    'Created Date',
    'Description'
  ];

  // Convert data to CSV format
  const csvContent = [
    headers.join(','),
    ...data.map(row => [
      `"${row.name}"`,
      row.count,
      `"${row.category}"`,
      `"${row.createdBy}"`,
      `"${row.createdDate}"`,
      `"${row.description}"`
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

export function CohortsClient() {
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCohorts, setFilteredCohorts] = useState<CohortData[]>([]);
  const { isCollapsed, isMobile } = useSidebar();

  // Force uncollapsed state on mobile
  const actualIsCollapsed = isMobile ? false : isCollapsed;

  const handleImportClick = useCallback(() => {
    setIsImportModalOpen(true);
  }, []);

  const handleExportClick = useCallback(() => {
    exportCohortsToCSV(filteredCohorts);
  }, [filteredCohorts]);

  const handleCreateCohort = useCallback(() => {
    // TODO: Implement create cohort functionality
    console.log("Create cohort clicked");
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setSearchTerm(query);
  }, []);

  const handleCohortsUpdate = useCallback((cohorts: CohortData[]) => {
    setFilteredCohorts(cohorts);
  }, []);

  return (
    <div className="cohorts-page-container flex min-h-screen bg-white">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 lg:hidden">
          <MobileMenuToggle />
          <h1 className="text-base sm:text-lg font-bold truncate">Cohorts</h1>
        </header>

        {/* Main Content Area */}
        <main
          className={`flex-1 transition-all duration-300 min-w-0 ${
            actualIsCollapsed ? 'lg:ml-[64px]' : 'lg:ml-[232px]'
          }`}
        >
          <div className="flex flex-col min-h-screen">
            {/* Header Section */}
            <div className="px-2 sm:px-4 lg:px-6 pt-4 sm:pt-6 lg:pt-[77px] pb-0">
              <CohortsHeader
                onImportClick={handleImportClick}
                onExportClick={handleExportClick}
                onCreateCohort={handleCreateCohort}
              />
            </div>

            {/* Filter Bar - Sticky */}
            <div className="sticky top-0 z-10 bg-white px-2 sm:px-4 lg:px-6">
              <CohortsFilterBar
                onSearch={handleSearchChange}
                totalCohorts={filteredCohorts.length}
                visibleCohorts={filteredCohorts.length}
              />
            </div>

            {/* Cohorts List */}
            <div className="flex-1 px-2 sm:px-4 lg:px-6 pb-6">
              <CohortsList
                searchTerm={searchTerm}
                onCohortsUpdate={handleCohortsUpdate}
              />
            </div>
          </div>
        </main>
      </div>

      {/* Import Modal */}
      {isImportModalOpen && (
        <ImportModal onClose={() => setIsImportModalOpen(false)} />
      )}
    </div>
  );
}
