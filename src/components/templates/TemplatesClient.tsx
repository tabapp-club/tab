'use client';

import { useState, useCallback } from 'react';
import { Sidebar } from '../Sidebar';
import { MobileHeaderButton } from '../MobileHeaderButton';
import { useSidebar } from '../SidebarContext';
import { TemplatesHeader } from './TemplatesHeader';
import { TemplatesStats } from './TemplatesStats';
import { TemplatesFilters } from './TemplatesFilters';
import { TemplatesList } from './TemplatesList';
import { CreateTemplateModal } from './CreateTemplateModal';

export interface TemplateData {
  id: string;
  name: string;
  type: 'invoice' | 'receipt' | 'quote' | 'estimate';
  category: 'professional' | 'modern' | 'minimal' | 'creative';
  status: 'active' | 'draft' | 'archived';
  usage: number;
  lastUsed: string;
  createdDate: string;
  description: string;
  previewImage: string;
  isDefault: boolean;
  tags: string[];
}

export function TemplatesClient() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTemplates, setFilteredTemplates] = useState<TemplateData[]>([]);
  const { isCollapsed, isMobile } = useSidebar();

  // Force uncollapsed state on mobile
  const actualIsCollapsed = isMobile ? false : isCollapsed;

  const handleCreateTemplate = useCallback(() => {
    setIsCreateModalOpen(true);
  }, []);

  const handleImportClick = useCallback(() => {
    // Handle import functionality
  }, []);

  const handleExportClick = useCallback(() => {
    // Handle export functionality
  }, []);

  const handleTemplatesUpdate = useCallback((templates: TemplateData[]) => {
    setFilteredTemplates(templates);
  }, []);

  return (
    <div className="templates-container flex bg-gray-50 font-sans min-h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 lg:hidden">
          <MobileHeaderButton />
          <h1 className="text-base sm:text-lg font-bold truncate">Templates</h1>
        </header>

        {/* Main Content */}
        <main
          className={`templates-main flex-1 transition-all duration-300 min-w-0 ${
            actualIsCollapsed ? 'lg:ml-[64px]' : 'lg:ml-[232px]'
          }`}
        >
          <div className="h-full flex flex-col min-w-0">
            <div className="p-2 sm:p-3 lg:p-4 xl:p-6 space-y-3 sm:space-y-4 lg:space-y-6 flex-1 flex flex-col min-w-0">
              {/* Header */}
              <TemplatesHeader
                onCreateTemplate={handleCreateTemplate}
                onImportClick={handleImportClick}
                onExportClick={handleExportClick}
              />

              {/* Stats */}
              <TemplatesStats />

              {/* Main Content Area */}
              <div className="bg-white rounded-lg shadow-sm flex-1 flex flex-col min-h-0 min-w-0">
                {/* Filters */}
                <TemplatesFilters
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                />

                {/* Templates List */}
                <div className="flex-1 min-h-0 min-w-0">
                  <TemplatesList
                    searchTerm={searchTerm}
                    onTemplatesUpdate={handleTemplatesUpdate}
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Create Template Modal */}
      {isCreateModalOpen && (
        <CreateTemplateModal onClose={() => setIsCreateModalOpen(false)} />
      )}
    </div>
  );
}
