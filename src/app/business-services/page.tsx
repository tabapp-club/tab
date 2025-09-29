import React from 'react';
import type { Metadata } from "next";
import { Sidebar } from "@/components/Sidebar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { BusinessServicesContent } from "@/components/business-services/BusinessServicesContent";

export const metadata: Metadata = {
  title: "Business Services - Business Dashboard",
  description: "Explore comprehensive business services and solutions for your organization.",
  keywords: ["business services", "enterprise solutions", "business automation", "consulting", "professional services"],
  authors: [{ name: "Your Company" }],
  creator: "Your Company",
  publisher: "Your Company",
  openGraph: {
    title: "Business Services - Business Dashboard",
    description: "Explore comprehensive business services and solutions for your organization.",
    type: "website",
  },
};

export default function BusinessServicesPage() {
  return (
    <ProtectedRoute>
      <div className="bg-white">
        <div className="flex relative">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <BusinessServicesContent />
        </div>
      </div>
    </ProtectedRoute>
  );
}
