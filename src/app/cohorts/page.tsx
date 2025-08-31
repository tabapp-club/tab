import type { Metadata } from "next";
import { CohortsClient } from "@/components/cohorts/CohortsClient";
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
      <CohortsClient />
    </ProtectedRoute>
  );
}
