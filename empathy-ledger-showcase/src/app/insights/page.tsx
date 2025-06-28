'use client'

import { useState, useEffect } from 'react'
import { Search, FileText, Map, Users, TrendingUp, Quote, Download, Sparkles, Filter, Calendar, Heart, Home, Brain, Globe, BarChart3, MessageSquare, ArrowRight } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

interface QueryTemplate {
  id: string
  title: string
  description: string
  query: string
  icon: any
  category: 'impact' | 'themes' | 'demographics' | 'geographic' | 'trends'
}

const queryTemplates: QueryTemplate[] = [
  {
    id: 'hope-resilience',
    title: 'Stories of Hope & Resilience',
    description: 'Find uplifting stories about overcoming challenges',
    query: 'Show me stories about hope, resilience, and positive change',
    icon: Heart,
    category: 'themes'
  },
  {
    id: 'mental-health',
    title: 'Mental Health Insights',
    description: 'Understand mental health experiences and needs',
    query: 'Analyze stories mentioning mental health, wellbeing, or emotional support',
    icon: Brain,
    category: 'themes'
  },
  {
    id: 'community-impact',
    title: 'Community Connection Impact',
    description: 'How Orange Sky fosters community and belonging',
    query: 'Find stories about community, connection, and reducing isolation',
    icon: Users,
    category: 'impact'
  },
  {
    id: 'geographic-insights',
    title: 'Location-Based Insights',
    description: 'Compare experiences across different regions',
    query: 'Compare themes and challenges between metro and regional areas',
    icon: Map,
    category: 'geographic'
  },
  {
    id: 'journey-stories',
    title: 'Journey to Independence',
    description: 'Track progress and transformation stories',
    query: 'Show stories about personal growth, goals, and journey to stability',
    icon: TrendingUp,
    category: 'trends'
  },
  {
    id: 'daily-challenges',
    title: 'Daily Life Challenges',
    description: 'Understand practical needs and barriers',
    query: 'What are the most common daily challenges mentioned in stories?',
    icon: Home,
    category: 'themes'
  },
  {
    id: 'support-networks',
    title: 'Support Network Analysis',
    description: 'Explore family, friends, and community support',
    query: 'Analyze mentions of family, friends, and support systems',
    icon: Users,
    category: 'demographics'
  },
  {
    id: 'quote-collection',
    title: 'Powerful Quotes',
    description: 'Extract impactful quotes for communications',
    query: 'Find the most powerful and emotional quotes about Orange Sky\'s impact',
    icon: Quote,
    category: 'impact'
  }
]

const reportTypes = [
  { id: 'grant', label: 'Grant Application Report', icon: FileText },
  { id: 'board', label: 'Board Presentation', icon: BarChart3 },
  { id: 'media', label: 'Media & PR Pack', icon: MessageSquare },
  { id: 'donor', label: 'Donor Impact Report', icon: Heart },
  { id: 'training', label: 'Volunteer Training Stories', icon: Users },
  { id: 'annual', label: 'Annual Impact Summary', icon: Globe }
]

export default function InsightsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<string | null>(null)
  const [selectedReportType, setSelectedReportType] = useState<string>('')

  const handleQuerySubmit = async (query: string) => {
    setIsGenerating(true)
    setGeneratedContent(null)
    
    // Simulate AI processing
    setTimeout(() => {
      // Mock response based on query type
      const mockResponse = generateMockResponse(query)
      setGeneratedContent(mockResponse)
      setIsGenerating(false)
    }, 2000)
  }

  const generateMockResponse = (query: string): string => {
    if (query.includes('hope') || query.includes('resilience')) {
      return `# Stories of Hope & Resilience

## Key Themes Identified
- **Renewed Purpose**: 45% of storytellers mention finding new meaning in daily activities
- **Community Support**: 78% highlight the importance of connection through Orange Sky
- **Personal Growth**: 62% describe positive changes in self-perception

## Highlighted Quotes

> "For the first time in years, I felt like someone saw me as a person, not just my circumstances."
> — Michael, Brisbane

> "The clean clothes gave me confidence, but the conversations gave me hope."
> — Sarah, Melbourne

## Geographic Distribution
- **Metro Areas**: Strong themes of anonymity overcome by personal connection
- **Regional Areas**: Focus on community integration and breaking isolation

## Recommendations for Programs
1. Continue emphasis on conversational approach
2. Develop peer support initiatives
3. Create pathways for storytellers to become volunteers`
    }
    
    if (query.includes('mental health')) {
      return `# Mental Health & Wellbeing Analysis

## Prevalence
- **67%** of stories mention mental health challenges
- **89%** report improved wellbeing after regular Orange Sky visits

## Common Themes
1. **Isolation & Loneliness** (mentioned in 72% of stories)
2. **Anxiety about future** (56%)
3. **Depression** (45%)
4. **Trauma experiences** (38%)

## Positive Impacts Reported
- Reduced isolation through regular social contact
- Improved self-worth from being treated with dignity
- Stress reduction from practical support

## Support Opportunities
- Partner with mental health services
- Train volunteers in mental health first aid
- Create safe spaces for emotional expression`
    }
    
    return `# Analysis Results

## Query: "${query}"

## Summary
Based on analysis of 108 storyteller narratives, here are the key insights...

## Key Findings
1. Theme prevalence and patterns
2. Geographic variations
3. Demographic insights
4. Temporal trends

## Actionable Insights
- Recommendations for service improvement
- Opportunities for deeper engagement
- Areas requiring additional support

## Next Steps
Consider diving deeper into specific themes or generating targeted reports.`
  }

  const categories = [
    { id: 'all', label: 'All Insights' },
    { id: 'impact', label: 'Impact Stories' },
    { id: 'themes', label: 'Themes & Topics' },
    { id: 'demographics', label: 'Demographics' },
    { id: 'geographic', label: 'Geographic' },
    { id: 'trends', label: 'Trends & Changes' }
  ]

  const filteredTemplates = selectedCategory === 'all' 
    ? queryTemplates 
    : queryTemplates.filter(t => t.category === selectedCategory)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-orange-50 to-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Story Insights Dashboard
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Explore patterns, extract insights, and generate reports from storyteller narratives 
                to better understand impact and inform decision-making.
              </p>
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section className="py-8 bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleQuerySubmit(searchQuery)}
                  placeholder="Ask a question about the stories... e.g., 'What are the main challenges faced in regional areas?'"
                  className="w-full px-6 py-4 pr-32 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-sky"
                />
                <button
                  onClick={() => handleQuerySubmit(searchQuery)}
                  disabled={!searchQuery || isGenerating}
                  className="absolute right-2 top-2 px-6 py-2 bg-orange-sky text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isGenerating ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Analyzing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Generate Insights
                    </span>
                  )}
                </button>
              </div>
              
              {/* Quick Report Generation */}
              <div className="mt-4 flex items-center gap-4">
                <span className="text-sm text-gray-600">Quick Reports:</span>
                <select
                  value={selectedReportType}
                  onChange={(e) => {
                    setSelectedReportType(e.target.value)
                    if (e.target.value) {
                      handleQuerySubmit(`Generate a ${reportTypes.find(r => r.id === e.target.value)?.label}`)
                    }
                  }}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-orange-sky"
                >
                  <option value="">Select a report type...</option>
                  {reportTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-6 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    selectedCategory === cat.id
                      ? 'bg-orange-sky text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Query Templates */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Insight Templates</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map(template => {
                const Icon = template.icon
                return (
                  <button
                    key={template.id}
                    onClick={() => {
                      setSearchQuery(template.query)
                      handleQuerySubmit(template.query)
                    }}
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md hover:border-orange-sky transition-all text-left group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                        <Icon className="w-6 h-6 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{template.title}</h3>
                        <p className="text-sm text-gray-600">{template.description}</p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        {/* Generated Content */}
        {generatedContent && (
          <section className="py-8 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-gray-50 rounded-xl p-8">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Generated Insights</h2>
                  <button
                    onClick={() => {
                      // In real implementation, this would download the content
                      alert('Download functionality would be implemented here')
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-sky text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download Report
                  </button>
                </div>
                
                <div className="prose prose-lg max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: generatedContent.replace(/\n/g, '<br/>').replace(/#{1,3} (.*)/g, '<h3 class="text-xl font-bold mt-4 mb-2">$1</h3>').replace(/> (.*)/g, '<blockquote class="border-l-4 border-orange-sky pl-4 my-4 italic">$1</blockquote>') }} />
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex gap-4">
                  <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                    Refine Query
                  </button>
                  <button className="px-4 py-2 bg-orange-sky text-white rounded-lg hover:bg-orange-600 transition-colors">
                    Share Insights
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Save to Library
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Advanced Analytics Link */}
        <section className="py-8 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-orange-50 to-blue-50 rounded-xl p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Need More Powerful Analytics?</h2>
              <p className="text-gray-600 mb-6">
                Access our advanced analytics suite for deeper insights, custom reports, and strategic analysis.
              </p>
              <a
                href="/insights/advanced"
                className="inline-flex items-center gap-2 px-6 py-3 bg-orange-sky text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Open Advanced Analytics
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              What You Can Discover
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Trend Analysis</h3>
                <p className="text-sm text-gray-600">Track how stories and themes evolve over time</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Map className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Geographic Insights</h3>
                <p className="text-sm text-gray-600">Compare experiences across different locations</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Demographic Patterns</h3>
                <p className="text-sm text-gray-600">Understand different groups' unique needs</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Quote className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Quote Extraction</h3>
                <p className="text-sm text-gray-600">Find powerful quotes for any purpose</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}