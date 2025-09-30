import type { Metadata } from "next";
import { Sidebar } from "@/components/Sidebar";
import { BusinessServicesContent } from "@/components/business-services/BusinessServicesContent";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export const metadata: Metadata = {
  title: "Cohorts | Business Dashboard",
  description: "Manage and analyze customer cohorts with detailed insights and segmentation data",
  keywords: ["cohorts", "customer segmentation", "analytics", "business intelligence"],
  openGraph: {
    title: "Cohorts | Business Dashboard",
    description: "Manage and analyze customer cohorts with detailed insights and segmentation data",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cohorts | Business Dashboard",
    description: "Manage and analyze customer cohorts with detailed insights and segmentation data",
  },
};

export default function CohortsPage() {
  return (
    <ProtectedRoute>
      <div className="bg-white">
        <div className="flex relative">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <BusinessServicesContent title="Cohorts" description="Manage and analyze customer cohorts with detailed insights and segmentation data" />
        </div>
      </div>
    </ProtectedRoute>
  );
}
