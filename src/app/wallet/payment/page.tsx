import type { Metadata } from "next";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { WalletPaymentPageClient } from "@/components/wallet/WalletPaymentPageClient";
import { Sidebar } from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Payment - Wallet",
  description: "Complete your payment using QR code or UPI.",
};

export default function WalletPaymentPage() {
  return (
    <ProtectedRoute>
      <div className="bg-white">
        <div className="flex relative">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <WalletPaymentPageClient />
        </div>
      </div>
    </ProtectedRoute>
  );
}

