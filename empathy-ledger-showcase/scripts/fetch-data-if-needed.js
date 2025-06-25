#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Check if essential data files exist
const dataDir = path.join(process.cwd(), 'public', 'data');
const requiredFiles = [
  'stories.json',
  'storytellers.json', 
  'themes.json',
  'analytics.json'
];

const allFilesExist = requiredFiles.every(file => {
  const filePath = path.join(dataDir, file);
  return fs.existsSync(filePath);
});

if (allFilesExist) {
  console.log('✅ All required data files already exist, skipping fetch');
  process.exit(0);
} else {
  console.log('❌ Some data files missing, would need to fetch from Airtable');
  console.log('But no API key provided - using existing data files');
  
  // Check if we have any data files at all
  if (fs.existsSync(dataDir)) {
    const existingFiles = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));
    if (existingFiles.length > 0) {
      console.log(`Found ${existingFiles.length} existing data files, proceeding with build`);
      process.exit(0);
    }
  }
  
  console.log('No data files found at all - build may fail');
  process.exit(1);
}