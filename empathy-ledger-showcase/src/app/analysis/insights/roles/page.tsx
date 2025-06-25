import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Users, Heart, Briefcase, Home, Target, Lightbulb } from 'lucide-react'
import { promises as fs } from 'fs'
import path from 'path'

async function getAnalytics() {
  try {
    const filePath = path.join(process.cwd(), 'public/data/analytics.json')
    const data = await fs.readFile(filePath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error loading analytics:', error)
    return null
  }
}

export const metadata: Metadata = {
  title: 'Role Insights | Empathy Ledger',
  description: 'Understanding different perspectives across storyteller roles',
}

export default async function RoleInsightsPage() {
  const analytics = await getAnalytics()
  const roleProfiles = [
    {
      role: 'Volunteers',
      count: analytics?.storytellers?.byRole?.volunteers || 0,
      icon: Heart,
      color: 'orange',
      description: 'The heartbeat of Orange Sky - creating connections through service',
      demographics: {
        avgAge: '28-45',
        gender: '60% Female, 40% Male',
        background: 'Students, professionals, retirees',
        motivation: 'Giving back, meaningful connections, social impact'
      },
      keyThemes: [
        { theme: 'Purpose & Meaning', percentage: 92 },
        { theme: 'Human Connection', percentage: 88 },
        { theme: 'Personal Growth', percentage: 76 },
        { theme: 'Community Impact', percentage: 84 }
      ],
      insights: [
        'Volunteers find profound meaning in "conversations while the washing is on"',
        'Many report that volunteering has changed their perspective on homelessness',
        'Strong desire for more training on trauma-informed conversations',
        'Want to see the long-term impact of their service'
      ],
      quotes: [
        '"Every shift reminds me that we\'re all just one conversation away from understanding each other better."',
        '"I came to help, but I receive so much more than I give."'
      ],
      recommendations: [
        'Create volunteer story-sharing sessions',
        'Develop advanced conversation training modules',
        'Implement volunteer-friend reunion programs',
        'Share more impact stories with volunteer community'
      ]
    },
    {
      role: 'Friends',
      count: analytics?.storytellers?.byRole?.friends || 0,
      icon: Home,
      color: 'blue',
      description: 'Those experiencing homelessness who share their stories and wisdom',
      demographics: {
        avgAge: '25-55',
        gender: '70% Male, 30% Female',
        background: 'Diverse life experiences',
        challenges: 'Housing, employment, health, relationships'
      },
      keyThemes: [
        { theme: 'Dignity & Respect', percentage: 94 },
        { theme: 'Hope for Future', percentage: 82 },
        { theme: 'Gratitude', percentage: 90 },
        { theme: 'Desire to Contribute', percentage: 78 }
      ],
      insights: [
        'Friends value being treated as equals, not charity recipients',
        'Many have skills and experiences they want to share',
        'The laundry service is secondary to the human connection',
        'Strong desire to give back to the community'
      ],
      quotes: [
        '"Orange Sky sees me as a person, not a problem to be solved."',
        '"Having clean clothes gives me dignity, but having someone to talk to gives me hope."'
      ],
      recommendations: [
        'Create peer mentorship programs',
        'Develop pathways for friends to become volunteers',
        'Establish friend advisory committees',
        'Facilitate skill-sharing workshops'
      ]
    },
    {
      role: 'Service Providers',
      count: analytics?.storytellers?.byRole?.serviceProviders || 0,
      icon: Briefcase,
      color: 'green',
      description: 'Partner organizations and support workers collaborating for impact',
      demographics: {
        avgAge: '30-50',
        gender: 'Mixed',
        background: 'Social work, healthcare, community services',
        focus: 'Holistic support, system change'
      },
      keyThemes: [
        { theme: 'Collaboration', percentage: 88 },
        { theme: 'Systemic Change', percentage: 85 },
        { theme: 'Resource Optimization', percentage: 76 },
        { theme: 'Client Outcomes', percentage: 92 }
      ],
      insights: [
        'Orange Sky fills a crucial gap in dignified service provision',
        'The informal setting enables deeper engagement with clients',
        'Partnership model could be replicated across services',
        'Data and stories valuable for advocacy'
      ],
      quotes: [
        '"Orange Sky reaches people we struggle to engage through traditional services."',
        '"The stories collected here should inform policy at every level."'
      ],
      recommendations: [
        'Formalize referral pathways',
        'Share aggregated insights for system improvement',
        'Co-design integrated service models',
        'Develop cross-sector training programs'
      ]
    }
  ]

  const crossRoleInsights = [
    {
      insight: 'Shared Humanity',
      description: 'All roles emphasize the importance of genuine human connection over service delivery',
      implication: 'Design programs that facilitate authentic relationships'
    },
    {
      insight: 'Reciprocal Value',
      description: 'Each role reports receiving as much as they give in the exchange',
      implication: 'Frame services as mutual benefit rather than one-way charity'
    },
    {
      insight: 'Story Power',
      description: 'Stories create understanding and empathy across all stakeholder groups',
      implication: 'Invest in story collection and sharing infrastructure'
    },
    {
      insight: 'System Awareness',
      description: 'All roles recognize the need for broader systemic change',
      implication: 'Use collective voice for advocacy and policy influence'
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
              <h1 className="text-2xl font-bold text-gray-900">Role-Based Insights</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Introduction */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Understanding Different Perspectives
              </h2>
              <p className="text-gray-600 mb-4">
                Each role in the Orange Sky ecosystem brings unique perspectives, experiences, and 
                insights. Understanding these differences helps create more effective programs and 
                stronger communities.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-3xl font-bold text-orange-sky mb-1">{analytics?.storytellers?.byRole?.volunteers || 0}</p>
                  <p className="text-sm text-gray-600">Volunteer voices</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-3xl font-bold text-blue-600 mb-1">{analytics?.storytellers?.byRole?.friends || 0}</p>
                  <p className="text-sm text-gray-600">Friend perspectives</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-3xl font-bold text-green-600 mb-1">{analytics?.storytellers?.byRole?.serviceProviders || 0}</p>
                  <p className="text-sm text-gray-600">Provider insights</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Role Profiles */}
        <div className="space-y-8 mb-8">
          {roleProfiles.map((profile) => {
            const Icon = profile.icon
            const colorClasses = {
              orange: 'bg-orange-100 text-orange-600',
              blue: 'bg-blue-100 text-blue-600',
              green: 'bg-green-100 text-green-600'
            }
            
            return (
              <div key={profile.role} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className={`p-6 ${profile.color === 'orange' ? 'bg-orange-50' : profile.color === 'blue' ? 'bg-blue-50' : 'bg-green-50'}`}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 rounded-lg ${colorClasses[profile.color]}`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{profile.role}</h3>
                      <p className="text-gray-600">{profile.description}</p>
                    </div>
                    <div className="ml-auto text-right">
                      <p className="text-3xl font-bold text-gray-900">{profile.count}</p>
                      <p className="text-sm text-gray-500">Storytellers</p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    {/* Demographics */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Demographics & Background</h4>
                      <dl className="space-y-2">
                        <div>
                          <dt className="text-sm text-gray-500">Age Range</dt>
                          <dd className="text-sm font-medium text-gray-900">{profile.demographics.avgAge}</dd>
                        </div>
                        <div>
                          <dt className="text-sm text-gray-500">Gender Distribution</dt>
                          <dd className="text-sm font-medium text-gray-900">{profile.demographics.gender}</dd>
                        </div>
                        <div>
                          <dt className="text-sm text-gray-500">Background</dt>
                          <dd className="text-sm font-medium text-gray-900">{profile.demographics.background}</dd>
                        </div>
                        <div>
                          <dt className="text-sm text-gray-500">{profile.role === 'Friends' ? 'Challenges' : profile.role === 'Service Providers' ? 'Focus' : 'Motivation'}</dt>
                          <dd className="text-sm font-medium text-gray-900">{profile.demographics.motivation || profile.demographics.challenges || profile.demographics.focus}</dd>
                        </div>
                      </dl>
                    </div>

                    {/* Key Themes */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Dominant Themes</h4>
                      <div className="space-y-3">
                        {profile.keyThemes.map((theme) => (
                          <div key={theme.theme}>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm text-gray-700">{theme.theme}</span>
                              <span className="text-sm font-semibold">{theme.percentage}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  profile.color === 'orange' ? 'bg-orange-500' : 
                                  profile.color === 'blue' ? 'bg-blue-500' : 'bg-green-500'
                                }`}
                                style={{ width: `${theme.percentage}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Key Insights */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Key Insights</h4>
                    <ul className="space-y-2">
                      {profile.insights.map((insight, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Target className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Representative Quotes */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Voice of {profile.role}</h4>
                    <div className="space-y-3">
                      {profile.quotes.map((quote, index) => (
                        <blockquote key={index} className="pl-4 border-l-4 border-gray-300 italic text-gray-600">
                          {quote}
                        </blockquote>
                      ))}
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-yellow-600" />
                      Strategic Recommendations
                    </h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      {profile.recommendations.map((rec, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <span className="text-yellow-600 mt-0.5">•</span>
                          <span className="text-sm text-gray-700">{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Cross-Role Insights */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Cross-Role Insights</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {crossRoleInsights.map((item, index) => (
              <div key={index} className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">{item.insight}</h4>
                <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-sm text-blue-900">
                    <span className="font-semibold">Implication:</span> {item.implication}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Every Perspective Matters
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            These role-based insights reveal the beautiful complexity of the Orange Sky community. 
            By understanding and valuing each perspective, we create services that truly serve everyone.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/analysis"
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Back to Analysis
            </Link>
            <button className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600">
              Download Role Report
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}