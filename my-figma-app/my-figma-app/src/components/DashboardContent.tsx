"use client";

import { CampaignCards } from "./CampaignCards";
import { AnalyticsCards } from "./AnalyticsCards";
import { TimeFilter } from "./TimeFilter";
import { MobileMenuToggle } from "./MobileMenuToggle";
import { useSidebar } from "./SidebarContext";

export function DashboardContent() {
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

      <div className="w-full max-w-full px-3 py-4 sm:px-4 sm:py-5 lg:px-8 lg:py-8 overflow-x-hidden">
        {/* Header */}
        <header className="mb-6 sm:mb-8 lg:mb-12 pt-12 lg:pt-0">
          <h1 className="text-xl sm:text-2xl lg:text-[32px] font-bold text-[#2a2a2f] leading-tight sm:leading-[39.2px] lg:leading-[44px] tracking-[-0.1px]">
            Good Afternoon
          </h1>
        </header>

        {/* Campaign Cards Section */}
        <section className="mb-6 sm:mb-8 lg:mb-12 rounded-lg bg-[#f6f6f6] border border-[#dbdbdb] box-border overflow-hidden">
          <div className="p-3 sm:p-4 lg:p-6 lg:pl-[35px]">
            <h2 className="text-sm sm:text-[16px] font-semibold text-[#696969] leading-[1.4] sm:leading-[22.4px] tracking-[-0.1px] mb-3 sm:mb-4 lg:mb-[17px]">
              Campaigns to grow your business
            </h2>
            <div className="w-full max-w-full overflow-hidden">
              <CampaignCards />
            </div>
          </div>
        </section>

        {/* Analytics Section */}
        <section className="pb-6 sm:pb-8">
          <div className="mb-4 sm:mb-6">
            <TimeFilter />
          </div>
          <div className="w-full max-w-full overflow-hidden">
            <AnalyticsCards />
          </div>
        </section>
      </div>
    </main>
  );
}
