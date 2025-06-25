import Link from 'next/link'
import { ArrowLeft, Clock, CheckCircle, Users, Heart, TrendingUp } from 'lucide-react'

export default function JourneyInsightsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/analysis"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Analysis
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Journey Map Insights & Actions
          </h1>
          <p className="text-xl text-gray-600">
            Supporting participants at every stage of their Orange Sky journey
          </p>
        </div>
      </section>

      {/* Journey Overview */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">The Orange Sky Journey</h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-sky font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">First Contact (100% participation)</h3>
                  <p className="text-gray-600">
                    Initial awareness through word-of-mouth, service providers, or direct outreach. 
                    Critical moment for building trust and setting expectations.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-sky font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Building Trust (80% retention)</h3>
                  <p className="text-gray-600">
                    Regular engagement begins. Relationships form through consistent, non-judgmental support. 
                    20% drop-off typically due to transient circumstances.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-sky font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Personal Growth (60% reach this stage)</h3>
                  <p className="text-gray-600">
                    Participants experience positive changes: improved self-worth, new perspectives, 
                    and stronger social connections. Major transformation point.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-sky font-bold">4</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Giving Back (30% reach this stage)</h3>
                  <p className="text-gray-600">
                    Some participants become advocates, volunteers, or peer supporters. 
                    Full circle moment demonstrating program impact.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stage-Specific Actions */}
          <div className="space-y-8">
            {/* First Contact Stage */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-8 h-8 text-blue-500" />
                <h2 className="text-2xl font-bold text-gray-900">Stage 1: First Contact Actions</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">For Volunteers</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      Warm, genuine greeting without assumptions
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      Explain services simply and without pressure
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      Focus on conversation, not just service delivery
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      Remember: "You never get a second chance at a first impression"
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">For Service Providers</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      Include Orange Sky in client resource lists
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      Provide warm handoffs, not just referrals
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      Educate clients on what to expect
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      Follow up to ensure connection was made
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Trust Building Stage */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="w-8 h-8 text-red-500" />
                <h2 className="text-2xl font-bold text-gray-900">Stage 2: Building Trust Actions</h2>
              </div>
              
              <div className="bg-red-50 p-6 rounded-lg mb-4">
                <h3 className="font-semibold text-gray-900 mb-2">Critical Success Factors</h3>
                <p className="text-gray-600 mb-3">
                  80% of participants who reach this stage continue their journey. Key factors:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Consistency of volunteer presence</li>
                    <li>• Non-judgmental atmosphere</li>
                    <li>• Remembering names and stories</li>
                  </ul>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Respecting boundaries</li>
                    <li>• Celebrating small victories</li>
                    <li>• Creating safe spaces for sharing</li>
                  </ul>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Volunteer Checklist</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>□ Greet by name</li>
                    <li>□ Ask follow-up questions from last visit</li>
                    <li>□ Share appropriate personal stories</li>
                    <li>□ Respect "bad days" without judgment</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Program Design</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>□ Consistent shift schedules</li>
                    <li>□ Volunteer continuity plans</li>
                    <li>□ Trust-building training modules</li>
                    <li>□ Feedback mechanisms</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Growth & Transformation Stage */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-8 h-8 text-green-500" />
                <h2 className="text-2xl font-bold text-gray-900">Stage 3: Supporting Transformation</h2>
              </div>
              
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Recognizing Growth Moments</h3>
                  <p className="text-gray-600 mb-3">
                    Transformation happens gradually. Watch for these indicators:
                  </p>
                  <ul className="grid md:grid-cols-2 gap-2 text-sm text-gray-600">
                    <li>• Increased self-care behaviors</li>
                    <li>• More positive self-talk</li>
                    <li>• Helping other friends</li>
                    <li>• Making future plans</li>
                    <li>• Sharing personal victories</li>
                    <li>• Increased social connections</li>
                  </ul>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Supporting Without Pushing</h3>
                  <p className="text-gray-600">
                    Create opportunities for growth while respecting individual pace. Offer connections 
                    to additional resources, celebrate progress without making it conditional, and 
                    maintain consistent support regardless of setbacks.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Implementation Guide */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-8 mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Implementation Guide</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">For Orange Sky Leadership</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Map current participant journeys to identify drop-off points</li>
                  <li>• Develop stage-specific support strategies</li>
                  <li>• Train volunteers on journey awareness</li>
                  <li>• Create metrics for each journey stage</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">For Donors</h3>
                <p className="text-sm text-gray-700">
                  Consider funding journey-based programs that support participants through all stages, 
                  particularly the critical trust-building phase where 20% of participants are lost.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}