import type { Metadata } from "next";
import { Sidebar } from "@/components/Sidebar";
import { TermsContent } from "./TermsContent";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export const metadata: Metadata = {
  title: "Terms and Conditions | tribly",
  description: "Read tribly's terms and conditions for using our business analytics platform and related services.",
  openGraph: {
    title: "Terms and Conditions | tribly",
    description: "Read tribly's terms and conditions for using our business analytics platform and related services.",
    type: "website",
  },
};

export default function TermsPage() {
  return (
    <ProtectedRoute>
      <div className="bg-[#f6f6f6]">
        <div className="flex relative">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <TermsContent />
        </div>
      </div>
    </ProtectedRoute>
  );
}
