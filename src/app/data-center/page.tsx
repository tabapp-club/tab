import React, { Suspense } from 'react';
import { Metadata } from 'next';
import DataCenterClient from '../../components/DataCenterClient';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export const metadata: Metadata = {
  title: 'Data Centre | Business Dashboard',
  description: 'Comprehensive user data management and analytics dashboard for business insights.',
  keywords: ['data center', 'users', 'analytics', 'business dashboard', 'user management'],
  authors: [{ name: 'Business Dashboard' }],
  openGraph: {
    title: 'Data Centre | Business Dashboard',
    description: 'Comprehensive user data management and analytics dashboard for business insights.',
    url: '/data-center',
    siteName: 'Business Dashboard',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Data Centre Dashboard',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Data Centre | Business Dashboard',
    description: 'Comprehensive user data management and analytics dashboard for business insights.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification',
  },
};

export default function DataCenterPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#9747FF]"></div></div>}>
        <DataCenterClient />
      </Suspense>
    </ProtectedRoute>
  );
}
