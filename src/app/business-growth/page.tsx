import type { Metadata } from "next";
import { Sidebar } from "@/components/Sidebar";
import { BusinessGrowthContent } from "@/components/BusinessGrowthContent";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export const metadata: Metadata = {
  title: "Business Growth Strategies - Dental Practice",
  description: "Comprehensive strategies and tips to boost your dental practice growth, increase revenue, and improve operational efficiency.",
  keywords: ["dental business growth", "practice management", "revenue optimization", "customer retention", "digital marketing"],
  authors: [{ name: "Your Company" }],
  creator: "Your Company",
  publisher: "Your Company",
  openGraph: {
    title: "Business Growth Strategies - Dental Practice",
    description: "Comprehensive strategies and tips to boost your dental practice growth, increase revenue, and improve operational efficiency.",
    url: "/business-growth",
    siteName: "Dental Business Platform",
    images: [
      {
        url: "/og-business-growth.png",
        width: 1200,
        height: 630,
        alt: "Business Growth Strategies Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Business Growth Strategies - Dental Practice",
    description: "Comprehensive strategies and tips to boost your dental practice growth, increase revenue, and improve operational efficiency.",
    images: ["/og-business-growth.png"],
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

export default function BusinessGrowthPage() {
  return (
    <ProtectedRoute>
      <div className="bg-[#f6f6f6]">
        <div className="flex relative">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <BusinessGrowthContent />
        </div>
      </div>
    </ProtectedRoute>
  );
}
