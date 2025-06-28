import Link from 'next/link'
import { ArrowRight, Users, MapPin, Heart, BookOpen } from 'lucide-react'
import MetricsCounter from '@/components/common/MetricsCounter'
import FeaturedStories from '@/components/story/FeaturedStories'
import DynamicConstellation from '@/components/visualizations/DynamicConstellationWrapper'
import PrivacyNotice from '@/components/privacy/PrivacyNotice'

import { promises as fs } from 'fs'
import path from 'path'

async function getStaticData() {
  try {
    const analyticsPath = path.join(process.cwd(), 'public/data/analytics.json')
    const storiesPath = path.join(process.cwd(), 'public/data/stories.json')
    const storytellersPath = path.join(process.cwd(), 'public/data/storytellers.json')
    
    const [analyticsData, storiesData, storytellersData] = await Promise.all([
      fs.readFile(analyticsPath, 'utf8').then(data => JSON.parse(data)),
      fs.readFile(storiesPath, 'utf8').then(data => JSON.parse(data)),
      fs.readFile(storytellersPath, 'utf8').then(data => JSON.parse(data))
    ])
    
    return { analyticsData, storiesData, storytellersData }
  } catch (error) {
    console.error('Error loading data:', error)
    // Return mock data as fallback
    return {
      analyticsData: {
        totalStories: 102,
        totalStorytellers: 85,
        citiesCount: 8,
        themesCount: 25,
        locationDistribution: {
          'Brisbane': 25,
          'Melbourne': 20,
          'Sydney': 18,
          'Perth': 12,
          'Adelaide': 10,
          'Gold Coast': 8,
          'Newcastle': 6,
          'Cairns': 3
        }
      },
      storiesData: [],
      storytellersData: []
    }
  }
}

export default async function HomePage() {
  const { analyticsData, storiesData, storytellersData } = await getStaticData()
  
  // Process themes for visualization
  const topThemes = analyticsData.themes?.topByStorytellers?.slice(0, 12).map((theme: any) => ({
    id: theme.id,
    name: theme.name,
    category: theme.category,
    storytellerCount: theme.storytellerCount,
    quoteCount: theme.quoteCount,
    roles: {
      volunteers: Math.floor(theme.storytellerCount * 0.5), // Estimate based on overall ratio
      friends: Math.floor(theme.storytellerCount * 0.3),
      serviceProviders: Math.floor(theme.storytellerCount * 0.2)
    }
  })) || []
  
  const keyMetrics = [
    {
      label: 'Stories Collected',
      value: analyticsData.overview?.totalStories || analyticsData.totalStories || 25,
      icon: BookOpen,
      description: 'Each story represents a real human experience'
    },
    {
      label: 'Cities Reached',
      value: analyticsData.locations?.total || analyticsData.locationsCount || 21,
      icon: MapPin,
      description: 'Across Australia, connecting communities'
    },
    {
      label: 'Storytellers',
      value: analyticsData.overview?.totalStorytellers || analyticsData.totalStorytellers || 102,
      icon: Users,
      description: 'Friends and volunteers sharing their journeys'
    },
    {
      label: 'Themes Identified',
      value: analyticsData.themes?.total || analyticsData.totalThemes || 52,
      icon: Heart,
      description: 'Common threads of human experience'
    }
  ]

  const navigationCards = [
    {
      title: 'Explore Stories',
      description: 'Browse through the collection of stories, filtered by location, themes, and storyteller roles.',
      href: '/stories',
      color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
      icon: BookOpen
    },
    {
      title: 'Meet Storytellers',
      description: 'Learn about the people behind the stories - friends and volunteers from across Australia.',
      href: '/storytellers',
      color: 'bg-green-50 border-green-200 hover:bg-green-100',
      icon: Users
    },
    {
      title: 'View Analysis',
      description: 'Discover patterns, insights, and the collective wisdom emerging from these stories.',
      href: '/analysis',
      color: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
      icon: Heart
    },
    {
      title: 'Learn & Replicate',
      description: 'Access guides, templates, and resources to implement ethical storytelling in your community.',
      href: '/wiki',
      color: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
      icon: MapPin
    }
  ]

  // Get featured stories (first 3 with video)
  const featuredStories = (storiesData as any[])
    .filter((story: any) => story.featured || story.hasVideo)
    .slice(0, 3)

  // Process storytellers - they already have themes!
  const processedStorytellers = (storytellersData as any[]).map((storyteller: any) => ({
    id: storyteller.id,
    name: storyteller.name,
    role: storyteller.role === 'volunteer' ? 'volunteer' : 
          storyteller.role === 'service provider' ? 'service-provider' : 'friend',
    themes: storyteller.themes || [],
    location: storyteller.location || 'Unknown'
  })).filter(storyteller => storyteller.themes.length > 0)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 via-white to-blue-50 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 animate-fade-in">
              <span className="text-orange-sky">{analyticsData.overview?.totalStorytellers || 108} Storytellers.</span>
              <br />
              <span className="text-gray-700">{analyticsData.locations?.total || 21} Cities.</span>
              <br />
              <span className="text-gray-900">One Mission.</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in">
              Discover the power of ethical storytelling through dignified collection and analysis 
              of human experiences across Orange Sky's community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
              <Link
                href="/stories"
                className="inline-flex items-center px-8 py-3 bg-orange-sky text-white font-semibold rounded-lg hover:bg-orange-sky-dark transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                Explore Stories
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href="/analysis"
                className="inline-flex items-center px-8 py-3 bg-white text-orange-sky font-semibold rounded-lg border-2 border-orange-sky hover:bg-orange-50 transition-colors duration-200"
              >
                View Analysis
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Key Metrics Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              The Impact of Listening
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              When you create space for people to share their stories with dignity, 
              powerful insights emerge about our shared human experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {keyMetrics.map((metric, index) => (
              <div
                key={metric.label}
                className="text-center p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <MetricsCounter
                  value={metric.value}
                  className="text-3xl font-bold text-gray-900 mb-2"
                />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {metric.label}
                </h3>
                <p className="text-sm text-gray-600">
                  {metric.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Constellation Visualization Section */}
      <section className="relative py-0 bg-gradient-to-b from-gray-50 via-gray-900 to-gray-900 overflow-hidden">
        {/* Full-screen visualization container */}
        <div className="relative h-screen">
          {/* The constellation visualization - lowest layer */}
          <div className="absolute inset-0 pointer-events-none">
            <DynamicConstellation
              storytellers={processedStorytellers}
              className="w-full h-full"
            />
          </div>
          
          {/* Content overlay */}
          <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
            <div className="text-center max-w-4xl mx-auto px-6">
              <h2 className="text-5xl font-bold text-white mb-6 drop-shadow-lg animate-fade-in">
                Stories Connect Us Like Stars in the Sky
              </h2>
              <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed drop-shadow animate-fade-in animation-delay-200">
                Explore how themes weave through our community, connecting volunteers, friends, and service providers 
                in a constellation of shared experiences and human dignity.
              </p>
            </div>
          </div>
          
          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
            <div className="text-white/60 text-sm">
              <p className="mb-2">Scroll to continue</p>
              <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Stories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Stories
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A glimpse into the powerful narratives that emerge when we listen 
              with intention and respect.
            </p>
          </div>
          
          <PrivacyNotice />
          
          <FeaturedStories stories={featuredStories} />
          
          <div className="text-center mt-8">
            <Link
              href="/stories"
              className="inline-flex items-center px-6 py-3 bg-orange-sky text-white font-semibold rounded-lg hover:bg-orange-sky-dark transition-colors duration-200"
            >
              View All Stories
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Navigation Cards Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Explore the Empathy Ledger
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Dive deeper into the stories, analysis, and methodology that makes 
              ethical storytelling possible.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {navigationCards.map((card, index) => (
              <Link
                key={card.title}
                href={card.href}
                className={`block p-8 rounded-xl border-2 transition-all duration-200 card-hover ${card.color} animate-fade-in`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <card.icon className="w-8 h-8 text-gray-700" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {card.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}