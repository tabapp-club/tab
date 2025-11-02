import React from 'react';
import type { Metadata } from "next";
import { Sidebar } from "@/components/Sidebar";
import { CampaignsClient } from "@/components/campaigns/CampaignsClient";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { FeatureGuard } from "@/components/FeatureGuard";

export const metadata: Metadata = {
  title: "Campaigns | Business Dashboard",
  description: "Manage and create marketing campaigns to grow your business with advanced targeting and analytics",
  keywords: ["campaigns", "marketing", "business growth", "customer engagement", "analytics"],
  openGraph: {
    title: "Campaigns | Business Dashboard",
    description: "Manage and create marketing campaigns to grow your business with advanced targeting and analytics",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Campaigns | Business Dashboard",
    description: "Manage and create marketing campaigns to grow your business with advanced targeting and analytics",
  },
};

export default function CampaignsPage() {
  return (
    <ProtectedRoute>
      <FeatureGuard feature="campaigns">
        <div className="bg-[#f6f6f6]">
          <div className="flex relative">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <CampaignsClient />
          </div>
        </div>
      </FeatureGuard>
    </ProtectedRoute>
  );
}
