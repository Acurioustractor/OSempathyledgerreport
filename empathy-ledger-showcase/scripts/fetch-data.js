#!/usr/bin/env node

/**
 * Data fetching script using MCP to get Airtable data
 * This script will be run during build time to fetch data from Airtable via MCP
 */

const fs = require('fs');
const path = require('path');

// Ensure data directory exists
const dataDir = path.join(__dirname, '../public/data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Privacy filtering function
function filterStoryData(rawStory) {
  return {
    id: rawStory.id,
    title: rawStory.fields?.Title || undefined,
    content: rawStory.fields?.hasContentConsent ? rawStory.fields.Content : '[Content available with consent]',
    excerpt: rawStory.fields?.Excerpt || rawStory.fields?.Content?.substring(0, 150) + '...',
    themes: rawStory.fields?.Themes || [],
    location: {
      city: rawStory.fields?.City || 'Unknown',
      shift: rawStory.fields?.Shift,
      coordinates: rawStory.fields?.Coordinates ? {
        lat: rawStory.fields.Coordinates.lat,
        lng: rawStory.fields.Coordinates.lng
      } : undefined
    },
    collectionDate: rawStory.fields?.CollectionDate || rawStory.createdTime,
    storytellerId: rawStory.fields?.StorytellerID,
    hasContentConsent: rawStory.fields?.hasContentConsent || false,
    hasProfileConsent: rawStory.fields?.hasProfileConsent || false,
    privacyLevel: rawStory.fields?.PrivacyLevel || 'anonymous'
  };
}

function filterStorytellerData(rawStoryteller) {
  return {
    id: rawStoryteller.id,
    role: rawStoryteller.fields?.Role || 'friend',
    location: {
      city: rawStoryteller.fields?.City || 'Unknown',
      shift: rawStoryteller.fields?.Shift
    },
    storyCount: rawStoryteller.fields?.StoryCount || 0,
    themes: rawStoryteller.fields?.Themes || [],
    journey: rawStoryteller.fields?.hasProfileConsent ? rawStoryteller.fields.Journey : undefined,
    hasProfileConsent: rawStoryteller.fields?.hasProfileConsent || false,
    shiftAssociation: rawStoryteller.fields?.ShiftAssociation
  };
}

// Mock data generation for development
// This will be replaced with actual MCP calls
function generateMockData() {
  console.log('Generating mock data for development...');
  
  const mockStories = Array.from({ length: 102 }, (_, i) => ({
    id: `story-${i + 1}`,
    title: `Story ${i + 1}: A Journey of Connection`,
    content: `This is the content of story ${i + 1}. It tells a meaningful tale of human connection, resilience, and community support. Each story represents a real person's experience and journey.`,
    excerpt: `This is the excerpt for story ${i + 1}...`,
    themes: ['connection', 'community', 'support', 'resilience', 'hope'].slice(0, Math.floor(Math.random() * 3) + 2),
    location: {
      city: ['Brisbane', 'Melbourne', 'Sydney', 'Perth', 'Adelaide', 'Gold Coast', 'Newcastle', 'Cairns'][Math.floor(Math.random() * 8)],
      shift: ['Morning', 'Afternoon', 'Evening'][Math.floor(Math.random() * 3)]
    },
    collectionDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
    storytellerId: `storyteller-${Math.floor(Math.random() * 85) + 1}`,
    hasContentConsent: true,
    hasProfileConsent: Math.random() > 0.3,
    privacyLevel: ['full', 'anonymous', 'aggregate'][Math.floor(Math.random() * 3)]
  }));

  const mockStorytellers = Array.from({ length: 85 }, (_, i) => ({
    id: `storyteller-${i + 1}`,
    role: Math.random() > 0.3 ? 'friend' : 'volunteer',
    location: {
      city: ['Brisbane', 'Melbourne', 'Sydney', 'Perth', 'Adelaide', 'Gold Coast', 'Newcastle', 'Cairns'][Math.floor(Math.random() * 8)],
      shift: ['Morning', 'Afternoon', 'Evening'][Math.floor(Math.random() * 3)]
    },
    storyCount: Math.floor(Math.random() * 5) + 1,
    themes: ['connection', 'community', 'support', 'resilience', 'hope', 'belonging', 'growth'].slice(0, Math.floor(Math.random() * 4) + 2),
    journey: Math.random() > 0.5 ? `This is the journey of storyteller ${i + 1}...` : undefined,
    hasProfileConsent: Math.random() > 0.4,
    shiftAssociation: `Shift Association ${i + 1}`
  }));

  // Calculate analytics
  const cities = new Set(mockStories.map(s => s.location.city));
  const themes = new Set(mockStories.flatMap(s => s.themes));
  
  const locationDistribution = {};
  const themeDistribution = {};
  
  mockStories.forEach(story => {
    locationDistribution[story.location.city] = (locationDistribution[story.location.city] || 0) + 1;
    story.themes.forEach(theme => {
      themeDistribution[theme] = (themeDistribution[theme] || 0) + 1;
    });
  });

  const roleDistribution = mockStorytellers.reduce((acc, st) => {
    acc[st.role === 'volunteer' ? 'volunteers' : 'friends']++;
    return acc;
  }, { friends: 0, volunteers: 0 });

  const dates = mockStories.map(s => s.collectionDate).sort();

  const mockAnalytics = {
    totalStories: mockStories.length,
    totalStorytellers: mockStorytellers.length,
    citiesCount: cities.size,
    themesCount: themes.size,
    collectionPeriod: {
      start: dates[0],
      end: dates[dates.length - 1]
    },
    roleDistribution,
    locationDistribution,
    themeDistribution
  };

  return {
    stories: mockStories,
    storytellers: mockStorytellers,
    analytics: mockAnalytics
  };
}

async function fetchDataViaMCP() {
  try {
    console.log('Starting data fetch via MCP...');
    
    // TODO: Replace with actual MCP calls
    // For now, using mock data for development
    const data = generateMockData();
    
    // Write data files
    fs.writeFileSync(
      path.join(dataDir, 'stories.json'),
      JSON.stringify(data.stories, null, 2)
    );
    
    fs.writeFileSync(
      path.join(dataDir, 'storytellers.json'),
      JSON.stringify(data.storytellers, null, 2)
    );
    
    fs.writeFileSync(
      path.join(dataDir, 'analytics.json'),
      JSON.stringify(data.analytics, null, 2)
    );
    
    console.log('✅ Data files generated successfully!');
    console.log(`📊 Generated ${data.stories.length} stories`);
    console.log(`👥 Generated ${data.storytellers.length} storytellers`);
    console.log(`📈 Generated analytics for ${data.analytics.citiesCount} cities`);
    
  } catch (error) {
    console.error('❌ Error fetching data:', error);
    process.exit(1);
  }
}

// Instructions for MCP integration
console.log(`
🔧 MCP Integration Instructions:
===============================

To integrate with your Airtable MCP server:

1. Ensure AIRTABLE_API_KEY is set in your .env file
2. Configure the Airtable MCP server in .mcp.json
3. When using Claude Code with MCP enabled, run this script to fetch real data

IMPORTANT: This script should be run through Claude Code with MCP enabled
to fetch real data from Airtable. The MCP will:
- Filter for records with "Orange Sky Projects" tag
- Apply privacy filters based on consent levels
- Generate static JSON files for the build

Expected Airtable Structure:
- Storytellers table with fields: Name, Project (tag), Location, Role, 
  Consent Status, Preferred Anonymity Level, etc.
- Stories table linked to Storytellers
- Themes table for categorization

For now, using mock data that matches your expected structure.
`);

// Run the data fetch
fetchDataViaMCP();