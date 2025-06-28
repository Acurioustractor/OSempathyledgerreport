#!/usr/bin/env node

/**
 * Downloads all images from Airtable URLs and stores them locally
 * This prevents issues with Airtable signed URLs expiring
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');

// Paths
const dataDir = path.join(__dirname, '../public/data');
const imagesDir = path.join(__dirname, '../public/images');
const storytellersImagesDir = path.join(imagesDir, 'storytellers');
const storiesImagesDir = path.join(imagesDir, 'stories');

// Create directories if they don't exist
[imagesDir, storytellersImagesDir, storiesImagesDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Download function with retry logic
async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    if (!url) {
      reject(new Error('No URL provided'));
      return;
    }

    const file = fs.createWriteStream(filepath);
    let attempts = 0;
    const maxAttempts = 3;

    const attemptDownload = () => {
      attempts++;
      https.get(url, (response) => {
        if (response.statusCode === 200) {
          response.pipe(file);
          file.on('finish', () => {
            file.close();
            resolve(filepath);
          });
        } else if (response.statusCode === 302 || response.statusCode === 301) {
          // Handle redirects
          file.close();
          fs.unlinkSync(filepath);
          downloadImage(response.headers.location, filepath)
            .then(resolve)
            .catch(reject);
        } else {
          file.close();
          // Only try to unlink if file exists
          if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
          }
          if (response.statusCode === 410) {
            // URL expired, don't retry
            reject(new Error(`URL expired (410 Gone)`));
          } else if (attempts < maxAttempts) {
            console.log(`  ⚠️  Retry ${attempts}/${maxAttempts} for ${path.basename(filepath)}`);
            setTimeout(attemptDownload, 1000 * attempts);
          } else {
            reject(new Error(`Failed to download: ${response.statusCode}`));
          }
        }
      }).on('error', (err) => {
        file.close();
        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath);
        }
        if (attempts < maxAttempts) {
          console.log(`  ⚠️  Retry ${attempts}/${maxAttempts} for ${path.basename(filepath)}`);
          setTimeout(attemptDownload, 1000 * attempts);
        } else {
          reject(err);
        }
      });
    };

    attemptDownload();
  });
}

// Generate a stable filename from URL
function getFilenameFromUrl(url, prefix) {
  const urlHash = crypto.createHash('md5').update(url).digest('hex').substring(0, 8);
  const extension = '.jpg'; // Default to jpg, Airtable usually serves images as jpg
  return `${prefix}_${urlHash}${extension}`;
}

async function processImages() {
  console.log('🖼️  Starting image download process...\n');

  let totalDownloaded = 0;
  let totalFailed = 0;

  try {
    // Process storytellers
    console.log('👥 Processing storyteller images...');
    const storytellersData = JSON.parse(fs.readFileSync(path.join(dataDir, 'storytellers.json'), 'utf8'));
    
    for (const storyteller of storytellersData) {
      if (storyteller.profileImage) {
        const filename = getFilenameFromUrl(storyteller.profileImage, `storyteller_${storyteller.id}`);
        const filepath = path.join(storytellersImagesDir, filename);
        
        // Skip if already downloaded
        if (fs.existsSync(filepath)) {
          console.log(`  ✓ Already exists: ${filename}`);
          storyteller.localProfileImage = `/images/storytellers/${filename}`;
          continue;
        }

        try {
          console.log(`  📥 Downloading: ${storyteller.storytellerNames?.[0] || storyteller.id}...`);
          await downloadImage(storyteller.profileImage, filepath);
          storyteller.localProfileImage = `/images/storytellers/${filename}`;
          totalDownloaded++;
          console.log(`  ✅ Saved: ${filename}`);
        } catch (error) {
          console.error(`  ❌ Failed: ${storyteller.storytellerNames?.[0] || storyteller.id} - ${error.message}`);
          totalFailed++;
        }
      }
    }

    // Save updated storytellers data with local image paths
    fs.writeFileSync(
      path.join(dataDir, 'storytellers.json'),
      JSON.stringify(storytellersData, null, 2)
    );

    // Process stories
    console.log('\n📚 Processing story images...');
    const storiesData = JSON.parse(fs.readFileSync(path.join(dataDir, 'stories.json'), 'utf8'));
    
    for (const story of storiesData) {
      // Process story image
      if (story.image?.url) {
        const filename = getFilenameFromUrl(story.image.url, `story_${story.id}`);
        const filepath = path.join(storiesImagesDir, filename);
        
        // Skip if already downloaded
        if (fs.existsSync(filepath)) {
          console.log(`  ✓ Already exists: ${filename}`);
          story.localImage = { url: `/images/stories/${filename}` };
          continue;
        }

        try {
          console.log(`  📥 Downloading story image: ${story.title || story.id}...`);
          await downloadImage(story.image.url, filepath);
          story.localImage = { url: `/images/stories/${filename}` };
          totalDownloaded++;
          console.log(`  ✅ Saved: ${filename}`);
        } catch (error) {
          console.error(`  ❌ Failed: ${story.title || story.id} - ${error.message}`);
          totalFailed++;
        }
      }

      // Also download profileImage if it exists and no story image
      if (!story.image?.url && story.profileImage) {
        const filename = getFilenameFromUrl(story.profileImage, `story_profile_${story.id}`);
        const filepath = path.join(storiesImagesDir, filename);
        
        if (fs.existsSync(filepath)) {
          console.log(`  ✓ Already exists: ${filename}`);
          story.localProfileImage = `/images/stories/${filename}`;
          continue;
        }

        try {
          console.log(`  📥 Downloading profile image for story: ${story.title || story.id}...`);
          await downloadImage(story.profileImage, filepath);
          story.localProfileImage = `/images/stories/${filename}`;
          totalDownloaded++;
          console.log(`  ✅ Saved: ${filename}`);
        } catch (error) {
          console.error(`  ❌ Failed: ${story.title || story.id} - ${error.message}`);
          totalFailed++;
        }
      }
    }

    // Save updated stories data with local image paths
    fs.writeFileSync(
      path.join(dataDir, 'stories.json'),
      JSON.stringify(storiesData, null, 2)
    );

    // Process media
    console.log('\n📸 Processing media images...');
    const mediaData = JSON.parse(fs.readFileSync(path.join(dataDir, 'media.json'), 'utf8'));
    
    for (const media of mediaData) {
      if (media.url && media.type === 'Photo') {
        const filename = getFilenameFromUrl(media.url, `media_${media.id}`);
        const filepath = path.join(imagesDir, 'media', filename);
        
        // Create media directory if it doesn't exist
        const mediaDir = path.join(imagesDir, 'media');
        if (!fs.existsSync(mediaDir)) {
          fs.mkdirSync(mediaDir, { recursive: true });
        }

        // Skip if already downloaded
        if (fs.existsSync(filepath)) {
          console.log(`  ✓ Already exists: ${filename}`);
          media.localUrl = `/images/media/${filename}`;
          continue;
        }

        try {
          console.log(`  📥 Downloading media: ${media.id}...`);
          await downloadImage(media.url, filepath);
          media.localUrl = `/images/media/${filename}`;
          totalDownloaded++;
          console.log(`  ✅ Saved: ${filename}`);
        } catch (error) {
          console.error(`  ❌ Failed: ${media.id} - ${error.message}`);
          totalFailed++;
        }
      }
    }

    // Save updated media data
    fs.writeFileSync(
      path.join(dataDir, 'media.json'),
      JSON.stringify(mediaData, null, 2)
    );

    console.log('\n✅ Image download complete!');
    console.log(`📊 Summary:`);
    console.log(`  - Downloaded: ${totalDownloaded} images`);
    console.log(`  - Failed: ${totalFailed} images`);
    console.log(`  - Local images stored in: public/images/`);
    
    console.log('\n💡 Next steps:');
    console.log('  1. Update your components to use localImage/localProfileImage fields');
    console.log('  2. Fallback to original URLs if local images are not available');
    console.log('  3. Run this script periodically or after each data fetch');

  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run the process
processImages();