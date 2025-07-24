"use client";

import React, { useState, useEffect } from 'react';
import { MobileMenuToggle } from "@/components/MobileMenuToggle";
import { useSidebar } from "@/components/SidebarContext";
import Image from "next/image";

export function AchievementsContent() {
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
                Explore achievements
              </h1>
              <p className="text-base text-black leading-[1.4] max-w-md mx-auto">
                Track your milestones and celebrate your business success
              </p>
            </div>

            {/* Achievements Image */}
            <div className="w-[300px] h-[300px] bg-center bg-cover bg-no-repeat rounded-lg overflow-hidden">
              <Image
                src="/achievements.png"
                alt="Achievements"
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
              <div className="w-full h-full bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg flex items-center justify-center hidden">
                <svg
                  width="120"
                  height="120"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-gray-400"
                >
                  <path
                    d="M6 9H4.5C3.67157 9 3 9.67157 3 10.5V11.5C3 12.3284 3.67157 13 4.5 13H6L7.5 18H16.5L18 13H19.5C20.3284 13 21 12.3284 21 11.5V10.5C21 9.67157 20.3284 9 19.5 9H18L16.5 4H7.5L6 9Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
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
              <span>Explore achievements</span>
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
          className={`fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md transition-opacity duration-200 flex items-center justify-center z-50 p-4 ${
            isAnimating ? 'opacity-100' : 'opacity-0'
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

            {/* Achievements Image */}
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
