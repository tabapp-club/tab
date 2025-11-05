"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Wallet } from "lucide-react";
import { useWalletBalance } from "@/hooks/useWalletData";
import { formatCurrency } from "@/lib/utils";
import { WalletSidepane } from "./WalletSidepane";

interface WalletButtonWithSidepaneProps {
  showSidepane?: boolean;
}

export function WalletButtonWithSidepane({ showSidepane = true }: WalletButtonWithSidepaneProps) {
  const router = useRouter();
  const [sidepaneOpen, setSidepaneOpen] = useState(false);
  const { data: balanceData, isLoading } = useWalletBalance();

  const balance = balanceData?.data.balance ?? 0;
  const currency = balanceData?.data.currency ?? "INR";

  const handleClick = () => {
    if (showSidepane) {
      setSidepaneOpen(true);
    } else {
      router.push("/wallet");
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="h-14 rounded-full bg-white border border-[#9747FF] text-[#9747FF] hover:bg-[#9747FF]/10 px-6 flex items-center gap-3 transition-all duration-200 shadow-sm hover:shadow-md"
        aria-label="View wallet"
      >
        <div className="flex items-center gap-2">
          <Wallet className="w-5 h-5" />
          <span className="font-semibold text-base">
            {isLoading ? (
              <span className="animate-pulse">Loading...</span>
            ) : (
              formatCurrency(balance, currency)
            )}
          </span>
        </div>
      </button>
      {showSidepane && (
        <WalletSidepane isOpen={sidepaneOpen} onClose={() => setSidepaneOpen(false)} />
      )}
    </>
  );
}

