"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { MobileHeaderButton } from "@/components/MobileHeaderButton";

interface CampaignHeaderProps {
  onBack?: () => void;
  title?: string;
}

export function CampaignHeader({ onBack, title }: CampaignHeaderProps) {
  return (
    <header className="lg:hidden flex items-center justify-start p-3 sm:p-4 bg-[#F6F6F6] fixed top-0 left-0 right-0 z-50">
      <MobileHeaderButton onClick={onBack} />
      {title && (
        <h1 className="ml-4 text-[18px] font-semibold text-[#2a2a2f] font-manrope">
          {title}
        </h1>
      )}
    </header>
  );
}
