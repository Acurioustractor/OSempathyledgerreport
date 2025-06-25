'use client'

import { BarChart3, TrendingUp, MapPin, Users, MessageSquare, Heart } from 'lucide-react'

interface OverviewDashboardProps {
  analytics: any
}

export default function OverviewDashboard({ analytics }: OverviewDashboardProps) {
  if (!analytics) return null

  return (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Storytellers</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {analytics.overview?.totalStorytellers || 0}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Across {analytics.overview?.locationsCount || 0} locations
              </p>
            </div>
            <Users className="w-12 h-12 text-orange-sky opacity-20" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Themes Identified</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {analytics.themes?.total || 0}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {analytics.themes?.withQuotes || 0} with quotes
              </p>
            </div>
            <BarChart3 className="w-12 h-12 text-blue-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Quotes Collected</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {analytics.quotes?.total || 0}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Avg {analytics.quotes?.averageLength || 0} characters
              </p>
            </div>
            <MessageSquare className="w-12 h-12 text-green-500 opacity-20" />
          </div>
        </div>
      </div>

      {/* Role Distribution */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Storyteller Distribution</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="relative inline-flex items-center justify-center">
              <svg className="w-32 h-32">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#E5E7EB"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#FF6B35"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${(analytics.storytellers?.byRole?.volunteers / analytics.overview?.totalStorytellers) * 352} 352`}
                  className="transform -rotate-90 origin-center"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics.storytellers?.byRole?.volunteers || 0}
                  </p>
                  <p className="text-xs text-gray-500">Volunteers</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="relative inline-flex items-center justify-center">
              <svg className="w-32 h-32">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#E5E7EB"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#3B82F6"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${(analytics.storytellers?.byRole?.friends / analytics.overview?.totalStorytellers) * 352} 352`}
                  className="transform -rotate-90 origin-center"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics.storytellers?.byRole?.friends || 0}
                  </p>
                  <p className="text-xs text-gray-500">Friends</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="relative inline-flex items-center justify-center">
              <svg className="w-32 h-32">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#E5E7EB"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#10B981"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${(analytics.storytellers?.byRole?.serviceProviders / analytics.overview?.totalStorytellers) * 352} 352`}
                  className="transform -rotate-90 origin-center"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics.storytellers?.byRole?.serviceProviders || 0}
                  </p>
                  <p className="text-xs text-gray-500">Service Providers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Themes */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Most Discussed Themes</h3>
        <div className="space-y-4">
          {analytics.themes?.topByStorytellers?.slice(0, 5).map((theme: any) => (
            <div key={theme.id} className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">{theme.name}</h4>
                <p className="text-sm text-gray-500">{theme.category}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {theme.storytellerCount} storytellers
                  </p>
                  <p className="text-xs text-gray-500">{theme.quoteCount} quotes</p>
                </div>
                <div className="w-32 bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-orange-sky"
                    style={{ width: `${(theme.storytellerCount / analytics.overview?.totalStorytellers) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Geographic Distribution */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Geographic Reach</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {analytics.storytellers?.byLocation?.slice(0, 6).map((location: any) => (
            <div key={location.location} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">{location.location}</span>
                <MapPin className="w-4 h-4 text-gray-400" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{location.count}</p>
              <div className="mt-2 flex gap-2 text-xs">
                <span className="text-orange-sky">
                  {location.roles?.volunteers || 0} volunteers
                </span>
                <span className="text-blue-500">
                  {location.roles?.friends || 0} friends
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Impact Summary */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-lg">
        <div className="flex items-center gap-4">
          <Heart className="w-8 h-8 text-orange-sky" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Impact at a Glance</h3>
            <p className="text-gray-600 mt-1">
              {analytics.overview?.totalStorytellers || 0} voices sharing {analytics.quotes?.total || 0} insights 
              across {analytics.overview?.locationsCount || 0} communities, creating {analytics.themes?.total || 0} pathways 
              for connection and support.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}