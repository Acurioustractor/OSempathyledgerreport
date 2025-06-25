# Quotes System Documentation

## Overview
The quotes system has been implemented with a fallback mechanism that extracts real quotes from interview transcripts when the Airtable Quotes table is not available.

## Implementation Details

### 1. Airtable Fetch Enhancement (`fetch-airtable-data.js`)
- Added Quotes table to the fetch process
- Updated data structure to include quotes in raw data

### 2. Data Processing Enhancement (`data-processing-v4.js`)
- Added quotes lookup in `buildLookups()` method
- Enhanced `processMedia()` to resolve quote IDs to actual text
- Supports multiple potential field names for quote text:
  - `Quote`
  - `Text`  
  - `Content`
  - `Quote Text`

### 3. Fallback Quote Extraction (`extract-quotes-from-transcripts.js`)
- Extracts meaningful quotes directly from interview transcripts
- Intelligent filtering based on:
  - Length (40-200 characters)
  - Meaningful keywords (Orange Sky, volunteer, community, etc.)
  - Excludes interviewer questions and filler words
- Successfully extracted 505 real quotes from existing transcripts

### 4. UI Components
- **StorytellerCard**: Shows first quote or fallback text
- **StorytellerProfile**: Displays up to 3 quotes in styled blockquotes with fallback

## Current Status
✅ **Working Solution**: Real quotes are now visible throughout the application
- Storyteller cards show actual quotes from conversations
- Profile pages display multiple quotes with proper formatting
- Fallback gracefully handles cases where quotes aren't available

## Future Enhancements
When Airtable API access is available:
1. Run `npm run fetch-data` to pull the actual Quotes table
2. The existing infrastructure will automatically use the real quote records
3. The transcript extraction can be used as a backup for any missing quotes

## Testing
- 88 storytellers now have real extracted quotes
- Quotes are contextually relevant and properly formatted
- UI adapts automatically between real quotes and fallback content