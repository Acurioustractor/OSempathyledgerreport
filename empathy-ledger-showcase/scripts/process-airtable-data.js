#!/usr/bin/env node

/**
 * Comprehensive Airtable data processing script
 * Handles complex relationships and generates optimized JSON files
 */

const fs = require('fs');
const path = require('path');

const BASE_ID = 'app7G3Ae65pBblJke';
const OUTPUT_DIR = path.join(__dirname, '../public/data');

// Ensure output directories exist
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Create all necessary directories
ensureDir(OUTPUT_DIR);
ensureDir(path.join(OUTPUT_DIR, 'stories'));
ensureDir(path.join(OUTPUT_DIR, 'stories/by-location'));
ensureDir(path.join(OUTPUT_DIR, 'stories/by-theme'));
ensureDir(path.join(OUTPUT_DIR, 'stories/full'));
ensureDir(path.join(OUTPUT_DIR, 'storytellers'));
ensureDir(path.join(OUTPUT_DIR, 'storytellers/profiles'));
ensureDir(path.join(OUTPUT_DIR, 'analytics'));

/**
 * Step 1: Fetch all data from Airtable
 * Run these in your Cursor environment with MCP
 */
console.log(`
=================================================================
STEP 1: Fetch Data from Airtable MCP
=================================================================

Run these commands in Cursor:

const allData = {
  storytellers: await mcp.airtable.getRecords({
    baseId: "${BASE_ID}",
    tableName: "Storytellers",
    filterByFormula: "{Project} = 'Orange Sky'"
  }),
  stories: await mcp.airtable.getRecords({
    baseId: "${BASE_ID}",
    tableName: "Stories"
  }),
  themes: await mcp.airtable.getRecords({
    baseId: "${BASE_ID}",
    tableName: "Themes"
  }),
  shifts: await mcp.airtable.getRecords({
    baseId: "${BASE_ID}",
    tableName: "Shifts"
  })
};

// Then call: processAllData(allData);
=================================================================
`);

/**
 * Main data processing function
 */
async function processAllData(rawData) {
  console.log('\\nProcessing Airtable data...');
  
  const { storytellers, stories, themes, shifts } = rawData;
  
  // Create lookup maps
  const storytellerMap = new Map();
  const themeMap = new Map();
  const shiftMap = new Map();
  
  // Process themes
  themes.records.forEach(theme => {
    themeMap.set(theme.id, {
      id: theme.id,
      name: theme.fields.Name || 'Unknown Theme',
      description: theme.fields.Description || ''
    });
  });
  
  // Process shifts
  shifts.records.forEach(shift => {
    shiftMap.set(shift.id, {
      id: shift.id,
      name: shift.fields.Name || 'Unknown Shift',
      location: shift.fields.Location || 'Unknown',
      city: shift.fields.City || 'Unknown'
    });
  });
  
  // Process storytellers with privacy filters
  const processedStorytellers = [];
  storytellers.records.forEach(storyteller => {
    const processed = processStoryteller(storyteller, shiftMap);
    if (processed) {
      processedStorytellers.push(processed);
      storytellerMap.set(storyteller.id, processed);
    }
  });
  
  // Process stories and link relationships
  const processedStories = [];
  const storyIndex = [];
  const storiesByLocation = {};
  const storiesByTheme = {};
  const storiesByRole = {};
  
  stories.records.forEach(story => {
    const storytellerId = story.fields.Storyteller?.[0];
    const storyteller = storytellerMap.get(storytellerId);
    
    if (!storyteller) return; // Skip stories without Orange Sky storytellers
    
    const processed = processStory(story, storyteller, themeMap, shiftMap);
    if (!processed) return;
    
    processedStories.push(processed);
    
    // Create index entry (minimal data for listing)
    storyIndex.push({
      id: processed.id,
      title: processed.title,
      excerpt: processed.excerpt,
      location: processed.location,
      themes: processed.themeNames,
      collectionDate: processed.collectionDate,
      hasContent: processed.hasContent
    });
    
    // Index by location
    const location = processed.location.city;
    if (!storiesByLocation[location]) storiesByLocation[location] = [];
    storiesByLocation[location].push(processed.id);
    
    // Index by theme
    processed.themeNames.forEach(theme => {
      if (!storiesByTheme[theme]) storiesByTheme[theme] = [];
      storiesByTheme[theme].push(processed.id);
    });
    
    // Index by role
    const role = storyteller.role;
    if (!storiesByRole[role]) storiesByRole[role] = [];
    storiesByRole[role].push(processed.id);
    
    // Update storyteller metrics
    storyteller.storyCount++;
    processed.themeNames.forEach(theme => {
      if (!storyteller.themes.includes(theme)) {
        storyteller.themes.push(theme);
      }
    });
  });
  
  // Generate analytics
  const analytics = generateAnalytics(processedStories, processedStorytellers);
  
  // Save all data files
  await saveDataFiles({
    stories: processedStories,
    storyIndex,
    storytellers: processedStorytellers,
    storiesByLocation,
    storiesByTheme,
    storiesByRole,
    analytics,
    themes: Array.from(themeMap.values()),
    locations: Array.from(new Set(processedStories.map(s => s.location.city))).sort()
  });
  
  console.log(`
✅ Data processing complete!
📊 Processed ${processedStories.length} stories from ${processedStorytellers.length} storytellers
📁 Data files saved to: ${OUTPUT_DIR}
  `);
}

/**
 * Process individual storyteller with privacy rules
 */
function processStoryteller(storyteller, shiftMap) {
  const fields = storyteller.fields;
  
  // Check consent
  const consentStatus = fields['Consent Status'] || 'Private';
  if (consentStatus === 'Private' || !consentStatus) return null;
  
  const anonymityLevel = fields['Preferred Anonymity Level'] || 'Anonymous';
  const hasProfileConsent = consentStatus === 'Public' || consentStatus === 'Commercial';
  
  const processed = {
    id: storyteller.id,
    role: fields.Role || 'friend',
    location: {
      city: fields.Location || 'Unknown',
      shift: fields.Shifts ? shiftMap.get(fields.Shifts[0])?.name : null
    },
    hasProfileConsent,
    consentStatus,
    anonymityLevel,
    themes: [],
    storyCount: 0,
    joinedDate: storyteller.createdTime
  };
  
  // Add name based on consent and anonymity
  if (hasProfileConsent && fields.Name) {
    if (anonymityLevel === 'Full Name') {
      processed.name = fields.Name;
    } else if (anonymityLevel === 'Initials') {
      const initials = fields.Name.split(' ').map(n => n[0]).join('.') + '.';
      processed.name = initials;
    } else {
      processed.name = 'Anonymous';
    }
  }
  
  // Add journey/bio if consented
  if (hasProfileConsent && fields.Bio) {
    processed.journey = fields.Bio;
  }
  
  return processed;
}

/**
 * Process individual story with privacy rules
 */
function processStory(story, storyteller, themeMap, shiftMap) {
  const fields = story.fields;
  
  // Determine content visibility
  const hasContent = storyteller.consentStatus === 'Public' || 
                    storyteller.consentStatus === 'Commercial';
  
  const storyThemes = fields.Themes || [];
  const themeNames = storyThemes.map(themeId => 
    themeMap.get(themeId)?.name || 'Unknown'
  ).filter(Boolean);
  
  const processed = {
    id: story.id,
    storytellerId: storyteller.id,
    storytellerRole: storyteller.role,
    title: hasContent && fields.Title ? fields.Title : `Story from ${storyteller.location.city}`,
    hasContent,
    themes: storyThemes,
    themeNames,
    location: {
      city: fields.Location || storyteller.location.city || 'Unknown',
      shift: fields.Shift ? shiftMap.get(fields.Shift[0])?.name : storyteller.location.shift
    },
    mediaType: fields['Media Type'] || 'Text',
    collectionDate: fields['Collection Date'] || story.createdTime,
    privacyLevel: storyteller.consentStatus
  };
  
  // Add content based on consent
  if (hasContent) {
    processed.content = fields.Transcript || fields.Content || '';
    processed.excerpt = processed.content.substring(0, 200) + '...';
  } else if (storyteller.consentStatus === 'Internal') {
    processed.excerpt = '[Story shared for internal use only]';
  } else {
    processed.excerpt = '[Story content protected]';
  }
  
  return processed;
}

/**
 * Generate analytics from processed data
 */
function generateAnalytics(stories, storytellers) {
  const themeCount = {};
  const locationCount = {};
  const roleCount = { friends: 0, volunteers: 0, staff: 0 };
  const monthlyCount = {};
  
  stories.forEach(story => {
    // Theme distribution
    story.themeNames.forEach(theme => {
      themeCount[theme] = (themeCount[theme] || 0) + 1;
    });
    
    // Location distribution
    locationCount[story.location.city] = (locationCount[story.location.city] || 0) + 1;
    
    // Monthly distribution
    const month = story.collectionDate.substring(0, 7); // YYYY-MM
    monthlyCount[month] = (monthlyCount[month] || 0) + 1;
  });
  
  storytellers.forEach(st => {
    if (st.role === 'friend') roleCount.friends++;
    else if (st.role === 'volunteer') roleCount.volunteers++;
    else if (st.role === 'staff') roleCount.staff++;
  });
  
  const dates = stories.map(s => s.collectionDate).sort();
  
  return {
    overview: {
      totalStories: stories.length,
      totalStorytellers: storytellers.length,
      citiesCount: Object.keys(locationCount).length,
      themesCount: Object.keys(themeCount).length,
      collectionPeriod: {
        start: dates[0] || '',
        end: dates[dates.length - 1] || ''
      }
    },
    roleDistribution: roleCount,
    locationDistribution: locationCount,
    themeDistribution: themeCount,
    monthlyDistribution: monthlyCount,
    topThemes: Object.entries(themeCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([theme, count]) => ({ theme, count })),
    topLocations: Object.entries(locationCount)
      .sort((a, b) => b[1] - a[1])
      .map(([location, count]) => ({ location, count }))
  };
}

/**
 * Save all processed data to optimized file structure
 */
async function saveDataFiles(data) {
  const {
    stories,
    storyIndex,
    storytellers,
    storiesByLocation,
    storiesByTheme,
    storiesByRole,
    analytics,
    themes,
    locations
  } = data;
  
  // Save manifest
  const manifest = {
    version: '1.0',
    generated: new Date().toISOString(),
    counts: {
      stories: stories.length,
      storytellers: storytellers.length,
      themes: themes.length,
      locations: locations.length
    }
  };
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );
  
  // Save story index
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'stories/index.json'),
    JSON.stringify(storyIndex, null, 2)
  );
  
  // Save individual story files
  stories.forEach(story => {
    fs.writeFileSync(
      path.join(OUTPUT_DIR, `stories/full/${story.id}.json`),
      JSON.stringify(story, null, 2)
    );
  });
  
  // Save location indexes
  Object.entries(storiesByLocation).forEach(([location, storyIds]) => {
    const filename = location.toLowerCase().replace(/\\s+/g, '-');
    fs.writeFileSync(
      path.join(OUTPUT_DIR, `stories/by-location/${filename}.json`),
      JSON.stringify(storyIds, null, 2)
    );
  });
  
  // Save theme indexes
  Object.entries(storiesByTheme).forEach(([theme, storyIds]) => {
    const filename = theme.toLowerCase().replace(/\\s+/g, '-');
    fs.writeFileSync(
      path.join(OUTPUT_DIR, `stories/by-theme/${filename}.json`),
      JSON.stringify(storyIds, null, 2)
    );
  });
  
  // Save storyteller data
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'storytellers/index.json'),
    JSON.stringify(storytellers.filter(s => s.hasProfileConsent), null, 2)
  );
  
  // Save individual storyteller profiles
  storytellers.forEach(storyteller => {
    if (storyteller.hasProfileConsent) {
      fs.writeFileSync(
        path.join(OUTPUT_DIR, `storytellers/profiles/${storyteller.id}.json`),
        JSON.stringify(storyteller, null, 2)
      );
    }
  });
  
  // Save analytics files
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'analytics/overview.json'),
    JSON.stringify(analytics.overview, null, 2)
  );
  
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'analytics/themes.json'),
    JSON.stringify({
      distribution: analytics.themeDistribution,
      top: analytics.topThemes
    }, null, 2)
  );
  
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'analytics/locations.json'),
    JSON.stringify({
      distribution: analytics.locationDistribution,
      list: analytics.topLocations
    }, null, 2)
  );
  
  // Save filter options
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'filters.json'),
    JSON.stringify({
      themes: themes.map(t => t.name).sort(),
      locations: locations,
      roles: ['friend', 'volunteer', 'staff'],
      mediaTypes: ['Text', 'Audio', 'Video']
    }, null, 2)
  );
  
  // Backwards compatibility files
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'stories.json'),
    JSON.stringify(stories, null, 2)
  );
  
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'storytellers.json'),
    JSON.stringify(storytellers, null, 2)
  );
  
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'analytics.json'),
    JSON.stringify(analytics, null, 2)
  );
}

// Export for use in MCP environment
module.exports = {
  processAllData,
  processStoryteller,
  processStory,
  generateAnalytics
};