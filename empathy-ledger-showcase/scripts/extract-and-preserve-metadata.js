#!/usr/bin/env node

/**
 * STEP 1: Extract REAL metadata from original photos BEFORE optimization
 * This preserves the actual EXIF data including GPS, dates, tags, etc.
 */

const fs = require('fs');
const path = require('path');
const exifr = require('exifr');

const PHOTOS_DIR = path.join(__dirname, '../public/data/Photos-original');
const METADATA_BACKUP = path.join(__dirname, '../public/data/original-photo-metadata.json');

async function extractRealMetadata() {
  console.log('🔍 Extracting REAL metadata from original photos...');
  
  try {
    const imageFiles = fs.readdirSync(PHOTOS_DIR).filter(file =>
      /\.(jpg|jpeg|png|gif)$/i.test(file)
    );

    console.log(`📸 Found ${imageFiles.length} original images`);
    
    const metadataMap = {};
    
    for (const file of imageFiles) {
      const filePath = path.join(PHOTOS_DIR, file);
      console.log(`📋 Processing: ${file}`);
      
      try {
        // Extract ALL possible metadata
        const exif = await exifr.parse(filePath, {
          // Enable ALL metadata extraction
          iptc: true,
          exif: true, 
          gps: true,
          xmp: true,
          icc: true,
          jfif: true,
          ihdr: true,
          tiff: true,
          ifd0: true,
          ifd1: true,
          translateKeys: true,
          translateValues: true,
          reviveValues: true,
          sanitize: false,
          mergeOutput: true
        });

        if (exif) {
          // Extract comprehensive metadata
          const metadata = {
            filename: file,
            // Dates
            dateTimeOriginal: exif.DateTimeOriginal,
            createDate: exif.CreateDate,
            dateTime: exif.DateTime,
            dateTimeDigitized: exif.DateTimeDigitized,
            modifyDate: exif.ModifyDate,
            
            // GPS Location
            gps: {
              latitude: exif.latitude,
              longitude: exif.longitude,
              altitude: exif.GPSAltitude,
              latitudeRef: exif.GPSLatitudeRef,
              longitudeRef: exif.GPSLongitudeRef,
              areaInformation: exif.GPSAreaInformation
            },
            
            // IPTC Keywords/Tags
            keywords: Array.isArray(exif.Keywords) ? exif.Keywords : 
                     Array.isArray(exif.keywords) ? exif.keywords :
                     Array.isArray(exif.Subject) ? exif.Subject :
                     (exif.Keywords || exif.keywords || exif.Subject) ? [exif.Keywords || exif.keywords || exif.Subject] : [],
            title: exif.Title || exif.ObjectName,
            description: exif.ImageDescription || exif.Caption,
            
            // Location data from IPTC
            location: {
              city: exif.City || exif.LocationCreatedCity || exif.LocationShownCity,
              state: exif.State || exif.Province || exif.LocationCreatedState,
              country: exif.Country || exif.LocationCreatedCountry,
              countryCode: exif.CountryCode,
              location: exif.Location || exif.LocationName
            },
            
            // Camera info
            camera: {
              make: exif.Make,
              model: exif.Model,
              lens: exif.LensModel,
              software: exif.Software
            },
            
            // Image dimensions
            width: exif.ExifImageWidth || exif.ImageWidth,
            height: exif.ExifImageHeight || exif.ImageHeight,
            
            // Full EXIF dump for debugging
            fullExif: exif
          };
          
          metadataMap[file] = metadata;
          
          // Log what we found
          console.log(`  ✅ ${file}:`);
          if (metadata.dateTimeOriginal) console.log(`     📅 Date: ${metadata.dateTimeOriginal}`);
          if (metadata.gps.latitude) console.log(`     📍 GPS: ${metadata.gps.latitude}, ${metadata.gps.longitude}`);
          if (metadata.keywords && Array.isArray(metadata.keywords) && metadata.keywords.length > 0) {
            console.log(`     🏷️  Tags: ${metadata.keywords.join(', ')}`);
          }
          if (metadata.location.city) console.log(`     🌍 Location: ${metadata.location.city}, ${metadata.location.state}`);
          
        } else {
          console.log(`  ❌ No EXIF data found in ${file}`);
          metadataMap[file] = { filename: file, error: 'No EXIF data' };
        }
        
      } catch (error) {
        console.error(`  💥 Error processing ${file}:`, error.message);
        metadataMap[file] = { filename: file, error: error.message };
      }
    }
    
    // Save the extracted metadata
    fs.writeFileSync(METADATA_BACKUP, JSON.stringify(metadataMap, null, 2));
    console.log(`\n💾 Metadata backup saved to: ${METADATA_BACKUP}`);
    
    // Statistics
    const withGPS = Object.values(metadataMap).filter(m => m.gps?.latitude).length;
    const withKeywords = Object.values(metadataMap).filter(m => Array.isArray(m.keywords) && m.keywords.length > 0).length;
    const withDates = Object.values(metadataMap).filter(m => m.dateTimeOriginal).length;
    const withLocation = Object.values(metadataMap).filter(m => m.location?.city).length;
    
    console.log(`\n📊 METADATA EXTRACTION RESULTS:`);
    console.log(`   📸 Total photos: ${imageFiles.length}`);
    console.log(`   📅 With dates: ${withDates}`);
    console.log(`   📍 With GPS: ${withGPS}`);
    console.log(`   🏷️  With tags/keywords: ${withKeywords}`);
    console.log(`   🌍 With location names: ${withLocation}`);
    
    return metadataMap;
    
  } catch (error) {
    console.error('💥 Error extracting metadata:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  extractRealMetadata();
}

module.exports = { extractRealMetadata };