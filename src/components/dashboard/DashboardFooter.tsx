"use client";

export function DashboardFooter() {
  return (
    <footer className="border-t border-[#dbdbdb] p-6">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center">
          <h2 className="text-[20px] font-bold text-[#2a2a2f] mb-3">
            Data-Driven Business Growth with Tab Dashboard
          </h2>
          <p className="text-[16px] text-[#696969] max-w-3xl mx-auto">
            Transform customer data into actionable insights. Track performance, optimize campaigns, and scale your business with precision.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          <a href="/new-campaign" className="bg-white px-4 py-2 rounded border border-[#e5e7eb] text-[13px] text-[#696969] hover:text-primary hover:border-primary transition-all">
            Campaign Templates
          </a>
          <a href="/achievements" className="bg-white px-4 py-2 rounded border border-[#e5e7eb] text-[13px] text-[#696969] hover:text-primary hover:border-primary transition-all">
            Achievements
          </a>
          <a href="/business-services" className="bg-white px-4 py-2 rounded border border-[#e5e7eb] text-[13px] text-[#696969] hover:text-primary hover:border-primary transition-all">
            Business Solutions
          </a>
          <a href="/ai-services" className="bg-white px-4 py-2 rounded border border-[#e5e7eb] text-[13px] text-[#696969] hover:text-primary hover:border-primary transition-all">
            AI Insights
          </a>
          <a href="/settings?section=help-support" className="bg-white px-4 py-2 rounded border border-[#e5e7eb] text-[13px] text-[#696969] hover:text-primary hover:border-primary transition-all">
            Help and Support
          </a>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-[#e5e7eb] pt-6 mt-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Mobile: Privacy links first, then copyright */}
          <div className="flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-6">
            <div className="flex items-center space-x-6">
              <a href="#" className="text-[12px] text-[#696969] hover:text-[#2a2a2f] transition-colors">Privacy</a>
              <a href="#" className="text-[12px] text-[#696969] hover:text-[#2a2a2f] transition-colors">Terms</a>
              <a href="#" className="text-[12px] text-[#696969] hover:text-[#2a2a2f] transition-colors">Cookies</a>
            </div>
            <span className="text-[12px] text-[#696969]">© 2025 tribly. All rights reserved.</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-[12px] text-[#696969]">v1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}