import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Sidebar } from '@/components/Sidebar';
import { InvoiceTemplatesContent } from './InvoiceTemplatesContent';

export const metadata: Metadata = {
  title: 'Invoice Templates - Settings',
  description: 'Customize your invoice templates and business details',
  openGraph: {
    title: 'Invoice Templates - Settings',
    description: 'Customize your invoice templates and business details',
  },
};

export default function InvoiceTemplatesPage() {
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-white">
        <Sidebar />
        <Suspense fallback={<div className="flex-1 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#9747FF]"></div></div>}>
          <InvoiceTemplatesContent />
        </Suspense>
      </div>
    </ProtectedRoute>
  );
}
