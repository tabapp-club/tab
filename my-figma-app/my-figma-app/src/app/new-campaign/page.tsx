import { Sidebar } from '@/components/Sidebar';
import { NewCampaignContent } from './NewCampaignContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create New Campaign | Business Dashboard',
  description: 'Create professional campaigns for advertising, engagement, retention, and feedback. Choose from multiple campaign types to grow your business.',
  keywords: 'campaign creation, advertising, customer engagement, retention, feedback, business growth',
  openGraph: {
    title: 'Create New Campaign | Business Dashboard',
    description: 'Create professional campaigns for advertising, engagement, retention, and feedback. Choose from multiple campaign types to grow your business.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Create New Campaign | Business Dashboard',
    description: 'Create professional campaigns for advertising, engagement, retention, and feedback.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function NewCampaignPage() {
  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <NewCampaignContent />
      </div>
    </div>
  );
}
