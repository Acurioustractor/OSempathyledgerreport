#!/usr/bin/env node

/**
 * Data Processing Pipeline v3 - Matching exact Airtable structure
 * 
 * Table Structure:
 * - Storytellers: Name, Shifts, Role, Project, + fields from Media
 * - Stories: Title, Story copy, Story Transcript, Video Story Link, links to Storytellers & Media
 * - Media: Central hub with Themes, Quotes, Transcript, Summary, Video draft link
 * - Themes: Name, Description
 */

const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '../public/data');

// Ensure directories exist
const createDirectories = () => {
  const dirs = [
    OUTPUT_DIR,
    path.join(OUTPUT_DIR, 'stories'),
    path.join(OUTPUT_DIR, 'stories/full'),
    path.join(OUTPUT_DIR, 'storytellers'),
    path.join(OUTPUT_DIR, 'storytellers/full'),
    path.join(OUTPUT_DIR, 'themes'),
    path.join(OUTPUT_DIR, 'media'),
    path.join(OUTPUT_DIR, 'analytics'),
    path.join(OUTPUT_DIR, 'indexes')
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

class EmpathyLedgerProcessor {
  constructor(rawData) {
    this.raw = rawData;
    this.processed = {
      stories: [],
      storytellers: [],
      themes: [],
      media: [],
      locations: new Set()
    };
    this.indexes = {};
  }

  async process() {
    console.log('🚀 Processing Empathy Ledger data (v3)...\n');
    
    // Build lookup maps
    this.buildLookupMaps();
    
    // Process in correct order
    this.processThemes();
    this.processMedia();
    this.processStorytellers();
    this.processStories();
    
    // Build indexes and analytics
    this.buildIndexes();
    this.generateAnalytics();
    
    // Save everything
    await this.saveData();
    
    return this.getSummary();
  }

  buildLookupMaps() {
    console.log('📊 Building lookup maps...');
    
    this.lookups = {
      storytellers: new Map(this.raw.storytellers.records.map(r => [r.id, r])),
      stories: new Map(this.raw.stories.records.map(r => [r.id, r])),
      themes: new Map(this.raw.themes.records.map(r => [r.id, r])),
      media: new Map(this.raw.media.records.map(r => [r.id, r]))
    };
    
    console.log(`✓ Built lookups for ${this.lookups.storytellers.size} storytellers, ${this.lookups.stories.size} stories\n`);
  }

  processThemes() {
    console.log('🏷️ Processing themes...');
    
    this.raw.themes.records.forEach(record => {
      const fields = record.fields;
      
      // Extract theme name from description if Name field is generic
      let themeName = fields.Name || 'Unnamed Theme';
      if (themeName === 'Unnamed Theme' && fields.Description) {
        // Extract first sentence or key phrase from description as theme name
        const firstSentence = fields.Description.split(/[.!?]/)[0].trim();
        if (firstSentence.length > 0 && firstSentence.length < 100) {
          themeName = firstSentence;
        } else {
          // Try to extract key concepts from description
          const keyPhrases = fields.Description.match(/^(.*?)(through|by|via|with|for)/i);
          if (keyPhrases && keyPhrases[1]) {
            themeName = keyPhrases[1].trim();
          } else {
            // Use first 50 characters as fallback
            themeName = fields.Description.substring(0, 50) + '...';
          }
        }
      }
      
      // Categorize themes
      const category = this.categorizeTheme(fields.Description || '');
      
      this.processed.themes.push({
        id: record.id,
        name: themeName,
        description: fields.Description || '',
        category: category,
        storyCount: 0,
        mediaCount: 0
      });
    });
    
    console.log(`✓ Processed ${this.processed.themes.length} themes\n`);
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

  processMedia() {
    console.log('📹 Processing media (central hub)...');
    
    this.raw.media.records.forEach(record => {
      const fields = record.fields;
      
      // Extract themes
      const themeIds = fields.Themes || [];
      const themes = themeIds.map(id => {
        const theme = this.lookups.themes.get(id);
        return theme?.fields?.Name || null;
      }).filter(Boolean);
      
      // Extract location from various fields
      const location = this.extractLocationFromMedia(fields);
      if (location && location !== 'Unknown') {
        this.processed.locations.add(location);
      }
      
      const media = {
        id: record.id,
        fileName: fields['File Name'] || 'Unnamed Media',
        type: fields.Type || 'Unknown',
        
        // Content fields
        transcript: fields.Transcript || '',
        summary: fields.Summary || '',
        quotes: fields.Quotes || [],
        
        // Media assets
        videoDraftLink: fields['Video draft link'] || null,
        rawVideoPhotos: fields['RAW Video and photos'] || [],
        
        // Relationships
        themeIds: themeIds,
        themeNames: themes,
        
        // Metadata
        location: location,
        createdAt: record.createdTime
      };
      
      this.processed.media.push(media);
      
      // Update theme counts
      themeIds.forEach(themeId => {
        const theme = this.processed.themes.find(t => t.id === themeId);
        if (theme) theme.mediaCount++;
      });
    });
    
    console.log(`✓ Processed ${this.processed.media.length} media records\n`);
  }

  processStorytellers() {
    console.log('👥 Processing storytellers...');
    
    this.raw.storytellers.records.forEach(record => {
      const fields = record.fields;
      
      // Only process Orange Sky storytellers
      if (!fields.Project || !fields.Project.includes('Orange Sky')) {
        return;
      }
      
      // Get themes from linked media (via lookup fields)
      const themes = fields['Themes (from Media)'] || [];
      const themeNames = themes.map(id => {
        const theme = this.lookups.themes.get(id);
        return theme?.fields?.Name || null;
      }).filter(Boolean);
      
      // Extract location
      const location = fields['Location Rollup (from Media)']?.[0] || 
                      this.extractLocationFromShifts(fields.Shifts) ||
                      'Unknown';
      
      if (location && location !== 'Unknown') {
        this.processed.locations.add(location);
      }
      
      const storyteller = {
        id: record.id,
        name: fields.Name || 'Anonymous',
        role: fields.Role || 'Storyteller',
        project: fields.Project,
        location: location,
        
        // From linked Media
        videoDraftLink: fields['Video draft link (from Media)']?.[0] || null,
        summary: fields['Summary (from Media)']?.[0] || null,
        quotes: fields['Quotes (from Media)'] || [],
        transcript: fields['Transcript (from Media)']?.[0] || null,
        themes: themeNames,
        themeIds: themes,
        
        // Other fields
        shifts: fields.Shifts || [],
        profileImage: this.processFiles(fields.Files),
        rawVideoPhotos: fields['RAW Video and photos'] || [],
        
        // Will be updated when processing stories
        storyIds: [],
        storyCount: 0,
        
        createdAt: record.createdTime
      };
      
      this.processed.storytellers.push(storyteller);
    });
    
    console.log(`✓ Processed ${this.processed.storytellers.length} Orange Sky storytellers\n`);
  }

  processStories() {
    console.log('📖 Processing stories...');
    
    this.raw.stories.records.forEach(record => {
      const fields = record.fields;
      
      // Get linked storytellers
      const storytellerIds = fields.Storytellers || [];
      const storytellers = storytellerIds
        .map(id => this.processed.storytellers.find(st => st.id === id))
        .filter(Boolean);
      
      // Skip if no Orange Sky storytellers
      if (storytellers.length === 0) return;
      
      // Get linked media
      const mediaIds = fields.Media || [];
      const linkedMedia = mediaIds
        .map(id => this.processed.media.find(m => m.id === id))
        .filter(Boolean);
      
      // Aggregate themes from linked media
      const allThemeIds = new Set();
      const allThemeNames = new Set();
      linkedMedia.forEach(media => {
        media.themeIds.forEach(id => allThemeIds.add(id));
        media.themeNames.forEach(name => allThemeNames.add(name));
      });
      
      // Determine location
      const location = storytellers[0]?.location || 
                      linkedMedia[0]?.location || 
                      'Unknown';
      
      if (location && location !== 'Unknown') {
        this.processed.locations.add(location);
      }
      
      const story = {
        id: record.id,
        title: fields.Title || this.generateStoryTitle(storytellers, location),
        
        // Content
        storyCopy: fields['Story copy'] || '',
        storyTranscript: fields['Story Transcript'] || '',
        excerpt: this.generateExcerpt(fields),
        
        // Media
        videoStoryLink: fields['Video Story Link'] || null,
        videoEmbedCode: fields['Video Embed Code'] || null,
        hasVideo: !!fields['Video Story Link'],
        
        // Relationships
        storytellerIds: storytellerIds,
        storytellerNames: storytellers.map(st => st.name),
        mediaIds: mediaIds,
        themeIds: Array.from(allThemeIds),
        themeNames: Array.from(allThemeNames),
        
        // Metadata
        location: location,
        shifts: fields['Shifts (from Storytellers)'] || [],
        createdAt: record.createdTime,
        
        // Flags
        featured: this.isFeaturedStory(fields, storytellers, linkedMedia)
      };
      
      this.processed.stories.push(story);
      
      // Update storyteller story counts
      storytellers.forEach(st => {
        st.storyIds.push(story.id);
        st.storyCount++;
      });
      
      // Update theme story counts
      story.themeIds.forEach(themeId => {
        const theme = this.processed.themes.find(t => t.id === themeId);
        if (theme) theme.storyCount++;
      });
    });
    
    console.log(`✓ Processed ${this.processed.stories.length} stories\n`);
  }

  buildIndexes() {
    console.log('🗂️ Building indexes...');
    
    // Stories by theme
    this.indexes.storiesByTheme = {};
    this.processed.stories.forEach(story => {
      story.themeIds.forEach(themeId => {
        if (!this.indexes.storiesByTheme[themeId]) {
          this.indexes.storiesByTheme[themeId] = [];
        }
        this.indexes.storiesByTheme[themeId].push(story.id);
      });
    });
    
    // Stories by storyteller
    this.indexes.storiesByStoryteller = {};
    this.processed.stories.forEach(story => {
      story.storytellerIds.forEach(stId => {
        if (!this.indexes.storiesByStoryteller[stId]) {
          this.indexes.storiesByStoryteller[stId] = [];
        }
        this.indexes.storiesByStoryteller[stId].push(story.id);
      });
    });
    
    // Stories by location
    this.indexes.storiesByLocation = {};
    this.processed.stories.forEach(story => {
      if (!this.indexes.storiesByLocation[story.location]) {
        this.indexes.storiesByLocation[story.location] = [];
      }
      this.indexes.storiesByLocation[story.location].push(story.id);
    });
    
    // Search index
    this.indexes.searchIndex = [];
    
    // Index stories
    this.processed.stories.forEach(story => {
      this.indexes.searchIndex.push({
        type: 'story',
        id: story.id,
        title: story.title,
        text: `${story.title} ${story.excerpt} ${story.storytellerNames.join(' ')} ${story.themeNames.join(' ')}`.toLowerCase()
      });
    });
    
    // Index storytellers
    this.processed.storytellers.forEach(st => {
      this.indexes.searchIndex.push({
        type: 'storyteller',
        id: st.id,
        title: st.name,
        text: `${st.name} ${st.role} ${st.summary || ''} ${st.themes.join(' ')}`.toLowerCase()
      });
    });
    
    console.log('✓ Built all indexes\n');
  }

  generateAnalytics() {
    console.log('📊 Generating analytics...');
    
    // Location distribution
    const locationDistribution = {};
    this.processed.locations.forEach(loc => {
      locationDistribution[loc] = (this.indexes.storiesByLocation[loc] || []).length;
    });
    
    // Theme distribution
    const activeThemes = this.processed.themes.filter(t => t.storyCount > 0);
    const themeDistribution = {};
    activeThemes.forEach(theme => {
      themeDistribution[theme.name] = theme.storyCount;
    });
    
    // Theme category distribution
    const themeCategoryDistribution = {};
    activeThemes.forEach(theme => {
      if (!themeCategoryDistribution[theme.category]) {
        themeCategoryDistribution[theme.category] = 0;
      }
      themeCategoryDistribution[theme.category] += theme.storyCount;
    });
    
    // Role distribution
    const roleDistribution = {};
    this.processed.storytellers.forEach(st => {
      const role = st.role || 'Unknown';
      roleDistribution[role] = (roleDistribution[role] || 0) + 1;
    });
    
    // Media type distribution
    const mediaTypes = {};
    this.processed.media.forEach(m => {
      mediaTypes[m.type] = (mediaTypes[m.type] || 0) + 1;
    });
    
    // Quote analysis
    let totalQuotes = 0;
    let quoteLengths = [];
    this.processed.media.forEach(m => {
      if (m.quotes && Array.isArray(m.quotes)) {
        totalQuotes += m.quotes.length;
        m.quotes.forEach(q => {
          if (typeof q === 'string') {
            quoteLengths.push(q.length);
          }
        });
      }
    });
    
    const avgQuoteLength = quoteLengths.length > 0 
      ? Math.round(quoteLengths.reduce((a, b) => a + b, 0) / quoteLengths.length)
      : 0;
    
    this.analytics = {
      overview: {
        totalStories: this.processed.stories.length,
        totalStorytellers: this.processed.storytellers.length,
        totalThemes: activeThemes.length,
        totalMedia: this.processed.media.length,
        locationsCount: this.processed.locations.size,
        averageStoriesPerStoryteller: (this.processed.stories.length / this.processed.storytellers.length).toFixed(2)
      },
      locations: {
        total: this.processed.locations.size,
        distribution: locationDistribution,
        sorted: Object.entries(locationDistribution)
          .sort((a, b) => b[1] - a[1])
          .map(([location, count]) => ({ location, count }))
      },
      themes: {
        total: activeThemes.length,
        distribution: themeDistribution,
        categoryDistribution: themeCategoryDistribution,
        top10: activeThemes
          .sort((a, b) => b.storyCount - a.storyCount)
          .slice(0, 10)
          .map(t => ({
            id: t.id,
            name: t.name,
            category: t.category,
            count: t.storyCount,
            percentage: ((t.storyCount / this.processed.stories.length) * 100).toFixed(1)
          }))
      },
      media: {
        total: this.processed.media.length,
        byType: mediaTypes,
        withVideo: this.processed.stories.filter(s => s.hasVideo).length,
        withTranscript: this.processed.stories.filter(s => s.storyTranscript).length
      },
      roles: roleDistribution,
      engagement: {
        storiesWithVideo: this.processed.stories.filter(s => s.hasVideo).length,
        storytellersWithStories: this.processed.storytellers.filter(st => st.storyCount > 0).length,
        averageThemesPerStory: (
          this.processed.stories.reduce((sum, s) => sum + s.themeNames.length, 0) / 
          this.processed.stories.length
        ).toFixed(2)
      },
      quotes: {
        total: totalQuotes,
        averageLength: avgQuoteLength,
        totalCharacters: quoteLengths.reduce((a, b) => a + b, 0)
      }
    };
    
    console.log('✓ Generated analytics\n');
  }

  async saveData() {
    console.log('💾 Saving processed data...');
    
    // Main collections
    this.saveJSON('stories.json', this.processed.stories);
    this.saveJSON('storytellers.json', this.processed.storytellers);
    this.saveJSON('themes.json', this.processed.themes);
    this.saveJSON('media.json', this.processed.media);
    
    // Individual files for lazy loading
    this.processed.stories.forEach(story => {
      this.saveJSON(`stories/full/${story.id}.json`, story);
    });
    
    this.processed.storytellers.forEach(st => {
      this.saveJSON(`storytellers/full/${st.id}.json`, st);
    });
    
    // Indexes
    this.saveJSON('indexes/stories-by-theme.json', this.indexes.storiesByTheme);
    this.saveJSON('indexes/stories-by-storyteller.json', this.indexes.storiesByStoryteller);
    this.saveJSON('indexes/stories-by-location.json', this.indexes.storiesByLocation);
    this.saveJSON('indexes/search.json', this.indexes.searchIndex);
    
    // Analytics
    this.saveJSON('analytics.json', this.analytics);
    this.saveJSON('analytics/overview.json', this.analytics.overview);
    this.saveJSON('analytics/locations.json', this.analytics.locations);
    this.saveJSON('analytics/themes.json', this.analytics.themes);
    
    // Metadata
    const metadata = {
      version: '3.0',
      generated: new Date().toISOString(),
      structure: 'Media-centric with proper Airtable relationships',
      counts: {
        stories: this.processed.stories.length,
        storytellers: this.processed.storytellers.length,
        themes: this.processed.themes.filter(t => t.storyCount > 0).length,
        media: this.processed.media.length,
        locations: this.processed.locations.size
      }
    };
    this.saveJSON('metadata.json', metadata);
    
    console.log('✓ All data saved\n');
  }

  // Helper methods
  
  extractLocationFromMedia(fields) {
    // Try various location fields
    return fields.Location || 
           fields.City || 
           fields['Location City'] || 
           'Unknown';
  }
  
  extractLocationFromShifts(shifts) {
    if (!shifts || shifts.length === 0) return null;
    
    // Extract city from shift name (e.g., "Brisbane Morning Shift")
    const shift = shifts[0];
    if (typeof shift === 'string') {
      const parts = shift.split(' ');
      if (parts.length > 0) {
        return parts[0]; // First word is usually the city
      }
    }
    return null;
  }
  
  processFiles(files) {
    if (!files || files.length === 0) return null;
    
    const file = files[0];
    return {
      url: file.url,
      thumbnails: file.thumbnails || null,
      filename: file.filename,
      type: file.type
    };
  }
  
  generateExcerpt(fields) {
    const content = fields['Story copy'] || fields['Story Transcript'] || '';
    const text = content.replace(/<[^>]*>/g, '').replace(/\n+/g, ' ').trim();
    return text.substring(0, 200) + (text.length > 200 ? '...' : '');
  }
  
  generateStoryTitle(storytellers, location) {
    if (storytellers.length > 0) {
      return `${storytellers[0].name}'s Story`;
    }
    return `A Story from ${location}`;
  }
  
  isFeaturedStory(fields, storytellers, linkedMedia) {
    // Featured if has video and good content
    return !!(
      fields['Video Story Link'] && 
      (fields['Story copy'] || fields['Story Transcript']) &&
      storytellers.length > 0 &&
      linkedMedia.length > 0
    );
  }
  
  saveJSON(filename, data) {
    const filepath = path.join(OUTPUT_DIR, filename);
    const dir = path.dirname(filepath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
  }
  
  getSummary() {
    return {
      processed: {
        stories: this.processed.stories.length,
        storytellers: this.processed.storytellers.length,
        themes: this.processed.themes.filter(t => t.storyCount > 0).length,
        media: this.processed.media.length,
        locations: this.processed.locations.size
      },
      topLocation: this.analytics.locations.sorted[0]?.location || 'N/A',
      topTheme: this.analytics.themes.top10[0]?.name || 'N/A',
      videosCount: this.analytics.media.withVideo
    };
  }
}

async function processEmpathyLedgerData(rawData) {
  createDirectories();
  
  const processor = new EmpathyLedgerProcessor(rawData);
  const summary = await processor.process();
  
  console.log('✅ Processing complete!\n');
  console.log('📊 Summary:', JSON.stringify(summary, null, 2));
  
  return summary;
}

module.exports = { processEmpathyLedgerData };