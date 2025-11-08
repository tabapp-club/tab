"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { MobileHeaderButton } from "../MobileHeaderButton";
import { useSidebar } from "../SidebarContext";
import { WalletHeader } from "./WalletHeader";
import { WalletTabSelectorVertical } from "./WalletTabSelectorVertical";
import { WalletPaymentPage } from "./WalletPaymentPage";

type WalletTab = 'addfunds' | 'breakdown' | 'platform';

const pathToTab: Record<string, WalletTab> = {
  '/wallet/platform': 'platform',
  '/wallet/recharge': 'addfunds',
  '/wallet/breakdown': 'breakdown',
};

export function WalletPaymentPageClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { isCollapsed, isMobile } = useSidebar();

  const amount = searchParams.get("amount") ? parseFloat(searchParams.get("amount")!) : undefined;
  const title = searchParams.get("title") || "Payment";
  const paymentId = searchParams.get("paymentId") || null;
  const returnTo = searchParams.get("returnTo") || "/wallet/recharge";

  // Determine active tab from returnTo path
  const getActiveTabFromReturnTo = (): WalletTab => {
    if (returnTo.includes('/recharge')) return 'addfunds';
    if (returnTo.includes('/breakdown')) return 'breakdown';
    if (returnTo.includes('/platform')) return 'platform';
    return 'addfunds';
  };

  const activeTab = getActiveTabFromReturnTo();

  const handleTabChange = (tab: WalletTab) => {
    const tabToPath: Record<WalletTab, string> = {
      platform: '/wallet/platform',
      addfunds: '/wallet/recharge',
      breakdown: '/wallet/breakdown',
    };
    const path = tabToPath[tab];
    if (path) {
      router.push(path);
    }
  };

  const handleBack = () => {
    router.push(returnTo);
  };

  const handlePaymentConfirmed = () => {
    router.push(returnTo);
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
          <div className="lg:hidden space-y-2">
            <WalletPaymentPage
              amount={amount}
              title={title}
              onBack={handleBack}
              paymentId={paymentId}
              onPaymentConfirmed={handlePaymentConfirmed}
            />
          </div>

          {/* Desktop Layout - Row View */}
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
                <WalletPaymentPage
                  amount={amount}
                  title={title}
                  onBack={handleBack}
                  paymentId={paymentId}
                  onPaymentConfirmed={handlePaymentConfirmed}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

