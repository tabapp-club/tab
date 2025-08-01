import { Sidebar } from '@/components/Sidebar';
import { NewCampaignContent } from './NewCampaignContent';

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
