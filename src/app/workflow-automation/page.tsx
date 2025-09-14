import type { Metadata } from "next";
import { Sidebar } from "@/components/Sidebar";
import { WorkflowAutomationContent } from "./WorkflowAutomationContent";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export const metadata: Metadata = {
  title: "Workflow Automation - Business Dashboard",
  description: "Automate WhatsApp and SMS communications with intelligent workflow automation.",
  keywords: ["workflow", "automation", "whatsapp", "sms", "communications"],
  authors: [{ name: "Your Company" }],
  creator: "Your Company",
  publisher: "Your Company",
  openGraph: {
    title: "Workflow Automation - Business Dashboard",
    description: "Automate WhatsApp and SMS communications with intelligent workflow automation.",
    url: "/workflow-automation",
    siteName: "Business Dashboard",
    images: [
      {
        url: "/og-workflow-automation.png",
        width: 1200,
        height: 630,
        alt: "Workflow Automation Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Workflow Automation - Business Dashboard",
    description: "Automate WhatsApp and SMS communications with intelligent workflow automation.",
    images: ["/og-workflow-automation.png"],
    creator: "@yourcompany",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function WorkflowAutomationPage() {
  return (
    <ProtectedRoute>
      <div className="bg-[#f6f6f6]">
        <div className="flex relative">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <WorkflowAutomationContent />
        </div>
      </div>
    </ProtectedRoute>
  );
}
