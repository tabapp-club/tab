import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Sidebar } from '@/components/Sidebar';
import { SettingsContent } from './SettingsContent';

export const metadata: Metadata = {
  title: 'Settings - Business Dashboard',
  description: 'Manage your account settings and preferences',
  openGraph: {
    title: 'Settings - Business Dashboard',
    description: 'Manage your account settings and preferences',
  },
};

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-white">
        <Sidebar />
        <Suspense fallback={<div className="flex-1 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#9747FF]"></div></div>}>
          <SettingsContent />
        </Suspense>
      </div>
    </ProtectedRoute>
  );
}
