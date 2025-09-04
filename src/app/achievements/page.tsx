import React, { Suspense } from 'react';
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
          <Suspense fallback={<div className="flex-1 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6E4EFF]"></div></div>}>
            <AchievementsContent />
          </Suspense>
        </div>
      </div>
    </ProtectedRoute>
  );
}
