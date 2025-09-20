"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useSidebar } from "@/components/SidebarContext";

interface CampaignFooterProps {
  onClose?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  nextLabel?: string;
  previousLabel?: string;
  nextDisabled?: boolean;
  previousDisabled?: boolean;
  showPrevious?: boolean;
  isNavigating?: boolean;
  showSaveMessage?: boolean;
  saveMessage?: string;
}

export function CampaignFooter({
  onClose,
  onNext,
  onPrevious,
  nextLabel = "Continue",
  previousLabel = "Back", 
  nextDisabled = false,
  previousDisabled = false,
  showPrevious = false,
  isNavigating = false,
  showSaveMessage = true,
  saveMessage = "All changes are saved"
}: CampaignFooterProps) {
  const router = useRouter();
  const { isCollapsed: actualIsCollapsed, isMobile } = useSidebar();

  const handleClose = onClose || (() => router.push('/campaigns'));

  return (
    <div className={`fixed bottom-0 bg-white border-t border-[#e9e9e9] px-4 sm:px-6 lg:px-12 py-3 z-50 ${
      isMobile ? 'left-0 right-0' : actualIsCollapsed ? 'left-[64px] right-0' : 'left-[232px] right-0'
    }`}>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-between">
        {/* Mobile Layout */}
        <div className="lg:hidden flex gap-3 w-full">
          <button
            onClick={handleClose}
            className="flex-1 h-9 px-4 border border-[#e9e9e9] rounded font-medium text-[#2a2a2f] text-[16px] transition-colors hover:bg-gray-50 active:bg-gray-100 touch-manipulation"
          >
            Close
          </button>
          <button
            onClick={onNext}
            disabled={nextDisabled || isNavigating}
            className={`flex-[2] h-9 px-6 rounded font-medium text-[16px] transition-all duration-200 touch-manipulation ${
              !nextDisabled && !isNavigating
                ? 'bg-gradient-to-r from-[#6e4eff] to-[#8B6AFF] text-white hover:from-[#5a3de8] hover:to-[#7856ff] active:scale-[0.98]'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isNavigating ? 'Loading...' : nextLabel}
          </button>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex flex-row gap-2 sm:gap-4 items-center">
          <button
            onClick={handleClose}
            className="h-9 px-4 py-1 border border-[#e9e9e9] rounded font-medium text-[#2a2a2f] text-[14px] transition-colors hover:bg-gray-50"
          >
            Close
          </button>
          {showSaveMessage && (
            <div className="text-[#2a2a2f] text-[14px] font-medium">
              {saveMessage}
            </div>
          )}
        </div>
        
        <div className="hidden lg:flex flex-row gap-2 sm:gap-4 items-center">
          {showPrevious && onPrevious && (
            <button
              onClick={onPrevious}
              disabled={previousDisabled || isNavigating}
              className={`h-9 px-4 py-1 rounded font-medium text-[14px] transition-all duration-200 ${
                !previousDisabled && !isNavigating
                  ? 'bg-gray-100 text-[#2a2a2f] hover:bg-gray-200'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {previousLabel}
            </button>
          )}
          <button
            onClick={onNext}
            disabled={nextDisabled || isNavigating}
            className={`h-9 px-4 py-1 rounded font-medium text-[14px] transition-all duration-200 ${
              !nextDisabled && !isNavigating
                ? 'bg-[#6e4eff] text-white hover:bg-[#5a3de8]'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isNavigating ? 'Loading...' : nextLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
