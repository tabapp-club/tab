import React from 'react';
import type { Metadata } from "next";
import { Sidebar } from "@/components/Sidebar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { CreateCampaignContent } from "./CreateCampaignContent";

export const metadata: Metadata = {
  title: "Create Campaign - Business Dashboard",
  description: "Create your campaign with customized settings and content.",
  keywords: ["campaign creation", "marketing", "advertising", "engagement", "retention"],
  authors: [{ name: "Your Company" }],
  creator: "Your Company",
  publisher: "Your Company",
  openGraph: {
    title: "Create Campaign - Business Dashboard",
    description: "Create your campaign with customized settings and content.",
    type: "website",
  },
};

export default function CreateCampaignPage() {
  return (
    <ProtectedRoute>
      <div className="bg-white">
        <div className="flex relative">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <CreateCampaignContent />
        </div>
      </div>
    </ProtectedRoute>
  );
}
