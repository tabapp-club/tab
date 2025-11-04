import type { Metadata } from "next";
import { Sidebar } from "@/components/Sidebar";
import { CustomerFunnelClient } from "@/components/customer-funnel/CustomerFunnelClient";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { FeatureGuard } from "@/components/FeatureGuard";

export const metadata: Metadata = {
  title: "Customer Funnel | Business Dashboard",
  description: "Analyze customer funnels based on status, value, and engagement metrics",
  keywords: ["customer funnel", "analytics", "customer segmentation", "business intelligence"],
  openGraph: {
    title: "Customer Funnel | Business Dashboard",
    description: "Analyze customer funnels based on status, value, and engagement metrics",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Customer Funnel | Business Dashboard",
    description: "Analyze customer funnels based on status, value, and engagement metrics",
  },
};

export default function CustomerFunnelPage() {
  return (
    <ProtectedRoute>
      <FeatureGuard feature="customer_funnel">
        <div className="bg-white">
          <div className="flex relative">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <CustomerFunnelClient />
          </div>
        </div>
      </FeatureGuard>
    </ProtectedRoute>
  );
}

