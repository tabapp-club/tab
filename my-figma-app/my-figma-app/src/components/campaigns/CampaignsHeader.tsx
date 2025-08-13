import React from 'react';

interface CampaignsHeaderProps {
  onCreateCampaign: () => void;
  onImportClick: () => void;
  onExportClick: () => void;
}

const CampaignsHeader = ({ onCreateCampaign, onImportClick, onExportClick }: CampaignsHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
      <div className="flex-1 min-w-0">
        <h1 className="text-xl sm:text-2xl lg:text-[28px] font-bold text-[#2a2a2f] leading-tight tracking-[-0.1px] truncate">
          Campaigns
        </h1>
        <p className="text-sm text-[#626266] mt-1 truncate">
          Manage and track your marketing campaigns
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
        {/* Import Button */}
        <button
          onClick={onImportClick}
          className="flex items-center justify-center gap-2 h-9 px-4 relative text-[#6E4EFF] bg-white rounded-sm font-semibold text-[14px] leading-[1.4] hover:text-white hover:shadow-lg hover:scale-[1.02] focus:ring-[#6E4EFF]/50 active:scale-[0.98] transition-all duration-300 ease-in-out before:absolute before:inset-0 before:rounded-sm before:p-[1px] before:bg-gradient-to-r before:from-[#6E4EFF] before:to-[#8B6AFF] after:absolute after:inset-[1px] after:rounded-sm after:bg-white after:transition-colors after:duration-300 hover:after:bg-gradient-to-r hover:after:from-[#6E4EFF] hover:after:to-[#8B6AFF]"
        >
          <div className="relative z-10 flex items-center gap-2">
            <ImportIcon />
            <span className="hidden sm:inline">Import</span>
          </div>
        </button>

        {/* Export Button */}
        <button
          onClick={onExportClick}
          className="flex items-center justify-center gap-2 h-9 px-4 relative text-[#6E4EFF] bg-white rounded-sm font-semibold text-[14px] leading-[1.4] hover:text-white hover:shadow-lg hover:scale-[1.02] focus:ring-[#6E4EFF]/50 active:scale-[0.98] transition-all duration-300 ease-in-out before:absolute before:inset-0 before:rounded-sm before:p-[1px] before:bg-gradient-to-r before:from-[#6E4EFF] before:to-[#8B6AFF] after:absolute after:inset-[1px] after:rounded-sm after:bg-white after:transition-colors after:duration-300 hover:after:bg-gradient-to-r hover:after:from-[#6E4EFF] hover:after:to-[#8B6AFF]"
        >
          <div className="relative z-10 flex items-center gap-2">
            <ExportIcon />
            <span className="hidden sm:inline">Export</span>
          </div>
        </button>

        {/* Create Campaign Button */}
        <button
          onClick={onCreateCampaign}
          className="flex items-center justify-center gap-2 h-9 px-4 bg-gradient-to-r from-[#6E4EFF] to-[#8B6AFF] text-white rounded font-semibold text-[14px] leading-[1.4] hover:from-[#5D3EE8] hover:to-[#7A59FF] hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out active:scale-[0.98]"
        >
          <PlusIcon />
          <span>Create Campaign</span>
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

export { CampaignsHeader };
