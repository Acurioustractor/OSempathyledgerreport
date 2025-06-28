'use client'

import { useState, useEffect } from 'react'
import { Calendar, Users, Map, Quote, Download, Share2, Save, ChevronRight, Filter, BarChart3, PieChart, TrendingUp, FileText, Brain, Heart, Globe, Sparkles } from 'lucide-react'
// Header and Footer are already in the root layout
import { analyzeStories, processQuery } from '@/utils/storyAnalyzer'
import { Story, Storyteller } from '@/types'

// Report templates for Orange Sky staff
const reportTemplates = [
  {
    id: 'weekly-impact',
    title: 'Weekly Impact Summary',
    description: 'Summarize this week\'s stories for team meetings',
    template: 'Generate a weekly impact summary focusing on positive outcomes, challenges addressed, and volunteer recognition opportunities',
    icon: Calendar,
    outputs: ['Executive summary', 'Key quotes', 'Volunteer highlights', 'Action items']
  },
  {
    id: 'grant-evidence',
    title: 'Grant Application Evidence',
    description: 'Compile evidence for funding applications',
    template: 'Extract quantitative and qualitative evidence demonstrating Orange Sky\'s impact on homelessness, mental health, and community connection',
    icon: FileText,
    outputs: ['Impact statistics', 'Outcome evidence', 'Case studies', 'ROI demonstration']
  },
  {
    id: 'volunteer-training',
    title: 'Volunteer Training Stories',
    description: 'Real stories for volunteer onboarding',
    template: 'Find stories that demonstrate best practices in conversations, boundary setting, and creating safe spaces',
    icon: Users,
    outputs: ['Conversation examples', 'Challenging situations', 'Success stories', 'Learning points']
  },
  {
    id: 'board-presentation',
    title: 'Board & Stakeholder Report',
    description: 'High-level insights for governance',
    template: 'Create executive summary with strategic insights, emerging trends, and recommendations for service evolution',
    icon: BarChart3,
    outputs: ['Strategic insights', 'Trend analysis', 'Risk areas', 'Growth opportunities']
  },
  {
    id: 'media-stories',
    title: 'Media & PR Package',
    description: 'Compelling stories for media outreach',
    template: 'Identify the most powerful, media-friendly stories that demonstrate transformation and hope while respecting privacy',
    icon: Share2,
    outputs: ['Hero stories', 'Diverse perspectives', 'Visual story ideas', 'Key messages']
  },
  {
    id: 'service-improvement',
    title: 'Service Improvement Insights',
    description: 'Identify areas for service enhancement',
    template: 'Analyze stories to find unmet needs, service gaps, and opportunities for program improvement',
    icon: TrendingUp,
    outputs: ['Unmet needs', 'Service gaps', 'User suggestions', 'Innovation opportunities']
  }
]

// Analysis dimensions
const analysisDimensions = [
  { id: 'themes', label: 'Themes & Topics', icon: Brain },
  { id: 'sentiment', label: 'Emotional Tone', icon: Heart },
  { id: 'demographics', label: 'Who We Serve', icon: Users },
  { id: 'geography', label: 'Where We Work', icon: Map },
  { id: 'timeline', label: 'Change Over Time', icon: Calendar },
  { id: 'impact', label: 'Impact Metrics', icon: BarChart3 }
]

// Pre-built queries for quick insights
const quickQueries = [
  'What brings people joy in their interactions with Orange Sky?',
  'How do storytellers describe the impact of clean clothes on their daily life?',
  'What are the invisible struggles that storytellers face?',
  'How does Orange Sky help rebuild self-worth and dignity?',
  'What role does conversation play in breaking down barriers?',
  'How do regional experiences differ from metro areas?',
  'What are the pathways from crisis to stability mentioned in stories?',
  'How do storytellers describe their first Orange Sky experience?'
]

export default function AdvancedInsightsPage() {
  const [stories, setStories] = useState<Story[]>([])
  const [storytellers, setStorytellers] = useState<Storyteller[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [customQuery, setCustomQuery] = useState('')
  const [selectedDimensions, setSelectedDimensions] = useState<string[]>(['themes', 'sentiment'])
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [locationFilter, setLocationFilter] = useState('all')
  const [generatedReport, setGeneratedReport] = useState<any>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [savedReports, setSavedReports] = useState<any[]>([])

  // Load data on mount
  useEffect(() => {
    loadData()
    loadSavedReports()
  }, [])

  const loadData = async () => {
    try {
      const [storiesRes, storytellersRes] = await Promise.all([
        fetch('/data/stories.json'),
        fetch('/data/storytellers.json')
      ])
      const storiesData = await storiesRes.json()
      const storytellersData = await storytellersRes.json()
      setStories(storiesData)
      setStorytellers(storytellersData)
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }

  const loadSavedReports = () => {
    const saved = localStorage.getItem('savedInsightReports')
    if (saved) {
      setSavedReports(JSON.parse(saved))
    }
  }

  const generateReport = async () => {
    setIsGenerating(true)
    
    // Simulate AI processing
    setTimeout(() => {
      const template = reportTemplates.find(t => t.id === selectedTemplate)
      const query = template ? template.template : customQuery
      
      // Filter stories based on criteria
      let filteredStories = stories
      if (locationFilter !== 'all') {
        filteredStories = stories.filter(s => s.location === locationFilter)
      }
      if (dateRange.start) {
        filteredStories = filteredStories.filter(s => 
          new Date(s.createdAt) >= new Date(dateRange.start)
        )
      }
      if (dateRange.end) {
        filteredStories = filteredStories.filter(s => 
          new Date(s.createdAt) <= new Date(dateRange.end)
        )
      }
      
      // Generate analysis
      const analysis = analyzeStories(filteredStories, storytellers)
      const reportContent = processQuery(query, filteredStories, storytellers)
      
      const report = {
        id: Date.now().toString(),
        title: template?.title || 'Custom Analysis',
        query,
        generatedAt: new Date().toISOString(),
        filters: { location: locationFilter, dateRange },
        dimensions: selectedDimensions,
        content: reportContent,
        analysis,
        storyCount: filteredStories.length
      }
      
      setGeneratedReport(report)
      setIsGenerating(false)
    }, 3000)
  }

  const saveReport = () => {
    if (generatedReport) {
      const newSaved = [...savedReports, generatedReport]
      setSavedReports(newSaved)
      localStorage.setItem('savedInsightReports', JSON.stringify(newSaved))
    }
  }

  const exportReport = (format: 'pdf' | 'docx' | 'csv') => {
    // In real implementation, this would generate actual files
    alert(`Export to ${format.toUpperCase()} would be implemented here`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-orange-50 to-blue-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4" />
                Advanced Analytics Suite
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Deep Insights for Orange Sky Teams
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Transform storyteller narratives into actionable insights, evidence-based reports, 
                and strategic recommendations to enhance service delivery and demonstrate impact.
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Sidebar - Configuration */}
            <div className="lg:col-span-1 space-y-6">
              {/* Report Templates */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Report Templates</h2>
                <div className="space-y-2">
                  {reportTemplates.map(template => {
                    const Icon = template.icon
                    return (
                      <button
                        key={template.id}
                        onClick={() => {
                          setSelectedTemplate(template.id)
                          setCustomQuery('')
                        }}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          selectedTemplate === template.id
                            ? 'bg-orange-50 border border-orange-sky'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <Icon className="w-5 h-5 text-orange-sky mt-0.5" />
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{template.title}</h3>
                            <p className="text-xs text-gray-600 mt-0.5">{template.description}</p>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Filters */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
                
                {/* Location Filter */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <select
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-sky"
                  >
                    <option value="all">All Locations</option>
                    <option value="Brisbane">Brisbane</option>
                    <option value="Sydney">Sydney</option>
                    <option value="Melbourne">Melbourne</option>
                    <option value="Perth">Perth</option>
                    <option value="Adelaide">Adelaide</option>
                  </select>
                </div>

                {/* Date Range */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Range
                  </label>
                  <div className="space-y-2">
                    <input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-sky"
                    />
                    <input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-sky"
                    />
                  </div>
                </div>

                {/* Analysis Dimensions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Analysis Dimensions
                  </label>
                  <div className="space-y-2">
                    {analysisDimensions.map(dim => (
                      <label key={dim.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedDimensions.includes(dim.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedDimensions([...selectedDimensions, dim.id])
                            } else {
                              setSelectedDimensions(selectedDimensions.filter(d => d !== dim.id))
                            }
                          }}
                          className="w-4 h-4 text-orange-sky rounded border-gray-300 focus:ring-orange-sky"
                        />
                        <span className="text-sm text-gray-700">{dim.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Saved Reports */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Saved Reports ({savedReports.length})
                </h2>
                {savedReports.length > 0 ? (
                  <div className="space-y-2">
                    {savedReports.slice(-3).reverse().map(report => (
                      <button
                        key={report.id}
                        onClick={() => setGeneratedReport(report)}
                        className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <h3 className="font-medium text-gray-900 text-sm">{report.title}</h3>
                        <p className="text-xs text-gray-600">
                          {new Date(report.generatedAt).toLocaleDateString()}
                        </p>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No saved reports yet</p>
                )}
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Custom Query Input */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Custom Query</h2>
                <textarea
                  value={customQuery}
                  onChange={(e) => {
                    setCustomQuery(e.target.value)
                    setSelectedTemplate(null)
                  }}
                  placeholder="Ask any question about the stories... e.g., 'What patterns exist in stories from people who have successfully transitioned to stable housing?'"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-sky h-24 resize-none"
                />
                
                {/* Quick Query Suggestions */}
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Quick queries:</p>
                  <div className="flex flex-wrap gap-2">
                    {quickQueries.slice(0, 4).map((query, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCustomQuery(query)}
                        className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 rounded-full transition-colors"
                      >
                        {query.substring(0, 40)}...
                      </button>
                    ))}
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  onClick={generateReport}
                  disabled={(!selectedTemplate && !customQuery) || isGenerating}
                  className="mt-4 w-full px-6 py-3 bg-orange-sky text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Analyzing {stories.length} stories...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate Insights
                    </>
                  )}
                </button>
              </div>

              {/* Generated Report */}
              {generatedReport && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{generatedReport.title}</h2>
                      <p className="text-sm text-gray-600 mt-1">
                        Generated {new Date(generatedReport.generatedAt).toLocaleString()} • 
                        {generatedReport.storyCount} stories analyzed
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={saveReport}
                        className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Save className="w-4 h-4" />
                        Save
                      </button>
                      <button
                        onClick={() => exportReport('pdf')}
                        className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Download className="w-4 h-4" />
                        Export
                      </button>
                      <button
                        className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Share2 className="w-4 h-4" />
                        Share
                      </button>
                    </div>
                  </div>

                  {/* Report Content */}
                  <div className="prose prose-lg max-w-none text-gray-800">
                    <div 
                      dangerouslySetInnerHTML={{ 
                        __html: generatedReport.content
                          .replace(/\n/g, '<br/>')
                          .replace(/#{1,3} (.*)/g, '<h3 class="text-xl font-bold mt-6 mb-3 text-gray-900">$1</h3>')
                          .replace(/> (.*)/g, '<blockquote class="border-l-4 border-orange-sky pl-4 my-4 italic text-gray-700">$1</blockquote>')
                          .replace(/\*\*(.*?)\*\*/g, '<strong class="text-gray-900">$1</strong>')
                          .replace(/- (.*)/g, '<li class="ml-4 text-gray-800">$1</li>')
                      }} 
                    />
                  </div>

                  {/* Visual Analytics */}
                  {selectedDimensions.includes('themes') && generatedReport.analysis && (
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Theme Distribution</h3>
                      <div className="space-y-3">
                        {generatedReport.analysis.themes?.slice(0, 5).map((theme: any) => (
                          <div key={theme.theme}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="font-medium">{theme.theme}</span>
                              <span className="text-gray-600">{theme.count} stories ({theme.percentage}%)</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-orange-sky h-2 rounded-full"
                                style={{ width: `${theme.percentage}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Key Quotes */}
                  {generatedReport.analysis?.quotes && (
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Quotes</h3>
                      <div className="space-y-4">
                        {generatedReport.analysis.quotes.slice(0, 3).map((quote: any, idx: number) => (
                          <div key={idx} className="bg-gray-50 rounded-lg p-4">
                            <p className="text-gray-700 italic">"{quote.quote}"</p>
                            <p className="text-sm text-gray-600 mt-2">— {quote.storyteller}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Items */}
                  <div className="mt-8 bg-orange-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Recommended Actions</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-5 h-5 text-orange-sky mt-0.5" />
                        <span>Share these insights with frontline teams to inform service delivery</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-5 h-5 text-orange-sky mt-0.5" />
                        <span>Use identified themes for volunteer training content</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-5 h-5 text-orange-sky mt-0.5" />
                        <span>Include key quotes in next funding application</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
    </div>
  )
}