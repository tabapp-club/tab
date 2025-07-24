import React from 'react';
import type { Metadata } from "next";
import { Sidebar } from "@/components/Sidebar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AchievementsContent } from "./AchievementsContent";

export const metadata: Metadata = {
  title: "Achievements - Business Dashboard",
  description: "Track your achievements and milestones in your business journey.",
  keywords: ["achievements", "milestones", "goals", "progress tracking", "business success"],
  authors: [{ name: "Your Company" }],
  creator: "Your Company",
  publisher: "Your Company",
  openGraph: {
    title: "Achievements - Business Dashboard",
    description: "Track your achievements and milestones in your business journey.",
    type: "website",
  },
};

export default function AchievementsPage() {
  return (
    <ProtectedRoute>
      <div className="bg-white">
        <div className="flex relative">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <AchievementsContent />
        </div>
      </div>
    </ProtectedRoute>
  );
}
