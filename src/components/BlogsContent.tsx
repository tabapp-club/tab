"use client";

import { useSidebar } from "./SidebarContext";
import { BlogCards } from "./BlogCards";

export function BlogsContent() {
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
              Dental Business Blogs & News
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Stay informed with the latest dental industry insights and business strategies
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-full px-3 py-4 sm:px-4 sm:py-5 lg:px-8 lg:py-8 overflow-x-hidden">
        {/* Blogs Section */}
        <section className="mb-6 sm:mb-8 lg:mb-12 rounded-[4px] bg-[#ffffff] box-border overflow-hidden relative">
          {/* Brand Gradient Border */}
          <div className="absolute inset-0 rounded-[4px] bg-gradient-to-r from-[#A78BFA] via-[#C4B5FD] via-[#E9D5FF] to-[#A78BFA] p-[1px] animate-gradient-x">
            <div className="w-full h-full rounded-[3px] bg-[#ffffff]"></div>
          </div>
          <div className="relative z-10 p-3 sm:p-4 lg:p-6 lg:pl-[35px]">
            <h2 className="text-sm sm:text-[16px] font-semibold text-[#696969] leading-[1.4] sm:leading-[22.4px] tracking-[-0.1px] mb-3 sm:mb-4 lg:mb-[17px]">
              Dental Care Blogs
            </h2>
            <div className="w-full max-w-full overflow-hidden">
              <BlogCards contentType="blogs" />
            </div>
          </div>
        </section>

        {/* News Section */}
        <section className="mb-6 sm:mb-8 lg:mb-12 rounded-[4px] bg-[#ffffff] box-border overflow-hidden relative">
          {/* Brand Gradient Border */}
          <div className="absolute inset-0 rounded-[4px] bg-gradient-to-r from-[#A78BFA] via-[#C4B5FD] via-[#E9D5FF] to-[#A78BFA] p-[1px] animate-gradient-x">
            <div className="w-full h-full rounded-[3px] bg-[#ffffff]"></div>
          </div>
          <div className="relative z-10 p-3 sm:p-4 lg:p-6 lg:pl-[35px]">
            <h2 className="text-sm sm:text-[16px] font-semibold text-[#696969] leading-[1.4] sm:leading-[22.4px] tracking-[-0.1px] mb-3 sm:mb-4 lg:mb-[17px]">
              Dental Industry News
            </h2>
            <div className="w-full max-w-full overflow-hidden">
              <BlogCards contentType="news" />
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
