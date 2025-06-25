/**
 * Analysis Engine for Empathy Ledger
 * Processes transcripts, quotes, and themes to extract actionable insights
 */

interface StorytellerData {
  id: string
  role: 'friend' | 'volunteer'
  themes: string[]
  quotes: string[]
  transcript?: string
  location: string
  journey?: string
}

interface EmotionAnalysis {
  dominant: string
  score: number
  timeline: { timestamp: string; emotion: string; score: number }[]
}

interface InsightPattern {
  pattern: string
  frequency: number
  examples: string[]
  actionable: boolean
  suggestedAction?: string
}

export class EmpathyAnalysisEngine {
  // Emotion keywords for basic sentiment analysis
  private emotionKeywords = {
    hope: ['hope', 'future', 'better', 'optimistic', 'looking forward', 'excited'],
    gratitude: ['grateful', 'thankful', 'appreciate', 'blessed', 'lucky'],
    connection: ['friend', 'community', 'together', 'belong', 'family', 'support'],
    struggle: ['hard', 'difficult', 'tough', 'challenge', 'struggle', 'alone'],
    dignity: ['respect', 'valued', 'human', 'worthy', 'proud', 'dignity'],
    growth: ['changed', 'learned', 'grew', 'different', 'better', 'improved']
  }

  // Service-related keywords for decision insights
  private serviceKeywords = {
    laundry: ['wash', 'clothes', 'clean', 'laundry', 'washing'],
    shower: ['shower', 'wash', 'hygiene', 'clean myself'],
    conversation: ['talk', 'chat', 'listen', 'heard', 'conversation', 'yarn'],
    community: ['belong', 'accepted', 'welcome', 'community', 'friends'],
    practical: ['help', 'service', 'need', 'access', 'support']
  }

  /**
   * Analyze emotional journey from quotes and transcripts
   */
  analyzeEmotionalJourney(data: StorytellerData): EmotionAnalysis {
    const emotions: Record<string, number> = {}
    const timeline: EmotionAnalysis['timeline'] = []

    // Analyze quotes for emotions
    data.quotes.forEach((quote, index) => {
      const quoteEmotions = this.detectEmotions(quote)
      Object.entries(quoteEmotions).forEach(([emotion, score]) => {
        emotions[emotion] = (emotions[emotion] || 0) + score
        timeline.push({
          timestamp: `quote_${index}`,
          emotion,
          score
        })
      })
    })

    // Find dominant emotion
    const dominant = Object.entries(emotions)
      .sort(([, a], [, b]) => b - a)[0]

    return {
      dominant: dominant?.[0] || 'neutral',
      score: dominant?.[1] || 0,
      timeline
    }
  }

  /**
   * Extract decision-making insights from patterns
   */
  extractDecisionInsights(storytellers: StorytellerData[]): InsightPattern[] {
    const patterns: InsightPattern[] = []
    
    // Pattern 1: Service needs by location
    const locationNeeds = this.analyzeLocationNeeds(storytellers)
    patterns.push(...locationNeeds)

    // Pattern 2: Role-based perspectives
    const roleInsights = this.analyzeRolePerspectives(storytellers)
    patterns.push(...roleInsights)

    // Pattern 3: Theme evolution
    const themeEvolution = this.analyzeThemeEvolution(storytellers)
    patterns.push(...themeEvolution)

    return patterns.sort((a, b) => b.frequency - a.frequency)
  }

  /**
   * Generate visualization-ready data
   */
  generateVisualizationData(storytellers: StorytellerData[]) {
    return {
      // For emotion flow visualization
      emotionFlow: this.generateEmotionFlow(storytellers),
      
      // For decision matrix
      decisionMatrix: this.generateDecisionMatrix(storytellers),
      
      // For voice comparison
      voiceComparison: this.generateVoiceComparison(storytellers),
      
      // For impact measurement
      impactMetrics: this.generateImpactMetrics(storytellers)
    }
  }

  /**
   * Detect emotions in text
   */
  private detectEmotions(text: string): Record<string, number> {
    const emotions: Record<string, number> = {}
    const lowerText = text.toLowerCase()

    Object.entries(this.emotionKeywords).forEach(([emotion, keywords]) => {
      const score = keywords.reduce((sum, keyword) => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi')
        const matches = lowerText.match(regex)
        return sum + (matches?.length || 0)
      }, 0)
      
      if (score > 0) emotions[emotion] = score
    })

    return emotions
  }

  /**
   * Analyze service needs by location
   */
  private analyzeLocationNeeds(storytellers: StorytellerData[]): InsightPattern[] {
    const locationPatterns: Record<string, Record<string, number>> = {}

    storytellers.forEach(st => {
      if (!locationPatterns[st.location]) {
        locationPatterns[st.location] = {}
      }

      // Count service mentions
      const allText = [...st.quotes, st.transcript || ''].join(' ').toLowerCase()
      Object.entries(this.serviceKeywords).forEach(([service, keywords]) => {
        const count = keywords.reduce((sum, keyword) => {
          const regex = new RegExp(`\\b${keyword}\\b`, 'gi')
          const matches = allText.match(regex)
          return sum + (matches?.length || 0)
        }, 0)
        
        if (count > 0) {
          locationPatterns[st.location][service] = 
            (locationPatterns[st.location][service] || 0) + count
        }
      })
    })

    // Convert to insights
    return Object.entries(locationPatterns).map(([location, services]) => {
      const topNeed = Object.entries(services)
        .sort(([, a], [, b]) => b - a)[0]
      
      return {
        pattern: `${location} has high demand for ${topNeed?.[0] || 'services'}`,
        frequency: topNeed?.[1] || 0,
        examples: [`${topNeed?.[1]} mentions of ${topNeed?.[0]} services`],
        actionable: true,
        suggestedAction: `Consider increasing ${topNeed?.[0]} services in ${location}`
      }
    })
  }

  /**
   * Analyze different perspectives between roles
   */
  private analyzeRolePerspectives(storytellers: StorytellerData[]): InsightPattern[] {
    const friendThemes = new Map<string, number>()
    const volunteerThemes = new Map<string, number>()

    storytellers.forEach(st => {
      const themeMap = st.role === 'friend' ? friendThemes : volunteerThemes
      st.themes.forEach(theme => {
        themeMap.set(theme, (themeMap.get(theme) || 0) + 1)
      })
    })

    // Find unique perspectives
    const insights: InsightPattern[] = []
    
    // Themes more common in friends
    friendThemes.forEach((count, theme) => {
      const volunteerCount = volunteerThemes.get(theme) || 0
      if (count > volunteerCount * 1.5) {
        insights.push({
          pattern: `Friends emphasize "${theme}" more than volunteers`,
          frequency: count,
          examples: [`${count} friends vs ${volunteerCount} volunteers mentioned this`],
          actionable: true,
          suggestedAction: `Train volunteers to better understand "${theme}" from friend perspective`
        })
      }
    })

    return insights
  }

  /**
   * Analyze how themes evolve over time
   */
  private analyzeThemeEvolution(storytellers: StorytellerData[]): InsightPattern[] {
    // Simplified - in real implementation would use actual timestamps
    const earlyThemes = new Set<string>()
    const laterThemes = new Set<string>()

    storytellers.forEach((st, index) => {
      const isEarly = index < storytellers.length / 2
      st.themes.forEach(theme => {
        if (isEarly) earlyThemes.add(theme)
        else laterThemes.add(theme)
      })
    })

    const newThemes = Array.from(laterThemes).filter(t => !earlyThemes.has(t))
    
    if (newThemes.length > 0) {
      return [{
        pattern: 'New themes emerging in recent stories',
        frequency: newThemes.length,
        examples: newThemes,
        actionable: true,
        suggestedAction: `Investigate emerging needs: ${newThemes.join(', ')}`
      }]
    }

    return []
  }

  /**
   * Generate emotion flow data for visualization
   */
  private generateEmotionFlow(storytellers: StorytellerData[]) {
    return storytellers.map(st => ({
      id: st.id,
      role: st.role,
      emotions: this.analyzeEmotionalJourney(st),
      location: st.location
    }))
  }

  /**
   * Generate decision matrix for actionable insights
   */
  private generateDecisionMatrix(storytellers: StorytellerData[]) {
    const themeFrequency = new Map<string, number>()
    const themeSentiment = new Map<string, number>()

    storytellers.forEach(st => {
      const emotions = this.analyzeEmotionalJourney(st)
      st.themes.forEach(theme => {
        themeFrequency.set(theme, (themeFrequency.get(theme) || 0) + 1)
        themeSentiment.set(theme, 
          (themeSentiment.get(theme) || 0) + 
          (emotions.dominant === 'hope' || emotions.dominant === 'gratitude' ? 1 : -1)
        )
      })
    })

    return Array.from(themeFrequency.entries()).map(([theme, frequency]) => ({
      theme,
      frequency,
      sentiment: (themeSentiment.get(theme) || 0) / frequency,
      actionability: frequency > 10 ? 'high' : frequency > 5 ? 'medium' : 'low'
    }))
  }

  /**
   * Generate voice comparison between friends and volunteers
   */
  private generateVoiceComparison(storytellers: StorytellerData[]) {
    const friendData = storytellers.filter(st => st.role === 'friend')
    const volunteerData = storytellers.filter(st => st.role === 'volunteer')

    return {
      friends: {
        count: friendData.length,
        topThemes: this.getTopThemes(friendData),
        dominantEmotions: this.getDominantEmotions(friendData),
        uniqueLanguage: this.getUniqueLanguage(friendData, volunteerData)
      },
      volunteers: {
        count: volunteerData.length,
        topThemes: this.getTopThemes(volunteerData),
        dominantEmotions: this.getDominantEmotions(volunteerData),
        uniqueLanguage: this.getUniqueLanguage(volunteerData, friendData)
      }
    }
  }

  /**
   * Generate impact metrics
   */
  private generateImpactMetrics(storytellers: StorytellerData[]) {
    const positiveOutcomes = storytellers.filter(st => {
      const emotions = this.analyzeEmotionalJourney(st)
      return emotions.dominant === 'hope' || emotions.dominant === 'gratitude'
    })

    return {
      positiveImpactRate: (positiveOutcomes.length / storytellers.length) * 100,
      topImpactThemes: this.getTopThemes(positiveOutcomes),
      transformationStories: positiveOutcomes.length
    }
  }

  // Helper methods
  private getTopThemes(storytellers: StorytellerData[], limit = 5): string[] {
    const themeCounts = new Map<string, number>()
    storytellers.forEach(st => {
      st.themes.forEach(theme => {
        themeCounts.set(theme, (themeCounts.get(theme) || 0) + 1)
      })
    })
    
    return Array.from(themeCounts.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([theme]) => theme)
  }

  private getDominantEmotions(storytellers: StorytellerData[]): Record<string, number> {
    const emotions: Record<string, number> = {}
    storytellers.forEach(st => {
      const analysis = this.analyzeEmotionalJourney(st)
      emotions[analysis.dominant] = (emotions[analysis.dominant] || 0) + 1
    })
    return emotions
  }

  private getUniqueLanguage(
    group1: StorytellerData[], 
    group2: StorytellerData[]
  ): string[] {
    const group1Words = new Set<string>()
    const group2Words = new Set<string>()

    group1.forEach(st => {
      st.quotes.forEach(quote => {
        quote.toLowerCase().split(/\s+/).forEach(word => {
          if (word.length > 4) group1Words.add(word)
        })
      })
    })

    group2.forEach(st => {
      st.quotes.forEach(quote => {
        quote.toLowerCase().split(/\s+/).forEach(word => {
          if (word.length > 4) group2Words.add(word)
        })
      })
    })

    return Array.from(group1Words)
      .filter(word => !group2Words.has(word))
      .slice(0, 20)
  }
}

// Export singleton instance
export const analysisEngine = new EmpathyAnalysisEngine()

// Usage example:
/*
const insights = analysisEngine.extractDecisionInsights(storytellerData)
const vizData = analysisEngine.generateVisualizationData(storytellerData)

// Use insights for decision making
insights.forEach(insight => {
  if (insight.actionable && insight.frequency > 10) {
    console.log(`Action needed: ${insight.suggestedAction}`)
  }
})
*/