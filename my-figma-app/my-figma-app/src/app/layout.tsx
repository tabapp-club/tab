import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { SidebarProvider } from "@/components/SidebarContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { PopupProvider } from "@/contexts/PopupContext";
import { GlobalPopup } from "@/components/GlobalPopup";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Business Dashboard",
  description: "A modern business analytics dashboard with real-time insights",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} antialiased`}>
        <AuthProvider>
          <PopupProvider>
            <SidebarProvider>
              {children}
              <GlobalPopup />
            </SidebarProvider>
          </PopupProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
