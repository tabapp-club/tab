import type { Metadata } from "next";
import { Sidebar } from "@/components/Sidebar";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export const metadata: Metadata = {
  title: "Patient Experience Strategies for Dental Practices",
  description: "Create exceptional patient experiences that build loyalty, increase satisfaction, and drive practice growth through superior service.",
  keywords: ["patient experience", "dental customer service", "patient satisfaction", "practice hospitality"],
};

export default function PatientExperiencePage() {
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
                    Patient Experience Strategies
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600 mt-1">
                    Create exceptional patient experiences that build loyalty and drive practice growth
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
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Excellence in Patient Care</h2>
                    <p className="text-gray-600 mb-4">
                      Exceptional patient experiences are the foundation of a successful dental practice. 
                      From the moment patients enter your practice to their follow-up care, every interaction 
                      shapes their perception and influences their loyalty.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                      <div className="text-center p-4 bg-pink-50 rounded-lg">
                        <div className="text-2xl font-bold text-pink-600 mb-2">85%</div>
                        <div className="text-sm text-gray-600">of patients stay loyal with great experience</div>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600 mb-2">70%</div>
                        <div className="text-sm text-gray-600">referral rate from satisfied patients</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600 mb-2">40%</div>
                        <div className="text-sm text-gray-600">increase in treatment acceptance</div>
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
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Patient Experience Strategies</h2>
                    
                    <div className="space-y-6">
                      {/* Strategy 1 */}
                      <div className="border-l-4 border-pink-500 pl-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">1. Comfort Amenities</h3>
                        <p className="text-gray-600 mb-3">
                          Create a welcoming and comfortable environment that helps patients feel relaxed and cared for.
                        </p>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          <li>Comfortable seating and waiting areas</li>
                          <li>Entertainment options (TV, magazines, Wi-Fi)</li>
                          <li>Refreshments and comfort items</li>
                          <li>Calming music and aromatherapy</li>
                        </ul>
                      </div>

                      {/* Strategy 2 */}
                      <div className="border-l-4 border-blue-500 pl-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">2. Clear Communication</h3>
                        <p className="text-gray-600 mb-3">
                          Ensure patients understand their treatment options, procedures, and care instructions.
                        </p>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          <li>Explain procedures in simple terms</li>
                          <li>Provide written treatment plans</li>
                          <li>Use visual aids and models</li>
                          <li>Encourage questions and address concerns</li>
                        </ul>
                      </div>

                      {/* Strategy 3 */}
                      <div className="border-l-4 border-green-500 pl-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">3. Follow-up Care</h3>
                        <p className="text-gray-600 mb-3">
                          Maintain contact with patients after treatment to ensure their comfort and satisfaction.
                        </p>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          <li>Post-treatment check-in calls</li>
                          <li>Care instructions and reminders</li>
                          <li>Follow-up appointment scheduling</li>
                          <li>Patient satisfaction surveys</li>
                        </ul>
                      </div>

                      {/* Strategy 4 */}
                      <div className="border-l-4 border-purple-500 pl-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">4. Personalized Service</h3>
                        <p className="text-gray-600 mb-3">
                          Tailor your service to meet individual patient needs and preferences.
                        </p>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          <li>Remember patient preferences and history</li>
                          <li>Customize treatment approaches</li>
                          <li>Personalized communication styles</li>
                          <li>Special accommodations when needed</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Experience Touchpoints */}
                <section className="mb-8 rounded-[4px] bg-[#ffffff] box-border overflow-hidden relative">
                  <div className="absolute inset-0 rounded-[4px] bg-gradient-to-r from-[#A78BFA] via-[#C4B5FD] via-[#E9D5FF] to-[#A78BFA] p-[1px] animate-gradient-x">
                    <div className="w-full h-full rounded-[3px] bg-[#ffffff]"></div>
                  </div>
                  <div className="relative z-10 p-6 lg:p-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Patient Journey Touchpoints</h2>
                    
                    <div className="space-y-4">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                          <span className="text-pink-600 font-semibold text-sm">1</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">Initial Contact</h3>
                          <p className="text-gray-600">First phone call, website visit, or referral - make a great first impression.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-sm">2</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">Appointment Scheduling</h3>
                          <p className="text-gray-600">Make scheduling easy and convenient with flexible options.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 font-semibold text-sm">3</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">Arrival & Check-in</h3>
                          <p className="text-gray-600">Welcome patients warmly and minimize wait times.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-purple-600 font-semibold text-sm">4</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">Treatment Experience</h3>
                          <p className="text-gray-600">Provide comfortable, professional care with clear communication.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                          <span className="text-orange-600 font-semibold text-sm">5</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">Follow-up & Care</h3>
                          <p className="text-gray-600">Maintain contact and ensure continued satisfaction.</p>
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
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Elevate Your Patient Experience</h2>
                    <p className="text-gray-600 mb-6">
                      Implement these patient experience strategies to build loyalty, increase satisfaction, and grow your practice through exceptional service.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <a 
                        href="/business-growth" 
                        className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
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
