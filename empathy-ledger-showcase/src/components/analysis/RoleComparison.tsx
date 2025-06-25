'use client'

import { useState } from 'react'
import { Users, Heart, Shield, Lightbulb, MessageSquare, Eye } from 'lucide-react'
import Link from 'next/link'

interface RoleData {
  role: string
  count: number
  color: string
  themes: { name: string; percentage: number }[]
  characteristics: string[]
  journeyFocus: string[]
  quotes: string[]
}

interface RoleComparisonProps {
  analytics: any
}

export default function RoleComparison({ analytics }: RoleComparisonProps) {
  const [selectedRole, setSelectedRole] = useState<RoleData | null>(null)
  const [comparisonMode, setComparisonMode] = useState<'themes' | 'journey' | 'impact'>('themes')

  const roles: RoleData[] = [
    {
      role: 'Volunteers',
      count: analytics?.storytellers?.byRole?.volunteers || 0,
      color: 'bg-orange-sky',
      themes: [
        { name: 'Community Engagement', percentage: 85 },
        { name: 'Personal Growth', percentage: 72 },
        { name: 'Making a Difference', percentage: 90 },
        { name: 'Connection', percentage: 78 }
      ],
      characteristics: [
        'Motivated by service',
        'Value community connection',
        'Seek meaningful engagement',
        'Personal fulfillment through helping'
      ],
      journeyFocus: [
        'Initial training and onboarding',
        'Building relationships with friends',
        'Developing leadership skills',
        'Long-term commitment'
      ],
      quotes: [
        "It's been a good opportunity to get out and about and do something different",
        "I go home on top of the world some days",
        "We give a lot to friends, but they give just as much back"
      ]
    },
    {
      role: 'Friends',
      count: analytics?.storytellers?.byRole?.friends || 0,
      color: 'bg-blue-500',
      themes: [
        { name: 'Support & Dignity', percentage: 88 },
        { name: 'Connection', percentage: 82 },
        { name: 'Resilience', percentage: 75 },
        { name: 'Hope', percentage: 70 }
      ],
      characteristics: [
        'Seeking connection and support',
        'Value dignity and respect',
        'Building resilience',
        'Creating community'
      ],
      journeyFocus: [
        'First contact and trust building',
        'Regular engagement',
        'Personal transformation',
        'Peer support'
      ],
      quotes: [
        "They remember my name, that means something",
        "It's not just about the washing, it's about the conversation",
        "It gives me dignity to have clean clothes"
      ]
    },
    {
      role: 'Service Providers',
      count: analytics?.storytellers?.byRole?.serviceProviders || 0,
      color: 'bg-green-500',
      themes: [
        { name: 'Organizational Support', percentage: 92 },
        { name: 'Community Impact', percentage: 85 },
        { name: 'Collaboration', percentage: 80 },
        { name: 'Resource Management', percentage: 75 }
      ],
      characteristics: [
        'Focus on systemic change',
        'Partnership oriented',
        'Impact measurement',
        'Resource optimization'
      ],
      journeyFocus: [
        'Partnership development',
        'Service integration',
        'Impact assessment',
        'Sustainability planning'
      ],
      quotes: [
        "We see the direct impact on community health",
        "Collaboration is key to reaching more people",
        "It's about creating sustainable support systems"
      ]
    }
  ]

  const getComparisonData = () => {
    switch (comparisonMode) {
      case 'themes':
        return {
          title: 'Theme Priorities by Role',
          description: 'How different roles prioritize various themes',
          metrics: roles.map(role => ({
            role: role.role,
            data: role.themes,
            color: role.color
          }))
        }
      case 'journey':
        return {
          title: 'Journey Focus Areas',
          description: 'Key stages and focus areas for each role',
          metrics: roles.map(role => ({
            role: role.role,
            data: role.journeyFocus.map((focus, i) => ({
              name: focus,
              percentage: 100 - (i * 20)
            })),
            color: role.color
          }))
        }
      case 'impact':
        return {
          title: 'Impact Metrics',
          description: 'How each role contributes to Orange Sky\'s impact',
          metrics: roles.map(role => ({
            role: role.role,
            data: [
              { name: 'Direct Service', percentage: role.role === 'Volunteers' ? 95 : role.role === 'Friends' ? 20 : 60 },
              { name: 'Community Building', percentage: role.role === 'Volunteers' ? 80 : role.role === 'Friends' ? 90 : 70 },
              { name: 'Advocacy', percentage: role.role === 'Volunteers' ? 60 : role.role === 'Friends' ? 70 : 85 },
              { name: 'System Change', percentage: role.role === 'Volunteers' ? 40 : role.role === 'Friends' ? 50 : 90 }
            ],
            color: role.color
          }))
        }
    }
  }

  const comparisonData = getComparisonData()

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Compare by:</label>
            <select
              value={comparisonMode}
              onChange={(e) => setComparisonMode(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-sky"
            >
              <option value="themes">Theme Priorities</option>
              <option value="journey">Journey Focus</option>
              <option value="impact">Impact Areas</option>
            </select>
          </div>
          
          <Link
            href="/analysis/insights/roles"
            className="px-4 py-2 bg-orange-sky text-white rounded-lg hover:bg-orange-600 flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            View Role Insights
          </Link>
        </div>
      </div>

      {/* Role Overview Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {roles.map((role) => (
          <div
            key={role.role}
            className={`bg-white p-6 rounded-lg shadow-sm cursor-pointer transition-all ${
              selectedRole?.role === role.role ? 'ring-2 ring-orange-sky' : ''
            }`}
            onClick={() => setSelectedRole(role)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${role.color} text-white`}>
                <Users className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{role.count}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{role.role}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {role.characteristics[0]}
            </p>
          </div>
        ))}
      </div>

      {/* Comparison Visualization */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{comparisonData.title}</h3>
        <p className="text-gray-600 mb-6">{comparisonData.description}</p>

        <div className="space-y-8">
          {comparisonData.metrics.map((roleMetric) => (
            <div key={roleMetric.role}>
              <h4 className="font-medium text-gray-900 mb-3">{roleMetric.role}</h4>
              <div className="space-y-2">
                {roleMetric.data.map((item) => (
                  <div key={item.name} className="flex items-center gap-4">
                    <span className="text-sm text-gray-600 w-40">{item.name}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full ${roleMetric.color} transition-all duration-500`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-12 text-right">
                      {item.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Role Deep Dive */}
      {selectedRole && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{selectedRole.role} Deep Dive</h3>
              <p className="text-gray-600">{selectedRole.count} participants</p>
            </div>
            <button
              onClick={() => setSelectedRole(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Characteristics */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Key Characteristics</h4>
              <ul className="space-y-2">
                {selectedRole.characteristics.map((char, index) => (
                  <li key={index} className="flex items-start text-sm text-gray-600">
                    <span className={`${selectedRole.color} text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5`}>
                      {index + 1}
                    </span>
                    {char}
                  </li>
                ))}
              </ul>
            </div>

            {/* Journey Focus */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Journey Focus Areas</h4>
              <ul className="space-y-2">
                {selectedRole.journeyFocus.map((focus, index) => (
                  <li key={index} className="flex items-start text-sm text-gray-600">
                    <MessageSquare className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                    {focus}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Representative Quotes */}
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Voice of {selectedRole.role}</h4>
            <div className="space-y-3">
              {selectedRole.quotes.map((quote, index) => (
                <blockquote key={index} className="pl-4 border-l-4 border-gray-200 text-sm text-gray-700 italic">
                  "{quote}"
                </blockquote>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Role-Based Insights CTA */}
      <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Tailored Engagement Strategies
            </h3>
            <p className="text-gray-600">
              Learn how to better support and engage each participant group
            </p>
          </div>
          <Link
            href="/analysis/insights/roles"
            className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 flex items-center gap-2"
          >
            <Users className="w-5 h-5" />
            Explore Role Strategies
          </Link>
        </div>
      </div>
    </div>
  )
}