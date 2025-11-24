import React, { Suspense } from 'react';
import { Metadata } from 'next';
import CustomerDetailsClient from '../../../components/CustomerDetailsClient';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export const metadata: Metadata = {
  title: 'Patient Details | Business Dashboard',
  description: 'Comprehensive patient profile with purchase patterns, insights, and risk assessment.',
  keywords: ['patient details', 'client details', 'profile', 'purchase patterns', 'risk assessment', 'business dashboard'],
  authors: [{ name: 'Business Dashboard' }],
  openGraph: {
    title: 'Patient Details | Business Dashboard',
    description: 'Comprehensive patient profile with purchase patterns, insights, and risk assessment.',
    url: '/customer',
    siteName: 'Business Dashboard',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Patient Details Dashboard',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Patient Details | Business Dashboard',
    description: 'Comprehensive patient profile with purchase patterns, insights, and risk assessment.',
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

interface CustomerPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Generate static params for dynamic routes
// This is now optional since we removed static export
export async function generateStaticParams() {
  // Return empty array to allow dynamic generation
  // In production, you could pre-generate popular patient pages here
  return [];
}

export default async function CustomerPage({ params }: CustomerPageProps) {
  const { id } = await params;

  return (
    <ProtectedRoute>
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#9747FF]"></div></div>}>
        <CustomerDetailsClient customerId={id} />
      </Suspense>
    </ProtectedRoute>
  );
}
