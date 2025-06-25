'use client'

import { useState } from 'react'
import { Network, Map, TrendingUp, Users, MessageSquare, BarChart3 } from 'lucide-react'

interface Tab {
  id: string
  label: string
  icon: React.ReactNode
  description: string
}

const tabs: Tab[] = [
  {
    id: 'network',
    label: 'Theme Network',
    icon: <Network className="w-4 h-4" />,
    description: 'Explore connections between themes, storytellers, and communities'
  },
  {
    id: 'journey',
    label: 'Journey Maps',
    icon: <TrendingUp className="w-4 h-4" />,
    description: 'Visualize transformation stories and impact pathways'
  },
  {
    id: 'sentiment',
    label: 'Sentiment Analysis',
    icon: <MessageSquare className="w-4 h-4" />,
    description: 'Analyze emotions and sentiments across stories and quotes'
  },
  {
    id: 'geographic',
    label: 'Geographic Impact',
    icon: <Map className="w-4 h-4" />,
    description: 'See regional patterns and community connections'
  },
  {
    id: 'roles',
    label: 'Role Insights',
    icon: <Users className="w-4 h-4" />,
    description: 'Compare perspectives across volunteers, friends, and service providers'
  },
  {
    id: 'overview',
    label: 'Overview',
    icon: <BarChart3 className="w-4 h-4" />,
    description: 'Key metrics and high-level insights'
  }
]

interface AnalysisTabsProps {
  analytics: any
  activeTab: string
  onTabChange: (tab: string) => void
  children: React.ReactNode
}

export default function AnalysisTabs({ analytics, activeTab, onTabChange, children }: AnalysisTabsProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Data Analysis & Insights
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Explore patterns, themes, and connections across Orange Sky storytellers through interactive visualizations
          </p>
        </div>
      </section>

      {/* Tabs */}
      <section className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors
                  ${activeTab === tab.id
                    ? 'text-orange-sky border-orange-sky'
                    : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tab Description */}
      <section className="bg-gray-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gray-600">
            {tabs.find(t => t.id === activeTab)?.description}
          </p>
        </div>
      </section>

      {/* Tab Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </section>
    </div>
  )
}