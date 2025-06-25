#!/usr/bin/env node

/**
 * Analyze theme data to understand Orange Sky filtering
 */

const fs = require('fs');
const path = require('path');

const rawDataPath = path.join(__dirname, '../public/data/raw-airtable-data.json');
const rawData = JSON.parse(fs.readFileSync(rawDataPath, 'utf8'));

console.log('🔍 Analyzing Theme Data...\n');

// Analyze all themes
const allThemes = rawData.themes.records;
console.log(`Total themes fetched: ${allThemes.length}`);

// Count themes with Orange Sky in their project field
let orangeSkyThemes = 0;
let themesWithProject = 0;
let themesWithQuotes = 0;

allThemes.forEach(theme => {
  const fields = theme.fields;
  const projects = fields['Project (from Related Media)'] || [];
  const quotes = fields['Quotes (from Related Media)'] || [];
  
  if (projects.length > 0) {
    themesWithProject++;
    if (projects.some(p => p.includes('Orange Sky'))) {
      orangeSkyThemes++;
    }
  }
  
  if (quotes.length > 0) {
    themesWithQuotes++;
  }
});

console.log(`\nTheme Analysis:`);
console.log(`- Themes with project data: ${themesWithProject}`);
console.log(`- Themes with Orange Sky project: ${orangeSkyThemes}`);
console.log(`- Themes with quotes: ${themesWithQuotes}`);

// Check quotes in media
const allMedia = rawData.media.records;
let totalQuotes = 0;
let orangeSkyQuotes = 0;

allMedia.forEach(media => {
  const fields = media.fields;
  const projects = fields.Project || [];
  const quotes = fields.Quotes || [];
  
  if (quotes.length > 0) {
    totalQuotes += quotes.length;
    if (projects.some(p => p.includes('Orange Sky'))) {
      orangeSkyQuotes += quotes.length;
    }
  }
});

console.log(`\nQuote Analysis:`);
console.log(`- Total quotes in media: ${totalQuotes}`);
console.log(`- Orange Sky quotes in media: ${orangeSkyQuotes}`);

// Check if themes are being filtered properly
console.log('\n🔍 Checking theme filtering logic...');

// Look at a few Orange Sky themes
console.log('\nSample themes with Orange Sky project:');
let sampleCount = 0;
allThemes.forEach(theme => {
  const fields = theme.fields;
  const projects = fields['Project (from Related Media)'] || [];
  
  if (projects.some(p => p.includes('Orange Sky')) && sampleCount < 5) {
    console.log(`- Theme: "${fields['Theme Name'] || fields.Name || 'Unnamed'}"`);
    console.log(`  Projects: ${projects.join(', ')}`);
    sampleCount++;
  }
});