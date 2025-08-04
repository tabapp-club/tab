import React from 'react';
import type { Metadata } from "next";
import { Sidebar } from "@/components/Sidebar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AudienceContent } from "./AudienceContent";

export const metadata: Metadata = {
  title: "Choose Audience - Campaign Builder | Business Dashboard",
  description: "Select your target audience for the campaign. Filter by categories, user types, visit counts, and status to reach the right customers.",
  keywords: ["audience targeting", "campaign builder", "customer segmentation", "marketing automation", "user filters"],
  authors: [{ name: "Business Dashboard" }],
  creator: "Business Dashboard",
  publisher: "Business Dashboard",
  openGraph: {
    title: "Choose Audience - Campaign Builder | Business Dashboard",
    description: "Select your target audience for the campaign. Filter by categories, user types, visit counts, and status to reach the right customers.",
    type: "website",
    url: "https://your-domain.com/new-campaign/audience",
    siteName: "Business Dashboard",
    images: [
      {
        url: "/og-audience.png",
        width: 1200,
        height: 630,
        alt: "Choose Audience - Campaign Builder"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Choose Audience - Campaign Builder | Business Dashboard",
    description: "Select your target audience for the campaign. Filter by categories, user types, visit counts, and status to reach the right customers.",
    images: ["/og-audience.png"]
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

export default function AudiencePage() {
  return (
    <ProtectedRoute>
      <div className="bg-white">
        <div className="flex relative">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <AudienceContent />
        </div>
      </div>
    </ProtectedRoute>
  );
}
