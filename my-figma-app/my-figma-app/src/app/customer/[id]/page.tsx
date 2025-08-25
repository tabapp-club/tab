import { Metadata } from 'next';
import CustomerDetailsClient from '../../../components/CustomerDetailsClient';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export const metadata: Metadata = {
  title: 'Customer Details | Business Dashboard',
  description: 'Comprehensive customer profile with purchase patterns, insights, and risk assessment.',
  keywords: ['customer details', 'profile', 'purchase patterns', 'risk assessment', 'business dashboard'],
  authors: [{ name: 'Business Dashboard' }],
  openGraph: {
    title: 'Customer Details | Business Dashboard',
    description: 'Comprehensive customer profile with purchase patterns, insights, and risk assessment.',
    url: '/customer',
    siteName: 'Business Dashboard',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Customer Details Dashboard',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Customer Details | Business Dashboard',
    description: 'Comprehensive customer profile with purchase patterns, insights, and risk assessment.',
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
  params: {
    id: string;
  };
}

// Generate static params for dynamic routes
// This is now optional since we removed static export
export async function generateStaticParams() {
  // Return empty array to allow dynamic generation
  // In production, you could pre-generate popular customer pages here
  return [];
}

export default function CustomerPage({ params }: CustomerPageProps) {
  return (
    <ProtectedRoute>
      <CustomerDetailsClient customerId={params.id} />
    </ProtectedRoute>
  );
}
