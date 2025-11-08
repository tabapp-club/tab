import type { Metadata } from "next";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { WalletPageClient } from "@/components/wallet/WalletPageClient";
import { Sidebar } from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Spending Breakdown - Wallet",
  description: "View your wallet transaction history and spending breakdown.",
};

export default function WalletBreakdownPage() {
  return (
    <ProtectedRoute>
      <div className="bg-white">
        <div className="flex relative">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <WalletPageClient defaultTab="breakdown" />
        </div>
      </div>
    </ProtectedRoute>
  );
}

