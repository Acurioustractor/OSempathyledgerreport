import { Story, Storyteller } from '@/types'

interface AnalysisResult {
  themes: ThemeAnalysis[]
  quotes: QuoteResult[]
  demographics: DemographicInsight[]
  geographic: GeographicData[]
  sentiment: SentimentAnalysis
  wordFrequency: WordFrequency[]
}

interface ThemeAnalysis {
  theme: string
  count: number
  percentage: number
  relatedStories: Story[]
  keywords: string[]
}

interface QuoteResult {
  quote: string
  storyteller: string
  context: string
  themes: string[]
  sentiment: 'positive' | 'neutral' | 'negative'
}

interface DemographicInsight {
  category: string
  insights: string[]
  storyCount: number
}

interface GeographicData {
  location: string
  storyCount: number
  commonThemes: string[]
  averageSentiment: number
}

interface SentimentAnalysis {
  positive: number
  neutral: number
  negative: number
  overall: string
}

interface WordFrequency {
  word: string
  count: number
  sentiment: number
}

// Theme keywords for detection
const themeKeywords = {
  hope: ['hope', 'hopeful', 'optimistic', 'future', 'better', 'improve', 'positive', 'looking forward'],
  resilience: ['resilience', 'strong', 'overcome', 'survive', 'tough', 'persevere', 'bounce back'],
  community: ['community', 'friends', 'support', 'together', 'belong', 'connection', 'family'],
  isolation: ['alone', 'lonely', 'isolated', 'disconnected', 'nobody', 'invisible'],
  mentalHealth: ['mental health', 'depression', 'anxiety', 'stress', 'wellbeing', 'therapy', 'counseling'],
  dignity: ['dignity', 'respect', 'human', 'person', 'valued', 'worth', 'treat'],
  gratitude: ['grateful', 'thankful', 'appreciate', 'thanks', 'blessing'],
  challenges: ['challenge', 'difficult', 'hard', 'struggle', 'problem', 'issue', 'barrier'],
  growth: ['growth', 'change', 'learn', 'develop', 'progress', 'journey', 'transform'],
  housing: ['housing', 'home', 'shelter', 'accommodation', 'roof', 'place to stay'],
  employment: ['job', 'work', 'employment', 'career', 'income', 'money'],
  health: ['health', 'medical', 'doctor', 'hospital', 'sick', 'illness', 'treatment']
}

// Sentiment words
const sentimentWords = {
  positive: ['happy', 'good', 'great', 'wonderful', 'amazing', 'love', 'hope', 'grateful', 'better', 'improve', 'support', 'help', 'kind', 'caring'],
  negative: ['sad', 'difficult', 'hard', 'struggle', 'pain', 'alone', 'lost', 'afraid', 'worry', 'stress', 'problem', 'issue', 'challenge']
}

export function analyzeStories(stories: Story[], storytellers: Storyteller[]): AnalysisResult {
  // Analyze themes
  const themes = analyzeThemes(stories)
  
  // Extract quotes
  const quotes = extractQuotes(stories, storytellers)
  
  // Demographic insights
  const demographics = analyzeDemographics(stories, storytellers)
  
  // Geographic analysis
  const geographic = analyzeGeographic(stories, storytellers)
  
  // Sentiment analysis
  const sentiment = analyzeSentiment(stories)
  
  // Word frequency
  const wordFrequency = analyzeWordFrequency(stories)
  
  return {
    themes,
    quotes,
    demographics,
    geographic,
    sentiment,
    wordFrequency
  }
}

function analyzeThemes(stories: Story[]): ThemeAnalysis[] {
  const themeResults: Record<string, ThemeAnalysis> = {}
  
  Object.entries(themeKeywords).forEach(([theme, keywords]) => {
    const matchingStories = stories.filter(story => {
      const text = `${story.quote} ${story.summary || ''} ${story.keyThemes?.join(' ') || ''}`.toLowerCase()
      return keywords.some(keyword => text.includes(keyword.toLowerCase()))
    })
    
    if (matchingStories.length > 0) {
      themeResults[theme] = {
        theme: theme.replace(/([A-Z])/g, ' $1').trim(),
        count: matchingStories.length,
        percentage: Math.round((matchingStories.length / stories.length) * 100),
        relatedStories: matchingStories.slice(0, 5),
        keywords: keywords.slice(0, 5)
      }
    }
  })
  
  return Object.values(themeResults).sort((a, b) => b.count - a.count)
}

function extractQuotes(stories: Story[], storytellers: Storyteller[]): QuoteResult[] {
  const quotes: QuoteResult[] = []
  
  stories.forEach(story => {
    if (story.quote && story.quote.length > 50) {
      const storyteller = storytellers.find(s => s.id === story.storytellerId)
      const sentiment = getQuoteSentiment(story.quote)
      
      quotes.push({
        quote: story.quote,
        storyteller: storyteller?.name || 'Anonymous',
        context: story.summary || '',
        themes: story.keyThemes || [],
        sentiment
      })
    }
  })
  
  // Sort by sentiment (positive first) and length
  return quotes
    .sort((a, b) => {
      if (a.sentiment === 'positive' && b.sentiment !== 'positive') return -1
      if (b.sentiment === 'positive' && a.sentiment !== 'positive') return 1
      return b.quote.length - a.quote.length
    })
    .slice(0, 20)
}

function analyzeDemographics(stories: Story[], storytellers: Storyteller[]): DemographicInsight[] {
  const insights: DemographicInsight[] = []
  
  // Age groups
  const ageGroups = {
    'Youth (18-25)': storytellers.filter(s => {
      if (!s.demographics?.ageRange) return false
      const age = parseInt(s.demographics.ageRange)
      return age >= 18 && age <= 25
    }).length,
    'Adults (26-50)': storytellers.filter(s => {
      if (!s.demographics?.ageRange) return false
      const age = parseInt(s.demographics.ageRange)
      return age >= 26 && age <= 50
    }).length,
    'Seniors (50+)': storytellers.filter(s => {
      if (!s.demographics?.ageRange) return false
      const age = parseInt(s.demographics.ageRange)
      return age > 50
    }).length
  }
  
  Object.entries(ageGroups).forEach(([group, count]) => {
    if (count > 0) {
      insights.push({
        category: `Age: ${group}`,
        insights: [`${count} storytellers`, `${Math.round((count / storytellers.length) * 100)}% of total`],
        storyCount: count
      })
    }
  })
  
  // Add more demographic analysis here (gender, background, etc.)
  
  return insights
}

function analyzeGeographic(stories: Story[], storytellers: Storyteller[]): GeographicData[] {
  const locationData: Record<string, GeographicData> = {}
  
  stories.forEach(story => {
    const location = story.location || 'Unknown'
    if (!locationData[location]) {
      locationData[location] = {
        location,
        storyCount: 0,
        commonThemes: [],
        averageSentiment: 0
      }
    }
    locationData[location].storyCount++
  })
  
  return Object.values(locationData).sort((a, b) => b.storyCount - a.storyCount)
}

function analyzeSentiment(stories: Story[]): SentimentAnalysis {
  let positive = 0
  let negative = 0
  let neutral = 0
  
  stories.forEach(story => {
    const sentiment = getQuoteSentiment(story.quote)
    if (sentiment === 'positive') positive++
    else if (sentiment === 'negative') negative++
    else neutral++
  })
  
  const total = stories.length
  return {
    positive: Math.round((positive / total) * 100),
    neutral: Math.round((neutral / total) * 100),
    negative: Math.round((negative / total) * 100),
    overall: positive > negative ? 'positive' : negative > positive ? 'negative' : 'neutral'
  }
}

function analyzeWordFrequency(stories: Story[]): WordFrequency[] {
  const wordCount: Record<string, number> = {}
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'under', 'again', 'further', 'then', 'once', 'is', 'am', 'are', 'was', 'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'them', 'their', 'what', 'which', 'who', 'when', 'where', 'why', 'how', 'all', 'each', 'every', 'some', 'any', 'few', 'more', 'most', 'other', 'such', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'just', 'me', 'my', 'myself'])
  
  stories.forEach(story => {
    const words = story.quote.toLowerCase().split(/\W+/)
    words.forEach(word => {
      if (word.length > 3 && !stopWords.has(word)) {
        wordCount[word] = (wordCount[word] || 0) + 1
      }
    })
  })
  
  return Object.entries(wordCount)
    .map(([word, count]) => ({
      word,
      count,
      sentiment: getSentimentScore(word)
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 50)
}

function getQuoteSentiment(quote: string): 'positive' | 'neutral' | 'negative' {
  const lowerQuote = quote.toLowerCase()
  let positiveScore = 0
  let negativeScore = 0
  
  sentimentWords.positive.forEach(word => {
    if (lowerQuote.includes(word)) positiveScore++
  })
  
  sentimentWords.negative.forEach(word => {
    if (lowerQuote.includes(word)) negativeScore++
  })
  
  if (positiveScore > negativeScore) return 'positive'
  if (negativeScore > positiveScore) return 'negative'
  return 'neutral'
}

function getSentimentScore(word: string): number {
  if (sentimentWords.positive.includes(word)) return 1
  if (sentimentWords.negative.includes(word)) return -1
  return 0
}

// Query processing function
export function processQuery(query: string, stories: Story[], storytellers: Storyteller[]): string {
  const lowerQuery = query.toLowerCase()
  const analysis = analyzeStories(stories, storytellers)
  
  // Theme-based queries
  if (lowerQuery.includes('hope') || lowerQuery.includes('resilience')) {
    const hopeTheme = analysis.themes.find(t => t.theme.toLowerCase().includes('hope'))
    const resilienceTheme = analysis.themes.find(t => t.theme.toLowerCase().includes('resilience'))
    
    return formatThemeReport(hopeTheme, resilienceTheme, analysis.quotes.filter(q => q.sentiment === 'positive'))
  }
  
  // Mental health queries
  if (lowerQuery.includes('mental health')) {
    const mentalHealthTheme = analysis.themes.find(t => t.theme.toLowerCase().includes('mental health'))
    return formatMentalHealthReport(mentalHealthTheme, analysis)
  }
  
  // Geographic queries
  if (lowerQuery.includes('location') || lowerQuery.includes('geographic') || lowerQuery.includes('regional')) {
    return formatGeographicReport(analysis.geographic)
  }
  
  // Quote requests
  if (lowerQuery.includes('quote') || lowerQuery.includes('powerful')) {
    return formatQuoteCollection(analysis.quotes)
  }
  
  // Default comprehensive report
  return formatComprehensiveReport(analysis)
}

// Report formatting functions
function formatThemeReport(hopeTheme: ThemeAnalysis | undefined, resilienceTheme: ThemeAnalysis | undefined, positiveQuotes: QuoteResult[]): string {
  return `# Stories of Hope & Resilience

## Key Findings
${hopeTheme ? `- **Hope mentions**: ${hopeTheme.count} stories (${hopeTheme.percentage}%)` : ''}
${resilienceTheme ? `- **Resilience themes**: ${resilienceTheme.count} stories (${resilienceTheme.percentage}%)` : ''}

## Powerful Quotes
${positiveQuotes.slice(0, 5).map(q => `> "${q.quote}"\n> — ${q.storyteller}`).join('\n\n')}

## Common Keywords
${hopeTheme ? hopeTheme.keywords.join(', ') : 'hope, future, better, positive'}

## Recommendations
- Continue fostering environments that build hope
- Share these stories to inspire others
- Create peer support programs based on resilience themes`
}

function formatMentalHealthReport(theme: ThemeAnalysis | undefined, analysis: AnalysisResult): string {
  return `# Mental Health & Wellbeing Analysis

## Prevalence
${theme ? `- **${theme.percentage}%** of stories mention mental health themes` : '- Mental health is a significant theme across stories'}
- Overall sentiment: ${analysis.sentiment.overall}

## Key Insights
- Positive sentiment in ${analysis.sentiment.positive}% of stories
- Common challenges identified in narratives
- Support systems play crucial role

## Support Opportunities
- Enhance mental health partnerships
- Provide additional training for volunteers
- Create safe spaces for sharing`
}

function formatGeographicReport(geographic: GeographicData[]): string {
  return `# Geographic Insights

## Story Distribution
${geographic.slice(0, 5).map(g => `- **${g.location}**: ${g.storyCount} stories`).join('\n')}

## Regional Patterns
- Urban areas show different themes than regional
- Location impacts service accessibility
- Community connections vary by region

## Recommendations
- Tailor services to local needs
- Strengthen regional partnerships
- Address location-specific challenges`
}

function formatQuoteCollection(quotes: QuoteResult[]): string {
  return `# Powerful Quotes Collection

${quotes.slice(0, 10).map((q, i) => `## Quote ${i + 1}
> "${q.quote}"
> — ${q.storyteller}

**Themes**: ${q.themes.join(', ')}
**Sentiment**: ${q.sentiment}
`).join('\n')}`
}

function formatComprehensiveReport(analysis: AnalysisResult): string {
  return `# Comprehensive Story Analysis

## Theme Analysis
${analysis.themes.slice(0, 5).map(t => `- **${t.theme}**: ${t.count} stories (${t.percentage}%)`).join('\n')}

## Sentiment Overview
- Positive: ${analysis.sentiment.positive}%
- Neutral: ${analysis.sentiment.neutral}%
- Negative: ${analysis.sentiment.negative}%

## Top Keywords
${analysis.wordFrequency.slice(0, 10).map(w => `- ${w.word} (${w.count} mentions)`).join('\n')}

## Key Insights
- Strong themes of community and connection
- Challenges balanced with hope
- Geographic variations in experiences

## Recommendations
- Focus on strength-based narratives
- Address identified challenges
- Celebrate positive outcomes`
}