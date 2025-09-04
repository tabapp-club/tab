import React, { Suspense } from 'react';
import type { Metadata } from "next";
import { CampaignsClient } from "@/components/campaigns/CampaignsClient";
import { ProtectedRoute } from "@/components/ProtectedRoute";

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
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6E4EFF]"></div></div>}>
        <CampaignsClient />
      </Suspense>
    </ProtectedRoute>
  );
}
