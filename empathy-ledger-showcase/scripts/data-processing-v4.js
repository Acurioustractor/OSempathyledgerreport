#!/usr/bin/env node

/**
 * Empathy Ledger Data Processing Script v4
 * 
 * STORYTELLER-CENTRIC APPROACH
 * - Primary focus on storytellers (volunteers, friends, service providers)
 * - Themes and quotes linked through storytellers
 * - All Orange Sky themes included
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class StorytellerCentricProcessor {
  constructor(rawData) {
    this.raw = rawData;
    this.processed = {
      storytellers: [],
      stories: [],
      themes: [],
      media: [],
      locations: new Set()
    };
    this.indexes = {
      storiesByStoryteller: {},
      themesByStoryteller: {},
      quotesByStoryteller: {},
      storytellersByLocation: {},
      storytellersByRole: {}
    };
    this.lookups = {
      themes: new Map(),
      media: new Map(),
      storytellers: new Map()
    };
  }

  process() {
    console.log('🚀 Starting storyteller-centric data processing...\n');
    
    // Build lookups first
    this.buildLookups();
    
    // Process in storyteller-centric order
    this.processThemes();        // Get all Orange Sky themes
    this.processMedia();         // Process media and quotes
    this.processStorytellers();  // PRIMARY: Process all storytellers with their data
    this.processStories();       // Stories as supplementary data
    
    // Build indexes and analytics
    this.buildIndexes();
    this.generateAnalytics();
    
    // Save all data
    this.saveData();
    
    return this.getSummary();
  }

  buildLookups() {
    // Theme lookup
    this.raw.themes.records.forEach(record => {
      this.lookups.themes.set(record.id, record);
    });
    
    // Media lookup
    this.raw.media.records.forEach(record => {
      this.lookups.media.set(record.id, record);
    });
    
    // Storyteller lookup
    this.raw.storytellers.records.forEach(record => {
      this.lookups.storytellers.set(record.id, record);
    });
    
    // Quotes lookup
    if (this.raw.quotes && this.raw.quotes.records) {
      this.lookups.quotes = new Map();
      this.raw.quotes.records.forEach(record => {
        this.lookups.quotes.set(record.id, record);
      });
    }
  }

  processThemes() {
    console.log('🏷️ Processing all Orange Sky themes...');
    
    let totalThemes = 0;
    let orangeSkyThemes = 0;
    
    this.raw.themes.records.forEach(record => {
      const fields = record.fields;
      totalThemes++;
      
      // Check if this theme is related to Orange Sky
      const projects = fields['Project (from Related Media)'] || [];
      const isOrangeSky = Array.isArray(projects) ? 
        projects.some(p => p.includes('Orange Sky')) : 
        (typeof projects === 'string' && projects.includes('Orange Sky'));
      
      // Include ALL Orange Sky themes
      if (!isOrangeSky) return;
      
      orangeSkyThemes++;
      
      // Extract theme name
      let themeName = fields['Theme Name'] || fields.Name || 'Unnamed Theme';
      if (themeName === 'Unnamed Theme' && fields.Description) {
        const firstSentence = fields.Description.split(/[.!?]/)[0].trim();
        if (firstSentence.length > 0 && firstSentence.length < 100) {
          themeName = firstSentence;
        } else {
          themeName = fields.Description.substring(0, 50) + '...';
        }
      }
      
      // Get storyteller count from related media
      const storytellerRollup = fields['Storytellers Rollup (from Related Media)'] || [];
      const quotes = fields['Quotes (from Related Media)'] || [];
      
      this.processed.themes.push({
        id: record.id,
        name: themeName,
        description: fields.Description || '',
        category: this.categorizeTheme(fields.Description || ''),
        storytellerCount: Array.isArray(storytellerRollup) ? storytellerRollup.length : 0,
        quoteCount: Array.isArray(quotes) ? quotes.length : 0,
        mediaIds: fields['Related Media'] || [],
        isOrangeSky: true
      });
    });
    
    console.log(`✓ Processed ${orangeSkyThemes} Orange Sky themes (from ${totalThemes} total)\n`);
  }

  processMedia() {
    console.log('📹 Processing media and quotes...');
    
    let orangeSkyMedia = 0;
    let totalQuotes = 0;
    
    this.raw.media.records.forEach(record => {
      const fields = record.fields;
      
      // Check if Orange Sky
      const projects = fields.Project || [];
      const isOrangeSky = Array.isArray(projects) ? 
        projects.some(p => p.includes('Orange Sky')) : 
        (typeof projects === 'string' && projects.includes('Orange Sky'));
      
      if (!isOrangeSky) return;
      
      orangeSkyMedia++;
      
      // Extract quotes and resolve to actual text
      const quoteIds = fields.Quotes || [];
      const resolvedQuotes = [];
      
      if (this.lookups.quotes) {
        quoteIds.forEach(quoteId => {
          const quoteRecord = this.lookups.quotes.get(quoteId);
          if (quoteRecord && quoteRecord.fields) {
            // Try different possible field names for quote text
            const quoteText = quoteRecord.fields.Quote || 
                             quoteRecord.fields.Text || 
                             quoteRecord.fields.Content || 
                             quoteRecord.fields['Quote Text'] ||
                             'Quote content not available';
            resolvedQuotes.push(quoteText);
          }
        });
      }
      
      totalQuotes += resolvedQuotes.length;
      
      const media = {
        id: record.id,
        fileName: fields['File Name'] || 'Untitled',
        type: fields.Type || 'Unknown',
        quotes: resolvedQuotes,  // Now contains actual quote text
        transcription: fields.Transcription || '',
        location: this.extractLocationFromMedia(fields),
        themes: fields.Themes || [],
        storytellerIds: fields.Storyteller || [],
        project: 'Orange Sky'
      };
      
      this.processed.media.push(media);
      
      if (media.location && media.location !== 'Unknown') {
        this.processed.locations.add(media.location);
      }
    });
    
    console.log(`✓ Processed ${orangeSkyMedia} Orange Sky media records with ${totalQuotes} quotes\n`);
  }

  processStorytellers() {
    console.log('👥 Processing Orange Sky storytellers (PRIMARY FOCUS)...');
    
    const roleBreakdown = {
      volunteer: 0,
      friend: 0,
      'service provider': 0,
      other: 0
    };
    
    this.raw.storytellers.records.forEach(record => {
      const fields = record.fields;
      
      // Already filtered for Orange Sky in fetch
      const name = fields.Name || 'Anonymous';
      const role = (fields.Role || 'Unknown').toLowerCase();
      
      // Count roles
      if (role.includes('volunteer')) roleBreakdown.volunteer++;
      else if (role.includes('friend')) roleBreakdown.friend++;
      else if (role.includes('service provider')) roleBreakdown['service provider']++;
      else roleBreakdown.other++;
      
      // Get all themes and quotes for this storyteller
      const mediaIds = fields.Media || [];
      const allThemes = new Set();
      const allQuotes = [];
      
      // Collect themes and quotes from linked media
      mediaIds.forEach(mediaId => {
        const media = this.processed.media.find(m => m.id === mediaId);
        if (media) {
          media.themes.forEach(themeId => allThemes.add(themeId));
          allQuotes.push(...media.quotes);
        }
      });
      
      // Extract location
      const location = fields.Location || fields.City || 
                      (mediaIds.length > 0 ? this.processed.media.find(m => m.id === mediaIds[0])?.location : null) ||
                      'Unknown';
      
      if (location && location !== 'Unknown') {
        this.processed.locations.add(location);
      }
      
      // Generate summary from quotes and transcripts
      const summary = this.generateStorytellerSummary({
        name: name,
        role: role,
        quotes: allQuotes,
        themes: Array.from(allThemes).map(themeId => {
          const theme = this.processed.themes.find(t => t.id === themeId);
          return theme ? theme.name : null;
        }).filter(Boolean),
        mediaTranscripts: mediaIds.map(mediaId => {
          const media = this.processed.media.find(m => m.id === mediaId);
          return media ? media.transcription : '';
        }).filter(Boolean)
      });

      const storyteller = {
        id: record.id,
        name: name,
        role: role,
        location: location,
        profileImage: fields['File Profile Image']?.[0]?.url || null,
        journey: fields.Journey || '',
        summary: summary,
        mediaIds: mediaIds,
        themeIds: Array.from(allThemes),
        themes: Array.from(allThemes).map(themeId => {
          const theme = this.processed.themes.find(t => t.id === themeId);
          return theme ? theme.name : null;
        }).filter(Boolean),
        quotes: allQuotes,
        quoteCount: allQuotes.length,
        transcriptCount: mediaIds.filter(id => {
          const media = this.processed.media.find(m => m.id === id);
          return media && media.transcription;
        }).length,
        hasContentConsent: fields['Consent Status'] === 'Full' || fields['Consent Status'] === 'Content Only',
        hasProfileConsent: fields['Consent Status'] === 'Full',
        privacyLevel: fields['Preferred Anonymity Level'] || 'name-only'
      };
      
      this.processed.storytellers.push(storyteller);
    });
    
    console.log(`✓ Processed ${this.processed.storytellers.length} Orange Sky storytellers`);
    console.log(`  - Volunteers: ${roleBreakdown.volunteer}`);
    console.log(`  - Friends: ${roleBreakdown.friend}`);
    console.log(`  - Service Providers: ${roleBreakdown['service provider']}`);
    console.log(`  - Other: ${roleBreakdown.other}\n`);
  }

  processStories() {
    console.log('📖 Processing stories (supplementary data)...');
    
    let orangeSkyStories = 0;
    
    this.raw.stories.records.forEach(record => {
      const fields = record.fields;
      
      // Check if any linked storyteller is Orange Sky
      const storytellerIds = fields.Storytellers || [];
      const hasOrangeSkyStoryteller = storytellerIds.some(id => 
        this.processed.storytellers.find(st => st.id === id)
      );
      
      if (!hasOrangeSkyStoryteller) return;
      
      orangeSkyStories++;
      
      // Get all themes from storytellers
      const allThemes = new Set();
      storytellerIds.forEach(stId => {
        const storyteller = this.processed.storytellers.find(st => st.id === stId);
        if (storyteller) {
          storyteller.themeIds.forEach(themeId => allThemes.add(themeId));
        }
      });
      
      // Get primary storyteller for thumbnail image
      const primaryStoryteller = this.processed.storytellers.find(st => st.id === storytellerIds[0]);
      
      const story = {
        id: record.id,
        title: fields.Title || 'Untitled Story',
        storyCopy: fields['Story copy'] || '',
        storyTranscript: fields['Story Transcript'] || '',
        excerpt: this.generateExcerpt(fields),
        videoStoryLink: fields['Video Story Link'] || null,
        hasVideo: !!fields['Video Story Link'],
        storytellerIds: storytellerIds,
        storytellerNames: storytellerIds.map(id => {
          const st = this.processed.storytellers.find(s => s.id === id);
          return st ? st.name : 'Unknown';
        }),
        themeIds: Array.from(allThemes),
        location: primaryStoryteller?.location || 'Unknown',
        featured: fields.Featured || false,
        // Add story image if available, fall back to storyteller profile image
        image: fields['Story Image']?.[0] || null,
        profileImage: primaryStoryteller?.profileImage || null,
        createdAt: fields['Created'] || new Date().toISOString()
      };
      
      this.processed.stories.push(story);
    });
    
    console.log(`✓ Processed ${orangeSkyStories} Orange Sky stories\n`);
  }

  buildIndexes() {
    console.log('🔍 Building storyteller-centric indexes...');
    
    // Stories by storyteller
    this.processed.stories.forEach(story => {
      story.storytellerIds.forEach(stId => {
        if (!this.indexes.storiesByStoryteller[stId]) {
          this.indexes.storiesByStoryteller[stId] = [];
        }
        this.indexes.storiesByStoryteller[stId].push(story.id);
      });
    });
    
    // Themes by storyteller
    this.processed.storytellers.forEach(st => {
      this.indexes.themesByStoryteller[st.id] = st.themeIds;
    });
    
    // Quotes by storyteller
    this.processed.storytellers.forEach(st => {
      this.indexes.quotesByStoryteller[st.id] = st.quotes;
    });
    
    // Storytellers by location
    this.processed.storytellers.forEach(st => {
      if (!this.indexes.storytellersByLocation[st.location]) {
        this.indexes.storytellersByLocation[st.location] = [];
      }
      this.indexes.storytellersByLocation[st.location].push(st.id);
    });
    
    // Storytellers by role
    this.processed.storytellers.forEach(st => {
      const roleKey = st.role.toLowerCase();
      if (!this.indexes.storytellersByRole[roleKey]) {
        this.indexes.storytellersByRole[roleKey] = [];
      }
      this.indexes.storytellersByRole[roleKey].push(st.id);
    });
    
    console.log('✓ Built storyteller-centric indexes\n');
  }

  generateAnalytics() {
    console.log('📊 Generating storyteller-focused analytics...');
    
    // Calculate total quotes first
    const totalQuotes = this.processed.storytellers.reduce((sum, st) => sum + st.quoteCount, 0);
    
    const analytics = {
      overview: {
        totalStorytellers: this.processed.storytellers.length,
        totalThemes: this.processed.themes.length,
        totalQuotes: this.processed.storytellers.reduce((sum, st) => sum + st.quoteCount, 0),
        totalStories: this.processed.stories.length,
        totalMedia: this.processed.media.length,
        locationsCount: this.processed.locations.size
      },
      
      storytellers: {
        byRole: {
          volunteers: this.indexes.storytellersByRole['volunteer']?.length || 0,
          friends: this.indexes.storytellersByRole['friend']?.length || 0,
          serviceProviders: this.indexes.storytellersByRole['service provider']?.length || 0,
          other: this.processed.storytellers.filter(st => 
            !['volunteer', 'friend', 'service provider'].includes(st.role.toLowerCase())
          ).length
        },
        
        byLocation: Object.entries(this.indexes.storytellersByLocation)
          .map(([location, storytellerIds]) => ({
            location,
            count: storytellerIds.length,
            roles: {
              volunteers: storytellerIds.filter(id => 
                this.processed.storytellers.find(st => st.id === id)?.role.includes('volunteer')
              ).length,
              friends: storytellerIds.filter(id => 
                this.processed.storytellers.find(st => st.id === id)?.role.includes('friend')
              ).length
            }
          }))
          .sort((a, b) => b.count - a.count),
        
        averageQuotesPerStoryteller: (
          this.processed.storytellers.reduce((sum, st) => sum + st.quoteCount, 0) / 
          this.processed.storytellers.length
        ).toFixed(1),
        
        averageThemesPerStoryteller: (
          this.processed.storytellers.reduce((sum, st) => sum + st.themeIds.length, 0) / 
          this.processed.storytellers.length
        ).toFixed(1)
      },
      
      themes: {
        total: this.processed.themes.length,
        withQuotes: this.processed.themes.filter(t => t.quoteCount > 0).length,
        
        byCategory: Object.entries(
          this.processed.themes.reduce((acc, theme) => {
            acc[theme.category] = (acc[theme.category] || 0) + 1;
            return acc;
          }, {})
        ).sort(([,a], [,b]) => b - a),
        
        topByStorytellers: this.processed.themes
          .sort((a, b) => b.storytellerCount - a.storytellerCount)
          .slice(0, 20)
          .map(theme => ({
            id: theme.id,
            name: theme.name,
            category: theme.category,
            storytellerCount: theme.storytellerCount,
            quoteCount: theme.quoteCount
          }))
      },
      
      quotes: {
        total: totalQuotes,
        byRole: {
          volunteers: this.processed.storytellers
            .filter(st => st.role.includes('volunteer'))
            .reduce((sum, st) => sum + st.quoteCount, 0),
          friends: this.processed.storytellers
            .filter(st => st.role.includes('friend'))
            .reduce((sum, st) => sum + st.quoteCount, 0)
        },
        averageLength: Math.round(
          this.processed.storytellers
            .flatMap(st => st.quotes)
            .reduce((sum, q) => sum + q.length, 0) / 
          Math.max(1, totalQuotes)
        )
      }
    };
    
    this.analytics = analytics;
    console.log('✓ Generated storyteller-focused analytics\n');
  }

  // Helper methods
  generateStorytellerSummary({ name, role, quotes, themes, mediaTranscripts }) {
    // Start with role-based intro
    let summary = '';
    
    if (role.includes('volunteer')) {
      summary = `${name} is a volunteer with Orange Sky who `;
    } else if (role.includes('friend')) {
      summary = `${name} is a friend who accesses Orange Sky services and `;
    } else if (role.includes('service provider')) {
      summary = `${name} is a service provider working with Orange Sky who `;
    } else {
      summary = `${name} is involved with Orange Sky and `;
    }
    
    // Add theme-based insights
    if (themes.length > 0) {
      const topThemes = themes.slice(0, 3);
      summary += `shares perspectives on ${topThemes.join(', ')}. `;
    }
    
    // Add quote insights
    if (quotes.length > 0) {
      // Find key phrases from quotes
      const keyPhrases = this.extractKeyPhrasesFromQuotes(quotes);
      if (keyPhrases.length > 0) {
        summary += `Key insights include ${keyPhrases.slice(0, 2).join(' and ')}. `;
      }
    }
    
    // Add transcript insights if available
    if (mediaTranscripts.length > 0) {
      const transcriptLength = mediaTranscripts.join(' ').length;
      if (transcriptLength > 1000) {
        summary += `Extensive interview materials provide deep insights into their experiences. `;
      }
    }
    
    return summary.trim();
  }
  
  extractKeyPhrasesFromQuotes(quotes) {
    const keyPhrases = [];
    const emotionalWords = ['grateful', 'proud', 'difficult', 'challenging', 'hope', 'support', 'community', 'dignity'];
    
    quotes.forEach(quote => {
      const lowerQuote = quote.toLowerCase();
      emotionalWords.forEach(word => {
        if (lowerQuote.includes(word)) {
          const context = this.extractContextAroundWord(quote, word);
          if (context && !keyPhrases.includes(context)) {
            keyPhrases.push(context);
          }
        }
      });
    });
    
    return keyPhrases.slice(0, 3);
  }
  
  extractContextAroundWord(text, word) {
    const regex = new RegExp(`(.{0,20}${word}.{0,20})`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : null;
  }

  categorizeTheme(description) {
    const categories = {
      'Connection': ['connection', 'relationship', 'friend', 'community', 'together', 'bond'],
      'Support': ['support', 'help', 'care', 'assist', 'service', 'provide'],
      'Journey': ['journey', 'experience', 'path', 'story', 'life', 'change'],
      'Dignity': ['dignity', 'respect', 'value', 'worth', 'human', 'person'],
      'Hope': ['hope', 'future', 'positive', 'opportunity', 'better', 'aspiration'],
      'Challenge': ['challenge', 'difficult', 'struggle', 'hard', 'problem', 'issue'],
      'Impact': ['impact', 'difference', 'effect', 'influence', 'transform', 'change']
    };
    
    const lowerDesc = description.toLowerCase();
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => lowerDesc.includes(keyword))) {
        return category;
      }
    }
    return 'Other';
  }

  extractLocationFromMedia(fields) {
    return fields.Location || 
           fields['Location - City'] || 
           fields.City || 
           fields.Shift?.split(' - ')[0] || 
           'Unknown';
  }

  generateExcerpt(fields) {
    const content = fields['Story copy'] || fields['Story Transcript'] || '';
    if (!content) return '';
    
    const cleanContent = content.replace(/\[.*?\]/g, '').trim();
    return cleanContent.length > 150 ? 
           cleanContent.substring(0, 150) + '...' : 
           cleanContent;
  }

  saveData() {
    console.log('💾 Saving processed data...');
    
    const dataDir = path.join(__dirname, '../public/data');
    
    // Main data files
    fs.writeFileSync(
      path.join(dataDir, 'storytellers.json'),
      JSON.stringify(this.processed.storytellers, null, 2)
    );
    
    fs.writeFileSync(
      path.join(dataDir, 'themes.json'),
      JSON.stringify(this.processed.themes, null, 2)
    );
    
    fs.writeFileSync(
      path.join(dataDir, 'stories.json'),
      JSON.stringify(this.processed.stories, null, 2)
    );
    
    fs.writeFileSync(
      path.join(dataDir, 'media.json'),
      JSON.stringify(this.processed.media, null, 2)
    );
    
    // Analytics
    fs.writeFileSync(
      path.join(dataDir, 'analytics.json'),
      JSON.stringify(this.analytics, null, 2)
    );
    
    // Indexes
    fs.writeFileSync(
      path.join(dataDir, 'storyteller-indexes.json'),
      JSON.stringify(this.indexes, null, 2)
    );
    
    console.log('✓ All data saved\n');
  }

  getSummary() {
    return {
      processed: {
        storytellers: this.processed.storytellers.length,
        themes: this.processed.themes.length,
        stories: this.processed.stories.length,
        media: this.processed.media.length,
        quotes: this.analytics.overview.totalQuotes
      },
      analytics: this.analytics
    };
  }
}

// Export for use in other scripts
module.exports = {
  processStorytellerCentricData: (rawData) => {
    const processor = new StorytellerCentricProcessor(rawData);
    return processor.process();
  }
};

// Run if called directly
if (require.main === module) {
  const rawDataPath = path.join(__dirname, '../public/data/raw-airtable-data.json');
  if (fs.existsSync(rawDataPath)) {
    const rawData = JSON.parse(fs.readFileSync(rawDataPath, 'utf8'));
    const processor = new StorytellerCentricProcessor(rawData);
    const summary = processor.process();
    console.log('✅ Processing complete!');
    console.log('Summary:', JSON.stringify(summary, null, 2));
  } else {
    console.error('❌ No raw data found. Run fetch-airtable-data.js first.');
  }
}