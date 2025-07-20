import type { Metadata } from "next";
import { Sidebar } from "@/components/Sidebar";
import { DashboardContent } from "@/components/DashboardContent";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export const metadata: Metadata = {
  title: "Dashboard - Business Analytics",
  description: "Monitor your business performance with real-time analytics, customer insights, and campaign tracking.",
  keywords: ["dashboard", "analytics", "business", "customers", "campaigns", "metrics"],
  authors: [{ name: "Your Company" }],
  creator: "Your Company",
  publisher: "Your Company",
  openGraph: {
    title: "Dashboard - Business Analytics",
    description: "Monitor your business performance with real-time analytics, customer insights, and campaign tracking.",
    url: "/dashboard",
    siteName: "Business Dashboard",
    images: [
      {
        url: "/og-dashboard.png",
        width: 1200,
        height: 630,
        alt: "Business Dashboard Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dashboard - Business Analytics",
    description: "Monitor your business performance with real-time analytics, customer insights, and campaign tracking.",
    images: ["/og-dashboard.png"],
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

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="bg-white">
        <div className="flex relative">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <DashboardContent />
        </div>
      </div>
    </ProtectedRoute>
  );
}
