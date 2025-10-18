import type { Metadata } from "next";
import { Sidebar } from "@/components/Sidebar";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export const metadata: Metadata = {
  title: "Customer Retention Strategies for Dental Practices",
  description: "Proven strategies to build lasting relationships with patients, increase retention rates, and maximize lifetime value.",
  keywords: ["dental customer retention", "patient loyalty", "retention strategies", "patient relationship management"],
};

export default function CustomerRetentionPage() {
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
                    Customer Retention Strategies
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600 mt-1">
                    Build lasting relationships with patients and maximize their lifetime value
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
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">The Power of Patient Retention</h2>
                    <p className="text-gray-600 mb-4">
                      Retaining existing patients is far more cost-effective than acquiring new ones. A strong retention strategy 
                      can increase your practice&apos;s profitability while building a loyal patient base that refers others to your practice.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600 mb-2">5x</div>
                        <div className="text-sm text-gray-600">cheaper to retain than acquire new patients</div>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600 mb-2">67%</div>
                        <div className="text-sm text-gray-600">of patients stay loyal with good service</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600 mb-2">80%</div>
                        <div className="text-sm text-gray-600">of referrals come from satisfied patients</div>
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
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Proven Retention Strategies</h2>
                    
                    <div className="space-y-6">
                      {/* Strategy 1 */}
                      <div className="border-l-4 border-green-500 pl-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">1. Implement Loyalty Programs</h3>
                        <p className="text-gray-600 mb-3">
                          Reward patients for their continued business with structured loyalty programs that offer real value.
                        </p>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          <li>Offer discounts for regular check-ups</li>
                          <li>Provide free cleanings after a certain number of visits</li>
                          <li>Create referral rewards for bringing new patients</li>
                          <li>Implement birthday and anniversary specials</li>
                        </ul>
                      </div>

                      {/* Strategy 2 */}
                      <div className="border-l-4 border-blue-500 pl-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">2. Automated Appointment Reminders</h3>
                        <p className="text-gray-600 mb-3">
                          Keep patients engaged with timely reminders and follow-up communications.
                        </p>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          <li>Send SMS reminders 24-48 hours before appointments</li>
                          <li>Use email for detailed appointment confirmations</li>
                          <li>Implement automated follow-up after treatments</li>
                          <li>Send preventive care reminders based on treatment history</li>
                        </ul>
                      </div>

                      {/* Strategy 3 */}
                      <div className="border-l-4 border-purple-500 pl-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">3. Personalized Patient Care</h3>
                        <p className="text-gray-600 mb-3">
                          Make each patient feel valued with personalized care and attention to their specific needs.
                        </p>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          <li>Remember patient preferences and concerns</li>
                          <li>Customize treatment plans to individual needs</li>
                          <li>Follow up on specific health concerns</li>
                          <li>Provide educational materials tailored to their conditions</li>
                        </ul>
                      </div>

                      {/* Strategy 4 */}
                      <div className="border-l-4 border-orange-500 pl-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">4. Exceptional Customer Service</h3>
                        <p className="text-gray-600 mb-3">
                          Outstanding service creates emotional connections that keep patients coming back.
                        </p>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          <li>Train staff in customer service excellence</li>
                          <li>Minimize wait times and appointment delays</li>
                          <li>Create a welcoming, comfortable environment</li>
                          <li>Address complaints promptly and professionally</li>
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
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Implementation Framework</h2>
                    
                    <div className="space-y-4">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 font-semibold text-sm">1</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">Assess Current Retention</h3>
                          <p className="text-gray-600">Analyze your current patient retention rates and identify areas for improvement.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-sm">2</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">Choose Your Strategies</h3>
                          <p className="text-gray-600">Select 2-3 retention strategies that align with your practice&apos;s capabilities and patient base.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-purple-600 font-semibold text-sm">3</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">Implement Gradually</h3>
                          <p className="text-gray-600">Roll out new programs gradually to ensure smooth implementation and staff buy-in.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                          <span className="text-orange-600 font-semibold text-sm">4</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">Measure and Optimize</h3>
                          <p className="text-gray-600">Track retention metrics and adjust strategies based on patient feedback and results.</p>
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
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Start Building Patient Loyalty Today</h2>
                    <p className="text-gray-600 mb-6">
                      Implement these retention strategies to create lasting relationships with your patients and grow your practice.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <a 
                        href="/business-growth" 
                        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
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
