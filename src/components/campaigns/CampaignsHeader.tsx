import React from 'react';

interface CampaignsHeaderProps {
  onCreateCampaign: () => void;
}

const CampaignsHeader = ({ onCreateCampaign }: CampaignsHeaderProps) => {
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


export { CampaignsHeader };
