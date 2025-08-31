import { Metadata } from 'next';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Sidebar } from '@/components/Sidebar';
import { BugReportContent } from './BugReportContent';

export const metadata: Metadata = {
  title: 'Report Bug - Business Dashboard',
  description: 'Report issues and help us improve the application',
  openGraph: {
    title: 'Report Bug - Business Dashboard',
    description: 'Report issues and help us improve the application',
  },
};

export default function ReportBugPage() {
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-[#f6f6f6]">
        <Sidebar />
        <BugReportContent />
      </div>
    </ProtectedRoute>
  );
}
