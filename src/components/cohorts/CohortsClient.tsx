'use client';

import { useState, useCallback } from 'react';
import { MobileHeaderButton } from '../MobileHeaderButton';
import { CohortsHeader } from './CohortsHeader';
import { CohortsFilterBar } from './CohortsFilterBar';
import { CohortsList } from './CohortsList';
import ImportModal from '../ImportModal';
import { useSidebar } from '../SidebarContext';
import { CohortData } from './CohortsList';
import React from 'react';

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
  const [cohorts, setCohorts] = useState<CohortData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isCollapsed, isMobile } = useSidebar();

  // Use dummy data instead of API fetch
  React.useEffect(() => {
    setLoading(true);
    // Simulate loading delay
    setTimeout(() => {
      const dummyCohorts: CohortData[] = [
        {
          id: "mobile-buyers",
          name: "All mobile phone buyers",
          count: 6958,
          category: "Mobile phone buyers",
          createdBy: "tab AI",
          createdDate: "05-07-2025",
          description: "This cohort consists data of all the users who bought mobiles phones. this has the data of both iOS and Android with all ticket sizes"
        },
        {
          id: "android-buyers",
          name: "Android buyers",
          count: 4958,
          category: "Mobile phone buyers",
          createdBy: "tab AI",
          createdDate: "05-07-2025",
          description: "This cohort consists data of all the users who bought mobiles phones. this has the data of both iOS and Android with all ticket sizes"
        },
        {
          id: "ios-buyers",
          name: "iOS buyers",
          count: 1958,
          category: "Mobile phone buyers",
          createdBy: "tab AI",
          createdDate: "05-07-2025",
          description: "This cohort consists data of all the users who bought mobiles phones. this has the data of both iOS and Android with all ticket sizes"
        },
        {
          id: "appliances-buyers",
          name: "Home appliances buyers",
          count: 9556,
          category: "Home appliances buyers",
          createdBy: "tab AI",
          createdDate: "05-07-2025",
          description: "This cohort consists data of all the users who bought home appliances. This includes kitchen appliances, washing machines, and other household items"
        },
        {
          id: "laptop-buyers",
          name: "Laptop buyers",
          count: 2556,
          category: "Electronics buyers",
          createdBy: "tab AI",
          createdDate: "05-07-2025",
          description: "This cohort consists data of all the users who bought laptops. This includes both gaming laptops and business laptops across different price ranges"
        }
      ];
      setCohorts(dummyCohorts);
      setLoading(false);
    }, 500);
  }, []);

  // Filter cohorts by search term
  const filteredCohorts = React.useMemo(() => {
    if (!searchTerm) return cohorts;
    const searchLower = searchTerm.toLowerCase();
    return cohorts.filter(cohort =>
      Object.values(cohort).some(value =>
        String(value).toLowerCase().includes(searchLower)
      )
    );
  }, [searchTerm, cohorts]);

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
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setSearchTerm(query);
  }, []);

  return (
    <main className={`flex-1 transition-sidebar ${
      actualIsCollapsed ? 'main-content sidebar-collapsed' : 'main-content'
    }`}>
      {/* Mobile Header with Menu Toggle */}
      <header className="lg:hidden flex items-center justify-start p-3 sm:p-4 bg-[#F6F6F6] fixed top-0 left-0 right-0 z-50">
        <MobileHeaderButton />
      </header>

      {/* Main Content */}
      <div className="w-full max-w-full px-3 py-4 sm:px-4 sm:py-5 lg:px-8 lg:py-8 overflow-x-hidden">
        <div className="pt-12 lg:pt-0 space-y-6">
          {/* Header Section */}
          <CohortsHeader
            onImportClick={handleImportClick}
            onExportClick={handleExportClick}
            onCreateCohort={handleCreateCohort}
          />

          {/* Filter Bar */}
          <CohortsFilterBar
            onSearch={handleSearchChange}
            totalCohorts={cohorts.length}
            visibleCohorts={filteredCohorts.length}
          />

          {/* Cohorts List */}
          {loading ? (
            <div className="text-center py-10 text-[#a1a1a1]">Loading cohorts...</div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">{error}</div>
          ) : (
            <CohortsList
              cohorts={filteredCohorts}
            />
          )}
        </div>
      </div>

      {/* Import Modal */}
      {isImportModalOpen && (
        <ImportModal onClose={() => setIsImportModalOpen(false)} />
      )}
    </main>
  );
}
