import React from 'react';
import type { Metadata } from "next";
import { Sidebar } from "@/components/Sidebar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AudienceContent } from "./AudienceContent";

export const metadata: Metadata = {
  title: "Choose Audience - Business Dashboard",
  description: "Select your target audience for the campaign.",
  keywords: ["audience", "targeting", "campaign", "marketing"],
  authors: [{ name: "Your Company" }],
  creator: "Your Company",
  publisher: "Your Company",
  openGraph: {
    title: "Choose Audience - Business Dashboard",
    description: "Select your target audience for the campaign.",
    type: "website",
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
