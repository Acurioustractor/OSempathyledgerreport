#!/usr/bin/env node

/**
 * STEP 2: Optimize photos while preserving the extracted metadata
 * This creates smaller optimized images and maps the real metadata to them
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const PHOTOS_DIR = path.join(__dirname, '../public/data/Photos-original');
const METADATA_BACKUP = path.join(__dirname, '../public/data/original-photo-metadata.json');
const OPTIMIZED_DIR = path.join(__dirname, '../public/data/Photos');
const PHOTO_INDEX_OUTPUT = path.join(__dirname, '../public/data/photo-index.json');

const MAX_WIDTH = 1200;
const QUALITY = 85;

async function optimizeWithMetadataPreservation() {
  console.log('🔧 Optimizing photos while preserving real metadata...');
  
  try {
    // Load the extracted metadata
    if (!fs.existsSync(METADATA_BACKUP)) {
      console.error('❌ Metadata backup not found! Run extract-and-preserve-metadata.js first.');
      process.exit(1);
    }
    
    const metadataMap = JSON.parse(fs.readFileSync(METADATA_BACKUP, 'utf8'));
    console.log(`📋 Loaded metadata for ${Object.keys(metadataMap).length} photos`);
    
    // Create optimized directory
    if (!fs.existsSync(OPTIMIZED_DIR)) {
      fs.mkdirSync(OPTIMIZED_DIR, { recursive: true });
    }
    
    const photoIndex = [];
    let processed = 0;
    const total = Object.keys(metadataMap).length;
    
    for (const [filename, metadata] of Object.entries(metadataMap)) {
      const originalPath = path.join(PHOTOS_DIR, filename);
      const optimizedPath = path.join(OPTIMIZED_DIR, filename.replace(/\.[^.]+$/, '.jpg'));
      
      if (!fs.existsSync(originalPath)) {
        console.log(`⚠️  Original file not found: ${filename}`);
        continue;
      }
      
      try {
        // Optimize the image
        await sharp(originalPath)
          .resize(MAX_WIDTH, null, {
            withoutEnlargement: true,
            fit: 'inside'
          })
          .jpeg({ quality: QUALITY, progressive: true })
          .toFile(optimizedPath);
        
        // Extract meaningful data from metadata
        const photoData = {
          src: `/data/Photos/${path.basename(optimizedPath)}`,
          width: Math.min(metadata.width || 800, MAX_WIDTH),
          height: metadata.height ? Math.round((metadata.height * Math.min(metadata.width || 800, MAX_WIDTH)) / (metadata.width || 800)) : 600,
          alt: metadata.title || metadata.description || filename,
          
          // Real dates from EXIF
          date: metadata.dateTimeOriginal || metadata.createDate || metadata.dateTime || null,
          
          // Real tags from EXIF
          tags: metadata.keywords || [],
          
          // Real location from GPS and IPTC
          location: extractLocationString(metadata),
          
          // GPS coordinates if available
          gps: metadata.gps?.latitude ? {
            lat: metadata.gps.latitude,
            lng: metadata.gps.longitude,
            alt: metadata.gps.altitude
          } : null,
          
          // Camera info
          camera: metadata.camera?.make && metadata.camera?.model ? 
            `${metadata.camera.make} ${metadata.camera.model}` : null,
          
          // Original filename for reference
          originalFilename: filename
        };
        
        photoIndex.push(photoData);
        processed++;
        
        const locationStr = photoData.location || 'Unknown';
        const tagsStr = photoData.tags.length > 0 ? photoData.tags.join(', ') : 'No tags';
        console.log(`✅ ${processed}/${total} ${filename} -> ${locationStr} | ${tagsStr}`);
        
      } catch (error) {
        console.error(`💥 Error optimizing ${filename}:`, error.message);
      }
    }
    
    // Sort by date (newest first)
    photoIndex.sort((a, b) => {
      if (!a.date && !b.date) return 0;
      if (!a.date) return 1;
      if (!b.date) return -1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    
    // Write the photo index
    fs.writeFileSync(PHOTO_INDEX_OUTPUT, JSON.stringify(photoIndex, null, 2));
    
    // Generate statistics
    const stats = generateStats(photoIndex);
    
    console.log(`\n🎉 OPTIMIZATION COMPLETE!`);
    console.log(`   📸 Processed: ${processed} photos`);
    console.log(`   📅 With dates: ${stats.withDates}`);
    console.log(`   📍 With GPS: ${stats.withGPS}`);
    console.log(`   🏷️  With tags: ${stats.withTags}`);
    console.log(`   🌍 With locations: ${stats.withLocations}`);
    console.log(`   📋 Photo index: ${PHOTO_INDEX_OUTPUT}`);
    console.log(`   🗂️  Optimized photos: ${OPTIMIZED_DIR}`);
    
    if (stats.uniqueTags.length > 0) {
      console.log(`\n🏷️  REAL TAGS FOUND: ${stats.uniqueTags.join(', ')}`);
    }
    if (stats.uniqueLocations.length > 0) {
      console.log(`🌍 REAL LOCATIONS: ${stats.uniqueLocations.join(', ')}`);
    }
    
    return photoIndex;
    
  } catch (error) {
    console.error('💥 Error optimizing photos:', error);
    process.exit(1);
  }
}

function extractLocationString(metadata) {
  // Try multiple location sources
  if (metadata.location?.city) {
    let location = metadata.location.city;
    if (metadata.location.state) location += `, ${metadata.location.state}`;
    if (metadata.location.country) location += `, ${metadata.location.country}`;
    return location;
  }
  
  if (metadata.location?.location) return metadata.location.location;
  if (metadata.gps?.areaInformation) return metadata.gps.areaInformation;
  
  return null;
}

function generateStats(photoIndex) {
  const withDates = photoIndex.filter(p => p.date).length;
  const withGPS = photoIndex.filter(p => p.gps).length;
  const withTags = photoIndex.filter(p => p.tags.length > 0).length;
  const withLocations = photoIndex.filter(p => p.location).length;
  
  const uniqueTags = [...new Set(photoIndex.flatMap(p => p.tags))];
  const uniqueLocations = [...new Set(photoIndex.map(p => p.location).filter(Boolean))];
  
  return {
    withDates,
    withGPS,
    withTags,
    withLocations,
    uniqueTags,
    uniqueLocations
  };
}

// Run if called directly
if (require.main === module) {
  optimizeWithMetadataPreservation();
}

module.exports = { optimizeWithMetadataPreservation };