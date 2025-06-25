#!/usr/bin/env node

const exifr = require('exifr');
const fs = require('fs');
const path = require('path');

async function searchForCityNames() {
  const photosDir = path.join(__dirname, '../public/data/Photos-original');
  const files = fs.readdirSync(photosDir).filter(f => f.endsWith('.jpg'));
  
  console.log('🔍 Searching for city names like Adelaide, Hobart in all EXIF fields...');
  
  for (const file of files) {
    console.log(`\n📸 ${file}:`);
    try {
      const exif = await exifr.parse(`${photosDir}/${file}`, {
        iptc: true, exif: true, gps: true, xmp: true, 
        translateKeys: true, mergeOutput: true
      });
      
      // Check specific location fields first
      const locationFields = [
        'City', 'State', 'Country', 'Location', 'LocationName',
        'GPSAreaInformation', 'LocationCreatedCity', 'LocationShownCity',
        'Province', 'CountryCode', 'Region', 'Place', 'Area'
      ];
      
      let foundLocation = false;
      locationFields.forEach(field => {
        if (exif[field]) {
          console.log(`  📍 ${field}: ${exif[field]}`);
          foundLocation = true;
        }
      });
      
      // Also search in all string fields for Australian cities
      const cities = ['adelaide', 'hobart', 'melbourne', 'sydney', 'perth', 'brisbane', 'darwin', 'canberra'];
      
      function searchInObject(obj, prefix = '') {
        for (const [key, value] of Object.entries(obj || {})) {
          if (typeof value === 'string') {
            const lowerValue = value.toLowerCase();
            for (const city of cities) {
              if (lowerValue.includes(city)) {
                console.log(`  🏙️ Found city in ${prefix}${key}: ${value}`);
                foundLocation = true;
              }
            }
          } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            searchInObject(value, `${prefix}${key}.`);
          }
        }
      }
      
      searchInObject(exif);
      
      if (!foundLocation) {
        console.log('  ❌ No location data found');
      }
      
    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`);
    }
  }
}

searchForCityNames();