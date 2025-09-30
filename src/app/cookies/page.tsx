import type { Metadata } from "next";
import { Sidebar } from "@/components/Sidebar";
import { CookiesContent } from "./CookiesContent";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export const metadata: Metadata = {
  title: "Cookie Policy | tribly",
  description: "Learn about how tribly uses cookies and similar technologies to enhance your experience on our business analytics platform.",
  openGraph: {
    title: "Cookie Policy | tribly",
    description: "Learn about how tribly uses cookies and similar technologies to enhance your experience on our business analytics platform.",
    type: "website",
  },
};

export default function CookiesPage() {
  return (
    <ProtectedRoute>
      <div className="bg-[#f6f6f6]">
        <div className="flex relative">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <CookiesContent />
        </div>
      </div>
    </ProtectedRoute>
  );
}
