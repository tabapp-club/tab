import type { Metadata } from "next";
import { Sidebar } from "@/components/Sidebar";
import { BlogsContent } from "@/components/BlogsContent";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export const metadata: Metadata = {
  title: "Dental Business Blogs & News",
  description: "Stay updated with the latest dental industry news, tips, and business insights for your practice.",
  keywords: ["dental blogs", "oral health", "dental technology", "practice management", "dental news"],
  authors: [{ name: "Your Company" }],
  creator: "Your Company",
  publisher: "Your Company",
  openGraph: {
    title: "Dental Business Blogs & News",
    description: "Stay updated with the latest dental industry news, tips, and business insights for your practice.",
    url: "/blogs",
    siteName: "Dental Business Platform",
    images: [
      {
        url: "/og-blogs.png",
        width: 1200,
        height: 630,
        alt: "Dental Business Blogs Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dental Business Blogs & News",
    description: "Stay updated with the latest dental industry news, tips, and business insights for your practice.",
    images: ["/og-blogs.png"],
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

export default function BlogsPage() {
  return (
    <ProtectedRoute>
      <div className="bg-[#f6f6f6]">
        <div className="flex relative">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <BlogsContent />
        </div>
      </div>
    </ProtectedRoute>
  );
}
