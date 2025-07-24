import React from 'react';
import type { Metadata } from "next";
import { Sidebar } from "@/components/Sidebar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AIServicesContent } from "./AIServicesContent";

export const metadata: Metadata = {
  title: "AI Services - Business Dashboard",
  description: "Explore personalized AI services for your business with advanced analytics and automation tools.",
  keywords: ["AI services", "artificial intelligence", "business automation", "analytics", "machine learning"],
  authors: [{ name: "Your Company" }],
  creator: "Your Company",
  publisher: "Your Company",
  openGraph: {
    title: "AI Services - Business Dashboard",
    description: "Explore personalized AI services for your business with advanced analytics and automation tools.",
    url: "/ai-services",
    siteName: "Business Dashboard",
    images: [
      {
        url: "/og-ai-services.png",
        width: 1200,
        height: 630,
        alt: "AI Services Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Services - Business Dashboard",
    description: "Explore personalized AI services for your business with advanced analytics and automation tools.",
    images: ["/og-ai-services.png"],
    creator: "@yourcompany",
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
};

export default function AIServicesPage() {
  return (
    <ProtectedRoute>
      <div className="bg-white">
        <div className="flex relative">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <AIServicesContent />
        </div>
      </div>
    </ProtectedRoute>
  );
}
