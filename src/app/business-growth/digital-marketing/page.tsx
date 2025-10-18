import type { Metadata } from "next";
import { Sidebar } from "@/components/Sidebar";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export const metadata: Metadata = {
  title: "Digital Marketing Strategies for Dental Practices",
  description: "Comprehensive digital marketing strategies to grow your dental practice, attract new patients, and build a strong online presence.",
  keywords: ["dental digital marketing", "social media marketing", "SEO for dentists", "online presence", "patient acquisition"],
};

export default function DigitalMarketingPage() {
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
                    Digital Marketing Strategies
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600 mt-1">
                    Grow your dental practice with proven digital marketing techniques
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
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Why Digital Marketing Matters for Your Practice</h2>
                    <p className="text-gray-600 mb-4">
                      In today&apos;s digital age, patients are increasingly turning to the internet to find and research dental practices. 
                      A strong digital marketing strategy can help you reach more potential patients, build trust, and grow your practice.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600 mb-2">73%</div>
                        <div className="text-sm text-gray-600">of patients research online before choosing a dentist</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600 mb-2">40%</div>
                        <div className="text-sm text-gray-600">average increase in new patients with digital marketing</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600 mb-2">85%</div>
                        <div className="text-sm text-gray-600">of patients trust online reviews</div>
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
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Essential Digital Marketing Strategies</h2>
                    
                    <div className="space-y-6">
                      {/* Strategy 1 */}
                      <div className="border-l-4 border-blue-500 pl-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">1. Google My Business Optimization</h3>
                        <p className="text-gray-600 mb-3">
                          Your Google My Business profile is often the first thing patients see when searching for dental services. 
                          Optimize it to improve your local search visibility.
                        </p>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          <li>Complete all profile information with accurate details</li>
                          <li>Upload high-quality photos of your practice</li>
                          <li>Encourage patients to leave reviews</li>
                          <li>Post regular updates about services and promotions</li>
                        </ul>
                      </div>

                      {/* Strategy 2 */}
                      <div className="border-l-4 border-green-500 pl-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">2. Social Media Marketing</h3>
                        <p className="text-gray-600 mb-3">
                          Social media platforms offer excellent opportunities to connect with patients and showcase your practice&apos;s personality.
                        </p>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          <li>Share educational content about oral health</li>
                          <li>Post before and after photos (with permission)</li>
                          <li>Engage with patient comments and messages</li>
                          <li>Run targeted ads to reach local audiences</li>
                        </ul>
                      </div>

                      {/* Strategy 3 */}
                      <div className="border-l-4 border-purple-500 pl-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">3. Email Marketing Campaigns</h3>
                        <p className="text-gray-600 mb-3">
                          Email marketing remains one of the most effective ways to nurture patient relationships and encourage repeat visits.
                        </p>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          <li>Send appointment reminders and confirmations</li>
                          <li>Share oral health tips and practice news</li>
                          <li>Promote special offers and new services</li>
                          <li>Follow up after treatments with care instructions</li>
                        </ul>
                      </div>

                      {/* Strategy 4 */}
                      <div className="border-l-4 border-orange-500 pl-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">4. Search Engine Optimization (SEO)</h3>
                        <p className="text-gray-600 mb-3">
                          SEO helps your practice website rank higher in search results, making it easier for patients to find you.
                        </p>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          <li>Optimize website content with relevant keywords</li>
                          <li>Create location-specific landing pages</li>
                          <li>Build quality backlinks from local directories</li>
                          <li>Ensure your website is mobile-friendly</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Implementation Tips */}
                <section className="mb-8 rounded-[4px] bg-[#ffffff] box-border overflow-hidden relative">
                  <div className="absolute inset-0 rounded-[4px] bg-gradient-to-r from-[#A78BFA] via-[#C4B5FD] via-[#E9D5FF] to-[#A78BFA] p-[1px] animate-gradient-x">
                    <div className="w-full h-full rounded-[3px] bg-[#ffffff]"></div>
                  </div>
                  <div className="relative z-10 p-6 lg:p-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Implementation Tips</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Start Small</h3>
                        <p className="text-gray-600">
                          Begin with one or two platforms and master them before expanding. Focus on quality over quantity.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Track Your Results</h3>
                        <p className="text-gray-600">
                          Use analytics tools to measure the effectiveness of your campaigns and adjust strategies accordingly.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Be Consistent</h3>
                        <p className="text-gray-600">
                          Regular posting and engagement are key to building a strong online presence and patient following.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Engage Authentically</h3>
                        <p className="text-gray-600">
                          Respond to comments and messages promptly. Show your practice&apos;s personality and values.
                        </p>
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
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Ready to Grow Your Practice?</h2>
                    <p className="text-gray-600 mb-6">
                      Start implementing these digital marketing strategies today to attract more patients and grow your practice.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <a 
                        href="/business-growth" 
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
