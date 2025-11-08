import { Sidebar } from '@/components/Sidebar';
import { SendCampaignContent } from './SendCampaignContent';
import { Metadata } from 'next';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Send Campaign | Business Dashboard',
  description: 'Configure and send your recommended campaign to engage customers and boost revenue.',
  keywords: 'campaign, send campaign, customer engagement, marketing',
  openGraph: {
    title: 'Send Campaign | Business Dashboard',
    description: 'Configure and send your recommended campaign to engage customers and boost revenue.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Send Campaign | Business Dashboard',
    description: 'Configure and send your recommended campaign to engage customers and boost revenue.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function SendCampaignPage() {
  return (
    <ProtectedRoute>
      <div className="bg-[#f6f6f6]">
        <div className="flex relative">
          <Sidebar />
          <Suspense fallback={<div className="flex-1 flex items-center justify-center">Loading...</div>}>
            <SendCampaignContent />
          </Suspense>
        </div>
      </div>
    </ProtectedRoute>
  );
}

