"use client";

import React, { useState, useEffect } from 'react';
import { MobileMenuToggle } from "@/components/MobileMenuToggle";
import { useSidebar } from "@/components/SidebarContext";
import Image from "next/image";

export function AIServicesContent() {
  const { isCollapsed, isMobile } = useSidebar();
  const [showPopup, setShowPopup] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Force uncollapsed state on mobile
  const actualIsCollapsed = isMobile ? false : isCollapsed;

  const handleExploreClick = () => {
    setShowPopup(true);
    setIsAnimating(true);
  };

  const handleClosePopup = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setShowPopup(false);
    }, 200); // Match the transition duration
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClosePopup();
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showPopup) {
        handleClosePopup();
      }
    };

    if (showPopup) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when popup is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [showPopup]);

  return (
    <main className={`flex-1 transition-sidebar ${
      actualIsCollapsed ? 'main-content sidebar-collapsed' : 'main-content'
    }`}>
      {/* Mobile Menu Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <MobileMenuToggle />
      </div>

      {/* Main Content */}
      <div className="w-full max-w-full px-3 py-4 sm:px-4 sm:py-5 lg:px-8 lg:py-8 overflow-x-hidden h-screen">
        <div className="pt-12 lg:pt-0 h-full flex items-center justify-center">
          <div className="max-w-2xl w-full flex flex-col items-center gap-6 text-center">
            {/* Header Section */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-bold text-black leading-[1.4]">
                Explore AI business services
              </h1>
              <p className="text-base text-black leading-[1.4] max-w-md mx-auto">
                Get your personalised AI services for your business
              </p>
            </div>

            {/* Robot Image */}
            <div className="w-[300px] h-[300px] bg-center bg-cover bg-no-repeat rounded-lg overflow-hidden">
              <Image
                src="/ai.png"
                alt="AI Services"
                width={300}
                height={300}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to placeholder if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
              {/* Fallback placeholder */}
              {/* <div className="w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center hidden">
                <svg
                  width="120"
                  height="120"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-gray-400"
                >
                  <path
                    d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9ZM19 9H14V4H5V21H19V9Z"
                    fill="currentColor"
                  />
                </svg>
              </div> */}
            </div>

            {/* Explore Button */}
            <button
              onClick={handleExploreClick}
              className="bg-[#0d0d0d] text-white px-4 py-3 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors duration-200 font-semibold text-base"
            >
              <span>Explore AI services</span>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="rotate-180"
              >
                <path
                  d="M7 17L17 7M17 7H7M17 7V17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <div
          className={`fixed inset-0 bg-black transition-opacity duration-200 flex items-center justify-center z-50 p-4 ${
            isAnimating ? 'bg-opacity-50' : 'bg-opacity-0'
          }`}
          onClick={handleBackdropClick}
        >
          <div className={`bg-white rounded-2xl p-6 sm:p-12 flex flex-col items-center gap-4 max-w-md w-full transition-all duration-200 ${
            isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}>
            {/* Header */}
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-black leading-[1.4]">
                Thanks for showing interest!
              </h2>
              <p className="text-sm text-black leading-[1.4] max-w-[480px]">
                We&apos;ll notify you, once we enabled the service for you
              </p>
            </div>

            {/* Robot Image */}
            <div className="w-[300px] h-[300px] bg-center bg-cover bg-no-repeat rounded-lg overflow-hidden">
              <Image
                src="/cook.png"
                alt="Cook"
                width={300}
                height={300}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to placeholder if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
              {/* Fallback placeholder */}
              <div className="w-full h-full bg-gradient-to-br from-orange-50 to-red-50 rounded-lg flex items-center justify-center hidden">
                <svg
                  width="120"
                  height="120"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-gray-400"
                >
                  <path
                    d="M8 2V5M16 2V5M3 10H21M5 4H19C20.1046 4 21 4.89543 21 6V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V6C3 4.89543 3.89543 4 5 4Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            {/* Okay Button */}
            <button
              onClick={handleClosePopup}
              className="bg-[#0d0d0d] text-white px-4 py-3 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors duration-200 font-semibold text-base w-[310px] justify-center"
            >
              <span>Okay</span>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="rotate-180"
              >
                <path
                  d="M7 17L17 7M17 7H7M17 7V17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
