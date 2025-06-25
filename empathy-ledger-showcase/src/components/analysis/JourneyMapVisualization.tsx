'use client'

import { useState } from 'react'
import { ChevronRight, Clock, Heart, Users, Lightbulb, Eye } from 'lucide-react'
import Link from 'next/link'

interface JourneyStage {
  id: string
  label: string
  description: string
  icon: React.ReactNode
  metrics?: {
    volunteers?: number
    friends?: number
    serviceProviders?: number
  }
  themes: string[]
  quotes?: string[]
}

const journeyStages: JourneyStage[] = [
  {
    id: 'awareness',
    label: 'First Contact',
    description: 'Initial awareness and introduction to Orange Sky',
    icon: <Users className="w-5 h-5" />,
    themes: ['Community Engagement', 'Perception of Homelessness'],
    quotes: [
      "I didn't know what to expect when I first arrived",
      "Someone told me about this place where I could get clean clothes"
    ]
  },
  {
    id: 'engagement',
    label: 'Building Trust',
    description: 'Regular participation and relationship building',
    icon: <Heart className="w-5 h-5" />,
    themes: ['Connection', 'Support', 'Concept of Friendship'],
    quotes: [
      "They remember my name, that means something",
      "It's not just about the washing, it's about the conversation"
    ]
  },
  {
    id: 'transformation',
    label: 'Personal Growth',
    description: 'Experiencing positive changes and new perspectives',
    icon: <Lightbulb className="w-5 h-5" />,
    themes: ['Personal Transformation', 'Hope', 'Dignity'],
    quotes: [
      "It gives me dignity to have clean clothes",
      "I feel like I belong somewhere"
    ]
  },
  {
    id: 'advocacy',
    label: 'Giving Back',
    description: 'Becoming advocates and supporting others',
    icon: <Users className="w-5 h-5" />,
    themes: ['Volunteering', 'Community Support', 'Active Volunteering'],
    quotes: [
      "I want to volunteer and help others like they helped me",
      "This is my way of giving back to the community"
    ]
  }
]

interface JourneyMapVisualizationProps {
  analytics: any
}

export default function JourneyMapVisualization({ analytics }: JourneyMapVisualizationProps) {
  const [selectedStage, setSelectedStage] = useState<JourneyStage | null>(null)
  const [selectedRole, setSelectedRole] = useState<'all' | 'volunteers' | 'friends' | 'service-providers'>('all')

  const roleColors = {
    volunteers: 'text-orange-sky',
    friends: 'text-blue-500',
    'service-providers': 'text-green-500',
    all: 'text-gray-900'
  }

  // Simulate journey data based on analytics
  const getStageMetrics = (stage: JourneyStage) => {
    const baseVolunteers = analytics?.storytellers?.byRole?.volunteers || 0
    const baseFriends = analytics?.storytellers?.byRole?.friends || 0
    const baseProviders = analytics?.storytellers?.byRole?.serviceProviders || 0

    // Simulate different participation rates at each stage
    const rates = {
      awareness: 1,
      engagement: 0.8,
      transformation: 0.6,
      advocacy: 0.3
    }

    const rate = rates[stage.id as keyof typeof rates] || 1

    return {
      volunteers: Math.round(baseVolunteers * rate * (selectedRole === 'all' || selectedRole === 'volunteers' ? 1 : 0)),
      friends: Math.round(baseFriends * rate * (selectedRole === 'all' || selectedRole === 'friends' ? 1 : 0)),
      serviceProviders: Math.round(baseProviders * rate * (selectedRole === 'all' || selectedRole === 'service-providers' ? 1 : 0))
    }
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">View journey for:</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-sky"
            >
              <option value="all">All Participants</option>
              <option value="volunteers">Volunteers</option>
              <option value="friends">Friends</option>
              <option value="service-providers">Service Providers</option>
            </select>
          </div>
          
          <Link
            href="/analysis/insights/journey"
            className="px-4 py-2 bg-orange-sky text-white rounded-lg hover:bg-orange-600 flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            View Journey Insights
          </Link>
        </div>
      </div>

      {/* Journey Timeline */}
      <div className="bg-white p-8 rounded-lg shadow-sm">
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2"></div>
          
          {/* Journey Stages */}
          <div className="relative grid grid-cols-4 gap-8">
            {journeyStages.map((stage, index) => {
              const metrics = getStageMetrics(stage)
              const total = (metrics.volunteers || 0) + (metrics.friends || 0) + (metrics.serviceProviders || 0)
              
              return (
                <div
                  key={stage.id}
                  className="relative cursor-pointer group"
                  onClick={() => setSelectedStage(stage)}
                >
                  {/* Stage Circle */}
                  <div className="relative flex flex-col items-center">
                    <div className={`
                      w-20 h-20 rounded-full bg-white border-4 flex items-center justify-center
                      transition-all duration-200 group-hover:scale-110
                      ${selectedStage?.id === stage.id ? 'border-orange-sky' : 'border-gray-300'}
                    `}>
                      <div className={`${selectedStage?.id === stage.id ? 'text-orange-sky' : 'text-gray-600'}`}>
                        {stage.icon}
                      </div>
                    </div>
                    
                    {/* Stage Label */}
                    <h3 className="mt-4 text-sm font-semibold text-gray-900 text-center">
                      {stage.label}
                    </h3>
                    
                    {/* Participant Count */}
                    <p className={`mt-2 text-2xl font-bold ${roleColors[selectedRole]}`}>
                      {total}
                    </p>
                    <p className="text-xs text-gray-500">participants</p>
                  </div>

                  {/* Arrow to next stage */}
                  {index < journeyStages.length - 1 && (
                    <ChevronRight className="absolute top-10 -right-4 w-6 h-6 text-gray-400" />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Stage Details */}
      {selectedStage && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {selectedStage.label}
            </h3>
            <p className="text-gray-600">{selectedStage.description}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Metrics Breakdown */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Participant Breakdown</h4>
              <div className="space-y-2">
                {(() => {
                  const metrics = getStageMetrics(selectedStage)
                  return (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Volunteers</span>
                        <span className="text-sm font-semibold text-orange-sky">{metrics.volunteers}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Friends</span>
                        <span className="text-sm font-semibold text-blue-500">{metrics.friends}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Service Providers</span>
                        <span className="text-sm font-semibold text-green-500">{metrics.serviceProviders}</span>
                      </div>
                    </>
                  )
                })()}
              </div>
            </div>

            {/* Key Themes */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Key Themes</h4>
              <div className="flex flex-wrap gap-2">
                {selectedStage.themes.map(theme => (
                  <span
                    key={theme}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {theme}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Representative Quotes */}
          {selectedStage.quotes && (
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Representative Quotes</h4>
              <div className="space-y-3">
                {selectedStage.quotes.map((quote, index) => (
                  <blockquote key={index} className="pl-4 border-l-4 border-gray-200 text-sm text-gray-600 italic">
                    "{quote}"
                  </blockquote>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Journey Insights CTA */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Understand the Impact Journey
            </h3>
            <p className="text-gray-600">
              Learn how to support participants at each stage of their journey
            </p>
          </div>
          <Link
            href="/analysis/insights/journey"
            className="px-6 py-3 bg-orange-sky text-white rounded-lg hover:bg-orange-600 flex items-center gap-2"
          >
            <Clock className="w-5 h-5" />
            Explore Journey Insights
          </Link>
        </div>
      </div>
    </div>
  )
}