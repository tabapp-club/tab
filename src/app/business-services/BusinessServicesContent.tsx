"use client";

import React from 'react';
import { MobileMenuToggle } from "@/components/MobileMenuToggle";
import { useSidebar } from "@/components/SidebarContext";

export function BusinessServicesContent() {
  const { isCollapsed, isMobile } = useSidebar();

  // Force uncollapsed state on mobile
  const actualIsCollapsed = isMobile ? false : isCollapsed;

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
          <div className="max-w-2xl w-full flex flex-col items-center gap-8 text-center">
            {/* Coming Soon Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-full">
              <div className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-purple-700">Coming Soon</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-3">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                The Next Big Thing is
                <span className="block bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Brewing
                </span>
              </h1>
              <p className="text-base text-gray-600 leading-relaxed max-w-lg mx-auto">
                We&apos;re crafting something extraordinary. Our business services platform is in development,
                designed to revolutionize how you manage and grow your business.
              </p>
            </div>



                         {/* Features Preview */}
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-md">
               <div className="flex flex-col items-center gap-1.5 p-3 bg-gray-50 rounded-lg">
                 <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
                   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-purple-600">
                     <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                     <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
                   </svg>
                 </div>
                 <span className="text-xs font-medium text-gray-700">Analytics</span>
               </div>

               <div className="flex flex-col items-center gap-1.5 p-3 bg-gray-50 rounded-lg">
                 <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-blue-600">
                     <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                     <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                     <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                   </svg>
                 </div>
                 <span className="text-xs font-medium text-gray-700">Automation</span>
               </div>

               <div className="flex flex-col items-center gap-1.5 p-3 bg-gray-50 rounded-lg">
                 <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
                   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-green-600">
                     <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                     <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                     <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                     <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45768C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                   </svg>
                 </div>
                 <span className="text-xs font-medium text-gray-700">Collaboration</span>
               </div>
             </div>


          </div>
        </div>
      </div>
    </main>
  );
}
