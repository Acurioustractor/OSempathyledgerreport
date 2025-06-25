#!/usr/bin/env node

/**
 * Data fetching script using Airtable MCP for Empathy Ledger
 * This script documents the MCP tools needed from Airtable integration
 */

const fs = require('fs');
const path = require('path');

// Ensure data directory exists
const dataDir = path.join(__dirname, '../public/data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

/**
 * REQUIRED AIRTABLE MCP TOOLS:
 * 
 * The following MCP tools from Airtable are needed:
 * 
 * 1. airtable.get_records() or similar
 *    - Parameters needed:
 *      - baseId: The Empathy Ledger base ID
 *      - tableName: "Storytellers" 
 *      - filter: Formula to get only Orange Sky Projects records
 *      - fields: Array of fields to retrieve
 * 
 * 2. airtable.get_records() for Stories table
 *    - Parameters needed:
 *      - baseId: Same Empathy Ledger base ID
 *      - tableName: "Stories"
 *      - filter: Only stories linked to Orange Sky storytellers
 * 
 * 3. airtable.get_records() for Themes table (if separate)
 *    - Parameters needed:
 *      - baseId: Same base ID
 *      - tableName: "Themes"
 */

// Privacy filtering functions
function filterStorytellerForPrivacy(storyteller) {
  // Only include storytellers with "Orange Sky Projects" tag
  if (!storyteller.fields?.Project?.includes('Orange Sky Projects')) {
    return null;
  }

  const consentLevel = storyteller.fields?.['Consent Status'] || 'Private';
  const anonymityLevel = storyteller.fields?.['Preferred Anonymity Level'] || 'Anonymous';

  // Base filtered data
  const filtered = {
    id: storyteller.id,
    role: storyteller.fields?.Role || 'friend',
    location: {
      city: storyteller.fields?.Location || 'Unknown',
      shift: storyteller.fields?.Shifts?.[0] // First linked shift
    },
    hasProfileConsent: consentLevel === 'Public' || consentLevel === 'Commercial',
    consentStatus: consentLevel,
    anonymityLevel: anonymityLevel
  };

  // Add personal details only if consent given
  if (filtered.hasProfileConsent) {
    if (anonymityLevel === 'Full Name') {
      filtered.name = storyteller.fields?.Name;
    } else if (anonymityLevel === 'Initials') {
      filtered.name = storyteller.fields?.Name?.split(' ')
        .map(n => n[0])
        .join('.') + '.';
    }
  }

  return filtered;
}

function filterStoryForPrivacy(story, storytellerConsent) {
  const filtered = {
    id: story.id,
    themes: story.fields?.Themes || [],
    location: story.fields?.Location || 'Unknown',
    mediaType: story.fields?.['Media Type'] || 'Text',
    collectionDate: story.fields?.['Collection Date'] || story.createdTime
  };

  // Include content only if consent allows
  if (storytellerConsent === 'Public' || storytellerConsent === 'Commercial') {
    filtered.transcript = story.fields?.Transcript;
    filtered.excerpt = story.fields?.Transcript?.substring(0, 200) + '...';
  } else if (storytellerConsent === 'Internal') {
    filtered.excerpt = '[Story shared for internal use only]';
  } else {
    filtered.excerpt = '[Story content protected]';
  }

  return filtered;
}

async function fetchDataFromAirtableMCP() {
  console.log(`
📊 Airtable MCP Data Fetch Requirements
======================================

This script requires the following from your Airtable MCP integration:

1. Base Information:
   - Empathy Ledger base ID
   - API access to read records

2. Required Tables:
   - Storytellers (with "Orange Sky Projects" filter)
   - Stories (linked to storytellers)
   - Themes (if separate table)
   - Shifts (for location data)

3. Key Filters:
   - Project = "Orange Sky Projects" (on Storytellers table)
   - Consent Status in ['Public', 'Commercial', 'Internal']
   
4. Privacy Rules Applied:
   - Public/Commercial: Full access to stories and profiles
   - Internal: Anonymous stories only, no profiles
   - Private/None: Excluded entirely

When running with Airtable MCP available, this script will:
1. Fetch all Orange Sky Projects storytellers
2. Fetch their associated stories
3. Apply privacy filters based on consent
4. Generate static JSON files for the build
`);

  try {
    // TODO: When MCP is available, replace with actual calls:
    /*
    // Example of expected MCP usage:
    const storytellers = await mcp.airtable.get_records({
      baseId: process.env.AIRTABLE_BASE_ID,
      tableName: 'Storytellers',
      filterByFormula: "{Project} = 'Orange Sky Projects'",
      fields: ['Name', 'Role', 'Location', 'Consent Status', 'Preferred Anonymity Level', 'Shifts']
    });

    const stories = await mcp.airtable.get_records({
      baseId: process.env.AIRTABLE_BASE_ID,
      tableName: 'Stories',
      filterByFormula: "FIND('Orange Sky', {Storyteller.Project}) > 0",
      fields: ['Transcript', 'Themes', 'Location', 'Media Type', 'Storyteller']
    });
    */

    // For now, document what we need
    const requiredData = {
      storytellers: {
        filter: "Project contains 'Orange Sky Projects'",
        fields: [
          'Name',
          'Project',
          'Location',
          'Role',
          'Unique Storyteller ID',
          'Consent Status',
          'Preferred Anonymity Level',
          'Shifts'
        ]
      },
      stories: {
        filter: "Linked to Orange Sky storytellers",
        fields: [
          'Story ID',
          'Storyteller',
          'Transcript',
          'Themes',
          'Location',
          'Media Type',
          'Collection Date'
        ]
      }
    };

    console.log('Required Airtable data structure:', JSON.stringify(requiredData, null, 2));

    // Generate mock data for now
    console.log('\n⚠️  Using mock data - replace with actual MCP calls when available');
    
    // Continue with existing mock data generation...
    require('./fetch-data.js');

  } catch (error) {
    console.error('❌ Error in data fetch:', error);
    process.exit(1);
  }
}

// Export for testing
module.exports = {
  filterStorytellerForPrivacy,
  filterStoryForPrivacy,
  fetchDataFromAirtableMCP
};

// Run if called directly
if (require.main === module) {
  fetchDataFromAirtableMCP();
}