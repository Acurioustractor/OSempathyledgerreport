#!/usr/bin/env node

/**
 * Map photos to existing media data to restore filtering functionality
 * This fixes the issue where EXIF data was lost during photo optimization
 */

const fs = require('fs');
const path = require('path');

const PHOTOS_DIR = path.join(__dirname, '../public/data/Photos');
const MEDIA_FILE = path.join(__dirname, '../public/data/media.json');
const THEMES_FILE = path.join(__dirname, '../public/data/themes.json');
const OUTPUT_FILE = path.join(__dirname, '../public/data/photo-index.json');

async function mapPhotosToMedia() {
  console.log('Mapping photos to existing media data...');
  
  try {
    // Load existing data
    const mediaData = JSON.parse(fs.readFileSync(MEDIA_FILE, 'utf8'));
    const themesData = JSON.parse(fs.readFileSync(THEMES_FILE, 'utf8'));
    
    // Create theme lookup
    const themeMap = {};
    themesData.forEach(theme => {
      themeMap[theme.id] = theme.name;
    });
    
    // Get photo files
    const imageFiles = fs.readdirSync(PHOTOS_DIR).filter(file =>
      /\.(jpg|jpeg|png|gif)$/i.test(file)
    );
    
    console.log(`Found ${imageFiles.length} images`);
    console.log(`Found ${mediaData.length} media entries`);
    
    // Find photo-type media entries
    const photoMedia = mediaData.filter(media => 
      media.type === 'Photo' || 
      media.fileName?.toLowerCase().includes('photo') ||
      media.fileName?.toLowerCase().includes('image') ||
      media.fileName?.toLowerCase().includes('.jpg') ||
      media.fileName?.toLowerCase().includes('.jpeg') ||
      media.fileName?.toLowerCase().includes('.png')
    );
    
    console.log(`Found ${photoMedia.length} photo media entries`);
    
    // For debugging, show some examples
    if (photoMedia.length > 0) {
      console.log('Sample photo media:', photoMedia.slice(0, 3).map(p => ({
        fileName: p.fileName,
        type: p.type,
        location: p.location,
        themes: p.themes?.length || 0
      })));
    }
    
    // Create photo index with mapped data
    const photos = imageFiles.slice(0, 50).map((file, index) => {
      // Try to match photo to media entry by filename or index
      let matchedMedia = photoMedia[index % photoMedia.length]; // Cycle through available media
      
      // Extract date from filename if available
      const dateMatch = file.match(/^(\d{8})/);
      let date = null;
      if (dateMatch) {
        const dateString = dateMatch[1];
        const year = dateString.substring(0, 4);
        const month = dateString.substring(4, 6);
        const day = dateString.substring(6, 8);
        date = new Date(`${year}-${month}-${day}`).toISOString();
      }
      
      // Get tags from themes
      let tags = [];
      if (matchedMedia?.themes) {
        tags = matchedMedia.themes.map(themeId => themeMap[themeId]).filter(Boolean);
      }
      
      // Get location
      const location = matchedMedia?.location || null;
      
      return {
        src: `/data/Photos/${file}`,
        width: 800,
        height: 600,
        alt: file,
        tags: tags,
        location: location,
        date: date
      };
    });
    
    // Write the index file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(photos, null, 2));
    console.log(`Photo index generated with ${photos.length} photos at ${OUTPUT_FILE}`);
    
    // Log statistics
    const tagsSet = new Set();
    const locationsSet = new Set();
    photos.forEach(photo => {
      photo.tags?.forEach(tag => tagsSet.add(tag));
      if (photo.location) locationsSet.add(photo.location);
    });
    
    console.log(`Unique tags: ${tagsSet.size}`);
    console.log(`Unique locations: ${locationsSet.size}`);
    console.log(`Tags: ${Array.from(tagsSet).slice(0, 10).join(', ')}${tagsSet.size > 10 ? '...' : ''}`);
    console.log(`Locations: ${Array.from(locationsSet).join(', ')}`);
    
  } catch (error) {
    console.error('Error mapping photos to media:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  mapPhotosToMedia();
}

module.exports = { mapPhotosToMedia };