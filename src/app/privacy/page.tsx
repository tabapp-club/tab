import type { Metadata } from "next";
import { Sidebar } from "@/components/Sidebar";
import { PrivacyContent } from "./PrivacyContent";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export const metadata: Metadata = {
  title: "Privacy Policy | tribly",
  description: "Learn how tribly protects your privacy and handles your data in our comprehensive privacy policy.",
  openGraph: {
    title: "Privacy Policy | tribly",
    description: "Learn how tribly protects your privacy and handles your data in our comprehensive privacy policy.",
    type: "website",
  },
};

export default function PrivacyPage() {
  return (
    <ProtectedRoute>
      <div className="bg-[#f6f6f6]">
        <div className="flex relative">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <PrivacyContent />
        </div>
      </div>
    </ProtectedRoute>
  );
}
