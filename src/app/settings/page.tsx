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
        <SettingsContent />
      </div>
    </ProtectedRoute>
  );
}
