import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { SidebarProvider } from "@/components/SidebarContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { PopupProvider } from "@/contexts/PopupContext";
import { CampaignProvider } from "@/contexts/CampaignContext";
import { GlobalPopup } from "@/components/GlobalPopup";
import { QueryProvider } from "@/components/QueryProvider";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Business Dashboard",
  description: "A modern business analytics dashboard with real-time insights",
  manifest: "/manifest.json",
  themeColor: "#f6f6f6",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: "cover",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Business Dashboard",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Business Dashboard",
    title: "Business Dashboard",
    description: "A modern business analytics dashboard with real-time insights",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.svg", sizes: "192x192", type: "image/svg+xml" },
      { url: "/icons/icon-512x512.svg", sizes: "512x512", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/icons/icon-152x152.svg", sizes: "152x152", type: "image/svg+xml" },
    ],
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#f6f6f6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Business Dashboard" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icons/icon-152x152.svg" />
        <link rel="icon" type="image/svg+xml" sizes="192x192" href="/icons/icon-192x192.svg" />
        <link rel="icon" type="image/svg+xml" sizes="512x512" href="/icons/icon-512x512.svg" />
      </head>
      <body suppressHydrationWarning className={`${manrope.variable} antialiased`}>
        <QueryProvider>
          <AuthProvider>
            <PopupProvider>
              <CampaignProvider>
                <SidebarProvider>
                  {children}
                  <GlobalPopup />
                  <PWAInstallPrompt />
                </SidebarProvider>
              </CampaignProvider>
            </PopupProvider>
          </AuthProvider>
        </QueryProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
