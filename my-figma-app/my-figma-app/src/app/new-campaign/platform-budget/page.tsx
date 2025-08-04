import React from 'react';
import type { Metadata } from "next";
import { Sidebar } from "@/components/Sidebar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PlatformBudgetContent } from "./PlatformBudgetContent";

export const metadata: Metadata = {
  title: "Platform & Budget - Campaign Builder | Business Dashboard",
  description: "Select your campaign platform and set your budget. Choose between Tab campaigns, WhatsApp, and SMS with detailed cost breakdowns.",
  keywords: ["platform selection", "budget planning", "campaign builder", "marketing automation", "cost analysis"],
  authors: [{ name: "Business Dashboard" }],
  creator: "Business Dashboard",
  publisher: "Business Dashboard",
  openGraph: {
    title: "Platform & Budget - Campaign Builder",
    description: "Select your campaign platform and set your budget. Choose between Tab campaigns, WhatsApp, and SMS with detailed cost breakdowns.",
    type: "website",
    url: "https://business.dashboard.com/new-campaign/platform-budget",
    siteName: "Business Dashboard",
  },
  twitter: {
    card: "summary_large_image",
    title: "Platform & Budget - Campaign Builder",
    description: "Select your campaign platform and set your budget. Choose between Tab campaigns, WhatsApp, and SMS with detailed cost breakdowns.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function PlatformBudgetPage() {
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <PlatformBudgetContent />
      </div>
    </ProtectedRoute>
  );
}
