#!/usr/bin/env node

/**
 * Professional Data Processing Pipeline v2
 * Handles complex Airtable relationships with proper indexing for fast access
 */

const fs = require('fs');
const path = require('path');

const BASE_ID = 'app7G3Ae65pBblJke';
const OUTPUT_DIR = path.join(__dirname, '../public/data');

// Ensure all directories exist
const createDirectories = () => {
  const dirs = [
    OUTPUT_DIR,
    path.join(OUTPUT_DIR, 'stories'),
    path.join(OUTPUT_DIR, 'stories/full'),
    path.join(OUTPUT_DIR, 'stories/index'),
    path.join(OUTPUT_DIR, 'storytellers'),
    path.join(OUTPUT_DIR, 'storytellers/full'),
    path.join(OUTPUT_DIR, 'themes'),
    path.join(OUTPUT_DIR, 'media'),
    path.join(OUTPUT_DIR, 'analytics'),
    path.join(OUTPUT_DIR, 'search')
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

/**
 * Core data processor class for scalable processing
 */
class EmpathyLedgerProcessor {
  constructor(rawData) {
    this.raw = rawData;
    this.processed = {
      stories: [],
      storytellers: [],
      themes: [],
      media: [],
      locations: new Set(),
      relationships: {
        storyToStorytellers: new Map(),
        storyToThemes: new Map(),
        storyToMedia: new Map(),
        storytellerToStories: new Map(),
        themeToStories: new Map(),
        mediaToThemes: new Map()
      }
    };
    this.indexes = {
      storiesByTheme: {},
      storiesByStoryteller: {},
      storiesByLocation: {},
      storiesByDate: {},
      themeHierarchy: {},
      searchIndex: []
    };
  }

  /**
   * Main processing pipeline
   */
  async process() {
    console.log('🚀 Starting professional data processing pipeline...\n');
    
    // Step 1: Build lookup maps for O(1) access
    this.buildLookupMaps();
    
    // Step 2: Process each entity type
    this.processStorytellers();
    this.processThemes();
    this.processMedia();
    this.processStories();
    
    // Step 3: Build relationships
    this.buildRelationships();
    
    // Step 4: Build indexes for fast queries
    this.buildIndexes();
    
    // Step 5: Generate analytics
    this.generateAnalytics();
    
    // Step 6: Build search index
    this.buildSearchIndex();
    
    // Step 7: Save all data
    await this.saveData();
    
    return this.getSummary();
  }

  /**
   * Build lookup maps for efficient processing
   */
  buildLookupMaps() {
    console.log('📊 Building lookup maps...');
    
    this.lookups = {
      storytellers: new Map(this.raw.storytellers.records.map(r => [r.id, r])),
      stories: new Map(this.raw.stories.records.map(r => [r.id, r])),
      themes: new Map(this.raw.themes.records.map(r => [r.id, r])),
      media: new Map(this.raw.media.records.map(r => [r.id, r]))
    };
    
    console.log(`✓ Created ${this.lookups.storytellers.size} storyteller lookups`);
    console.log(`✓ Created ${this.lookups.stories.size} story lookups`);
    console.log(`✓ Created ${this.lookups.themes.size} theme lookups`);
    console.log(`✓ Created ${this.lookups.media.size} media lookups\n`);
  }

  /**
   * Process storytellers with full data
   */
  processStorytellers() {
    console.log('👥 Processing storytellers...');
    
    this.raw.storytellers.records.forEach(record => {
      const fields = record.fields;
      
      // Extract location from various possible fields
      const location = this.extractLocation(fields);
      if (location) this.processed.locations.add(location);
      
      const storyteller = {
        id: record.id,
        name: fields.Name || 'Anonymous',
        project: fields.Project,
        bio: fields.Bio || null,
        quote: fields['Personal Quote'] || null,
        profileImage: this.processImage(fields['File Profile Image']),
        location: location,
        role: fields.Role || 'Storyteller',
        storyIds: [],
        themes: [],
        mediaCount: 0,
        createdAt: record.createdTime
      };
      
      this.processed.storytellers.push(storyteller);
    });
    
    console.log(`✓ Processed ${this.processed.storytellers.length} storytellers\n`);
  }

  /**
   * Process themes with hierarchy
   */
  processThemes() {
    console.log('🏷️  Processing themes...');
    
    this.raw.themes.records.forEach(record => {
      const fields = record.fields;
      
      const theme = {
        id: record.id,
        name: fields.Name || 'Unnamed Theme',
        description: fields.Description || '',
        color: fields.Color || this.generateThemeColor(fields.Name || 'Theme'),
        parent: fields.Parent || null,
        storyCount: 0,
        mediaCount: 0
      };
      
      this.processed.themes.push(theme);
    });
    
    console.log(`✓ Processed ${this.processed.themes.length} themes\n`);
  }

  /**
   * Process media with theme relationships
   */
  processMedia() {
    console.log('📹 Processing media...');
    
    this.raw.media.records.forEach(record => {
      const fields = record.fields;
      
      const media = {
        id: record.id,
        fileName: fields['File Name'] || 'Unnamed Media',
        type: fields.Type || 'Unknown',
        transcript: fields.Transcript || '',
        audio: this.processAudio(fields.Audio),
        themes: fields.Themes || [],
        quotes: fields.Quotes || [],
        createdAt: record.createdTime
      };
      
      this.processed.media.push(media);
      
      // Track theme relationships
      media.themes.forEach(themeId => {
        if (!this.processed.relationships.mediaToThemes.has(media.id)) {
          this.processed.relationships.mediaToThemes.set(media.id, []);
        }
        this.processed.relationships.mediaToThemes.get(media.id).push(themeId);
      });
    });
    
    console.log(`✓ Processed ${this.processed.media.length} media items\n`);
  }

  /**
   * Process stories with all relationships
   */
  processStories() {
    console.log('📖 Processing stories...');
    
    this.raw.stories.records.forEach(record => {
      const fields = record.fields;
      
      // Get linked storytellers
      const storytellerIds = fields.Storytellers || [];
      const storytellers = storytellerIds.map(id => this.lookups.storytellers.get(id)).filter(Boolean);
      
      // Get linked media
      const mediaIds = fields.Media || [];
      const linkedMedia = mediaIds.map(id => this.lookups.media.get(id)).filter(Boolean);
      
      // Extract themes from linked media
      const themeIds = new Set();
      linkedMedia.forEach(media => {
        (media.fields.Themes || []).forEach(themeId => themeIds.add(themeId));
      });
      
      // Extract location from storytellers or story
      const location = this.extractStoryLocation(fields, storytellers);
      if (location) this.processed.locations.add(location);
      
      const story = {
        id: record.id,
        title: fields.Title || this.generateStoryTitle(storytellers, location),
        content: fields['Story copy'] || '',
        transcript: fields['Story Transcript'] || '',
        excerpt: this.generateExcerpt(fields),
        videoUrl: fields['Video Story Link'] || null,
        hasVideo: !!fields['Video Story Link'],
        image: this.processImage(fields['Story Image']),
        hasImage: !!(fields['Story Image']?.[0]),
        storytellerIds: storytellerIds,
        storytellerNames: storytellers.map(st => st.fields.Name || 'Anonymous'),
        mediaIds: mediaIds,
        themeIds: Array.from(themeIds),
        location: location,
        createdAt: record.createdTime,
        featured: this.isFeaturedStory(fields, storytellers)
      };
      
      this.processed.stories.push(story);
      
      // Update storyteller story counts
      storytellerIds.forEach(stId => {
        const st = this.processed.storytellers.find(s => s.id === stId);
        if (st) {
          st.storyIds.push(story.id);
          Array.from(themeIds).forEach(themeId => {
            if (!st.themes.includes(themeId)) st.themes.push(themeId);
          });
        }
      });
    });
    
    console.log(`✓ Processed ${this.processed.stories.length} stories\n`);
  }

  /**
   * Build all relationships for efficient querying
   */
  buildRelationships() {
    console.log('🔗 Building relationships...');
    
    // Story relationships
    this.processed.stories.forEach(story => {
      // Story to Storytellers
      this.processed.relationships.storyToStorytellers.set(story.id, story.storytellerIds);
      
      // Storyteller to Stories
      story.storytellerIds.forEach(stId => {
        if (!this.processed.relationships.storytellerToStories.has(stId)) {
          this.processed.relationships.storytellerToStories.set(stId, []);
        }
        this.processed.relationships.storytellerToStories.get(stId).push(story.id);
      });
      
      // Story to Themes
      this.processed.relationships.storyToThemes.set(story.id, story.themeIds);
      
      // Theme to Stories
      story.themeIds.forEach(themeId => {
        if (!this.processed.relationships.themeToStories.has(themeId)) {
          this.processed.relationships.themeToStories.set(themeId, []);
        }
        this.processed.relationships.themeToStories.get(themeId).push(story.id);
        
        // Update theme story count
        const theme = this.processed.themes.find(t => t.id === themeId);
        if (theme) theme.storyCount++;
      });
      
      // Story to Media
      this.processed.relationships.storyToMedia.set(story.id, story.mediaIds);
    });
    
    console.log('✓ Built all relationships\n');
  }

  /**
   * Build indexes for fast queries
   */
  buildIndexes() {
    console.log('🗂️  Building indexes...');
    
    // Stories by theme
    this.processed.themes.forEach(theme => {
      const storyIds = this.processed.relationships.themeToStories.get(theme.id) || [];
      if (storyIds.length > 0) {
        this.indexes.storiesByTheme[theme.id] = storyIds;
      }
    });
    
    // Stories by storyteller
    this.processed.storytellers.forEach(st => {
      const storyIds = this.processed.relationships.storytellerToStories.get(st.id) || [];
      if (storyIds.length > 0) {
        this.indexes.storiesByStoryteller[st.id] = storyIds;
      }
    });
    
    // Stories by location
    this.processed.stories.forEach(story => {
      if (story.location) {
        if (!this.indexes.storiesByLocation[story.location]) {
          this.indexes.storiesByLocation[story.location] = [];
        }
        this.indexes.storiesByLocation[story.location].push(story.id);
      }
    });
    
    // Stories by date (year-month)
    this.processed.stories.forEach(story => {
      const yearMonth = story.createdAt.substring(0, 7);
      if (!this.indexes.storiesByDate[yearMonth]) {
        this.indexes.storiesByDate[yearMonth] = [];
      }
      this.indexes.storiesByDate[yearMonth].push(story.id);
    });
    
    // Theme hierarchy
    this.processed.themes.forEach(theme => {
      if (theme.parent) {
        if (!this.indexes.themeHierarchy[theme.parent]) {
          this.indexes.themeHierarchy[theme.parent] = [];
        }
        this.indexes.themeHierarchy[theme.parent].push(theme.id);
      }
    });
    
    console.log('✓ Built all indexes\n');
  }

  /**
   * Generate comprehensive analytics
   */
  generateAnalytics() {
    console.log('📊 Generating analytics...');
    
    // Theme analytics
    const themeStats = this.processed.themes
      .filter(t => t.storyCount > 0)
      .sort((a, b) => b.storyCount - a.storyCount);
    
    // Location analytics
    const locationStats = {};
    this.processed.locations.forEach(loc => {
      locationStats[loc] = (this.indexes.storiesByLocation[loc] || []).length;
    });
    
    // Time series data
    const timeSeriesData = {};
    Object.keys(this.indexes.storiesByDate).sort().forEach(month => {
      timeSeriesData[month] = this.indexes.storiesByDate[month].length;
    });
    
    // Role distribution
    const roleDistribution = {};
    this.processed.storytellers.forEach(st => {
      const role = st.role || 'Unknown';
      roleDistribution[role] = (roleDistribution[role] || 0) + 1;
    });
    
    this.analytics = {
      overview: {
        totalStories: this.processed.stories.length,
        totalStorytellers: this.processed.storytellers.length,
        totalThemes: themeStats.length,
        totalMedia: this.processed.media.length,
        averageStoriesPerStoryteller: (this.processed.stories.length / this.processed.storytellers.length).toFixed(2),
        locationsCount: this.processed.locations.size
      },
      themes: {
        total: themeStats.length,
        top10: themeStats.slice(0, 10).map(t => ({
          id: t.id,
          name: t.name,
          count: t.storyCount,
          percentage: ((t.storyCount / this.processed.stories.length) * 100).toFixed(1)
        })),
        distribution: Object.fromEntries(
          themeStats.map(t => [t.name, t.storyCount])
        )
      },
      locations: {
        total: this.processed.locations.size,
        distribution: locationStats,
        sorted: Object.entries(locationStats)
          .sort((a, b) => b[1] - a[1])
          .map(([location, count]) => ({ location, count }))
      },
      media: {
        total: this.processed.media.length,
        byType: this.processed.media.reduce((acc, m) => {
          acc[m.type] = (acc[m.type] || 0) + 1;
          return acc;
        }, {}),
        withVideo: this.processed.stories.filter(s => s.hasVideo).length,
        withImage: this.processed.stories.filter(s => s.hasImage).length
      },
      timeSeries: timeSeriesData,
      roles: roleDistribution,
      engagement: {
        storiesPerStoryteller: this.calculateEngagementStats(),
        themeConnections: this.calculateThemeConnections()
      }
    };
    
    console.log('✓ Generated comprehensive analytics\n');
  }

  /**
   * Build search index for fast text search
   */
  buildSearchIndex() {
    console.log('🔍 Building search index...');
    
    // Index stories
    this.processed.stories.forEach(story => {
      this.indexes.searchIndex.push({
        type: 'story',
        id: story.id,
        title: story.title,
        text: `${story.title} ${story.excerpt} ${story.storytellerNames.join(' ')}`.toLowerCase(),
        themes: story.themeIds,
        location: story.location
      });
    });
    
    // Index storytellers
    this.processed.storytellers.forEach(st => {
      this.indexes.searchIndex.push({
        type: 'storyteller',
        id: st.id,
        title: st.name,
        text: `${st.name} ${st.bio || ''} ${st.quote || ''}`.toLowerCase(),
        location: st.location
      });
    });
    
    console.log(`✓ Built search index with ${this.indexes.searchIndex.length} entries\n`);
  }

  /**
   * Save all processed data
   */
  async saveData() {
    console.log('💾 Saving processed data...');
    
    // Save main collections
    this.saveJSON('stories.json', this.processed.stories);
    this.saveJSON('storytellers.json', this.processed.storytellers);
    this.saveJSON('themes.json', this.processed.themes);
    this.saveJSON('media.json', this.processed.media);
    
    // Save indexes
    this.saveJSON('indexes/stories-by-theme.json', this.indexes.storiesByTheme);
    this.saveJSON('indexes/stories-by-storyteller.json', this.indexes.storiesByStoryteller);
    this.saveJSON('indexes/stories-by-location.json', this.indexes.storiesByLocation);
    this.saveJSON('indexes/stories-by-date.json', this.indexes.storiesByDate);
    this.saveJSON('indexes/theme-hierarchy.json', this.indexes.themeHierarchy);
    
    // Save individual story files for lazy loading
    this.processed.stories.forEach(story => {
      this.saveJSON(`stories/full/${story.id}.json`, story);
    });
    
    // Save individual storyteller profiles
    this.processed.storytellers.forEach(st => {
      this.saveJSON(`storytellers/full/${st.id}.json`, st);
    });
    
    // Save analytics
    this.saveJSON('analytics.json', this.analytics);
    this.saveJSON('analytics/overview.json', this.analytics.overview);
    this.saveJSON('analytics/themes.json', this.analytics.themes);
    this.saveJSON('analytics/locations.json', this.analytics.locations);
    this.saveJSON('analytics/time-series.json', this.analytics.timeSeries);
    
    // Save search index
    this.saveJSON('search/index.json', this.indexes.searchIndex);
    
    // Save metadata
    const metadata = {
      version: '2.0',
      generated: new Date().toISOString(),
      counts: {
        stories: this.processed.stories.length,
        storytellers: this.processed.storytellers.length,
        themes: this.processed.themes.filter(t => t.storyCount > 0).length,
        media: this.processed.media.length,
        locations: this.processed.locations.size
      },
      lastStoryDate: this.processed.stories
        .map(s => s.createdAt)
        .sort()
        .reverse()[0]
    };
    this.saveJSON('metadata.json', metadata);
    
    console.log('✓ All data saved successfully\n');
  }

  // Helper methods
  
  extractLocation(fields) {
    return fields.Location || 
           fields.City || 
           fields['Location City'] || 
           (fields.Shift && typeof fields.Shift === 'string' ? fields.Shift.split(' ')[0] : null) ||
           'Unknown';
  }
  
  extractStoryLocation(fields, storytellers) {
    if (fields.Location) return fields.Location;
    if (fields.City) return fields.City;
    
    // Try to get from first storyteller
    if (storytellers.length > 0) {
      const stFields = storytellers[0].fields;
      return this.extractLocation(stFields);
    }
    
    return 'Unknown';
  }
  
  processImage(imageField) {
    if (!imageField || !imageField[0]) return null;
    
    const img = imageField[0];
    return {
      url: img.url,
      thumbnails: img.thumbnails || null,
      filename: img.filename,
      size: img.size,
      type: img.type
    };
  }
  
  processAudio(audioField) {
    if (!audioField || !audioField[0]) return null;
    
    const audio = audioField[0];
    return {
      url: audio.url,
      filename: audio.filename,
      size: audio.size,
      type: audio.type
    };
  }
  
  generateExcerpt(fields) {
    const content = fields['Story copy'] || fields['Story Transcript'] || '';
    const text = content.replace(/<[^>]*>/g, '').trim();
    return text.substring(0, 200) + (text.length > 200 ? '...' : '');
  }
  
  generateStoryTitle(storytellers, location) {
    if (storytellers.length > 0) {
      const name = storytellers[0].fields.Name || 'Anonymous';
      return `${name}'s Story from ${location}`;
    }
    return `A Story from ${location}`;
  }
  
  generateThemeColor(themeName) {
    // Generate consistent color based on theme name
    const colors = [
      '#F59E0B', '#EF4444', '#10B981', '#3B82F6', 
      '#8B5CF6', '#EC4899', '#F97316', '#14B8A6'
    ];
    const index = (themeName || '').length % colors.length;
    return colors[index];
  }
  
  isFeaturedStory(fields, storytellers) {
    // Logic to determine featured stories
    return !!(fields['Video Story Link'] && 
             fields['Story Image'] && 
             storytellers.length > 0);
  }
  
  calculateEngagementStats() {
    const distribution = {};
    this.processed.storytellers.forEach(st => {
      const count = st.storyIds.length;
      distribution[count] = (distribution[count] || 0) + 1;
    });
    return distribution;
  }
  
  calculateThemeConnections() {
    const connections = {};
    this.processed.stories.forEach(story => {
      const themes = story.themeIds;
      for (let i = 0; i < themes.length; i++) {
        for (let j = i + 1; j < themes.length; j++) {
          const key = [themes[i], themes[j]].sort().join('-');
          connections[key] = (connections[key] || 0) + 1;
        }
      }
    });
    return Object.entries(connections)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([pair, count]) => ({ themes: pair.split('-'), count }));
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
      indexes: {
        searchEntries: this.indexes.searchIndex.length,
        themeIndexes: Object.keys(this.indexes.storiesByTheme).length,
        locationIndexes: Object.keys(this.indexes.storiesByLocation).length
      },
      analytics: {
        topTheme: this.analytics.themes.top10[0]?.name || 'N/A',
        topLocation: this.analytics.locations.sorted[0]?.location || 'N/A'
      }
    };
  }
}

// Main execution
async function processEmpathyLedgerData(rawData) {
  createDirectories();
  
  const processor = new EmpathyLedgerProcessor(rawData);
  const summary = await processor.process();
  
  console.log('✅ Processing complete!\n');
  console.log('📊 Summary:');
  console.log(JSON.stringify(summary, null, 2));
  
  return summary;
}

// Instructions for use
if (require.main === module) {
  console.log(`
=================================================================
PROFESSIONAL DATA PROCESSING PIPELINE
=================================================================

This script creates a scalable, professional data structure:

1. Normalized data with proper relationships
2. Pre-built indexes for O(1) query performance
3. Comprehensive analytics
4. Search functionality
5. Lazy loading support

To use:
1. Fetch data from Airtable via MCP or API
2. Call: processEmpathyLedgerData(rawData)

The output structure supports:
- Fast filtering by theme, location, storyteller
- Full-text search
- Time-series analysis
- Theme relationship mapping
- Lazy loading of full content

=================================================================
`);
}

module.exports = { processEmpathyLedgerData, EmpathyLedgerProcessor };