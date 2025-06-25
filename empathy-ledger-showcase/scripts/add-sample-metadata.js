#!/usr/bin/env node

/**
 * Add sample metadata to photos for demonstration purposes
 * This creates realistic tags, locations, and dates based on Orange Sky's work
 */

const fs = require('fs');
const path = require('path');

const PHOTO_INDEX_FILE = path.join(__dirname, '../public/data/photo-index.json');

// Sample Orange Sky locations (based on their real presence in Australia)
const LOCATIONS = [
  'Brisbane', 'Sydney', 'Melbourne', 'Perth', 'Adelaide', 
  'Gold Coast', 'Newcastle', 'Wollongong', 'Cairns', 'Darwin'
];

// Sample tags relevant to Orange Sky's work
const TAGS = [
  'laundry', 'shower', 'community', 'volunteers', 'conversation',
  'support', 'dignity', 'connection', 'outreach', 'mobile-service',
  'street-work', 'care', 'orange-sky', 'van', 'equipment',
  'teamwork', 'compassion', 'homeless-services', 'friendship', 'respect'
];

function addSampleMetadata() {
  console.log('Adding sample metadata to photo index...');
  
  try {
    const photos = JSON.parse(fs.readFileSync(PHOTO_INDEX_FILE, 'utf8'));
    
    const updatedPhotos = photos.map((photo, index) => {
      // Extract date from filename if it starts with date pattern (YYYYMMDD)
      const filename = path.basename(photo.src);
      const dateMatch = filename.match(/^(\d{8})/);
      
      let date = null;
      if (dateMatch) {
        const dateString = dateMatch[1];
        const year = dateString.substring(0, 4);
        const month = dateString.substring(4, 6);
        const day = dateString.substring(6, 8);
        date = new Date(`${year}-${month}-${day}`).toISOString();
      }
      
      // If no date in filename, generate a random date in 2024
      if (!date) {
        const randomDate = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
        date = randomDate.toISOString();
      }
      
      // Assign location (cycle through locations to ensure variety)
      const location = LOCATIONS[index % LOCATIONS.length];
      
      // Assign 2-4 random tags to each photo
      const numTags = Math.floor(Math.random() * 3) + 2; // 2-4 tags
      const photoTags = [];
      const shuffledTags = [...TAGS].sort(() => 0.5 - Math.random());
      for (let i = 0; i < numTags; i++) {
        photoTags.push(shuffledTags[i]);
      }
      
      return {
        ...photo,
        tags: photoTags,
        location: location,
        date: date
      };
    });
    
    // Write updated photo index
    fs.writeFileSync(PHOTO_INDEX_FILE, JSON.stringify(updatedPhotos, null, 2));
    
    console.log(`Updated ${updatedPhotos.length} photos with sample metadata`);
    
    // Log statistics
    const tagsSet = new Set();
    const locationsSet = new Set();
    updatedPhotos.forEach(photo => {
      photo.tags.forEach(tag => tagsSet.add(tag));
      locationsSet.add(photo.location);
    });
    
    console.log(`Unique tags: ${tagsSet.size}`);
    console.log(`Unique locations: ${locationsSet.size}`);
    console.log(`Tags: ${Array.from(tagsSet).join(', ')}`);
    console.log(`Locations: ${Array.from(locationsSet).join(', ')}`);
    
  } catch (error) {
    console.error('Error adding sample metadata:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  addSampleMetadata();
}

module.exports = { addSampleMetadata };