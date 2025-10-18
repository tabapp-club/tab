import type { Metadata } from "next";
import { Sidebar } from "@/components/Sidebar";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export const metadata: Metadata = {
  title: "Staff Training Strategies for Dental Practices",
  description: "Develop your dental team for better patient care with comprehensive training programs, cross-training initiatives, and skill development strategies.",
  keywords: ["dental staff training", "team development", "cross-training", "customer service training"],
};

export default function StaffTrainingPage() {
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
                    Staff Training Strategies
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600 mt-1">
                    Develop your team for exceptional patient care and practice growth
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
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Invest in Your Team&apos;s Success</h2>
                    <p className="text-gray-600 mb-4">
                      Well-trained staff are the backbone of a successful dental practice. Comprehensive training programs 
                      improve patient satisfaction, reduce errors, and create a more efficient and professional environment.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                      <div className="text-center p-4 bg-cyan-50 rounded-lg">
                        <div className="text-2xl font-bold text-cyan-600 mb-2">45%</div>
                        <div className="text-sm text-gray-600">improvement in patient satisfaction</div>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600 mb-2">60%</div>
                        <div className="text-sm text-gray-600">reduction in operational errors</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600 mb-2">35%</div>
                        <div className="text-sm text-gray-600">increase in staff productivity</div>
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
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Essential Training Programs</h2>
                    
                    <div className="space-y-6">
                      {/* Strategy 1 */}
                      <div className="border-l-4 border-cyan-500 pl-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">1. Cross-Training Programs</h3>
                        <p className="text-gray-600 mb-3">
                          Train staff members in multiple roles to increase flexibility and ensure continuity of care.
                        </p>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          <li>Train front desk staff in basic clinical procedures</li>
                          <li>Teach hygienists administrative tasks</li>
                          <li>Cross-train assistants in different specialties</li>
                          <li>Develop backup systems for key positions</li>
                        </ul>
                      </div>

                      {/* Strategy 2 */}
                      <div className="border-l-4 border-blue-500 pl-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">2. Customer Service Excellence</h3>
                        <p className="text-gray-600 mb-3">
                          Ensure every team member delivers exceptional patient experiences through comprehensive service training.
                        </p>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          <li>Active listening and communication skills</li>
                          <li>Handling difficult situations and complaints</li>
                          <li>Phone etiquette and appointment scheduling</li>
                          <li>Creating welcoming environments</li>
                        </ul>
                      </div>

                      {/* Strategy 3 */}
                      <div className="border-l-4 border-green-500 pl-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">3. Technical Skill Development</h3>
                        <p className="text-gray-600 mb-3">
                          Keep your team updated with the latest dental techniques and technologies.
                        </p>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          <li>New dental materials and procedures</li>
                          <li>Digital technology and software training</li>
                          <li>Infection control and safety protocols</li>
                          <li>Continuing education requirements</li>
                        </ul>
                      </div>

                      {/* Strategy 4 */}
                      <div className="border-l-4 border-purple-500 pl-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">4. Leadership Development</h3>
                        <p className="text-gray-600 mb-3">
                          Develop leadership skills among senior staff to improve team management and practice operations.
                        </p>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          <li>Team management and motivation</li>
                          <li>Conflict resolution strategies</li>
                          <li>Performance evaluation techniques</li>
                          <li>Mentoring and coaching skills</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Implementation Framework */}
                <section className="mb-8 rounded-[4px] bg-[#ffffff] box-border overflow-hidden relative">
                  <div className="absolute inset-0 rounded-[4px] bg-gradient-to-r from-[#A78BFA] via-[#C4B5FD] via-[#E9D5FF] to-[#A78BFA] p-[1px] animate-gradient-x">
                    <div className="w-full h-full rounded-[3px] bg-[#ffffff]"></div>
                  </div>
                  <div className="relative z-10 p-6 lg:p-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Training Implementation Plan</h2>
                    
                    <div className="space-y-4">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center">
                          <span className="text-cyan-600 font-semibold text-sm">1</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">Assess Current Skills</h3>
                          <p className="text-gray-600">Evaluate your team&apos;s current skill levels and identify training gaps.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-sm">2</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">Create Training Schedule</h3>
                          <p className="text-gray-600">Develop a structured training calendar that doesn&apos;t disrupt patient care.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 font-semibold text-sm">3</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">Choose Training Methods</h3>
                          <p className="text-gray-600">Select appropriate training formats: in-person, online, workshops, or mentoring.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-purple-600 font-semibold text-sm">4</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">Measure Progress</h3>
                          <p className="text-gray-600">Track training effectiveness and adjust programs based on results and feedback.</p>
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
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Start Training Your Team Today</h2>
                    <p className="text-gray-600 mb-6">
                      Invest in your team&apos;s development to improve patient care, increase efficiency, and grow your practice.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <a 
                        href="/business-growth" 
                        className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
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
