import React, { Suspense } from 'react';
import type { Metadata } from "next";
import { Sidebar } from "@/components/Sidebar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AIServicesContent } from "./AIServicesContent";

export const metadata: Metadata = {
  title: "AI Services - Business Intelligence & Analytics | Tab",
  description: "Ask anything about your business with our AI-powered analytics. Get personalized insights, sales analysis, customer behavior patterns, and strategic recommendations for your business growth.",
  keywords: [
    "AI services",
    "business intelligence",
    "analytics",
    "sales analysis",
    "customer insights",
    "business performance",
    "AI chatbot",
    "business dashboard",
    "data analytics",
    "business metrics",
    "profit analysis",
    "customer behavior"
  ],
  authors: [{ name: "Tab Business Dashboard" }],
  creator: "Tab Business Dashboard",
  publisher: "Tab Business Dashboard",
  openGraph: {
    title: "AI Services - Business Intelligence & Analytics | Tab",
    description: "Ask anything about your business with our AI-powered analytics. Get personalized insights, sales analysis, customer behavior patterns, and strategic recommendations for your business growth.",
    url: "/ai-services",
    siteName: "Tab Business Dashboard",
    images: [
      {
        url: "/og-ai-services.png",
        width: 1200,
        height: 630,
        alt: "AI Services - Business Intelligence Dashboard",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Services - Business Intelligence & Analytics | Tab",
    description: "Ask anything about your business with our AI-powered analytics. Get personalized insights, sales analysis, customer behavior patterns, and strategic recommendations for your business growth.",
    images: ["/og-ai-services.png"],
    creator: "@tabbusiness",
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
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  alternates: {
    canonical: "/ai-services",
  },
  category: "Business Analytics",
};

export default function AIServicesPage() {
  return (
    <ProtectedRoute>
      <div className="bg-white">
        <div className="flex relative">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <Suspense fallback={<div className="flex-1 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6E4EFF]"></div></div>}>
            <AIServicesContent />
          </Suspense>
        </div>
      </div>
    </ProtectedRoute>
  );
}
