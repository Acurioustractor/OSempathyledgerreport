'use client'

import { useState } from 'react'
import { Smile, Meh, Frown, Heart, Lightbulb, Shield, Eye } from 'lucide-react'
import Link from 'next/link'

interface EmotionData {
  emotion: string
  icon: React.ReactNode
  color: string
  percentage: number
  count: number
  examples: string[]
}

interface SentimentAnalysisProps {
  analytics: any
}

export default function SentimentAnalysis({ analytics }: SentimentAnalysisProps) {
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionData | null>(null)
  const [selectedRole, setSelectedRole] = useState<'all' | 'volunteers' | 'friends' | 'service-providers'>('all')

  // Simulate emotion analysis based on theme categories
  const emotionData: EmotionData[] = [
    {
      emotion: 'Hope & Optimism',
      icon: <Lightbulb className="w-6 h-6" />,
      color: 'bg-yellow-500',
      percentage: 35,
      count: Math.round((analytics?.quotes?.total || 0) * 0.35),
      examples: [
        "I feel like I belong somewhere",
        "This is my way of giving back to the community",
        "It's been a good opportunity to get out and about"
      ]
    },
    {
      emotion: 'Gratitude',
      icon: <Heart className="w-6 h-6" />,
      color: 'bg-red-500',
      percentage: 28,
      count: Math.round((analytics?.quotes?.total || 0) * 0.28),
      examples: [
        "They remember my name, that means something",
        "I really appreciate the work they do",
        "God bless you all, you got a heart of gold"
      ]
    },
    {
      emotion: 'Connection',
      icon: <Smile className="w-6 h-6" />,
      color: 'bg-blue-500',
      percentage: 22,
      count: Math.round((analytics?.quotes?.total || 0) * 0.22),
      examples: [
        "It's not just about the washing, it's about the conversation",
        "We've become quite close",
        "I love the conversations"
      ]
    },
    {
      emotion: 'Resilience',
      icon: <Shield className="w-6 h-6" />,
      color: 'bg-green-500',
      percentage: 10,
      count: Math.round((analytics?.quotes?.total || 0) * 0.10),
      examples: [
        "You have to force yourself to do it, but it's really important",
        "I've learned a lot of things",
        "Starting a new life here"
      ]
    },
    {
      emotion: 'Challenges',
      icon: <Frown className="w-6 h-6" />,
      color: 'bg-gray-500',
      percentage: 5,
      count: Math.round((analytics?.quotes?.total || 0) * 0.05),
      examples: [
        "It's a very lonely world for me",
        "I lost a lot too",
        "It's very difficult for me"
      ]
    }
  ]

  const getRoleEmotionData = () => {
    if (selectedRole === 'all') return emotionData
    
    // Adjust percentages based on role
    const roleMultipliers = {
      volunteers: { 'Hope & Optimism': 1.2, 'Gratitude': 1.1, 'Connection': 1.3 },
      friends: { 'Challenges': 1.5, 'Resilience': 1.3, 'Gratitude': 1.2 },
      'service-providers': { 'Hope & Optimism': 1.1, 'Connection': 1.2, 'Resilience': 1.1 }
    }

    return emotionData.map(emotion => {
      const multiplier = roleMultipliers[selectedRole]?.[emotion.emotion] || 1
      return {
        ...emotion,
        percentage: Math.min(emotion.percentage * multiplier, 100),
        count: Math.round(emotion.count * multiplier)
      }
    })
  }

  const displayData = getRoleEmotionData()
  const maxPercentage = Math.max(...displayData.map(d => d.percentage))

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Analyze sentiment for:</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-sky"
            >
              <option value="all">All Voices</option>
              <option value="volunteers">Volunteer Voices</option>
              <option value="friends">Friend Voices</option>
              <option value="service-providers">Service Provider Voices</option>
            </select>
          </div>
          
          <Link
            href="/analysis/insights/sentiment"
            className="px-4 py-2 bg-orange-sky text-white rounded-lg hover:bg-orange-600 flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            View Sentiment Insights
          </Link>
        </div>
      </div>

      {/* Emotion Bars */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Emotional Landscape</h3>
        
        <div className="space-y-4">
          {displayData.map((emotion) => (
            <div
              key={emotion.emotion}
              className="cursor-pointer group"
              onClick={() => setSelectedEmotion(emotion)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${emotion.color} text-white`}>
                    {emotion.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{emotion.emotion}</h4>
                    <p className="text-sm text-gray-500">{emotion.count} quotes</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-gray-900">
                  {emotion.percentage}%
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full ${emotion.color} transition-all duration-500 ease-out`}
                  style={{ width: `${(emotion.percentage / maxPercentage) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Emotion Details */}
      {selectedEmotion && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-lg ${selectedEmotion.color} text-white`}>
                {selectedEmotion.icon}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{selectedEmotion.emotion}</h3>
                <p className="text-gray-600">{selectedEmotion.count} quotes expressing this emotion</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedEmotion(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          {/* Example Quotes */}
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Representative Quotes</h4>
            <div className="space-y-4">
              {selectedEmotion.examples.map((quote, index) => (
                <blockquote
                  key={index}
                  className="pl-4 border-l-4 border-gray-200 text-gray-700 italic"
                >
                  "{quote}"
                </blockquote>
              ))}
            </div>
          </div>

          {/* Related Themes */}
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Common Themes</h4>
            <div className="flex flex-wrap gap-2">
              {['Connection', 'Support', 'Hope', 'Community', 'Dignity'].map(theme => (
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
      )}

      {/* Word Cloud Preview */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Common Words & Phrases</h3>
        <div className="flex flex-wrap gap-3 justify-center">
          {[
            { text: 'community', size: 'text-3xl' },
            { text: 'connection', size: 'text-2xl' },
            { text: 'dignity', size: 'text-xl' },
            { text: 'volunteer', size: 'text-2xl' },
            { text: 'conversation', size: 'text-3xl' },
            { text: 'belonging', size: 'text-lg' },
            { text: 'support', size: 'text-2xl' },
            { text: 'grateful', size: 'text-xl' },
            { text: 'opportunity', size: 'text-lg' },
            { text: 'friendship', size: 'text-2xl' },
            { text: 'change', size: 'text-lg' },
            { text: 'hope', size: 'text-xl' }
          ].map((word, index) => (
            <span
              key={index}
              className={`${word.size} font-semibold text-gray-700 hover:text-orange-sky transition-colors cursor-pointer`}
            >
              {word.text}
            </span>
          ))}
        </div>
      </div>

      {/* Insights CTA */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Understanding Emotional Impact
            </h3>
            <p className="text-gray-600">
              Discover how to create more positive experiences based on emotional insights
            </p>
          </div>
          <Link
            href="/analysis/insights/sentiment"
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
          >
            <Heart className="w-5 h-5" />
            Explore Emotional Insights
          </Link>
        </div>
      </div>
    </div>
  )
}