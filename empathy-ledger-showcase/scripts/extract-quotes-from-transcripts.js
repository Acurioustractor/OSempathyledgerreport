#!/usr/bin/env node

/**
 * Extract meaningful quotes from existing transcripts
 * This is a temporary solution until we can fetch the proper Quotes table
 */

const fs = require('fs');
const path = require('path');

function extractQuotesFromTranscript(transcript, storytellerName) {
  if (!transcript || typeof transcript !== 'string') return [];
  
  const quotes = [];
  
  // Split by speaker and find the storyteller's responses
  const sections = transcript.split(/\*\*Speaker \d+:\*\*/);
  
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i].trim();
    
    // Skip very short responses
    if (section.length < 50) continue;
    
    // Clean up the text
    let cleanText = section
      .replace(/\\n/g, ' ')
      .replace(/\[00:\d+:\d+\]/g, '') // Remove timestamps
      .replace(/Mm-hmm\.|Um,|Uh,|Yeah\.|So\.|Well,/g, '') // Remove filler words
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
    
    // Look for meaningful sentences (not questions from interviewer)
    const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 30);
    
    for (const sentence of sentences) {
      const trimmed = sentence.trim();
      
      // Skip if it's clearly a question or interviewer prompt
      if (trimmed.includes('tell us') || trimmed.includes('what do you')) continue;
      
      // Look for meaningful content keywords
      const meaningfulKeywords = [
        'orange sky', 'volunteer', 'community', 'help', 'people', 'experience',
        'important', 'good', 'great', 'challenge', 'support', 'impact',
        'connection', 'dignity', 'respect', 'hope', 'change', 'difference'
      ];
      
      const hasKeywords = meaningfulKeywords.some(keyword => 
        trimmed.toLowerCase().includes(keyword)
      );
      
      if (hasKeywords && trimmed.length > 40 && trimmed.length < 200) {
        quotes.push(trimmed);
      }
    }
  }
  
  // Return up to 5 best quotes
  return quotes.slice(0, 5);
}

async function processTranscriptsForQuotes() {
  console.log('🎤 Extracting quotes from transcripts...\n');
  
  try {
    // Load raw data
    const rawDataPath = path.join(__dirname, '../public/data/raw-airtable-data.json');
    const rawData = JSON.parse(fs.readFileSync(rawDataPath, 'utf8'));
    
    // Load existing storytellers data
    const storytellersPath = path.join(__dirname, '../public/data/storytellers.json');
    const storytellers = JSON.parse(fs.readFileSync(storytellersPath, 'utf8'));
    
    let totalQuotesExtracted = 0;
    
    // Process each storyteller
    storytellers.forEach(storyteller => {
      if (!storyteller.quotes || storyteller.quotes.every(q => q.startsWith('rec'))) {
        // Find media records for this storyteller
        const storytellerMedia = rawData.media.records.filter(media => 
          media.fields.Storytellers && media.fields.Storytellers.includes(storyteller.id)
        );
        
        const extractedQuotes = [];
        
        storytellerMedia.forEach(media => {
          if (media.fields.Transcript) {
            const quotes = extractQuotesFromTranscript(
              media.fields.Transcript, 
              storyteller.name
            );
            extractedQuotes.push(...quotes);
          }
        });
        
        if (extractedQuotes.length > 0) {
          storyteller.quotes = extractedQuotes;
          totalQuotesExtracted += extractedQuotes.length;
          console.log(`✓ Extracted ${extractedQuotes.length} quotes for ${storyteller.name}`);
        }
      }
    });
    
    // Save updated storytellers data
    fs.writeFileSync(storytellersPath, JSON.stringify(storytellers, null, 2));
    
    console.log(`\n✅ Successfully extracted ${totalQuotesExtracted} quotes from transcripts`);
    console.log('Updated storytellers.json with extracted quotes');
    
  } catch (error) {
    console.error('❌ Error extracting quotes:', error.message);
  }
}

// Run if called directly
if (require.main === module) {
  processTranscriptsForQuotes();
}

module.exports = { processTranscriptsForQuotes, extractQuotesFromTranscript };