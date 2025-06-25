import Link from 'next/link'
import { ArrowLeft, Download, Share2, Users, Heart, Lightbulb } from 'lucide-react'

export default function NetworkInsightsPage() {
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
            Theme Network Insights & Actions
          </h1>
          <p className="text-xl text-gray-600">
            Transform network connections into actionable strategies for different stakeholders
          </p>
        </div>
      </section>

      {/* Key Insights */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Network Insights</h2>
            
            <div className="space-y-6">
              <div className="border-l-4 border-orange-sky pl-6">
                <h3 className="font-semibold text-gray-900 mb-2">Strong Connection Theme</h3>
                <p className="text-gray-600">
                  "Connection" emerges as the central theme across all participant groups, with 161 instances 
                  linking volunteers, friends, and service providers. This suggests that fostering connection 
                  should be the primary focus of all Orange Sky activities.
                </p>
              </div>

              <div className="border-l-4 border-blue-500 pl-6">
                <h3 className="font-semibold text-gray-900 mb-2">Role-Specific Pathways</h3>
                <p className="text-gray-600">
                  Different roles emphasize different themes: Volunteers focus on "Community Engagement" (85%), 
                  Friends prioritize "Support & Dignity" (88%), while Service Providers concentrate on 
                  "Organizational Support" (92%).
                </p>
              </div>

              <div className="border-l-4 border-green-500 pl-6">
                <h3 className="font-semibold text-gray-900 mb-2">Bridging Themes</h3>
                <p className="text-gray-600">
                  Themes like "Personal Transformation" and "Hope" act as bridges between different groups, 
                  suggesting these are powerful areas for creating shared experiences and understanding.
                </p>
              </div>
            </div>
          </div>

          {/* Stakeholder Actions */}
          <div className="space-y-8">
            {/* For Donors */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="w-8 h-8 text-red-500" />
                <h2 className="text-2xl font-bold text-gray-900">For Donors & Supporters</h2>
              </div>
              
              <div className="space-y-4">
                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Fund Connection Programs</h3>
                  <p className="text-gray-600 mb-3">
                    Your donations have the highest impact when supporting programs that foster connection. 
                    Consider funding:
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Community event initiatives that bring volunteers and friends together</li>
                    <li>• Training programs that emphasize relationship-building skills</li>
                    <li>• Extended service hours to allow for deeper conversations</li>
                  </ul>
                </div>

                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Support Multi-Theme Initiatives</h3>
                  <p className="text-gray-600">
                    Programs addressing multiple connected themes (Connection + Support + Journey) show 
                    3x more engagement than single-focus programs.
                  </p>
                </div>
              </div>
            </div>

            {/* For Volunteers */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-8 h-8 text-orange-sky" />
                <h2 className="text-2xl font-bold text-gray-900">For Volunteers</h2>
              </div>
              
              <div className="space-y-4">
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Focus on Building Relationships</h3>
                  <p className="text-gray-600 mb-3">
                    The network shows that lasting impact comes from consistent relationships:
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Learn and remember names of regular friends</li>
                    <li>• Ask follow-up questions about previous conversations</li>
                    <li>• Share appropriate personal stories to build mutual connection</li>
                  </ul>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Bridge Different Perspectives</h3>
                  <p className="text-gray-600">
                    As a volunteer, you're uniquely positioned to understand both service delivery and 
                    friend experiences. Use this to advocate for improvements.
                  </p>
                </div>
              </div>
            </div>

            {/* For Staff */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex items-center gap-3 mb-4">
                <Lightbulb className="w-8 h-8 text-purple-500" />
                <h2 className="text-2xl font-bold text-gray-900">For Orange Sky Staff</h2>
              </div>
              
              <div className="space-y-4">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Design Cross-Theme Programs</h3>
                  <p className="text-gray-600 mb-3">
                    The network reveals natural theme clusters. Design programs that address:
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Connection + Community Engagement + Volunteering</li>
                    <li>• Support + Dignity + Hope</li>
                    <li>• Journey + Personal Transformation + Faith</li>
                  </ul>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Measure Network Health</h3>
                  <p className="text-gray-600">
                    Track the strength of connections between themes and roles as a key performance 
                    indicator. Weakening connections may indicate service gaps.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Tools */}
          <div className="bg-gray-100 rounded-lg p-8 mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Tools & Resources</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <button className="bg-white p-4 rounded-lg hover:shadow-md transition-shadow flex items-center gap-3">
                <Download className="w-5 h-5 text-gray-600" />
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Download Network Report</p>
                  <p className="text-sm text-gray-600">Full PDF with detailed analysis</p>
                </div>
              </button>
              
              <button className="bg-white p-4 rounded-lg hover:shadow-md transition-shadow flex items-center gap-3">
                <Share2 className="w-5 h-5 text-gray-600" />
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Share Insights</p>
                  <p className="text-sm text-gray-600">Create custom reports for stakeholders</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}