"use client";

import { MobileHeaderButton } from "../MobileHeaderButton";
import { useAuth } from "@/contexts/AuthContext";
import { WalletButtonWithSidepane } from "../wallet/WalletButtonWithSidepane";

export function DashboardHeader() {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <>
      {/* Mobile Header with Menu Toggle */}
      <header className="lg:hidden flex items-center justify-between p-3 sm:p-4 bg-[#F6F6F6] fixed top-0 left-0 right-0 z-50">
        <MobileHeaderButton />
        <WalletButtonWithSidepane showSidepane={false} />
      </header>

      <div className="w-full max-w-full px-3 py-4 sm:px-4 sm:py-5 lg:px-8 lg:py-8 overflow-x-hidden">
        {/* Header */}
        <header className="mb-0 sm:mb-1 lg:mb-1 pt-16 lg:pt-0">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center lg:items-start">
            <div>
              <h1 className="text-[24px] font-bold text-[#2a2a2f] leading-tight tracking-[-0.1px]">
                {getGreeting()}, {user?.name || 'User'}
              </h1>
              <p className="text-[14px] text-[#2A2A2F] font-normal mt-2">
                🔒 Your data stays private. Always.
              </p>
            </div>
            {/* Wallet Button - Desktop */}
            <div className="hidden lg:block mt-4 lg:mt-0">
              <WalletButtonWithSidepane />
            </div>
          </div>
        </header>
      </div>
    </>
  );
}