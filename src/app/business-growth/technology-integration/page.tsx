import type { Metadata } from "next";
import { Sidebar } from "@/components/Sidebar";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export const metadata: Metadata = {
  title: "Technology Integration for Dental Practices",
  description: "Leverage modern dental technology to improve patient care, streamline operations, and stay competitive in the digital age.",
  keywords: ["dental technology", "digital dentistry", "CAD/CAM", "practice management software"],
};

export default function TechnologyIntegrationPage() {
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
                    Technology Integration
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600 mt-1">
                    Leverage modern dental technology for superior patient care and practice efficiency
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
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Embrace Digital Dentistry</h2>
                    <p className="text-gray-600 mb-4">
                      Modern dental technology is revolutionizing patient care and practice management. 
                      From digital imaging to AI-powered diagnostics, technology integration can significantly 
                      improve treatment outcomes and operational efficiency.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                      <div className="text-center p-4 bg-violet-50 rounded-lg">
                        <div className="text-2xl font-bold text-violet-600 mb-2">50%</div>
                        <div className="text-sm text-gray-600">faster treatment planning</div>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600 mb-2">90%</div>
                        <div className="text-sm text-gray-600">improvement in diagnostic accuracy</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600 mb-2">75%</div>
                        <div className="text-sm text-gray-600">reduction in appointment time</div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Key Technologies */}
                <section className="mb-8 rounded-[4px] bg-[#ffffff] box-border overflow-hidden relative">
                  <div className="absolute inset-0 rounded-[4px] bg-gradient-to-r from-[#A78BFA] via-[#C4B5FD] via-[#E9D5FF] to-[#A78BFA] p-[1px] animate-gradient-x">
                    <div className="w-full h-full rounded-[3px] bg-[#ffffff]"></div>
                  </div>
                  <div className="relative z-10 p-6 lg:p-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Essential Dental Technologies</h2>
                    
                    <div className="space-y-6">
                      {/* Technology 1 */}
                      <div className="border-l-4 border-violet-500 pl-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">1. Digital Imaging Systems</h3>
                        <p className="text-gray-600 mb-3">
                          Replace traditional X-rays with digital imaging for better diagnostics and patient experience.
                        </p>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          <li>Intraoral cameras for detailed examinations</li>
                          <li>Digital panoramic X-rays</li>
                          <li>Cone beam CT scans for 3D imaging</li>
                          <li>Instant image processing and sharing</li>
                        </ul>
                      </div>

                      {/* Technology 2 */}
                      <div className="border-l-4 border-blue-500 pl-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">2. CAD/CAM Technology</h3>
                        <p className="text-gray-600 mb-3">
                          Create same-day restorations with computer-aided design and manufacturing systems.
                        </p>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          <li>Same-day crowns and bridges</li>
                          <li>Precise digital impressions</li>
                          <li>Custom restoration design</li>
                          <li>Reduced patient visits</li>
                        </ul>
                      </div>

                      {/* Technology 3 */}
                      <div className="border-l-4 border-green-500 pl-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">3. Practice Management Software</h3>
                        <p className="text-gray-600 mb-3">
                          Streamline operations with comprehensive practice management systems.
                        </p>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          <li>Automated appointment scheduling</li>
                          <li>Digital patient records</li>
                          <li>Integrated billing and insurance</li>
                          <li>Analytics and reporting tools</li>
                        </ul>
                      </div>

                      {/* Technology 4 */}
                      <div className="border-l-4 border-purple-500 pl-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">4. Laser Dentistry</h3>
                        <p className="text-gray-600 mb-3">
                          Minimally invasive treatments using advanced laser technology.
                        </p>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          <li>Painless soft tissue procedures</li>
                          <li>Precise cavity preparation</li>
                          <li>Reduced healing time</li>
                          <li>Minimal anesthesia requirements</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Implementation Strategy */}
                <section className="mb-8 rounded-[4px] bg-[#ffffff] box-border overflow-hidden relative">
                  <div className="absolute inset-0 rounded-[4px] bg-gradient-to-r from-[#A78BFA] via-[#C4B5FD] via-[#E9D5FF] to-[#A78BFA] p-[1px] animate-gradient-x">
                    <div className="w-full h-full rounded-[3px] bg-[#ffffff]"></div>
                  </div>
                  <div className="relative z-10 p-6 lg:p-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Technology Integration Roadmap</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Phase 1: Foundation</h3>
                        <p className="text-gray-600 mb-3">
                          Start with essential technologies that provide immediate benefits.
                        </p>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Practice management software</li>
                          <li>• Digital X-ray systems</li>
                          <li>• Patient communication tools</li>
                        </ul>
                      </div>
                      
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Phase 2: Advanced</h3>
                        <p className="text-gray-600 mb-3">
                          Add sophisticated technologies for enhanced patient care.
                        </p>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• CAD/CAM systems</li>
                          <li>• 3D imaging technology</li>
                          <li>• Laser equipment</li>
                        </ul>
                      </div>
                      
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Phase 3: Innovation</h3>
                        <p className="text-gray-600 mb-3">
                          Implement cutting-edge technologies for competitive advantage.
                        </p>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• AI-powered diagnostics</li>
                          <li>• Virtual reality patient education</li>
                          <li>• Telemedicine capabilities</li>
                        </ul>
                      </div>
                      
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Phase 4: Optimization</h3>
                        <p className="text-gray-600 mb-3">
                          Integrate all systems for maximum efficiency and patient satisfaction.
                        </p>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• System integration</li>
                          <li>• Workflow optimization</li>
                          <li>• Continuous improvement</li>
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
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Transform Your Practice with Technology</h2>
                    <p className="text-gray-600 mb-6">
                      Start integrating modern dental technology to improve patient care, increase efficiency, and stay ahead of the competition.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <a 
                        href="/business-growth" 
                        className="px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
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
