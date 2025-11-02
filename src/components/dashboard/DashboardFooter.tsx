"use client";

export function DashboardFooter() {
  return (
    <footer className="border-t border-[#dbdbdb] p-6">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center">
          <h2 className="text-[20px] font-bold text-[#2a2a2f] mb-3">
            Data-Driven Business Growth with tribly Dashboard
          </h2>
          <p className="text-[16px] text-[#696969] max-w-3xl mx-auto">
            Transform customer data into actionable insights. Track performance, optimize campaigns, and scale your business with precision.
          </p>
        </div>

      </div>

      {/* Bottom Footer */}
      <div className="border-t border-[#e5e7eb] pt-6 mt-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Mobile: Privacy links first, then copyright */}
          <div className="flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-6">
            <div className="flex items-center space-x-6">
              <a href="/privacy" className="text-[12px] text-[#696969] hover:text-[#2a2a2f] transition-colors">Privacy</a>
              <a href="/terms" className="text-[12px] text-[#696969] hover:text-[#2a2a2f] transition-colors">Terms</a>
              <a href="/cookies" className="text-[12px] text-[#696969] hover:text-[#2a2a2f] transition-colors">Cookies</a>
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