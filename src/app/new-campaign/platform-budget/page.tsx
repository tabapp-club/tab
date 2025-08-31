import { Sidebar } from '@/components/Sidebar';
import { PlatformBudgetContent } from './PlatformBudgetContent';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Platform & Budget | Campaign Builder | Business Dashboard',
  description: 'Set your campaign budget and choose advertising platforms. Configure spending limits and select the best channels for your campaign.',
  keywords: 'campaign budget, advertising platforms, marketing spend, campaign configuration, platform selection',
  openGraph: {
    title: 'Platform & Budget | Campaign Builder | Business Dashboard',
    description: 'Set your campaign budget and choose advertising platforms. Configure spending limits and select the best channels for your campaign.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Platform & Budget | Campaign Builder | Business Dashboard',
    description: 'Set your campaign budget and choose advertising platforms.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PlatformBudgetPage() {
  return (
    <div className="flex h-screen bg-[#f6f6f6]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Suspense fallback={<div>Loading...</div>}>
          <PlatformBudgetContent />
        </Suspense>
      </div>
    </div>
  );
}
