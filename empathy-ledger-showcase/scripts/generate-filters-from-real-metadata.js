#!/usr/bin/env node

/**
 * STEP 3: Generate filters from the real extracted metadata
 */

const fs = require('fs');
const path = require('path');

const PHOTO_INDEX_FILE = path.join(__dirname, '../public/data/photo-index.json');
const FILTERS_OUTPUT_FILE = path.join(__dirname, '../public/data/filters.json');

function generateFiltersFromRealMetadata() {
  console.log('🎯 Generating filters from REAL metadata...');
  
  try {
    const photos = JSON.parse(fs.readFileSync(PHOTO_INDEX_FILE, 'utf8'));
    console.log(`📋 Processing ${photos.length} photos`);
    
    // Extract real data
    const tagsSet = new Set();
    const locationsSet = new Set();
    const monthsSet = new Set();
    
    photos.forEach(photo => {
      // Add all real tags
      if (photo.tags && Array.isArray(photo.tags)) {
        photo.tags.forEach(tag => tagsSet.add(tag));
      }
      
      // Add location if available
      if (photo.location) {
        locationsSet.add(photo.location);
      }
      
      // Add month from date
      if (photo.date) {
        const date = new Date(photo.date);
        const month = date.toLocaleDateString('en-US', { month: 'long' });
        monthsSet.add(month);
      }
    });
    
    // Convert to sorted arrays
    const themes = Array.from(tagsSet).sort();
    const locations = Array.from(locationsSet).sort();
    const months = Array.from(monthsSet).sort();
    
    const filters = {
      themes: themes,
      locations: locations.length > 0 ? locations : ["All Locations"], // Fallback if no locations
      months: months,
      projects: ["Orange Sky", "Orange Sky Projects"],
      mediaTypes: ["Video", "Photo", "Audio", "Text"]
    };
    
    // Write the filters file
    fs.writeFileSync(FILTERS_OUTPUT_FILE, JSON.stringify(filters, null, 2));
    
    console.log(`\n✅ REAL FILTERS GENERATED:`);
    console.log(`   🏷️  Tags: ${themes.join(', ') || 'None'}`);
    console.log(`   🌍 Locations: ${locations.join(', ') || 'None'}`);
    console.log(`   📅 Months: ${months.join(', ') || 'None'}`);
    console.log(`   📁 File: ${FILTERS_OUTPUT_FILE}`);
    
  } catch (error) {
    console.error('💥 Error generating filters:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  generateFiltersFromRealMetadata();
}

module.exports = { generateFiltersFromRealMetadata };