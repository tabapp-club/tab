import React from 'react';
import type { Metadata } from "next";
import { Sidebar } from "@/components/Sidebar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ScheduleContent } from "./ScheduleContent";

export const metadata: Metadata = {
  title: "Schedule Campaign - Business Dashboard",
  description: "Schedule your campaign for optimal delivery.",
  keywords: ["schedule", "campaign", "timing", "delivery"],
  authors: [{ name: "Your Company" }],
  creator: "Your Company",
  publisher: "Your Company",
  openGraph: {
    title: "Schedule Campaign - Business Dashboard",
    description: "Schedule your campaign for optimal delivery.",
    type: "website",
  },
};

export default function SchedulePage() {
  return (
    <ProtectedRoute>
      <div className="bg-[#f6f6f6]">
        <div className="flex relative">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <ScheduleContent />
        </div>
      </div>
    </ProtectedRoute>
  );
}
