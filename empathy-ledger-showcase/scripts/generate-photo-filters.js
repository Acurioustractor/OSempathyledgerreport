#!/usr/bin/env node

/**
 * Generate photo filters from the photo index data
 */

const fs = require('fs');
const path = require('path');

const PHOTO_INDEX_FILE = path.join(__dirname, '../public/data/photo-index.json');
const FILTERS_OUTPUT_FILE = path.join(__dirname, '../public/data/filters.json');

function generatePhotoFilters() {
  console.log('Generating photo filters from photo index...');
  
  try {
    // Read the photo index
    const photos = JSON.parse(fs.readFileSync(PHOTO_INDEX_FILE, 'utf8'));
    
    // Extract unique tags and locations
    const tagsSet = new Set();
    const locationsSet = new Set();
    const monthsSet = new Set();
    
    photos.forEach(photo => {
      // Add all tags
      if (photo.tags && Array.isArray(photo.tags)) {
        photo.tags.forEach(tag => tagsSet.add(tag));
      }
      
      // Add location
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
    
    // Convert sets to sorted arrays
    const themes = Array.from(tagsSet).sort();
    const locations = Array.from(locationsSet).sort();
    const months = Array.from(monthsSet).sort();
    
    // Read existing filters file for projects and mediaTypes
    let existingFilters = { projects: [], mediaTypes: [] };
    try {
      existingFilters = JSON.parse(fs.readFileSync(FILTERS_OUTPUT_FILE, 'utf8'));
    } catch (e) {
      console.log('No existing filters file found, creating new one');
    }
    
    const filters = {
      themes: themes,
      locations: locations,
      months: months,
      projects: existingFilters.projects || ["Orange Sky", "Orange Sky Projects"],
      mediaTypes: existingFilters.mediaTypes || ["Video", "Photo", "Audio", "Text"]
    };
    
    // Write the filters file
    fs.writeFileSync(FILTERS_OUTPUT_FILE, JSON.stringify(filters, null, 2));
    console.log(`Photo filters generated at ${FILTERS_OUTPUT_FILE}`);
    console.log(`Generated ${themes.length} themes, ${locations.length} locations, ${months.length} months`);
    
  } catch (error) {
    console.error('Error generating photo filters:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  generatePhotoFilters();
}

module.exports = { generatePhotoFilters };