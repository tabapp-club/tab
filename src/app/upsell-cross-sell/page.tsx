import React from 'react';
import type { Metadata } from "next";
import { Sidebar } from "@/components/Sidebar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { UpsellCrossSellContent } from "./UpsellCrossSellContent";

export const metadata: Metadata = {
  title: "Upsell & Cross Sell - Business Dashboard",
  description: "Sell your products and services to customers through targeted upsell and cross-sell campaigns. Maximize revenue with strategic product recommendations.",
  keywords: ["upsell", "cross sell", "product sales", "revenue optimization", "customer engagement", "business growth"],
  authors: [{ name: "Business Dashboard" }],
  creator: "Business Dashboard",
  publisher: "Business Dashboard",
  openGraph: {
    title: "Upsell & Cross Sell - Business Dashboard",
    description: "Sell your products and services to customers through targeted upsell and cross-sell campaigns. Maximize revenue with strategic product recommendations.",
    type: "website",
    url: "https://your-domain.com/upsell-cross-sell",
    siteName: "Business Dashboard",
    images: [
      {
        url: "/og-upsell-cross-sell.png",
        width: 1200,
        height: 630,
        alt: "Upsell & Cross Sell - Business Dashboard"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Upsell & Cross Sell - Business Dashboard",
    description: "Sell your products and services to customers through targeted upsell and cross-sell campaigns. Maximize revenue with strategic product recommendations.",
    images: ["/og-upsell-cross-sell.png"]
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

export default function UpsellCrossSellPage() {
  return (
    <ProtectedRoute>
      <div className="bg-[#f6f6f6]">
        <div className="flex relative">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <UpsellCrossSellContent />
        </div>
      </div>
    </ProtectedRoute>
  );
}

