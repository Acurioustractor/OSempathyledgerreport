'use client'

import { useState, useEffect, useMemo } from 'react'
import { Grid3X3, List, Filter, X, ChevronDown } from 'lucide-react'
import StoryCard from '@/components/story/StoryCard'
import StoryList from '@/components/story/StoryList'
import { Story } from '@/types'

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  
  // Filter states
  const [selectedStoryteller, setSelectedStoryteller] = useState<string>('all')
  const [selectedThemes, setSelectedThemes] = useState<string[]>([])
  const [showVideosOnly, setShowVideosOnly] = useState(false)
  const [dateRange, setDateRange] = useState({ start: '', end: '' })

  // Load stories data
  useEffect(() => {
    fetch('/data/stories.json')
      .then(res => res.json())
      .then(data => {
        setStories(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error loading stories:', err)
        setLoading(false)
      })
  }, [])

  // Extract unique values for filters
  const { storytellers, themes } = useMemo(() => {
    const storytellersSet = new Set<string>()
    const themesSet = new Set<string>()

    stories.forEach(story => {
      // Extract unique storytellers
      story.storytellerNames?.forEach(name => storytellersSet.add(name))
      // Extract themes
      story.themeNames?.forEach(theme => themesSet.add(theme))
    })

    return {
      storytellers: Array.from(storytellersSet).sort(),
      themes: Array.from(themesSet).sort()
    }
  }, [stories])

  // Filter stories
  const filteredStories = useMemo(() => {
    return stories.filter(story => {
      // Storyteller filter
      if (selectedStoryteller !== 'all') {
        if (!story.storytellerNames?.includes(selectedStoryteller)) {
          return false
        }
      }

      // Video filter
      if (showVideosOnly && !story.hasVideo) {
        return false
      }

      // Themes filter
      if (selectedThemes.length > 0) {
        const hasSelectedTheme = story.themeNames?.some(theme => 
          selectedThemes.includes(theme)
        )
        if (!hasSelectedTheme) return false
      }

      // Date range filter
      if (dateRange.start && story.createdAt) {
        if (story.createdAt < dateRange.start) return false
      }
      if (dateRange.end && story.createdAt) {
        if (story.createdAt > dateRange.end) return false
      }

      return true
    })
  }, [stories, selectedStoryteller, selectedThemes, showVideosOnly, dateRange])

  const toggleTheme = (theme: string) => {
    setSelectedThemes(prev => 
      prev.includes(theme) 
        ? prev.filter(t => t !== theme)
        : [...prev, theme]
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Stories</h1>
                <p className="mt-2 text-gray-600">
                  {filteredStories.length} of {stories.length} stories displayed
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Mobile filter toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="sm:hidden inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                  {(selectedStoryteller !== 'all' || selectedThemes.length > 0 || showVideosOnly) && (
                    <span className="ml-2 bg-orange-sky text-white text-xs px-2 py-1 rounded-full">
                      {selectedThemes.length + (selectedStoryteller !== 'all' ? 1 : 0) + (showVideosOnly ? 1 : 0)}
                    </span>
                  )}
                </button>

                {/* View mode toggle */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                    aria-label="Grid view"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                    aria-label="List view"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar - Desktop */}
          <aside className={`${showFilters ? 'block' : 'hidden'} sm:block w-full sm:w-64 flex-shrink-0`}>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-4">Filters</h2>
              
              {/* Storyteller Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Storyteller
                </label>
                <select
                  value={selectedStoryteller}
                  onChange={(e) => setSelectedStoryteller(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-sky focus:border-orange-sky"
                >
                  <option value="all">All Storytellers</option>
                  {storytellers.map(storyteller => (
                    <option key={storyteller} value={storyteller}>{storyteller}</option>
                  ))}
                </select>
              </div>

              {/* Video Filter */}
              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showVideosOnly}
                    onChange={(e) => setShowVideosOnly(e.target.checked)}
                    className="mr-2 text-orange-sky focus:ring-orange-sky"
                  />
                  <span className="text-sm font-medium text-gray-700">Video Stories Only</span>
                </label>
              </div>

              {/* Themes Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Themes
                </label>
                {themes.length > 0 ? (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {themes.map(theme => (
                      <label key={theme} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedThemes.includes(theme)}
                          onChange={() => toggleTheme(theme)}
                          className="mr-2 text-orange-sky focus:ring-orange-sky"
                        />
                        <span className="text-sm text-gray-700 capitalize">{theme}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">No themes available</p>
                )}
              </div>

              {/* Date Range Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Collection Date
                </label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-sky focus:border-orange-sky mb-2"
                  placeholder="Start date"
                />
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-sky focus:border-orange-sky"
                  placeholder="End date"
                />
              </div>

              {/* Clear Filters */}
              {(selectedStoryteller !== 'all' || selectedThemes.length > 0 || showVideosOnly || dateRange.start || dateRange.end) && (
                <button
                  onClick={() => {
                    setSelectedStoryteller('all')
                    setSelectedThemes([])
                    setShowVideosOnly(false)
                    setDateRange({ start: '', end: '' })
                  }}
                  className="w-full px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </aside>

          {/* Stories Grid/List */}
          <main className="flex-1">
            {filteredStories.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <p className="text-gray-500">No stories match your filters</p>
                <button
                  onClick={() => {
                    setSelectedStoryteller('all')
                    setSelectedThemes([])
                    setShowVideosOnly(false)
                    setDateRange({ start: '', end: '' })
                  }}
                  className="mt-4 text-orange-sky hover:underline"
                >
                  Clear filters
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStories.map(story => (
                  <StoryCard key={story.id} story={story} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredStories.map(story => (
                  <StoryList key={story.id} story={story} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}