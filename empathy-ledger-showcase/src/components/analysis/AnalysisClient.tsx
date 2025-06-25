'use client'

import { useState } from 'react'
import AnalysisTabs from './AnalysisTabs'
import ThemeNetworkAnalysis from './ThemeNetworkAnalysis'
import JourneyMapVisualization from './JourneyMapVisualization'
import SentimentAnalysis from './SentimentAnalysis'
import InteractiveHeatmap from './InteractiveHeatmap'
import RoleComparison from './RoleComparison'
import OverviewDashboard from './OverviewDashboard'

interface AnalysisClientProps {
  analytics: any
}

export default function AnalysisClient({ analytics }: AnalysisClientProps) {
  const [activeTab, setActiveTab] = useState('overview')

  const renderContent = () => {
    switch (activeTab) {
      case 'network':
        return <ThemeNetworkAnalysis analytics={analytics} />
      case 'journey':
        return <JourneyMapVisualization analytics={analytics} />
      case 'sentiment':
        return <SentimentAnalysis analytics={analytics} />
      case 'geographic':
        return <InteractiveHeatmap analytics={analytics} />
      case 'roles':
        return <RoleComparison analytics={analytics} />
      case 'overview':
      default:
        return <OverviewDashboard analytics={analytics} />
    }
  }

  return (
    <AnalysisTabs
      analytics={analytics}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {renderContent()}
    </AnalysisTabs>
  )
}