#!/usr/bin/env node

/**
 * Direct Airtable fetch script (no MCP required)
 * Uses Airtable API directly to fetch Empathy Ledger data
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuration
const AIRTABLE_API_KEY = 'patK3CkFUsEr51WFy.07f3b75124f230a11673d8443be78c0cc78a71295d1871a102ff8ac276bab701';
const BASE_ID = 'app7G3Ae65pBblJke';

// Helper function to make Airtable API requests
function fetchFromAirtable(tableName, options = {}) {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams();
    if (options.filterByFormula) params.append('filterByFormula', options.filterByFormula);
    if (options.maxRecords) params.append('maxRecords', options.maxRecords);
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

// Fetch all records from a table (handles pagination)
async function fetchAllRecords(tableName, filterFormula = null) {
  let allRecords = [];
  let offset = null;

  do {
    console.log(`Fetching ${tableName}... ${allRecords.length} records so far`);
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

// Main fetch function
async function fetchEmpathyLedgerData() {
  console.log('Fetching Empathy Ledger data from Airtable...\n');

  try {
    // Fetch all data
    const [storytellers, stories, media, themes] = await Promise.all([
      fetchAllRecords('Storytellers', "OR({Project} = 'Orange Sky', {Project} = 'Orange Sky Projects')"),
      fetchAllRecords('Stories'),
      fetchAllRecords('Media'),
      fetchAllRecords('Themes')
    ]);

    console.log('\nData fetched successfully!');
    console.log(`- Storytellers: ${storytellers.length}`);
    console.log(`- Stories: ${stories.length}`);
    console.log(`- Media: ${media.length}`);
    console.log(`- Themes: ${themes.length}`);

    // Save raw data for inspection
    const tempDir = path.join(__dirname, '../temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Save samples
    if (storytellers.length > 0) {
      fs.writeFileSync(
        path.join(tempDir, 'sample-storyteller.json'),
        JSON.stringify(storytellers[0], null, 2)
      );
      console.log('\nSample storyteller saved to temp/sample-storyteller.json');
    }

    if (stories.length > 0) {
      fs.writeFileSync(
        path.join(tempDir, 'sample-story.json'),
        JSON.stringify(stories[0], null, 2)
      );
      console.log('Sample story saved to temp/sample-story.json');
    }

    // Process the data
    const empathyData = {
      storytellers: { records: storytellers },
      stories: { records: stories },
      media: { records: media },
      themes: { records: themes }
    };

    // Load and run the processing script
    const { processEmpathyLedgerData } = require('./process-empathy-ledger-data.js');
    await processEmpathyLedgerData(empathyData);

    console.log('\n✅ Data processing complete!');
    console.log('Check public/data/ for processed files');

  } catch (error) {
    console.error('❌ Error fetching data:', error.message);
    if (error.message.includes('401')) {
      console.error('Authentication failed. Check your API key.');
    } else if (error.message.includes('404')) {
      console.error('Table not found. Check table names.');
    }
  }
}

// Run the fetch
if (require.main === module) {
  fetchEmpathyLedgerData();
}

module.exports = { fetchEmpathyLedgerData, fetchAllRecords };