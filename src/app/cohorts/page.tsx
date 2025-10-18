import type { Metadata } from "next";
import { Sidebar } from "@/components/Sidebar";
import { CohortsClient } from "@/components/cohorts/CohortsClient";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { FeatureGuard } from "@/components/FeatureGuard";

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
      <FeatureGuard feature="cohorts">
        <div className="bg-white">
          <div className="flex relative">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <CohortsClient />
          </div>
        </div>
      </FeatureGuard>
    </ProtectedRoute>
  );
}
