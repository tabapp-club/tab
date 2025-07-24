"use client";

import React, { useState, useEffect } from 'react';
import { MobileMenuToggle } from "@/components/MobileMenuToggle";
import { useSidebar } from "@/components/SidebarContext";
import Image from "next/image";

export function BusinessServicesContent() {
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
                Explore business services
              </h1>
              <p className="text-base text-black leading-[1.4] max-w-md mx-auto">
                Get comprehensive business solutions and professional services
              </p>
            </div>

            {/* Business Services Image */}
            <div className="w-[300px] h-[300px] bg-center bg-cover bg-no-repeat rounded-lg overflow-hidden">
              <Image
                src="/business.png"
                alt="Business Services"
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
              <div className="w-full h-full bg-gradient-to-br from-green-50 to-blue-50 rounded-lg flex items-center justify-center hidden">
                <svg
                  width="120"
                  height="120"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-gray-400"
                >
                  <path
                    d="M20 7L10 17L5 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>

            {/* Explore Button */}
            <button
              onClick={handleExploreClick}
              className="bg-[#0d0d0d] text-white px-4 py-3 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors duration-200 font-semibold text-base"
            >
              <span>Explore business services</span>
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

            {/* Business Services Image */}
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
