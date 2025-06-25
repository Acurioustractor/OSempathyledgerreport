#!/usr/bin/env node

/**
 * Empathy Ledger Data Processing Script
 * Based on actual Airtable schema with Media as central hub
 */

const fs = require('fs');
const path = require('path');

const BASE_ID = 'app7G3Ae65pBblJke';
const OUTPUT_DIR = path.join(__dirname, '../public/data');

// Table IDs from your Airtable
const TABLE_IDS = {
  STORYTELLERS: 'tbl9zxLsGOd3fjWXp',
  STORIES: 'tbl34r8BqNDgPI3ZN',
  MEDIA: 'tbldCVl8n3JyPvamD',
  THEMES: 'Themes' // Need actual table ID
};

// Ensure output directories exist
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Create directory structure
[
  OUTPUT_DIR,
  path.join(OUTPUT_DIR, 'stories'),
  path.join(OUTPUT_DIR, 'stories/by-location'),
  path.join(OUTPUT_DIR, 'stories/by-theme'),
  path.join(OUTPUT_DIR, 'stories/full'),
  path.join(OUTPUT_DIR, 'storytellers'),
  path.join(OUTPUT_DIR, 'storytellers/profiles'),
  path.join(OUTPUT_DIR, 'analytics'),
  path.join(OUTPUT_DIR, 'media')
].forEach(ensureDir);

/**
 * STEP 1: Fetch all data from Airtable
 */
console.log(`
=================================================================
FETCH DATA FROM AIRTABLE
=================================================================

Run these commands in Cursor with Airtable MCP:

const empathyData = {
  storytellers: await mcp.airtable.getRecords({
    baseId: "${BASE_ID}",
    tableName: "Storytellers",
    filterByFormula: "OR({Project} = 'Orange Sky', {Project} = 'Orange Sky Projects')"
  }),
  stories: await mcp.airtable.getRecords({
    baseId: "${BASE_ID}",
    tableName: "Stories"
  }),
  media: await mcp.airtable.getRecords({
    baseId: "${BASE_ID}",
    tableName: "Media"
  }),
  themes: await mcp.airtable.getRecords({
    baseId: "${BASE_ID}",
    tableName: "Themes"
  })
};

// Then call:
processEmpathyLedgerData(empathyData);

=================================================================
`);

/**
 * Main processing function
 */
async function processEmpathyLedgerData(rawData) {
  console.log('\\nProcessing Empathy Ledger data...');
  
  const { storytellers, stories, media, themes } = rawData;
  
  // Create lookup maps for efficient access
  const maps = {
    storytellers: new Map(storytellers.records.map(r => [r.id, r])),
    stories: new Map(stories.records.map(r => [r.id, r])),
    media: new Map(media.records.map(r => [r.id, r])),
    themes: new Map(themes.records.map(r => [r.id, r]))
  };
  
  // Process themes first (simple structure)
  const processedThemes = processThemes(themes.records);
  
  // Process storytellers with privacy filters
  const processedStorytellers = [];
  const storytellerMap = new Map();
  
  storytellers.records.forEach(storyteller => {
    // Only process Orange Sky storytellers
    const project = storyteller.fields.Project;
    if (!project || (!project.includes('Orange Sky'))) return;
    
    const processed = processStoryteller(storyteller, maps);
    if (processed) {
      processedStorytellers.push(processed);
      storytellerMap.set(storyteller.id, processed);
    }
  });
  
  // Process stories and link all relationships
  const processedStories = [];
  const storyIndex = [];
  const indices = {
    byTheme: {},
    byLocation: {},
    byStoryteller: {},
    byMediaType: {}
  };
  
  stories.records.forEach(story => {
    // Check if story is linked to Orange Sky storytellers
    const storytellerIds = story.fields.Storytellers || [];
    const linkedStorytellers = storytellerIds
      .map(id => storytellerMap.get(id))
      .filter(Boolean);
    
    if (linkedStorytellers.length === 0) return; // Skip non-Orange Sky stories
    
    const processed = processStory(story, linkedStorytellers, maps);
    if (!processed) return;
    
    processedStories.push(processed);
    
    // Create index entry
    storyIndex.push({
      id: processed.id,
      title: processed.title,
      excerpt: processed.excerpt,
      themes: processed.themeNames,
      storytellers: processed.storytellerNames,
      hasVideo: processed.hasVideo,
      hasImage: processed.hasImage,
      createdAt: processed.createdAt
    });
    
    // Build indices for fast filtering
    processed.themeNames.forEach(theme => {
      if (!indices.byTheme[theme]) indices.byTheme[theme] = [];
      indices.byTheme[theme].push(processed.id);
    });
    
    // Add to storyteller indices
    linkedStorytellers.forEach(st => {
      if (!indices.byStoryteller[st.id]) indices.byStoryteller[st.id] = [];
      indices.byStoryteller[st.id].push(processed.id);
      
      // Update storyteller's story count
      st.storyCount = (st.storyCount || 0) + 1;
    });
  });
  
  // Process media and link to stories/themes
  const processedMedia = processMedia(media.records, maps, storytellerMap);
  
  // Generate analytics
  const analytics = generateAnalytics(processedStories, processedStorytellers, processedThemes);
  
  // Save all data files
  await saveAllData({
    stories: processedStories,
    storyIndex,
    storytellers: processedStorytellers,
    themes: processedThemes,
    media: processedMedia,
    indices,
    analytics
  });
  
  console.log(`
✅ Data processing complete!
📊 Processed ${processedStories.length} stories from ${processedStorytellers.length} Orange Sky storytellers
📁 Data saved to: ${OUTPUT_DIR}
  `);
}

/**
 * Process individual storyteller
 */
function processStoryteller(storyteller, maps) {
  const fields = storyteller.fields;
  
  // Basic info (always included for Orange Sky)
  const processed = {
    id: storyteller.id,
    name: fields.Name || 'Anonymous',
    project: fields.Project,
    hasProfile: true, // Since they're Orange Sky, include them
    storyCount: 0,
    themes: []
  };
  
  // Add optional fields if available
  if (fields.Bio) {
    processed.bio = fields.Bio;
  }
  
  if (fields['Personal Quote']) {
    processed.quote = fields['Personal Quote'];
  }
  
  if (fields['File Profile Image']?.[0]) {
    processed.profileImage = {
      url: fields['File Profile Image'][0].url,
      thumbnails: fields['File Profile Image'][0].thumbnails
    };
  }
  
  // Get linked media count
  const mediaIds = fields.Media || [];
  processed.mediaCount = mediaIds.length;
  
  return processed;
}

/**
 * Process individual story
 */
function processStory(story, linkedStorytellers, maps) {
  const fields = story.fields;
  
  // Get linked media for additional content
  const mediaIds = fields.Media || [];
  const linkedMedia = mediaIds.map(id => maps.media.get(id)).filter(Boolean);
  
  // Extract themes from linked media
  const themeIds = new Set();
  linkedMedia.forEach(media => {
    (media.fields.Themes || []).forEach(themeId => themeIds.add(themeId));
  });
  
  const themeNames = Array.from(themeIds)
    .map(id => maps.themes.get(id)?.fields?.Name)
    .filter(Boolean);
  
  const processed = {
    id: story.id,
    title: fields.Title || 'Untitled Story',
    content: fields['Story copy'] || '',
    transcript: fields['Story Transcript'] || '',
    excerpt: '',
    hasVideo: !!fields['Video Story Link'],
    videoUrl: fields['Video Story Link'] || null,
    hasImage: !!(fields['Story Image']?.[0]),
    themes: Array.from(themeIds),
    themeNames,
    storytellerIds: linkedStorytellers.map(st => st.id),
    storytellerNames: linkedStorytellers.map(st => st.name),
    mediaCount: mediaIds.length,
    createdAt: story.createdTime
  };
  
  // Create excerpt from content or transcript
  const textContent = processed.content || processed.transcript || '';
  processed.excerpt = textContent.substring(0, 200).replace(/<[^>]*>/g, '') + '...';
  
  // Add story image if available
  if (fields['Story Image']?.[0]) {
    processed.image = {
      url: fields['Story Image'][0].url,
      thumbnails: fields['Story Image'][0].thumbnails
    };
  }
  
  return processed;
}

/**
 * Process themes
 */
function processThemes(themes) {
  return themes.map(theme => ({
    id: theme.id,
    name: theme.fields.Name || 'Unknown Theme',
    description: theme.fields.Description || '',
    color: theme.fields.Color || null
  }));
}

/**
 * Process media records
 */
function processMedia(mediaRecords, maps, storytellerMap) {
  const processedMedia = [];
  
  mediaRecords.forEach(media => {
    const fields = media.fields;
    
    // Check if media is linked to Orange Sky content
    const quotes = fields.Quotes || [];
    const themes = (fields.Themes || []).map(id => maps.themes.get(id)?.fields?.Name).filter(Boolean);
    
    const processed = {
      id: media.id,
      fileName: fields['File Name'] || 'Untitled',
      type: fields.Type || 'Unknown',
      transcript: fields.Transcript || '',
      themes,
      hasAudio: !!(fields.Audio?.[0]),
      quoteCount: quotes.length
    };
    
    if (fields.Audio?.[0]) {
      processed.audio = {
        url: fields.Audio[0].url,
        filename: fields.Audio[0].filename
      };
    }
    
    processedMedia.push(processed);
  });
  
  return processedMedia;
}

/**
 * Generate analytics
 */
function generateAnalytics(stories, storytellers, themes) {
  // Theme distribution
  const themeCount = {};
  stories.forEach(story => {
    story.themeNames.forEach(theme => {
      themeCount[theme] = (themeCount[theme] || 0) + 1;
    });
  });
  
  // Media type distribution
  const mediaTypes = {
    withVideo: stories.filter(s => s.hasVideo).length,
    withImage: stories.filter(s => s.hasImage).length,
    textOnly: stories.filter(s => !s.hasVideo && !s.hasImage).length
  };
  
  // Storyteller distribution
  const storytellerProjects = {};
  storytellers.forEach(st => {
    storytellerProjects[st.project] = (storytellerProjects[st.project] || 0) + 1;
  });
  
  return {
    overview: {
      totalStories: stories.length,
      totalStorytellers: storytellers.length,
      totalThemes: themes.length,
      averageStoriesPerStoryteller: (stories.length / storytellers.length).toFixed(1)
    },
    themes: {
      distribution: themeCount,
      top10: Object.entries(themeCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([theme, count]) => ({ theme, count }))
    },
    media: mediaTypes,
    projects: storytellerProjects
  };
}

/**
 * Save all processed data
 */
async function saveAllData(data) {
  const {
    stories,
    storyIndex,
    storytellers,
    themes,
    media,
    indices,
    analytics
  } = data;
  
  // Save manifest
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'manifest.json'),
    JSON.stringify({
      version: '2.0',
      generated: new Date().toISOString(),
      counts: {
        stories: stories.length,
        storytellers: storytellers.length,
        themes: themes.length,
        media: media.length
      }
    }, null, 2)
  );
  
  // Save main data files
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'stories.json'),
    JSON.stringify(stories, null, 2)
  );
  
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'stories/index.json'),
    JSON.stringify(storyIndex, null, 2)
  );
  
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'storytellers.json'),
    JSON.stringify(storytellers, null, 2)
  );
  
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'themes.json'),
    JSON.stringify(themes, null, 2)
  );
  
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'media.json'),
    JSON.stringify(media, null, 2)
  );
  
  // Save individual story files for lazy loading
  stories.forEach(story => {
    fs.writeFileSync(
      path.join(OUTPUT_DIR, `stories/full/${story.id}.json`),
      JSON.stringify(story, null, 2)
    );
  });
  
  // Save indices
  Object.entries(indices.byTheme).forEach(([theme, storyIds]) => {
    const filename = theme.toLowerCase().replace(/\s+/g, '-');
    fs.writeFileSync(
      path.join(OUTPUT_DIR, `stories/by-theme/${filename}.json`),
      JSON.stringify(storyIds, null, 2)
    );
  });
  
  // Save storyteller profiles
  storytellers.forEach(storyteller => {
    fs.writeFileSync(
      path.join(OUTPUT_DIR, `storytellers/profiles/${storyteller.id}.json`),
      JSON.stringify(storyteller, null, 2)
    );
  });
  
  // Save analytics
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'analytics.json'),
    JSON.stringify(analytics, null, 2)
  );
  
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'analytics/overview.json'),
    JSON.stringify(analytics.overview, null, 2)
  );
  
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'analytics/themes.json'),
    JSON.stringify(analytics.themes, null, 2)
  );
  
  // Save filter options
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'filters.json'),
    JSON.stringify({
      themes: themes.map(t => t.name).sort(),
      projects: ['Orange Sky', 'Orange Sky Projects'],
      mediaTypes: ['Video', 'Photo', 'Audio', 'Text']
    }, null, 2)
  );
}

// Export for MCP environment
module.exports = {
  processEmpathyLedgerData,
  TABLE_IDS,
  BASE_ID
};