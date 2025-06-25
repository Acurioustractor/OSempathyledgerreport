#!/usr/bin/env node

/**
 * Fetch Orange Sky Projects data from Empathy Ledger Airtable base
 * Base ID: app7G3Ae65pBblJke
 * 
 * This script should be run in an environment with Airtable MCP access
 */

const fs = require('fs');
const path = require('path');

const AIRTABLE_BASE_ID = 'app7G3Ae65pBblJke';
const OUTPUT_DIR = path.join(__dirname, '../public/data');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * MCP Commands to fetch Orange Sky Projects data
 * 
 * Run these commands in your Cursor environment with Airtable MCP:
 */

console.log(`
=================================================================
Empathy Ledger Data Fetch - MCP Commands
=================================================================

Base ID: ${AIRTABLE_BASE_ID}

1. FETCH STORYTELLERS (Orange Sky Projects only):
-------------------------------------------------
const storytellers = await mcp.airtable.getRecords({
  baseId: "${AIRTABLE_BASE_ID}",
  tableName: "Storytellers",
  filterByFormula: "{Project} = 'Orange Sky Projects'"
});

2. FETCH STORIES (linked to Orange Sky storytellers):
----------------------------------------------------
const stories = await mcp.airtable.getRecords({
  baseId: "${AIRTABLE_BASE_ID}",
  tableName: "Stories"
});

3. FETCH THEMES (if separate table):
-----------------------------------
const themes = await mcp.airtable.getRecords({
  baseId: "${AIRTABLE_BASE_ID}",
  tableName: "Themes"
});

4. FETCH SHIFTS (for location data):
-----------------------------------
const shifts = await mcp.airtable.getRecords({
  baseId: "${AIRTABLE_BASE_ID}",
  tableName: "Shifts"
});

=================================================================
`);

// Privacy filtering functions
function filterStorytellerForPrivacy(storyteller) {
  const fields = storyteller.fields || {};
  
  // Only include Orange Sky Projects storytellers
  if (!fields.Project || !fields.Project.includes('Orange Sky Projects')) {
    return null;
  }

  const consentStatus = fields['Consent Status'] || 'Private';
  const anonymityLevel = fields['Preferred Anonymity Level'] || 'Anonymous';

  // Base filtered data
  const filtered = {
    id: storyteller.id,
    role: fields.Role || 'friend',
    location: {
      city: fields.Location || 'Unknown',
      shift: fields.Shifts?.[0]
    },
    hasProfileConsent: consentStatus === 'Public' || consentStatus === 'Commercial',
    consentStatus: consentStatus,
    anonymityLevel: anonymityLevel,
    themes: [], // Will be populated from stories
    storyCount: 0 // Will be calculated
  };

  // Add name based on consent and anonymity preference
  if (filtered.hasProfileConsent) {
    if (anonymityLevel === 'Full Name' && fields.Name) {
      filtered.name = fields.Name;
    } else if (anonymityLevel === 'Initials' && fields.Name) {
      filtered.name = fields.Name.split(' ')
        .map(n => n[0])
        .join('.') + '.';
    }
  }

  // Add journey if consented
  if (filtered.hasProfileConsent && fields['Video draft link']) {
    filtered.journey = 'Story available';
  }

  return filtered;
}

function filterStoryForPrivacy(story, storytellerMap) {
  const fields = story.fields || {};
  const storytellerId = fields.Storyteller?.[0];
  const storyteller = storytellerMap.get(storytellerId);
  
  // Only include stories from Orange Sky storytellers
  if (!storyteller) return null;

  const filtered = {
    id: story.id,
    storytellerId: storytellerId,
    themes: fields.Themes || [],
    location: fields.Location || storyteller.location.city || 'Unknown',
    mediaType: fields['Media Type'] || 'Text',
    collectionDate: fields['Collection Date'] || story.createdTime,
    hasContentConsent: storyteller.consentStatus === 'Public' || storyteller.consentStatus === 'Commercial',
    hasProfileConsent: storyteller.hasProfileConsent,
    privacyLevel: storyteller.consentStatus === 'Public' ? 'full' : 
                  storyteller.consentStatus === 'Commercial' ? 'full' :
                  storyteller.consentStatus === 'Internal' ? 'anonymous' : 'aggregate'
  };

  // Include content based on consent
  if (filtered.hasContentConsent && fields.Transcript) {
    filtered.content = fields.Transcript;
    filtered.excerpt = fields.Transcript.substring(0, 200) + '...';
    filtered.title = `Story from ${storyteller.location.city}`;
  } else if (storyteller.consentStatus === 'Internal') {
    filtered.title = 'Anonymous Story';
    filtered.excerpt = '[Story shared for internal use only]';
  } else {
    filtered.title = 'Protected Story';
    filtered.excerpt = '[Story content protected]';
  }

  return filtered;
}

// Process data and generate files
async function processAndSaveData(storytellersData, storiesData) {
  console.log('\\nProcessing data with privacy filters...');

  // Filter storytellers
  const filteredStorytellers = [];
  const storytellerMap = new Map();

  storytellersData.forEach(record => {
    const filtered = filterStorytellerForPrivacy(record);
    if (filtered) {
      filteredStorytellers.push(filtered);
      storytellerMap.set(record.id, filtered);
    }
  });

  console.log(`Filtered ${filteredStorytellers.length} Orange Sky storytellers`);

  // Filter stories and link to storytellers
  const filteredStories = [];
  const themeCount = {};
  const locationCount = {};

  storiesData.forEach(record => {
    const filtered = filterStoryForPrivacy(record, storytellerMap);
    if (filtered) {
      filteredStories.push(filtered);
      
      // Update storyteller story count
      const storyteller = storytellerMap.get(filtered.storytellerId);
      if (storyteller) {
        storyteller.storyCount++;
        // Add themes to storyteller
        filtered.themes.forEach(theme => {
          if (!storyteller.themes.includes(theme)) {
            storyteller.themes.push(theme);
          }
        });
      }

      // Count themes and locations
      filtered.themes.forEach(theme => {
        themeCount[theme] = (themeCount[theme] || 0) + 1;
      });
      locationCount[filtered.location] = (locationCount[filtered.location] || 0) + 1;
    }
  });

  console.log(`Filtered ${filteredStories.length} stories with appropriate privacy levels`);

  // Generate analytics
  const roleCount = filteredStorytellers.reduce((acc, st) => {
    const role = st.role === 'volunteer' ? 'volunteers' : 'friends';
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {});

  const analytics = {
    totalStories: filteredStories.length,
    totalStorytellers: filteredStorytellers.length,
    citiesCount: Object.keys(locationCount).length,
    themesCount: Object.keys(themeCount).length,
    collectionPeriod: {
      start: '2023-06-01', // Update based on actual data
      end: '2024-05-31'
    },
    roleDistribution: roleCount,
    locationDistribution: locationCount,
    themeDistribution: themeCount
  };

  // Save files
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'storytellers.json'),
    JSON.stringify(filteredStorytellers, null, 2)
  );

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'stories.json'),
    JSON.stringify(filteredStories, null, 2)
  );

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'analytics.json'),
    JSON.stringify(analytics, null, 2)
  );

  console.log(`
✅ Data files generated successfully!
📊 ${filteredStories.length} stories from ${filteredStorytellers.length} storytellers
📍 ${Object.keys(locationCount).length} cities
🏷️  ${Object.keys(themeCount).length} themes

Files saved to: ${OUTPUT_DIR}
  `);
}

// Instructions for running with MCP
console.log(`
TO FETCH REAL DATA:
==================
1. Run the MCP commands above in Cursor
2. Pass the results to processAndSaveData():

   processAndSaveData(storytellers.records, stories.records);

3. The filtered JSON files will be generated in public/data/

PRIVACY RULES APPLIED:
=====================
✅ Only Orange Sky Projects records included
✅ Names anonymized based on preferences
✅ Stories filtered by consent level
✅ No personal data exposed without consent
`);

// Export for use in MCP environment
module.exports = {
  filterStorytellerForPrivacy,
  filterStoryForPrivacy,
  processAndSaveData,
  AIRTABLE_BASE_ID
};