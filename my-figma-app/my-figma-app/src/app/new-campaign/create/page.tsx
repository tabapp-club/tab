import { Sidebar } from '@/components/Sidebar';
import { CreateCampaignContent } from './CreateCampaignContent';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Create Campaign | Business Dashboard',
  description: 'Create your campaign with custom templates, images, and call-to-action text. Design professional advertisements for your business.',
  keywords: 'campaign creation, ad templates, marketing, business growth, advertising',
  openGraph: {
    title: 'Create Campaign | Business Dashboard',
    description: 'Create your campaign with custom templates, images, and call-to-action text. Design professional advertisements for your business.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Create Campaign | Business Dashboard',
    description: 'Create your campaign with custom templates, images, and call-to-action text.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function CreateCampaignPage() {
  return (
    <div className="flex h-screen bg-[#f6f6f6]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Suspense fallback={<div>Loading...</div>}>
          <CreateCampaignContent />
        </Suspense>
      </div>
    </div>
  );
}
