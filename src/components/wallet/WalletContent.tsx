"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { MobileHeaderButton } from "../MobileHeaderButton";
import { useSidebar } from "../SidebarContext";
import { WalletHeader } from "./WalletHeader";
import { WalletTabSelectorVertical } from "./WalletTabSelectorVertical";
import { WalletAddFundsContent } from "./WalletAddFundsContent";
import { WalletBreakdownContent } from "./WalletBreakdownContent";
import { WalletPlatformContent } from "./WalletPlatformContent";

type WalletTab = 'addfunds' | 'breakdown' | 'platform';

const tabToPath: Record<WalletTab, string> = {
  platform: '/wallet/platform',
  addfunds: '/wallet/recharge',
  breakdown: '/wallet/breakdown',
};

const pathToTab: Record<string, WalletTab> = {
  '/wallet/platform': 'platform',
  '/wallet/recharge': 'addfunds',
  '/wallet/breakdown': 'breakdown',
};

interface WalletContentProps {
  defaultTab?: WalletTab;
}

export function WalletContent({ defaultTab = "addfunds" }: WalletContentProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isCollapsed, isMobile } = useSidebar();
  
  // Determine active tab from URL path
  const getActiveTabFromPath = (): WalletTab => {
    return pathToTab[pathname] || defaultTab;
  };

  const [activeTab, setActiveTab] = useState<WalletTab>(defaultTab);

  useEffect(() => {
    const tabFromPath = getActiveTabFromPath();
    setActiveTab(tabFromPath);
  }, [pathname, defaultTab]);

  const handleTabChange = (tab: WalletTab) => {
    const path = tabToPath[tab];
    if (path) {
      router.push(path);
    }
  };

  const actualIsCollapsed = isMobile ? false : isCollapsed;

  return (
    <main className={`flex-1 transition-sidebar bg-[#f6f6f6] ${
      actualIsCollapsed ? 'main-content sidebar-collapsed' : 'main-content'
    }`}>
      {/* Mobile Header with Menu Toggle */}
      <header className="lg:hidden flex items-center justify-start p-3 sm:p-4 bg-[#F6F6F6] fixed top-0 left-0 right-0 z-50">
        <MobileHeaderButton />
      </header>

      {/* Header Section - Fixed on Desktop */}
      <div className={`hidden lg:block fixed top-0 z-20 bg-[#f6f6f6] pt-2 pb-4 px-8 ${
        actualIsCollapsed ? 'left-[64px] right-0' : 'left-[232px] right-0'
      }`}>
        <WalletHeader />
      </div>

      {/* Main Content */}
      <div className="w-full max-w-full overflow-x-hidden">
        <div className="px-4 pt-20 pb-40 py-4 lg:px-8 lg:py-8 lg:pb-20 lg:pt-8 lg:pt-24">
          {/* Mobile Header Section */}
          <div className="mb-4 lg:hidden">
            <WalletHeader />
          </div>

          {/* Mobile Layout - Stacked */}
          <div className="lg:hidden space-y-6">
            {/* Tab Selector - Mobile */}
            <div className="flex gap-2 border-b border-gray-200 bg-white rounded-xl p-4">
              <button
                onClick={() => handleTabChange("addfunds")}
                className={`pb-3 px-4 font-medium text-sm transition-colors ${
                  activeTab === "addfunds"
                    ? "text-[#9747FF] border-b-2 border-[#9747FF]"
                    : "text-[#626266] hover:text-[#2a2a2f]"
                }`}
              >
                Recharge
              </button>
              <button
                onClick={() => handleTabChange("platform")}
                className={`pb-3 px-4 font-medium text-sm transition-colors ${
                  activeTab === "platform"
                    ? "text-[#9747FF] border-b-2 border-[#9747FF]"
                    : "text-[#626266] hover:text-[#2a2a2f]"
                }`}
              >
                Platform
              </button>
              <button
                onClick={() => handleTabChange("breakdown")}
                className={`pb-3 px-4 font-medium text-sm transition-colors ${
                  activeTab === "breakdown"
                    ? "text-[#9747FF] border-b-2 border-[#9747FF]"
                    : "text-[#626266] hover:text-[#2a2a2f]"
                }`}
              >
                Spending Breakdown
              </button>
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              {activeTab === "addfunds" ? (
                <WalletAddFundsContent />
              ) : activeTab === "breakdown" ? (
                <WalletBreakdownContent />
              ) : (
                <WalletPlatformContent />
              )}
            </div>
          </div>

          {/* Desktop Layout - Row View (like customer funnel) */}
          <div className="hidden lg:block">
            <div className="flex gap-0 items-start justify-start w-full">
              {/* Left Sidebar - Tab Selector (Vertical) - Fixed */}
              <div className={`flex flex-col gap-2 items-start justify-start w-full max-w-[420px] shrink-0 fixed top-24 bottom-0 overflow-y-auto bg-[#f6f6f6] pl-10 ${
                actualIsCollapsed ? 'left-[64px]' : 'left-[232px]'
              }`}>
                <WalletTabSelectorVertical
                  selectedTab={activeTab}
                  onTabChange={handleTabChange}
                />
              </div>

              {/* Right Side - Main Content - Scrollable */}
              <div className={`flex-1 min-w-0 space-y-6 ${
                actualIsCollapsed ? 'ml-[420px]' : 'ml-[588px]'
              }`}>
                {activeTab === "addfunds" ? (
                  <WalletAddFundsContent />
                ) : activeTab === "breakdown" ? (
                  <WalletBreakdownContent />
                ) : (
                  <WalletPlatformContent />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
