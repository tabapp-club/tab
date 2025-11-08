import type { Metadata } from "next";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { WalletPageClient } from "@/components/wallet/WalletPageClient";
import { Sidebar } from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Platform Fees - Wallet",
  description: "Manage platform fees and payment plans.",
};

export default function WalletPlatformPage() {
  return (
    <ProtectedRoute>
      <div className="bg-white">
        <div className="flex relative">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <WalletPageClient defaultTab="platform" />
        </div>
      </div>
    </ProtectedRoute>
  );
}

