import type { Metadata } from "next";
import { Sidebar } from "@/components/Sidebar";
import { BusinessLogContent } from "@/components/business-log/BusinessLogContent";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export const metadata: Metadata = {
  title: "Business Log - Customer Entry",
  description: "Manually enter customer details and transactions for businesses without POS or accounting software.",
  keywords: ["business log", "customer entry", "manual entry", "transactions", "billing"],
  authors: [{ name: "Your Company" }],
  creator: "Your Company",
  publisher: "Your Company",
  openGraph: {
    title: "Business Log - Customer Entry",
    description: "Manually enter customer details and transactions for businesses without POS or accounting software.",
    url: "/business-log",
    siteName: "Business Dashboard",
    images: [
      {
        url: "/og-business-log.png",
        width: 1200,
        height: 630,
        alt: "Business Log Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Business Log - Customer Entry",
    description: "Manually enter customer details and transactions for businesses without POS or accounting software.",
    images: ["/og-business-log.png"],
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

export default function BusinessLogPage() {
  return (
    <ProtectedRoute>
      <div className="bg-[#f6f6f6]">
        <div className="flex relative">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <BusinessLogContent />
        </div>
      </div>
    </ProtectedRoute>
  );
}
