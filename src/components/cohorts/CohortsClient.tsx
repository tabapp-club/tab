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
import { useAuth } from '@/contexts/AuthContext';
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
  const { user } = useAuth();

  // Fetch cohorts from API
  const fetchCohorts = useCallback(async () => {
    if (!user?.accessToken) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://api.tabapp.club/v1/cohort-analysis', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.accessToken}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch cohorts');
      const result = await response.json();
      if (!result.success) throw new Error(result.message || 'API error');
      // Map API data to CohortData[]
      const apiCohorts = (result.data || []).map((item: any) => ({
        id: item.name + '-' + item.category + '-' + item.first_invoice_date,
        name: item.category,
        count: item.count,
        category: item.category,
        createdBy: item.name || 'Rahul',
        createdDate: item.first_invoice_date,
        description: item.description || '',
      }));
      setCohorts(apiCohorts);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
      setCohorts([]);
    } finally {
      setLoading(false);
    }
  }, [user?.accessToken]);

  // Fetch on mount and when user changes
  React.useEffect(() => {
    fetchCohorts();
  }, [fetchCohorts]);

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
    console.log("Create cohort clicked");
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setSearchTerm(query);
  }, []);

  return (
    <div className="cohorts-page-container flex min-h-screen bg-[#F6F6F6]">
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
            <div className="px-2 sm:px-4 lg:px-6 pt-10 pb-0">
              <CohortsHeader
                onImportClick={handleImportClick}
                onExportClick={handleExportClick}
                onCreateCohort={handleCreateCohort}
              />
            </div>

            {/* Filter Bar - Sticky */}
            <div className="sticky top-0 z-10 px-2 sm:px-4 lg:px-6">
              <CohortsFilterBar
                onSearch={handleSearchChange}
                totalCohorts={cohorts.length}
                visibleCohorts={filteredCohorts.length}
              />
            </div>

            {/* Cohorts List */}
            <div className="flex-1 px-2 sm:px-4 lg:px-6 pb-6">
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
        </main>
      </div>

      {/* Import Modal */}
      {isImportModalOpen && (
        <ImportModal onClose={() => setIsImportModalOpen(false)} />
      )}
    </div>
  );
}
