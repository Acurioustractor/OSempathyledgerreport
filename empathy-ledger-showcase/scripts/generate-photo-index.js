#!/usr/bin/env node

/**
 * Generate a static photo index file that can be used in production
 * This avoids runtime filesystem access which doesn't work in serverless environments
 */

const fs = require('fs');
const path = require('path');
const exifr = require('exifr');

const PHOTOS_DIR = path.join(__dirname, '../public/data/Photos');
const OUTPUT_FILE = path.join(__dirname, '../public/data/photo-index.json');

async function generatePhotoIndex() {
  console.log('Generating photo index...');
  
  try {
    const imageFiles = fs.readdirSync(PHOTOS_DIR).filter(file =>
      /\.(jpg|jpeg|png|gif)$/i.test(file)
    );

    console.log(`Found ${imageFiles.length} images`);

    const photos = await Promise.all(
      imageFiles.slice(0, 50).map(async (file) => {
        const filePath = path.join(PHOTOS_DIR, file);
        const fileBuffer = fs.readFileSync(filePath);
        let exif = {};
        
        try {
          exif = await exifr.parse(fileBuffer, { 
            iptc: true, 
            exif: true, 
            gps: true,
            xmp: true 
          });
        } catch (e) {
          console.warn(`Could not parse EXIF for ${file}:`, e.message);
        }

        // Get image dimensions - use ExifImageWidth/Height or default values
        const width = exif?.ExifImageWidth || exif?.ImageWidth || 800;
        const height = exif?.ExifImageHeight || exif?.ImageHeight || 600;
        
        // Extract tags - try multiple possible fields
        let tags = exif?.Keywords || exif?.keywords || exif?.subject || [];
        if (!Array.isArray(tags)) {
          tags = tags ? [tags] : [];
        }
        
        // Extract location
        const location = exif?.location || exif?.LocationName || exif?.City || null;
        
        // Extract date
        const date = exif?.DateTimeOriginal || exif?.CreateDate || null;

        return {
          src: `/data/Photos/${file}`,
          width,
          height,
          alt: exif?.ImageDescription || file,
          tags,
          location,
          date: date ? new Date(date).toISOString() : null,
        };
      })
    );

    // Sort photos by date (newest first)
    photos.sort((a, b) => {
      if (!a.date && !b.date) return 0;
      if (!a.date) return 1;
      if (!b.date) return -1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    // Write the index file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(photos, null, 2));
    console.log(`Photo index generated with ${photos.length} photos at ${OUTPUT_FILE}`);

    // Log some statistics
    const tagsSet = new Set();
    const locationsSet = new Set();
    photos.forEach(photo => {
      photo.tags?.forEach(tag => tagsSet.add(tag));
      if (photo.location) locationsSet.add(photo.location);
    });
    
    console.log(`Unique tags: ${tagsSet.size}`);
    console.log(`Unique locations: ${locationsSet.size}`);
    
  } catch (error) {
    console.error('Error generating photo index:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  generatePhotoIndex();
}

module.exports = { generatePhotoIndex };