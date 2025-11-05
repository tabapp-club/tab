import type { Metadata } from "next";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { WalletPageClient } from "@/components/wallet/WalletPageClient";
import { Sidebar } from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Wallet - Recharge & Transactions",
  description: "Manage your wallet, recharge money, and view transaction history.",
};

export default function WalletPage() {
  return (
    <ProtectedRoute>
      <div className="bg-[#f6f6f6]">
        <div className="flex relative">
          <Sidebar />
          <main className="flex-1 transition-sidebar main-content">
            <WalletPageClient />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

