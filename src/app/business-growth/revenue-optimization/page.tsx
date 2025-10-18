import type { Metadata } from "next";
import { Sidebar } from "@/components/Sidebar";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export const metadata: Metadata = {
  title: "Revenue Optimization Strategies for Dental Practices",
  description: "Proven strategies to maximize your dental practice&apos;s earning potential through premium services, pricing optimization, and operational efficiency.",
  keywords: ["dental revenue optimization", "practice profitability", "premium services", "pricing strategies"],
};

export default function RevenueOptimizationPage() {
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
                    Revenue Optimization Strategies
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600 mt-1">
                    Maximize your practice&apos;s earning potential with proven revenue optimization techniques
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
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Maximize Your Practice Revenue</h2>
                    <p className="text-gray-600 mb-4">
                      Revenue optimization isn&apos;t just about increasing prices—it&apos;s about creating value for patients 
                      while maximizing your practice&apos;s earning potential through strategic service offerings and operational efficiency.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                      <div className="text-center p-4 bg-amber-50 rounded-lg">
                        <div className="text-2xl font-bold text-amber-600 mb-2">35%</div>
                        <div className="text-sm text-gray-600">average revenue increase with premium services</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600 mb-2">60%</div>
                        <div className="text-sm text-gray-600">of practices see growth with payment plans</div>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600 mb-2">25%</div>
                        <div className="text-sm text-gray-600">revenue boost from optimized scheduling</div>
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
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Revenue Optimization Strategies</h2>
                    
                    <div className="space-y-6">
                      {/* Strategy 1 */}
                      <div className="border-l-4 border-amber-500 pl-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">1. Premium Service Offerings</h3>
                        <p className="text-gray-600 mb-3">
                          Add high-value services that patients are willing to pay premium prices for, creating new revenue streams.
                        </p>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          <li>Cosmetic dentistry procedures (whitening, veneers)</li>
                          <li>Orthodontic treatments (Invisalign, clear aligners)</li>
                          <li>Dental implants and advanced restorative work</li>
                          <li>Specialized treatments (TMJ therapy, sleep apnea)</li>
                        </ul>
                      </div>

                      {/* Strategy 2 */}
                      <div className="border-l-4 border-green-500 pl-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">2. Flexible Payment Plans</h3>
                        <p className="text-gray-600 mb-3">
                          Make expensive treatments accessible to more patients by offering flexible payment options.
                        </p>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          <li>In-house payment plans for major treatments</li>
                          <li>Third-party financing partnerships</li>
                          <li>Membership plans for preventive care</li>
                          <li>Package deals for multiple procedures</li>
                        </ul>
                      </div>

                      {/* Strategy 3 */}
                      <div className="border-l-4 border-blue-500 pl-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">3. Optimize Appointment Scheduling</h3>
                        <p className="text-gray-600 mb-3">
                          Maximize your practice&apos;s capacity and revenue by optimizing how appointments are scheduled.
                        </p>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          <li>Block scheduling for high-value procedures</li>
                          <li>Minimize gaps between appointments</li>
                          <li>Offer extended hours for busy patients</li>
                          <li>Implement same-day emergency slots</li>
                        </ul>
                      </div>

                      {/* Strategy 4 */}
                      <div className="border-l-4 border-purple-500 pl-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">4. Upselling and Cross-selling</h3>
                        <p className="text-gray-600 mb-3">
                          Increase the value of each patient visit by offering complementary services and treatments.
                        </p>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          <li>Suggest preventive treatments during check-ups</li>
                          <li>Offer cosmetic enhancements after restorative work</li>
                          <li>Recommend oral health products</li>
                          <li>Propose comprehensive treatment plans</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Pricing Strategies */}
                <section className="mb-8 rounded-[4px] bg-[#ffffff] box-border overflow-hidden relative">
                  <div className="absolute inset-0 rounded-[4px] bg-gradient-to-r from-[#A78BFA] via-[#C4B5FD] via-[#E9D5FF] to-[#A78BFA] p-[1px] animate-gradient-x">
                    <div className="w-full h-full rounded-[3px] bg-[#ffffff]"></div>
                  </div>
                  <div className="relative z-10 p-6 lg:p-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Smart Pricing Strategies</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Value-Based Pricing</h3>
                        <p className="text-gray-600 mb-3">
                          Price services based on the value they provide to patients, not just the cost of materials and time.
                        </p>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Focus on outcomes and patient satisfaction</li>
                          <li>• Highlight long-term benefits and savings</li>
                          <li>• Position premium services as investments</li>
                        </ul>
                      </div>
                      
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Tiered Service Packages</h3>
                        <p className="text-gray-600 mb-3">
                          Create different service levels to appeal to various patient segments and budgets.
                        </p>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Basic, standard, and premium options</li>
                          <li>• Clear value propositions for each tier</li>
                          <li>• Easy upgrade paths for patients</li>
                        </ul>
                      </div>
                      
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Bundle Pricing</h3>
                        <p className="text-gray-600 mb-3">
                          Offer package deals that provide value to patients while increasing your average transaction value.
                        </p>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Combine related treatments</li>
                          <li>• Offer family packages</li>
                          <li>• Create maintenance plans</li>
                        </ul>
                      </div>
                      
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Dynamic Pricing</h3>
                        <p className="text-gray-600 mb-3">
                          Adjust pricing based on demand, seasonality, and practice capacity to maximize revenue.
                        </p>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Peak and off-peak pricing</li>
                          <li>• Seasonal promotions</li>
                          <li>• Capacity-based adjustments</li>
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
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Start Optimizing Your Revenue Today</h2>
                    <p className="text-gray-600 mb-6">
                      Implement these revenue optimization strategies to maximize your practice&apos;s earning potential and provide better value to patients.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <a 
                        href="/business-growth" 
                        className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
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
