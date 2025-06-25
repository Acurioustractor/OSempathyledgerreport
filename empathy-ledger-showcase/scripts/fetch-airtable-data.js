#!/usr/bin/env node

/**
 * Fetch data from Airtable and process it
 */

require('dotenv').config({ path: '.env.local' });
const Airtable = require('airtable');
const fs = require('fs');
const path = require('path');
const { processStorytellerCentricData } = require('./data-processing-v4');

// Configure Airtable
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

// Ensure data directory exists
const dataDir = path.join(__dirname, '../public/data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

async function fetchTable(tableName, selectOptions = {}) {
  console.log(`📥 Fetching ${tableName}...`);
  const records = [];
  
  try {
    await base(tableName).select({
      ...selectOptions,
      pageSize: 100
    }).eachPage((pageRecords, fetchNextPage) => {
      records.push(...pageRecords);
      fetchNextPage();
    });
    
    console.log(`✓ Fetched ${records.length} records from ${tableName}`);
    return records;
  } catch (error) {
    console.error(`❌ Error fetching ${tableName}:`, error.message);
    return [];
  }
}

async function fetchAllData() {
  console.log('🚀 Starting Airtable data fetch...\n');
  
  try {
    // Fetch all tables
    const [storytellers, stories, media, themes, quotes] = await Promise.all([
      fetchTable('Storytellers', {
        filterByFormula: "FIND('Orange Sky', {Project}) > 0"
      }),
      fetchTable('Stories'),
      fetchTable('Media'),
      fetchTable('Themes'),
      fetchTable('Quotes')
    ]);

    // Structure the raw data
    const rawData = {
      storytellers: { records: storytellers },
      stories: { records: stories },
      media: { records: media },
      themes: { records: themes },
      quotes: { records: quotes }
    };

    // Save raw data for debugging
    fs.writeFileSync(
      path.join(dataDir, 'raw-airtable-data.json'),
      JSON.stringify(rawData, null, 2)
    );

    console.log('\n📊 Data Summary:');
    console.log(`- Storytellers: ${storytellers.length} (Orange Sky filtered)`);
    console.log(`- Stories: ${stories.length}`);
    console.log(`- Media: ${media.length}`);
    console.log(`- Themes: ${themes.length}`);
    console.log(`- Quotes: ${quotes.length}`);

    // Process the data using our v4 storyteller-centric processor
    console.log('\n🔄 Processing data with storyteller-centric approach...\n');
    const summary = await processStorytellerCentricData(rawData);

    return { rawData, summary };
  } catch (error) {
    console.error('❌ Error in data fetch:', error);
    throw error;
  }
}

// Main execution
(async () => {
  try {
    // Check for API key
    if (!process.env.AIRTABLE_API_KEY || process.env.AIRTABLE_API_KEY === 'your_airtable_api_key_here') {
      console.error('❌ AIRTABLE_API_KEY not configured in .env.local');
      process.exit(1);
    }

    if (!process.env.AIRTABLE_BASE_ID) {
      console.error('❌ AIRTABLE_BASE_ID not configured in .env.local');
      process.exit(1);
    }

    console.log('📋 Configuration:');
    console.log(`- Base ID: ${process.env.AIRTABLE_BASE_ID}`);
    console.log(`- API Key: ${process.env.AIRTABLE_API_KEY.substring(0, 10)}...`);
    console.log('');

    const { rawData, summary } = await fetchAllData();

    console.log('\n✅ Data fetch and processing complete!');
    console.log('\n📂 Output files created in public/data/:');
    console.log('- stories.json');
    console.log('- storytellers.json');
    console.log('- themes.json');
    console.log('- media.json');
    console.log('- analytics.json');
    console.log('- Various index and analytics files');

    // Show storyteller insights
    console.log('\n👥 Storyteller Insights:');
    const analytics = JSON.parse(fs.readFileSync(path.join(dataDir, 'analytics.json'), 'utf8'));
    console.log(`- Total storytellers: ${analytics.overview.totalStorytellers}`);
    console.log(`- Volunteers: ${analytics.storytellers.byRole.volunteers}`);
    console.log(`- Friends: ${analytics.storytellers.byRole.friends}`);
    console.log(`- Service Providers: ${analytics.storytellers.byRole.serviceProviders}`);
    console.log(`- Average quotes per storyteller: ${analytics.storytellers.averageQuotesPerStoryteller}`);
    console.log(`- Average themes per storyteller: ${analytics.storytellers.averageThemesPerStoryteller}`);
    
    // Show theme insights
    console.log('\n🏷️ Theme Insights:');
    console.log(`- Total Orange Sky themes: ${analytics.themes.total}`);
    console.log(`- Themes with quotes: ${analytics.themes.withQuotes}`);
    if (analytics.themes.topByStorytellers && analytics.themes.topByStorytellers[0]) {
      console.log(`- Most discussed theme: "${analytics.themes.topByStorytellers[0].name}" (${analytics.themes.topByStorytellers[0].storytellerCount} storytellers)`);
    }
    
    // Show quote insights
    if (analytics.quotes) {
      console.log('\n💬 Quote Analytics:');
      console.log(`- Total quotes: ${analytics.quotes.total}`);
      console.log(`- Volunteer quotes: ${analytics.quotes.byRole.volunteers}`);
      console.log(`- Friend quotes: ${analytics.quotes.byRole.friends}`);
      console.log(`- Average quote length: ${analytics.quotes.averageLength} characters`);
    }

  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  }
})();