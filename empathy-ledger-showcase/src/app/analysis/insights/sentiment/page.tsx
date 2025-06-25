import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Heart, Brain, Lightbulb, TrendingUp, Users, Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Emotional Insights | Empathy Ledger',
  description: 'Understanding emotional patterns and creating positive impact',
}

export default function EmotionalInsightsPage() {
  const emotionalPatterns = [
    {
      emotion: 'Hope',
      percentage: 76,
      insight: 'Stories of resilience and future aspirations dominate positive sentiments',
      actionItems: [
        'Highlight success stories in communications',
        'Create pathways for goal achievement',
        'Connect storytellers with resources for their aspirations'
      ]
    },
    {
      emotion: 'Gratitude',
      percentage: 68,
      insight: 'Deep appreciation for human connection and support services',
      actionItems: [
        'Amplify volunteer recognition programs',
        'Share gratitude stories with donors',
        'Create reciprocal support opportunities'
      ]
    },
    {
      emotion: 'Belonging',
      percentage: 54,
      insight: 'Strong desire for community connection and acceptance',
      actionItems: [
        'Expand community gathering spaces',
        'Facilitate peer support groups',
        'Create inclusive event programming'
      ]
    },
    {
      emotion: 'Frustration',
      percentage: 32,
      insight: 'Mainly related to systemic barriers and bureaucracy',
      actionItems: [
        'Advocate for policy changes',
        'Simplify service access processes',
        'Provide navigation support'
      ]
    }
  ]

  const roleInsights = [
    {
      role: 'Volunteers',
      primaryEmotions: ['Fulfillment', 'Purpose', 'Connection'],
      keyInsight: 'Volunteers find deep meaning in conversations and relationships formed',
      recommendations: [
        'Provide more storytelling training',
        'Create volunteer appreciation events',
        'Share impact stories with volunteer community'
      ]
    },
    {
      role: 'Friends',
      primaryEmotions: ['Hope', 'Gratitude', 'Dignity'],
      keyInsight: 'Friends value being seen as whole people, not just their circumstances',
      recommendations: [
        'Train volunteers in strengths-based conversations',
        'Create opportunities for friends to give back',
        'Celebrate individual achievements and milestones'
      ]
    },
    {
      role: 'Service Providers',
      primaryEmotions: ['Compassion', 'Concern', 'Optimism'],
      keyInsight: 'Providers see potential but worry about systemic limitations',
      recommendations: [
        'Foster cross-organization collaboration',
        'Share success metrics and positive outcomes',
        'Create professional development opportunities'
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/analysis"
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Emotional Insights</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Introduction */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Heart className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Understanding the Emotional Landscape
              </h2>
              <p className="text-gray-600 mb-4">
                Analysis of 102 stories reveals powerful emotional patterns that guide us toward 
                creating more meaningful connections and positive experiences. These insights help 
                shape programs, train volunteers, and advocate for systemic change.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-3xl font-bold text-blue-600 mb-1">84%</p>
                  <p className="text-sm text-gray-600">Stories contain positive emotions</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-3xl font-bold text-green-600 mb-1">3.2x</p>
                  <p className="text-sm text-gray-600">More hope than despair expressed</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-3xl font-bold text-purple-600 mb-1">92%</p>
                  <p className="text-sm text-gray-600">Value human connection most</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Emotional Patterns */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            Dominant Emotional Patterns
          </h3>
          <div className="space-y-6">
            {emotionalPatterns.map((pattern) => (
              <div key={pattern.emotion} className="border-l-4 border-blue-500 pl-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{pattern.emotion}</h4>
                  <span className="text-2xl font-bold text-blue-600">{pattern.percentage}%</span>
                </div>
                <p className="text-gray-600 mb-3">{pattern.insight}</p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Action Items:</p>
                  <ul className="space-y-1">
                    {pattern.actionItems.map((item, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-blue-500 mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Role-Based Insights */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-green-600" />
            Insights by Storyteller Type
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roleInsights.map((role) => (
              <div key={role.role} className="border rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">{role.role}</h4>
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-2">Primary Emotions:</p>
                  <div className="flex flex-wrap gap-2">
                    {role.primaryEmotions.map(emotion => (
                      <span key={emotion} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                        {emotion}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4 italic">"{role.keyInsight}"</p>
                <div className="border-t pt-4">
                  <p className="text-xs font-semibold text-gray-700 mb-2">Recommendations:</p>
                  <ul className="space-y-1">
                    {role.recommendations.map((rec, index) => (
                      <li key={index} className="text-xs text-gray-600">• {rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emotional Journey Map */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-orange-600" />
            Emotional Journey Insights
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-24 text-sm font-medium text-gray-700">First Contact</div>
              <div className="flex-1 bg-gradient-to-r from-gray-200 to-blue-200 h-12 rounded-lg flex items-center px-4">
                <span className="text-sm font-medium">Anxiety → Curiosity</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-24 text-sm font-medium text-gray-700">During Service</div>
              <div className="flex-1 bg-gradient-to-r from-blue-200 to-green-200 h-12 rounded-lg flex items-center px-4">
                <span className="text-sm font-medium">Relief → Connection</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-24 text-sm font-medium text-gray-700">After Service</div>
              <div className="flex-1 bg-gradient-to-r from-green-200 to-purple-200 h-12 rounded-lg flex items-center px-4">
                <span className="text-sm font-medium">Gratitude → Hope</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-24 text-sm font-medium text-gray-700">Long Term</div>
              <div className="flex-1 bg-gradient-to-r from-purple-200 to-yellow-200 h-12 rounded-lg flex items-center px-4">
                <span className="text-sm font-medium">Belonging → Empowerment</span>
              </div>
            </div>
          </div>
        </div>

        {/* Key Recommendations */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
            Key Recommendations for Emotional Impact
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Program Design</h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-600 mt-0.5" />
                  <span className="text-sm text-gray-700">Create structured opportunities for storytelling during every shift</span>
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-600 mt-0.5" />
                  <span className="text-sm text-gray-700">Implement peer mentorship programs leveraging hope narratives</span>
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-600 mt-0.5" />
                  <span className="text-sm text-gray-700">Design services that foster reciprocal support and giving back</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Volunteer Training</h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-600 mt-0.5" />
                  <span className="text-sm text-gray-700">Teach active listening techniques that validate emotions</span>
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-600 mt-0.5" />
                  <span className="text-sm text-gray-700">Focus on strengths-based conversations that build dignity</span>
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-600 mt-0.5" />
                  <span className="text-sm text-gray-700">Share emotional insights to improve volunteer preparedness</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Transform Insights into Action
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            These emotional insights provide a roadmap for creating more meaningful connections 
            and positive experiences. Use this data to guide program development, volunteer training, 
            and advocacy efforts.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/analysis"
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Back to Analysis
            </Link>
            <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Download Full Report
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}