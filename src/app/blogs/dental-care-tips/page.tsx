import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Essential Dental Care Tips for Your Patients',
  description: 'Proven strategies to educate your patients about proper oral hygiene and preventive care.',
};

export default function DentalCareTipsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <a 
          href="/blogs" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Blogs
        </a>

        {/* Article Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-center mb-4">
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
              Dental Care Tips
            </span>
            <span className="text-gray-500 text-sm ml-4">5 min read</span>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Essential Dental Care Tips for Your Patients
          </h1>
          
          <p className="text-xl text-gray-600 mb-6">
            Discover proven strategies to educate your patients about proper oral hygiene 
            and preventive care that can reduce treatment needs and improve satisfaction.
          </p>
          
          <div className="flex items-center text-gray-500 text-sm">
            <span>Published on December 15, 2024</span>
          </div>
        </div>

        {/* Article Content */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">The Foundation of Good Oral Health</h2>
            
            <p className="text-gray-700 mb-6">
              As dental professionals, we know that prevention is always better than cure. 
              Educating your patients about proper oral hygiene is one of the most valuable 
              services you can provide. Here are essential tips to share with your patients 
              for maintaining optimal oral health.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Proper Brushing Technique</h3>
            <p className="text-gray-700 mb-4">
              Many patients think they know how to brush, but technique matters more than duration. 
              Teach your patients to:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Use a soft-bristled toothbrush to avoid damaging enamel</li>
              <li>Hold the brush at a 45-degree angle to the gum line</li>
              <li>Use gentle, circular motions rather than aggressive scrubbing</li>
              <li>Brush for a full 2 minutes, covering all surfaces</li>
              <li>Replace toothbrushes every 3-4 months</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">2. The Importance of Flossing</h3>
            <p className="text-gray-700 mb-4">
              Flossing removes plaque and food particles that brushing alone cannot reach. 
              Encourage patients to:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Floss at least once daily, preferably before bedtime</li>
              <li>Use 18 inches of floss, winding most around middle fingers</li>
              <li>Gently guide floss between teeth using a sawing motion</li>
              <li>Curve floss around each tooth in a C-shape</li>
              <li>Consider water flossers for patients with dexterity issues</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">3. Choosing the Right Products</h3>
            <p className="text-gray-700 mb-4">
              Not all dental products are created equal. Help patients select:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Fluoride toothpaste with ADA seal of acceptance</li>
              <li>Antimicrobial mouthwash for additional protection</li>
              <li>Electric toothbrushes for more effective cleaning</li>
              <li>Interdental brushes for patients with larger gaps</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">4. Dietary Considerations</h3>
            <p className="text-gray-700 mb-4">
              What patients eat significantly impacts their oral health:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Limit sugary and acidic foods and beverages</li>
              <li>Encourage water consumption throughout the day</li>
              <li>Promote calcium-rich foods for strong teeth</li>
              <li>Suggest crunchy fruits and vegetables for natural cleaning</li>
              <li>Advise against frequent snacking between meals</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">5. Regular Professional Care</h3>
            <p className="text-gray-700 mb-4">
              Emphasize the importance of regular dental visits:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Schedule cleanings every 6 months (or as recommended)</li>
              <li>Don&apos;t wait for pain to seek dental care</li>
              <li>Discuss any concerns or changes in oral health</li>
              <li>Follow through with recommended treatments</li>
            </ul>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 my-8">
              <h4 className="text-lg font-semibold text-blue-900 mb-2">Pro Tip for Dental Practices</h4>
              <p className="text-blue-800">
                Create educational materials and videos demonstrating proper techniques. 
                Many patients are visual learners and benefit from seeing demonstrations 
                rather than just hearing instructions.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Implementing Patient Education</h2>
            
            <p className="text-gray-700 mb-6">
              Effective patient education requires consistency and reinforcement. Consider 
              implementing these strategies in your practice:
            </p>

            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Use models and visual aids during consultations</li>
              <li>Provide take-home educational materials</li>
              <li>Follow up with patients to reinforce good habits</li>
              <li>Celebrate improvements in oral health</li>
              <li>Address barriers to good oral hygiene</li>
            </ul>

            <p className="text-gray-700 mb-6">
              Remember, patient education is an investment in both your patients&apos; health 
              and your practice&apos;s success. Well-informed patients are more likely to 
              maintain regular appointments and follow treatment recommendations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
