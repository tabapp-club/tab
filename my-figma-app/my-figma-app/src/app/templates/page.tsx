import type { Metadata } from "next";
import { TemplatesClient } from "@/components/templates/TemplatesClient";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export const metadata: Metadata = {
  title: "Templates | Business Dashboard",
  description: "Manage and customize invoice templates for your business with professional designs and branding",
  keywords: ["templates", "invoice", "business", "design", "branding", "customization"],
  openGraph: {
    title: "Templates | Business Dashboard",
    description: "Manage and customize invoice templates for your business with professional designs and branding",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Templates | Business Dashboard",
    description: "Manage and customize invoice templates for your business with professional designs and branding",
  },
};

export default function TemplatesPage() {
  return (
    <ProtectedRoute>
      <TemplatesClient />
    </ProtectedRoute>
  );
}
