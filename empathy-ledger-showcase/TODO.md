# TODO - Small Fixes and Improvements

## High Priority Fixes

### 1. Fix Theme Names
- [x] Currently showing "Unnamed Theme" in analysis and story pages
- [x] Need to check Airtable Theme table structure
- [x] Update data-processing-v3.js to correctly map theme names
- [x] Added theme categorization system (Connection, Support, Journey, etc.)

### 2. Add Profile Images to Storyteller Cards
- [ ] Profile images are in the data but not displayed
- [ ] Update StorytellerCard component to show images
- [ ] Add fallback for missing images

### 3. Fix Console Warnings
- [ ] Fix metadata.viewport warning in layout.tsx
- [ ] Fix metadataBase warning for social images

## Medium Priority Improvements

### 4. Enhance Map Interactions
- [ ] Add story count labels on map markers
- [ ] Link map clicks to filter stories by location
- [ ] Add zoom to location on click

### 5. Improve Story Filtering
- [ ] Add theme filter to stories page
- [ ] Add date range filter
- [ ] Save filter state in URL params

### 6. Add Loading States
- [ ] Add skeleton loaders for story cards
- [ ] Add loading spinner for data fetches
- [ ] Improve perceived performance

## Low Priority Enhancements

### 7. Add Story Search
- [ ] Implement full-text search across stories
- [ ] Add search suggestions
- [ ] Highlight search terms in results

### 8. Enhance Analytics Page
- [ ] Add more interactive charts
- [ ] Add data export functionality
- [ ] Add comparison views

### 9. Improve Mobile Experience
- [ ] Optimize map for mobile touch
- [ ] Add swipe gestures for story cards
- [ ] Improve filter UI on mobile

## New Features Added

### Data Visualizations Page
- [x] Created new /visualizations page with 6 innovative visualization types:
  - [x] Theme Network Graph - Shows relationships between themes
  - [x] Quote Cloud - Interactive word cloud from 600+ quotes with sentiment analysis
  - [x] Journey Maps - Visual storyteller journeys showing theme evolution
  - [x] Demographic Flow - Sankey diagram showing role→theme→outcome flows
  - [x] Temporal Heatmap - Theme prevalence over time and locations
  - [x] Connection Web - How stories connect through shared themes
- [x] Added theme categorization (Connection, Support, Journey, Dignity, Hope, Challenge, Impact)
- [x] Enhanced data processing pipeline with quote analytics
- [x] Added export options for research data

## Documentation

### 10. Complete Wiki Content
- [ ] Add more wiki pages (ethics, setup, etc.)
- [ ] Add code examples
- [ ] Add video tutorials section

## Performance

### 11. Optimize Build
- [ ] Implement image optimization
- [ ] Add lazy loading for images
- [ ] Minimize bundle size

### 12. Add Caching
- [ ] Implement service worker for offline support
- [ ] Add browser caching headers
- [ ] Cache API responses