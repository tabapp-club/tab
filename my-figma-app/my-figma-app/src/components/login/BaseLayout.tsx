'use client';

import React from 'react';
import Link from 'next/link';
import { Carousel } from './Carousel';

interface BaseLayoutProps {
  children: React.ReactNode;
  illustration?: React.ReactNode;
  showLogo?: boolean;
  logoSection?: React.ReactNode;
  showHelpButtons?: boolean;
}

export function BaseLayout({
  children,
  illustration,
  showLogo = true,
  logoSection,
  showHelpButtons = true
}: BaseLayoutProps) {
  return (
    <div className="bg-white min-h-screen relative overflow-x-hidden">
      {/* Main Content Container */}
      <div className="flex min-h-screen">
        {/* Left Side - Content */}
        <div className="flex-1 flex items-center justify-center px-4 py-4 sm:px-6 md:px-8 lg:px-12">
          <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg h-full max-h-screen flex items-center">
            {/* Card Container */}
            <div className="bg-white border border-[#dadada] rounded-lg sm:rounded-xl  px-4 py-4 xs:px-6 xs:py-6 sm:px-8 sm:py-8 md:px-12 md:py-10 lg:px-16 lg:py-12 xl:px-20 xl:py-14 w-full">

              {/* Logo Section */}
              {showLogo && (
                logoSection || (
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
                  </div>
                )
              )}

              {/* Content */}
              <div className="w-full">
                {children}
              </div>

              {/* Mobile Help Section - Inside card on mobile */}
              {showHelpButtons && (
                <div className="md:hidden mt-6 pt-4 border-t border-[#f0f0f0]">
                  <div className="flex gap-2 justify-center">
                    <Link
                      href="/help"
                      className="flex items-center gap-1.5 px-2.5 py-2 bg-gray-50 border border-[#e9e9e9] rounded text-xs font-medium text-[#2a2a2f] hover:bg-gray-100 transition-colors"
                    >
                      <svg width="14" height="14" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2C14.4183 5.58172 18 10 18Z" stroke="currentColor" strokeWidth="2"/>
                        <path d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.40913C11.0108 7.05016 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52152 14.2151 8.06353C14.6713 8.60553 14.9211 9.29152 14.92 10C14.92 10 14.92 11.5 12.42 11.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M10 15H10.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Help
                    </Link>

                    <Link
                      href="/contact"
                      className="flex items-center gap-1.5 px-2.5 py-2 bg-gray-50 border border-[#e9e9e9] rounded text-xs font-medium text-[#2a2a2f] hover:bg-gray-100 transition-colors"
                    >
                      <svg width="14" height="14" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 4V20L6 17H18C18.5523 17 19 16.5523 19 16V4C19 3.44772 18.5523 3 18 3H4C3.44772 3 3 3.44772 3 4Z" stroke="currentColor" strokeWidth="2"/>
                        <path d="M7 8H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M7 12H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      Contact
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side - Illustration/Carousel */}
        <div className="hidden lg:flex lg:flex-1 items-center justify-center bg-[#f5f4ed] relative overflow-hidden">
          {illustration || <Carousel />}
        </div>
      </div>

      {/* Bottom Help Section - Hidden on mobile, shown on tablet and desktop */}
      {showHelpButtons && (
        <div className="hidden md:flex absolute bottom-6 left-6 gap-2">
          <Link
            href="/help"
            className="flex items-center gap-2 px-3 py-2 bg-white border border-[#e9e9e9] rounded text-sm font-medium text-[#2a2a2f] hover:bg-gray-50 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2C14.4183 5.58172 18 10 18Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.40913C11.0108 7.05016 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52152 14.2151 8.06353C14.6713 8.60553 14.9211 9.29152 14.92 10C14.92 10 14.92 11.5 12.42 11.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 15H10.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Need Help?
          </Link>

          <Link
            href="/contact"
            className="flex items-center gap-2 px-3 py-2 bg-white border border-[#e9e9e9] rounded text-sm font-medium text-[#2a2a2f] hover:bg-gray-50 transition-colors"
          >
            Contact tab sales
          </Link>
        </div>
      )}
    </div>
  );
}
