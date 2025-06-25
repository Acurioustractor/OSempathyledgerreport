import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, MapPin, Users, TrendingUp, Target, Building, Compass } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Regional Insights | Empathy Ledger',
  description: 'Geographic patterns and regional strategies for community impact',
}

export default function RegionalInsightsPage() {
  const regionalStrategies = [
    {
      region: 'Sydney Metropolitan',
      population: '32 storytellers',
      characteristics: {
        strengths: ['High volunteer engagement', 'Diverse communities', 'Strong partner network'],
        challenges: ['Housing affordability crisis', 'Service fragmentation', 'Geographic spread'],
        opportunities: ['Corporate partnerships', 'University collaborations', 'Media presence']
      },
      recommendations: [
        'Establish hub-and-spoke model for outer suburbs',
        'Partner with local councils for integrated services',
        'Create volunteer recruitment pipeline with universities'
      ],
      metrics: {
        growth: '+18%',
        volunteerRatio: '1:3',
        avgEngagement: 'High'
      }
    },
    {
      region: 'Brisbane & Gold Coast',
      population: '28 storytellers',
      characteristics: {
        strengths: ['Growing volunteer base', 'Good weather for services', 'Community support'],
        challenges: ['Rapid population growth', 'Youth homelessness', 'Service gaps'],
        opportunities: ['Tourism sector partnerships', 'Climate-friendly operations', 'Beach-based services']
      },
      recommendations: [
        'Expand services to growth corridors',
        'Develop youth-specific programs',
        'Partner with tourism industry for support'
      ],
      metrics: {
        growth: '+25%',
        volunteerRatio: '1:4',
        avgEngagement: 'Medium'
      }
    },
    {
      region: 'Melbourne Inner City',
      population: '24 storytellers',
      characteristics: {
        strengths: ['Established services', 'Strong advocacy network', 'Cultural diversity'],
        challenges: ['Cold weather impact', 'High service density', 'Complex needs'],
        opportunities: ['Arts partnerships', 'Food industry connections', 'Innovation hub']
      },
      recommendations: [
        'Winter-specific service adaptations',
        'Collaborative service model with other providers',
        'Cultural liaison programs'
      ],
      metrics: {
        growth: '+12%',
        volunteerRatio: '1:2',
        avgEngagement: 'Very High'
      }
    },
    {
      region: 'Regional Queensland',
      population: '18 storytellers',
      characteristics: {
        strengths: ['Tight-knit communities', 'Local business support', 'Volunteer dedication'],
        challenges: ['Distance between towns', 'Limited resources', 'Seasonal work patterns'],
        opportunities: ['Mining sector support', 'Agricultural partnerships', 'Indigenous connections']
      },
      recommendations: [
        'Mobile service routes optimization',
        'Local coordinator model',
        'Seasonal service adaptations'
      ],
      metrics: {
        growth: '+30%',
        volunteerRatio: '1:5',
        avgEngagement: 'Medium'
      }
    }
  ]

  const nationalPatterns = [
    {
      pattern: 'Urban Concentration',
      insight: '73% of storytellers are in major cities, but regional areas show higher growth rates',
      implication: 'Balance urban service depth with regional expansion'
    },
    {
      pattern: 'Coastal Clustering',
      insight: '85% of services operate within 50km of the coast',
      implication: 'Inland communities may be underserved'
    },
    {
      pattern: 'Volunteer Distribution',
      insight: 'Regional areas have higher volunteer-to-friend ratios despite smaller populations',
      implication: 'Regional volunteer model could inform urban strategies'
    },
    {
      pattern: 'Service Gaps',
      insight: 'Northern Territory and Tasmania have limited coverage',
      implication: 'Partnership opportunities for expansion'
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
              <h1 className="text-2xl font-bold text-gray-900">Regional Insights</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Introduction */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <MapPin className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Geographic Patterns & Regional Strategies
              </h2>
              <p className="text-gray-600 mb-4">
                Analysis of 102 stories across {regionalStrategies.length}+ regions reveals unique 
                patterns, challenges, and opportunities for each community. These insights guide 
                resource allocation, service design, and expansion strategies.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-3xl font-bold text-green-600 mb-1">15</p>
                  <p className="text-sm text-gray-600">Active regions analyzed</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-3xl font-bold text-blue-600 mb-1">22%</p>
                  <p className="text-sm text-gray-600">Average regional growth</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-3xl font-bold text-purple-600 mb-1">4.2x</p>
                  <p className="text-sm text-gray-600">Impact variation by region</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* National Patterns */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Compass className="w-5 h-5 text-blue-600" />
            National Geographic Patterns
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {nationalPatterns.map((item, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">{item.pattern}</h4>
                <p className="text-sm text-gray-600 mb-3">{item.insight}</p>
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-sm text-blue-900">
                    <span className="font-semibold">Strategic Implication:</span> {item.implication}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Regional Strategies */}
        <div className="space-y-8 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Target className="w-5 h-5 text-orange-600" />
            Regional Deep Dives
          </h3>
          
          {regionalStrategies.map((region) => (
            <div key={region.region} className="bg-white rounded-lg shadow-sm p-6">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xl font-semibold text-gray-900">{region.region}</h4>
                  <span className="text-sm text-gray-500">{region.population}</span>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    Growth: <span className="font-semibold text-green-600">{region.metrics.growth}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-blue-600" />
                    Volunteer Ratio: <span className="font-semibold">{region.metrics.volunteerRatio}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    Engagement: <span className="font-semibold">{region.metrics.avgEngagement}</span>
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div>
                  <h5 className="text-sm font-semibold text-gray-900 mb-3">Strengths</h5>
                  <ul className="space-y-2">
                    {region.characteristics.strengths.map((strength, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-gray-900 mb-3">Challenges</h5>
                  <ul className="space-y-2">
                    {region.characteristics.challenges.map((challenge, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start">
                        <span className="text-orange-500 mr-2">!</span>
                        {challenge}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-gray-900 mb-3">Opportunities</h5>
                  <ul className="space-y-2">
                    {region.characteristics.opportunities.map((opportunity, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start">
                        <span className="text-blue-500 mr-2">★</span>
                        {opportunity}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="border-t pt-4">
                <h5 className="text-sm font-semibold text-gray-900 mb-3">Strategic Recommendations</h5>
                <div className="grid md:grid-cols-3 gap-4">
                  {region.recommendations.map((rec, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-700">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Expansion Opportunities */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Building className="w-5 h-5 text-green-600" />
            Expansion & Partnership Opportunities
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">High-Potential Regions</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                  <div>
                    <p className="font-medium text-gray-900">Northern Territory</p>
                    <p className="text-sm text-gray-600">Large unmet need, strong community ties, partnership ready</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                  <div>
                    <p className="font-medium text-gray-900">Western Sydney</p>
                    <p className="text-sm text-gray-600">Rapid growth area, diverse communities, corporate support</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                  <div>
                    <p className="font-medium text-gray-900">Regional Victoria</p>
                    <p className="text-sm text-gray-600">Established volunteer base, seasonal needs, tourism potential</p>
                  </div>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Partnership Models</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                  <div>
                    <p className="font-medium text-gray-900">Local Government</p>
                    <p className="text-sm text-gray-600">Co-location, funding support, service integration</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                  <div>
                    <p className="font-medium text-gray-900">Corporate Sponsors</p>
                    <p className="text-sm text-gray-600">Employee volunteering, equipment donation, skills transfer</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                  <div>
                    <p className="font-medium text-gray-900">Indigenous Organizations</p>
                    <p className="text-sm text-gray-600">Cultural guidance, community access, co-design services</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Transform Regional Insights into Local Impact
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            These regional insights provide a roadmap for expanding services, optimizing resources, 
            and creating location-specific strategies that honor local community needs and strengths.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/analysis"
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Back to Analysis
            </Link>
            <button className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600">
              Download Regional Report
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}