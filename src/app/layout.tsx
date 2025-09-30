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
import { ScreenOrientationControls } from "@/components/ScreenOrientationControls";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "tribly",
  description: "tribly - A modern business analytics platform with real-time insights",
  manifest: "/manifest.json",
  themeColor: "#f6f6f6",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    viewportFit: "cover",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "tribly",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "tribly",
    title: "tribly",
    description: "tribly - A modern business analytics platform with real-time insights",
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

export const generateViewport = () => ({
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#f6f6f6",
});


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
        <meta name="apple-mobile-web-app-title" content="tribly" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="msapplication-config" content="none" />
        <meta name="msapplication-TileColor" content="#f6f6f6" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#f6f6f6" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover" />
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
                  <ScreenOrientationControls className="fixed top-4 right-4 z-40" />
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
                      // SW registered successfully
                    })
                    .catch(function(registrationError) {
                      // SW registration failed
                    });
                });
              }

              // PWA Zoom Prevention JavaScript
              (function() {
                'use strict';

                // Prevent zoom on double tap
                let lastTouchEnd = 0;
                document.addEventListener('touchend', function (event) {
                  const now = (new Date()).getTime();
                  if (now - lastTouchEnd <= 300) {
                    event.preventDefault();
                  }
                  lastTouchEnd = now;
                }, false);

                // Prevent zoom on pinch
                document.addEventListener('gesturestart', function (event) {
                  event.preventDefault();
                });

                document.addEventListener('gesturechange', function (event) {
                  event.preventDefault();
                });

                document.addEventListener('gestureend', function (event) {
                  event.preventDefault();
                });

                // Prevent zoom on wheel with ctrl key
                document.addEventListener('wheel', function (event) {
                  if (event.ctrlKey) {
                    event.preventDefault();
                  }
                }, { passive: false });

                // Prevent zoom on keyboard shortcuts
                document.addEventListener('keydown', function (event) {
                  if ((event.ctrlKey || event.metaKey) && (event.key === '+' || event.key === '-' || event.key === '=' || event.key === '0')) {
                    event.preventDefault();
                  }
                });

                // Force viewport settings
                function setViewport() {
                  const viewport = document.querySelector('meta[name="viewport"]');
                  if (viewport) {
                    // Check if device is tablet
                    const isTablet = /tablet|ipad|android(?!.*mobile)/i.test(navigator.userAgent) ||
                                   (window.innerWidth >= 768 && window.innerWidth <= 1024);

                    if (isTablet) {
                      // Allow scaling on tablets for better rotation experience
                      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover');
                    } else {
                      // Keep mobile devices locked to prevent zoom
                      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
                    }
                  }
                }

                // Set viewport on load and resize
                setViewport();
                window.addEventListener('resize', setViewport);
                window.addEventListener('orientationchange', setViewport);

                // Prevent text selection that could trigger zoom
                document.addEventListener('selectstart', function (event) {
                  if (event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA' && !event.target.contentEditable) {
                    event.preventDefault();
                  }
                });

                // Prevent context menu that could trigger zoom
                document.addEventListener('contextmenu', function (event) {
                  if (event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA' && !event.target.contentEditable) {
                    event.preventDefault();
                  }
                });

                // Force font size on input focus to prevent zoom
                document.addEventListener('focusin', function (event) {
                  if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA' || event.target.contentEditable) {
                    event.target.style.fontSize = '16px';
                    event.target.style.webkitTextSizeAdjust = '100%';
                    event.target.style.textSizeAdjust = '100%';
                  }
                });

                // Additional mobile-specific prevention
                if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                  // Prevent zoom on touch events
                  document.addEventListener('touchstart', function (event) {
                    if (event.touches.length > 1) {
                      event.preventDefault();
                    }
                  }, { passive: false });

                  document.addEventListener('touchmove', function (event) {
                    if (event.touches.length > 1) {
                      event.preventDefault();
                    }
                  }, { passive: false });

                  // Prevent zoom on orientation change
                  window.addEventListener('orientationchange', function () {
                    setTimeout(function () {
                      setViewport();
                    }, 100);
                  });
                }
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}
