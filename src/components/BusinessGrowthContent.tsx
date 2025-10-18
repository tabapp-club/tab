"use client";

import { useSidebar } from "./SidebarContext";
import { BusinessGrowthCards } from "./BusinessGrowthCards";

export function BusinessGrowthContent() {
  const { isCollapsed, isMobile } = useSidebar();

  // Force uncollapsed state on mobile
  const actualIsCollapsed = isMobile ? false : isCollapsed;

  return (
    <main className={`flex-1 transition-sidebar ${
      actualIsCollapsed ? 'main-content sidebar-collapsed' : 'main-content'
    }`}>
      {/* Header */}
      <div className="px-3 py-4 sm:px-4 sm:py-5 lg:px-8 lg:py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">
              Business Growth Strategies
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Proven strategies to boost your dental practice growth and maximize revenue
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-full px-3 py-4 sm:px-4 sm:py-5 lg:px-8 lg:py-8 overflow-x-hidden">
        {/* Growth Strategies Section */}
        <section className="mb-6 sm:mb-8 lg:mb-12 rounded-[4px] bg-[#ffffff] box-border overflow-hidden relative">
          {/* Brand Gradient Border */}
          <div className="absolute inset-0 rounded-[4px] bg-gradient-to-r from-[#A78BFA] via-[#C4B5FD] via-[#E9D5FF] to-[#A78BFA] p-[1px] animate-gradient-x">
            <div className="w-full h-full rounded-[3px] bg-[#ffffff]"></div>
          </div>
          <div className="relative z-10 p-3 sm:p-4 lg:p-6 lg:pl-[35px]">
            <h2 className="text-sm sm:text-[16px] font-semibold text-[#696969] leading-[1.4] sm:leading-[22.4px] tracking-[-0.1px] mb-3 sm:mb-4 lg:mb-[17px]">
              Featured Growth Strategies
            </h2>
            <div className="w-full max-w-full overflow-hidden">
              <BusinessGrowthCards />
            </div>
          </div>
        </section>

        {/* Implementation Guides Section */}
        <section className="mb-6 sm:mb-8 lg:mb-12 rounded-[4px] bg-[#ffffff] box-border overflow-hidden relative">
          {/* Brand Gradient Border */}
          <div className="absolute inset-0 rounded-[4px] bg-gradient-to-r from-[#A78BFA] via-[#C4B5FD] via-[#E9D5FF] to-[#A78BFA] p-[1px] animate-gradient-x">
            <div className="w-full h-full rounded-[3px] bg-[#ffffff]"></div>
          </div>
          <div className="relative z-10 p-3 sm:p-4 lg:p-6 lg:pl-[35px]">
            <h2 className="text-sm sm:text-[16px] font-semibold text-[#696969] leading-[1.4] sm:leading-[22.4px] tracking-[-0.1px] mb-3 sm:mb-4 lg:mb-[17px]">
              Implementation Guides
            </h2>
            <div className="w-full max-w-full overflow-hidden">
              <BusinessGrowthCards />
            </div>
          </div>
        </section>

        {/* Success Stories Section */}
        <section className="rounded-[4px] bg-[#ffffff] box-border overflow-hidden relative">
          {/* Brand Gradient Border */}
          <div className="absolute inset-0 rounded-[4px] bg-gradient-to-r from-[#A78BFA] via-[#C4B5FD] via-[#E9D5FF] to-[#A78BFA] p-[1px] animate-gradient-x">
            <div className="w-full h-full rounded-[3px] bg-[#ffffff]"></div>
          </div>
          <div className="relative z-10 p-3 sm:p-4 lg:p-6 lg:pl-[35px]">
            <h2 className="text-sm sm:text-[16px] font-semibold text-[#696969] leading-[1.4] sm:leading-[22.4px] tracking-[-0.1px] mb-3 sm:mb-4 lg:mb-[17px]">
              Success Stories & Case Studies
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Success Story Cards */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Digital Marketing</h3>
                    <p className="text-xs text-gray-500">40% increase in new patients</p>
                  </div>
                </div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  Dr. Smith&apos;s Practice Transformation
                </h4>
                <p className="text-xs text-gray-600 mb-3">
                  How implementing a comprehensive digital marketing strategy increased patient acquisition by 40% in 6 months.
                </p>
                <a href="/business-growth/digital-marketing" className="text-xs text-green-600 hover:text-green-800 font-medium">
                  Read Case Study →
                </a>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Customer Retention</h3>
                    <p className="text-xs text-gray-500">85% retention rate</p>
                  </div>
                </div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  Loyalty Program Success Story
                </h4>
                <p className="text-xs text-gray-600 mb-3">
                  Learn how Dr. Johnson achieved an 85% patient retention rate through strategic loyalty programs.
                </p>
                <a href="/business-growth/customer-retention" className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                  Read Case Study →
                </a>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Revenue Optimization</h3>
                    <p className="text-xs text-gray-500">60% revenue growth</p>
                  </div>
                </div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  Premium Services Implementation
                </h4>
                <p className="text-xs text-gray-600 mb-3">
                  Discover how adding premium services increased practice revenue by 60% within one year.
                </p>
                <a href="/business-growth/revenue-optimization" className="text-xs text-purple-600 hover:text-purple-800 font-medium">
                  Read Case Study →
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
