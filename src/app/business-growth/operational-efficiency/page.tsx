import type { Metadata } from "next";
import { Sidebar } from "@/components/Sidebar";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export const metadata: Metadata = {
  title: "Operational Efficiency Strategies for Dental Practices",
  description: "Streamline your dental practice operations with proven efficiency strategies, automation tools, and workflow optimization techniques.",
  keywords: ["dental practice efficiency", "workflow optimization", "practice management", "operational streamlining"],
};

export default function OperationalEfficiencyPage() {
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
                    Operational Efficiency Strategies
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600 mt-1">
                    Streamline your practice operations and maximize productivity with proven efficiency techniques
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
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Optimize Your Practice Operations</h2>
                    <p className="text-gray-600 mb-4">
                      Operational efficiency is the foundation of a successful dental practice. By streamlining workflows, 
                      automating routine tasks, and optimizing staff productivity, you can serve more patients while reducing costs and stress.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                      <div className="text-center p-4 bg-rose-50 rounded-lg">
                        <div className="text-2xl font-bold text-rose-600 mb-2">40%</div>
                        <div className="text-sm text-gray-600">time savings with automation</div>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600 mb-2">30%</div>
                        <div className="text-sm text-gray-600">increase in patient capacity</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600 mb-2">25%</div>
                        <div className="text-sm text-gray-600">reduction in operational costs</div>
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
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Efficiency Optimization Strategies</h2>
                    
                    <div className="space-y-6">
                      {/* Strategy 1 */}
                      <div className="border-l-4 border-rose-500 pl-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">1. Practice Management Software</h3>
                        <p className="text-gray-600 mb-3">
                          Implement comprehensive practice management software to automate routine tasks and streamline operations.
                        </p>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          <li>Automated appointment scheduling and reminders</li>
                          <li>Digital patient records and treatment history</li>
                          <li>Integrated billing and insurance processing</li>
                          <li>Inventory management and supply tracking</li>
                        </ul>
                      </div>

                      {/* Strategy 2 */}
                      <div className="border-l-4 border-blue-500 pl-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">2. Optimize Staff Workflows</h3>
                        <p className="text-gray-600 mb-3">
                          Design efficient workflows that maximize staff productivity and minimize bottlenecks.
                        </p>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          <li>Define clear roles and responsibilities</li>
                          <li>Implement cross-training programs</li>
                          <li>Create standardized procedures and checklists</li>
                          <li>Establish efficient communication protocols</li>
                        </ul>
                      </div>

                      {/* Strategy 3 */}
                      <div className="border-l-4 border-green-500 pl-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">3. Digital Patient Experience</h3>
                        <p className="text-gray-600 mb-3">
                          Streamline the patient experience with digital tools and self-service options.
                        </p>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          <li>Online appointment booking and rescheduling</li>
                          <li>Digital forms and intake processes</li>
                          <li>Online payment and insurance verification</li>
                          <li>Patient portal for records and communication</li>
                        </ul>
                      </div>

                      {/* Strategy 4 */}
                      <div className="border-l-4 border-purple-500 pl-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">4. Equipment and Technology</h3>
                        <p className="text-gray-600 mb-3">
                          Invest in modern equipment and technology that improves efficiency and patient care.
                        </p>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          <li>Digital imaging and diagnostic tools</li>
                          <li>CAD/CAM systems for same-day restorations</li>
                          <li>Automated sterilization equipment</li>
                          <li>Cloud-based data storage and backup</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Implementation Steps */}
                <section className="mb-8 rounded-[4px] bg-[#ffffff] box-border overflow-hidden relative">
                  <div className="absolute inset-0 rounded-[4px] bg-gradient-to-r from-[#A78BFA] via-[#C4B5FD] via-[#E9D5FF] to-[#A78BFA] p-[1px] animate-gradient-x">
                    <div className="w-full h-full rounded-[3px] bg-[#ffffff]"></div>
                  </div>
                  <div className="relative z-10 p-6 lg:p-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Implementation Roadmap</h2>
                    
                    <div className="space-y-4">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center">
                          <span className="text-rose-600 font-semibold text-sm">1</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">Audit Current Operations</h3>
                          <p className="text-gray-600">Identify inefficiencies, bottlenecks, and areas for improvement in your current workflows.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-sm">2</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">Prioritize Improvements</h3>
                          <p className="text-gray-600">Focus on high-impact, low-effort improvements first to build momentum and quick wins.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 font-semibold text-sm">3</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">Invest in Technology</h3>
                          <p className="text-gray-600">Select and implement practice management software and digital tools that align with your needs.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-purple-600 font-semibold text-sm">4</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">Train Your Team</h3>
                          <p className="text-gray-600">Provide comprehensive training to ensure your staff can effectively use new systems and processes.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                          <span className="text-orange-600 font-semibold text-sm">5</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">Monitor and Optimize</h3>
                          <p className="text-gray-600">Continuously monitor performance metrics and make adjustments to further improve efficiency.</p>
                        </div>
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
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Streamline Your Practice Today</h2>
                    <p className="text-gray-600 mb-6">
                      Start implementing these operational efficiency strategies to reduce costs, improve patient care, and grow your practice.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <a 
                        href="/business-growth" 
                        className="px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
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
