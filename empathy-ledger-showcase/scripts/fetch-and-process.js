#!/usr/bin/env node

/**
 * Complete fetch and process script
 * Fetches from Airtable and processes with the v2 pipeline
 */

const https = require('https');
const { processEmpathyLedgerData } = require('./data-processing-v3');

// Configuration
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY || 'patK3CkFUsEr51WFy.07f3b75124f230a11673d8443be78c0cc78a71295d1871a102ff8ac276bab701';
const BASE_ID = 'app7G3Ae65pBblJke';

// Airtable API helper
function fetchFromAirtable(tableName, options = {}) {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams();
    if (options.filterByFormula) params.append('filterByFormula', options.filterByFormula);
    if (options.offset) params.append('offset', options.offset);

    const queryString = params.toString();
    const path = `/v0/${BASE_ID}/${encodeURIComponent(tableName)}${queryString ? '?' + queryString : ''}`;

    const requestOptions = {
      hostname: 'api.airtable.com',
      path: path,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(requestOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`API request failed: ${res.statusCode} - ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

// Fetch all records with pagination
async function fetchAllRecords(tableName, filterFormula = null) {
  let allRecords = [];
  let offset = null;

  do {
    console.log(`📥 Fetching ${tableName}... ${allRecords.length} records so far`);
    const options = {};
    if (filterFormula) options.filterByFormula = filterFormula;
    if (offset) options.offset = offset;

    const response = await fetchFromAirtable(tableName, options);
    allRecords = allRecords.concat(response.records);
    offset = response.offset;
  } while (offset);

  console.log(`✓ Fetched ${allRecords.length} records from ${tableName}`);
  return allRecords;
}

// Main execution
async function main() {
  console.log('🚀 Starting Empathy Ledger data fetch and process...\n');

  try {
    // Step 1: Fetch all data from Airtable
    console.log('📡 Fetching data from Airtable...\n');
    
    const [storytellers, stories, media, themes] = await Promise.all([
      fetchAllRecords('Storytellers', "OR({Project} = 'Orange Sky', {Project} = 'Orange Sky Projects')"),
      fetchAllRecords('Stories'),
      fetchAllRecords('Media'),
      fetchAllRecords('Themes')
    ]);

    console.log('\n✅ Data fetched successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Storytellers: ${storytellers.length}`);
    console.log(`   - Stories: ${stories.length}`);
    console.log(`   - Media: ${media.length}`);
    console.log(`   - Themes: ${themes.length}\n`);

    // Step 2: Process with v3 pipeline (Media-centric)
    const rawData = {
      storytellers: { records: storytellers },
      stories: { records: stories },
      media: { records: media },
      themes: { records: themes }
    };

    await processEmpathyLedgerData(rawData);

    console.log('\n🎉 Complete! Your data is ready in public/data/');
    console.log('   - Restart your Docker container to see the changes');
    console.log('   - Use the DataAPI in your components for elegant access');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { main };