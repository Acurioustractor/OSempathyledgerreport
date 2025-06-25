#!/usr/bin/env node

const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const PHOTOS_DIR = path.join(process.cwd(), 'public/data/Photos');
const OPTIMIZED_DIR = path.join(process.cwd(), 'public/data/photos-optimized');
const MAX_WIDTH = 1200;
const QUALITY = 85;

async function optimizeImages() {
  try {
    // Create optimized directory
    await fs.mkdir(OPTIMIZED_DIR, { recursive: true });
    
    // Get all image files
    const files = await fs.readdir(PHOTOS_DIR);
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png|webp)$/i.test(file)
    );
    
    console.log(`Found ${imageFiles.length} images to optimize`);
    
    let totalOriginalSize = 0;
    let totalOptimizedSize = 0;
    
    // Process each image
    for (const [index, file] of imageFiles.entries()) {
      const inputPath = path.join(PHOTOS_DIR, file);
      const outputPath = path.join(OPTIMIZED_DIR, file);
      
      // Get original file size
      const originalStats = await fs.stat(inputPath);
      totalOriginalSize += originalStats.size;
      
      // Optimize image
      await sharp(inputPath)
        .resize(MAX_WIDTH, null, {
          withoutEnlargement: true,
          fit: 'inside'
        })
        .jpeg({ quality: QUALITY, progressive: true })
        .toFile(outputPath.replace(/\.[^.]+$/, '.jpg'));
      
      // Get optimized file size
      const optimizedStats = await fs.stat(outputPath.replace(/\.[^.]+$/, '.jpg'));
      totalOptimizedSize += optimizedStats.size;
      
      if ((index + 1) % 10 === 0) {
        console.log(`Processed ${index + 1}/${imageFiles.length} images...`);
      }
    }
    
    // Report results
    const savedMB = ((totalOriginalSize - totalOptimizedSize) / 1024 / 1024).toFixed(2);
    const compressionRatio = ((1 - totalOptimizedSize / totalOriginalSize) * 100).toFixed(1);
    
    console.log('\n✅ Image optimization complete!');
    console.log(`Original size: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Optimized size: ${(totalOptimizedSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Saved: ${savedMB} MB (${compressionRatio}% reduction)`);
    
  } catch (error) {
    console.error('Error optimizing images:', error);
    process.exit(1);
  }
}

// Check if sharp is installed
async function checkDependencies() {
  try {
    require('sharp');
  } catch (error) {
    console.log('Installing sharp for image optimization...');
    const { execSync } = require('child_process');
    execSync('npm install sharp', { stdio: 'inherit' });
  }
}

// Run the script
(async () => {
  await checkDependencies();
  await optimizeImages();
})();