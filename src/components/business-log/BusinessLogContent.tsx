"use client";

import { useState, useEffect } from "react";
import { useSidebar } from "@/components/SidebarContext";
import { MobileHeaderButton } from "@/components/MobileHeaderButton";
import { BusinessLogForm } from "./BusinessLogForm";
import { BusinessLogList } from "./BusinessLogList";
import { BusinessLogStats } from "./BusinessLogStats";
import { BusinessLogFields } from "./BusinessLogFields";
import { useBusinessLogData } from "@/hooks/useBusinessLogData";
import { useToast } from "@/hooks/useToast";
import { Plus, History, Settings } from "lucide-react";

export function BusinessLogContent() {
  const { isCollapsed, isMobile } = useSidebar();
  const { success, error: showError } = useToast();
  const [activeTab, setActiveTab] = useState<'entry' | 'history' | 'fields'>('entry');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [statusFilter, setStatusFilter] = useState<'new' | 'returning' | undefined>(undefined);
  const { data: businessLogData, hasNext, totalPages, currentPage: apiCurrentPage, isLoading, error, refetch, updateEntry, deleteEntry } = useBusinessLogData(10, currentPage, statusFilter);

  console.log('BusinessLogContent - businessLogData:', businessLogData);
  console.log('BusinessLogContent - isLoading:', isLoading);
  console.log('BusinessLogContent - error:', error);
  console.log('BusinessLogContent - currentPage:', currentPage);
  console.log('BusinessLogContent - statusFilter:', statusFilter);

  // Handle update entry with proper error handling
  const handleUpdateEntry = async ({ id, updates }: { id: string; updates: any }) => {
    try {
      await updateEntry({ id, updates });
      success('Entry updated successfully!');
    } catch (error: any) {
      showError(error.message || 'Error updating entry. Please try again.');
    }
  };

  // Handle delete entry with proper error handling
  const handleDeleteEntry = async (id: string) => {
    try {
      await deleteEntry(id);
      success('Entry deleted successfully!');
    } catch (error: any) {
      showError(error.message || 'Error deleting entry. Please try again.');
    }
  };



  // Reset pagination when switching tabs
  useEffect(() => {
    if (activeTab !== 'history') {
      setCurrentPage(1);
    }
  }, [activeTab]);

  // Reset pagination when status filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  // Handle status filter change
  const handleStatusFilterChange = (status: 'new' | 'returning' | undefined) => {
    setStatusFilter(status);
  };

  // Only refresh data when switching to history tab if data is stale
  useEffect(() => {
    if (activeTab === 'history' && !businessLogData) {
      refetch();
    }
  }, [activeTab, refetch, businessLogData]);

  // Force uncollapsed state on mobile
  const actualIsCollapsed = isMobile ? false : isCollapsed;

  return (
    <main className={`flex-1 transition-sidebar ${
      actualIsCollapsed ? 'main-content sidebar-collapsed' : 'main-content'
    }`}>
      {/* Mobile Header with Menu Toggle */}
      <header className="lg:hidden flex items-center justify-start p-3 sm:p-4 bg-[#F6F6F6] fixed top-0 left-0 right-0 z-50">
        <MobileHeaderButton />
      </header>

      <div className="w-full max-w-full px-3 py-4 sm:px-4 sm:py-5 lg:px-8 lg:py-8 overflow-x-hidden">
        {/* Header */}
        <header className="mb-6 sm:mb-8 lg:mb-12 pt-12 lg:pt-0">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div>
              <h1 className="text-[24px] font-bold text-[#2a2a2f] leading-tight tracking-[-0.1px]">
                Business Record
              </h1>
              <p className="text-[14px] text-[#2A2A2F] font-normal mt-2">
                Manual customer entry for businesses
              </p>
            </div>
          </div>
        </header>


        {/* Tabs */}
        <section className="mb-6">
          <nav className="flex overflow-x-auto px-3 sm:px-6">
            <div className="flex space-x-2 sm:space-x-8 min-w-max">
              <button
                onClick={() => setActiveTab('entry')}
                className={`py-3 sm:py-4 px-2 sm:px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                  activeTab === 'entry'
                    ? 'border-[#7856ff] text-[#7856ff]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-1 sm:gap-2">
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">New Entry</span>
                  <span className="sm:hidden">Entry</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`py-3 sm:py-4 px-2 sm:px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                  activeTab === 'history'
                    ? 'border-[#7856ff] text-[#7856ff]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-1 sm:gap-2">
                  <History className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Entry History</span>
                  <span className="sm:hidden">History</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('fields')}
                className={`py-3 sm:py-4 px-2 sm:px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                  activeTab === 'fields'
                    ? 'border-[#7856ff] text-[#7856ff]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-1 sm:gap-2">
                  <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Manage Fields</span>
                  <span className="sm:hidden">Fields</span>
                </div>
              </button>
            </div>
          </nav>

          <div className="p-3 sm:p-6">
            {activeTab === 'entry' ? (
              <BusinessLogForm />
             ) : activeTab === 'history' ? (
                <BusinessLogList
                  data={businessLogData}
                  loading={isLoading}
                  error={error}
                  onNextPage={() => {
                    if (hasNext) {
                      setCurrentPage(prev => prev + 1);
                    }
                  }}
                  onPrevPage={() => {
                    if (currentPage > 1) {
                      setCurrentPage(prev => prev - 1);
                    }
                  }}
                  hasNextPage={hasNext}
                  hasPrevPage={currentPage > 1}
                  onUpdateEntry={handleUpdateEntry}
                  onDeleteEntry={handleDeleteEntry}
                  statusFilter={statusFilter}
                  onStatusFilterChange={handleStatusFilterChange}
                />
              ) : activeTab === 'fields' ? (
              <BusinessLogFields />
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
