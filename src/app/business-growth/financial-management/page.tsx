import type { Metadata } from "next";
import { Sidebar } from "@/components/Sidebar";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export const metadata: Metadata = {
  title: "Financial Management for Dental Practices",
  description: "Optimize your dental practice&apos;s financial health with proven strategies for budgeting, cash flow management, and investment planning.",
  keywords: ["dental financial management", "practice budgeting", "cash flow", "dental practice finance"],
};

export default function FinancialManagementPage() {
  return (
    <ProtectedRoute>
      <div className="bg-[#f6f6f6]">
        <div className="flex relative">
          <Sidebar />
          <main className="flex-1 transition-sidebar main-content">
            {/* Header */}
            <div className="px-3 py-4 sm:px-4 sm:py-5 lg:px-8 lg:py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">
                    Financial Management
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600 mt-1">
                    Optimize your practice&apos;s financial health and ensure long-term profitability
                  </p>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="w-full max-w-full px-3 py-4 sm:px-4 sm:py-5 lg:px-8 lg:py-8 overflow-x-hidden">
              <div className="max-w-4xl mx-auto">
                {/* Introduction */}
                <section className="mb-8 rounded-[4px] bg-[#ffffff] box-border overflow-hidden relative">
                  <div className="absolute inset-0 rounded-[4px] bg-gradient-to-r from-[#A78BFA] via-[#C4B5FD] via-[#E9D5FF] to-[#A78BFA] p-[1px] animate-gradient-x">
                    <div className="w-full h-full rounded-[3px] bg-[#ffffff]"></div>
                  </div>
                  <div className="relative z-10 p-6 lg:p-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Master Your Practice Finances</h2>
                    <p className="text-gray-600 mb-4">
                      Effective financial management is crucial for dental practice success. From budgeting and cash flow 
                      management to investment strategies, proper financial planning ensures your practice thrives and grows.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                      <div className="text-center p-4 bg-teal-50 rounded-lg">
                        <div className="text-2xl font-bold text-teal-600 mb-2">25%</div>
                        <div className="text-sm text-gray-600">improvement in profit margins</div>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600 mb-2">40%</div>
                        <div className="text-sm text-gray-600">better cash flow management</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600 mb-2">60%</div>
                        <div className="text-sm text-gray-600">reduction in financial stress</div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Key Strategies */}
                <section className="mb-8 rounded-[4px] bg-[#ffffff] box-border overflow-hidden relative">
                  <div className="absolute inset-0 rounded-[4px] bg-gradient-to-r from-[#A78BFA] via-[#C4B5FD] via-[#E9D5FF] to-[#A78BFA] p-[1px] animate-gradient-x">
                    <div className="w-full h-full rounded-[3px] bg-[#ffffff]"></div>
                  </div>
                  <div className="relative z-10 p-6 lg:p-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Financial Management Strategies</h2>
                    
                    <div className="space-y-6">
                      {/* Strategy 1 */}
                      <div className="border-l-4 border-teal-500 pl-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">1. Comprehensive Budget Planning</h3>
                        <p className="text-gray-600 mb-3">
                          Create detailed budgets that cover all aspects of your practice operations and growth.
                        </p>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          <li>Monthly and annual revenue projections</li>
                          <li>Fixed and variable expense tracking</li>
                          <li>Equipment and technology investment planning</li>
                          <li>Emergency fund allocation</li>
                        </ul>
                      </div>

                      {/* Strategy 2 */}
                      <div className="border-l-4 border-blue-500 pl-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">2. Cash Flow Management</h3>
                        <p className="text-gray-600 mb-3">
                          Optimize your practice&apos;s cash flow to ensure smooth operations and financial stability.
                        </p>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          <li>Monitor daily cash inflows and outflows</li>
                          <li>Implement efficient billing and collection systems</li>
                          <li>Manage accounts receivable effectively</li>
                          <li>Plan for seasonal variations in revenue</li>
                        </ul>
                      </div>

                      {/* Strategy 3 */}
                      <div className="border-l-4 border-green-500 pl-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">3. Investment Strategies</h3>
                        <p className="text-gray-600 mb-3">
                          Make strategic investments in your practice to drive long-term growth and profitability.
                        </p>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          <li>Technology and equipment upgrades</li>
                          <li>Practice expansion and renovation</li>
                          <li>Staff development and training programs</li>
                          <li>Marketing and patient acquisition initiatives</li>
                        </ul>
                      </div>

                      {/* Strategy 4 */}
                      <div className="border-l-4 border-purple-500 pl-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">4. Financial Monitoring</h3>
                        <p className="text-gray-600 mb-3">
                          Implement systems to track and analyze your practice&apos;s financial performance regularly.
                        </p>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          <li>Key performance indicators (KPIs)</li>
                          <li>Monthly financial reports and analysis</li>
                          <li>Profit and loss statement reviews</li>
                          <li>Benchmarking against industry standards</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Financial Tools */}
                <section className="mb-8 rounded-[4px] bg-[#ffffff] box-border overflow-hidden relative">
                  <div className="absolute inset-0 rounded-[4px] bg-gradient-to-r from-[#A78BFA] via-[#C4B5FD] via-[#E9D5FF] to-[#A78BFA] p-[1px] animate-gradient-x">
                    <div className="w-full h-full rounded-[3px] bg-[#ffffff]"></div>
                  </div>
                  <div className="relative z-10 p-6 lg:p-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Essential Financial Tools</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Accounting Software</h3>
                        <p className="text-gray-600 mb-3">
                          Use specialized dental practice accounting software for accurate financial tracking.
                        </p>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Automated expense categorization</li>
                          <li>• Integration with practice management systems</li>
                          <li>• Real-time financial reporting</li>
                        </ul>
                      </div>
                      
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Financial Dashboards</h3>
                        <p className="text-gray-600 mb-3">
                          Create visual dashboards to monitor key financial metrics at a glance.
                        </p>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Revenue and expense trends</li>
                          <li>• Profit margin analysis</li>
                          <li>• Cash flow projections</li>
                        </ul>
                      </div>
                      
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Budget Templates</h3>
                        <p className="text-gray-600 mb-3">
                          Develop standardized budget templates for consistent financial planning.
                        </p>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Monthly budget worksheets</li>
                          <li>• Annual planning templates</li>
                          <li>• Investment planning guides</li>
                        </ul>
                      </div>
                      
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Financial Advisors</h3>
                        <p className="text-gray-600 mb-3">
                          Work with financial professionals who understand dental practice needs.
                        </p>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Practice valuation services</li>
                          <li>• Retirement planning</li>
                          <li>• Tax optimization strategies</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Call to Action */}
                <section className="rounded-[4px] bg-[#ffffff] box-border overflow-hidden relative">
                  <div className="absolute inset-0 rounded-[4px] bg-gradient-to-r from-[#A78BFA] via-[#C4B5FD] via-[#E9D5FF] to-[#A78BFA] p-[1px] animate-gradient-x">
                    <div className="w-full h-full rounded-[3px] bg-[#ffffff]"></div>
                  </div>
                  <div className="relative z-10 p-6 lg:p-8 text-center">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Take Control of Your Practice Finances</h2>
                    <p className="text-gray-600 mb-6">
                      Implement these financial management strategies to optimize your practice&apos;s profitability and ensure long-term success.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <a 
                        href="/business-growth" 
                        className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                      >
                        Back to Growth Strategies
                      </a>
                      <a 
                        href="/dashboard" 
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Go to Dashboard
                      </a>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
