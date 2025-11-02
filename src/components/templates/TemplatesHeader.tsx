import React from 'react';

interface TemplatesHeaderProps {
  onCreateTemplate: () => void;
  onImportClick: () => void;
  onExportClick: () => void;
}

const TemplatesHeader = ({ onCreateTemplate, onImportClick, onExportClick }: TemplatesHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
      <div className="flex-1 min-w-0">
        <h1 className="text-xl sm:text-2xl lg:text-[28px] font-bold text-[#2a2a2f] leading-tight tracking-[-0.1px] truncate">
          Templates
        </h1>
        <p className="text-sm text-[#626266] mt-1 truncate">
          Manage and customize your invoice templates
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
        {/* Import Button */}
        <button
          onClick={onImportClick}
          className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 border border-[#e9e9e9] rounded-md text-sm font-normal text-[#2a2a2f] hover:bg-gray-50 transition-colors min-h-[36px] sm:min-h-[40px]"
        >
          <ImportIcon />
          <span className="hidden sm:inline">Import</span>
        </button>

        {/* Export Button */}
        <button
          onClick={onExportClick}
          className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 border border-[#e9e9e9] rounded-md text-sm font-normal text-[#2a2a2f] hover:bg-gray-50 transition-colors min-h-[36px] sm:min-h-[40px]"
        >
          <ExportIcon />
          <span className="hidden sm:inline">Export</span>
        </button>

        {/* Create Template Button */}
        <button
          onClick={onCreateTemplate}
          className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-[#9747FF] text-white rounded-md text-sm font-medium hover:bg-[#6B46E5] transition-colors min-h-[36px] sm:min-h-[40px]"
        >
          <PlusIcon />
          <span>Create Template</span>
        </button>
      </div>
    </div>
  );
};

// Icon Components
const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 1V15M1 8H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ImportIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 10V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V10M11.3333 5.33333L8 2M8 2L4.66667 5.33333M8 2V10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ExportIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 10V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V10M4.66667 6.66667L8 10M8 10L11.3333 6.66667M8 10V2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export { TemplatesHeader };
