"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Send } from 'lucide-react';

interface CampaignsHeaderProps {
  onCreateCampaign?: () => void;
}

const CampaignsHeader = ({ onCreateCampaign }: CampaignsHeaderProps) => {
  const router = useRouter();

  const handleSendCampaign = () => {
    router.push('/send-campaign?from=campaigns');
  };

  return (
    <>
      {/* Mobile Layout */}
      <div className="block lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-[#2a2a2f] leading-tight tracking-[-0.1px] truncate">
              Campaigns
            </h1>
            <p className="text-sm text-[#626266] font-normal mt-0.5 truncate">
              Manage and track campaigns
            </p>
          </div>
          <button
            onClick={handleSendCampaign}
            className="flex items-center justify-center gap-2 h-9 px-4 bg-gradient-to-r from-[#9747FF] to-[#9747FF] text-white rounded font-semibold text-[14px] leading-[1.4] hover:from-[#9747FF] hover:to-[#9747FF] hover:shadow-lg transition-all duration-300 ease-in-out whitespace-nowrap"
          >
            <Send className="w-4 h-4" />
            <span>Send Campaign</span>
          </button>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-[24px] font-bold text-[#2a2a2f] leading-tight tracking-[-0.1px] truncate">
              Campaigns
            </h1>
            <p className="text-[14px] text-[#626266] font-normal mt-1 truncate">
              Manage and track your marketing campaigns
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <button
              onClick={handleSendCampaign}
              className="flex items-center justify-center gap-2 h-9 px-4 bg-gradient-to-r from-[#9747FF] to-[#9747FF] text-white rounded font-semibold text-[14px] leading-[1.4] hover:from-[#9747FF] hover:to-[#9747FF] hover:shadow-lg transition-all duration-300 ease-in-out"
            >
              <Send className="w-4 h-4" />
              <span>Send Campaign</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export { CampaignsHeader };
