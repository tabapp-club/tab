"use client";

import { useRouter } from "next/navigation";
import { useWalletBalance } from "@/hooks/useWalletData";
import { formatCurrency } from "@/lib/utils";

export function WalletButton() {
  const router = useRouter();
  const { data: balanceData, isLoading } = useWalletBalance();

  const balance = balanceData?.data.balance ?? 0;
  const currency = balanceData?.data.currency ?? "INR";

  const handleClick = () => {
    router.push("/wallet/platform");
  };

  return (
    <button
      onClick={handleClick}
      className="h-14 rounded-full bg-[#9747FF] hover:bg-[#8545dd] text-white px-6 flex items-center gap-3 transition-all duration-200 shadow-sm hover:shadow-md"
      aria-label="View wallet"
    >
      <div className="flex items-center gap-2">
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="font-semibold text-base">
          {isLoading ? (
            <span className="animate-pulse">Loading...</span>
          ) : (
            formatCurrency(balance, currency)
          )}
        </span>
      </div>
    </button>
  );
}

