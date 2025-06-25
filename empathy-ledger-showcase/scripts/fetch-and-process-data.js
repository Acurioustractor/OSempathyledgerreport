#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const https = require('https');

// Load environment variables
require('dotenv').config();

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
  console.error('❌ Missing required environment variables:');
  if (!AIRTABLE_API_KEY) console.error('  - AIRTABLE_API_KEY');
  if (!AIRTABLE_BASE_ID) console.error('  - AIRTABLE_BASE_ID');
  console.error('\nPlease create a .env file with these variables.');
  process.exit(1);
}

// Airtable configuration
const TABLES = {
  stories: 'tblVeH2clTvCB8ePq',
  storytellers: 'tblXQxqOgqCgORMzb',
  friends: 'tbl2hEOpvuLm2z9aZ',
  volunteers: 'tblwvkKSM8oPBIaJb'
};

// Data directories
const DATA_DIR = path.join(__dirname, '..', 'public', 'data');
const INDEXES_DIR = path.join(DATA_DIR, 'indexes');
const STORIES_DIR = path.join(DATA_DIR, 'stories');
const FULL_STORIES_DIR = path.join(STORIES_DIR, 'full');

// Helper function to ensure directories exist
async function ensureDirectories() {
  const dirs = [DATA_DIR, INDEXES_DIR, STORIES_DIR, FULL_STORIES_DIR];
  for (const dir of dirs) {
    await fs.mkdir(dir, { recursive: true });
  }
}

// Fetch data from Airtable
async function fetchFromAirtable(tableName, tableId) {
  console.log(`📥 Fetching ${tableName}...`);
  
  const records = [];
  let offset = null;
  
  do {
    const url = new URL(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${tableId}`);
    if (offset) url.searchParams.append('offset', offset);
    
    const response = await new Promise((resolve, reject) => {
      https.get(url.toString(), {
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          if (res.statusCode === 200) {
            resolve(JSON.parse(data));
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${data}`));
          }
        });
      }).on('error', reject);
    });
    
    records.push(...response.records);
    offset = response.offset;
  } while (offset);
  
  console.log(`✅ Fetched ${records.length} ${tableName}`);
  return records;
}

// Process raw data into structured format
async function processData(rawData) {
  console.log('🔄 Processing data...');
  
  const { stories, storytellers, friends, volunteers } = rawData;
  
  // Create storyteller lookup
  const storytellerMap = new Map();
  [...storytellers, ...friends, ...volunteers].forEach(person => {
    storytellerMap.set(person.id, {
      id: person.id,
      name: person.fields.Name || 'Anonymous',
      role: person.fields.Role || (storytellers.includes(person) ? 'Storyteller' : 
             friends.includes(person) ? 'Friend' : 'Volunteer'),
      location: person.fields.Location,
      anonymous: person.fields.Anonymous === true
    });
  });
  
  // Process stories
  const processedStories = stories
    .filter(story => story.fields['Consent to Share'] === true)
    .map(story => {
      const storytellerId = Array.isArray(story.fields.Storyteller) 
        ? story.fields.Storyteller[0] 
        : story.fields.Storyteller;
      
      const storyteller = storytellerMap.get(storytellerId) || {
        id: 'anonymous',
        name: 'Anonymous',
        anonymous: true
      };
      
      return {
        id: story.id,
        title: story.fields.Title || 'Untitled Story',
        quote: story.fields['Pull Quote'] || story.fields.Quote || '',
        content: story.fields.Story || '',
        themes: story.fields.Themes || [],
        location: story.fields.Location || storyteller.location || 'Unknown',
        date: story.fields.Date || story.fields['Created Time'],
        storyteller: {
          id: storyteller.id,
          name: storyteller.anonymous ? 'Anonymous' : storyteller.name,
          role: storyteller.role
        },
        consentLevel: story.fields['Consent Level'] || 'anonymous',
        featured: story.fields.Featured === true,
        media: story.fields.Media || []
      };
    });
  
  // Generate indexes
  const themes = [...new Set(processedStories.flatMap(s => s.themes))].sort();
  const locations = [...new Set(processedStories.map(s => s.location))].sort();
  
  const analytics = {
    totalStories: processedStories.length,
    totalStorytellers: storytellerMap.size,
    themes: themes.map(theme => ({
      name: theme,
      count: processedStories.filter(s => s.themes.includes(theme)).length
    })),
    locations: locations.map(location => ({
      name: location,
      count: processedStories.filter(s => s.location === location).length
    })),
    consentLevels: {
      full: processedStories.filter(s => s.consentLevel === 'full').length,
      anonymous: processedStories.filter(s => s.consentLevel === 'anonymous').length,
      internal: processedStories.filter(s => s.consentLevel === 'internal').length
    }
  };
  
  return {
    stories: processedStories,
    storytellers: Array.from(storytellerMap.values()),
    themes,
    locations,
    analytics,
    metadata: {
      lastUpdated: new Date().toISOString(),
      version: '2.0'
    }
  };
}

// Save processed data
async function saveData(data) {
  console.log('💾 Saving processed data...');
  
  // Save main data files
  await fs.writeFile(
    path.join(DATA_DIR, 'stories.json'),
    JSON.stringify(data.stories, null, 2)
  );
  
  await fs.writeFile(
    path.join(DATA_DIR, 'storytellers.json'),
    JSON.stringify(data.storytellers, null, 2)
  );
  
  await fs.writeFile(
    path.join(DATA_DIR, 'analytics.json'),
    JSON.stringify(data.analytics, null, 2)
  );
  
  await fs.writeFile(
    path.join(DATA_DIR, 'metadata.json'),
    JSON.stringify(data.metadata, null, 2)
  );
  
  // Save individual story files
  for (const story of data.stories) {
    await fs.writeFile(
      path.join(FULL_STORIES_DIR, `${story.id}.json`),
      JSON.stringify(story, null, 2)
    );
  }
  
  // Create search index
  const searchIndex = data.stories.map(story => ({
    id: story.id,
    title: story.title,
    quote: story.quote,
    themes: story.themes,
    location: story.location,
    storyteller: story.storyteller.name
  }));
  
  await fs.writeFile(
    path.join(INDEXES_DIR, 'search.json'),
    JSON.stringify(searchIndex, null, 2)
  );
  
  console.log('✅ All data saved successfully!');
}

// Main execution
async function main() {
  try {
    console.log('🚀 Starting Empathy Ledger data fetch and process...\n');
    
    // Ensure directories exist
    await ensureDirectories();
    
    // Fetch all data
    const rawData = {
      stories: await fetchFromAirtable('stories', TABLES.stories),
      storytellers: await fetchFromAirtable('storytellers', TABLES.storytellers),
      friends: await fetchFromAirtable('friends', TABLES.friends),
      volunteers: await fetchFromAirtable('volunteers', TABLES.volunteers)
    };
    
    // Save raw data for debugging
    await fs.writeFile(
      path.join(DATA_DIR, 'raw-airtable-data.json'),
      JSON.stringify(rawData, null, 2)
    );
    
    // Process data
    const processedData = await processData(rawData);
    
    // Save processed data
    await saveData(processedData);
    
    console.log('\n✨ Data fetch and processing complete!');
    console.log(`📊 Summary: ${processedData.stories.length} stories from ${processedData.storytellers.length} storytellers`);
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { fetchFromAirtable, processData, saveData };