import { Metadata } from 'next';
import { Sidebar } from '@/components/Sidebar';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import MarketingCalendarContent from './MarketingCalendarContent';

export const metadata: Metadata = {
  title: 'Marketing Calendar | Tribly Dashboard',
  description: 'Manage your events and appointments with our marketing calendar',
};

export default function MarketingCalendarPage() {
  return (
    <ProtectedRoute>
      <div className="bg-[#f6f6f6] min-h-screen">
        {/* Main App Sidebar */}
        <Sidebar />

        {/* Marketing Calendar Content */}
        <MarketingCalendarContent />
      </div>
    </ProtectedRoute>
  );
}

