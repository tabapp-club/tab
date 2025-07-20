'use client';

import React from 'react';
import { BaseLayout } from './BaseLayout';

interface LoginLayoutProps {
  children: React.ReactNode;
  illustration?: React.ReactNode;
}

export function LoginLayout({ children, illustration }: LoginLayoutProps) {
  const loginLogoSection = (
    <div className="flex flex-col items-center mb-6 sm:mb-8 md:mb-10 lg:mb-12">
      <div className="mb-2 sm:mb-3">
        {/* Tab Logo */}
        <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-gray-100 flex items-center justify-center">
          <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-black rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xs sm:text-sm">tab</span>
          </div>
        </div>
      </div>

      <div className="text-[#a1a1a1] font-medium text-sm sm:text-base md:text-lg lg:text-[20px] text-center mb-2 sm:mb-3 font-['Manrope']">
        tab.business.analytics
      </div>

      <div className="mb-6 sm:mb-8 md:mb-10 lg:mb-12 mt-10">
        <h1 className="text-[#2a2a2f] font-bold text-lg sm:text-xl md:text-2xl lg:text-[24px] text-center leading-[1.4] font-['Manrope'] px-2">
          Login to understand your customers like never before.
        </h1>
      </div>
    </div>
  );

  return (
    <BaseLayout
      illustration={illustration}
      logoSection={loginLogoSection}
      showHelpButtons={true}
    >
      {children}
    </BaseLayout>
  );
}
