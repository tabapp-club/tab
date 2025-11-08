import type { Metadata } from "next";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { WalletPageClient } from "@/components/wallet/WalletPageClient";
import { Sidebar } from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Recharge Wallet",
  description: "Recharge your wallet to send campaigns and invoices.",
};

export default function WalletRechargePage() {
  return (
    <ProtectedRoute>
      <div className="bg-white">
        <div className="flex relative">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <WalletPageClient defaultTab="addfunds" />
        </div>
      </div>
    </ProtectedRoute>
  );
}

